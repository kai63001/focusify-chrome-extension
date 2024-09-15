import { useState, useEffect } from 'react';

const useRandomPosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const randomPosition = () => {
      const maxWidth = window.innerWidth - 300;
      const maxHeight = window.innerHeight - 200;
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