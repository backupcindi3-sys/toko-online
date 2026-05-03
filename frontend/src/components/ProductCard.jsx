import { Link } from 'react-router-dom';
import RatingComponent from './RatingComponent';
import './ProductCard.css';

function ProductCard({ product }) {
  const productId = product._id || product.id;

  return (
    <div className="product-card">
      <Link to={`/product/${productId}`} className="product-card-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <div className="product-rating">
            <RatingComponent rating={product.rating} reviews={product.reviews} />
          </div>
          <div className="product-footer">
            <span className="product-price">Rp {product.price.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
