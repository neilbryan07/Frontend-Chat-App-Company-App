import axios from "axios";

const api = `https://chat.611systems.com/public/api`;

// const api = `http://127.0.0.1:8000/api`;

const clearAccessToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("theme");
};

axios.defaults.baseURL = api;

axios.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "access_token"
    )}`;
    config.headers["Access-Control-Allow-Headers"] = "*";
    config.headers["Access-Control-Allow-Headers"] =
      "POST, GET, PUT, OPTIONS, DELETE";
    config.headers["Access-Control-Allow-Headers"] =
      "Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type";
    config.headers["Accept"] = "application/x-www-form-urlencoded";

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      clearAccessToken();
      return Promise.reject(error);
    }
    if (error.response && error.response.status === 403) {
      // LocalStorageService.clearToken();
      clearAccessToken();

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

export const setTheme = (theme) => {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
};
