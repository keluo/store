// pages/store/components/ArrivalAction/ArrivalAction.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        if (newVal.begin_time == this.fmtDate(new Date())) {
          this.triggerEvent('myevent');
          this.setData({
            isToday: true
          })
        } else {
          this.setData({
            isToday: false
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isActive: 0,
    isToday: false
  },

  onShow: function () {
    console.log(1)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isClientAnalysis () {
      this.setData({
        isActive: 0
      })
    },
    isStayTime () {
      this.setData({
        isActive: 1
      })
      this.cheackToday();
    },
    isArrivalRate () {
      this.setData({
        isActive: 2
      })
      this.cheackToday();
    },
    isRevertPeriod () {
      this.setData({
        isActive: 3
      })
      this.cheackToday();
    },
    cheackToday () {
      if (this.data.params.begin_time == this.fmtDate(new Date())) {
        this.triggerEvent('myevent');
        this.setData({
          isToday: true
        })
      }else{
        this.setData({
          isToday: false
        })
      }
    },
    fmtDate (obj) {
      var date = new Date(obj);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
    }
  }
})
