import * as echarts from '../../ec-canvas/echarts';

let https = require('../../../../service/https.js');
let { keLiuAllTotalAjax, totalCustomerAjax, keLiuDayAjax, jinDianDayAjax, newCustomerAjax } = require('../../../../service/api.js');

let chart = null;
let option = {
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
    data: []
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
    formatter: '{b}\n{a}:{c}'
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
  series: [{
    name: '',
    data: [0, 0, 0, 0, 0, 0, 0],
    type: 'line',
    showSymbol: false,
    smooth: true
  }
  ]
};

let option2 = {
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
    data: ['1','2']
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
    // formatter: '{b} {a}:{c}'
    formatter: function (params) {
      var res = params[0].name;
      for (var i = 0, l = params.length; i < l; i++) {
        res +=  '\n' + params[i].seriesName + ' : ' + params[i].value;
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
      name: '',
      data: [0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      showSymbol: false,
      smooth: true
    },
    {
      name: '2',
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

// pages/store/components/ClientStat/ClientStat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params:{
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
              
        setTimeout(() => {
          this.getTotalInfo();
          this.isKeliu();
        }, 1000)
      }
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
    isActive: 0,
    keLiu_total: 0,
    jinDian_total: 0,
    totalNewCustomer: 0,
    isVs: false,
    vsId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTotalInfo () {
      //获取客流量、进店客
      https(keLiuAllTotalAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          this.setData({
            keLiu_total: res.data.ke_liu,
            jinDian_total: res.data.ru_dian
          })
        }
      })
      //获取新顾客
      https(totalCustomerAjax, this.data.params, 'get').then(res => {
        if (res.code === "1") {
          this.setData({
            totalNewCustomer: res.data.data.totalNewCustomer
          })
        }
      })
    },
    getPeriodTime () {

    },
    isKeliu() {
      this.setData({
        isActive: 0
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      this.setName();
      https(keLiuDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.xAxis.name = ' ';
          option.series[0].data = [];
          //查一天
          if (this.data.params.begin_time == this.data.params.end_time) {
            this.setTodayChart({
              begin_time: res.data.begin_time,
              option: option,
              index: 0,
              myList: myList,
              name: 'ke_liu'
            })
          } else {
            // 不是同一天
            this.setNotToadyChart({
              myList: myList,
              option: option,
              index: 0,
              name: 'ke_liu'
            });
          }

          if(!this.data.isVs){
            chart.hideLoading();
            chart.setOption(option, true);
          }
        }
      })
      if (this.data.isVs) {
        https(keLiuDayAjax, { id: this.data.vsId, begin_time: this.data.params.begin_time, end_time: this.data.params.end_time }, 'get').then(res => {
          let myList = res.data.data

          if (this.data.params.begin_time == this.data.params.end_time){
            this.setTodayChart({
              begin_time: res.data.begin_time,
              option: option2,
              index: 1,
              myList: myList,
              name: 'ke_liu'
            })
          }else{
            this.setNotToadyChart({
              myList: myList,
              option: option2,
              index: 1,
              name: 'ke_liu'
            });
          }
          setTimeout(() => {
            chart.hideLoading();
            chart.setOption(option2, true);
          }, 1000)
          
        })
      }
    },
    isJindian() {
      this.setData({
        isActive: 1
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      this.setName();
      https(jinDianDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.xAxis.name = ' ';
          option.series[0].data = [];
          //查一天
          if (this.data.params.begin_time == this.data.params.end_time) {
            this.setTodayChart({
              begin_time: res.data.begin_time,
              option: option,
              index: 0,
              myList: myList,
              name: 'jin_dian'
            })
          } else {
            // 不是同一天
            this.setNotToadyChart({
              myList: myList,
              option: option,
              index: 0,
              name: 'jin_dian'
            });
          }
          if(!this.data.isVs){
            chart.hideLoading();
            chart.setOption(option, true);
          }
        }
      })
      if(this.data.isVs){
        https(jinDianDayAjax, {id:this.data.vsId,begin_time:this.data.params.begin_time,end_time:this.data.params.end_time}, 'get').then(res => {
          let myList = res.data.data

          if (this.data.params.begin_time == this.data.params.end_time){
            this.setTodayChart({
              begin_time: res.data.begin_time,
              option: option2,
              index: 1,
              myList: myList,
              name: 'jin_dian'
            })
          }else{
            this.setNotToadyChart({
              myList: myList,
              option: option2,
              index: 1,
              name: 'jin_dian'
            });
          }
          setTimeout(() => {
            chart.hideLoading();
            chart.setOption(option2, true);
          }, 1000)
        })
      }
      
    },
    isXinke() {
      this.setData({
        isActive: 2
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      this.setName();
      https(newCustomerAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.series[0].data = [];
          // 查一天
          if (this.data.params.begin_time == this.data.params.end_time) {
            for (var i = 0; i < 24; i++) {
              var time = new Date(res.data.begin_time);
              time = time.setHours(time.getHours() + i);

              option.xAxis.data[i] = ' ',
              option.series[0].data[i] = myList[0].new_customers;
              option.xAxis.name = this.data.params.begin_time.substring(5, 10);

            }
            chart.hideLoading();
            chart.setOption(option, true);
          } else {
            // 不是同一天
            this.setNotToadyChart({
              myList: myList,
              option: option,
              index: 0,
              name: 'new_customers'
            });
            chart.hideLoading();
            chart.setOption(option, true);
          }
        }
      })
      if(this.data.isVs){

      }
    },
    bindSelected (id) {
      option2.legend.data[1] = this.data.selectArray.find((item) => {
        return item.id == id.detail
      }).name;
      option2.series[1].name = this.data.selectArray.find((item) => {
        return item.id == id.detail
      }).name;
      this.setData({
        isVs: true,
        vsId: id.detail,
      })
      setTimeout(() => {
        this.isKeliu()
      }, 1000)
    },
    setName () {
      option.legend.data[0] = this.data.params.name;
      option.series[0].name = this.data.params.name;

      option2.legend.data[0] = this.data.params.name;
      option2.series[0].name = this.data.params.name;
    },
    setNotToadyChart(obj) {
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
      option2.xAxis.data = option.xAxis.data;
      option2.series[0] = option.series[0]
    },
    setTodayChart(obj) {
      for (var i = 0; i < 24; i++) {
        var time = new Date(obj.begin_time);
        time = time.setHours(time.getHours() + i);

        obj.option.xAxis.data[i] = this.fmtMin(time);
        obj.option.series[obj.index].data[i] = 0;

        for (var j = 0; j < obj.myList.length; j++) {
          if (this.fmtMin(time) == obj.myList[j].HourTime.slice(11, 16)) {
            obj.option.series[obj.index].data[i] = obj.myList[j][obj.name];
          }
        }

      }
      option2.xAxis.data = option.xAxis.data;
      option2.series[0] = option.series[0]
    },
    fmtMin (obj) {
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
    },
  }
})
