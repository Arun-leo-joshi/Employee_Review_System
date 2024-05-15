import { UsersModel } from "../models/usermodel.js";
import { feedBackModel } from "../models/feedbackmodel.js"

export default class employeeController{

    async submitFeedbacks(req,res){

        try{
            // step-1- store feedback to feedback collection
            // step-2- update propert(assignedReviews)
            // step-3- update property(feedbackbyOthers) of user document

            //  extract data from form using req body
            const{feedbackTo,feedbackText}=req.body;

            const userEmail=req.params.email;
            // find userId using email
            const user=await UsersModel.findOne({email:userEmail});
            const feedbackBy=user._id;

            //  check if feedback exist or not and then create feedback
            const feedbackSubmitted=await feedBackModel.exists({feedbackBy,feedbackTo});
            //  if not already existed create feedback
            if(!feedbackSubmitted) {
                const newfeedback=await feedBackModel.create({feedbackBy,feedbackTo,feedbackText});

                req.flash('success', 'Feedback Succesfully Submitted')

                // update employee's assignedReview property
                const updatedUser=await UsersModel.findByIdAndUpdate(
                    // search user
                    {_id:feedbackBy},
                    // delete employee id from assignedReviews whose feedback is submitted
                    {$pull:{assignedReviews:feedbackTo}},
                    {new:true}
                );
                
                // extract data of employees remainig in assignedReviews array
                const updatedassignedReviews=await UsersModel.find({_id:updatedUser.assignedReviews});

                // update feedbackbyothers property in user's document
                const updatefeedBackByOthers=await UsersModel.findOneAndUpdate(
                    // find employee whose feedbackByOthers is to update
                    {_id:feedbackTo},
                    //  update feedback to
                    {$push:{feedbackByothers:newfeedback}}
                );
                const feedbacks=await feedBackModel.find({feedbackTo:feedbackBy}).populate('feedbackBy', 'name')
                return res.render('employee', {username:user.name, userEmail:user.email, assignedReviews:updatedassignedReviews,feedbacks:feedbacks, success:req.flash('success')});

                
            }else{
                req.flash('error','Review already  exist')
                return res.redirect('/user/signin');
            }
        }catch(err){
            console.log(err);
        }
    }
}