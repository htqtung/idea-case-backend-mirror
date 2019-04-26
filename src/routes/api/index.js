<<<<<<< HEAD
import express from "express";

import reset_service from "./reset_service";
import category from "./category";
import idea from "./idea";

const routes = express.Router();

routes.use("/reset_service", reset_service);
routes.use("/category", category);
routes.use("/idea", idea);
=======
import express from 'express';

import reset_service from './reset_service';
import category from './category';
import comment from './comment';
import idea from './idea';
import ideaMember from './ideaMember';
import member from './member';

const routes = express.Router(); 
routes.use('/reset_service', reset_service);
routes.use('/category', category);
routes.use('/comment', comment);
routes.use('/idea', idea);
routes.use('/ideaMember', ideaMember);
routes.use('/member', member);
>>>>>>> 2712544d251fcc02c38f441f75d2b2d26c2bc351

export default routes;
