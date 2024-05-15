import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';

import { ConnectingToMongoose } from './config/mongoose.js';
import UserRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import employeeRouter from './routes/employeeRoutes.js';

const app=express();
const port=3200;

//for parsing the form data
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//serving the static files
app.use(express.static("public"));

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//handle session cookie
app.use(
    session({
      name: "Employmee Review System",
      secret: "SECRET",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 100,
      },
      store: MongoStore.create(
        {
          mongoUrl: process.env.MONGO_URL,
          autoRemove: "disabled",
        },
        function (err) {
          console.log("Error in the mongo Store", err);
        }
      )
    })
  );
  
// connect-flash middleware 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


// handling Routes
app.get('/',(req,res)=>{
  res.render('signup')
})
app.get('/test',(req,res)=>{
  res.render('test');
})
app.use('/user',UserRouter);
app.use('/admin',adminRouter);
app.use('/employee',employeeRouter);

  app.listen(port, (err) => {
    if (err) {
      console.log(`Server Error ${err}`);
    }
    console.log(`Server is listening on port ${port}`);
    ConnectingToMongoose;
  });