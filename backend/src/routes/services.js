const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

router.get('/', getServices);
router.post('/', auth, authorize('owner'), createService);
router.put('/:id', auth, authorize('owner'), updateService);
router.delete('/:id', auth, authorize('owner'), deleteService);

module.exports = router;
