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
    footShow: true,
    hideCallback:null,
    showCallback:null
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
    init: function (options){
      var closeBtn = options ? (typeof options.close == "boolean" ? options.close : true) : true;
      var foot = options ? (typeof options.foot == "boolean" ? options.foot : true) : true;
      var hideCallback = options ? (typeof options.hideCallback == "function" ? options.hideCallback : null) : null;
      var showCallback = options ? (typeof options.showCallback == "function" ? options.showCallback : null) : null;
      this.setData({
        isShow: true,
        closeShow: closeBtn,
        footShow: foot,
        hideCallback: hideCallback,
        showCallback: showCallback
      });
      return this;
    },
    show: function(options){
      if (!options) {
        var closeBtn = options ? (typeof options.close == "boolean" ? options.close : true) : true;
        var foot = options ? (typeof options.foot == "boolean" ? options.foot : true) : true;
        var hideCallback = options ? (typeof options.hideCallback == "function" ? options.hideCallback : null) : null;
        var showCallback = options ? (typeof options.showCallback == "function" ? options.showCallback : null) : null;
        this.setData({
          isShow: true,
          closeShow: closeBtn,
          footShow: foot,
          hideCallback: hideCallback,
          showCallback: showCallback
        });
      }
      if (typeof this.data.showCallback == 'function') {
        this.data.showCallback();
      }
    },
    hide: function (callback) {
      callback = typeof callback == 'function' ? callback : this.data.hideCallback;
      this.setData({
        isShow: false
      });
      if (typeof callback == 'function'){
        callback();
      }
    }
  }
})
