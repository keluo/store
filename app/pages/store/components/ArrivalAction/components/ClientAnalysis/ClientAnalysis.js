import * as echarts from '../../../../ec-canvas/echarts';

let app = getApp();
let { marketingSgCustomAnalyze } = require('../../../../../../service/api.js');

let chart = null;

let option = {
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
    data: ['连接WiFi数', '推广人数', '核销券数']
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
      let actions = ['次', '人', '张'];
      var res = params[0].name;
      for (var i = 0, l = params.length; i < l; i++) {
        res += '\n' + params[i].seriesName + ' : ' + params[i].value + actions[params[i].componentIndex];
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
    },
    minInterval: 1
  },
  series: [
    {
      name: '连接WiFi数',
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
      name: '核销券数',
      data: [30, 62, 91, 34, 60, 90, 30],
      type: 'line',
      showSymbol: false,
      smooth: true
    },
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

// pages/store/components/ArrivalAction/components/ClientAnalysis/ClientAnalysis.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        if (newVal.id != '' && newVal.begin_time != '') {
          if (oldVal) {
            if (newVal.id == oldVal.id && newVal.begin_time == oldVal.begin_time) {
              return
            }
          }
          setTimeout(() => {
            this.getInfo();
          }, 1000)
        }
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
    ptdc: {
      count: 0,
      lrr: 0,
      plus_minus: true
    },
    sdc: {
      count: 0,
      lrr: 0,
      plus_minus: true
    },
    vudc: {
      count: 0,
      lrr: 0,
      plus_minus: true
    },
    pop: {
      close: true,
      title: '',
      content: ''
    }
  },
  detached() {
    chart.dispose();// 组件实例被从页面节点树移除时销毁echarts实例
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
      app.https(marketingSgCustomAnalyze, {
        sg_id: this.data.params.id,
        from_time: this.data.params.begin_time,
        to_time: this.data.params.end_time,
        lrr: '1'}, 'POST').then(res => {

          let ptdcList = res.data.ptdc.ptdc;
          let sdcList = res.data.sdc.sdc;
          let vudcList = res.data.vudc.vudc;

          this.setData({
            ['ptdc.count']: res.data.ptdc.total_count || 0,
            ['ptdc.lrr']: res.data.ptdc.lrr_percent || 0,
            ['ptdc.plus_minus']: res.data.ptdc.plus_minus || true,
            ['sdc.count']: res.data.sdc.total_count || 0,
            ['sdc.lrr']: res.data.sdc.lrr_percent || 0,
            ['sdc.plus_minus']: res.data.sdc.plus_minus || true,
            ['vudc.count']: res.data.vudc.total_count || 0,
            ['vudc.lrr']: res.data.vudc.lrr_percent || 0,
            ['vudc.plus_minus']: res.data.vudc.plus_minus || true,
          })

          option.xAxis.data = [];
          option.series[0].data = [];
          option.series[1].data = [];
          option.series[2].data = [];

          this.setCharts({
            list: ptdcList,
            index: 0
          });
          this.setCharts({
            list: sdcList,
            index: 1
          });
          this.setCharts({
            list: vudcList,
            index: 2
          });

          setTimeout(() => {
            chart.hideLoading();
            chart.setOption(option, true);
          }, 1000)
        })
    },
    setCharts (obj) {
      for(let i = 0;i<obj.list.length;i++){
        option.xAxis.data[i] = obj.list[i].date;
        option.series[obj.index].data[i] = obj.list[i].count;
      }
    },
    openPop(e) {// 打开弹窗
      this.setData({
        ['pop.close']: false,
        ['pop.title']: e.target.dataset.title,
        ['pop.content']: e.target.dataset.content
      })
    },
    closePop(e) {// 关闭弹窗
      this.setData({
        ['pop.close']: true
      })
    }
  }
})
