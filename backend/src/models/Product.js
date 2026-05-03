import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Kemeja', 'Celana', 'Dress', 'Jaket', 'Blouse', 'Shorts', 'Sweater', 'Skirt', 'Polo', 'Cardigan']
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0
    },
    color: {
      type: String,
      required: true
    },
    size: [{
      type: String,
      required: true
    }],
    stock: {
      type: Number,
      default: 100,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
