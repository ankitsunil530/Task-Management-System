// One-time backfill for the username field added in #57.
//
// New registrations now derive a username, but users created before this field
// existed have none, so @mentions can't resolve them. This script assigns each
// such user a username using the SAME rules as registration (email local-part,
// lowercased, stripped to [a-z0-9_], capped at 20 chars, "user" fallback,
// numeric suffix on collision).
//
// It is idempotent: only users missing a username are touched, so it is safe to
// re-run. Run a preview first, then apply:
//
//   node backend_mern/scripts/backfillUsernames.mjs --dry-run   # preview only
//   node backend_mern/scripts/backfillUsernames.mjs             # apply
//
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const DRY_RUN = process.argv.includes("--dry-run");

// Same derivation as registration in controllers/authController.js.
const deriveUsername = async (email, name) => {
  const source = (String(email).split("@")[0] || name || "user").toLowerCase();
  const base = source.replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";

  let candidate = base;
  let suffix = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await User.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
};

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI in backend_mern/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log(`Connected.${DRY_RUN ? " (dry run - no writes)" : ""}`);

  const users = await User.find({
    $or: [
      { username: { $exists: false } },
      { username: null },
      { username: "" },
    ],
  }).select("_id name email");

  console.log(`Found ${users.length} user(s) without a username.`);

  let updated = 0;
  for (const user of users) {
    // eslint-disable-next-line no-await-in-loop
    const username = await deriveUsername(user.email, user.name);
    console.log(`${DRY_RUN ? "[dry-run] " : ""}${user.email || user._id} -> ${username}`);

    if (!DRY_RUN) {
      // updateOne avoids the password-required validation and the pre-save
      // hash hook that a full document .save() would trigger.
      // eslint-disable-next-line no-await-in-loop
      await User.updateOne({ _id: user._id }, { $set: { username } });
      updated += 1;
    }
  }

  console.log(
    DRY_RUN
      ? "Dry run complete. Re-run without --dry-run to apply."
      : `Done. Updated ${updated} user(s).`
  );

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
