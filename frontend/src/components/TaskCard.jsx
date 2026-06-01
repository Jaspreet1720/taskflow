const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const STATUS_STYLES = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col gap-3 hover:shadow-md transition ${task.status === 'done' ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <h3 className={`font-semibold text-gray-800 text-sm leading-snug ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-500 text-xs p-1 transition"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 text-xs p-1 transition"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {/* Due date */}
      {task.due_date && (
        <p className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
          {isOverdue ? '⚠️ Overdue: ' : '📅 Due: '}
          {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}

      {/* Quick status change */}
      <div className="border-t pt-3 mt-auto">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}
