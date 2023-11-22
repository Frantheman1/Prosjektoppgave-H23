// questions-Services.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import express from 'express';
import routerQuestions from './routers/questionRouters';
import routerTags from './routers/tagsRouters';
import routerAnswers from './routers/answerRouters';
import routerVotes from './routers/voteRouters';
import routerFavorites from './routers/favoriteRouters'
import routerComments from './routers/commentRouters';


const app = express();

app.use(express.json());

app.use('/api/v1', routerQuestions);
app.use('/api/v1', routerTags );
app.use('/api/v1', routerAnswers );
app.use('/api/v1', routerVotes );
app.use('/api/v1', routerFavorites );
app.use('/api/v1', routerComments );


export default app;
