/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-27 16:01:10
 * @LastEditTime: 2019-08-12 15:03:34
 * @LastEditors: Please set LastEditors
 */
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
