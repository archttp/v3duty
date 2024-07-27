<template>
  <el-dialog
    v-model="dialogVisible"
    title="交班"
    width="30%"
    :before-close="handleClose"
  >
    <el-form
      ref="loginFrom"
      :model="from"
      status-icon
      :rules="rules"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model="from.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="from.password"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >de</el-button
        >
        <el-button @click="resetForm('ruleForm')">Reset</el-button>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onLogin" :loading="loading"
          >登录</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { logout, login } from "@/network/api";

export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      from: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入正确的用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入正确的密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleClose(done) {
      done();
    },
    showDialog() {
      this.dialogVisible = true;
    },
    onLogin() {
      this.$refs["loginFrom"].validate(async (valid) => {
        this.loading = true;
        if (valid) {
          await logout({
            type: "all",
          });
          localStorage.clear();
          var { data, token, code, message } = await login(this.from);
          if (code == 10002) {
            this.$message({
              message,
              type: "success",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            localStorage.setItem("token", token.jwt_token);
            location.reload();
          } else if (code == 24007) {
            localStorage.clear();
            this.$message.error("账号密码错误 请检查");
          } else {
            localStorage.clear();
            this.$message.error(message);
          }
          this.loading = false;
        } else {
          this.loading = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>