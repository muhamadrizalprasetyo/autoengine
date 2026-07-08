const Inventory = require('../models/Inventory');

const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().sort({ nama_barang: 1 });
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createInventory = async (req, res) => {
  try {
    const { nama_barang, stok_sisa, harga_jual, limit_stok, satuan } = req.body;

    const inventory = new Inventory({
      nama_barang,
      stok_sisa,
      harga_jual,
      limit_stok,
      satuan
    });

    await inventory.save();
    res.status(201).json({ message: 'Inventory created successfully', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const io = req.app.get('io');
    if (inventory.stok_sisa <= inventory.limit_stok) {
      io.emit('low_stock', inventory);
    }

    res.json({ message: 'Inventory updated successfully', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    res.json({ message: 'Inventory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory
};
