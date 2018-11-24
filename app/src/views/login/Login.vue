<template>
  <div class="page-login">
    <Card>
      <img src="~@/assets/img/logo.png" alt="" />
      <Form ref="form" :model="fData" :rules="fDataRules" :inline="false">
          <FormItem prop="userName">
              <i-input type="text" v-model="fData.userName" placeholder="用户名">
                  <Icon type="ios-person-outline" size='14' slot="prepend"></Icon>
              </i-input>
          </FormItem>
          <FormItem prop="pwd">
              <i-input type="password" v-model="fData.pwd" placeholder="密码">
                  <Icon type="ios-lock-outline" size='14' slot="prepend"></Icon>
              </i-input>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="login('form')" long>登录</Button>
          </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input, Icon, Card } from 'iview'
import { md5hash } from '@/utils/hash'
import qs from 'qs'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      fData: {
        userName: '',
        pwd: ''
      },
      fDataRules: {
        userName: {
          required: true,
          message: '请输入用户名',
          trigger: 'change'
        },
        pwd: {
          required: true,
          message: '请输入密码',
          trigger: 'change'
        }
      }
    }
  },
  components: {
    Form,
    FormItem,
    iInput: Input,
    Button,
    Card,
    Icon
  },
  computed: {
    ...mapState([
      'base'
    ])
  },
  methods: {
    ...mapActions([
      'initNavs'
    ]),
    async login (refName) {
      this.$refs[refName].validate(flag => {
        if (flag) {
          let reqData = {
            grant_type: 'password',
            remember: false,
            username: this.fData.userName,
            password: md5hash(this.fData.pwd)
          }
          this.oAxios.post('/oauth/token', qs.stringify(reqData))
            .then(res => {
              let now = Date.now()
              this.initNavs([...res.permissions])
              window.localStorage.setItem('access_token', res.access_token)
              window.localStorage.setItem('refresh_token', res.refresh_token)
              window.localStorage.setItem('navs', JSON.stringify(this.base.navs))
              window.localStorage.setItem('expires_in', res.expires_in)
              window.localStorage.setItem('username', res.username)
              window.localStorage.setItem('getTokenTime', now)
              // this.$store.dispatch('initNavs', [...res.permissions])
              this.$router.push('/home')
            })
            .catch(err => {
              console.log(err)
              this.$Message.error(err.msg || '登录失败')
            })
        } else {

        }
      })
    }
  }
}
</script>

<style lang="scss">
.page-login{
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fefefe;
  .ivu-card{
    width: 400px;
    img{
      display: block;
      margin: 0 auto;
      width: 100px;
      padding-bottom: 20px;
    }
  }
}
</style>
