import { useState, useRef } from 'react';
import './ToyCard.css';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const halfFilled = !filled && rating >= i - 0.5;
    stars.push(
      <span key={i} className={`star ${filled ? 'filled' : ''} ${halfFilled ? 'half' : ''}`}>
        {filled || halfFilled ? '★' : '☆'}
      </span>
    );
  }
  return <span className="star-rating">{stars}</span>;
}

export function ToyCard({ toy, onSwipeLeft, onSwipeRight, onViewDetails }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveDirection, setLeaveDirection] = useState(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 100;
  const DRAG_THRESHOLD = 10;

  const handlePointerDown = (e) => {
    if (isLeaving) return;
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isLeaving) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    if (Math.abs(newX) > DRAG_THRESHOLD || Math.abs(newY) > DRAG_THRESHOLD) {
      hasDragged.current = true;
    }

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging || isLeaving) return;
    setIsDragging(false);
    cardRef.current?.releasePointerCapture(e.pointerId);

    if (position.x > SWIPE_THRESHOLD) {
      triggerSwipe('right');
    } else if (position.x < -SWIPE_THRESHOLD) {
      triggerSwipe('left');
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleClick = () => {
    if (!hasDragged.current && onViewDetails) {
      onViewDetails(toy);
    }
  };

  const triggerSwipe = (direction) => {
    setIsLeaving(true);
    setLeaveDirection(direction);

    setTimeout(() => {
      if (direction === 'right') {
        onSwipeRight(toy);
      } else {
        onSwipeLeft(toy);
      }
    }, 300);
  };

  const handleButtonSwipe = (direction) => {
    if (isLeaving) return;
    setPosition({ x: direction === 'right' ? 50 : -50, y: 0 });
    setTimeout(() => triggerSwipe(direction), 50);
  };

  const rotation = position.x * 0.1;
  const opacity = Math.max(0, 1 - Math.abs(position.x) / 300);

  const getSwipeIndicator = () => {
    if (position.x > 30) return 'like';
    if (position.x < -30) return 'nope';
    return null;
  };

  const swipeIndicator = getSwipeIndicator();

  return (
    <div className="toy-card-container">
      <div
        ref={cardRef}
        className={`toy-card ${isDragging ? 'dragging' : ''} ${isLeaving ? `leaving-${leaveDirection}` : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          opacity: isLeaving ? 0 : opacity,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      >
        {swipeIndicator && (
          <div className={`swipe-indicator ${swipeIndicator}`}>
            {swipeIndicator === 'like' ? 'ADD TO CART' : 'SKIP'}
          </div>
        )}
        <div className="toy-image" style={{ backgroundImage: `url(${toy.image})` }}>
          <div className="tap-hint">Tap for details</div>
        </div>
        <div className="toy-info">
          <div className="toy-header">
            <h2 className="toy-name">{toy.name}</h2>
            <p className="toy-price">${toy.price.toFixed(2)}</p>
          </div>
          <div className="toy-rating">
            <StarRating rating={toy.rating} />
            <span className="review-count">({toy.reviewCount})</span>
          </div>
          <p className="toy-description">{toy.description}</p>
        </div>
      </div>

      <div className="button-row">
        <button
          className="swipe-button skip"
          onClick={() => handleButtonSwipe('left')}
          disabled={isLeaving}
        >
          Skip
        </button>
        <button
          className="swipe-button like"
          onClick={() => handleButtonSwipe('right')}
          disabled={isLeaving}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
