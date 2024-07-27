import request from "@/network/request";

export function login(data) {
  return request({
    url: "/ucenter/cfAuth/login",
    method: "post",
    data,
  });
}

export function logout(params) {
  return request({
    url: "/carparkLoginAdmin/logout",
    method: "post",
    data: params,
  });
}

export function getCarParkList(params) {
  return request({
    url: "/internetOfThingsAdmin/cfCarPark/getListByQuery",
    method: "get",
    params,
  });
}
export function getMyInfo(params) {
  return request({
    url: "/ucenterAdmin/getMyInfo",
    method: "get",
    params,
  });
}
export function getCheckPointByQuery(params) {
  return request({
    url: "/internetOfThingsAdmin/cfCheckPoint/getListByQuery",
    method: "get",
    params,
  });
}
export function queryOrderByUseId(_id) {
  return request({
    url: "/carparkOrderAdmin/queryOrderByUseId",
    method: "get",
    params: { id: _id },
  });
}
export function countPayAmountByDuty(params) {
  return request({
    url: "/carparkUseLogAdmin/countPayAmountByDuty",
    method: "get",
    params,
  });
}

// 停车记录
export function carparkUseLogAdmin(params) {
  return request({
    url: "/internetOfThingsAdmin/cfCarPark/getCarParkUseLogListByQuery",
    method: "get",
    params,
  });
}

// 新增停车记录
export function addCarparkUseLogAdmin(params) {
  return request({
    url: "/carparkUseLogAdmin/add",
    method: "post",
    data: params,
  });
}

// 编辑停车记录
export function updateCarparkUseLogAdmin(params) {
  return request({
    url: "/carparkUseLogAdmin/update",
    method: "update",
    params,
  });
}

// 删除停车记录
export function deleteCarparkUseLogAdmin(params) {
  return request({
    url: "/carparkUseLogAdmin/delete",
    method: "delete",
    params,
  });
}

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: "orderAdmin/selectListByCondition",
    method: "get",
    params,
  });
}

export function getListByLinkerUser(params) {
  return request({
    url: "/carparkAdmin/getListByLinkerUser",
    method: "get",
    params,
  });
}

export function goOffWorkOrGoToWork(params) {
  return request({
    url: "/carparkCheckPointDeviceAdmin/goOffWorkOrGoToWork",
    method: "put",
    params,
  });
}

export function getCarparkDeviceAdmin(params) {
  return request({
    url: "/internetOfThingsAdmin/cfDevice/getListByMyLinkersAndQuery",
    method: "get",
    params,
  });
}

// 开闸关闸
export function openOrCloseDoor(data) {
  return request({
    url: "/internetOfThingsAdmin/cfDevice/controllerDeviceSwitch",
    method: "post",
    data,
  });
}

// 更新停车记录和账单信息
export function oneClickRelease(data) {
  return request({
    url: `/internetOfThingsAdmin/cfCarPark/oneClickRelease`,
    method: "post",
    data,
  });
}

/**
 * 统计异常放行次数
 * @returns
 */
export function countTheNumbeOfAbnormalReleases() {
  return request({
    url: "/carParkReleaseLogAdmin/countByQuery",
    method: "get",
  });
}

/**
 * 根据条件查询车辆套餐
 * @returns
 */
export function getPackageListByQuery(params) {
  return request({
    url: "carparkpackageAdmin/getPackageListByQuery",
    method: "get",
    params,
  });
}

/**
 * 根据条件查询车辆套餐(返回的数据含车辆类型)
 * @returns
 */
export function selectPackageListByQuery(params) {
  return request({
    url: "/internetOfThingsAdmin/cfCarPark/getCarParkPackageListByQuery",
    method: "get",
    params,
  });
}

/**
 * 获取所有停车类型数据
 * @returns
 */
export function getAllCarTypeList(params) {
  return request({
    url: "/internetOfThingsAdmin/cfCarPark/getCarTypeListByQuery",
    method: "get",
    params,
  });
}

/**
 * 根据条件获取支付机构
 * @returns
 */
export function getPaymentAgencyListByQuery(params) {
  return request({
    url: "/payAdmin/cfUserPaymentAgency/getPaymentAgencyListByQuery",
    method: "get",
    params,
  });
}



// 获取心跳ws地址
export function getMinChatLinkCountsServiceIp(params) {
  return request({
    url: "/chat/cfUserMessage/getMinChatLinkCountsServiceIp",
    method: "get",
    params,
  });
}

// 修改停车记录
export function dutyerUpdateUseLog(params) {
  return request({
    url: "/carparkUseLogAdmin/dutyerUpdateUseLog",
    method: "put",
    params,
  });
}

// 抓拍
export function capture(params) {
  return request({
    url: "/carparkUseLogAdmin/capture",
    method: "get",
    params,
  });
}

// 合并停车记录
export function mergeCarUseLog(params) {
  return request({
    url: "/carparkUseLogAdmin/mergeCarUseLog",
    method: "put",
    params,
  });
}

export function createLoginQrCode(data) {
  return request({
    url: "/ucenterAdmin/cfQrCode/createLoginQrCode",
    method: "post",
    data,
  });
}


export function loginByQrCode(params) {
  return request({
    url: "/ucenterAdmin/cfAuth/loginByQrCode",
    method: "get",
    params,
  });
}

export function dutyConfirmation(data) {
  return request({
    url: "/internetOfThingsAdmin/cfCheckPoint/dutyConfirmation",
    method: "post",
    data,
  });
}

export function getDutyInComeByQuery(params) {
  return request({
    url: "/internetOfThingsAdmin/cfCheckPoint/getDutyInComeByQuery",
    method: "get",
    params,
  });
}

export function simpleModifications(params) {
  return request({
    url: "/internetOfThingsAdmin/cfCarPark/simpleModifications",
    method: "put",
    data:params,
  });
}


export function newOneClickRelease(data) {
  return request({
    url: "/internetOfThingsAdmin/cfCarPark/oneClickRelease",
    method: "post",
    data,
  });
}



// export function getDutyInComeByQuery(params) {
//   return request({
//     url: "/internetOfThingsAdmin/cfCheckPoint/getListByQuery",
//     method: "get",
//     params,
//   });
// }