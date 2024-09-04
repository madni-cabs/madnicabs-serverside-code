// Function to format time to AM/PM
export const formatTimeToAmPm = (time) => {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date(1970, 0, 1, hours, minutes, seconds);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };