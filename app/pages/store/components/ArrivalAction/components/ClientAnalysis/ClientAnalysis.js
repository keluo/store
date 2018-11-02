import * as echarts from '../../../../ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#0386E5', '#FF3C24', '#FFA602'],
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#999',
          fontSize: 10
        }
      }
    },
    grid: {
      top: 20,
      right: 0
    },
    legend: {
      bottom: 0,
      data: ['连接WiFi人数', '推广人数', '核销人数']
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
      },
      formatter: function (params) {
        var res = params[0].name;
        for (var i = 0, l = params.length; i < l; i++) {
          res += '\n' + params[i].seriesName + ' : ' + params[i].value;
        }
        return res
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F9FAFE'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#999',
          fontSize: 10
        }
      }
    },
    series: [
      {
        name: '连接WiFi人数',
        data: [10, 42, 71, 14, 40, 70, 10],
        type: 'line',
        showSymbol: false,
        smooth: true
      },
      {
        name: '推广人数',
        data: [20, 52, 81, 24, 50, 80, 20],
        type: 'line',
        showSymbol: false,
        smooth: true
      },
      {
        name: '核销人数',
        data: [30, 62, 91, 34, 60, 90, 30],
        type: 'line',
        showSymbol: false,
        smooth: true
      },
    ]
  };

  chart.setOption(option);
  return chart;
}

// pages/store/components/ArrivalAction/components/ClientAnalysis/ClientAnalysis.js
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
