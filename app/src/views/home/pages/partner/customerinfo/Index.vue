<template>
  <div class="page-partner-customerinfo">
    <Row
      type="flex"
      justify="flex-start"
      align="middle"
      class="row"
    >
      <Col span="3">
        <Select
          v-model="carKindId"
          placeholder='所属片区'
          @on-change="getList"
          clearable
        >
          <Option
            v-for="item in areaBook"
            :value="item.id"
            :key="item.id"
          >
            {{ item.title }}
          </Option>
        </Select>
      </Col>
      <Col span="3">
        <Select
          style="paddingLeft: 10px"
          v-model="carKindId"
          placeholder='合作状态'
          @on-change="getList"
          clearable
        >
          <Option
            v-for="item in cooperativeBook"
            :value="item.id"
            :key="item.id"
          >
            {{ item.title }}
          </Option>
        </Select>
      </Col>
      <Col span="12" />
      <Col span="6">
        <Input
          v-model="name"
          search
          enter-button
          placeholder="客户代码/名称"
          @on-enter="getList"
          @on-search="getList"
        />
      </Col>
    </Row>
    <Row
      type="flex"
      justify="space-between"
      align="middle"
      class="row"
    >
      <Col span="4">
        <h3>客户列表</h3>
      </Col>
      <Col span="6" class="col-btn">
        <Button type="primary" @click="showModal('add')">
          <Icon type="md-add"></Icon>
          新建
        </Button>
        <Poptip
          confirm
          title="是否删除选中项？"
          @on-ok="deleteCartype(null, true)"
        >
          <Button type="error">
            <Icon type="ios-trash"></Icon>
            删除
          </Button>
        </Poptip>
      </Col>
    </Row>
    <Table
      border
      ref="selection"
      :columns="iColumns"
      :data="iList"
      width='500px'
      :loading="tbLoading"
      @on-select="selectRow"
    >
      <Page
        class-name='custom-page'
        slot='footer'
        :total="pager.total"
        :current="pager.current"
        :page-size="pager.pageSize"
        show-elevator
        show-sizer
        show-total
        @on-change="changePage"
        @on-page-size-change="changePageSize"
      />
    </Table>
  </div>
</template>

<script>
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
  name: 'customerinfo',
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
      pager: {
        current: 1,
        total: 0,
        pageSize: 10
      },
      iColumns: [
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
      iList: [],
      areaBook: [],
      cooperativeBook: []
    }
  },
  methods: {
    ...mapActions([
      'getBookList'
    ]),
    /* 表格页码操作--start */
    changePage (pageNo) {
      this.pager.current = pageNo
      this.getList()
    },
    changePageSize (pageSize) {
      this.pager.pageSize = pageSize
      this.getList()
    },
    /* 表格页码操作--end */
    /* 表格操作--start */
    selectRow (selectRows, cur) {
      this.selectRows = [...selectRows]
    },
    /* 表格操作--end */
    /* 获取iList数据--start */
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
    /* 获取iList数据--end */
    /* 初始化 */
    async init () {
      this.getList()
      this.areaBook = await this.getBookList({ oAxios: this.oAxios, target: '片区' })
      this.cooperativeBook = await this.getBookList({ oAxios: this.oAxios, target: '合作状态' })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" src='./style.scss'></style>
