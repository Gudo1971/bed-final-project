import express from 'express';
import { getProperties, getProperty, getPropertyBookings } from '../controllers/propertiesController.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/:id/bookings', getPropertyBookings);
router. get('/:id', getProperty);
export default router;
