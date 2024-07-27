import ReconnectingWebSocket from "reconnecting-websocket";
// import { WebSocketUrl } from "../config/index";
import store from "../store/index";
import {
  selectPackageListByQuery,
  //   queryOrderByUseId,
  getMinChatLinkCountsServiceIp,
} from "../network/api";
var websocket = null;
import { ElNotification, ElMessage } from "element-plus";
import Company from "../config";
export const InitWebSocket = () => {
  const reateLinkAndSendheartBeat = () => {
    let message = initNullMessagePojo();
    message.type = "create_link";
    websocket.send(JSON.stringify(message));
    setInterval(() => {
      let _message = initNullMessagePojo();
      _message.type = "heartbeat_check";
      websocket.send(JSON.stringify(_message));
    }, 10000);
  };

  const initNullMessagePojo = () => {
    let cfUserMessage = {
      id: "",
      fromUid: "",
      toUid: "",
      groupId: "",
      status: 0,
      contents: "",
      type: 0,
      client: "",
      ip: "",
      createTime: 0,
      receiveTime: 0,
    };

    let message = {
      type: "",
      cfUserMessage: cfUserMessage,
      ext: "",
      token: localStorage.getItem("token"),
    };
    return message;
  };

  // 向Store推送消息
  const pushStoreData = (data, type) => {
    console.log(data, type);
    const carParkId = data.carParkId;
    if (type === "out") store.commit("SETOUT", data);
    if (type === "in") store.commit("SETIN", data);
    // 判断是用来选择哪个停车场 就推哪个停车场的图片
    if (carParkId === store.getters.carParkId) {
      if (type === "out") {
        store.commit("SETOUTIMAGE", {
          outImage: data.outBigImageUrl,
          outSmallImage: data.outSmallImageUrl,
        });
      } else {
        store.commit("SETINIMAGE", {
          inImage: data.inBigImageUrl,
          inSmallImage: data.inSmallImageUrl,
        });
      }
    }
  };
  // 获取账单信息
  // const getQueryOrderByUseId = async (carParkUseLog) => {
  //     const { data, code } = await queryOrderByUseId(carParkUseLog.id);
  //     if (code != 10002) return
  //     if(store.state.globalConfig.promptChargeOutCar){
  //         if(data.cfOrder.amountsPayable > 0){
  //             pushStoreData(data,'out')
  //         }
  //     }else{
  //         pushStoreData(data,'out')
  //     }

  //     if (data.cfCouponList != "" && data.cfCouponList.length > 0) {
  //         data.cfOrder.couponDenomination =
  //             data["cfCouponList"][0]["denomination"];
  //     } else {
  //         data.cfOrder.couponDenomination = 0;
  //     }

  //     if (
  //         data.cfOrder.amountsPayable - data.cfOrder.couponDenomination > 0 &&
  //         data.cfOrder.status == 0 &&
  //         !data.cfOrder.collectionShopId && data.cfOrder.payTime === 0 && carParkUseLog.payTime === 0
  //     ) {
  //         console.log('被收费的车俩',data);
  //         store.commit('SETCHARGECAR', data)
  //     }
  // }

  const pushOut = (carParkUseLog) => {
    if (store.state.globalConfig.promptChargeOutCar) {
      if (carParkUseLog.cfOrder.amountsPayable > 0) {
        pushStoreData(carParkUseLog, "out");
      }
    } else {
      pushStoreData(carParkUseLog, "out");
    }
    if (
      carParkUseLog.cfOrder.amountsPayable &&
      carParkUseLog.cfOrder.status == 0 &&
      carParkUseLog.payTime == 0
    ) {
      console.log("被收费的车俩", carParkUseLog);
      store.commit("SETCHARGECAR", carParkUseLog);
    }
  };

  const updateInterface = async (message) => {
    // console.log("心跳收到的消息", JSON.parse(message.cfUserMessage.contents));
    if (message == null) return;
    //修改消息状态为已读
    let consumptionData = initNullMessagePojo();
    consumptionData.type = "change_status";
    consumptionData.cfUserMessage.id = message.cfUserMessage.id;
    console.log(message, 104);
    consumptionData.cfUserMessage.toUid = message.cfUserMessage.toUid;
    websocket.send(JSON.stringify(consumptionData));
    // 将数据放到页面中进行展示
    let carParkUseLog = JSON.parse(message.cfUserMessage.contents);
    // console.log(carParkUseLog,'carParkUseLog');
    if (message.cfUserMessage.type == 1) {
      if (carParkUseLog.inTime > 0 && carParkUseLog.outTime == 0) {
        // this.nowInBigImage = carParkUseLog.inBigImage;
        const { data } = await selectPackageListByQuery({
          carParkId: carParkUseLog.carParkId,
          numberPlate: carParkUseLog.numberPlate,
        });
        carParkUseLog.cfCarParkCarType =
          data == null
            ? { name: "临时车", flagKey: "temporary_car" }
            : data[0].cfCarParkCarType;
        // console.log("查询车辆的套餐", data, code);
        pushStoreData(carParkUseLog, "in");
      }
      // 更新界面:包括 图片 消息 更新到页面
      // 只提示选中停车场的停车数据
      if (carParkUseLog.carParkId == store.getters.carParkId) {
        const direction =
          carParkUseLog.outTime == 0 ? " 车牌进场：" : "车牌出场：";
        const outCheckPointName = carParkUseLog.outTime == 0 ? carParkUseLog.inCheckPointName : carParkUseLog.outCheckPointName;
        if (store.state.globalConfig.promptEntryExitCar) {
          ElNotification({
            title: "提示",
            message:
              outCheckPointName +
              direction +
              carParkUseLog?.numberPlate,
            position: "bottom-left",
            type: "warning",
          });
        }
      }

      // 出场查询账单
      if (carParkUseLog.outTime > 0) {
        // getQueryOrderByUseId(carParkUseLog);
        pushOut(carParkUseLog);
      }
    } else if (message.cfUserMessage.type == 6) {
      console.log("typy6", message);
      store.commit("SetLicenseplateCorrection", {
        show: true,
        data: message,
      });
    } else {
      // 用户已支付 取消弹窗
      console.log("已支付的车辆信息", carParkUseLog);
      store.commit("PAIDCAR", carParkUseLog);
      // this.$refs.ChargeBox.deleteData(carParkUseLog);
    }
  };

  // const getWsUrl = () => {

  // }

  if (window.WebSocket) {
    getMinChatLinkCountsServiceIp().then((res) => {
      if (res.code != 10002) {
        ElMessage.error(res.message);
        return;
      }
      websocket = new ReconnectingWebSocket(Company.wssUrl+'/ws');
      websocket.onopen = (e) => {
        console.log("账单WebSocket连接开启", e);
        reateLinkAndSendheartBeat();
      };

      // 接受webSocket消息
      websocket.onmessage = (e) => {
        var message = JSON.parse(e.data);
        // console.log('message',e);
        // 将数据放到页面中进行展示
        updateInterface(message);
      };

      websocket.onclose = (e) => {
        console.log(e);
      };
    });
  } else {
    alert("您的浏览器不支持webSocket！");
  }
};
