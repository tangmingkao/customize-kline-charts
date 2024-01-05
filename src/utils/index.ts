
// 自定义判断元素类型JS
export function toType(obj: any): string {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)![1]
    .toLowerCase();
}

// 参数过滤函数
export function filterNull(o: any): any {
  for (let key in o) {
    if (o[key] === null) {
      delete o[key];
    }
    if (toType(o[key]) === "string") {
      o[key] = o[key].trim();
    } else if (toType(o[key]) === "object") {
      o[key] = filterNull(o[key]);
    } else if (toType(o[key]) === "array") {
      o[key] = filterNull(o[key]);
    }
  }
  return o;
}
