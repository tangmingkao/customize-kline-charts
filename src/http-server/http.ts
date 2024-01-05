import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/*
 * Class
 * Http class
 */
class Http {
  options: AxiosRequestConfig;
  queue: CommonObj;
  constructor(options: AxiosRequestConfig) {
    this.options = options;
    this.queue = {};
  }
  // merge parameters
  mergeOptions(options: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.options,
      ...options,
    };
  }
  // set request
  setInterceptor(instance: AxiosInstance): void {
    instance.interceptors.request.use((config) => {
      config.headers = Object.assign({}, config.headers, {
        "Content-Type": "application/x-www-form-urlencoded",
      });
      return config;
    });
    instance.interceptors.response.use(
      (response) => {
        return Promise.resolve(response);
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // user's parameters + default parameters = total parameters
  request(options: AxiosRequestConfig): Promise<AxiosResponse<any, any>> {
    let opts: AxiosRequestConfig = this.mergeOptions(options);
    let instance: AxiosInstance = axios.create();
    // add interceptor
    this.setInterceptor(instance);
    // when axios.request is called, an axios instance is created internally and configuration properties are passed to this instance
    // console.log('request:>>>>',opts);
    return instance(opts);
  }

  // get method
  get = (
    url: string,
    params: object,
    requestOpts: any = {}
  ): Promise<AxiosResponse<any, any>> =>{
    return this.request({
      url,
      method: "get",
      params: params,
      ...requestOpts,
    });
  };

  // post method
  post = (
    url: string,
    params: object,
    requestOpts: any = {}
  ): Promise<AxiosResponse<any, any>> => {
    const { responseType } = requestOpts || "";
    if (responseType == "upload") {
      const extendOpt = {
        responseType: "json",
      };
      requestOpts = { ...requestOpts, ...extendOpt };
    }
    return this.request({
      url,
      method: "post",
      data: params,
      ...requestOpts,
    });
  };

  // delete method
  delete = (
    url: string,
    params: object,
    requestOpts: any = {}
  ): Promise<AxiosResponse<any, any>> => {
    return this.request({
      method: "delete",
      url,
      data: params,
      ...requestOpts,
    });
  };

  // put method
  put = (
    url: string,
    params: object,
    requestOpts: any = {}
  ): Promise<AxiosResponse<any, any>> => {
    return this.request({
      method: "put",
      url,
      data: params,
      ...requestOpts,
    });
  };
}

export default Http;
