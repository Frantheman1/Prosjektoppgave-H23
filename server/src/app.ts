import express from 'express';
import routerQuestions from './routers/questionRouters';
import routerTags from './routers/tagsRouters';
import routerAnswers from './routers/answerRouters';


const app = express();

app.use(express.json());

app.use('/api/v1', routerQuestions);
app.use('/api/v1', routerTags );
app.use('/api/v1', routerAnswers );


export default app;
