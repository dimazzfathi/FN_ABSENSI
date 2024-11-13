import { useEffect, useState } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  const formattedTime = time.toLocaleTimeString();

  return (
    <div className="text-5xl font-bold text-gray-800">
      <div>{formattedDate}</div>
      <div>{formattedTime}</div>
    </div>
  );
}
