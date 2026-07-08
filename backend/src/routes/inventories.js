const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');

router.get('/', getInventories);
router.post('/', auth, authorize('cashier', 'owner'), createInventory);
router.put('/:id', auth, authorize('cashier', 'owner'), updateInventory);
router.delete('/:id', auth, authorize('owner'), deleteInventory);

module.exports = router;
