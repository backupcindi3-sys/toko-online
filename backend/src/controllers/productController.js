import Product from '../models/Product.js';

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      message: 'Daftar semua produk',
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Error mengambil produk', error: error.message });
  }
};

// GET product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json({
      message: 'Detail produk',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error mengambil produk', error: error.message });
  }
};

// CREATE product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, image, description, rating, reviews, color, size, stock } = req.body;

    // Validasi input
    if (!name || !category || !price || !image || !description || !color || !size) {
      return res.status(400).json({ 
        message: 'Semua field wajib diisi (name, category, price, image, description, color, size)' 
      });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      image,
      description,
      rating: rating || 4.5,
      reviews: reviews || 0,
      color,
      size: Array.isArray(size) ? size : [size],
      stock: stock || 100
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Produk berhasil dibuat',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Error membuat produk', error: error.message });
  }
};

// UPDATE product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json({
      message: 'Produk berhasil diperbarui',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error mengupdate produk', error: error.message });
  }
};

// DELETE product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json({
      message: 'Produk berhasil dihapus',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error menghapus produk', error: error.message });
  }
};
