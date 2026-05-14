const prisma = require('./prisma');

module.exports = {
  // Legacy support for scripts that might need the pool, but we should phase it out
  pool: null, 

  async initDb() {
    // No-op with Prisma as we use migrations/db push
    console.log('✅ DB initialized (Prisma Managed)');
  },

  // CRUD operations: Sources
  async getAllSources() {
    return await prisma.source.findMany({
      orderBy: { name: 'asc' }
    });
  },

  async getSourceById(id) {
    return await prisma.source.findUnique({
      where: { id }
    });
  },

  async upsertSource(id, name, baseUrl, categories, selectors) {
    return await prisma.source.upsert({
      where: { id },
      update: { name, baseUrl, categories, selectors },
      create: { id, name, baseUrl, categories, selectors }
    });
  },

  async deleteSource(id) {
    return await prisma.source.delete({
      where: { id }
    });
  },

  // User Operations
  async getUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true }
        }
      }
    });
  },

  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true }
        }
      }
    });
  },

  async getUserByApiKey(apiKey) {
    return await prisma.user.findUnique({
      where: { apiKey },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true }
        }
      }
    });
  },

  async createUser(username, hashedPassword, apiKey, role = 'user') {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
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
  },

  async updateApiKey(userId, newApiKey) {
    return await prisma.user.update({
      where: { id: userId },
      data: { apiKey: newApiKey }
    });
  },

  // Multi-API Key Operations
  async getUserApiKeys(userId) {
    return await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createApiKey(userId, name, key) {
    return await prisma.apiKey.create({
      data: {
        userId,
        name,
        keyValue: key
      }
    });
  },

  async deleteApiKey(userId, keyId) {
    return await prisma.apiKey.delete({
      where: { id: keyId, userId }
    });
  },

  async getApiKeyByKey(key) {
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
  },

  // API Logging & Stats
  async logApiRequest(keyId, endpoint, method, statusCode, responseTime, ip) {
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
  },

  async getApiKeyStats(userId) {
    // Prisma aggregate/group by can be complex for this specific output, 
    // but we can fetch and map or use raw if needed.
    // Let's try to fetch with includes and map.
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

    return keys.map(k => {
      const totalHits = k._count.logs;
      const errorCount = k.logs.filter(l => l.statusCode >= 400).length;
      const avgLatency = totalHits > 0 
        ? k.logs.reduce((acc, l) => acc + l.responseTime, 0) / totalHits 
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
  },

  async getApiKeyLogs(userId, keyId, limit = 50) {
    return await prisma.apiLog.findMany({
      where: {
        keyId,
        apiKey: { userId }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  },

  // Quota helpers
  async getTodayUserRequestCount(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.apiLog.count({
      where: {
        apiKey: { userId },
        timestamp: { gte: today }
      }
    });
  },

  async getUserPlan(userId) {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: 'active' },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });
    return sub?.plan?.name || 'free';
  },

  async setUserPlan(userId, planName) {
    return await prisma.$transaction(async (tx) => {
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
  },

  async getGlobalStats() {
    const totalUsers = await prisma.user.count();
    const totalKeys = await prisma.apiKey.count();
    const totalLogs = await prisma.apiLog.count();
    const totalSources = await prisma.source.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Activity over last 7 days (grouped by date)
    // Prisma's groupBy by Date is tricky in MySQL, we'll use a raw query for this.
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
  },

  // Admin: User Management
  async getAllUsers() {
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
  },

  // Admin: Plan Management
  async getAllPlans() {
    return await prisma.plan.findMany({
      orderBy: { price: 'asc' }
    });
  },

  async upsertPlan(id, data) {
    if (id) {
      return await prisma.plan.update({
        where: { id: parseInt(id) },
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
  },

  async deletePlan(id) {
    return await prisma.plan.delete({
      where: { id: parseInt(id) }
    });
  },

  // Admin: Subscription Management
  async getAllSubscriptions() {
    return await prisma.subscription.findMany({
      include: {
        user: { select: { username: true } },
        plan: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
