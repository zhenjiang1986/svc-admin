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

    //设置语言
    config.headers["Accept-Language"] = "zh-Hans";
    //设置缓存相关
    config.headers["Pragma"] = "no-cache";
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Expires"] = "Sat, 01 Jan 2000 00:00:00 GMT";

    return config;
  },
  error => {
    Log.error(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    //Log.info(response)
    //TODO:根据response的status和statusText 来跳转页面
    const data = response.data;

    return data;
  },
  error => {
    Log.error(error); // for debug

    let message = error.message;

    if (error.message.includes("timeout")) {
      // 判断请求异常信息中是否含有超时timeout字符串
      message = "请求超时!";
    }

    Message({
      message: message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
