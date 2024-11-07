import { Router } from 'express';
import TaskController from '../controllers/TaskController';

const taskRoute = Router();

// Ruta para crear una nueva tarea
taskRoute.post('/tasks', TaskController.createTask);

// Ruta para obtener todas las tareas
taskRoute.get('/tasks', TaskController.getTasks);

//! Repetido en SectionController
/*
// Ruta para obtener todas las tareas de una sección específica
taskRoute.get('/section/:section', TaskController.getTasksBySection);
*/
// Ruta para obtener una tarea por ID
taskRoute.get('/tasks/:id', TaskController.getTaskById);

// Ruta para actualizar una tarea por ID
taskRoute.put('/tasks/:id', TaskController.updateTask);

// Ruta para eliminar una tarea por ID
taskRoute.delete('/tasks/:id', TaskController.deleteTask);

export default taskRoute;
