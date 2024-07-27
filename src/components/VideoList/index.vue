<template>
  <div
    className="group15 flex-col"
    :style="{
      width: '60%',
    }"
  >
    <div className="bd6 flex-row">
      <div className="box3 flex-row">
        <div
          :style="{
            height:'300px',
          }"
          className="group16-0 flex-col"
          v-for="(item, index) in deviceList"
          :key="item.id"
        >
          <div className="layer5-0 flex-col">
            <span className="word11-0">{{ item.deviceName }}</span>
            <img
              :id="'show_video' + (index + 1)"
              className="pic1-0"
              :src="require('../../assets/image/BG@2x.png')"
            />
            <div className="section4-0 flex-row">
              <div
                className="block1-0 flex-col"
                @click="onVideoIndex(item, 'on')"
              >
                <span className="word12-0">开闸放行</span>
              </div>

              <div
                className="block2-01 flex-col"
                style="width: 20%"
                @click="onVideoIndex(item, 'snap')"
              >
                <span className="word12-0">抓拍</span>
              </div>

              <div
                className="block2-0 flex-col"
                @click="onVideoIndex(item, 'off')"
              >
                <span className="txt1-0">关闸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReconnectingWebSocket from "reconnecting-websocket";
import { mapState } from "vuex";
// import { toRaw } from "vue";
import { getCarparkDeviceAdmin, openOrCloseDoor } from "@/network/api";
export default {
  data() {
    return {
      deviceList: [],
      socket: null,
    };
  },
  computed: {
    ...mapState(["parkSwitch", "carParkIndex", "carParkList"]),
  },
  // 获取停车场首次加载时 第一个停车场的所有硬件
  // 监听 所选停车场的 index 当发生改变时 应当重新获取所有硬件
  // 刷新页面作用 --- 重置所有ws
  watch: {
    carParkList() {
      this.getHardwareList();
    },
    carParkIndex() {
      this.getHardwareList();
      window.location.reload();
    }
  },
  methods: {
    // 图片放大功能
    showBigImage(index) {
      var mainDiv = document.getElementById(`show_video${index}`);
      if (mainDiv.classList.contains("bigImage")) {
        mainDiv.classList.remove("bigImage");
      } else {
        mainDiv.classList.add("bigImage");
      }
    },
    async getHardwareList() {
      var { data, code } = await getCarparkDeviceAdmin({
        areaId: this.carParkList[this.carParkIndex].id,
        deviceType: 2,
        page: 1,
        size: 100,
      });
      console.log(data, 555);
      if (code != 10002) return;
      this.deviceList = data;
      this.getVideo(data);
    },
    getVideo(data) {
      console.log(data);
      for (const i in data) {
        if (data[i].brand === "zhen_shi") {
          this.getLocalVideo_ZhenShi(data[i], Number(i) + 1);
        } else if (data[i].brand === "hua_xia") {
          this.getLocalVideo_hua_xia(data[i], Number(i) + 1);
        } else if (data[i].brand === "qian_yi") {
          this.getLocalVideo_qian_yi(data[i], Number(i) + 1);
        }
      }
    },
    getLocalVideo_hua_xia(info, index) {
      var ws;
      ws = new ReconnectingWebSocket(`ws:${info.ip}:9999`);
      ws.onopen = function () {
        console.log("open...");
      };
      ws.onmessage = function (event) {
        var reader = new FileReader();
        reader.readAsDataURL(event.data);
        reader.onload = function () {
          document
            .getElementById(`show_video${index}`)
            .setAttribute("src", this.result);
        };
      };
      ws.onerror = function () {
        console.log("error");
      };
      ws.onclose = function () {
        console.log("close");
      };
    },
    getLocalVideo_ZhenShi(info, index) {
      if (window.WebSocket && info.ip) {
        this.socket = new ReconnectingWebSocket(`ws://${info.ip}:9080/ws:`);
        //收到消息
        this.socket.onmessage = function (data) {
          let videoImage = new FileReader();
          videoImage.onload = function (e) {
            if (e.target.readyState == 2) {
              if (!e.target.result) return;
              document
                .getElementById(`show_video${index}`)
                .setAttribute("src", e.target.result);
            }
          };
          videoImage.readAsDataURL(data.data);
        };
        //连接打开
        this.socket.onopen = function () {
          // console.info("臻识本地视频连接开启", event);
        };
        //连接断开
        this.socket.onclose = function () {
          // console.log("websocket.onclose", event.code);
        };
      }
    },
    getLocalVideo_qian_yi(info, index) {
      var iFrameBox = document.createElement("img");
      iFrameBox.src = `http://${info.ip}:8088/cgi-bin/video_cgi`;
      iFrameBox.className = "pic1-0";
      iFrameBox.style.width = "96%";

      // iFrameBox.style.height = this.parkSwitch ? "100px" : '200px';
      setTimeout(() => {
        var mainDiv = document.getElementById(`show_video${index}`);
        mainDiv.parentNode.replaceChild(iFrameBox, mainDiv);
      }, 500);
    },
    // 点击视频开闸关闸抓拍
    async onVideoIndex(item, action) {
      console.log(item, action);
      var { data, message, code } = await openOrCloseDoor({
        deviceId: item.id,
        action,
      });
      console.log(data);
      if (code == 10002) {
        this.$message({
          message,
          type: "success",
        });
      } else {
        this.$message.error(message);
      }
    },
  },
};
</script>

<style>
.bigImage {
  width: 90vw;
  height: 90vh;
  position: fixed;
  left: 5vw;
  top: 5vh;
  z-index: 99999;
  transition: all 0.5s;
}
</style>
