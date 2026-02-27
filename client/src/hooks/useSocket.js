import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../api";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only use sockets in development, not in production (Vercel serverless doesn't support WebSockets)
    // We'll use HTTP polling instead for real-time updates
    const isProduction = 
      import.meta.env.VITE_API_URL?.includes("vercel.app") || 
      API_URL?.includes("vercel.app");
    
    if (isProduction) {
      console.log("Socket disabled in production - using HTTP polling instead");
      return; // Don't create socket in production
    }
    
    console.log("Creating socket for development");
    
    const s = io(API_URL, {
      transports: ["websocket", "polling"]
    });
    
    s.on("connect", () => {
      console.log("Socket connected");
    });
    
    s.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
    });
    
    setSocket(s);
    return () => {
      console.log("Closing socket");
      s.close();
    };
  }, []);

  return socket;
};