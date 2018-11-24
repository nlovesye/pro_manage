import {
  Table,
  Row,
  Col,
  Input,
  Icon,
  Button,
  Page,
  Modal,
  Form,
  FormItem,
  Cascader
} from 'iview'
import { addressToString } from '@/utils'
export default {
  components: {
    Table,
    Row,
    Col,
    Input,
    Icon,
    Button,
    Page,
    Modal,
    Form,
    FormItem,
    Cascader
  },
  data () {
    return {
      tbLoading: false,
      legalpersonColumns: [
        {
          type: 'selection',
          fixed: 'left',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          fixed: 'left',
          width: 80,
          align: 'center',
          title: '序号'
        },
        {
          title: '法人代码',
          key: 'code',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '法人名称',
          key: 'name',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '法人全称',
          key: 'fullName',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '法人地址',
          key: 'address',
          ellipsis: true,
          minWidth: 220,
          render: (h, params) => {
            let { row } = params
            return h('div', {
              class: 'ivu-table-cell-ellipsis'
            }, `${addressToString(row.address)}`)
          }
        },
        {
          title: '所属片区',
          key: 'area',
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
      legalpersonList: [],
      addressArr: [],
      pager: {
        current: 1,
        total: 0,
        pageSize: 10
      },
      selectRows: [],
      modalShow: false,
      modalTitle: '新建法人',
      modalData: {
        code: null,
        name: '',
        fullName: null,
        address: [],
        extra: '',
        area: ''
      },
      rules: {
        code: [
          {
            required: true,
            message: '请填写法人代码',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请填写法人名称',
            trigger: 'change'
          }
        ],
        fullName: [
          {
            required: true,
            message: '请填写法人全称',
            trigger: 'change'
          }
        ],
        address: [{
          type: 'array',
          required: true,
          message: '请选择地址',
          trigger: 'change'
        }],
        area: [
          {
            required: true,
            message: '请选择片区',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    changePage (pageNo) {
      this.pager.current = pageNo
      this.getList()
    },
    changePageSize (pageSize) {
      this.pager.pageSize = pageSize
      this.getList()
    },
    /* 初始化 */
    async init () {
      this.getList()
      this.getProvinces()
    },
    /* 获取法人列表数据 */
    async getList () {
      this.tbLoading = true
      let reqData = {
        limit: this.pager.pageSize,
        offset: (this.pager.current - 1) * this.pager.pageSize
      }
      let res = await this.oAxios.post('/common/faren/getFarens', reqData)
      this.legalpersonList = [...res.data.list]
      this.pager.total = res.data.total
      this.tbLoading = false
    },
    /* 地址变化 */
    async addressChange (val, selectedData) {
      this.address = [...val]
      this.area = '暂无'
      // if (val && val.length === 1) {
      //   this.oAxios.get(`/common/faren/getAreaByAddress/${val[0]}`)
      // }
      // console.log('cd', val, selectedData)
    },
    showModal (type, d) {
      if (type === 'edit') {
        this.modalData = {
          ...d
        }
        this.modalTitle = `编辑法人`
      } else {
        this.modalTitle = '新建法人'
      }
      this.modalShow = true
    },
    /* 弹窗改变显示状态 */
    modalChangeShow (flag) {
      if (!flag) {
        this.$refs.form.resetFields()
      }
    },
    /* 获取省份 */
    async getProvinces () {
      let res = await this.oAxios.get('/common/district/getAllProvinces')
      if (res.success) {
        let list = this.dealAddressList(res.data, 0)
        this.addressArr = list
      } else {
        console.log('获取省份列表失败！')
      }
    },
    /* 获取地址列表 */
    async loadAddress (item, callback) {
      // console.log('item', item)
      item.loading = true
      let res = []
      switch (item.level) {
        case 0:
          res = await this.oAxios.get(`/common/district/getCitiesByProvinceCode/${item.value}`)
          break
        case 1:
          res = await this.oAxios.get(`/common/district/getAreasByCityCode/${item.value}`)
          break
        case 2:
          res = await this.oAxios.get(`/common/district/getStreetsByAreaCode/${item.value}`)
          break
        default :
          break
      }
      item.children = this.dealAddressList(res.data, item.level)
      item.loading = false
      callback()
    },
    /* 处理地址列表数据 */
    dealAddressList (arr, level) {
      return arr.map(item => {
        let rt = {}
        if (level < 2) {
          rt = {
            value: item.id,
            label: item.name,
            level: item.level,
            children: [],
            loading: false
          }
        } else {
          rt = {
            value: item.id,
            label: item.name,
            level: item.level
          }
        }
        return rt
      })
    },
    async modalOk () {
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
