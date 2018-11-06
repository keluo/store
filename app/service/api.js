const homeInit = '/ubiasset/home/';

const dayList = '/inner-api/day/list';// 日期列表
const exportInfo = '/inner-api/customer/export';// 导出报表
const queryAssetGroup = '/etma/sg/cond/'; //店铺列表

const keLiuAllTotalAjax = '/inner-api/ke_liu/all/total'; //客流统计 —— 客流、进店客 总
const totalCustomerAjax = '/inner-api/customer/total/customer'; //客流统计 —— 新顾客、老顾客 总
const keLiuDayAjax = '/inner-api/ke_liu/day'; // 客流统计 —— 客流趋势图
const jinDianDayAjax = '/inner-api/jin_dian/day'; // 客流统计 —— 进店趋势图
const newCustomerAjax = '/inner-api/customer/new'; //客流统计 —— 新顾客趋势图

const marketingSgCustomAnalyze = '/etma/sg/custom_analyze/'; //进店行为 —— 顾客分析

const allCustomerStayInfoAjax = '/inner-api/customer/all/stay_info'; //进店行为 —— 驻店时长 —— 全部 平均驻店时长、离店率
const newCustomerStayInfoAjax = '/inner-api/customer/new/stay_info'; //进店行为 —— 驻店时长 —— 新 平均驻店时长、离店率
const oldCustomerStayInfoAjax = '/inner-api/customer/old/stay_info'; //进店行为 —— 驻店时长 —— 老 平均驻店时长、离店率

const allCustomerStayTimeAjax = '/inner-api/customer/all/stay_time'; //进店行为 —— 驻店时长 —— 全部 驻店时长分布
const newCustomerStayTimeAjax = '/inner-api/customer/new/stay_time'; //进店行为 —— 驻店时长 —— 新 驻店时长分布
const oldCustomerStayTimeAjax = '/inner-api/customer/old/stay_time'; //进店行为 —— 驻店时长 —— 老 驻店时长分布
const allCustomerStayTimeDayAjax = '/inner-api/customer/day/all/stay_time'; //进店行为 —— 驻店时长 —— 全部 驻店时长趋势
const newCustomerStayTimeDayAjax = '/inner-api/customer/day/new/stay_time'; //进店行为 —— 驻店时长 —— 新 驻店时长趋势
const oldCustomerStayTimeDayAjax = '/inner-api/customer/day/old/stay_time'; //进店行为 —— 驻店时长 —— 老 驻店时长趋势

const customerArrivedTimesAjax = '/inner-api/customer/arrived_times'; //进店行为 —— 到店频次 —— 分布
const customerStayTimeAjax = '/inner-api/customer/old/misc_info'; //进店行为 —— 到店频次、返店周期 —— 老客到店频次、老客返店周期

const customerReturnDaysAjax = '/inner-api/customer/return_days'; //进店行为 —— 返店周期 —— 分布
const oldCustomerReturnDaysDayAjax = '/inner-api/customer/day/return_days'; //进店行为 —— 返店周期 —— 趋势

const loginApi = '/etma/login/'; //登录
const logoutApi = '/etma/logout/'; //退出
const smsSendApi = '/etma/sms/send/'; //获取验证码
const restPasswordApi = '/etma/password/pwdreset/'; //重置验证码
const forgotPasswordApi = '/etma/password/smsreset/'; //忘记密码


const couponAddInitApi = '/apo/cv/temp/init/'; //优惠券创建初始化cat
const couponAddApi = '/apo/cv/temp/'; //优惠券创建
const couponCopyApi = '/apo/cv/temp/copy/'; //优惠券复制
const couponListApi = '/apo/cv/temp/list/'; //优惠券列表
const couponListInitApi = '/apo/cv/temp/list/init/'; //优惠券列表初始化select



module.exports = {
  homeInitApi: homeInit,
  queryAssetGroup,
  exportInfo,
  dayList,
  keLiuAllTotalAjax,
  totalCustomerAjax,
  keLiuDayAjax,
  jinDianDayAjax,
  newCustomerAjax,
  marketingSgCustomAnalyze,
  allCustomerStayInfoAjax,
  newCustomerStayInfoAjax,
  oldCustomerStayInfoAjax,
  allCustomerStayTimeAjax,
  newCustomerStayTimeAjax,
  oldCustomerStayTimeAjax,
  allCustomerStayTimeDayAjax,
  newCustomerStayTimeDayAjax,
  oldCustomerStayTimeDayAjax,
  customerArrivedTimesAjax,
  customerStayTimeAjax,
  customerReturnDaysAjax,
  oldCustomerReturnDaysDayAjax,
  loginApi,
  logoutApi,
  smsSendApi,
  restPasswordApi,
  forgotPasswordApi,
  couponAddApi,
  couponCopyApi,
  couponAddInitApi,
  couponListApi,
  couponListInitApi
}