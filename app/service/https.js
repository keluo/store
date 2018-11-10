// var rootDocment = 'https://mart.ubiwifi.cn';//你的域名
var rootDocment = 'https://cloud1.ubiwifi.cn';//你的域名

function https(url, data, callBack, method) {
  if(callBack && typeof callBack !== 'function'){
    method = callBack;
  }
  const  p = new Promise(function (resolve, reject) {
    wx.request({
      url: rootDocment + url,
      data: data,
      method: method || 'post',
      header: {
        'Content-Type': 'application/json',
        'authorization': 'Token ' + (wx.getStorageSync('user') ? wx.getStorageSync('user').token : '')
      },
      success: function (res) {
        if (res.statusCode === 401) {
          wx.setStorageSync('token', '');
          wx.showModal({
            showCancel: false,
            content: 'Token已失效，请前往绑定Token',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/account/login/login'
                });
              }
            }
          })
        } else {
          if (res.data && res.data.code === '1') {
            resolve(res.data);
          } else if (res.data && res.data.code === '0') {
            reject(res.data);
          }
        }
      },
      fail: function () {
        wx.showToast({
          title: '服务器请求错误',
          icon: 'none'
        });
      }
    })
  });
  return p;
}


module.exports = https