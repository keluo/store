import * as echarts from '../../../../ec-canvas/echarts';

let https = require('../../../../../../service/https.js');
let { customerArrivedTimesAjax, customerStayTimeAjax } = require('../../../../../../service/api.js');

let chart = null;

let option = {
  color: ['#5266FF', '#FFA602', '#0386E5', '#56D497', '#38D4DF'],
  xAxis: {
    type: 'category',
    data: ['1次', '2次', '3-5次', '6-9次 ', '多于10次'],
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
    },
    isToday: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    old_customer_avg_times: 0,
    time_lrr: {
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
      https(customerArrivedTimesAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let data = res.data.data;
          let total = data.arrived_1_time + data.arrived_2_time + data.arrived_3to5_time + data.arrived_6to9_time + data.arrived_10_time
          if(total != 0){
            option.series[0].data[0] = (data.arrived_1_time / total * 100).toFixed();
            option.series[0].data[1] = (data.arrived_2_time / total * 100).toFixed();
            option.series[0].data[2] = (data.arrived_3to5_time / total * 100).toFixed();
            option.series[0].data[3] = (data.arrived_6to9_time / total * 100).toFixed();
            option.series[0].data[4] = (data.arrived_10_time / total * 100).toFixed();
          }else{
            option.series[0].data[0] = 0;
            option.series[0].data[1] = 0;
            option.series[0].data[2] = 0;
            option.series[0].data[3] = 0;
            option.series[0].data[4] = 0;
          }

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
      setTimeout(() => {// 获取环比信息
        let ratioParams = this.getPeriodTime();
        https(customerStayTimeAjax, ratioParams, 'get').then(res => {
          if (res.code === "1") {
            this.setData({
              time_lrr: this.getRatio(res.data.data.old_customer_avg_times, this.data.old_customer_avg_times),
            })
          }
        })
      }, 1000)
    },
    getPeriodTime() {// 获取上一个周期时间
      let obj = {
        id: this.data.params.id,
        begin_time: '',
        end_time: ''
      }
      if (this.data.params.day_time == 0) {//今天
        obj['day_id'] = 1
      } else if (this.data.params.day_time == 1) {//昨天
        obj.begin_time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - 1));
        obj.end_time = obj.begin_time;
      } else {//不是同一天
        var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
        days = Math.floor(days) + 1;

        obj.begin_time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - days));
        obj.end_time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - 1));
      }
      return obj
    },
    getRatio: function (oldVal, newVal) {// 获取增减比例
      let obj = {
        plus_minus: true,
        lrr: '--'
      }
      if (oldVal === 0) {
        obj.lrr = 100;
        return obj
      }
      if (oldVal > newVal) {
        let num = oldVal - newVal;
        obj.lrr = ((num / oldVal) * 100).toFixed(2);
        obj.plus_minus = false;
      } else if (oldVal < newVal) {
        let num = newVal - oldVal;
        obj.lrr = ((num / oldVal) * 100).toFixed(2);
      }
      return obj
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
    },
    fmtDate: function (obj) {
      var date = new Date(obj);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
    }
  }
})
