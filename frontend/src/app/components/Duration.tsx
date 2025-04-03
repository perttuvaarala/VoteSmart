import { useState, useEffect } from "react";

interface DurationProps {
  endTime: number;
}

export default function Duration({ endTime }: DurationProps) {
  const getTimeLeft = () =>
    Math.max(0, endTime - Math.floor(Date.now() / 1000));

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return hours > 0
      ? `${hours}h ${minutes}m ${secs}s`
      : minutes > 0
      ? `${minutes}m ${secs}s`
      : `${secs}s`;
  };

  return (
    <div className="text-center text-lg font-semibold text-red-500 mt-4">
      {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "Poll has ended"}
    </div>
  );
}
