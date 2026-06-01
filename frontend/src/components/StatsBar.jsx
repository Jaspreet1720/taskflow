export default function StatsBar({ stats }) {
  const items = [
    { label: 'Total', value: stats.total || 0, color: 'text-gray-700', bg: 'bg-gray-50' },
    { label: 'To Do', value: stats.todo || 0, color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'In Progress', value: stats.in_progress || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Done', value: stats.done || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'High Priority', value: stats.high_priority || 0, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {items.map(({ label, value, color, bg }) => (
        <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
