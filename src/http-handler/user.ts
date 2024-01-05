import { abstractionRequest } from "@/http-server";

export function loginByEmail(params: CommonObj = {}): any {
  return abstractionRequest('post','/v2/login',params); 
} 