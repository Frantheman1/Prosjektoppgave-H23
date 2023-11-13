import express from 'express';
import routerQuestions from './routers/questionRouters';

const app = express();

app.use(express.json());

app.use('/api/v1', routerQuestions);

export default app;
