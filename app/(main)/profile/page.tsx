'use client';

import { useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';

export default function ProfilePage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const sendChatMessage = useAction(api.ai.chat);
  const redeemLoyaltyPoints = useMutation(api.loyalty.redeemLoyaltyPoints);

  const { userId } = useAuth();
  const loyalty = useQuery(api.loyalty.get, userId ? { userId } : 'skip');

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    setChatHistory((prev) => [...prev, `You: ${message}`]);
    const botResponse = await sendChatMessage({ message });
    setChatHistory((prev) => [...prev, `AI Stylist: ${botResponse}`]);
    setMessage('');
  };

  const handleRedeemPoints = async () => {
    if (!userId) {
      alert('User not authenticated.');
      return;
    }
    if (pointsToRedeem <= 0) {
      alert('Please enter a valid number of points to redeem.');
      return;
    }
    try {
      const discount = await redeemLoyaltyPoints({ userId, pointsToRedeem });
      alert(
        `Successfully redeemed ${pointsToRedeem} points for a discount of R${discount}.`,
      );
      setPointsToRedeem(0);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error redeeming points: ${error.message}`);
      } else {
        alert('An unknown error occurred while redeeming points.');
      }
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {/* Loyalty Widget and Referral */}
      <div className="my-4 p-4 border rounded">
        <h2>Loyalty Points: {loyalty?.points || 0}</h2>
        {/* Placeholder for Referral Code */}
        <h2>Referral Code: [Code Here]</h2>

        <div className="mt-4">
          <input
            type="number"
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(parseInt(e.target.value))}
            placeholder="Points to redeem"
            className="p-2 border rounded"
          />
          <button
            onClick={handleRedeemPoints}
            className="ml-2 bg-green-500 text-white p-2 rounded"
          >
            Redeem Points
          </button>
        </div>
      </div>

      <h2>AI Stylist Chat</h2>
      <div className="border p-4 h-64 overflow-y-scroll">
        {chatHistory.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your AI Stylist..."
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
