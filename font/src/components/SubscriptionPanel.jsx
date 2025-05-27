import React, { useEffect, useState } from 'react';
import api from '../api';

const SubscriptionPanel = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get('/subscriptions/');
        setSubscriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch subscriptions', error);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleSubscribe = async () => {
    try {
      const response = await api.post('/subscriptions/', { topic: newTopic });
      setSubscriptions(prev => [...prev, response.data]);
      setNewTopic('');
    } catch (error) {
      console.error('Failed to subscribe', error);
    }
  };

  const handleUnsubscribe = async (id) => {
    try {
      await api.delete(`/subscriptions/${id}/`);
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Failed to unsubscribe', error);
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