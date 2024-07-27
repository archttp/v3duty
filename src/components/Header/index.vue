<template>
  <div className="layer1 flex-col">
    <div className="box1 flex-col">
      <div className="section1 flex-row">
        <div className="flex-row">
          <img v-if="company.name != 'dewei' && company.name != 'sixiang'" className="icon1"
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng6592717fe61b7eb0f0fa07049f60a6210e085b23267655d08c52d501d80c4aed" />
          <img v-if="company.name == 'sixiang'" className="icon1" style="margin-top: 2px; width: 28px; height: 34px"
            src="../../assets/sixianglogo.png" alt="" />
          <span className="word1">{{ company.title }}</span>
          <span className="info1">{{ nowTime }}</span>
        </div>
        <div className="flex-row">
          <span className="word2" style="margin-right: 18px">
            今日现金收费：{{ totalCashCharge }}
          </span>
          <span className="word2" style="margin-right: 18px">{{
            user.userName
          }}</span>
          <el-button className="main1 flex-col" @click="onShowDuty" style="margin-left: 10px">
            <span className="word3">值班选择</span>
          </el-button>
          <el-button type="danger" circle @click="drawer = true" className="main1 flex-col"
            style="margin-left: 10px"><span className="word3">系统配置</span></el-button>
          <el-button className="main1 flex-col" @click="onParkingRecord" style="margin-left: 10px">
            <span className="word3">停车记录</span>
          </el-button>
          <el-button className="main1 flex-col" @click="globalConfig.videoFull = !globalConfig.videoFull"
            style="margin-left: 10px">
            <span className="word3">视频全屏</span>
          </el-button>
          <div className="main2 flex-col" @click="onLogin">
            <span className="info2">账号退出</span>
          </div>
        </div>
      </div>
      <div className="section2 flex-col" />
    </div>

    <HandOver ref="handover" />
    <ParkingRecord ref="ParkingRecord" />
  </div>

  <el-drawer v-model="drawer" title="全局配置文件">
    <div style="display: flex">
      <div>进出场车辆提示：</div>
      <el-switch v-model="globalConfig.promptEntryExitCar" active-text="开启" inactive-text="关闭" />
    </div>
    <div style="display: flex; margin-top: 10px">
      <div>已支付车辆提示：</div>
      <el-switch v-model="globalConfig.promptPayCar" active-text="开启" inactive-text="关闭" />
    </div>
    <div style="display: flex; margin-top: 10px">
      <div>出场记录只显示收费车辆：</div>
      <el-switch v-model="globalConfig.promptChargeOutCar" active-text="开启" inactive-text="关闭" />
    </div>
    <div style="display: flex; margin-top: 10px">
      <div>进出场图片显示：</div>
      <el-switch v-model="globalConfig.inOutImageType" active-text="小图" inactive-text="大图" />
    </div>
  </el-drawer>

  <el-dialog v-model="dialogVisible" title="值班选择" width="50%">
    <el-transfer v-model="transferIds" :data="transferData" :titles="['不值班', '需要值班']" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onTransferOk"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import HandOver from "./HandOver.vue";
import ParkingRecord from "../ParkingRecord";
import { mapState } from "vuex";
import dayjs from "dayjs";
import store from "../../store";
import {
  getDutyInComeByQuery,
  getCheckPointByQuery,
  dutyConfirmation,
} from "@/network/api";
import CompanyArr from "../../config";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: { HandOver, ParkingRecord },
  computed: {
    ...mapState(["globalConfig", "carParkList", "carParkIndex"]),
  },
  data() {
    return {
      nowTime: "",
      user: JSON.parse(localStorage.getItem("userInfo")),
      drawer: false,
      totalCashCharge: 0,
      company: CompanyArr,
      dialogVisible: false,
      activeName: "",
      transferIds: [],
      transferData: [],
    };
  },
  created() {
    this.setTime();
    this.countPayAmountByDuty();
    console.log(this.carParkList, "this.carParkList");
  },
  watch: {
    globalConfig: {
      deep: true,
      handler(value) {
        store.commit("SETCONFIG", value);
      },
    },
  },
  methods: {
    async onTransferOk() {
      const transferIds = this.transferIds;
      const areaIds = [];
      const checkPointIds = [];
      for (const i of transferIds) {
        areaIds.push(i.areaId);
        checkPointIds.push(i.id);
      }
      const { data, code, message } = await dutyConfirmation({
        action: "start",
        areaIds: [...new Set(areaIds)],
        checkPointIds,
      });
      console.log(data, code);
      if (code == 10002) {
        ElMessage({
          type: "success",
          message: "操作成功",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        // this.dialogVisible = false;
      } else {
        ElMessage({
          type: "error",
          message: message,
        });
      }
    },
    async getAllDevice() {
      const carParkId = this.carParkList[this.carParkIndex].id;
      const deviceIds = [];
      var { data, code, message } = await getCheckPointByQuery({
        areaId: carParkId,
        deviceType: 2,
        page: 1,
        size: 100,
      });
      if (code == 10002) {
        for (const j of data) {
          deviceIds.push({
            key: {
              id: j.id,
              name: j.name,
              areaId: j.areaId,
            },
            label: j.name,
            disabled: false,
          });

        }
        this.transferData = deviceIds;
      } else {
        this.transferData = [];
        ElMessage({
          type: "error",
          message,
        });
      }
      // const parkIds = this.carParkList.map((i) => i.id);
      // const deviceIds = [];
      // for (const i of parkIds) {
      //   console.log(i);
      //   var { data, code } = await getCheckPointByQuery({
      //     areaId: i,
      //     deviceType: 2,
      //     page: 1,
      //     size: 100,
      //   });
      //   console.log(data, code);
      //   if (code == 10002) {
      //     for (const j of data) {
      //       deviceIds.push({
      //         key: {
      //           id: j.id,
      //           name: j.name,
      //           areaId: j.areaId,
      //         },
      //         label: j.name,
      //         disabled: false,
      //       });
      //     }
      //   }
      // }
      // console.log(deviceIds, "deviceIds");
    },
    onShowDuty() {
      this.dialogVisible = true;
      this.getAllDevice();
    },
    /**
     * 统计现金收款金额
     */
    async countPayAmountByDuty() {
      const { data, code } = await getDutyInComeByQuery({
        paymentAgencyShortName: 'cash_pay_cny',
      });
      if (code === 10002) {
        this.totalCashCharge = data == null ? 0 : data;
      }
    },
    onLogin() {
      ElMessageBox.confirm("确认退出吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const transferIds = this.transferIds;
        const areaIds = [];
        const checkPointIds = [];
        for (const i of transferIds) {
          areaIds.push(i.areaId);
          checkPointIds.push(i.id);
        }
        await dutyConfirmation({
          action: "end",
          areaIds: [...new Set(areaIds)],
          checkPointIds,
        });
        window.localStorage.clear();
        this.$router.push("/login");
        ElMessage({
          type: "success",
          message: "操作成功",
        });
      });
      // this.$refs.handover.showDialog();
    },
    setTime() {
      setInterval(() => {
        this.nowTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
      }, 1000);
    },
    onParkingRecord() {
      this.$refs.ParkingRecord.showDialog();
    },
  },
};
</script>
