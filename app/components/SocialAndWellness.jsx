'use client';
import { useState } from 'react';

export default function SocialAndWellness() {
  const [moodScore, setMoodScore] = useState(7);
  const [socialStats, setSocialStats] = useState({
    tiktok_views: 8500,
    instagram_reach: 1250,
    conversion_rate: 12.5,
  });

  const handleMoodSubmit = async () => {
    const response = await fetch('/api/mood/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: 'demo_customer',
        mood_score: moodScore,
        notes: 'Daily check-in',
      }),
    });

    const result = await response.json();
    if (result.discount_applied > 0) {
      alert(`🎉 ${result.message}`);
    }
  };

  const checkViralStatus = async () => {
    const response = await fetch('/api/tiktok/viral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video_id: 'demo_video',
        views: socialStats.tiktok_views,
        tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
      }),
    });

    const result = await response.json();
    if (result.viral_triggered) {
      alert(`🔥 ${result.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold">Social & Wellness Hub</h2>

      {/* Mood Tracker */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-3">Daily Mood Check-in</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm">😢</span>
          <input
            type="range"
            min="1"
            max="10"
            value={moodScore}
            onChange={(e) => setMoodScore(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm">😊</span>
          <span className="font-bold text-lg">{moodScore}</span>
        </div>
        <button
          onClick={handleMoodSubmit}
          className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Submit Mood
        </button>
      </div>

      {/* Social Commerce */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-3">Social Commerce</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">
              {socialStats.tiktok_views}
            </p>
            <p className="text-xs text-gray-600">TikTok Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {socialStats.instagram_reach}
            </p>
            <p className="text-xs text-gray-600">IG Reach</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {socialStats.conversion_rate}%
            </p>
            <p className="text-xs text-gray-600">Conversion</p>
          </div>
        </div>
        <button
          onClick={checkViralStatus}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Check Viral Status
        </button>
      </div>

      {/* Cross-Sell Engine */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-3">Mind-Body Bundles</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm">Hair + Massage Combo</span>
            <span className="text-sm font-bold text-green-600">R2,200</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm">Style + Therapy Session</span>
            <span className="text-sm font-bold text-green-600">R1,800</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm">Full Wellness Package</span>
            <span className="text-sm font-bold text-green-600">R3,500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
