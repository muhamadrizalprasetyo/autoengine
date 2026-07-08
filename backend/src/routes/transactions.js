const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validateTransaction } = require('../middleware/validation');
const {
  createTransaction,
  getTransactions,
  getCustomerTransactions,
  getTransactionById,
  getAnalytics
} = require('../controllers/transactionController');

router.post('/', auth, authorize('cashier', 'owner'), validateTransaction, createTransaction);
router.get('/', auth, authorize('cashier', 'owner'), getTransactions);
router.get('/customer', auth, authorize('customer'), getCustomerTransactions);
router.get('/analytics/data', auth, authorize('owner'), getAnalytics);
router.get('/:id', auth, authorize('cashier', 'owner', 'customer'), getTransactionById);

module.exports = router;
