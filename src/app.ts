import './openapi/extend';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { setupOpenApi } from './openapi/setup';
import routes from './routes';

const app = express();

app.use(express.json());

setupOpenApi(app);

app.use('/api', routes);

app.use(errorHandler);

export default app;
