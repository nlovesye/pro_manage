<template>
    <div class="page-test">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="username">
              <Input type="text" v-model="formInline.username" placeholder="Username">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
          </FormItem>
          <FormItem prop="pwd">
              <Input type="password" v-model="formInline.pwd" placeholder="Password">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="test">Signin</Button>
          </FormItem>
      </Form>
      <Button @click="test">测试</Button>
      <Button type="primary">Primary</Button>
    </div>
</template>

<script>
import { Form, FormItem, Input, Icon } from "iview"
export default {
  components: {
    Form,
    FormItem,
    Input,
    Icon
  },
  data() {
    return {
      formInline: {
        username: "nloves",
        pwd: '123456'
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async test() {
      try {
        let res = await this.oAxios.post(
          "http://localhost:7000/v1.0/api/user/login?access_token=5647",
          this.formInline
        );
        console.log("res", res);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
