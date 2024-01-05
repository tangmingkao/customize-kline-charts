<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import {
  init,
  dispose,
  registerFigure,
  registerOverlay,
} from "../kline-charts/index";
import { queryKlineList } from "@/http-handler/common";
import { toType } from "@/utils";

// 处理k线返回数据格式
const handleKlineList = (data) => {
  let tempArr: any = [];
  if (toType(data) != "array") {
    return tempArr;
  } else if (data && data.length > 0) {
    data.forEach((item: any) => {
      tempArr.push({
        timestamp: parseFloat(item[0]) * 1000,
        open: parseFloat(item[1]),
        high: parseFloat(item[3]),
        low: parseFloat(item[4]),
        close: parseFloat(item[2]),
        volume: parseFloat(item[5]),
        turnover: parseFloat(item[6]),
      });
    });
  }
  return tempArr;
};

const getKlineList = () => {
  let requestParams: any = {
    type: "15min",
    market: "BTCUSDT",
    k: "kline",
    start_time: parseInt(`${Date.now() / 1000 - 4 * 24 * 60 * 60}`),
    end_time: parseInt(`${Date.now() / 1000}`),
  };
  return queryKlineList(requestParams);
};

const customizeFigure = {
  name: "diamond",
  checkEventOn: (coordinate, attrs) => {
    console.log("diamond:checkEventOn:>>>>>", coordinate, attrs);
    const { x, y, width, height } = attrs;
    const xDis = Math.abs(coordinate.x - x);
    const yDis = Math.abs(coordinate.y - y);
    return xDis * height + yDis * width < (width * height) / 2;
  },
  draw: (ctx, attrs, styles) => {
    console.log("diamond:draw:>>>>>", ctx, attrs, styles);
    const { x, y, width, height } = attrs;
    const {
      style = "fill",
      color = "currentColor",
      borderSize = 4,
      borderColor = "#00C0AB",
      borderStyle = "solid",
      borderDashedValue = [2, 2],
    } = styles;
    // 绘制填充的菱形
    if (style === "fill" || styles.style === "stroke_fill") {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x - width / 2, y);
      ctx.lineTo(x, y - height / 2);
      ctx.lineTo(x + width / 2, y);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();
      ctx.fill();
    }
    // 绘制边框的菱形
    if (style === "stroke" || styles.style === "stroke_fill") {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderSize;
      if (borderStyle === "dashed") {
        ctx.setLineDash(borderDashedValue);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.beginPath();
      ctx.moveTo(x - width / 2, y);
      ctx.lineTo(x, y - height / 2);
      ctx.lineTo(x + width / 2, y);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();
      ctx.stroke();
    }
  },
};
registerFigure(customizeFigure);

const _overlay = {
  // 名称
  name: "sampleCircle",
  // 完成一个圆的绘制需要三个步骤
  totalStep: 3,
  // 创建点对应的图形信息
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x);
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y);
      // 确定对应点生成的圆的坐标
      const radius = Math.sqrt(xDis * xDis + yDis * yDis);
      // 图表内置了基础图形'circle'，可以直接使用
      return {
        key: "sampleCircle",
        type: "circle",
        attrs: {
          ...coordinates[0],
          r: radius,
        },
        styles: {
          // 选择边框且填充，其它选择使用默认样式
          style: "stroke_fill",
        },
      };
    }
    return [];
  },
};
registerOverlay(_overlay);

onMounted(() => {
  // let _dom: HTMLElement | null = document.getElementById("chart");
  // 初始化图表
  let chart = init("chart", {
    styles: {
      crosshair: {
        horizontal: {
          line: {
            dashedValue: [6, 4],
            size: 1,
            color: "#888888",
          },
        },
        vertical: {
          line: {
            dashedValue: [6, 4],
            size: 1,
            color: "#888888",
          },
        },
      },
    },
  });
  getKlineList()
    .then((res: any) => {
      let tempArr: any = (res && res.data) || [];
      let formatArr = handleKlineList(tempArr);
      // 为图表添加数据
      chart!.applyNewData(formatArr);
    })
    .catch((err: any) => {
      console.log(err);
    });

  // chart?.subscribeAction(ActionType.OnCrosshairChange, (data: any) => {
  //   console.log(data);
  // });

  // chart!.createOverlay("sampleCircle", "candle_pane");
});

onUnmounted(() => {
  // 销毁图表
  dispose("chart");
});
</script>

<template>
  <div id="chart"></div>
</template>
<style lang="scss" scoped>
#chart {
  height: 600px;
  width: 600px;
}
</style>
