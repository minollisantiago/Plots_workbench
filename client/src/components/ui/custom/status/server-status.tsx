import { useState, useEffect } from "react";

export const ServerStatus = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/");
        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError("Offline");
        console.error(err);
      }
    };
    fetchServerStatus();
  }, []);

  return (
    <div className="flex place-content-center">
      <span className="text-sm font-mono">
        {error || message || "Loading..."}
      </span>
    </div>
  );
};
