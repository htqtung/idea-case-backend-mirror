import express from "express";

<<<<<<< HEAD
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
=======
import reset_service from "./reset_service";
import category from "./category";
import idea from "./idea";
const routes = express.Router();
routes.use("/reset_service", reset_service);
routes.use("/category", category);
routes.use("/idea", idea);
>>>>>>> 8e81776761618ebaf865e8eff0afd23e1dac9ff8

export default routes;
