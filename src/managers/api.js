export const API = "http://127.0.0.1:8000"

export const authHeader = () => ({
  "Authorization": `Token ${localStorage.getItem("auth_token")}`,
  "Accept": "application/json"
})