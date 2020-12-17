<template>
  <div class="option-page">
    <div
      class="option-item"
      v-for="(item,index) in options"
      :class="{[item.type]:true, active:item.value}"
      :key="index"
      @click="item.value=!item.value;mess()"
    >
      <div class="name">{{item.name}}</div>
        <div class="operate">
          <div
            class="button toggle"
            :tabindex="index"
          >
            <div class="bg">
              <div class="point"></div>
            </div>
          </div>
        </div>
        <div class="desc">{{item.desc}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptionPage',
  components: {},
  props: {},
  data () {
    return {}
  },
  inject: ['mess'],
  computed: {
    options () {
      return this.$store.state.option.items
    }
  },
  watch: {},
  created () {
    console.log(this.mess)
  },
  mounted () {},
  methods: {}
}
</script>
<style lang="scss">
.option-page{
  .option-item{
    border-top: 1px solid var(--borderColor);
    padding: 5px 0;
    &:last-child{
      border-bottom: 1px solid var(--borderColor);
    }
    &:hover{
      background-color: var(--lightGray)
    }
  }
  .option-item.switch{
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 100px;
    justify-items: flex-start;
    align-items: flex-start;
    cursor: pointer;
    user-select: none;
    .name{
      grid-row: 1/2;
      grid-column: 1/2;
      color: var(--fontColorDark);
      font-weight: 600;
      font-size: 14rem;
      padding: 5px 0;
    }
    .operate{
      grid-row: 1/3;
      grid-column: 2/3;
      align-self: center;
      justify-self: center;
    }
    .desc{
      grid-row: 2/3;
      grid-column: 1/2;
      padding: 5px 0;
    }
    .button.toggle{
      user-select: none;
      transition: background-color 20ms ease-in 0s;
      cursor: pointer;
      border-radius: 44px;
      outline: none;
      .bg{
        display: flex;
        flex-shrink: 0;
        height: 14px;
        width: 26px;
        border-radius: 44px;
        padding: 2px;
        box-sizing: content-box;
        transition: background-color 200ms ease 0s, box-shadow 200ms ease 0s;
        background: rgba(135,131,120,0.3);
      }
      .point{
        width: 14px;
        height: 14px;
        border-radius: 44px;
        background: white;
        transition: transform 50ms ease-out 0s, background-color 50ms ease-out 0s;
        transform: translateX(0px) translateY(0px);
      }
    }
    &.active .button.toggle{
      .bg{
        background: var(--bgColor);
      }
      .point{
        transform: translateX(12px) translateY(0px);
      }
    }
  }
}
</style>
