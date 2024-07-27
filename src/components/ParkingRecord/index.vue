<template>
  <el-dialog
    v-model="dialogVisible"
    title="停车记录"
    :before-close="handleClose"
    width="95vw"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="queryForm"
      label-width="100px"
      label-position="left"
    >
      <el-row type="flex">
        <el-col>
          <el-row>
            <el-form-item label="车牌号">
              <el-input
                v-model="queryForm.numberPlate"
                placeholder="请输入车牌号"
              />
            </el-form-item>
            <el-form-item label="车辆类型">
              <el-select
                v-model="queryForm.carType"
                placeholder="请选择"
                :clearable="true"
              >
                <el-option
                  v-for="item in carTypeList"
                  :key="item.flagKey"
                  :label="item.name"
                  :value="item.flagKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select
                v-model="queryForm.paymentAgencyShortName"
                placeholder="请选择"
                :clearable="true"
              >
                <el-option
                  v-for="item in paymentAgencyShortNameOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.paymentAgencyName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分组">
              <el-input
                v-model="queryForm.homeGroup"
                placeholder="请输入分组"
              />
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="入场时间">
              <el-date-picker
                v-model="queryForm.newMinInTime"
                type="datetime"
                placeholder="开始"
                clearable
              />
              -
              <el-date-picker
                v-model="queryForm.newMaxInTime"
                type="datetime"
                placeholder="结束"
                clearable
              />
            </el-form-item>
            <el-form-item label="出场时间">
              <el-date-picker
                v-model="queryForm.newMinOutTime"
                type="datetime"
                placeholder="开始"
                clearable
              />
              -
              <el-date-picker
                v-model="queryForm.newMaxOutTime"
                type="datetime"
                placeholder="结束"
                clearable
              />
            </el-form-item>
            <el-form-item label="姓名/楼栋">
              <el-input
                v-model="queryForm.visitUnit"
                placeholder="车主姓名，或所住的房间号"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="handleQuery"
              >
                查询
              </el-button>
            </el-form-item>
          </el-row>

          <el-row type="flex" style="width: 700px"> </el-row>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" style="width: 100%;" stripe border v-loading="listLoading">
      <el-table-column align="center" label="序号" width="50">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="numberPlate"
        label="车牌号"
        align="center"
        width="100"
      />
      <el-table-column align="center" label="应付金额" width="80">
        <template #default="{ row }">
          {{
            row.cfOrder == null ||
            row.cfOrder.paymentAgencyShortName == "package"
              ? 0
              : row.amountsPayable
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实付金额" width="80">
        <template #default="{ row }">
          {{
            row.cfOrder == null ||
            row.cfOrder.paymentAgencyShortName == "package"
              ? 0
              : row.amountActuallyPaid
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="80">
        <template #default="{ row }">
          {{ getPaymentAgencyShortName(row.paymentAgencyShortName) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="姓名/楼栋"
        width="90"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.visitUnit || "-" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="入场时间" width="170">
        <template #default="{ row }">
          {{ row.inTime ?  getTime(Number(row.inTime)) : "-" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出场时间" width="160">
        <template #default="{ row }">
          {{ row.outTime ?  getTime(Number(row.outTime)) : "-" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="停车时长" width="160">
        <template #default="{ row }">
          {{ getTimeFn(Number(row.inTime), Number(row.outTime)) }}
        </template>
      </el-table-column>
      
      <el-table-column label="车辆类型" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag
            effect="dark"
            :type="row.carType == 'monthly_car' ? 'success' : 'danger'"
          >
            {{ getCarTypeName(row.carType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="homeGroup"
        label="分组"
        align="center"
        width="100"
      />
      <el-table-column align="center" label="入场关卡" width="100">
        <template #default="{ row }">
          {{
            row.inCheckPointName || '-'
          }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="出场关卡" width="100">
        <template #default="{ row }">
          {{
            row.outCheckPointName || '-'
          }}
        </template>
      </el-table-column>

      <el-table-column
        label="入场大图"
        width="80px"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.inBigImageUrl]"
            style="width: 42px; height: 34px"
            :src="row.inBigImageUrl"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="出场大图"
        width="80px"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-image
            :preview-src-list="[row.outBigImageUrl]"
            style="width: 42px; height: 34px"
            :src="row.outBigImageUrl"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="到期时间" width="160">
        <template #default="{ row }">
          {{
            row.cfCarParkPackage
              ? timeFormat(row.cfCarParkPackage.endTime, "yyyy-mm-dd hh:MM:ss")
              : "-"
          }}
        </template>
      </el-table-column> -->

      <el-table-column
        align="center"
        label="车场"
        width="180"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.carParkName }}
        </template>
      </el-table-column>

      <el-table-column
        label="入场方式"
        width="170px"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getCarParkReleaseType(row.inReleaseType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="出场方式"
        width="170px"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getCarParkReleaseType(row.outReleaseType) }}
        </template>
      </el-table-column> 
    </el-table>

    <el-pagination
      background
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      :page-sizes="[10, 20, 50, 100]"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
      style="margin-top: 10px"
    />
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { carparkUseLogAdmin } from "@/network/api";
import { $timeFormat, timeFn } from "@/utils/index";
import dayjs from "dayjs";
export default {
  data() {
    return {
      list: [],
      dialogVisible: false,
      carTypeOptions: [],
      listLoading: false,
      carStatusOption: ["禁用", "正常", "已过期"],
      layout: "total, sizes, prev, pager, next, jumper",
      carParkReleaseType: [
        { key: 0, name: "未知" },
        { key: 1, name: "自动抬杆" },
        { key: 2, name: "人工抬杆" },
        { key: 3, name: "手机放行" },
        { key: 4, name: "扫码入场" },
        { key: 5, name: "异常放行" },
      ],
      total: 0,
      queryForm: {
        page: 1,
        size: 10,
        numberPlate: '',
        homeGroup: '',
        carType: '',
        newMinInTime: '',
        newMaxInTime: '',
        newMinOutTime: '',
        newMaxOutTime: '',
        minInTime: '',
        maxInTime: '',
        minOutTime: '',
        maxOutTime: '',
        visitUnit: '',
      },
    };
  },
  computed: {
    ...mapState(["carTypeList","paymentAgencyShortNameOptions"]),
  },
  methods: {
    handleClose(done) {
      done();
    },
    getCarParkReleaseType(key) {
      if(key==-1){
        key = 0;
      }
      return this.carParkReleaseType.filter((i) => i.key == key)[0].name;
    },
    timeFormat(time, type) {
      return $timeFormat(time, type);
    },
    getTime(time) {
      return $timeFormat(time, "YYYY-MM-DD HH:mm:ss");
    },
    showDialog() {
      this.dialogVisible = true;
      this.fetchData();
      // 获取所有的车辆类型
      this.$store.dispatch("getAllCarType");
      // 获取支付方式
      this.$store.dispatch("getPaymentAgencyShortNameOptions");
    },
    
    handleQuery() {
      this.queryForm.page = 1;
      this.fetchData();
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.fetchData();
    },

    getTimeFn(inTime, outTime) {
      return timeFn(inTime, outTime);
    },
    // 解决时间搜索 清除后为null的问题
    timeRepairNull(obj) {
      for (const i in obj) {
        if (i != "limit") {
          if (obj[i].value == null) {
            obj[i].value = "";
          }
        }
      }
      return obj;
    },
    getCarTypeName(carType) {
      var carTypeOptions = this.carTypeList;
      if (!carType) return "临时车";
      for (let index = 0; index < carTypeOptions.length; index++) {
        if (carTypeOptions[index].flagKey == carType) {
          return carTypeOptions[index].name;
        }
      }
    },
    getPaymentAgencyShortName(paymentAgencyShortName) {
      var paymentAgencyShortNameList = this.paymentAgencyShortNameOptions;
      if (!paymentAgencyShortName) return "-";
      for (let index = 0; index < paymentAgencyShortNameList.length; index++) {
        if (paymentAgencyShortNameList[index].paymentAgencyName == paymentAgencyShortName) {
          return paymentAgencyShortNameList[index].name;
        }
      }
    },
    clearFalseAndNullValues(obj) {
      if (obj === undefined || obj === null) {
        return {};
      }
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== false && value !== null && value !== "") {
          result[key] = value;
        }
      }
      return result;
    },
    async fetchData() {
      this.listLoading = true;

      if(this.queryForm.newMinInTime){
        this.queryForm.minInTime = dayjs(this.queryForm.newMinInTime).valueOf();
      }else{
        this.queryForm.minInTime = '';
      }

      if(this.queryForm.newMaxInTime){
        this.queryForm.maxInTime = dayjs(this.queryForm.newMaxInTime).valueOf();
      }else{
        this.queryForm.maxInTime = '';
      }

      if(this.queryForm.newMinOutTime){
        this.queryForm.minOutTime = dayjs(this.queryForm.newMinOutTime).valueOf();
      }else{
        this.queryForm.minOutTime = '';
      }

      if(this.queryForm.newMaxOutTime){
        this.queryForm.maxOutTime = dayjs(this.queryForm.newMaxOutTime).valueOf();
      }else{
        this.queryForm.maxOutTime = '';
      }


      const { data, total, code, message } = await carparkUseLogAdmin(
        this.clearFalseAndNullValues(this.queryForm)
      );
      this.listLoading = false;

      if (code != 10002) {
        this.$message.error(message);
        this.list = [];
        this.total = 0;
        return;
      }
      this.list = data;
      if(this.queryForm.page==1){
        this.total = total;
      }
    },
  },
};
</script>
