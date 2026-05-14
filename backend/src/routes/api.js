const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const newsController = require('../controllers/newsController');
const sourceController = require('../controllers/sourceController');
const apiKeyController = require('../controllers/apiKeyController');
const adminController = require('../controllers/adminController');
const publicController = require('../controllers/publicController');
const { requireAuth, requireAdmin, requireCredential } = require('../middleware/auth');
const quota = require('../middleware/quota');

// ──────────────────────────────────────────
// PUBLIC ROUTES (no auth required)
// ──────────────────────────────────────────
router.get('/public/sources', publicController.getSources);
router.get('/public/sample', publicController.getSample);
router.post('/public/register', publicController.register);

// Auth Routes
router.post('/auth/register', authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 */
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authController.me);

// API Key Management (Multi-Key)
router.get('/user/keys', requireAuth, apiKeyController.getKeys);
router.post('/user/keys', requireAuth, apiKeyController.createKey);
router.delete('/user/keys/:id', requireAuth, apiKeyController.deleteKey);
router.get('/user/keys/:id/logs', requireAuth, apiKeyController.getLogs);

// Legacy single key routes (keeping for UI compat temporarily)
router.get('/user/key', requireAuth, authController.getApiKey);
router.post('/user/key/rotate', requireAuth, authController.rotateApiKey);

/**
 * @swagger
 * /api/news/{source}/{category}:
 *   get:
 *     summary: Fetch News Stream
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: fetchDetail
 *         schema: { type: boolean }
 */
/**
 * @swagger
 * /api/config:
 *   get:
 *     summary: List All Sources & Config
 *     tags: [Discovery]
 *     description: Returns the complete system configuration including all sources and their available categories.
 */
router.get('/config', requireCredential, newsController.getConfig);

/**
 * @swagger
 * /api/news/{source}/categories:
 *   get:
 *     summary: List Source Categories
 *     tags: [Discovery]
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema: { type: string }
 */
router.get('/news/:source/categories', requireCredential, newsController.getSourceConfig);

/**
 * @swagger
 * /api/news/{source}/detail:
 *   get:
 *     summary: Fetch Single Article Detail
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: url
 *         required: true
 *         schema: { type: string }
 */
router.get('/news/:source/detail', requireCredential, newsController.getArticleDetail);

router.get('/news/:source', requireCredential, quota, newsController.getNews);
router.get('/news/:source/:category', requireCredential, quota, newsController.getNews);

// Admin Platform Management
router.get('/admin/stats', requireAdmin, adminController.getStats);
router.get('/admin/users', requireAdmin, adminController.getUsers);

router.get('/sources', requireAdmin, sourceController.getAllSources);
router.post('/sources', requireAdmin, sourceController.upsertSource);
router.delete('/sources/:id', requireAdmin, sourceController.deleteSource);

module.exports = router;
