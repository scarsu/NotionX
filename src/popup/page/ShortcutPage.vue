<template>
  <div class="shortcut-page">
    <!-- 快捷键搜索 -->
    <input
      class="search"
      type="text"
      v-model="keySearch"
      placeholder="search shortcuts..."
      clearable
    >
    <!-- 清空搜索框 -->
    <svg
      class="search-clear"
      aria-hidden="true"
      @click="keySearch=''"
      v-if="keySearch"
    >
      <use xlink:href="#icon-error"></use>
    </svg>
    <!-- 全部折叠/展开 -->
    <div class="toggle-all" @click="keyToggleAll=!keyToggleAll">
      <svg aria-hidden="true" style="width:1em;height:1em;">
        <use xlink:href="#icon-collapse"></use>
      </svg>
    </div>
    <!-- 切换平台 -->
    <div class="os-toggle" @click="os=os==='windows'?'apple':'windows'">
      <svg
        aria-hidden="true"
        :class="{active: os==='windows'}"
        title="Windows/Linux系统"
      >
        <use xlink:href="#icon-windows"></use>
      </svg>
      <svg
        aria-hidden="true"
        :class="{active: os==='apple'}"
        title="MacOS系统"
      >
        <use xlink:href="#icon-apple"></use>
      </svg>
    </div>
    <!-- 快捷键列表 -->
    <div style="height:calc(100% - 25px);overflow-y:auto;padding-bottom:3em;">
      <div
        v-for="tag in Object.keys(filteredShortcuts)"
        :key="tag"
        class="togglable"
      >
        <toogle :text="tag" :id="tag" :toggle="keyToggleAll">
          <div
            v-for="(map,index) in filteredShortcuts[tag]"
            :key="index"
            class="keymap"
          >
            <span v-if="os==='apple'" class="code">{{map.mac}}</span>
            <span v-else class="code">{{map.win}}</span>
            <br>
            <span>{{map.desc}}</span>
          </div>
        </toogle>
      </div>
    </div>
    <!-- 键统计 -->
    <div class="key-count">
      <a href="https://www.notion.so/Learn-the-shortcuts-66e28cec810548c3a4061513126766b0#5c679ece35ee4e81b1217333a4cf35b3" title="Official Docs">Official Docs</a>
      Total : {{keyCount}}
    </div>
  </div>
</template>

<script>
import '@/assets/svg'
import '@/assets/css/font.css'
import shortcuts from '@/utils/shortcuts.json'
import Toogle from '@/components/Toogle.vue'
export default {
  name: 'ShortcutPage',
  components: { Toogle },
  props: {},
  data () {
    return {
      keySearch: '',
      shortcuts: Object.freeze(shortcuts),
      os: 'windows',
      keyToggleAll: false,
    }
  },
  computed: {
    filteredShortcuts () {
      const s = Object.assign({}, this.shortcuts[this.$store.state.locale] || this.shortcuts.en)
      const q = this.keySearch
      for (const tag in s) {
        if (!s || !s[tag].length) {
          delete s[tag]
          continue
        }
        if (!q) continue
        s[tag] = s[tag].filter(e => (e.mac + e.win + e.desc + e.originDesc || '').toLowerCase().indexOf(q.toLowerCase().trim()) >= 0)
        if (!s[tag].length) delete s[tag]
      }
      return s
    },
    keyCount () {
      const s = this.filteredShortcuts
      let count = 0
      for (const tag in s) {
        count += s[tag].length
      }
      return count
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style lang="scss">
.shortcut-page{
  height: 100%;
  overflow: auto;
  position: relative;
  .toogle{
    .content{
      border-bottom: 1px solid var(--borderColor);
    }
    .keymap{
      margin: 5px 0;
      .code{
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        line-height: normal;
        background: rgba(135,131,120,0.15);
        color: #EB5757;
        border-radius: 3px;
        font-size: 85%;
        padding: 0.2em 0.4em;
      }
    }
  }
  .toggle-all{
    width: 20px;
    height: 25px;
    padding: 5px 3px;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid var(--borderColor);
    color: var(--fontColor);
    cursor: pointer;
    user-select: none;
    position: absolute;
    right: 45px;
    top: 0;
    &:hover{
      background: rgba(0,0,0,0.07);
    }
  }
  .os-toggle{
    width: 40px;
    height: 25px;
    position: absolute;
    right: 0;
    top: 0;
    svg{
      width: 20px;
      height: 25px;
      padding: 0 3px;
      box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid var(--borderColor);
      color: var(--fontColor);
      cursor: pointer;
      user-select: none;
      &:first-child{
        border-right-color: transparent;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      &:last-child{
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
      &.active{
        background: rgba(0,0,0,0.07);
      }
      // &:hover{
      //   background: rgba(0,0,0,0.07);
      // }
    }
  }
  input.search{
    display: block;
    border: 1px solid var(--borderColor);
    width: 270px;
    margin: 0;
    line-height: 25px;
    height: 25px;
    color: var(--fontColor);
    outline: none;
    border-radius: 5px;
  }
  input.search+svg.search-clear{
    width: 12px;
    height: 12px;
    fill: var(--fontColorLight);
    position: absolute;
    right: 85px;
    top: 6px;
    cursor: pointer;
    &:hover{
      fill: var(--fontColorDark);
    }
  }
  .key-count{
    color: var(--fontColorLight);
    text-align: right;
    position: fixed;
    width: calc(var(--tabWidth) - 4em);
    bottom: 10px;
    left: calc((var(--bodyWidth) - var(--tabWidth))/2 + 2em);
    background: #fff;
  }
}
</style>
