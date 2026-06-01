import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      const res = await axios.get(`${API_URL}/tasks/`, { params });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const handleSave = async (taskData) => {
    try {
      if (editTask) {
        await axios.put(`${API_URL}/tasks/${editTask.id}`, taskData);
      } else {
        await axios.post(`${API_URL}/tasks/`, taskData);
      }
      setShowModal(false);
      setEditTask(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/${task.id}`, { status: newStatus });
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.username} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here's your task overview</p>
          </div>
          <button
            onClick={() => { setEditTask(null); setShowModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition"
          >
            + Add Task
          </button>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {(filters.status || filters.priority || filters.search) && (
            <button
              onClick={() => setFilters({ status: '', priority: '', search: '' })}
              className="text-sm text-gray-500 hover:text-red-500 transition px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tasks */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No tasks found</p>
            <p className="text-gray-300 text-sm mt-1">Click "Add Task" to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editTask}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}
