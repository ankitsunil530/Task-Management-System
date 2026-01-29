import { useDispatch } from "react-redux";
import { updateTask } from "../features/tasks/taskSlice";

export default function StatusDropdown({ task }) {
  const dispatch = useDispatch();

  const onChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;

    dispatch(updateTask({ id: task._id, data: { status: newStatus } }));
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
