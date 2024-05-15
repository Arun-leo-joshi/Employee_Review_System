import { UsersModel } from "../models/usermodel.js";

export default class adminController{
        
        
    async editEmployee(req,res){
        try{
            const employee=await UsersModel.findById({_id:req.params.id})
            return res.render('editEmployeeForm', {employee:employee});
        }catch(err){
            console.log(err);
            req.flash('error', 'Something went wrong');
            return res.redirect('back');
        }
    }

    async deleteEmployee(req,res){
        console.log(req.params.id);

        try{
            // delete user
        const employee=await UsersModel.deleteOne({_id:req.params.id});

        req.flash('success', 'Successfully Deleted')
        // render admin page again
        const foundUser=await UsersModel.findOne({email:req.session.userEmail});
        const employees=await UsersModel.find({isAdmin:false}) ;
        return res.render('admin',{username:foundUser.name,userEmail:foundUser.email, employees:employees,success:req.flash('success')});

        }catch(err){
            console.log(err);
            req.flash('error', 'Something went wrong');
            return res.redirect('admin');
        }
        
    }

    async updateEmployee(req,res){

        try{
            await UsersModel.findOneAndUpdate(
                // filter users by id
                { _id:req.params.id },
                // update info
                { $set:{ name:req.body.name, email:req.body.email, isAdmin:req.body.isAdmin } }
            )

            req.flash('success', 'Successfully Updated')

            // render admin page again
        const foundUser=await UsersModel.findOne({email:req.session.userEmail});
        const employees=await UsersModel.find({isAdmin:false}) ;
        return res.render('admin',{username:foundUser.name,
            userEmail:foundUser.email,
            employees:employees,
            success:req.flash('success')
        });
        }catch(err){
            console.log(err);
            req.flash('error', 'Something went wrong');
            return res.redirect('back');
        }
    }


    async assignReviewForm(req,res){
        const employeeId=req.params.id;
        const user=await UsersModel.findOne({_id:employeeId});

        const foundUser=await UsersModel.findOne({email:req.session.userEmail});
        const employees=await UsersModel.find({isAdmin:false}) 
        
        return res.render('admin',{username:foundUser.name,
            userEmail:foundUser.email,
            employees:employees,
            showForm:true,
            user:user});
        }

    async assignReview(req,res){
        try{
            const{feedbackby,feedbackto}=req.body;

            const foundUser=await UsersModel.findOne({email:req.session.userEmail});
            const employees=await UsersModel.find({isAdmin:false});

        //   check if feedbackto is already in assigned review array to avoid same multiples feedbacks assigned
            const user = await UsersModel.findOne({ _id: feedbackby });
            
            if (user.assignedReviews.includes(feedbackto)) {
                
                req.flash('error', `Review is already assigned to ${user.name}`);
                return res.render('admin',{username:foundUser.name,
                    userEmail:foundUser.email,
                    employees:employees,
                    success:req.flash('error')
                }); 
            }

        // update feedbacks in assignedreview array 
            const updatedUser=await UsersModel.findOneAndUpdate(
                //  1st argument to filter/find document
                {_id:feedbackby},

                // update or push the value in the required field
                { $push :{assignedReviews:feedbackto} },
                
                // to return updated document
                {new: true}
            );

            if(updatedUser){

                req.flash('success', `Review is assigned to ${updatedUser.name}`)

                return res.render('admin',{username:foundUser.name,
                    userEmail:foundUser.email,
                    employees:employees,
                    success:req.flash('success')
                });
            
            }else {
                console.log('User not found');
            }
        }catch(err){
            console.log(err);
        }
        

    }   
    }