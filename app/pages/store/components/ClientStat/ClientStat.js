import * as echarts from '../../ec-canvas/echarts';

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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    legend: {
      bottom: 0,
      data: ['星巴克新街口店']
    },
    grid: {
      top: 20
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
      type: 'value'
    },
    series: [{
      name: '星巴克新街口店',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }]
  };

  chart.setOption(option);
  return chart;
}

// pages/store/components/ClientStat/ClientStat.js
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
    isActive: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isKeliu() {
      this.setData({
        isActive: 0
      })
    },
    isJindian() {
      this.setData({
        isActive: 1
      })
    },
    isXinke() {
      this.setData({
        isActive: 2
      })
    }
  }
})
