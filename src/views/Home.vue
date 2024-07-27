<template>
  <div class="home">
    <div className="page flex-col">
      <div className="bd1 flex-col">
        <Header ref="header" />
        <div className="layer3 flex-row">
          <ParkingLotList />
          <VideoList v-if="!globalConfig.videoFull" />
          <VideoListFull v-if="globalConfig.videoFull" />
          <ChargeBox @countPayAmountByDuty="countPayAmountByDuty" v-if="!globalConfig.videoFull" />
        </div>
        <div className="layer6 flex-row">
          <EntryExitRecords v-if="!globalConfig.videoFull" />
          <EntryAndExitPicture  v-if="!globalConfig.videoFull"/>
        </div>
      </div>
    </div>

    <LicenseplateCorrection />
    <!-- 停车场列表选择开关 -->
    <div class="selectParkingLot" @click="setParkSwitch">选择停车场</div>
  </div>
</template>

<script>
import Header from "../components/Header";
import ParkingLotList from "../components/ParkingLotList";
import LicenseplateCorrection from "../components/LicenseplateCorrection/LicenseplateCorrection";
import VideoList from "../components/VideoList";
import VideoListFull from "../components/VideoList/full";
import ChargeBox from "../components/ChargeBox";
import EntryExitRecords from "../components/EntryExitRecords";
import EntryAndExitPicture from "../components/EntryAndExitPicture";
import { InitWebSocket } from "@/utils/websocket";
import { mapState } from "vuex";
import store from "../store";
export default {
  name: "Home",
  components: {
    Header,
    ParkingLotList,
    VideoList,
    VideoListFull,
    ChargeBox,
    EntryExitRecords,
    EntryAndExitPicture,
    LicenseplateCorrection
  },
  computed: {
    ...mapState(["parkSwitch","globalConfig"]),
  },
  watch:{
    globalConfig: {
      deep: true,
      handler() {
        window.location.reload();
      },
    },
  },  
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      InitWebSocket();
    }
    // setInterval(()=>{
    //   location.reload();
    // },10000)
  },
  methods: {
    setParkSwitch() {
      store.commit("SETPARKLISTSWITCH", !this.parkSwitch);
    },
    countPayAmountByDuty(){
      this.$refs.header.countPayAmountByDuty()
    }
  },
};
</script>

<style scoped>
.selectParkingLot {
  position: absolute;
  width: 30px;
  background: red;
  left: 0;
  top: 110px;
  z-index: 2;
  color: #fff;
  text-align: center;
}
</style>