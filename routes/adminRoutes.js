import express from 'express';
import adminController from '../controllers/admincontroller.js';


const adminRouter=express.Router();
const AdminController= new adminController();


adminRouter.get('/editemployee:id',AdminController.editEmployee)
adminRouter.get('/deleteemployee:id', AdminController.deleteEmployee)
adminRouter.post('/updateemployee/:id',AdminController.updateEmployee)
adminRouter.get('/assignreview:id', AdminController.assignReviewForm)
adminRouter.post('/assignreview/:id', AdminController.assignReview)
export default adminRouter;