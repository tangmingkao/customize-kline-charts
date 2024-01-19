<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import {
  init,
  dispose,
  TooltipIconPosition,
YAxisType,
ActionType,
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
    type: "1day",
    market: "BTCUSDT",
    k: "kline",
    start_time: parseInt(`${Date.now() / 1000 - 300 * 24 * 60 * 60}`),
    end_time: parseInt(`${Date.now() / 1000}`),
  };
  return queryKlineList(requestParams);
};

onMounted(() => {
  // let _dom: HTMLElement | null = document.getElementById("chart");
  const color = "#76808F";
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
      indicator: {
        tooltip: {
          icons: [
            {
              id: "visible",
              position: TooltipIconPosition.Middle,
              marginLeft: 8,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: "\ue903",
              fontFamily: "icomoon",
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: "transparent",
              activeBackgroundColor: "rgba(22, 119, 255, 0.1)",
            },
            {
              id: "invisible",
              position: TooltipIconPosition.Middle,
              marginLeft: 8,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: "\ue901",
              fontFamily: "icomoon",
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: "transparent",
              activeBackgroundColor: "rgba(22, 119, 255, 0.1)",
            },
            {
              id: "setting",
              position: TooltipIconPosition.Middle,
              marginLeft: 6,
              marginTop: 7,
              marginBottom: 0,
              marginRight: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: "\ue902",
              fontFamily: "icomoon",
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: "transparent",
              activeBackgroundColor: "rgba(22, 119, 255, 0.1)",
            },
            {
              id: "close",
              position: TooltipIconPosition.Middle,
              marginLeft: 6,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: "\ue900",
              fontFamily: "icomoon",
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: "transparent",
              activeBackgroundColor: "rgba(22, 119, 255, 0.1)",
            },
          ],
        },
      },
      yAxis: {
        type: YAxisType.Normal,
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

  chart?.subscribeAction(ActionType.OnPlusClick, (data: any) => {
    console.log('ActionType.OnPlusClick:>>>',data);
  });

  chart?.createIndicator(
    {
      name: "MA",
      // @ts-expect-error
      createTooltipDataSource: ({ indicator, defaultStyles }) => {
        const icons = [];
        if (indicator.visible) {
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[1]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[2]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[3]);
        } else {
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[0]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[2]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[3]);
        }
        return { icons };
      },
    },
    false,
    {
      id: "candle_pane",
      position: "top",
      gap: {
        top: 0.2,
        bottom: 0.1,
      },
    }
  );

  chart?.createIndicator(
    {
      name: "VOL",
      // @ts-expect-error
      createTooltipDataSource: ({ indicator, defaultStyles }) => {
        const icons = [];
        if (indicator.visible) {
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[1]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[2]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[3]);
        } else {
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[0]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[2]);
          // @ts-expect-error
          icons.push(defaultStyles.tooltip.icons[3]);
        }
        return { icons };
      },
    },
  );

  // chart!.createOverlay({
  //   name: "simpleAnnotation",
  //   needDefaultPointFigure: true,
  //   points: [{
  //     timestamp: 1704240000000,
  //     value: 44977.99,
  //   }],
  //   extendData: "B",
  //   onClick: (event) => {
  //     console.log(event);
  //     return true;
  //   },
  // }, "candle_pane");

  // chart!.createOverlay({
  //   name: 'segment',
  //   id: 'segment_1',
  //   groupId: 'segment',
  //   points: [
  //     { timestamp: 1704863700000, value: 44297.9 },
  //     { timestamp: 1704870900000, value: 44297.9 },
  //   ],
  //   styles: {
  //     line: {
  //       style: 'solid' as LineType,
  //       dashedValue: [2, 2],
  //       color: '#f00',
  //       size: 2
  //     }
  //   },
  //   visible: true,
  //   mode: 'normal' as OverlayMode,
  //   modeSensitivity: 8,
  //   needDefaultPointFigure: false,
  //   needDefaultXAxisFigure: false,
  //   needDefaultYAxisFigure: false,
  //   onMouseEnter: function (event) {
  //     console.log(event);
  //     return true;
  //   },
  // },"candle_pane");
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
