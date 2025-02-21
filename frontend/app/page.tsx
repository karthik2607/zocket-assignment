"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  List,
  Plus,
  Search,
  Tag,
  Calendar,
  Trash2,
  Edit,
  Menu,
  X,
  ChevronDown,
  Moon,
  LogOut,
  Bot,
} from "lucide-react";
import TaskChatbot from "@/components/TaskChatbot";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  dueDate: string; // ISO 8601 date format
  tags: string[];
}

const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    todo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tasks");

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data.tasks);
        setStatistics(data.statistics);
      } catch (err) {
        setError((err as { message: string }).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return { tasks, statistics, loading, error };
};

// Task Card Component
const TaskCard = ({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange: (
    taskId: string,
    newStatus: "todo" | "pending" | "completed"
  ) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    todo: {
      bg: "bg-indigo-900/20",
      text: "text-indigo-400",
      border: "border-indigo-800/30",
    },
    pending: {
      bg: "bg-amber-900/20",
      text: "text-amber-400",
      border: "border-amber-800/30",
    },
    completed: {
      bg: "bg-emerald-900/20",
      text: "text-emerald-400",
      border: "border-emerald-800/30",
    },
  };

  const color = statusColors[task.status as keyof typeof statusColors];

  const isOverdue =
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    task.status !== "completed";
  const isDueToday =
    task.dueDate &&
    isToday(new Date(task.dueDate)) &&
    task.status !== "completed";

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className={`bg-gray-800 rounded-lg overflow-hidden border ${color.border} transition-all duration-300 shadow-lg hover:shadow-xl`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {task.status === "completed" ? (
              <button
                onClick={() => onStatusChange(task.id, "todo")}
                className="flex-shrink-0 p-1 rounded-full bg-emerald-900/20 text-emerald-400"
              >
                <CheckCircle size={20} />
              </button>
            ) : task.status === "pending" ? (
              <button
                onClick={() => onStatusChange(task.id, "completed")}
                className="flex-shrink-0 p-1 rounded-full bg-amber-900/20 text-amber-400"
              >
                <Clock size={20} />
              </button>
            ) : (
              <button
                onClick={() => onStatusChange(task.id, "pending")}
                className="flex-shrink-0 p-1 rounded-full bg-indigo-900/20 text-indigo-400"
              >
                <List size={20} />
              </button>
            )}
            <h3
              className={`font-medium text-lg ${
                task.status === "completed"
                  ? "line-through text-gray-400"
                  : "text-white"
              }`}
            >
              {task.name}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {isOverdue && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/20 text-red-400">
                Overdue
              </span>
            )}
            {isDueToday && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/20 text-blue-400">
                Today
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronDown
                size={18}
                className={`transform transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-3 overflow-hidden"
            >
              <p className="text-gray-400 text-sm">{task.description}</p>

              {task.dueDate && (
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar size={14} className="mr-2" />
                  <span>Due: {format(new Date(task.dueDate), "PPP")}</span>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-gray-300 flex items-center"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-2 rounded-full hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: { border: string; bg: string };
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`bg-gray-800 p-5 rounded-lg border-l-4 ${color.border} shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-100 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color.bg}`}>{icon}</div>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
export default function TaskDashboard() {
  const { tasks, statistics, loading, error } = useTaskData();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const router = useRouter();

  // Apply filters to tasks
  useEffect(() => {
    if (!tasks) return;

    let result = [...tasks];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.name.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply tag filter
    if (tagFilter) {
      result = result.filter((task) => task.tags.includes(tagFilter));
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, tagFilter]);

  // Extract all unique tags from tasks
  const allTags = tasks ? [...new Set(tasks.flatMap((task) => task.tags))] : [];

  const handleStatusChange = (taskId: string, newStatus: string) => {
    // In a real app, you would update the status via API
    console.log(`Changing task ${taskId} status to ${newStatus}`);
  };

  const handleLogout = () => {
    fetch("/api/logout", {
      method: "POST",
    })
      .then((res) => {
        if (res.ok) {
          router.push("/login");
        } else {
          throw new Error("Failed to logout");
        }
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 mx-auto bg-red-900/20 rounded-full flex items-center justify-center text-red-500">
            <X size={32} />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">
            Error Loading Tasks
          </h2>
          <p className="mt-2 text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative max-w-md w-64">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <Moon size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800 shadow-md"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                  <Moon size={18} />
                  <span className="text-sm">Dark Mode</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Tasks"
              value={statistics.total}
              icon={<List size={24} className="text-blue-400" />}
              color={{ border: "border-blue-700", bg: "bg-blue-900/20" }}
            />
            <StatsCard
              title="Completed"
              value={statistics.completed}
              icon={<CheckCircle size={24} className="text-emerald-400" />}
              color={{ border: "border-emerald-700", bg: "bg-emerald-900/20" }}
            />
            <StatsCard
              title="In Progress"
              value={statistics.pending}
              icon={<Clock size={24} className="text-amber-400" />}
              color={{ border: "border-amber-700", bg: "bg-amber-900/20" }}
            />
            <StatsCard
              title="Todo"
              value={statistics.todo}
              icon={<List size={24} className="text-indigo-400" />}
              color={{ border: "border-indigo-700", bg: "bg-indigo-900/20" }}
            />
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-bold mb-2 sm:mb-0">Your Tasks</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("todo")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "todo"
                    ? "bg-indigo-900/30 text-indigo-400"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "pending"
                    ? "bg-amber-900/30 text-amber-400"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "completed"
                    ? "bg-emerald-900/30 text-emerald-400"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-2">
              <span className="text-sm text-gray-400 flex-shrink-0">
                Filter by tag:
              </span>
              <button
                onClick={() => setTagFilter("")}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  tagFilter === ""
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${
                    tagFilter === tag
                      ? "bg-gray-700 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Task List */}
        <section>
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-lg p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                  {statusFilter !== "all" ? (
                    statusFilter === "completed" ? (
                      <CheckCircle size={28} className="text-gray-500" />
                    ) : statusFilter === "pending" ? (
                      <Clock size={28} className="text-gray-500" />
                    ) : (
                      <List size={28} className="text-gray-500" />
                    )
                  ) : (
                    <Search size={28} className="text-gray-500" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  No tasks found
                </h3>
                <p className="mt-2 text-gray-400 max-w-md mx-auto">
                  {searchQuery
                    ? `No tasks match your search "${searchQuery}"`
                    : statusFilter !== "all"
                    ? `You don't have any ${statusFilter} tasks${
                        tagFilter ? ` with the tag "${tagFilter}"` : ""
                      }`
                    : tagFilter
                    ? `You don't have any tasks with the tag "${tagFilter}"`
                    : "You don't have any tasks yet. Create your first task to get started!"}
                </p>
                <button className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center mx-auto">
                  <Plus size={18} className="mr-2" />
                  Add New Task
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Floating Action Button */}
      {
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bot size={24} />
        </button>
      }

      {/* Chatbot Modal */}
      {isChatbotOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsChatbotOpen(false);
            }
          }}
          className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50"
        >
          <TaskChatbot />
        </div>
      )}
    </div>
  );
}
