import { useState, useEffect } from "react";

export const DataTest = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/bdtest");
        const data = await response.json();
        setMessage(data);
      } catch (err) {
        setError("Cannot reach server");
        console.error(err);
      }
    };
    fetchServerStatus();
  }, []);

  return (
    <div className="flex place-content-center overflow-scroll">
      <span className="text-sm font-mono">
        {error || message || "Loading..."}
      </span>
    </div>
  );
};
