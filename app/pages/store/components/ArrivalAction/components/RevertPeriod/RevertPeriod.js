import * as echarts from '../../../../ec-canvas/echarts';

let https = require('../../../../../../service/https.js');
let { customerReturnDaysAjax, customerStayTimeAjax, oldCustomerReturnDaysDayAjax } = require('../../../../../../service/api.js');

let chart = null;
let chart2 = null;

let option = {
  color: ['#5266FF', '#FFA602', '#0386E5', '#56D497', '#38D4DF'],
  xAxis: {
    type: 'category',
    data: ['1-2天', '3-7天', '8-15天', '16-30天 ', '30天以上'],
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
      name: '顾客平局返店周期',
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

let option2 = {
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
    data: ['星巴克新街口']
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
    formatter: '{b}\n{a}：{c}天'
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
      name: '星巴克新街口',
      data: [10, 42, 71, 14, 40, 70, 10],
      type: 'line',
      smooth: true,
      showSymbol: false
    }
  ]
};

let option3 = {
  color: ['#0386E5', '#FF3C24', '#FFA602'],
  xAxis: {
    type: 'category',
    data: [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    name: '',
    nameTextStyle: {
      color: '#999',
      fontSize: 10
    },
    nameLocation: 'middle',
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
  legend: {
    bottom: 0,
    data: ['', '']
  },
  grid: {
    top: 20,
    right: 0
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
        res += '\n' + params[i].seriesName + ' : ' + params[i].value + '天';
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
      name: '',
      data: [0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      showSymbol: false,
      smooth: true
    },
    {
      name: '',
      data: [0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      showSymbol: false,
      smooth: true
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

function initChart2(canvas, width, height) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  chart2.setOption(option2);
  return chart2;
}

// pages/store/components/ArrivalAction/components/RevertPeriod/RevertPeriod.js
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
            this.setName();
            this.getDist();
            this.getTrend();
          }, 1000)
        }
      }
    },
    isToday: {
      type: Boolean
    },
    selectArray: {
      type: Array
    }
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
    },
    old_customer_avg_return: 0,
    return_lrr: {
      plus_minus: true,
      lrr: 0
    },
    isVs: false,
    vsId: '',
    nowText: '店铺对比',
    chartShow: true,
    pop: {
      close: true,
      title: '',
      content: ''
    }
  },
  detached() {
    chart.dispose();// 组件实例被从页面节点树移除时销毁echarts实例
    chart2.dispose();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectShow() {//显示选择框回调
      this.setData({
        chartShow: false
      })
    },
    selectHide() {//关闭选择框回调
      this.setData({
        chartShow: true
      })
    },
    getDist () {
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(customerReturnDaysAjax, this.data.params, 'get').then(res => {
          let data = res.data.data;
          let total = data.return_1to2_day + data.return_3to7_day + data.return_8to15_day + data.return_16to30_day + data.return_30_day
          if(total != 0){
            option.series[0].data[0] = (data.return_1to2_day / total * 100).toFixed();
            option.series[0].data[1] = (data.return_3to7_day / total * 100).toFixed();
            option.series[0].data[2] = (data.return_8to15_day / total * 100).toFixed();
            option.series[0].data[3] = (data.return_16to30_day / total * 100).toFixed();
            option.series[0].data[4] = (data.return_30_day / total * 100).toFixed();
          }else{
            option.series[0].data[0] = 0;
            option.series[0].data[1] = 0;
            option.series[0].data[2] = 0;
            option.series[0].data[3] = 0;
            option.series[0].data[4] = 0;
          }

          chart.hideLoading();
          chart.setOption(option, true);
      }).catch(err => {
        wx.showToast({
          title: err.msg,
          icon: 'none',
          duration: 1500
        })
        chart.hideLoading();
      })
      https(customerStayTimeAjax, this.data.params, 'get').then(res => {
        this.setData({
          old_customer_avg_return: res.data.data.old_customer_avg_return.toFixed()
        })
      }).catch(err => {
        wx.showToast({
          title: err.msg,
          icon: 'none',
          duration: 1500
        })
      })
      setTimeout(() => {// 获取环比信息
        let ratioParams = this.getPeriodTime();
        https(customerStayTimeAjax, ratioParams, 'get').then(res => {
          this.setData({
            return_lrr: this.getRatio(res.data.data.old_customer_avg_return, this.data.old_customer_avg_return),
          })
        }).catch(err => {
          wx.showToast({
            title: err.msg,
            icon: 'none',
            duration: 1500
          })
        })
      }, 1000)
    },
    getPeriodTime() {// 获取上一个周期时间
      let list = [
        { begin_time: 1, end_time: 1 },
        { begin_time: 1, end_time: 1 },
        { begin_time: 7, end_time: 1 },
        { begin_time: 15, end_time: 1 },
        { begin_time: 30, end_time: 1 }
      ]
      let obj = {
        id: this.data.params.id,
        begin_time: this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - list[this.data.params.day_time].begin_time)),
        end_time: this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - list[this.data.params.day_time].end_time))
      }
      return obj
    },
    getRatio: function (oldVal, newVal) {// 获取增减比例
      let obj = {
        plus_minus: true,
        lrr: 0
      }
      if (oldVal === 0) {
        obj.lrr = '--';
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
    getTrend () {
      chart2.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(oldCustomerReturnDaysDayAjax, this.data.params, 'get').then(res => {
        let myList = res.data.data;

        option2.xAxis.data = [];
        option2.series[0].data = [];

        if(this.data.params.begin_time === this.data.params.end_time){
          this.setToadyChart({
            begin_time: res.data.begin_time,
            myList: myList,
            option: option2,
            index: 0,
            name: 'return_ds'
          })
        }else{
          this.setNotTodayChart({
            myList: myList,
            option: option2,
            index: 0,
            name: 'return_ds'
          })
        }
        if(!this.data.isVs){
          chart2.hideLoading();
          chart2.setOption(option2, true);
        }
      }).catch(err => {
        wx.showToast({
          title: err.msg,
          icon: 'none',
          duration: 1500
        })
        chart2.hideLoading();
      })
      if(this.data.isVs){
        https(oldCustomerReturnDaysDayAjax,{id:this.data.vsId,begin_time:this.data.params.begin_time,end_time:this.data.params.end_time},'get').then(res => {
          let myList = res.data.data;

          if (this.data.params.begin_time === this.data.params.end_time){
            this.setToadyChart({
              begin_time: res.data.begin_time,
              myList: myList,
              option: option3,
              index: 1,
              name: 'return_ds'
            })
          }else{
            this.setNotTodayChart({
              myList: myList,
              option: option3,
              index: 1,
              name: 'return_ds'
            })
          }
          setTimeout(() => {
            chart2.hideLoading();
            chart2.setOption(option3, true);
          }, 1000)
        }).catch(err => {
          wx.showToast({
            title: err.msg,
            icon: 'none',
            duration: 1500
          })
          chart2.hideLoading();
        })
      }
    },
    bindSelected(id) {
      option3.legend.data[1] = this.data.selectArray.find((item) => {
        return item.id == id.detail
      }).name;
      option3.series[1].name = this.data.selectArray.find((item) => {
        return item.id == id.detail
      }).name;
      if (id.detail == this.data.vsId) {
        this.setData({
          isVs: false,
          vsId: '',
          nowText: '店铺对比'
        })
      } else {
        this.setData({
          isVs: true,
          vsId: id.detail,
        })
      }
      setTimeout(() => {
        this.getTrend()
      }, 1000)
    },
    setName() {
      option2.legend.data[0] = this.data.params.name;
      option2.series[0].name = this.data.params.name;

      option3.legend.data[0] = this.data.params.name;
      option3.series[0].name = this.data.params.name;
    },
    setNotTodayChart(obj) {
      var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
      days = Math.floor(days) + 1;

      for (var i = 0; i < days; i++) {
        var time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() + i));
        obj.option.xAxis.data[i] = time.substring(5, 10);
        obj.option.series[obj.index].data[i] = 0;
        for (var j = 0; j < obj.myList.length; j++) {
          if (time == obj.myList[j].DayTime.slice(0, 10)) {
            obj.option.series[obj.index].data[i] = obj.myList[j][obj.name];
          }
        }
      }
      option3.xAxis.data = option2.xAxis.data;
      option3.series[0] = option2.series[0]
    },
    setToadyChart(obj) {
      obj.begin_time = obj.begin_time.replace(/-/g, '/');
      for (var i = 0; i < 24; i++) {
        var time = new Date(obj.begin_time);
        time = time.setHours(time.getHours() + i);

        obj.option.xAxis.data[i] = this.fmtMin(time);
        // obj.option.series[obj.index].data[i] = 0;
        // for (var j = 0; j < obj.myList.length; j++) {
          // if (this.fmtMin(time) == obj.myList[j].HourTime.slice(11, 16)) {
          //   obj.option.series[obj.index].data[i] = obj.myList[j][obj.name];
          // }
        // }
        if (obj.myList.length == 0){
          obj.option.series[obj.index].data[i] = 0;
        }else{
          obj.option.series[obj.index].data[i] = obj.myList[0][obj.name];
        }
      }
      option3.xAxis.data = option2.xAxis.data;
      option3.series[0] = option2.series[0]
    },
    openPop(e) {// 打开弹窗
      this.setData({
        ['pop.close']: false,
        ['pop.title']: e.currentTarget.dataset.title,
        ['pop.content']: e.currentTarget.dataset.content
      })
    },
    closePop() {// 关闭弹窗
      this.setData({
        ['pop.close']: true
      })
    },
    fmtMin(obj) {
      var date = new Date(obj);
      var h = date.getHours();
      if (h < 10) { h = '0' + h }
      var m = date.getMinutes();
      if (m < 10) { m = '0' + m }
      return h + ':' + m
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
