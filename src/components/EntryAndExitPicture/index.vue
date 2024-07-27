<template>
  <div class="box8 flex-col">
    <div class="mod6 flex-col">
      <div class="box9 flex-col">
        <span class="word95">入场大图</span>
        <div class="box10 flex-col"/>
        <el-image
            fit="cover"
            class="pic2"
            :preview-src-list="[globalConfig.inOutImageType ? carImage.inSmallImage : carImage.inImage || require('../../assets/image/BG@2x.png')]"
            :z-index="9999"
            :src="globalConfig.inOutImageType ? carImage.inSmallImage : carImage.inImage || require('../../assets/image/BG@2x.png')"
        />
      </div>
    </div>
    <div class="mod7 flex-col">
      <div class="layer23 flex-col">
        <span class="info40">出场大图</span>
        <div class="mod8 flex-col"/>
        <el-image
            fit="cover"
            class="img1"
            :preview-src-list="[globalConfig.inOutImageType ? carImage.outSmallImage : carImage.outImage || require('../../assets/image/BG@2x.png')]"
            :z-index="9999"
            :src="globalConfig.inOutImageType ? carImage.outSmallImage : carImage.outImage || require('../../assets/image/BG@2x.png')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  computed: {
    ...mapState(["carImage", "globalConfig"]),
  }
};
</script>