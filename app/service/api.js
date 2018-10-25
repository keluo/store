const homeInit = '/ubiasset/home/';

const keLiuAllTotalAjax = '/inner-api/ke_liu/all/total'; //客流统计 —— 客流、进店客 总
const totalCustomerAjax = '/inner-api/customer/total/customer'; //客流统计 —— 新顾客、老顾客 总
const keLiuDayAjax = '/inner-api/ke_liu/day'; // 客流统计 —— 客流趋势图
const jinDianDayAjax = '/inner-api/jin_dian/day'; // 客流统计 —— 进店趋势图
const newCustomerAjax = '/inner-api/customer/new'; //客流统计 —— 新顾客趋势图

const allCustomerStayInfoAjax = '/inner-api/customer/all/stay_info'; //进店行为 —— 驻店时长 —— 全部 平均驻店时长、离店率
const newCustomerStayInfoAjax = '/inner-api/customer/new/stay_info'; //进店行为 —— 驻店时长 —— 新 平均驻店时长、离店率
const oldCustomerStayInfoAjax = '/inner-api/customer/old/stay_info'; //进店行为 —— 驻店时长 —— 老 平均驻店时长、离店率

const allCustomerStayTimeAjax = '/inner-api/customer/all/stay_time'; //进店行为 —— 驻店时长 —— 全部 驻店时长分布
const newCustomerStayTimeAjax = '/inner-api/customer/new/stay_time'; //进店行为 —— 驻店时长 —— 新 驻店时长分布
const oldCustomerStayTimeAjax = '/inner-api/customer/old/stay_time'; //进店行为 —— 驻店时长 —— 老 驻店时长分布

const customerArrivedTimesAjax = '/inner-api/customer/arrived_times'; //进店行为 —— 到店频次 —— 分布
const customerStayTimeAjax = '/inner-api/customer/old/misc_info'; //进店行为 —— 到店频次、返店周期 —— 老客到店频次、老客返店周期

const customerReturnDaysAjax = '/inner-api/customer/return_days'; //进店行为 —— 返店周期 —— 分布

module.exports = {
  homeInitApi: homeInit,
  keLiuAllTotalAjax,
  totalCustomerAjax,
  keLiuDayAjax,
  jinDianDayAjax,
  newCustomerAjax,
  allCustomerStayInfoAjax,
  newCustomerStayInfoAjax,
  oldCustomerStayInfoAjax,
  allCustomerStayTimeAjax,
  newCustomerStayTimeAjax,
  oldCustomerStayTimeAjax,
  customerArrivedTimesAjax,
  customerStayTimeAjax,
  customerReturnDaysAjax
}