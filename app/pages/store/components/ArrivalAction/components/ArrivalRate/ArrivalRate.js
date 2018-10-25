import * as echarts from '../../../../ec-canvas/echarts';

let https = require('../../../../../../service/https.js');
let { customerArrivedTimesAjax, customerStayTimeAjax } = require('../../../../../../service/api.js');

let chart = null;

let option = {
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
    },
    formatter: '{b} : {c}%'
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
      data: [0, 0, 0, 0, 0],
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

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  chart.setOption(option);
  return chart;
}


// pages/store/components/ArrivalAction/components/ArrivalRate/ArrivalRate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据

        setTimeout(() => {
          this.getInfo();
        }, 1000)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    old_customer_avg_times: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInfo () {
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(customerArrivedTimesAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let data = res.data.data;
          let total = data.arrived_1_time + data.arrived_2_time + data.arrived_3to5_time + data.arrived_6to9_time + data.arrived_10_time

          option.series[0].data[0] = ( data.arrived_1_time / total * 100 ).toFixed();
          option.series[0].data[1] = ( data.arrived_2_time / total * 100 ).toFixed();
          option.series[0].data[2] = ( data.arrived_3to5_time / total * 100 ).toFixed();
          option.series[0].data[3] = ( data.arrived_6to9_time / total * 100 ).toFixed();
          option.series[0].data[4] = ( data.arrived_10_time / total * 100 ).toFixed();

          chart.hideLoading();
          chart.setOption(option, true);
        }
      })
      https(customerStayTimeAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          this.setData({
            old_customer_avg_times: res.data.data.old_customer_avg_times.toFixed()
          })
        }
      })
    }
  }
})
