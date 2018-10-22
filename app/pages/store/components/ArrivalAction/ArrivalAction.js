// pages/store/components/ArrivalAction/ArrivalAction.js
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
    isActive: 0
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
    },
    isArrivalRate () {
      this.setData({
        isActive: 2
      })
    },
    isRevertPeriod () {
      this.setData({
        isActive: 3
      })
    }
  }
})
