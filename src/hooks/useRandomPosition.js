import { useState, useEffect } from 'react';

const useRandomPosition = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const randomPosition = () => {
      const maxWidth = window.innerWidth - 600;
      const maxHeight = window.innerHeight - 500;
      return {
        x: Math.random() * maxWidth,
        y: Math.random() * maxHeight,
      };
    };
    setPosition(randomPosition());
  }, []);

  return [position, setPosition];
};

export default useRandomPosition;