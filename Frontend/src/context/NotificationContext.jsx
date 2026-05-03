import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (text) => {
    const id = Date.now();

    setNotifications((prev) => [...prev, { id, text }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}

      <div className="fixed top-5 right-5 space-y-2 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-black text-white px-4 py-2 rounded shadow"
          >
            {n.text}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);