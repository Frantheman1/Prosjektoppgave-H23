import express from 'express';
import routerQuestions from './routers/questionRouters';
import routerTags from './routers/tagsRouters';
import routerAnswers from './routers/answerRouters';
import routerComments from './routers/commentRouters';


const app = express();

app.use(express.json());

app.use('/api/v1', routerQuestions);
app.use('/api/v1', routerTags );
app.use('/api/v1', routerAnswers );
app.use('/api/v1', routerComments );


export default app;
