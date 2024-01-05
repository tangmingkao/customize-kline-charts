/*
 * 请求方法二次封装
 * 抽象化请求函数
 */
import { cloneDeep } from "lodash-es";
import { requestHandle } from "./request-handle";

export const httpRequest: any = {
  get: (url: string, params: object = {}, responseType: string): any => {
    return requestHandle("get", url, params, responseType);
  },
  post: (url: string, params: object = {}, responseType: string): any => {
    return requestHandle("post", url, params, responseType);
  },
  delete: (url: string, params: object = {}, responseType: string): any => {
    return requestHandle("delete", url, params, responseType);
  },
  put: (url: string, params: object = {}, responseType: string): any => {
    return requestHandle("put", url, params, responseType);
  },
};

// 抽象化请求函数
export function abstractionRequest(
  method: string,
  url: string,
  params: object,
  responseType: string = ""
): any {
  const abstractionPromise = new Promise((resolve, reject) => {
    httpRequest[method](url, params, responseType)
      .then((res: any) => {
        let tempdata = cloneDeep(res);
        // 下载类型要额外处理
        if (responseType == "blob") {
          resolve(res);
        } else {
          let responseCode = tempdata?.code;
          if (responseCode == '0') {
            resolve(tempdata);
          } else {
            reject(tempdata);
          }
        }
      })
      .catch((err: any) => {
        reject(err);
      });
  });
  return abstractionPromise;
}
