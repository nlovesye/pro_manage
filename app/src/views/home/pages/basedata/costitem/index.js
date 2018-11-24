import {
  Table,
  Row,
  Col,
  Select,
  Option,
  Input,
  Icon,
  Button,
  Page,
  Modal,
  Form,
  FormItem,
  InputNumber,
  Poptip,
  Radio,
  RadioGroup,
  Card,
  Checkbox,
  CheckboxGroup
} from 'iview'
import { mapActions } from 'vuex'
export default {
  components: {
    Table,
    Row,
    Col,
    Select,
    Option,
    Input,
    Icon,
    Button,
    Page,
    Modal,
    Form,
    FormItem,
    InputNumber,
    Poptip,
    Radio,
    RadioGroup,
    Card,
    Checkbox,
    CheckboxGroup
  },
  data () {
    return {
      tbLoading: false,
      costitemColumns: [
        {
          type: 'selection',
          fixed: 'left',
          width: 40,
          align: 'center'
        },
        {
          type: 'index',
          fixed: 'left',
          width: 60,
          align: 'center',
          title: '序号'
        },
        {
          title: '费用代码',
          key: 'code',
          ellipsis: true,
          minWidth: 120
        },
        {
          title: '费用名称',
          key: 'name',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '费用类型',
          key: 'typeName',
          ellipsis: true,
          minWidth: 140
        },
        {
          title: '费用用途',
          key: 'expenseUses',
          ellipsis: true,
          minWidth: 160,
          render: (h, params) => {
            let {
              row
            } = params
            return h('div', `${row.expenseUses},${row.receivableOrPayable}`)
          }
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true,
          minWidth: 160
        },
        {
          className: 'action',
          title: '操作',
          fixed: 'right',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                class: 'btn',
                on: {
                  click: () => {
                    this.showModal('edit', params.row)
                  }
                }
              }, '编辑'),
              h('Poptip', {
                props: {
                  confirm: true,
                  transfer: true,
                  title: '是否删除？',
                  placement: 'top',
                  'popper-class': 'pop-del'
                },
                on: {
                  'on-ok': () => {
                    const { row } = params
                    this.deleteCostitem(row, false)
                  }
                }
              }, [
                h('span', {
                  class: 'btn'
                }, '删除')
              ])
            ])
          }
        }
      ],
      costitemList: [],
      costtypeBook: [],
      businesstypeBook: [],
      usetypeBook: [],
      methodypeBook: [],
      pager: {
        current: 1,
        total: 0,
        pageSize: 10
      },
      expenseType: null,
      expenseUses: null,
      billingMethodId: null,
      keyWord: '',
      selectRows: [],
      modalShow: false,
      modalType: 'add',
      modalTitle: '新建费用项',
      modalData: {
        code: null,
        name: '',
        typeId: null,
        typeName: '',
        billingMethodId: null,
        billingMethodName: '',
        receivableOrPayable: [],
        expenseUseList: [],
        unitConfigure: [],
        remark: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请填写费用名称',
          trigger: 'change'
        }]
      },
      selectedType: '',
      checkedPayable: [],
      checkedUselist: [],
      showUselist: true
    }
  },
  methods: {
    ...mapActions([
      'findBook',
      'getBookList'
    ]),
    /* 初始化 */
    async init () {
      this.getList()
      this.costtypeBook = await this.getBookList({ oAxios: this.oAxios, target: '费用类型' })
      this.businesstypeBook = await this.getBookList({ oAxios: this.oAxios, target: '业务模式' })
      this.methodypeBook = await this.getBookList({ oAxios: this.oAxios, target: '计费方式' })
      try {
        this.usetypeBook = await this.getBookList({ oAxios: this.oAxios, target: '费用用途' })
      } catch (err) {
        this.usetypeBook = [
          {
            id: 245,
            title: '应收'
          },
          {
            id: 246,
            title: '应付'
          }
        ]
      }
    },
    /* 初始化 */
    /* 获取费用项列表数据 */
    async getList () {
      this.tbLoading = true
      let reqData = {
        limit: this.pager.pageSize,
        offset: (this.pager.current - 1) * this.pager.pageSize,
        expenseType: this.expenseType,
        expenseUses: this.expenseUses,
        billingMethodId: this.billingMethodId,
        keyWord: this.keyWord
      }
      let res = await this.oAxios.post('/common/expense/getExpenses', reqData)
      this.costitemList = [...res.data.list]
      this.pager.total = res.data.total
      this.tbLoading = false
    },
    /* 获取列表数据 */
    changePage (pageNo) {
      this.pager.current = pageNo
      this.getList()
    },
    changePageSize (pageSize) {
      this.pager.pageSize = pageSize
      this.getList()
    },
    /* 选择表格行 */
    selectRow (selectRows, cur) {
      this.selectRows = [...selectRows]
    },
    /* 打开弹窗 */
    showModal (type, d) {
      if (type === 'edit') {
        this.modalData = {
          ...d
        }
        this.selectedType = JSON.stringify(this.costtypeBook.find(item => item.id === d.typeId))
        this.typeChange(this.selectedType)
        this.checkedPayable = this.usetypeBook.filter(item => d.receivableOrPayable.split(',').some(name => name === item.title))
        this.checkedUselist = this.businesstypeBook.filter(item => d.expenseUses.split(',').some(name => name === item.title)).map(item => JSON.stringify(item))
        this.modalTitle = `编辑费用项`
        this.modalType = 'edit'
      } else {
        this.modalTitle = '新建费用项'
        this.modalType = 'add'
      }
      this.modalShow = true
    },
    /* 打开弹窗 */
    /* 清除数据 */
    clearData () {
      this.selectedType = ''
      this.checkedPayable = []
      this.checkedUselist = []
      this.showUselist = true
    },
    /* 清除数据 */
    /* 弹窗改变显示状态 */
    modalChangeShow (flag) {
      if (!flag) {
        this.$refs.form.resetFields()
        this.clearData()
      }
    },
    /* 弹窗改变显示状态 */
    /* 弹窗ok提交 */
    async modalOk () {
      let flag = await this.$refs.form.validate()
      if (!flag) {
        this.$refs.modalEdit.buttonLoading = false
        return
      }
      this.modalData.typeId = JSON.parse(this.selectedType).id
      this.modalData.typeName = JSON.parse(this.selectedType).title
      this.modalData.receivableOrPayable = this.checkedPayable.map(item => ({
        id: item.id,
        name: item.title
      }))
      this.modalData.expenseUseList = this.checkedUselist.map(item => {
        let obj = JSON.parse(item)
        return {
          id: obj.id,
          name: obj.title
        }
      })
      let reqData = {
        ...this.modalData
      }
      let url
      if (this.modalType === 'add') {
        url = '/common/expense/save'
      } else if (this.modalType === 'edit') {
        url = `/common/expense/edit/${reqData.id}`
      } else {}
      try {
        let res = await this.oAxios.post(url, reqData)
        if (res.success) {
          this.getList()
          this.$Message.success('操作成功')
          this.modalShow = false
        } else {
          throw new Error('服务器错误')
        }
      } catch (err) {
        this.$Message.error('操作失败')
        this.modalShow = false
      }
    },
    /* 数据字典下拉选择 */
    bookHandleChange (opt, labelKey) {
      this.modalData[labelKey] = opt && opt.label ? opt.label : null
    },
    /* 删除 */
    async deleteCostitem (row, isMany) {
      if (isMany && this.selectRows.length < 1) {
        return
      }
      let reqData = isMany ? this.selectRows.map(item => item.id) : [row.id]
      this.oAxios.post('/common/expense/delete', reqData)
        .then(res => {
          this.$Message.success('操作成功')
          this.getList()
        })
        .catch(() => {
          this.$Message.error('操作失败')
        })
    },
    payableChange (item) {
      this.checkedPayable = [item]
    },
    typeChange (target) {
      this.showUselist = JSON.parse(target).title === '仓储费用'
      this.checkedUselist = []
    }
  },
  async mounted () {
    await this.init()
  }
}
