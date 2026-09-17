import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socketInstance;
    try {
      const { hostname, port, protocol } = window.location;
      const socketUrl = (hostname === 'localhost' || hostname === '127.0.0.1')
        ? window.location.origin
        : (port === '5173' || port === '5174')
          ? `http://${hostname}:5000`
          : `${protocol}//${hostname}`;

      socketInstance = io(socketUrl, {
        reconnectionDelay: 3000,
        reconnectionAttempts: 5,
        path: '/socket.io/',
        transports: ['websocket', 'polling']
      });

      socketInstance.on('connect', () => {
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
      });

      setSocket(socketInstance);
    } catch (err) {
      console.warn('Socket connection error:', err);
    }

    return () => {
      if (socketInstance) {
        try { socketInstance.disconnect(); } catch (e) {}
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
