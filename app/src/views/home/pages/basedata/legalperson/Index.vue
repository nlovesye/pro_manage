<template>
  <div class="page-basedata-legalperson">
    <Modal
      v-model="modalShow"
      :title="modalTitle"
      loading
      :mask-closable="false"
      :draggable="false"
      :fullscreen="false"
      width="860"
      @on-ok="modalOk"
      @on-visible-change="modalChangeShow"
    >
      <Form
        ref="formInline"
        :model="modalData"
        :rules="rules"
        inline
      >
        <FormItem
          prop="code"
          label="法人代码"
          :label-width=90
          required
        >
          <Input
            v-model="modalData.code"
            placeholder=""
            style="width: 170px"
          />
        </FormItem>
        <FormItem
          prop="name"
          label="法人名称"
          :label-width=90
          required
        >
          <Input
            v-model="modalData.name"
            placeholder=""
            style="width: 170px"
          />
        </FormItem>
        <FormItem
          prop="fullName"
          label="法人全称"
          :label-width=90
          required
        >
          <Input
            v-model="modalData.fullName"
            placeholder=""
            style="width: 170px"
          />
        </FormItem>
        <FormItem
          prop="address"
          label="法人地址"
          :label-width=90
          required
        >
          <Cascader
            :data="addressArr"
            :load-data="loadAddress"
            change-on-select
            style="width: 360px"
            @on-change="addressChange"
            v-model="modalData.address"
          ></Cascader>
        </FormItem>
        <FormItem
          prop="extra"
          :label-width=0
          required
        >
          <Input
            v-model="modalData.extra"
            placeholder="详细地址"
            style="width: 150px"
          />
        </FormItem>
        <FormItem
          prop="area"
          label="片区"
          :label-width=60
          required
        >
          <Input
            disabled
            v-model="modalData.area"
            placeholder="片区"
            style="width: 120px"
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
        <h3>公司法人</h3>
      </Col>
      <Col span="6" class="col-btn">
        <Button type="primary" @click="showModal('add')">
          <Icon type="md-add"></Icon>
          新建
        </Button>
      </Col>
    </Row>
    <Table
      border
      ref="selection"
      :columns="legalpersonColumns"
      :data="legalpersonList"
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
