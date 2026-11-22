import swaggerUi from 'swagger-ui-express';
import type { RequestHandler } from 'express';
import swaggerDoc from './swagger.json';

const swaggerMiddleware: RequestHandler[] = [...swaggerUi.serve, swaggerUi.setup(swaggerDoc)];

export default swaggerMiddleware;