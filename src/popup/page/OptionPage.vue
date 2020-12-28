<template>
  <div class="option-page">
    <div
      class="option-item"
      v-for="(item,index) in options"
      :key="index"
    >
      <!-- 开关类型选项 -->
      <div
        v-if="item.type==='switch'"
        :class="{[item.type]:true, active:item.value}"
        @click="event=>handleOption(item, event)"
      >
        <div class="name">{{$t(item.name)}}</div>
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
        <div class="desc">{{$t(item.desc)}}</div>
        <div class="loading" v-show="item.loading">
          <svg aria-hidden="true">
            <use xlink:href="#icon-loading"></use>
          </svg>
        </div>
      </div>
      <!-- 下拉类型选项 -->
      <div
        v-if="item.type==='select'"
        :class="{[item.type]:true}"
      >
        <div class="name">{{$t(item.name)}}</div>
        <div class="operate">
          <select class="select" @change="event=>handleOption(item, event)">
            <option v-for="e in item.options" :key="e.value" :value="e.value" :label="e.label" :selected="e.value===item.value"></option>
          </select>
        </div>
        <div class="desc">{{$t(item.desc)}}</div>
        <div class="loading" v-show="item.loading">
          <svg aria-hidden="true">
            <use xlink:href="#icon-loading"></use>
          </svg>
        </div>
      </div>
      <!-- 按钮选项 -->
      <div
        v-if="item.type==='button'"
        :class="{[item.type]:true}"
        @click="event=>handleOption(item, event)"
      >
        <div class="name">{{$t(item.name)}}</div>
        <div class="desc">{{$t(item.desc)}}</div>
        <div class="loading" v-show="item.loading">
          <svg aria-hidden="true">
            <use xlink:href="#icon-loading"></use>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EXTENSION_STORAGE_OPTION_KEY } from '@/utils/constant'
import { handleOption } from '@/store/option'
export default {
  name: 'OptionPage',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {
    options () {
      return this.$store.state.option.items
    }
  },
  watch: {},
  created () {
  },
  mounted () {
    this.effectLocalOption()
  },
  methods: {
    handleOption (option, event) {
      const t = option.needLoading
      if (t) {
        this.$set(option, 'loading', true)
        setTimeout(() => {
          this.$set(option, 'loading', false)
        }, t)
      }
      handleOption.call(this, option, event)
    },
    // 将本地存储配置生效
    effectLocalOption () {
      const local = window.localStorage.getItem(EXTENSION_STORAGE_OPTION_KEY)
      if (!local) return

      // 先更新store
      this.$store.commit('updateOptions', {
        options: JSON.parse(local),
        needEffect: true
      })
    },
  }
}
</script>
<style lang="scss">
.option-page{
  .option-item{
    border-top: 1px solid var(--borderColor);
    &:last-child{
      border-bottom: 1px solid var(--borderColor);
    }
    &:hover{
      background-color: var(--lightGray)
    }
    &>div{
      &>.loading{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.3);
        padding-top: 5%;
        svg{
          animation: loading 1s infinite;
          transition: transform .2s ease;
        }
      }
      position: relative;
      padding: 5px 0;
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
    }
    /* 开关 */
    .switch{
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
}
@keyframes loading{
  from{
    transform: rotate(0);
  }
  to{
    transform: rotate(360deg);
  }
}
</style>
