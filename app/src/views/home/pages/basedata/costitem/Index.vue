<template>
  <div class="page-basedata-costitem">
    <Modal
      ref="modalEdit"
      v-model="modalShow"
      :title="modalTitle"
      loading
      :mask-closable="false"
      :draggable="false"
      :fullscreen="false"
      width="760"
      @on-ok="modalOk"
      @on-visible-change="modalChangeShow"
    >
      <Form
        ref="form"
        :model="modalData"
        :rules="rules"
        inline
      >
        <FormItem
          prop="code"
          label="费用代码"
          :label-width=90
        >
          <Input
            v-model="modalData.code"
            disabled
            placeholder="自动生成"
            style="width: 180px"
          />
        </FormItem>
        <FormItem
          label=""
          :label-width=420
        >
        </FormItem>
        <FormItem
          prop="name"
          label="费用名称"
          :label-width=90
          required
        >
          <Input
            v-model="modalData.name"
            placeholder=""
            style="width: 180px"
          />
        </FormItem>
        <FormItem
          :label-width=420
        >
        </FormItem>
        <FormItem
          label="费用类型"
          :label-width=90
        >
          <RadioGroup
            v-model="selectedType"
            type="button"
            @on-change="typeChange"
          >
            <Radio
              :label="JSON.stringify(item)"
              v-for="item in costtypeBook"
              :key="item.id"
            >{{item.title}}</Radio>
          </RadioGroup>
          <Card
            style="width:320px"
            :dis-hover="true"
          >
            <div>
              <Checkbox
                v-for="item in usetypeBook"
                :key="item.id"
                :value="checkedPayable.some(k => k.id === item.id)"
                @on-change="payableChange(item)"
              >{{item.title}}</Checkbox>
              <CheckboxGroup
                v-model="checkedUselist"
                v-if="showUselist"
              >
                <Checkbox
                  :label="JSON.stringify(item)"
                  :key="item.id"
                  v-for="item in businesstypeBook.filter(item => item.title !== '报关（纯关务）')"
                >{{item.title}}</Checkbox>
              </CheckboxGroup>
            </div>
          </Card>
        </FormItem>
        <FormItem
          :label-width=200
        >
        </FormItem>
        <FormItem
          prop="billingMethodId"
          label="计费方式"
          :label-width=90
        >
          <Select
            style='width: 180px'
            v-model="modalData.billingMethodId"
            placeholder=''
            clearable
            @on-change="opt => bookHandleChange(opt, 'billingMethodName')"
            label-in-value
          >
            <Option
              v-for="item in methodypeBook"
              :value="item.id"
              :key="item.id"
              :label="item.title"
            />
          </Select>
        </FormItem>
        <FormItem
          :label-width=420
        >
        </FormItem>
        <FormItem
          prop="remark"
          label="备注"
          :label-width=90
        >
          <Input
            v-model="modalData.remark"
            placeholder=""
            style="width: 360px"
          />
        </FormItem>
      </Form>
    </Modal>

    <Row
      type="flex"
      justify="start"
      align="middle"
      class="row"
    >
      <Col span="3">
        <Select
          v-model="expenseType"
          placeholder='费用类型'
          @on-change="getList"
          clearable
        >
          <Option
            v-for="item in costtypeBook"
            :value="item.title"
            :key="item.id"
          >
            {{ item.title }}
          </Option>
        </Select>
      </Col>
      <Col span="3">
        <Select
          style="padding-left: 10px"
          v-model="expenseUses"
          placeholder='费用用途'
          @on-change="getList"
          clearable
        >
          <Option
            v-for="item in businesstypeBook"
            :value="item.id"
            :key="item.id"
          >
            {{ item.title }}
          </Option>
        </Select>
      </Col>
      <Col span="3">
        <Select
          style="padding-left: 10px"
          v-model="billingMethodId"
          placeholder='计费方式'
          @on-change="getList"
          clearable
        >
          <Option
            v-for="item in methodypeBook"
            :value="item.id"
            :key="item.id"
          >
            {{ item.title }}
          </Option>
        </Select>
      </Col>
      <Col span="6" push="9">
        <Input
          v-model="keyWord"
          search
          enter-button
          placeholder="费用代码/名称"
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
        <h3>费用项目</h3>
      </Col>
      <Col span="6" class="col-btn">
        <Button type="primary" @click="showModal('add')">
          <Icon type="md-add"></Icon>
          新建
        </Button>
        <Poptip
          confirm
          title="是否删除选中项？"
          @on-ok="deleteCostitem(null, true)"
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
      :columns="costitemColumns"
      :data="costitemList"
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

<script src="./index.js"></script>

<style lang="scss" src="./style.scss"></style>
