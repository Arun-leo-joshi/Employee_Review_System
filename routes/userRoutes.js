import express from 'express';
import userController from '../controllers/usercontroller.js';


const UserRouter=express.Router();
const UserController=new userController();

UserRouter.get('/signin',UserController.signin);
UserRouter.post('/signin',UserController.postSignin);
UserRouter.post('/signup',UserController.signup);
UserRouter.get('/logout',UserController.logout);
// UserRouter.get('/editemployee:id',UserController.editEmployee);




export default UserRouter;