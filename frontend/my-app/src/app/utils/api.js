export const API_URL = "http://localhost:8000/api/v1";

export const getToken = () =>
  localStorage.getItem("accesstoken"); // ✅ fixed

export const authFetch = async (url, options = {}) => {
  const token = getToken();

  if (!token) throw new Error("Login first");

  const res = await fetch(API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  return res.json();
};
