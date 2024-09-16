import Express, { json, Router }  from 'express';
import morgan from 'morgan';
import cors from 'cors'
import roterAuth from './routes/authRoute';
import dotenv from 'dotenv';
import {conectDB} from './database';
import routerCourses from './routes/coursesRoute';
import userRoute from './routes/userRoute';
// initializations
    const app = Express();
    dotenv.config();


//setting
    app.set('port', process.env.Port || 3000);
    app.use(json());
    app.use(cors());
    conectDB();


//middlewares
    app.use(morgan('dev'));
    app.use(Express.urlencoded({extended: false}));
    app.use(Express.json());

// routes
    app.get('/', (req, res)=>{
        res.send(`THE API is at http://localhost:${app.get('port')}`);
    });

//crecionales
  app.use('/api/courses',routerCourses ) 
    
//auth
    app.use("/api/auth",roterAuth)
    app.use("/api/user",userRoute)

    export default app;