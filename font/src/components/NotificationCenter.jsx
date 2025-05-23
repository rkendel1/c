import React, { useEffect, useState } from 'react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);

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
    <div className="notification-center">
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCenter;
