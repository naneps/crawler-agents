import prisma from './prisma';

// CRUD operations: Sources
export const getAllSources = async () => {
  return await prisma.source.findMany({
    orderBy: { name: 'asc' }
  });
};

export const getSourceById = async (id: string) => {
  return await prisma.source.findUnique({
    where: { id }
  });
};

export const upsertSource = async (id: string, name: string, baseUrl: string, categories: any, selectors: any) => {
  return await prisma.source.upsert({
    where: { id },
    update: { name, baseUrl, categories, selectors },
    create: { id, name, baseUrl, categories, selectors }
  });
};

export const deleteSource = async (id: string) => {
  return await prisma.source.delete({
    where: { id }
  });
};

// User Operations
export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      subscriptions: {
        where: { status: 'active' },
        include: { plan: true }
      }
    }
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      subscriptions: {
        where: { status: 'active' },
        include: { plan: true }
      }
    }
  });
};

export const getUserByApiKey = async (apiKey: string) => {
  return await prisma.user.findUnique({
    where: { apiKey },
    include: {
      subscriptions: {
        where: { status: 'active' },
        include: { plan: true }
      }
    }
  });
};

export const createUser = async (id: string, username: string, hashedPassword: string | null, apiKey: string | null, role: any = 'user') => {
  return await prisma.$transaction(async (tx: any) => {
    const user = await tx.user.create({
      data: {
        id,
        username,
        password: hashedPassword,
        apiKey,
        role
      }
    });

    // Default to free plan
    const freePlan = await tx.plan.findUnique({ where: { name: 'free' } });
    if (freePlan) {
      await tx.subscription.create({
        data: {
          userId: user.id,
          planId: freePlan.id,
          status: 'active'
        }
      });
    }
    return user;
  });
};

export const updateApiKey = async (userId: string, newApiKey: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { apiKey: newApiKey }
  });
};

export const promoteUserToAdmin = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: 'admin' }
  });
};

export const updateUserId = async (oldId: string, newId: string) => {
  return await prisma.$executeRaw`UPDATE users SET id = ${newId} WHERE id = ${oldId}`;
};

// Multi-API Key Operations
export const getUserApiKeys = async (userId: string) => {
  return await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const createApiKey = async (userId: string, name: string, key: string) => {
  return await prisma.apiKey.create({
    data: {
      userId,
      name,
      keyValue: key
    }
  });
};

export const deleteApiKey = async (userId: string, keyId: number) => {
  return await prisma.apiKey.delete({
    where: { id: keyId, userId }
  });
};

export const getApiKeyByKey = async (key: string) => {
  return await prisma.apiKey.findUnique({
    where: { keyValue: key, isActive: true },
    include: {
      user: {
        include: {
          subscriptions: {
            where: { status: 'active' },
            include: { plan: true }
          }
        }
      }
    }
  });
};

// API Logging & Stats
export const logApiRequest = async (keyId: number, endpoint: string, method: string, statusCode: number, responseTime: number, ip: string | null) => {
  return await prisma.apiLog.create({
    data: {
      keyId,
      endpoint,
      method,
      statusCode,
      responseTime,
      ipAddress: ip
    }
  });
};

export const getApiKeyStats = async (userId: string) => {
  const keys = await prisma.apiKey.findMany({
    where: { userId },
    include: {
      _count: {
        select: { logs: true }
      },
      logs: {
        select: { responseTime: true, statusCode: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return keys.map((k: any) => {
    const totalHits = k._count.logs;
    const errorCount = k.logs.filter((l: any) => l.statusCode >= 400).length;
    const avgLatency = totalHits > 0 
      ? k.logs.reduce((acc: any, l: any) => acc + l.responseTime, 0) / totalHits 
      : 0;

    return {
      id: k.id,
      name: k.name,
      key_value: k.keyValue,
      created_at: k.createdAt,
      total_hits: totalHits,
      avg_latency: avgLatency,
      error_count: errorCount
    };
  });
};

export const getApiKeyLogs = async (userId: string, keyId: number, limit = 50) => {
  return await prisma.apiLog.findMany({
    where: {
      keyId,
      apiKey: { userId }
    },
    orderBy: { timestamp: 'desc' },
    take: limit
  });
};

// Quota helpers
export const getTodayUserRequestCount = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.apiLog.count({
    where: {
      apiKey: { userId },
      timestamp: { gte: today }
    }
  });
};

export const getUserPlan = async (userId: string) => {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
    include: { plan: true },
    orderBy: { createdAt: 'desc' }
  });
  return sub?.plan?.name || 'free';
};

export const setUserPlan = async (userId: string, planName: string) => {
  return await prisma.$transaction(async (tx: any) => {
    // 1. Deactivate current subscriptions
    await tx.subscription.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'expired', endDate: new Date() }
    });

    // 2. Find new plan
    const plan = await tx.plan.findUnique({ where: { name: planName } });
    if (!plan) throw new Error(`Plan ${planName} not found`);

    // 3. Create new subscription
    return await tx.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: 'active'
      }
    });
  });
};

export const getGlobalStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalKeys = await prisma.apiKey.count();
  const totalLogs = await prisma.apiLog.count();
  const totalSources = await prisma.source.count();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activity = await prisma.$queryRaw`
    SELECT DATE(timestamp) as date, COUNT(*) as hits 
    FROM api_logs 
    WHERE timestamp > ${sevenDaysAgo}
    GROUP BY DATE(timestamp)
    ORDER BY date ASC
  `;

  return {
    totalUsers,
    totalKeys,
    totalLogs,
    totalSources,
    activity
  };
};

// Admin: User Management
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      subscriptions: {
        where: { status: 'active' },
        include: { plan: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Admin: Plan Management
export const getAllPlans = async () => {
  return await prisma.plan.findMany({
    orderBy: { price: 'asc' }
  });
};

export const upsertPlan = async (id: number | null, data: any) => {
  if (id) {
    return await prisma.plan.update({
      where: { id: id },
      data: {
        name: data.name,
        price: data.price,
        maxRequestsDay: data.maxRequestsDay,
        features: data.features
      }
    });
  }
  return await prisma.plan.create({
    data: {
      name: data.name,
      price: data.price,
      maxRequestsDay: data.maxRequestsDay,
      features: data.features
    }
  });
};

export const deletePlan = async (id: number) => {
  return await prisma.plan.delete({
    where: { id: id }
  });
};

// Admin: Subscription Management
export const getAllSubscriptions = async () => {
  return await prisma.subscription.findMany({
    include: {
      user: { select: { username: true } },
      plan: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const initDb = async () => {
  console.log('✅ DB initialized (Prisma Managed)');
};

export default {
  initDb,
  getAllSources,
  getSourceById,
  upsertSource,
  deleteSource,
  getUserByUsername,
  getUserById,
  getUserByApiKey,
  createUser,
  updateApiKey,
  getUserApiKeys,
  createApiKey,
  deleteApiKey,
  getApiKeyByKey,
  logApiRequest,
  getApiKeyStats,
  getApiKeyLogs,
  getTodayUserRequestCount,
  getUserPlan,
  setUserPlan,
  getGlobalStats,
  getAllUsers,
  getAllPlans,
  upsertPlan,
  deletePlan,
  getAllSubscriptions,
  promoteUserToAdmin,
  updateUserId
};

