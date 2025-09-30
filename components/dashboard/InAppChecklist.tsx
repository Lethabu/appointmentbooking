'use client';

import { useState } from 'react';

export function InAppChecklist() {
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Complete your profile', completed: false },
    { id: 2, text: 'Add your first service', completed: false },
    { id: 3, text: 'Set up your booking page', completed: false },
    { id: 4, text: 'Invite your first client', completed: false },
  ]);

  const toggleItem = (id: number) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const completedItems = checklistItems.filter((item) => item.completed).length;
  const totalItems = checklistItems.length;
  const progress = (completedItems / totalItems) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Getting Started Checklist</h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {completedItems} of {totalItems} tasks completed
      </p>
      <ul>
        {checklistItems.map((item) => (
          <li key={item.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="mr-2"
            />
            <span
              className={item.completed ? 'line-through text-gray-500' : ''}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
