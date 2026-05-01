export const PROJECT_STATUS = Object.freeze({
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  ARCHIVED: "Archived",
});

export const PROJECT_LIFECYCLE_EVENTS = Object.freeze({
  AUTO_PROGRESS_SYNC: "AUTO_PROGRESS_SYNC",
  MANUAL_COMPLETE: "MANUAL_COMPLETE",
  MANUAL_REOPEN: "MANUAL_REOPEN",
  ARCHIVE: "ARCHIVE",
  UNARCHIVE: "UNARCHIVE",
});

function normalizeProgress(rawProgress) {
  const progress = Number(rawProgress);
  if (!Number.isFinite(progress)) return null;
  if (progress < 0) return 0;
  if (progress > 100) return 100;
  return Math.round(progress);
}

export function getLifecyclePatch(project, event, context = {}) {
  const status = project?.status || PROJECT_STATUS.ACTIVE;
  const autoCompleteBlocked = Boolean(project?.autoCompleteBlocked);
  const progress = normalizeProgress(context.progress);
  const patch = {};

  switch (event) {
    case PROJECT_LIFECYCLE_EVENTS.MANUAL_COMPLETE: {
      if (status !== PROJECT_STATUS.COMPLETED)
        patch.status = PROJECT_STATUS.COMPLETED;
      if (autoCompleteBlocked) patch.autoCompleteBlocked = false;
      return patch;
    }

    case PROJECT_LIFECYCLE_EVENTS.MANUAL_REOPEN: {
      if (status !== PROJECT_STATUS.ACTIVE)
        patch.status = PROJECT_STATUS.ACTIVE;
      if (!autoCompleteBlocked) patch.autoCompleteBlocked = true;
      if (progress === 100) patch.progress = 99;
      return patch;
    }

    case PROJECT_LIFECYCLE_EVENTS.ARCHIVE: {
      if (status !== PROJECT_STATUS.ARCHIVED)
        patch.status = PROJECT_STATUS.ARCHIVED;
      if (progress === 0) patch.autoCompleteBlocked = true;
      return patch;
    }

    case PROJECT_LIFECYCLE_EVENTS.UNARCHIVE: {
      if (status === PROJECT_STATUS.ARCHIVED)
        patch.status = PROJECT_STATUS.ACTIVE;
      if (progress === 0 || progress === 100) {
        patch.autoCompleteBlocked = true;
      }
      return patch;
    }

    case PROJECT_LIFECYCLE_EVENTS.AUTO_PROGRESS_SYNC: {
      if (progress === null) return patch;

      const nextBlocked = Object.prototype.hasOwnProperty.call(
        patch,
        "autoCompleteBlocked",
      )
        ? patch.autoCompleteBlocked
        : autoCompleteBlocked;

      if (progress < 100 && autoCompleteBlocked) {
        patch.autoCompleteBlocked = false;
      }

      if (
        status === PROJECT_STATUS.ACTIVE &&
        progress === 100 &&
        !nextBlocked
      ) {
        patch.status = PROJECT_STATUS.COMPLETED;
      }

      return patch;
    }

    default:
      return patch;
  }
}

export function getLifecycleEventForStatusChange(
  currentStatus,
  requestedStatus,
) {
  if (requestedStatus === PROJECT_STATUS.COMPLETED) {
    return PROJECT_LIFECYCLE_EVENTS.MANUAL_COMPLETE;
  }

  if (
    requestedStatus === PROJECT_STATUS.ACTIVE &&
    currentStatus === PROJECT_STATUS.COMPLETED
  ) {
    return PROJECT_LIFECYCLE_EVENTS.MANUAL_REOPEN;
  }

  if (requestedStatus === PROJECT_STATUS.ARCHIVED) {
    return PROJECT_LIFECYCLE_EVENTS.ARCHIVE;
  }

  if (
    requestedStatus === PROJECT_STATUS.ACTIVE &&
    currentStatus === PROJECT_STATUS.ARCHIVED
  ) {
    return PROJECT_LIFECYCLE_EVENTS.UNARCHIVE;
  }

  return null;
}
