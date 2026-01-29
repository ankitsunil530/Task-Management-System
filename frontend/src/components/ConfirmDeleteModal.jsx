import { useEffect } from "react";

export default function ConfirmDeleteModal({
  title = "Delete Task?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
  loading = false,
}) {

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
