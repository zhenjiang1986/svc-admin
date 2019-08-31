<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="userModel"
      :rules="rules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">统一登陆</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="userModel.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <!-- https://cn.vuejs.org/v2/api/#key  key更信后元素会重新渲染 -->
          <el-input
            :key="passwordType"
            ref="password"
            v-model="userModel.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="off"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPassword">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >Login</el-button>
    </el-form>
  </div>
</template>

<script>

import {Log} from '@/utils/log'

export default {
  name: "Login",
  data: function() {
    return {
      userModel: {
        username: "admin",
        password: "1q2w3E*"
      },
      rules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.userModel.username === "") {
      this.$refs.username.focu();
    }

    if (this.userModel.password === "") {
      this.$refs.username.focu();
    }
    /**https://cn.vuejs.org/v2/guide/reactivity.html#异步更新队列 */
    this.$nextTick(() => {
      this.$refs.password.focus();
    });
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPassword() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          this.$store
            .dispatch("user/login", {
              username: this.userModel.username,
              password: this.userModel.password
            })
            .then(() => {

              this.$store.dispatch("user/getInfo").then(()=>{
                  this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              });

              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    getOtherQuery(query) {
      /**https://www.runoob.com/jsref/jsref-reduce.html 最后一个参数是初始值 */
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style lang="scss">
$bgColor: #283443;
$light-gray: #fff;
$cursor: #fff;
/**  改变光标颜色  https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/ */
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/** https://blog.csdn.net/qq_41022291/article/details/82217015 */
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
      padding: 12px 5px 12px 5px;
      color: $light-gray;
      height: 47px;
      caret-color: $cursor;
      /** https://blog.csdn.net/qq_41022291/article/details/82217015 */
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bgColor inset !important;
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

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
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
}
</style>





