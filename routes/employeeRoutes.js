import express from 'express';
import employeeController from '../controllers/employeecontroller.js';

const employeeRouter = express.Router();
const EmployeeController = new employeeController() ;

employeeRouter.post('/submitfeedback/:email', EmployeeController.submitFeedbacks);





export default employeeRouter;