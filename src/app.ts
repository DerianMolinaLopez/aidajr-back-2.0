import cors from 'cors'
import Express, { json, Router }  from 'express';
import morgan from 'morgan';

import roterAuth from './routes/authRoute';
import dotenv from 'dotenv';
import {conectDB} from './database';
import routerCourses from './routes/coursesRoute';
import userRoute from './routes/userRoute';
import routerInstructor from './routes/instructorRoute';
import routerSection from './routes/sectionRoute';
import routerValoracion from './routes/valoracionRoute';
import routerHomework from './routes/HomehorkRoutes';
import routerPeriodos from './routes/periodosRoute';
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
//section of courses
    app.use('/api/sections',routerSection)
//crecionales
  app.use('/api/courses',routerCourses ) 
  app.use('/api/instructor', routerInstructor);
    
//auth
    app.use("/api/auth",roterAuth)
    app.use("/api/user",userRoute)

    //valoraciones
    app.use("/api/valoration",routerValoracion)
    //tareas
    app.use("/api/homework",routerHomework)
    //pagos de periodos
    app.use("/api/periodos",routerPeriodos)


    export default app;