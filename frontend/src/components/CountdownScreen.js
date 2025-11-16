import React, { useEffect, useState } from "react";

const CountdownScreen = ({ startGame }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          clearInterval(timer);
          startGame(); // Call parent to start actual game
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startGame]);

  return (
    <div className="countdown-overlay">
      <div className="countdown">{count}</div>
    </div>
  );
};

export default CountdownScreen;
