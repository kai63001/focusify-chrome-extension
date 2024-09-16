import { useState, useEffect } from 'react';

const useRandomPosition = (widgetName) => {
  const [position, setPosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('widgetState') || '[]');
    const savedWidget = savedState.find(widget => widget.name === widgetName);
    
    if (savedWidget && savedWidget.position) {
      setPosition(savedWidget.position);
    } else {
      const randomPosition = () => {
        const maxWidth = window.innerWidth - 600;
        const maxHeight = window.innerHeight - 500;
        return {
          x: Math.random() * maxWidth,
          y: Math.random() * maxHeight,
        };
      };
      setPosition(randomPosition());
    }
  }, [widgetName]);

  return [position, setPosition];
};

export default useRandomPosition;