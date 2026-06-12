import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const response = await getNotifications();
    setNotifications(response);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-pink-400">Notificaciones</h1>
      <p className="text-slate-400 mt-2">Avisos importantes del sistema.</p>

      <div className="mt-8 space-y-4 max-w-2xl">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <div className="flex justify-between">
              <h3 className="text-xl font-bold">{notification.title}</h3>
              <span className={notification.is_read ? "text-slate-500" : "text-pink-400"}>
                {notification.is_read ? "Leída" : "Nueva"}
              </span>
            </div>
            <p className="text-slate-400 mt-2">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;