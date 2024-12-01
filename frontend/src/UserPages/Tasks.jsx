import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Tasks = () => {
  const { currentUser } = useContext(AuthContext); 
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);


  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken"); 
      if (!token) {
        console.error("No auth token found");
        return; // Exit early if no token
      }
      
      const headers = { Authorization: `Bearer ${token}` };
  
      // Fetch pending tasks
      const pendingResponse = await axios.get('/api/tasks/pending', { headers });
      setPendingTasks(pendingResponse.data);
  
      // Fetch completed tasks
      const completedResponse = await axios.get('/api/tasks/completed', { headers });
      setCompletedTasks(completedResponse.data);
    } catch (error) {
      console.error("Error fetching tasks", error.response || error.message);
    }
  };
  

  // Mark a task as complete
  const markAsComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/complete`,
        {},
        { headers }
      );
      fetchTasks(); // Refresh tasks after update
    } catch (error) {
      console.error("Error marking task as complete", error);
    }
  };

  // Mark a task as pending
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

  // Delete a task
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

  // Fetch tasks when the component mounts
  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Your Tasks</h1>

      {/* Pending Tasks */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Pending Tasks
        </h2>
        {pendingTasks.length === 0 ? (
          <p className="text-lg text-gray-500">You have no pending tasks.</p>
        ) : (
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task._id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold text-blue-600">
                  {task.title}
                </h3>
                <p className="text-gray-700">{task.description}</p>
                <div className="mt-4">
                  <button
                    onClick={() => markAsComplete(task._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Mark as Complete
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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
        <h2 className="text-xl font-semibold text-gray-500 mb-4">
          Completed Tasks
        </h2>
        {completedTasks.length === 0 ? (
          <p className="text-lg text-gray-500">You have no completed tasks.</p>
        ) : (
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div key={task._id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold text-green-600">
                  {task.title}
                </h3>
                <p className="text-gray-700">{task.description}</p>
                <div className="mt-4">
                  <button
                    onClick={() => markAsPending(task._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Mark as Pending
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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
