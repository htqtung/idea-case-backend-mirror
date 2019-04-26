import express from 'express';
import category from './category';
import idea from './idea';

const routes = express.Router(); 
routes.use('/category', category);
routes.use('/idea', idea);

export default routes;
