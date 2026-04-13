import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const Comments = ({ taskId, users = [] }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH COMMENTS ================= */

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/tasks/${taskId}/comments`, {
        withCredentials: true,
      });

      setComments(res.data.data || res.data);
    } catch (err) {
      console.error("❌ Failed to fetch comments", err);
    }
  };

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!taskId) return;

    fetchComments();

    socket.emit("joinTask", taskId);

    const handleNewComment = (data) => {
      if (data.taskId === taskId) {
        setComments((prev) => {
          const exists = prev.some((c) => c._id === data.comment._id);
          if (exists) return prev;
          return [...prev, data.comment];
        });
      }
    };

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment);
    };
  }, [taskId]);

  /* ================= ADD COMMENT ================= */

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `/tasks/${taskId}/comment`,
        { text },
        { withCredentials: true }
      );

      setComments((prev) => [...prev, res.data.data]);

      setText("");
      setShowMentions(false);
    } catch (err) {
      console.error("❌ Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MENTION HANDLER ================= */

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    const lastWord = value.split(" ").pop();

    if (lastWord.startsWith("@")) {
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleSelectUser = (user) => {
    const words = text.split(" ");
    words.pop();
    setText(words.join(" ") + " @" + user.username + " ");
    setShowMentions(false);
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-gray-900 text-white">
      <h3 className="font-semibold mb-3 text-white">Comments</h3>

      {/* COMMENTS LIST */}
      <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">No comments yet</p>
        )}

        {comments.map((c) => (
          <div key={c._id} className="bg-gray-800 p-2 rounded">
            <p className="text-sm font-semibold text-gray-200">
              {c.user?.name || "User"}
            </p>

            <p className="text-sm text-gray-300">
              {c.text.split(" ").map((word, i) =>
                word.startsWith("@") ? (
                  <span key={i} className="text-blue-400 font-semibold">
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                )
              )}
            </p>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="relative">
        <input
          value={text}
          onChange={handleInputChange}
          placeholder="Write a comment... (@mention)"
          className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* MENTION DROPDOWN */}
        {showMentions && users.length > 0 && (
          <div className="absolute bg-gray-800 border border-gray-700 w-full mt-1 rounded shadow z-10 max-h-40 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="p-2 hover:bg-gray-700 cursor-pointer text-white"
              >
                @{user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleAddComment}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Comments;