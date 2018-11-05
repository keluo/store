//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
// const formatTimeNew = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()
//   return [hour, minute].map(formatNumber).join(':')
// }
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//通过key取得index的值
const getGroupForIndex = (group, id, key) => {
  if (!group) {
    return '';
  }
  key = key || 'id';
  var result = '';
  group.forEach(function (item, index) {
    if (item[key] === id) {
      result = index;
    }
  })
  return result;
}
//检测是否有中文  
//有：true
//没有：false
const hasChinese = (val) => {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  return reg.test(val)
}
module.exports = {
  formatTime,
  formatDate,
  getGroupForIndex,
  hasChinese
}
