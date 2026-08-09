import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const { hostname, port, protocol } = window.location;
    const socketUrl = hostname === 'localhost'
      ? window.location.origin
      : (port === '5173' || port === '5174')
        ? `http://${hostname}:5000`           // Direct :5173 → backend :5000
        : `${protocol}//${hostname}`;         // Via Nginx → same host, proxied to :5000

    const socketInstance = io(socketUrl, {
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
      path: '/socket.io/'
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
