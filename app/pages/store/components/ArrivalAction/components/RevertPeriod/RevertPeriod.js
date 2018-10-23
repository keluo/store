import * as echarts from '../../../../ec-canvas/echarts';

let chart = null;
let chart2 = null;

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
      data: ['1-2天', '3-7天', '8-15天', '16-30天 ', '30天以上'],
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
        name: '顾客平局返店周期',
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

function initChart2(canvas, width, height) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#0386E5', '#FF3C24', '#FFA602'],
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    grid: {
      top: 20
    },
    legend: {
      bottom: 0,
      data: ['星巴克新街口', '星巴克新桥店']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
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
      }
    },
    series: [
      {
        name: '星巴克新街口',
        data: [10, 42, 71, 14, 40, 70, 10],
        type: 'line',
        smooth: true
      },
      {
        name: '星巴克新桥店',
        data: [20, 52, 81, 24, 50, 80, 20],
        type: 'line',
        smooth: true
      }
    ]
  };

  chart2.setOption(option);
  return chart2;
}

// pages/store/components/ArrivalAction/components/RevertPeriod/RevertPeriod.js
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
    },
    ec2: {
      onInit: initChart2
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
