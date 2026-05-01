import Project from "@/models/Project";
import Task from "@/models/Task";
import {
  PROJECT_LIFECYCLE_EVENTS,
  getLifecyclePatch,
} from "@/lib/projectLifecycle";

export async function syncProjectProgressFromTasks({ projectId, orgName }) {
  if (!projectId || !orgName) return null;

  const project = await Project.findOne({ _id: projectId, orgName });
  if (!project) return null;

  const [totalTasks, completedTasks] = await Promise.all([
    Task.countDocuments({ projectId: project._id, orgName }),
    Task.countDocuments({ projectId: project._id, orgName, status: "Done" }),
  ]);

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const lifecyclePatch = getLifecyclePatch(
    project,
    PROJECT_LIFECYCLE_EVENTS.AUTO_PROGRESS_SYNC,
    { progress },
  );

  const updatePayload = {
    progress,
    ...lifecyclePatch,
  };

  const updatedProject = await Project.findOneAndUpdate(
    { _id: project._id, orgName },
    { $set: updatePayload },
    { new: true, runValidators: true },
  );

  return {
    project: updatedProject,
    totalTasks,
    completedTasks,
    progress,
  };
}
