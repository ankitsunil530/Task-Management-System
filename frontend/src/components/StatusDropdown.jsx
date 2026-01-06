import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateTaskStatus } from "../features/tasks/taskSlice";

export default function StatusDropdown({ task }) {
  const dispatch = useDispatch();

  const onChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;

    await dispatch(updateTaskStatus({ id: task._id, status: newStatus }));
    toast.info(`Status updated to "${newStatus}"`);
  };

  return (
    <select
      value={task.status}
      onChange={onChange}
      className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1"
    >
      <option value="todo">Todo</option>
      <option value="in-progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  );
}
