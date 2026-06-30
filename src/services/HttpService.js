import axios from "axios";
import UserService from "./UserService";

const HttpMethods = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT",
};

const _axios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const configure = () => {
  _axios.interceptors.request.use((config) => {
    if (UserService.isLoggedIn()) {
      const cb = () => {
        config.headers.Authorization =
          `Bearer ${UserService.getToken()}`;
        return Promise.resolve(config);
      };

      return UserService.updateToken(cb);
    }

    return config;
  });
};

const getAxiosClient = () => _axios;

const HttpService = {
  HttpMethods,
  configure,
  getAxiosClient,
};

export default HttpService;