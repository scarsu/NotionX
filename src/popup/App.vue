<template>
  <div class="home">
    <header>
      <svg aria-hidden="true">
        <use xlink:href="#icon-notionx"></use>
      </svg>
      <div class="title">NotionX</div>
    </header>
    <section>
      <!-- tab按钮 -->
      <nav>
        <div
          :class="{'tab-btn':true,'active':activeTabKey==='index'}"
          @click="activeTabKey = 'index'"
        >
          <svg aria-hidden="true">
            <use xlink:href="#icon-option"></use>
          </svg>
          <span>{{$t('Options')}}</span>
        </div>
        <div
          :class="{
            'tab-btn':true,
            'active':activeTabKey==='shortcut'
          }"
          @click="activeTabKey = 'shortcut'"
        >
          <svg aria-hidden="true">
            <use xlink:href="#icon-keyboard"></use>
          </svg>
          <span>{{$t('Shortcuts')}}</span>
        </div>
        <div
          :class="{
            'tab-btn':true,
            'active':activeTabKey==='about'
          }"
          @click="activeTabKey = 'about'"
        >
          <svg aria-hidden="true">
            <use xlink:href="#icon-about"></use>
          </svg>
          <span>{{$t('About')}}</span>
        </div>
      </nav>
      <!-- tab内容 -->
      <tab :activeTabKey="activeTabKey">
        <!-- 配置页 -->
        <tab-panel class="tab-content" tabKey="index">
          <option-page></option-page>
        </tab-panel>

        <!-- 快捷键 -->
        <tab-panel class="tab-content" tabKey="shortcut">
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
        </tab-panel>

        <!-- 关于 -->
        <tab-panel class="tab-content" tabKey="about">
          <about-page></about-page>
        </tab-panel>
      </tab>
    </section>
  </div>
</template>

<script>

import '@/assets/svg'
import '@/assets/css/font.css'
import './index.scss'
import shortcuts from '@/utils/shortcuts.json'
import Tab from '@/components/Tab.vue'
import TabPanel from '@/components/TabPanel.vue'
import Toogle from '@/components/Toogle.vue'
import AboutPage from './AboutPage.vue'
import OptionPage from './OptionPage.vue'

export default {
  name: 'PopUp',
  components: { Tab, TabPanel, Toogle, AboutPage, OptionPage },
  data () {
    return {
      keySearch: '',
      activeTabKey: 'index',
      shortcuts: Object.freeze(shortcuts),
      os: 'windows',
      keyToggleAll: false,
    }
  },
  computed: {
    filteredShortcuts () {
      const s = Object.assign({}, this.shortcuts)
      const q = this.keySearch
      for (const tag in s) {
        if (!s || !s[tag].length) {
          delete s[tag]
          continue
        }
        if (!q) continue
        s[tag] = s[tag].filter(e => (e.mac + e.win + e.desc).indexOf(q) >= 0)
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
  methods: {
    getCurrentTabId () {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          resolve(tabs.length ? tabs[0].id : null)
        })
      })
    },
  },
}
</script>

<style lang="scss">
/* ==================== 页面内容 start */
.home{
  width: var(--bodyWidth);
  height: var(--bodyHeight);
  background: var(--bgColor);
  color:#fff;
  position: relative;
  svg{
    width: 35px;
    height: 35px;
    fill: var(--fontColor)
  }
  header{
    height: 120px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    user-select: none;
    padding-left: 2%;
    padding-left: calc((var(--bodyWidth) - var(--tabWidth))/2);
    svg{
      width: 35px;
      height: 35px;
      margin:7.5px 10px 7.5px 0;
    }
    .title{
      font-size: 18rem;
      font-weight: bold;
      line-height: 50px;
    }
  }
  section{
    color:var(--fontColor);
    width: var(--tabWidth);
    height: var(--contentHeight);
    position: absolute;
    top: calc(var(--bodyHeight) - var(--contentHeight) - 10px);
    left: calc((var(--bodyWidth) - var(--tabWidth))/2);
    display: block;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 4px 1wpx #b7b7b7;
    nav{
      height: var(--navHeight);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .tab-btn{
        flex: 1 1 33.3%;
        height: var(--navHeight);
        line-height: var(--navHeight);
        text-align: center;
        border-bottom: 1px solid var(--borderColor);
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        transition: font-size,transform 0.1s ease;
        background: var(--lightGray);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-size: 12rem;
        color: var(--fontColor);
        svg{
          width: 15px;
          height: 100%;
          display: inline-block;
          fill: var(--fontColorLight);
          flex-shrink: 0;
          backface-visibility: hidden;
          margin: 0 10px;
          transform: scaleY(0.9);
        }
        span{
          height: 100%;
          display: inline-block;
          vertical-align: top;
        }
        &:first-child{
          border-bottom-left-radius: 0;
        }
        &:last-child{
          border-bottom-right-radius: 0;
        }
        &:hover{
          color: var(--fontColorDark);
          svg{
            fill: var(--fontColor);
          }
        }
        &.active{
          background: #fff;
          border: 1px solid var(--borderColor);
          border-bottom-color: transparent;
          font-size: 14rem;
          transform: scaleY(1.1);
          transform-origin: bottom;
          color: var(--fontColorDark);
          font-weight: bold;
          svg{
            fill: var(--fontColorDark);
          }
        }
      }
    }
    .tab{
      padding:10px 5px 1em 5px;
      border: 1px solid var(--borderColor);
      border-top-color: transparent;
      height: var(--tabHeight);
    }
    .tab-content{
      height: 100%;
      overflow: auto;
      position: relative;
      .keymap{
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
  }
}
/* ==================== 页面内容 end */
</style>
