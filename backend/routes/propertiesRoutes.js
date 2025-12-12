import express from 'express';
import { getProperties, getProperty} from '../controllers/propertiesController.js';

const router = express.Router();

router.get('/', getProperties);
router. get('/:id', getProperty);

export default router;
