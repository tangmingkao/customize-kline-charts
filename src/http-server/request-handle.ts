import Http from "./http";
import Bowser from "bowser";
import { filterNull } from "@/utils/index";
import { AxiosError, AxiosResponse } from "axios";

// 浏览器Navigator
const Navigator: Navigator = window.navigator;
// 如果浏览器支持Intl对象，设置时区。
let timeZone: string = "Asia/Shanghai";
if (
  Intl &&
  Intl.DateTimeFormat &&
  Intl.DateTimeFormat() &&
  Intl.DateTimeFormat().resolvedOptions()
) {
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// 系统平台
const browser = Bowser.getParser(Navigator.userAgent);
const platFormObj = browser.getPlatform();
// 系统型号
const browserObj = browser.getBrowser();
// 系统
const browserOs = browser.getOS();

// request headers
const headerJson = {
  "Content-Type": "application/x-www-form-urlencoded",
  // 语言
  "Accept-Language": "zh-hant",
  // 计价单位
  "Accept-Currency": "cny",
  // 设置版本号
  v: "2.0.0",
  // 设置昼夜模式
  t: "black",
  // 设置时区
  z: timeZone,
  'platform': (platFormObj && platFormObj.type) || "web",
  s: (browserOs && browserOs.name) || "macOS",
  b: (browserObj && browserObj.name) || "Chrome",
};
const httpOptions = {
  baseURL: import.meta.env.VITE_APP_API,
  timeout: 60000,
  headers: {
    ...headerJson,
  },
};

// 实例化 Http
let httpInstance: any;
httpInstance = new Http(httpOptions);
export function requestHandle(
  method: string,
  url: string,
  params: object,
  responseType: string
) {
  // 请求实例header对象
  let headerExtendOpts = {
    ...headerJson,
  };
  // 格式化下请求参数中的空格以及空值
  params = filterNull(params);

  // 下载blob类型处理
  if (responseType == "blob") {
    const blobOpts = {
      "content-disposition": "attachment;filename=total.xls",
      "Content-Type": "application/x-download;charset=utf-8",
    };
    headerExtendOpts = {
      ...headerExtendOpts,
      ...blobOpts,
    };
  }

  // 上传类型处理
  if (responseType == "upload") {
    const uploadOpts = {
      "Content-Type": "multipart/form-data;",
    };
    headerExtendOpts = {
      ...headerExtendOpts,
      ...uploadOpts,
    };
  }

  // 请求header一些额外配置
  const requestOpts = {
    responseType: responseType || "json",
    headers: {
      ...headerExtendOpts,
    },
  };
  const requestParams = params;
  // request
  let requestPromise = new Promise((resolve, reject) => {
    let httpMethod = httpInstance[method];
    httpMethod(url, requestParams, requestOpts)
      .then((res: AxiosResponse<any, any>) => {
        let { data, status} = res;
        if (status == 200) {
          resolve(data);
        } else {
          // 接口返回不是200情形
          reject(res);
        }
      })
      .catch((err: AxiosError<any, any>) => {
        // 401 403 500.... switch-case 去判断每个状态码代表的含义
        // ...
        reject(err);
      });
  });
  return requestPromise;
}
