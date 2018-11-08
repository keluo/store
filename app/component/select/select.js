// component/select/select.js
import { getGroupForName} from '../../utils/util';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Array
    },
    left:{
      type: Boolean,
      value: false
    },
    nowText: {
      type: String,
      value: '请选择'
    },
    keyId: {
      type: String,
      value: 'id'
    },
    keyName: {
      type: String,
      value: 'name'
    },
    selected: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
        if (newVal){
          this.setData({
            nowId: newVal,
            nowText: getGroupForName(this.data.options, newVal, this.data.keyId, this.data.keyName)
          });
        }
      }
    }
  },
  attached: function (e) {
    if (this.data.selected) {
      this.setData({
        nowId: this.data.selected,
        nowText: getGroupForName(this.data.options, this.data.selected, this.data.keyId, this.data.keyName)
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false,//初始option不显示
    // nowText: "请选择",//初始内容
    animationData: {},//右边箭头的动画,
    nowId:''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    　　　//option的显示与否
    selectToggle: function () {
      var nowShow = this.data.selectShow;//获取当前option显示的状态
      //创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          animationData: animation.export()
        })
      } else {
        animation.rotate(180).step();
        this.setData({
          animationData: animation.export()
        })
      }
      this.setData({
        selectShow: !nowShow
      })
    },
    //设置内容
    setText: function (e) {
      var nowData = this.properties.options;//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
      var nowIdx = e.target.dataset.index;//当前点击的索引
      var nowText = nowData[nowIdx][this.data.keyName];//当前点击的内容
      var nowId = nowData[nowIdx][this.data.keyId];//当前点击的内容
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.animation.rotate(0).step();
      this.setData({
        selectShow: false,
        nowText: nowText,
        nowId: nowId,
        animationData: this.animation.export()
      })
      this.triggerEvent('selected', nowId);
    },
    cancelSelect: function () {
      this.animation.rotate(0).step();
      this.setData({
        selectShow: false,
        animationData: this.animation.export()
      })
    }
  }
})