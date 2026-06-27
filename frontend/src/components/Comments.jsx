import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import Avatar from "./Avatar";
import EmptyState from "./EmptyState";
import { MessageCircleOff } from "lucide-react";

const Comments = ({ taskId, users = [] }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [loading, setLoading] = useState(false);
  // Self-fetched user list so the @mention dropdown works even when the
  // parent doesn't pass a users prop (TaskCard currently passes users={[]}).
  const [availableUsers, setAvailableUsers] = useState(users);

  // Users have no stored `username`; fall back to the email local-part so the
  // dropdown shows real handles (matches the backend mention resolver).
  const mentionName = (u) =>
    (u.username || (u.email ? u.email.split("@")[0] : "")).toLowerCase();

  // Live autocomplete list: usernames matching what's typed after "@".
  const filteredUsers = availableUsers.filter((u) => {
    const name = mentionName(u);
    return name.length > 0 && name.startsWith(mentionQuery);
  });

  /* ================= FETCH COMMENTS ================= */

  const fetchComments = async () => {
    try {
      // Use GET /tasks/:id (which exists and embeds comments) rather than
      // the non-existent GET /tasks/:id/comments endpoint.
      const res = await api.get(`/tasks/${taskId}`);
      setComments(res.data.data?.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  /* ================= SOCKET + USERS ================= */

  useEffect(() => {
    if (!taskId) return;

    fetchComments();

    // Self-fetch the user list for @mention autocomplete so the dropdown
    // works even when the parent passes an empty users prop.
    api
      .get("/user/users")
      .then((res) => {
        const list = res.data?.data || res.data || [];
        if (list.length > 0) setAvailableUsers(list);
      })
      .catch(() => {});

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

      const res = await api.post(
        `/tasks/${taskId}/comment`,
        { text }
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

    // When the current word starts with "@", capture the text after it as a
    // live filter query; otherwise close the suggestion list.
    const lastWord = value.split(/\s/).pop();

    if (lastWord.startsWith("@")) {
      setMentionQuery(lastWord.slice(1).toLowerCase());
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery("");
    }
  };

  const handleSelectUser = (user) => {
    const words = text.split(/\s/);
    words.pop();
    const prefix = words.length ? `${words.join(" ")} ` : "";
    setText(`${prefix}@${mentionName(user)} `);
    setShowMentions(false);
    setMentionQuery("");
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-gray-900 text-white">
      <h3 className="font-semibold mb-3 text-white">Comments</h3>

      {/* COMMENTS LIST */}
      <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
        {comments.length === 0 && (
          <EmptyState
          icon={<MessageCircleOff className="h-10 w-10" />}
          title="No Comments"
          description="Start the discussion by adding the first comment."
          />
          )}

        {comments.map((c) => (
          <div key={c._id} className="bg-gray-800 p-2 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Avatar
                src={c.user?.profilePicture}
                name={c.user?.name || "User"}
                size={22}
              />
              <p className="text-sm font-semibold text-gray-200">
                {c.user?.name || "User"}
              </p>
            </div>

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
        {showMentions && filteredUsers.length > 0 && (
          <div className="absolute bg-gray-800 border border-gray-700 w-full mt-1 rounded shadow z-10 max-h-40 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="p-2 hover:bg-gray-700 cursor-pointer text-white"
              >
                @{mentionName(user)}
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