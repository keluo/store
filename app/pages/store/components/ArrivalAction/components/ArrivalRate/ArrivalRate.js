import * as echarts from '../../../../ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#5266FF', '#FFA602', '#0386E5', '#56D497', '#38D4DF'],
    xAxis: {
      type: 'category',
      data: ['1次', '2次', '3-5次', '6-9次 ', '多于10次'],
      nameTextStyle: {
        fontSize: 10
      }
    },
    grid: {
      top: 20,
      bottom: 20,
      right: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
      },
      position: function (pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        var obj = { top: 60 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
    },
    series: [
      {
        name: '顾客平局到店频次',
        data: [18, 32, 45, 31, 8],
        type: 'bar',
        barWidth: '45%',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: '{c}%'
          }
        },
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = ['#5266FF', '#FFA602', '#0386E5', '#56D497', '#38D4DF'];
              return colorList[params.dataIndex]
            },
            barBorderRadius: [4, 4, 0, 0],
          }
        },
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


// pages/store/components/ArrivalAction/components/ArrivalRate/ArrivalRate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
