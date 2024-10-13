import { Router } from 'express';
import SectionController from '../controllers/SectionController';

const routerSection = Router();

routerSection.post('/sections', SectionController.createSection);
routerSection.get('/sections', SectionController.getSections);
routerSection.get('/sections/:id', SectionController.getSectionById);
routerSection.get('/sections/course/:course', SectionController.getSectionsByCourse);
routerSection.put('/sections/:id', SectionController.updateSection);
routerSection.delete('/sections/:id', SectionController.deleteSection);
routerSection.post('/sectionsMany', SectionController.createMultipleSections);

export default routerSection;