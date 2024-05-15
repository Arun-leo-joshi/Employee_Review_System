import mongoose from "mongoose";

const feedBackSchema=new mongoose.Schema({
    
    
    feedbackBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    feedbackTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    feedbackText: {
        type: String,
        required: true
    }
}, { timestamps:true });


export const feedBackModel=mongoose.model('Feedbacks', feedBackSchema);