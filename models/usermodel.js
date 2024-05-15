import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password: { 
        type: String, 
        required: true 
    },
    isAdmin: {
        type: Boolean,
        required:true
    },
    assignedReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        unique: true,
    }],

    feedbackByothers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Feedbacks'
    }]
  },{ timestamps: true });

  export const UsersModel=mongoose.model('Users', userSchema);