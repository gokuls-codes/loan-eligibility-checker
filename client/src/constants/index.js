const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";

const ENDPOINTS = {
  login: "/login",
  register: "/register",
  profile: "/profile",
  eligibility: "/eligibility",
  history: "/history",
  logout: "/logout",
};

export { SERVER_URL, ENDPOINTS };
