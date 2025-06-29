'use client';

// This is a very basic placeholder for the Chart component.
// You would replace this with an actual charting library implementation (e.g., Recharts, Chart.js).
export function Chart({ data, title, timeframe, onChangeTimeframe }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">{title || 'Chart Title'}</h3>
                <select
                    value={timeframe}
                    onChange={(e) => onChangeTimeframe(e.target.value)}
                    className="p-2 border rounded text-sm"
                >
                    <option value="this_month">This Month</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="this_week">This Week</option>
                    {/* Add other timeframes as needed */}
                </select>
            </div>
            <div className="border p-4 h-64 flex items-center justify-center text-gray-400">
                <p>Chart Data Area</p>
                {/* Actual chart rendering would go here */}
                {/* Example: <ResponsiveContainer width="100%" height="100%"> ... </ResponsiveContainer> */}
                {data && data.length > 0 ? (
                    <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                ) : (
                    <p>No data available for the selected period.</p>
                )}
            </div>
        </div>
    );
}

export default Chart;
