import Comments from "./Comments";

export default function TaskDetailModal({ task, onClose, users }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {task.title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-300 mb-4">
          {task.description || "No description provided"}
        </p>

        {/* META INFO */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400">
          <span>Priority: <span className="text-gray-200">{task.priority}</span></span>

          {task.deadline && (
            <span>
              Due:{" "}
              <span className="text-gray-200">
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </span>
          )}
        </div>

        {/* ASSIGNED USERS */}
        <div className="mb-5">
          <p className="text-sm text-gray-400 mb-2">Assigned Users</p>

          <div className="flex flex-wrap gap-2">
            {task.assignedTo?.map((u) => (
              <span
                key={u._id}
                className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-xs"
              >
                {u.name}
              </span>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* COMMENTS */}
        <Comments taskId={task._id} users={users} />
      </div>
    </div>
  );
}