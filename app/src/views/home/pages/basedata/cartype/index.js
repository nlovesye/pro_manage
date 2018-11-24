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
  Poptip
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
    Poptip
  },
  data () {
    return {
      tbLoading: false,
      cartypeColumns: [
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
          title: '车型名称',
          key: 'name',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '车种',
          key: 'carKindName',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '箱规格(L*B*H)',
          key: 'boxLength',
          ellipsis: true,
          minWidth: 150,
          render: (h, params) => {
            let { row } = params
            return h('div', `${row.boxLength}*${row.boxWidth}*${row.boxHeight}`)
          }
        },
        {
          title: '车规格(L*H)',
          key: 'carLength',
          ellipsis: true,
          minWidth: 150,
          render: (h, params) => {
            let { row } = params
            return h('div', `${row.carLength}*${row.carHeight}`)
          }
        },
        {
          title: '最大载重(t)',
          key: 'maxWeight',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '最大体积(m³)',
          key: 'maxCapacity',
          ellipsis: true,
          minWidth: 150
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
                    this.deleteCartype(row, false)
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
      cartypeList: [],
      cartypeBook: [],
      cartypeUnitBook: [],
      pager: {
        current: 1,
        total: 0,
        pageSize: 10
      },
      selectRows: [],
      modalShow: false,
      modalTitle: '新建车型',
      modalData: {
        carKindId: null,
        carKindName: '',
        lengthOrWeight: null,
        unitId: null,
        unitName: '',
        name: '',
        boxLength: null,
        boxWidth: null,
        boxHeight: null,
        carLength: null,
        carHeight: null,
        maxWeight: null,
        maxCapacity: null,
        remark: ''
      },
      carKindId: null, // 筛选条件车型ID
      name: '', // 筛选条件车型名称
      rules: {
        carKindId: [
          {
            required: true,
            type: 'number',
            message: '请选择车种',
            trigger: 'change'
          }
        ],
        lengthOrWeight: [
          {
            required: true,
            type: 'number',
            message: '填写车长/车重',
            trigger: 'change'
          }
        ],
        unitId: [{
          required: true,
          type: 'number',
          message: '填写选择单位',
          trigger: 'change'
        }],
        name: [{
          required: true,
          message: '无车型结果',
          trigger: 'change'
        }],
        boxLength: [{
          required: true,
          type: 'number',
          message: '请填写箱长',
          trigger: 'change'
        }],
        boxWidth: [{
          required: true,
          type: 'number',
          message: '请填写箱宽',
          trigger: 'change'
        }],
        boxHeight: [{
          required: true,
          type: 'number',
          message: '请填写箱高',
          trigger: 'change'
        }],
        carLength: [{
          required: true,
          type: 'number',
          message: '请填写车长',
          trigger: 'change'
        }],
        carHeight: [{
          required: true,
          type: 'number',
          message: '请填写车高',
          trigger: 'change'
        }]
      }
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
      this.cartypeBook = await this.getBookList({ oAxios: this.oAxios, target: '车种' })
      this.cartypeUnitBook = await this.getBookList({ oAxios: this.oAxios, target: '车辆计量单位' })
    },
    /* 获取车型列表数据 */
    async getList () {
      this.tbLoading = true
      let reqData = {
        limit: this.pager.pageSize,
        offset: (this.pager.current - 1) * this.pager.pageSize,
        carKindId: this.carKindId,
        name: this.name
      }
      let res = await this.oAxios.post('/common/carType/getCarTypes', reqData)
      this.cartypeList = [...res.data.list]
      this.pager.total = res.data.total
      this.tbLoading = false
    },
    changePage (pageNo) {
      this.pager.current = pageNo
      this.getList()
    },
    changePageSize (pageSize) {
      this.pager.pageSize = pageSize
      this.getList()
    },
    showModal (type, d) {
      if (type === 'edit') {
        this.modalData = {
          ...d
        }
        this.modalTitle = `编辑车型`
      } else {
        this.modalTitle = '新建车型'
      }
      this.modalShow = true
    },
    /* 弹窗改变显示状态 */
    modalChangeShow (flag) {
      if (!flag) {
        this.$refs.form.resetFields()
      }
    },
    async modalOk () {
      let flag = await this.$refs.form.validate()
      if (!flag) {
        this.$refs.modalEdit.buttonLoading = false
        return
      }
      let reqData = {
        ...this.modalData
      }
      try {
        let res = await this.oAxios.post('/common//carType/save', reqData)
        if (res.success) {
          this.getList()
          this.$Message.success('操作成功')
          this.modalShow = false
        } else {
          this.$Message.error('操作失败')
          this.modalShow = false
        }
      } catch (err) {
        this.modalShow = false
      }
    },
    /* 数据字典下拉选择 */
    bookHandleChange (opt, labelKey) {
      this.modalData[labelKey] = opt && opt.label ? opt.label : null
      if (labelKey === 'carKindName' || labelKey === 'unitName') {
        let {
          carKindName,
          unitName,
          lengthOrWeight
        } = this.modalData
        if (carKindName && unitName && lengthOrWeight) {
          this.modalData.name = `${lengthOrWeight}${unitName}${carKindName}`
        } else {
          this.modalData.name = ''
        }
      }
    },
    numberHandleChange (lengthOrWeight) {
      let {
        carKindName,
        unitName
      } = this.modalData
      if (carKindName && unitName) {
        this.modalData.name = `${lengthOrWeight}${unitName}${carKindName}`
      } else {
        this.modalData.name = ''
      }
    },
    /* 删除车型 */
    async deleteCartype (row, isMany) {
      if (isMany && this.selectRows.length < 1) {
        return
      }
      let reqData = isMany ? this.selectRows.map(item => item.id) : [row.id]
      this.oAxios.post('/common/carType/delete', reqData)
        .then(res => {
          this.$Message.success('操作成功')
          this.getList()
        })
        .catch(() => {
          this.$Message.error('操作失败')
        })
    },
    /* 选择表格行 */
    selectRow (selectRows, cur) {
      this.selectRows = [...selectRows]
    }
  },
  mounted () {
    this.init()
  }
}
