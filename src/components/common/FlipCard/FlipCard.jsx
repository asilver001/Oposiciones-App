import { useState } from 'react';
import { motion } from 'framer-motion';

const spring = {
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  snappy: { type: "spring", stiffness: 400, damping: 25 },
};

export default function FlipCard({
  front,
  back,
  className = "",
  springType = "gentle"
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={spring[springType]}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
