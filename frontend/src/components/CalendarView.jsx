import { useState } from "react";
import TaskCard from "./TaskCard";

export default function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    // Add days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add days from next month
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700 text-white"
          >
            ←
          </button>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700 text-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm text-gray-400 font-medium py-2">
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const isOverdue = dayTasks.some(
            (t) => new Date(t.deadline) < new Date() && t.status !== "done"
          );

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 rounded-lg border ${
                isToday(date)
                  ? "border-indigo-500 bg-indigo-900/30"
                  : isCurrentMonth(date)
                  ? "border-gray-700 bg-gray-800/50"
                  : "border-gray-800 bg-gray-900/30"
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday(date)
                  ? "text-indigo-400"
                  : isCurrentMonth(date)
                  ? "text-white"
                  : "text-gray-500"
              }`}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className={`text-xs p-1 rounded truncate ${
                      task.priority === "high"
                        ? "bg-red-900/50 text-red-300"
                        : task.priority === "medium"
                        ? "bg-yellow-900/50 text-yellow-300"
                        : "bg-green-900/50 text-green-300"
                    } ${
                      new Date(task.deadline) < new Date() && task.status !== "done"
                        ? "border-l-2 border-red-500"
                        : ""
                    }`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
