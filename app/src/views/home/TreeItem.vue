<template>
  <Submenu
    v-if='node.children && node.children.length && (!node.children.some(item => item.type === "view"))'
    :name='node.key'
  >
    <template slot='title'>
      <Icon type="ios-navigate"></Icon>
      <span v-if="!base.isCollepsed">{{node.name || '无名称'}}</span>
    </template>
    <tree-item
      v-for='(item, index) in node.children'
      :key='item.key || index'
      :list='node.children'
      :node='item'
    />
  </Submenu>
  <menu-item
    v-else-if='node.type !== "view" && node.type !== "menu_hide"'
    :key='node.key'
    :name='node.key'
  >
    <Icon type="md-home" v-if='node.key === "HOME"'></Icon>
    <span v-if="!base.isCollepsed">{{node.name || ''}}</span>
  </menu-item>
</template>

<script>
import {
  Submenu,
  MenuItem,
  Icon
} from 'iview'
import { mapState } from 'vuex'
export default {
  name: 'tree-item',
  components: {
    Submenu,
    MenuItem,
    Icon
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    node: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState([
      'base'
    ])
  },
  render (h) {
    return h('div', 'hello')
  }
}
</script>
