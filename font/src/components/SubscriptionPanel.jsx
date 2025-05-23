import React, { useEffect, useState } from 'react';

const SubscriptionPanel = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/subscriptions/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data);
        } else {
          console.error('Failed to fetch subscriptions');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubscribe = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/subscriptions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({ topic: newTopic })
      });
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(prev => [...prev, data]);
        setNewTopic('');
      } else {
        console.error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUnsubscribe = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/subscriptions/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      if (response.ok) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      } else {
        console.error('Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="subscription-panel">
      <h2>Manage Subscriptions</h2>
      <div className="subscription-list">
        {subscriptions.map(sub => (
          <div key={sub.id} className="subscription-item">
            <span>{sub.topic}</span>
            <button onClick={() => handleUnsubscribe(sub.id)}>Unsubscribe</button>
          </div>
        ))}
      </div>
      <div className="subscription-form">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Enter topic to subscribe"
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>
    </div>
  );
};

export default SubscriptionPanel;
