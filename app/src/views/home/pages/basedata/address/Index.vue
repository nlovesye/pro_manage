<template>
  <div class="page-basedata-address">
    <div class="head-bar">
      <span>地址档案</span>
    </div>
    <div class="content">
      <div
        v-for="item in addressArr"
        :key="item.level"
        :class="`list-box ${item.level}`"
      >
        <div class="title-bar" v-text="`${item.title}(${item.cur && item.cur.name ? item.cur.name : '未选择'})`"></div>
        <Spin v-if="item.loading" fix></Spin>
        <ul v-else>
          <li
            v-for="(addr, addrIndex) in item.list"
            :key="addr.id"
            :class="addr.isActive ? 'active' : ''"
          >
            <Checkbox
              v-if="addr.level === 0 || addr.level === 1"
              v-model="addr.isChecked"
            ></Checkbox>
            <div
              v-text="addr.name"
              :title="addr.name"
              @click="selectLevel(addr, addrIndex)"
            ></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Checkbox,
  Spin
} from 'iview'
export default {
  data () {
    return {
      addressArr: [
        {
          level: 'province',
          title: '省份列表',
          loading: false,
          cur: {},
          list: []
        },
        {
          level: 'city',
          title: '市级列表',
          loading: false,
          cur: {},
          list: []
        },
        {
          level: 'area',
          title: '县区列表',
          loading: false,
          cur: {},
          list: []
        },
        {
          level: 'town',
          title: '街道、镇列表',
          loading: false,
          cur: {},
          list: []
        }
      ]
    }
  },
  components: {
    Checkbox,
    Spin
  },
  methods: {
    /* 获取省份列表 */
    async getProvinces () {
      this.addressArr[0].loading = true
      let res = await this.oAxios.get('/common/district/getAllProvinces')
      if (res.success) {
        let list = this.dealProvinces([...res.data])
        this.addressArr[0].list = list
      } else {
        console.log('获取省份列表失败！')
      }
      this.addressArr[0].loading = false
    },
    /* 获取对应省份下市列表 */
    async getCities (provinceId) {
      if (provinceId === undefined || provinceId === this.addressArr[0].cur.id) {
        return
      }
      this.addressArr[1].loading = true
      let res = await this.oAxios.get(`/common/district/getCitiesByProvinceCode/${provinceId}`)
      if (res.success) {
        let list = this.dealCities([...res.data])
        this.addressArr[1].list = list
      } else {
        console.log('获取市区列表失败！')
      }
      this.addressArr[1].loading = false
    },
    /* 获取对应市下县区列表 */
    async getArea (cityId) {
      if (cityId === undefined || cityId === this.addressArr[1].cur.id) {
        return
      }
      this.addressArr[2].loading = true
      let res = await this.oAxios.get(`/common/district/getAreasByCityCode/${cityId}`)
      if (res.success) {
        let list = this.dealArea([...res.data])
        this.addressArr[2].list = list
      } else {
        console.log('获取县区列表失败！')
      }
      this.addressArr[2].loading = false
    },
    /* 获取对应县区下城镇列表 */
    async getTown (areaId) {
      if (areaId === undefined || areaId === this.addressArr[2].cur.id) {
        return
      }
      this.addressArr[3].loading = true
      let res = await this.oAxios.get(`/common/district/getStreetsByAreaCode/${areaId}`)
      if (res.success) {
        let list = this.dealTown([...res.data])
        this.addressArr[3].list = list
      } else {
        console.log('获取城镇列表失败！')
      }
      this.addressArr[3].loading = false
    },
    /* 获取片区列表 */
    async getZone () {
      // let res = await this.oAxios.get('/common/dictionary/getDictionaryByTypeAndStatus/20')
    },
    /* 处理省份列表数据 */
    dealProvinces (arr) {
      return arr.map(item => {
        item.isActive = false
        item.isChecked = false
        return item
      })
    },
    /* 处理市列表数据 */
    dealCities (arr) {
      return arr.map(item => {
        item.isActive = false
        item.isChecked = false
        return item
      })
    },
    /* 处理县区列表数据 */
    dealArea (arr) {
      return arr.map(item => {
        item.isActive = false
        item.isChecked = false
        return item
      })
    },
    /* 处理城镇列表数据 */
    dealTown (arr) {
      return arr.map(item => {
        item.isActive = false
        item.isChecked = false
        return item
      })
    },
    /* 点击事件 */
    selectLevel (addr, addrIndex) {
      // console.log(addr)
      switch (addr.level) {
        case 0:
          this.getCities(addr.id)
          break
        case 1:
          this.getArea(addr.id)
          break
        case 2:
          this.getTown(addr.id)
          break
        default:
          break
      }
      this.addressArr[addr.level].cur = { ...addr }
      this.addressArr[addr.level].list = this.addressArr[addr.level].list.map((item, index) => {
        item.isActive = index === addrIndex
        return item
      })
    }
  },
  mounted () {
    this.getProvinces()
    this.getZone()
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
