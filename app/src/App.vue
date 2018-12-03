<template>
  <div id="app">
    <router-view
      class="router-container"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'base'
    ])
  },
  methods: {
    ...mapActions([
      'setRouter'
    ])
  },
  created () {
    this.setRouter({
      _: this,
      routers: this.base.routers
    })
  }
}
</script>
