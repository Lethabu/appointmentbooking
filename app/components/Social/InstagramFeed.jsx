'use client';
import { useState } from 'react';

export default function InstagramFeed() {
  const [posts] = useState([
    {
      id: 1,
      image: '/placeholder.jpg',
      caption:
        'Beautiful Middle & Side installation for our gorgeous client! ✨ #InstyleHairBoutique #MiddleAndSide',
      likes: 45,
      comments: 8,
      date: '2 hours ago',
    },
    {
      id: 2,
      image: '/placeholder.jpg',
      caption:
        'Maphondo & Lines perfection! 🔥 Book your appointment today #MaphondoLines #HairGoals',
      likes: 62,
      comments: 12,
      date: '1 day ago',
    },
    {
      id: 3,
      image: '/placeholder.jpg',
      caption:
        'Another satisfied client! Thank you for trusting us with your hair journey 💕',
      likes: 38,
      comments: 5,
      date: '2 days ago',
    },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Instagram Feed</h2>
        <a
          href="https://instagram.com/instylehairboutique"
          target="_blank"
          className="text-pink-600 hover:text-pink-700 text-sm font-medium"
        >
          @instylehairboutique
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">📸 Hair Installation</span>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                {post.caption}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-pink-600 hover:to-purple-700">
          Follow Us on Instagram
        </button>
      </div>
    </div>
  );
}
