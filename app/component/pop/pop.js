// component/pop/pop.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    closeShow: true,
    footShow: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * options{
     *  close Boolean型 关闭按钮是否显示
     *  foot Boolean型 底部是否显示
     * }
     * 
     */
    show: function(options){
      var closeBtn = options ? (typeof options.close == "boolean" ? options.close : true) : true;
      var foot = options ? (typeof options.foot == "boolean" ? options.foot : true) : true;
      this.setData({
        isShow:true,
        closeShow: closeBtn,
        footShow: foot
      });
    },
    hide: function () {
      this.setData({
        isShow: false
      });
    }
  }
})
