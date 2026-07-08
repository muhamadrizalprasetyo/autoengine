import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on('new_booking', (booking) => {
      setNotifications(prev => [...prev, {
        type: 'booking',
        data: booking,
        message: `Booking baru masuk: ${booking.no_pelat || ''}`,
        timestamp: new Date()
      }]);
    });

    newSocket.on('booking_status_changed', (booking) => {
      setNotifications(prev => [...prev, {
        type: 'status',
        data: booking,
        message: `Status booking berubah: ${booking.status_pengerjaan}`,
        timestamp: new Date()
      }]);
    });

    newSocket.on('new_transaction', (transaction) => {
      setNotifications(prev => [...prev, {
        type: 'transaction',
        data: transaction,
        message: 'Transaksi baru berhasil!',
        timestamp: new Date()
      }]);
    });

    newSocket.on('low_stock', (inventory) => {
      setNotifications(prev => [...prev, {
        type: 'stock',
        data: inventory,
        message: `⚠️ Stok ${inventory.nama_barang} menipis! Sisa: ${inventory.stok_sisa}`,
        timestamp: new Date()
      }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
