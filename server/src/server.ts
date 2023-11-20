// questions-Services.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import app from './app';
import express from 'express';
import path from 'path';

// Serve client files
app.use(express.static(path.join(__dirname, '/../../client/public')));



const port = 3000;
app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
