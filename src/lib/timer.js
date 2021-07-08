let timestamp = null

// 7 seconds in millisecond
const LIMIT = 7 * 1000

export const start = () => {
  timestamp = new Date();
}

export const isTimeOut = () => {
  const duration = new Date() - timestamp
  return (duration > LIMIT);
}
