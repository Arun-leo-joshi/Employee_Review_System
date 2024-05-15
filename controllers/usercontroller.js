import { feedBackModel } from "../models/feedbackmodel.js";
import { UsersModel } from "../models/usermodel.js";
import bcrypt from 'bcrypt';

export default class userController{

    signin(req,res){
        res.render('signin')
    }

    logout(req,res){
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Error logging out');
            } else {
                res.clearCookie('session'); // Clear the session cookie
                res.redirect('/user/signin');
            }
        });
    }
    
    async signup(req, res) {
        try {
            const { name, email, password, confirm_password, isAdmin } = req.body;

            if (password !== confirm_password) {
                req.flash('error', 'Password does not match');
                return res.render('signup',{error:req.flash('error')});
            }
            
            // check if user already exist
            const existingUser = await UsersModel.findOne({ email });
            if (existingUser) {
                req.flash('error', 'User already exists');
                return res.render('signup',{error:req.flash('error')});
            }

            // hash password before saving to database
            const hasshedPassword=await bcrypt.hash(password,12);

            // check if already logged in using session
            if(req.session.userEmail){
                
                await UsersModel.create({ name, email, password:hasshedPassword, isAdmin });
                const foundUser=await UsersModel.findOne({email:req.session.userEmail});

                const employees=await UsersModel.find({isAdmin:false}) ;
                return res.render('admin',{username:foundUser.name,userEmail:foundUser.email, employees:employees});
            }

            await UsersModel.create({ name, email, password:hasshedPassword, isAdmin });
            req.flash('success', 'New user created. Please log in');
            return res.render('signin',{success:req.flash('success')})
            
            } catch (err) {
                console.error(err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/');
            }
    }

    async postSignin(req,res){
        try{
            const {email,password}=req.body;
            
        // getting all the employees who are not admin inside a variable
        const employees=await UsersModel.find({isAdmin:false}) ;

        //  find user with the credentials provided in signin page
        const foundUser=await UsersModel.findOne({email});
        if(foundUser){
            // compare password
            const ispassword=await bcrypt.compare(password,foundUser.password);

            //  if admin render admin page
            if(ispassword && foundUser.isAdmin==true){
                req.session.userEmail=req.body.email;
                return res.render('admin',{username:foundUser.name,userEmail:foundUser.email, employees:employees});
            }

            // if employee, render employee page
            else if(ispassword && foundUser.isAdmin==false){

                const assignedReviews= await UsersModel.find({_id:foundUser.assignedReviews});
                const feedbacks=await feedBackModel.find({feedbackTo:foundUser.id}).populate('feedbackBy', 'name');
                return res.render('employee', {username:foundUser.name,userEmail:foundUser.email, assignedReviews:assignedReviews, feedbacks:feedbacks});
            }
            else{
                req.flash('error','Invalid Credentials')
                return res.render('signin',{error:req.flash('error')})
            }
        }else{
            req.flash('error', 'user not Found')
            return res.render('signin',{error:req.flash('error')})
        }
        }catch (err) {
            console.error(err);
            req.flash('error', 'Something went wrong');
            return res.redirect('signin');
        }
        
    }
    
}