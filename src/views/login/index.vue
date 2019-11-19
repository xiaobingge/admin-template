<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          后台登录系统
        </h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <drag-verify
        :width="width"
        :height="height"
        :text="text"
        :success-text="successText"
        :background="background"
        :progress-bar-bg="progressBarBg"
        :completed-bg="completedBg"
        :handler-bg="handlerBg"
        :handler-icon="handlerIcon"
        :text-size="textSize"
        :success-icon="successIcon"
        :circle="isCircle"
        ref="Verify"
      >
      </drag-verify>

      <el-button :loading="loading" type="primary" style="width:100%;height:45px;margin-bottom:30px;margin-top: 20px;" @click.native.prevent="handleLogin">
        登录
      </el-button>

    </el-form>

  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  import 'font-awesome/css/font-awesome.min.css'
  import dragVerify from 'vue-drag-verify'

  export default {
    name: 'Login',
    components: {dragVerify},
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('登录账号不能为空'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur',validator:validateUsername}],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        redirect: undefined,
        handlerIcon: "fa fa-angle-double-right",
        successIcon: "fa fa-check",
        background: "#cccccc",
        progressBarBg: "#4b0",
        completedBg: "#66cc66",
        handlerBg: "#fff",
        text: "请将滑块拖动到右侧",
        successText: "验证成功",
        width: 350,
        height: 47,
        textSize: "20px",
        isCircle: true
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      },


    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            if (!this.$refs.Verify.isPassing) {
              this.$message.warning('请将滑块拖动到右侧');
              return false
            }
            this.loading = true;
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      afterQRScan() {
        // const hash = window.location.hash.slice(1)
        // const hashObj = getQueryObject(hash)
        // const originUrl = window.location.origin
        // history.replaceState({}, '', originUrl)
        // const codeMap = {
        //   wechat: 'code',
        //   tencent: 'code'
        // }
        // const codeName = hashObj[codeMap[this.auth_type]]
        // if (!codeName) {
        //   alert('第三方登录失败')
        // } else {
        //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //     this.$router.push({ path: '/' })
        //   })
        // }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    .login-form {
      position: relative;
      width: 420px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 22px;
        color: $light_gray;
        margin: 0px auto 20px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size:18px;
        right: 0px;
        cursor: pointer;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }
</style>
