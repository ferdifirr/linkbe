export function parseMessage(message) {
  try {
    return JSON.parse(message);
  } catch (error) {
    return null;
  }
}
