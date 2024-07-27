import { createStore } from "vuex";
import { getAllCarTypeList, getPaymentAgencyListByQuery } from "../network/api/index";
import createVuexAlong from "vuex-along"; // vuex缓存工具
export default createStore({
  state: {
    carParkList: [],
    carParkIndex: 0,
    userinfo: "",
    checkPointList: [],
    inCar: [],
    outCar: [],
    chargeCar: [],
    carImage: {
      inImage: "",
      outImage: "",
      inSmallImage: "",
      outSmallImage: "",
    },
    paidCar: {},
    parkSwitch: false,
    licenseplateCorrection: {
      show: false,
      date: null,
    },
    globalConfig: {
      promptEntryExitCar: true,
      promptPayCar: true,
      promptChargeOutCar: false,
      inOutImageType: true, // false为大图 true为小图
      videoFull: false, // 视频全屏模式
    },
    // 所有的车辆类型
    carTypeList: [],
    paymentAgencyShortNameOptions: [],
  },
  mutations: {
    SETCARPARKLIST(state, payload) {
      state.carParkList = payload;
    },
    SETCHECKPOINTLIST(state, payload) {
      state.checkPointList = payload;
    },
    // 改变某一个记录的车牌
    SETALLIN(state, payload) {
      state.inCar = payload
    },
    SETIN(state, payload) {
      // console.log('入场车辆', payload);
      if (state.inCar.length > 100) {
        state.inCar = state.inCar.slice(0, 100);
      }
      state.inCar.unshift(payload);
    },
    SETOUT(state, payload) {
      if (state.outCar.length > 100) {
        state.outCar = state.outCar.slice(0, 100);
      }
      state.outCar.unshift(payload);
    },
    SETCHARGECAR(state, payload) {
      state.chargeCar = payload;
    },
    SETINIMAGE(state, payload) {
      state.carImage.inImage = payload.inImage;
      state.carImage.inSmallImage = payload.inSmallImage;
    },
    SETOUTIMAGE(state, payload) {
      state.carImage.outImage = payload.outImage;
      state.carImage.outSmallImage = payload.outSmallImage;
    },
    PAIDCAR(state, payload) {
      state.paidCar = payload;
    },
    SETPARKLISTSWITCH(state, payload) {
      state.parkSwitch = payload;
    },
    SETCONFIG(state, payload) {
      state.globalConfig = payload;
    },
    SetCarParkIndex(state, payload) {
      state.carParkIndex = payload;
    },
    SetLicenseplateCorrection(state, payload) {
      state.licenseplateCorrection = {
        show: payload.show,
        data: payload.data,
      };
    },
    // 修改数据
    changeCarTypeList(state, res) {
      state.carTypeList = res;
    },
    changePaymentAgencyShortNameOptions(state, res) {
      state.paymentAgencyShortNameOptions = res;
    },
  },
  getters: {
    carParkId: (state) =>
      state.carParkList.length > 0
        ? state.carParkList[state.carParkIndex].id
        : "",
  },
  actions: {
    async getAllCarType(context) {
      //请求接口
      const result = await getAllCarTypeList({
        page: 1,
        size: 200,
      });
      context.commit(
        "changeCarTypeList",
        result.code === 10002 ? result.data : []
      );
    },
    async getPaymentAgencyShortNameOptions(context) {
      const result = await getPaymentAgencyListByQuery({
        page: 1,
        size: 200,
      });
      context.commit(
        "changePaymentAgencyShortNameOptions",
        result.code === 10002 ? result.data : []
      );
    },
  },
  modules: {},
  plugins: [
    createVuexAlong({
      name: "vuex-along",
    }),
  ],
});
