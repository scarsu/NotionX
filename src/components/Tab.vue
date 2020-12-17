<template>
  <div class="tab">
    <slot></slot>
  </div>
</template>

<script>
// filelog:
export default {
  name: 'Tab',
  props: {
    activeTabKey: String
  },
}
</script>
