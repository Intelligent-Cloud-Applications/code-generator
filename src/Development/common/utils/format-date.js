export const formatDate = (epochDate, location) => {
  const date = new Date(epochDate);
  if (location === "US") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } else if (location === "IN") {
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } else {
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
};
