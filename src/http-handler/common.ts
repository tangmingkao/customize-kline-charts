import { abstractionRequest } from "@/http-server";

export function queryKlineList(params: object = {}): any {
  return abstractionRequest("get", "/v2/web/api/v1/market/kline", params);
}
