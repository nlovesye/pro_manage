<template>
  <div class="page-basedata-cartype">
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
          prop="carKindId"
          label="选择车种"
          :label-width=90
          required
        >
          <Select
            style='width: 120px'
            v-model="modalData.carKindId"
            placeholder='车种'
            clearable
            @on-change="opt => bookHandleChange(opt, 'carKindName')"
            label-in-value
          >
            <Option
              v-for="item in cartypeBook"
              :value="item.id"
              :key="item.id"
              :label="item.title"
            />
          </Select>
        </FormItem>
        <FormItem
          prop="lengthOrWeight"
          label="车长/车重"
          :label-width=90
          required
        >
          <InputNumber :min="0" v-model="modalData.lengthOrWeight" @on-change='numberHandleChange' />
        </FormItem>
        <FormItem
          prop="unitId"
          :label-width=0
          :show-message="false"
        >
          <Select
            style='width: 80px'
            v-model="modalData.unitId"
            placeholder=''
            clearable
            @on-change="opt => bookHandleChange(opt, 'unitName')"
            label-in-value
          >
            <Option
              v-for="item in cartypeUnitBook"
              :value="item.id"
              :key="item.id"
              :label="item.title"
            />
          </Select>
        </FormItem>
        <FormItem
          prop="name"
          label="车型结果"
          :label-width=90
          required
        >
          <Input
            v-model="modalData.name"
            disabled
            placeholder="车型结果"
            style="width: 120px"
          />
        </FormItem>
        <FormItem
          prop="boxLength"
          label="箱规格"
          :label-width=90
          required
        >
          <InputNumber :min="0" placeholder="长(L)" v-model="modalData.boxLength" />
        </FormItem>
        <FormItem
          prop="boxWidth"
          :label-width=0
        >
          <InputNumber :min="0" placeholder="宽(B)" v-model="modalData.boxWidth" />
        </FormItem>
        <FormItem
          prop="boxHeight"
          :label-width=0
        >
          <InputNumber :min="0" placeholder="高(H)" v-model="modalData.boxHeight" />
        </FormItem>
        <FormItem
          prop="carLength"
          label="车规格"
          :label-width=90
          required
        >
          <InputNumber :min="0" placeholder="长(L)" v-model="modalData.carLength" />
        </FormItem>
        <FormItem
          prop="carHeight"
          :label-width=0
          required
        >
          <InputNumber :min="0" placeholder="高(H)" v-model="modalData.carHeight" />
        </FormItem>
        <FormItem
          prop="maxWeight"
          label="最大载重(t)"
          :label-width=90
        >
          <InputNumber style='width: 120px' :min="0" placeholder="" v-model="modalData.maxWeight" />
        </FormItem>
        <FormItem
          prop="maxCapacity"
          label="最大体积(m³)"
          :label-width=90
        >
          <InputNumber style='width: 120px' :min="0" placeholder="" v-model="modalData.maxCapacity" />
        </FormItem>
        <FormItem
          prop="remark"
          label="备注"
          :label-width=90
        >
          <Input
            v-model="modalData.remark"
            placeholder=""
            style="width: 180px"
          />
        </FormItem>
      </Form>
    </Modal>
    <Row
      type="flex"
      justify="space-between"
      align="middle"
      class="row"
    >
      <Col span="4">
        <Select
          v-model="carKindId"
          placeholder='车种'
          @on-change="getList"
          clearable
        >
          <Option
            v-for="item in cartypeBook"
            :value="item.id"
            :key="item.id"
          >
            {{ item.title }}
          </Option>
        </Select>
      </Col>
      <Col span="6">
        <Input
          v-model="name"
          search
          enter-button
          placeholder="车型名称"
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
        <h3>车型列表</h3>
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
      :columns="cartypeColumns"
      :data="cartypeList"
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
