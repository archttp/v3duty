<template>
  <!-- <div className="group1 flex-col"> -->
    <div className="group1 flex-col" :style="{ width: parkSwitch ? '260px' : '0px' }">
    <!-- <div className={index === tabIndex ? 'group3 flex-col' : index % 2 == 0 ? 'group5 flex-row' : 'group6 flex-row'} key={index}> -->
    <div
      :class="
        index === carParkIndex
          ? 'group3 flex-col'
          : index % 2 == 0
          ? 'group5 flex-row'
          : 'group6 flex-row'
      "
      v-for="(item, index) in carParkList"
      :key="item.id"
      @click="onList(index)"
    >
      <div className="outer1 flex-row">
        <span className="info3">{{ item.name }}</span>
        <img
          alt=""
          className="label1"
          src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngab7947f586f04cb06f8bf4176a0b3fbfa0aca97d74f42d645e29a8ccf640ceae"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getCarParkList, getCheckPointByQuery } from "@/network/api";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["parkSwitch","carParkIndex"]),
  },
  data() {
    return {
      queryFrom: {
        page: 1,
        size: 50,
        fields: 'id,name'
      },
      carParkList: []
    };
  },
  created() {
    this.getCarParkList();
  },
  watch: {
    carParkList: function () {
      // this.getCheckPointByQuery();
    },
  },
  methods: {
    onList(index) {
      this.$store.commit('SetCarParkIndex',index)
    },
    async getCarParkList() {
      var { data, code } = await getCarParkList(this.queryFrom);
      if (code == 10002) {
        this.carParkList = data;
        this.$store.commit("SETCARPARKLIST", data);
      }
    },
    async getCheckPointByQuery() {
      var { data, code } = await getCheckPointByQuery({
        page: 1,
        size: 100,
        areaId: this.carParkList[this.carParkIndex].id,
      });
      console.log(data,999);
      if (code != 10002) return;
      this.$store.commit("SETCHECKPOINTLIST", data);
    },
  },
};
</script>