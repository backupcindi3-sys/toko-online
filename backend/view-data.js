import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String
});

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  image: String,
  description: String,
  rating: Number,
  reviews: Number,
  color: String,
  size: [String],
  stock: Number
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

const viewData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected!\n');

    // Get users
    const users = await User.find({}, { password: 0 });
    console.log('📋 USERS (' + users.length + '):');
    if (users.length === 0) {
      console.log('  Belum ada user');
    } else {
      users.forEach((user, i) => {
        console.log(`  ${i + 1}. ${user.username} (${user.role}) - ${user.email}`);
      });
    }

    console.log('\n');

    // Get products
    const products = await Product.find({});
    console.log('📦 PRODUCTS (' + products.length + '):');
    if (products.length === 0) {
      console.log('  Belum ada produk');
    } else {
      products.forEach((product, i) => {
        console.log(`  ${i + 1}. ${product.name} - Rp${product.price.toLocaleString('id-ID')}`);
        console.log(`     Kategori: ${product.category} | Stok: ${product.stock}`);
      });
    }

    console.log('\n✨ Koneksi MongoDB berhasil!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

viewData();
