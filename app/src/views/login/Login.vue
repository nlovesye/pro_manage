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
              <Button type="primary" @click="login('form')" long :loading="loading">登录</Button>
          </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input, Icon, Card } from 'iview'
import { md5hash } from '@/utils/hash'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loading: false,
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
      'initNavs',
      'loginSucess'
    ]),
    async login (refName) {
      this.$refs[refName].validate(async flag => {
        if (flag) {
          let reqData = {
            username: this.fData.userName,
            pwd: md5hash(this.fData.pwd)
          }
          let rt = null
          this.loading = true
          try {
            rt = await this.oAxios.post('/user/login', reqData)
            if (!rt.success) {
              throw new Error('账号或密码错误')
            }
          } catch (error) {
            this.loading = false
            this.$Message.error(error.msg || rt.msg)
            return
          }
          await this.loginSucess({
            res: rt.data,
            _: this
          })
          this.setRouter(this.base.routers)
          window.localStorage.setItem('username', rt.data.username)
          window.localStorage.setItem('token', rt.data.token)
          this.$Message.success('登陆成功')
          this.$router.push('/home')
          this.loading = false
        } else {}
      })
    },
    setRouter (rts) {
      // console.log('st', this.$router, this.$router.options, rts)
      if (rts && rts.length) {
        rts.forEach((r, index) => {
          console.log(r)
          let p = r.key === 'TASK' ? 'tasks' : r.path
          let pt = r.key === 'TASK' ? '@/views/home/pages/basedata/costitem/Index.vue' : r.fPath
          r = {
            name: r.name,
            path: p,
            components: {
              [r.key]: () => import(/* webpackChunkName: "任务" */ `${pt}`)
            }
          }
          this.$router.options.routes[1].children.push(r)
        })
        this.$router.addRoutes(this.$router.options.routes)
        console.log('result', this.$router.options.routes[1].children)
      } else {
        console.log('路由数据有误')
      }
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
