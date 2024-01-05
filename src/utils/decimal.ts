import Decimal from "decimal.js";
Decimal.set({
  precision: 40,
  toExpNeg: -16,
  toExpPos: 16,
  maxE: 1e15,
  minE: -1e15,
  modulo: 1,
  crypto: false,
});

// 加法
export function decimalAdd(
  num1: string | number,
  num2: string | number
): string {
  return new Decimal(num1).add(new Decimal(num2)).toString();
}

// 减法
export function decimalSub(
  num1: string | number,
  num2: string | number
): string {
  return new Decimal(num1).sub(new Decimal(num2)).toString();
}

// 乘法
export function decimalMul(
  num1: string | number,
  num2: string | number
): string {
  return new Decimal(num1).mul(new Decimal(num2)).toString();
}

// 除法
export function decimalDiv(
  num1: string | number,
  num2: string | number
): string {
  return new Decimal(num1).div(new Decimal(num2)).toString();
}

// 连加
export function multiDecimalAdd(...args: Array<string | number>) {
  return args.reduce((previous, current) => {
    return decimalAdd(previous, current);
  });
}

// 连减
export function multiDecimalSub(...args: Array<string | number>) {
  return args.reduce((previous, current) => {
    return decimalSub(previous, current);
  });
}

// 连乘
export function multiDecimalMul(...args: Array<string | number>) {
  return args.reduce((previous, current) => {
    return decimalMul(previous, current);
  });
}

// 连除
export function multiDecimalDiv(...args: Array<string | number>){
  return args.reduce((previous, current) => {
    return decimalDiv(previous, current);
  });
}

// 保留小数点后位数 向下取小数位
export function decimalToFixedDown(num: string | number, precision: number): string {
  return new Decimal(num).toFixed(precision, Decimal.ROUND_DOWN);
}

// 保留小数点后位数 向上取小数位
export function decimalToFixedUp(num: string | number, precision: number): string {
  return new Decimal(num).toFixed(precision, Decimal.ROUND_UP);
}

// 移除末尾无效0
export const removeEndZero = (value: string | number) => {
  if (value === "--") {
    return "--";
  }
  if (!value) {
    value = "0";
  }
  return new Decimal(value).toNumber();
};

// 格式化千分位
export const showThousands = (num: string | number): string => {
  if (num == "-" || num == "--") {
    return num;
  }
  if (!num) {
    return "0";
  }
  // 判断是否有小数点
  let isDot = num.toString().indexOf(".");
  if (isDot == -1) {
    // 是整数
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  } else {
    // 是小数
    let arr = num.toString().split(".");
    if (arr.length > 1 && arr[1].length < 2) {
      // 一位小数
      return (
        (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") +
        "." +
        arr[1]
      );
    } else {
      // 两位小数
      return (
        (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") +
        "." +
        arr[1]
      );
    }
  }
};

export { Decimal };
