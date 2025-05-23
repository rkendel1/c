import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/notifications/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="p-3 border-b text-sm font-semibold text-gray-700">Notifications</div>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map(notification => (
                <li
                  key={notification.id}
                  className={`px-4 py-2 text-sm cursor-pointer ${
                    notification.read ? 'text-gray-500' : 'text-gray-800 font-medium'
                  } hover:bg-gray-100`}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;