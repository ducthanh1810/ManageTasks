export const formatDate = (date: any) => {
  try {
    const dateFormat = date.format("YYYY-MM-DD HH:mm");
    return dateFormat;
  } catch {
    return "Invalid Date";
  }
};
