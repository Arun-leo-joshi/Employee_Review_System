//import all required packages 
import mongoose from 'mongoose';

//sets up the mongodb cloud url
const MongoURL = process.env.MONGO_URL;

//connect to app to mongodb
export const ConnectingToMongoose=mongoose.connect(MongoURL)
.then(()=>console.log('Sucessfully Connected to DB'))
.catch((err)=>console.log(`Connetion Error in Mongodb ${err}`));