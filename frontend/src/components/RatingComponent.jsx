import './RatingComponent.css';

function RatingComponent({ rating, reviews }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className="star full">★</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" className="star half">★</span>);
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
  }

  return (
    <div className="rating-component">
      <div className="stars">
        {stars}
      </div>
      <span className="rating-text">{rating.toFixed(1)}</span>
      <span className="reviews-text">({reviews} ulasan)</span>
    </div>
  );
}

export default RatingComponent;
