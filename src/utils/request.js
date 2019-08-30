import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { Log } from "@/utils/log";

import { getToken } from "@/utils/auth";

const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000
});

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }

    return config;
  },
  error => {
    Log.error(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    Log.DEBUG(response)
    //TODO:根据response的statusCode 来跳转页面
    const data = response.data;

    return data;
  },
  error => {
    Log.error(error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service
