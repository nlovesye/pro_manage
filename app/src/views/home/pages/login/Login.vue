<template>
  <div class="page-login">
    <Card dis-hover class="login-card">
      <h2 slot="title">
        <img src="~@asset/imgs/logo.png" alt="">
        供应链智慧云平台
      </h2>
      <div class="username">
        <Icon type="person" size="16"></Icon>
        <Input v-model="username" placeholder="账号" />
      </div>
      <div class="password">
        <Icon type="locked" size="16"></Icon>
        <Input v-model="password" placeholder="密码" />
      </div>
      <div class="options">
        <Checkbox v-model="isRemember" size="large">记住密码</Checkbox>
        <router-link to="/">忘记密码</router-link>
      </div>
      <Button type="primary" size="large" @click="doLogin" long>登录</Button>
    </Card>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      isRemember: false
    }
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    doLogin () {
      this.login({doReq: this.doReq, Axios: this.axios, username: this.username, password: this.password})
    }
  }
}
</script>

<style lang="scss">
.page-login{
  position: absolute;
  width: 100%;
  height: 100%;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-card{
    max-width: 420px;
    width: 100%;
    padding: 10px 6px 16px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.11), 0 1px 4px rgba(0,0,0,0.11);
    h2{
      img{
        max-width: 100px;
        vertical-align: middle;
      }
      font-weight: 500;
      font-size: 1.5em;
      text-align: left;
      padding: 24px 10px 12px;
    }
    .username{
      margin: 10px auto 20px;
      position: relative;
      .ivu-icon{
        position: absolute;
        z-index: 70;
        top: 50%;
        margin-top: -8px;
        left: 10px;
      }
      input{
        padding-left: 28px;
      }
    }
    .password{
      @extend .username;
    }
    .options{
      display: flex;
      margin: 22px auto;
      padding: 12px 0 0;
      justify-content: space-between;
      align-content: center;
    }
  }
}
</style>
