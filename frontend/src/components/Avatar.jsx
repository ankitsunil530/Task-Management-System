import { useState } from "react";

// Deterministic palette so each user keeps a stable colour for their initials
// fallback (no flicker between renders).
const COLORS = [
  "#4f46e5",
  "#0ea5e9",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#db2777",
  "#0891b2",
];

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

// Renders the user's profile picture when a URL is supplied, otherwise an
// initials avatar. Falls back to initials if the image fails to load.
export default function Avatar({ src, name = "", size = 40, className = "" }) {
  const [errored, setErrored] = useState(false);
  const dimension = { width: size, height: size };

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        onError={() => setErrored(true)}
        style={dimension}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-label={name || "User avatar"}
      title={name}
      style={{
        ...dimension,
        backgroundColor: getColor(name),
        fontSize: Math.max(10, Math.round(size * 0.4)),
      }}
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white select-none ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
