import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


const Tasks = () => {
  const { currentUser } = useContext(AuthContext);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const response2 = await axios.get("/api/tasks/completed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setCompletedTasks(response2.data);
      setPendingTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error.response || error.message);
    }
  };

  const markAsComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(
        `/api/tasks/${taskId}/complete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchTasks(); // Refresh tasks after update
    } catch (error) {
      console.error("Error marking task as complete", error);
    }
  };

  const markAsPending = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/pending`,
        {},
        { headers }
      );
      fetchTasks(); // Refresh tasks after update
    } catch (error) {
      console.error("Error marking task as pending", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers,
      });
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">Your Tasks</h1>

      {/* Pending Tasks */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Pending Tasks</h2>
        {pendingTasks.length === 0 ? (
          <p className="text-lg text-gray-500">You have no pending tasks.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pendingTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white shadow-lg rounded-lg p-6 transition-transform duration-200 hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{task.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{task.description}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => markAsComplete(task._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-300"
                  >
                    Mark as Complete
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      <section>
        <h2 className="text-2xl font-semibold text-green-500 mb-4">Completed Tasks</h2>
        {completedTasks.length === 0 ? (
          <p className="text-lg text-gray-500">You have no completed tasks.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {completedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white shadow-lg rounded-lg p-6 transition-transform duration-200 hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-green-600 mb-2">{task.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{task.description}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => markAsPending(task._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors duration-300"
                  >
                    Mark as Pending
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Tasks;
