<template>
  <div class="page-system-viewsregister">
    <Modal
      ref='editModal'
      v-model="showEdit"
      :title="editTitle"
      :loading="saveLoading"
      :mask-closable="false"
      @on-ok="editOk"
      @on-cancel="editCancel"
    >
      <p>
        <span style="margin-right: '10px'">父级菜单:</span><span>{{curItem.name}}</span>
      </p>
      <p>
        <span style="margin-right: '10px'">菜单层级:</span><span>{{(curItem.depth || 0) + 1}}</span>
      </p>
      <Form
        ref="form"
        :model="formData"
        :rules="rules"
        :label-width="100"
        inline
      >
        <FormItem prop="key" label="菜单ID(key)">
            <Input type="text" v-model="formData.key" placeholder="" :disabled="openType === 'edit'">
            </Input>
        </FormItem>
        <FormItem prop="sort" label="菜单排序值">
            <InputNumber :max="10" :min="1" v-model="formData.sort" style="width: 162px"></InputNumber>
        </FormItem>
        <FormItem prop="path" label="模块路径">
            <Input type="text" v-model="formData.path" placeholder="">
            </Input>
        </FormItem>
        <FormItem prop="name" label="菜单名称">
            <Input type="text" v-model="formData.name" placeholder="">
            </Input>
        </FormItem>
      </Form>
    </Modal>
    <Tree
      class="menu-tree"
      :data="treeList"
      :render="renderTree"
      children-key="children"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  Tree,
  Modal,
  Form,
  FormItem,
  Input,
  InputNumber
} from 'iview'
export default {
  components: {
    Tree,
    Modal,
    Form,
    FormItem,
    Input,
    InputNumber
  },
  data () {
    return {
      showEdit: false,
      editTitle: '新建菜单',
      saveLoading: true,
      curItem: {},
      openType: 'add',
      treeList: [
        {
          key: 'NS-MENU',
          path: 'home',
          name: '菜单列表',
          depth: -1,
          children: []
        }
      ],
      formData: {
        sort: 1,
        path: '',
        key: '',
        name: ''
      },
      rules: {
        sort: [
          { type: 'number', required: true, message: 'The sort cannot be empty', trigger: 'change' }
        ],
        path: [
          { required: true, message: 'The path cannot be empty', trigger: 'change' }
        ],
        key: [
          { required: true, message: 'The key cannot be empty', trigger: 'change' }
        ],
        name: [
          { required: true, message: 'The path cannot be empty', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'base'
    ])
  },
  methods: {
    async getTreeList () {
      try {
        let resp = await this.oAxios.get(`/user/power?username=${this.base.userName}`)
        this.treeList[0].children = resp.data
      } catch (err) {
        this.treeList[0].children = []
      }
    },
    /* tree渲染 */
    renderTree (h, { root, node, data }) {
      const showAdd = (data.depth < 1)
      const showEdit = data.depth !== -1
      const showRemove = false
      return h('span', {
        style: {
          display: 'inline-block',
          padding: '4px 8px',
          width: '100%'
        }
      }, [
        h('span', {
          style: {
            // marginRight: '20px'
          }
        }, data.name),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            padding: '0 4px'
          }
        }, [
          showAdd ? h('Button', {
            props: {
              type: 'default',
              size: 'small',
              icon: 'ios-add'
            },
            on: {
              click: () => {
                this.addLevel(data)
              }
            }
          }) : null,
          showEdit ? h('Button', {
            style: {
              marginLeft: '8px'
            },
            props: {
              type: 'default',
              size: 'small',
              icon: 'md-create'
            },
            on: {
              click: () => {
                this.editLevel(data)
              }
            }
          }) : null,
          showRemove ? h('Button', {
            style: {
              marginLeft: '8px'
            },
            props: {
              type: 'default',
              size: 'small',
              icon: 'ios-remove'
            },
            on: {
              click: () => {
                this.removeLevel(root, node, data)
              }
            }
          }) : null
        ])
      ])
    },
    /* 添加 */
    addLevel (data) {
      console.log('add', data)
      this.openType = 'add'
      this.editTitle = data.depth === -1 ? '新增一级菜单' : this.editTitle
      this.curItem = data
      this.showEdit = true
    },
    // 编辑
    editLevel (data) {
      this.openType = 'edit'
      this.editTitle = '编辑菜单'
      let parent = null
      if (parseInt(data.depth, 10) === 0) {
        parent = this.treeList[0]
      } else {
        parent = this.treeList[0].children.find(item => {
          if (item.children && item.children.length) {
            return item.children.some(i => i.key === data.key)
          }
        })
      }
      this.curItem = { ...parent }
      this.formData = {
        ...this.formData,
        ...data
      }
      this.showEdit = true
    },
    /* 删除 */
    removeLevel (root, node, data) {
      console.log('remove', root, node, data)
    },
    // 弹窗ok
    async editOk (e) {
      let flag = await this.$refs.form.validate()
      const APINAME = this.openType === 'add' ? 'addMenu' : 'editMenu'
      if (!flag) {
        this.$refs.editModal.buttonLoading = false
        return false
      }
      let reqData = {
        ...this.formData,
        depth: this.curItem.depth,
        pKey: this.curItem.key
      }
      try {
        let res = await this.oAxios.post(`/user/power/${APINAME}`, reqData)
        if (res.success) {
          this.getTreeList()
          this.$Message.success('操作成功')
          this.editCancel()
        } else {
          this.$refs.editModal.buttonLoading = false
          this.$Message.error(res.msg || '操作失败')
        }
      } catch (error) {
        this.$Message.error('操作失败')
        this.$refs.editModal.buttonLoading = false
        return false
      }
    },
    editCancel () {
      this.editTitle = '新建菜单'
      this.showEdit = false
      this.$refs.form.resetFields()
    },
    init () {
      this.getTreeList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
