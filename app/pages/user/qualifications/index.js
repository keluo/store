// pages/user/qualifications/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    whole_address: '',
    contact_name: '',
    contact_link: '',
    category: '',
    username:'',
    email:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getInfo();
  },
  getInfo: function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      app.https(app.api.bgInfoApi, {
      }, 'get').then(function (data) {
        data = data.data;
        that.setData({
          name: data.name || '',
          whole_address: data.whole_address || '',
          contact_name: data.contact_name || '',
          contact_link: data.contact_link || '',
          category: data.category || '',
          username: data.username || '',
          email: data.email || ''
        });
        resolve();
      });
    });
  }
})