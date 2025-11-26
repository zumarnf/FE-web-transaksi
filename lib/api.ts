import axios from "axios";

export const api = axios.create({
  baseURL: "https://dummyjson.com", // ganti nanti ke backend Laravel
  headers: { "Content-Type": "application/json" },
});

// helper untuk attach token dari localStorage
export function attachAuth(token?: string) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}
