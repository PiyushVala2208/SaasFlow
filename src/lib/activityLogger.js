import Activity from "@/models/Activity";

export async function logActivity({
  projectId,
  userId,
  orgName,
  action,
  details,
}) {
  try {
    await Activity.create({
      projectId,
      userId,
      orgName,
      action,
      details,
    });
  } catch (error) {
    console.error("ACTIVITY_LOG_ERROR:", error);
  }
}
