<template>
  <div
    class="tab-panel"
    v-if="active"
  >
    <slot></slot>
  </div>
</template>

<script>
// filelog:
export default {
  name: 'TabPanel',
  components: {},
  props: {
    tabKey: String,
  },
  data () {
    return {}
  },
  computed: {
    active () {
      return this.$parent.activeTabKey === this.tabKey
    }
  }
}
</script>
<style>
.tab-panel{
  font-size: 12px;
}
</style>
