import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import feedid from './src/index';
import db from './src/utils/db';
import apiRoutes from './src/routes/api';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic Middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';");
    res.removeHeader('X-Content-Security-Policy');
    res.removeHeader('X-WebKit-CSP');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));



// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CrawlGen Intelligence API',
            version: '2.5.0',
            description: 'Advanced news crawler and aggregator system.',
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' }
            }
        },
        security: [{ ApiKeyAuth: [] }],
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./src/routes/api.js'],
};

const customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 30px 0 }
  .swagger-ui .info .title { font-family: 'Inter', sans-serif; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em; }
  .swagger-ui .scheme-container { background: transparent; box-shadow: none; border-bottom: 1px solid #e2e8f0; padding: 20px 0; }
  .swagger-ui .opblock { border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0 !important; overflow: hidden; }
  .swagger-ui .opblock.opblock-post { background: #f8fafc; border-color: #3b82f6 !important; }
  .swagger-ui .opblock.opblock-get { background: #f8fafc; border-color: #10b981 !important; }
  .swagger-ui .opblock .opblock-summary { padding: 12px 20px; }
  .swagger-ui .opblock .opblock-summary-method { border-radius: 8px; font-weight: 900; text-transform: uppercase; }
  .swagger-ui .btn.authorize { background-color: #3b82f6; border-color: #3b82f6; color: white; border-radius: 10px; font-weight: 900; text-transform: uppercase; }
  .swagger-ui .btn.authorize svg { fill: white; }
  body { background-color: #ffffff !important; }
`;

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCss, customSiteTitle: "CrawlGen API Reference" }));

// API Routes
app.use('/api', apiRoutes);

// SPA Fallback — serve React app for all non-API routes
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/api-docs')) return next();
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Bootstrap Server
async function bootstrap() {
    try {
        await db.initDb();
        await feedid.init();
        app.listen(PORT, () => {
            console.log(`
🚀 CrawlGen Intelligence Architecture Optimized!
---------------------------------------
Environment: Production
Port:        ${PORT}
Dashboard:   http://localhost:${PORT}
API Docs:    http://localhost:${PORT}/api-docs
---------------------------------------
            `);
        });
    } catch (error) {
        console.error('❌ Failed to bootstrap server:', error);
        process.exit(1);
    }
}

bootstrap();
