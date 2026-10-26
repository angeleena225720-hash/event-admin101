const API_URL = "/api/events";

async function readReply(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Request failed, try again");
  return body;
}

const jsonRequest = (method, payload) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

export const fetchAllEvents = () => fetch(API_URL).then(readReply);
export const fetchEventById = (id) => fetch(`${API_URL}/${id}`).then(readReply);
export const addEvent = (payload) => fetch(API_URL, jsonRequest("POST", payload)).then(readReply);
export const editEvent = (id, payload) =>
  fetch(`${API_URL}/${id}`, jsonRequest("PUT", payload)).then(readReply);
export const removeEvent = (id) => fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(readReply);
