import { useState, useRef } from 'react';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const halfFilled = !filled && rating >= i - 0.5;
    stars.push(
      <span key={i} className={`text-lg ${filled || halfFilled ? 'text-amber-400' : 'text-gray-300'}`}>
        {filled || halfFilled ? '★' : '☆'}
      </span>
    );
  }
  return <span className="flex gap-0.5">{stars}</span>;
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

  const cardStyle = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
    opacity: isLeaving ? 0 : opacity,
    transition: isDragging ? 'none' : 'transform 0.1s ease-out, opacity 0.3s ease-out',
  };

  if (isLeaving) {
    cardStyle.transform = leaveDirection === 'left'
      ? 'translateX(-150%) rotate(-30deg)'
      : 'translateX(150%) rotate(30deg)';
    cardStyle.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[350px]">
      <div
        ref={cardRef}
        className={`relative w-full bg-white rounded-2xl shadow-xl overflow-hidden select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={cardStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      >
        {swipeIndicator === 'like' && (
          <div className="absolute top-5 right-5 px-4 py-2 rounded-lg font-bold text-lg z-10 -rotate-12 border-3 border-green-500 text-green-500 bg-green-500/10">
            ADD TO CART
          </div>
        )}
        {swipeIndicator === 'nope' && (
          <div className="absolute top-5 left-5 px-4 py-2 rounded-lg font-bold text-lg z-10 rotate-12 border-3 border-red-500 text-red-500 bg-red-500/10">
            SKIP
          </div>
        )}

        <div
          className="relative w-full h-64 bg-cover bg-center bg-gray-100"
          style={{ backgroundImage: `url(${toy.image})` }}
        >
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs opacity-80">
            Tap for details
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h2 className="m-0 text-2xl font-bold text-gray-800">{toy.name}</h2>
            <p className="m-0 text-xl font-bold text-purple-600">${toy.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={toy.rating} />
            <span className="text-gray-400 text-sm">({toy.reviewCount})</span>
          </div>
          <p className="m-0 text-gray-500 leading-relaxed">{toy.description}</p>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          className="flex-1 py-3.5 px-6 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-200 bg-red-100 text-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={() => handleButtonSwipe('left')}
          disabled={isLeaving}
        >
          Skip
        </button>
        <button
          className="flex-1 py-3.5 px-6 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-200 bg-green-100 text-green-600 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={() => handleButtonSwipe('right')}
          disabled={isLeaving}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
