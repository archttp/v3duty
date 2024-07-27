<template>
  <div class="login-container">
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <!-- <div class="title">hello !</div>
        <div class="title-tips">欢迎来到{{ Company.title }}</div>
        <div class="login-form-sub-title">请您使用才风智慧APP扫码登录</div>
        <el-image :src="'data:image/png;base64,' + loginImage" width="200" /> -->
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          label-position="left"
        >
          <div class="title">hello !</div>
          <div class="title-tips">欢迎来到{{ Company.title }}</div>
          <div class="title-tips">请您使用 APP/微信/支付宝 扫码登录</div>
          <el-row ju>
            <el-image
              :src="'data:image/png;base64,' + loginImage"
              style="width: 160px; margin-top: 20px"
            />
            <!-- <el-icon><Refresh /></el-icon> -->
          </el-row>

          <!-- <el-form-item prop="username" style="margin-top: 40px">
            <el-input
              v-model.trim="form.username"
              v-focus
              placeholder="请输入用户名"
              tabindex="1"
              type="text"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              placeholder="请输入密码"
              :type="passwordType"
              tabindex="2"
              @keyup.enter="handleLogin"
            >
              <template v-if="passwordType === 'password'" #suffix>
              </template>
              <template v-else #suffix>
              </template>
            </el-input>
          </el-form-item>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            登录
          </el-button> -->
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { login } from "../../network/api/index";
import Company from "../../config";
import { createLoginQrCode, loginByQrCode } from "../../network/api/index";
import qrcodeIconImg from '@/assets/image/qrcode-icon.png';
import { urlToBase64 } from "@/utils/index";
// import { Refresh } from "@element-plus/icons";

var Timer = null;
var TimerNum = 0;

export default {
  name: "Login",
  // components: { Refresh },
  directives: {
    focus: {
      inserted(el) {
        el.querySelector("input").focus();
      },
    },
  },
  created() {
    this.getCode();
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if ("" === value) callback(new Error("用户名不能为空"));
      else callback();
    };
    const validatePassword = (rule, value, callback) => {
      if ("" === value) callback(new Error("请输入密码"));
      else callback();
    };
    return {
      nodeEnv: process.env.NODE_ENV,
      Company: Company,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      timer: 0,

      loginImage: "",
    };
  },

  watch: {
    $route: {
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || "/";
      },
      immediate: true,
    },
  },
  methods: {
    handlePassword() {
      this.passwordType === "password"
        ? (this.passwordType = "")
        : (this.passwordType = "password");
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    async getCode() {

      let base64 = urlToBase64(qrcodeIconImg);
      base64.then(async (resolve)=>{
        const { data, code } = await createLoginQrCode({
          width: "400",
          height: "400",
          contentType: 1,
          doMainId: Company.doMainId,
          logoText: Company.logoText,
          logoIconBase64: resolve.substr(resolve.indexOf(',')+1)
        });
        if (code === 10002) {
          this.loginImage = data.qr_code_images;
          Timer = setInterval(() => {
            this.checkCodeStatus(data.qr_code.id, data.qr_code.randomCode);
            TimerNum += 1;
            if (TimerNum >= 490) {
              clearInterval(Timer);
              TimerNum = 0;
              this.loginImage = "";
              this.$notify.error({
                title: "提示",
                message: "码已失效 请手动刷新",
              });
              // getCode()
            }
          }, 1000);
        }
      })
    
    },
    async checkCodeStatus(id, randomCode) {
      const { data, code, token } = await loginByQrCode({
        qrCodeId: id,
        randomCode: randomCode,
      });
      console.log(data, code, token);
      if (code == 10002) {
        clearInterval(Timer);
        TimerNum = 0;
        localStorage.setItem("userInfo", JSON.stringify(data));
        localStorage.setItem("token", token.access_token);
        this.$router.push("/");
        this.$notify({
          title: "提示",
          message: "登录成功",
          type: "success",
        });
      } else {
        if (code !== 28002) {
          clearInterval(Timer);
          TimerNum = 0;
          this.loginImage = "";
        }
      }
    },
    handleRoute() {
      return this.redirect === "/404" || this.redirect === "/403"
        ? "/"
        : this.redirect;
    },
    handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            var { data, token, code, message } = await login(this.form);
            console.log(data);
            if (code == 10002) {
              this.$notify({
                title: "提示",
                message: "登录成功",
                type: "success",
              });
              localStorage.setItem("userInfo", JSON.stringify(data));
              localStorage.setItem("token", token.jwt_token);
              this.$router.push("/");
            } else {
              this.$notify.error({
                title: "提示",
                message: message,
              });
            }
          } finally {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: url("../../assets/login_images/background.jpg") center center
    fixed no-repeat;
  background-size: cover;
}

.login-form {
  position: relative;
  max-width: 100%;
  padding: 4.5vh;
  margin: calc((100vh - 475px) / 2) 5vw 5vw;
  overflow: hidden;
  background-size: 100% 100%;
}
.login-form .title {
  font-size: 54px;
  font-weight: 500;
  color: #fff;
}
.login-form .title-tips {
  margin-top: 20px;
  font-size: 22px;
  font-weight: 400;
  color: #fff;
}
.login-form .login-btn {
  display: inherit;
  width: 220px;
  height: 50px;
  margin-top: 5px;
  border: 0;
}
.login-form .login-btn:hover {
  opacity: 0.9;
}
.login-form .login-btn .forget-passwordword {
  width: 100%;
  margin-top: 40px;
  text-align: left;
}
.login-form .login-btn .forget-passwordword .forget-password {
  width: 129px;
  height: 19px;
  font-size: 20px;
  font-weight: 400;
  color: #5c66f0;
}
.login-form .tips {
  margin-bottom: 10px;
  font-size: 14px;
  color: #fff;
}
.login-form .tips span:first-of-type {
  margin-right: 16px;
}
.login-form .title-container {
  position: relative;
}
.login-form .title-container .title {
  margin: 0 auto 40px auto;
  font-size: 34px;
  font-weight: bold;
  color: #1890ff;
  text-align: center;
}
.login-form i {
  position: absolute;
  top: 8px;
  left: 5px;
  z-index: 1999;
  font-size: 16px;
  color: #d7dee3;
  cursor: pointer;
  user-select: none;
}
.login-form .show-password {
  position: absolute;
  right: 25px;
  left: -35px;
  font-size: 16px;
  color: #d7dee3;
  cursor: pointer;
  user-select: none;
}
.login-form ::v-deep .el-form-item {
  padding-right: 0;
  margin: 20px 0;
  color: #454545;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
}
.login-form ::v-deep .el-form-item__content {
  min-height: 32px;
  line-height: 32px;
}
.login-form ::v-deep .el-form-item__error {
  position: absolute;
  top: 100%;
  left: 18px;
  font-size: 12px;
  line-height: 18px;
  color: #ff4d4f;
}
.login-form ::v-deep .el-input {
  box-sizing: border-box;
}
.login-form ::v-deep .el-input input {
  height: 48px;
  padding-left: 35px;
  font-size: 14px;
  line-height: 58px;
  background: #f6f4fc;
  border: 0;
}
</style>
