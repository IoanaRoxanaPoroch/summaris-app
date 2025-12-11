export const formatDate = (date) => {
  if (!date) return "—";
  const d =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
