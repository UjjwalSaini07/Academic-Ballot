import { useEffect, useState } from "react";

export const usePollTimer = (startTime, duration) => {

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = duration - elapsed;

      setTimeLeft(Math.max(0, Math.floor(remaining)));

    }, 1000);

    return () => clearInterval(interval);

  }, [startTime, duration]);

  return timeLeft;
};