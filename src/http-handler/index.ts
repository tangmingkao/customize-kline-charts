import { camelCase } from "lodash-es";

let requireModule: any = import.meta.glob('./*.ts',{ eager: true });
let modules:any = {};

Object.keys(requireModule).forEach((fileName: any) => {
  if(fileName === './index.ts') return;
  const muduleName = camelCase(fileName.replace(/(\.\/|\.ts)/g, ''));
  modules[muduleName] = requireModule[fileName];
});
// console.log('http-handler:>>>',modules)
export default modules;