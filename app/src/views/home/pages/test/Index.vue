<template>
    <div class='page-test'>
      <Button @click='test' type='primary' :loading='loading'>测试接口数据</Button>
    </div>
</template>

<script>
import { Form, FormItem, Input, Icon } from 'iview'
export default {
  components: {
    Form,
    FormItem,
    Input,
    Icon
  },
  data () {
    return {
      loading: false,
      formInline: {
        username: 'nloves',
        pwd: '123456'
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: 'Please fill in the user name',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: 'Please fill in the password.',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: 'The password length cannot be less than 6 bits',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async test () {
      this.loading = true
      let res = null
      try {
        res = await this.oAxios.post('/test', this.formInline)
        if (res.success) {
          this.$Message.success(res.msg)
        } else {
          throw Error('获取数据失败')
        }
      } catch (error) {
        this.$Message.error(error.msg || res.msg || '获取数据失败')
      }
      this.loading = false
    }
  }
}
</script>
