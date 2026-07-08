const { body, validationResult } = require('express-validator');

const validateTransaction = [
  body('total_bayar').isNumeric().withMessage('total_bayar must be a number').custom((value) => value >= 0).withMessage('total_bayar cannot be negative'),
  body('items_dibeli.*.jumlah').optional().isNumeric().custom((value) => value > 0).withMessage('jumlah must be greater than 0'),
  body('items_dibeli.*.harga_satuan').optional().isNumeric().custom((value) => value >= 0).withMessage('harga_satuan cannot be negative'),
  body('items_dibeli.*.subtotal').optional().isNumeric().custom((value) => value >= 0).withMessage('subtotal cannot be negative'),
  body('jasa_dikerjakan.*.harga').optional().isNumeric().custom((value) => value >= 0).withMessage('harga cannot be negative'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateBooking = [
  body('dp_amount').optional().isNumeric().custom((value) => value >= 0).withMessage('dp_amount cannot be negative'),
  body('estimasi_harga').optional().isNumeric().custom((value) => value >= 0).withMessage('estimasi_harga cannot be negative'),
  body('items_tambahan.*.jumlah').optional().isNumeric().custom((value) => value > 0).withMessage('jumlah must be greater than 0'),
  body('items_tambahan.*.harga_satuan').optional().isNumeric().custom((value) => value >= 0).withMessage('harga_satuan cannot be negative'),
  body('items_tambahan.*.subtotal').optional().isNumeric().custom((value) => value >= 0).withMessage('subtotal cannot be negative'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateTransaction,
  validateBooking
};
