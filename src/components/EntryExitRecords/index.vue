<template>
  <div className="box5 flex-col">
    <div className="section11 flex-col">
      <span className="info13">最近入场记录</span>
      <div className="layer7 flex-col">
        <div className="mod2 flex-row">
          <span className="word26">车牌号</span>
          <span className="word27">车辆类型</span>
          <span className="word28">入场时间</span>
          <span className="txt7">入场方式</span>
          <span className="word29">其他</span>
        </div>
      </div>
      <div className="layer9 flex-col" v-for="item in inCarFltter" :key="item.id">
        <div className="section12 flex-row">
          <span className="word34">{{ item.numberPlate }}</span>
          <div className="outer5 flex-col">
            <span className="word35">{{ getNameByFlagKey(item.carType) }}</span>
          </div>
          <span className="info14">{{ getTime(Number(item.inTime)) }}</span>
          <span className="word36">{{
            getReleaseText(item.inReleaseType)
          }}</span>
          <span className="txt9" @click="editCar(item)">纠错</span>
        </div>
      </div>
    </div>
  </div>

  <div className="box7 flex-col">
    <div className="wrap5 flex-col">
      <span className="word58">最近出场记录</span>
      <div className="main4 flex-col">
        <div className="outer8 flex-row">
          <span className="word59">车牌号</span>
          <span className="word60">车辆类型</span>
          <span className="word61">入场时间</span>
          <span className="word62">出场时间</span>
          <span className="txt23">出场方式</span>
        </div>
      </div>
      <div className="main6 flex-col" v-for="item in outCarFltter" :key="item.id">
        <div className="main7 flex-row">
          <span className="word65">{{ item.numberPlate }}</span>
          <div className="bd14 flex-col">
            <span className="word66">{{ getNameByFlagKey(item.carType) }}</span>
          </div>
          <span className="info28">{{ getTime(Number(item.inTime)) }}</span>
          <span className="info29">{{ getTime(Number(item.outTime)) }}</span>
          <span className="word67">{{
            getReleaseText(Number(item.outReleaseType))
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { $timeFormat } from "../../utils/index";
import { ElMessageBox, ElMessage } from "element-plus";
import { simpleModifications } from "@/network/api";
import { cloneDeep } from "lodash";
import store from "../../store/index";

export default {
  data() {
    return {
      carParkReleaseType: [
        { key: 0, name: "未知" },
        { key: 1, name: "自动抬杆" },
        { key: 2, name: "人工抬杆" },
        { key: 3, name: "手机放行" },
        { key: 4, name: "手机扫码" },
        { key: 5, name: "异常放行" },
      ],
    };
  },
  created() {
    // 获取所有的车辆类型
    this.$store.dispatch("getAllCarType");
  },
  computed: {
    ...mapState(["inCar", "outCar", "carTypeList"]),
    ...mapGetters(["carParkId"]),
    inCarFltter() {
      return this.inCar.filter((i) => i.carParkId === this.carParkId);
    },
    outCarFltter() {
      console.log(this.outCar.filter((i) => i?.carParkId === this.carParkId));
      return this.outCar.filter((i) => i?.carParkId === this.carParkId);
    },
  },
  methods: {
    getNameByFlagKey(flagKey) {
      const arr = this.carTypeList;
      const foundItem = arr.find((item) => item.flagKey === flagKey);
      return foundItem ? foundItem.name : null;
    },
    getTime(time) {
      return $timeFormat(time, "MM-DD HH:mm:ss");
    },
    getReleaseText(type) {
      return this.carParkReleaseType.filter((i) => i.key == type)[0]?.name;
    },
    editCar(item) {
      console.log(item);
      ElMessageBox.prompt("请输入修改后的车牌号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async ({ value }) => {
        var { data, code, message } = await simpleModifications({
          numberPlate: value,
          id: item.id,
        });
        console.log(data, code);

        // 修改车牌后 改变本地的数据
        var list = cloneDeep(this.inCar);
        list.map((i) => {
          if (i.id === item.id) {
            i.numberPlate = value;
          }
        });
        // this.inCar = list;
        store.commit("SETALLIN", list);
        // end

        ElMessage({
          type: "success",
          message,
        });
      });
    },
  },
  watch: {
    // inCar: function (value) {
    //   console.log("value", value);
    // },
  },
};
</script>
