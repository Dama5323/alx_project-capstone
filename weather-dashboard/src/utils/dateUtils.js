export const formatDay = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
};

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};