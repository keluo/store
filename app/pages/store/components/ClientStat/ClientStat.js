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
    formatter: '{b}\n{a}：{c}人'
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
        res +=  '\n' + params[i].seriesName + ' : ' + params[i].value + '人';
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
        if (newVal.id != '' && newVal.begin_time != ''){
          if(oldVal){
            if (newVal.id == oldVal.id && newVal.begin_time == oldVal.begin_time) {
              return
            }
          }
          setTimeout(() => {
            this.getTotalInfo();
            this.setName();
            this.isKeliu();
          }, 1000)
        }
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
    keLiu_lrr: {
      lrr: 0,
      plus_minus: true
    },
    jinDian_lrr: {
      lrr: 0,
      plus_minus: true
    },
    newCustomer_lrr: {
      lrr: 0,
      plus_minus: true
    },
    isVs: false,
    vsId: '',
    pop: {
      close: true,
      title: '',
      content: '' 
    },
    chartShow: true
  },
  detached(){
    chart.dispose();// 组件实例被从页面节点树移除时销毁echarts实例
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectShow () {//显示选择框回调
      this.setData({
        chartShow: false
      })
    },
    selectHide () {//关闭选择框回调
      this.setData({
        chartShow: true
      })
    },
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

      // 获取环比
      setTimeout(() => {
        let ratioParams = this.getPeriodTime();
        https(totalCustomerAjax, ratioParams, 'get').then(res => {//新客环比
          if (res.code === "1") {
            this.setData({
              newCustomer_lrr: this.getRatio(res.data.data.totalNewCustomer, this.data.totalNewCustomer)
            })
          }
        })
        https(keLiuAllTotalAjax, ratioParams, 'get').then(res => {//客流、进店环比
          if (res.code === "1") {
            this.setData({
              keLiu_lrr: this.getRatio(res.data.ke_liu, this.data.keLiu_total),
              jinDian_lrr: this.getRatio(res.data.ru_dian, this.data.jinDian_total)
            })
          }
        })
      }, 1000)
    },
    getPeriodTime () {// 获取上一个周期时间
      let obj = {
        id: this.data.params.id,
        begin_time: '',
        end_time: ''
      }
      if (this.data.params.day_time == 0){//今天
        obj['day_id'] = 1
      } else if (this.data.params.day_time == 1){//昨天
        obj.begin_time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - 1));
        obj.end_time = obj.begin_time;
      }else{//不是同一天
        var days = (new Date(this.data.params.end_time).getTime() - new Date(this.data.params.begin_time).getTime()) / (1000 * 60 * 60 * 24);
        days = Math.floor(days) + 1;

        obj.begin_time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - days));
        obj.end_time = this.fmtDate(new Date(this.data.params.begin_time).setDate(new Date(this.data.params.begin_time).getDate() - 1));
      }
      return obj
    },
    getRatio: function(oldVal,newVal){// 获取增减比例
      let obj = {
        plus_minus: true,
        lrr: 0
      }
      if(oldVal === 0){
        obj.lrr = '--';
        return obj
      }
      if (oldVal > newVal){
        let num = oldVal - newVal;
        obj.lrr = ((num / oldVal) * 100).toFixed(2);
        obj.plus_minus = false;
      }else if(oldVal < newVal){
        let num = newVal - oldVal;
        obj.lrr = ((num / oldVal) * 100).toFixed(2);
      }
      return obj
    },
    isKeliu() {
      this.setData({
        isActive: 0
      })
      chart.showLoading('default', {
        text: '',
        color: '#5b9bd1',
      });
      https(keLiuDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.xAxis.name = '';
          option2.xAxis.name = '';
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
            setTimeout(() => {
              chart.hideLoading();
              chart.setOption(option, true);
            }, 1000)
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
      https(jinDianDayAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.xAxis.name = '';
          option2.xAxis.name = '';
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
      https(newCustomerAjax, this.data.params, 'get').then(res => {
        if(res.code === "1"){
          let myList = res.data.data;

          option.xAxis.data = [];
          option.series[0].data = [];
          option.xAxis.name = '';
          option2.xAxis.name = '';
          // 查一天
          if (this.data.params.begin_time == this.data.params.end_time) {
            for (var i = 0; i < 24; i++) {
              var time = new Date(res.data.begin_time);
              time = time.setHours(time.getHours() + i);

              option.xAxis.data[i] = ' ',
              option.series[0].data[i] = myList[0].new_customers;
              option.xAxis.name = this.data.params.begin_time.substring(5, 10);
            }
          } else {// 不是同一天
            this.setNotToadyChart({
              myList: myList,
              option: option,
              index: 0,
              name: 'new_customers'
            });
          }
          if (!this.data.isVs) {
            setTimeout(() => {
              chart.hideLoading();
              chart.setOption(option, true);
            }, 1000)
          }
        }
      })
      if(this.data.isVs){
        https(newCustomerAjax, { id: this.data.vsId, begin_time: this.data.params.begin_time, end_time: this.data.params.end_time }, 'get').then(res => {
          let myList = res.data.data

          if (this.data.params.begin_time == this.data.params.end_time) {
            // this.setTodayChart({
            //   begin_time: res.data.begin_time,
            //   option: option2,
            //   index: 1,
            //   myList: myList,
            //   name: 'new_customers'
            // })
            for (var i = 0; i < 24; i++) {
              var time = new Date(res.data.begin_time);
              time = time.setHours(time.getHours() + i);

              option2.xAxis.data[i] = ' ',
              option2.series[1].data[i] = myList[0].new_customers;
              option2.xAxis.name = this.data.params.begin_time.substring(5, 10);

            }
          } else {
            this.setNotToadyChart({
              myList: myList,
              option: option2,
              index: 1,
              name: 'new_customers'
            });
          }
          
          setTimeout(() => {
            chart.hideLoading();
            chart.setOption(option2, true);
          }, 1000)
        })
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
      obj.begin_time = obj.begin_time.replace(/-/g, '/');
      for (var i = 0; i < 24; i++) {
        var time = new Date(obj.begin_time);
        time = time.setHours(time.getHours() + i);
        obj.option.xAxis.data[i] = this.fmtMin(time);
        obj.option.series[obj.index].data[i] = '';

        for (var j = 0; j < obj.myList.length; j++) {
          if (this.fmtMin(time) == obj.myList[j].HourTime.slice(11, 16)) {
            obj.option.series[obj.index].data[i] = obj.myList[j][obj.name];
          }
        }

      }
      option2.xAxis.data = option.xAxis.data;
      option2.series[0] = option.series[0]
    },
    openPop (e) {// 打开弹窗
      this.setData({
        ['pop.close']: false,
        ['pop.title']: e.target.dataset.title,
        ['pop.content']: e.target.dataset.content
      })
    },
    closePop (e) {// 关闭弹窗
      this.setData({
        ['pop.close']: true
      })
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
