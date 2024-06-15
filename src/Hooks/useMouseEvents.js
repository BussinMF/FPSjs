import { useEffect } from 'react';

const useMouseEvents = (onLeftMouseDown, onLeftMouseUp, onRightMouseDown, onRightMouseUp) => {
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0) {
        if (onLeftMouseDown) {
          onLeftMouseDown();
        }
      } else if (e.button === 2) {
        if (onRightMouseDown) {
          onRightMouseDown();
        }
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        if (onLeftMouseUp) {
          onLeftMouseUp();
        }
      } else if (e.button === 2) {
        if (onRightMouseUp) {
          onRightMouseUp();
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onLeftMouseDown, onLeftMouseUp, onRightMouseDown, onRightMouseUp]);
};

export default useMouseEvents;
