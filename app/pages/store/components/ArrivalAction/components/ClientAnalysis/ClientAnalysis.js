import * as echarts from '../../../../ec-canvas/echarts';

let app = getApp();
let { marketingSgCustomAnalyze } = require('../../../../../../service/api.js');

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
    params: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
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
    }
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
        lrr: 0}, 'POST').then(res => {
          console.log(res)
        })
      return
      wx.request({
        url: `https://cloud1.ubiwifi.cn${marketingSgCustomAnalyze}`,
        method: 'POST',
        data: {
          sg_id: this.data.params.id,
          from_time: this.data.params.begin_time,
          to_time: this.data.params.end_time,
          lrr: 0
        },
        header: {
          'Cookie': 'sessionid=7vuhmcc1gx5psq9cgpo057o5bdtwc6bx;csrftoken=pgED9Ff6sIi1bGW3qDviEqZHbYU46010;'
        },
        success(res) {
          // that.setData({
          //   selectArray: res.data.data.bgs
          // })
          // console.log(res)
          if(res.code === "1"){
            let ptdcList = res.data.ptdc.ptdc;
            let sdcList = res.data.sdc.sdc;
            let vudcList = res.data.vudc.vudc;

            option.xAxis.data = [];
            option.series[0].data = [];
            option.series[1].data = [];
            option.series[2].data = [];

            this.setChart({
              list: ptdcList,
              index: 0
            });
            this.setChart({
              list: sdcList,
              index: 1
            });
            this.setChart({
              list: vudcList,
              index: 2
            });

            setTimeout(() => {
              chart.hideLoading();
              chart.setOption(option, true);
            }, 1000)

          }
        }
      })
    },
    setChart (obj) {
      for(let i = 0;i<obj.list.length;i++){
        option.xAxis.data[i] = list[i].date;
        option.series[obj.index].data[i] = list[i].count;
      }
    },
    openQuestion(e) {// 打开弹窗
      this.selectComponent('.' + e.target.dataset.btn).show({
        close: false
      });
    },
    closeBtn(e) {// 关闭弹窗
      this.selectComponent('.' + e.target.dataset.btn).hide({});
    },
  }
})
