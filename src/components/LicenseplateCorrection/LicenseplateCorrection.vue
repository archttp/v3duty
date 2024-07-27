<template>
  <el-dialog
      v-model="state.dialogVisible"
      :before-close="handleClose"
      title="无入场记录匹配可能数据"
      width="50%"
  >
    <el-row>
      <div style="font-size: 22px">当前出场车牌:{{ state.licenseplateCorrection?.now.numberPlate }}</div>
      <img :src="state.licenseplateCorrection?.now.outSmallImage">
    </el-row>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>请选择可能的入场记录</span>
        </div>
      </template>
      <el-card v-for="item in state.licenseplateCorrection?.before" :key="item.id">
        <img :src="item.inSmallImage" style="margin-right: 10px">
        <el-button style="margin-top: 20px" type="primary" @click="handleItem(item)">{{ item.numberPlate }}</el-button>
      </el-card>
    </el-card>
    <!--    <template #footer>-->
    <!--      <span class="dialog-footer">-->
    <!--        <el-button @click="state.dialogVisible = false">Cancel</el-button>-->
    <!--        <el-button type="primary" @click="state.dialogVisible = false"-->
    <!--        >Confirm</el-button-->
    <!--        >-->
    <!--      </span>-->
    <!--    </template>-->
  </el-dialog>
</template>

<script setup>
import {mergeCarUseLog} from '@/network/api/index'
import {computed, reactive, toRaw, watch} from 'vue'
// import { mergeCarUseLog } from '@/network/api/index'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useStore} from 'vuex'

const state = reactive({
  dialogVisible: false,
  licenseplateCorrection: null,
  radio1: ''
})

// 监听数据变化
const store = useStore()
const licenseplateCorrectionComputed = computed(() => store.state.licenseplateCorrection)
watch(licenseplateCorrectionComputed, (value) => {
  state.licenseplateCorrection = toRaw(JSON.parse(value.data.cfUserMessage.contents))
  console.log('licenseplateCorrection', state.licenseplateCorrection)
  state.dialogVisible = true
})


const handleItem = (item, done) => {
  ElMessageBox.prompt(`您确定选择的为${item.numberPlate}吗？如果不正确请输入`, '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
      .then(async ({value}) => {
        var {code, message} = await mergeCarUseLog({
          beforeCfCarParkUseLogId: item.id,
          nowcfCarParkUseLogId: state.licenseplateCorrection?.now.id,
          numberPlate: value == null ? item.numberPlate : value
        })
        if (code == 10002) {
          ElMessage({
            message: message,
            type: 'success',
          })
          state.dialogVisible = false
          done()
        } else {
          ElMessage.error(message)
          done()
        }
      })
      .catch(() => {
        done()
      })
  // ElMessageBox.confirm('确定吗？')
  //     .then(async() => {
  //       console.log(item)
  //
  //       var {data,code,message} = await mergeCarUseLog({
  //         beforeCfCarParkUseLogId:item.id,
  //         nowcfCarParkUseLogId:state.licenseplateCorrection?.now.id,
  //         numberPlate:item.numberPlate
  //       })
  //       console.log(data,code,message)
  //       if(code == 10002){
  //         // ElMessage({
  //         //   message: message,
  //         //   type: 'success',
  //         // })
  //
  //         state.dialogVisible = false
  //         done()
  //       }else{
  //         ElMessage.error(message)
  //         done()
  //       }
  //     })
  //     .catch(() => {
  //       // catch error
  //     })
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.box-card {
  margin-top: 20px;
}
</style>