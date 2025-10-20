'use client';

'use client';

import { useState, useEffect } from 'react';

const mockInventory = [
  {
    id: 1,
    name: 'Professional Shampoo',
    category: 'Hair Care',
    current_stock: 8,
    min_threshold: 10,
    max_threshold: 50,
    cost_per_unit: 45,
    selling_price: 180,
    usage_rate: 2.5, // per week
    predicted_stockout: '2 weeks',
    auto_reorder: true,
    supplier: 'Hair Health & Beauty',
  },
  {
    id: 2,
    name: 'Hair Color - Blonde Mix',
    category: 'Color',
    current_stock: 15,
    min_threshold: 20,
    max_threshold: 100,
    cost_per_unit: 85,
    selling_price: 200,
    usage_rate: 3.2,
    predicted_stockout: '3 weeks',
    auto_reorder: true,
    supplier: 'Professional Color Co',
  },
  {
    id: 3,
    name: 'Deep Conditioning Mask',
    category: 'Treatment',
    current_stock: 25,
    min_threshold: 15,
    max_threshold: 60,
    cost_per_unit: 65,
    selling_price: 220,
    usage_rate: 1.8,
    predicted_stockout: '8 weeks',
    auto_reorder: false,
    supplier: 'Hair Health & Beauty',
  },
  {
    id: 4,
    name: 'Hair Extensions - 18 inch',
    category: 'Extensions',
    current_stock: 5,
    min_threshold: 8,
    max_threshold: 30,
    cost_per_unit: 250,
    selling_price: 400,
    usage_rate: 0.8,
    predicted_stockout: '4 weeks',
    auto_reorder: true,
    supplier: 'Premium Extensions Ltd',
  },
];

const generateAlerts = (inventory) => {
  const alerts = [];

  inventory.forEach((item) => {
    if (item.current_stock <= item.min_threshold) {
      alerts.push({
        type: 'critical',
        message: `${item.name} is running low (${item.current_stock} left)`,
        action: item.auto_reorder
          ? 'Auto-reorder scheduled'
          : 'Manual reorder required',
        item_id: item.id,
      });
    } else if (item.current_stock <= item.min_threshold * 1.5) {
      alerts.push({
        type: 'warning',
        message: `${item.name} will run low soon (${item.current_stock} left)`,
        action: 'Consider reordering',
        item_id: item.id,
      });
    }
  });

  return alerts;
};

export default function SmartInventory() {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setInventory(mockInventory);
    setAlerts(generateAlerts(mockInventory));
  }, []);

  const getStockStatus = (item) => {
    if (item.current_stock <= item.min_threshold) return 'critical';
    if (item.current_stock <= item.min_threshold * 1.5) return 'warning';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts Dashboard */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Inventory Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'critical'
                    ? 'bg-red-50 border-red-400'
                    : 'bg-yellow-50 border-yellow-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className={`font-medium ${
                        alert.type === 'critical'
                          ? 'text-red-800'
                          : 'text-yellow-800'
                      }`}
                    >
                      {alert.message}
                    </h3>
                    <p
                      className={`text-sm ${
                        alert.type === 'critical'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {alert.action}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      alert.type === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {alert.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Smart Inventory Management
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Usage Rate
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Predicted Stockout
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Auto-Reorder
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Profit Margin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => {
                const status = getStockStatus(item);
                const profitMargin = (
                  ((item.selling_price - item.cost_per_unit) /
                    item.selling_price) *
                  100
                ).toFixed(1);

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {item.current_stock} units
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.min_threshold}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.usage_rate}/week
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.predicted_stockout}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.auto_reorder
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.auto_reorder ? 'Enabled' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-green-600">
                        {profitMargin}%
                      </div>
                      <div className="text-xs text-gray-500">
                        R{item.selling_price - item.cost_per_unit} profit
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          AI Inventory Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Seasonal Prediction</h4>
              <p className="text-sm text-blue-700">
                Hair color demand typically increases 40% in spring. Consider
                increasing color stock by March.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Cost Optimization</h4>
              <p className="text-sm text-green-700">
                Bulk ordering from Hair Health & Beauty could save R450/month on
                shampoo and treatments.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Usage Patterns</h4>
              <p className="text-sm text-purple-700">
                Hair extensions usage peaks on Fridays (wedding prep). Ensure
                stock before weekends.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900">
                Profit Opportunities
              </h4>
              <p className="text-sm text-yellow-700">
                Retail sales of deep conditioning masks could increase revenue
                by R2,800/month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
