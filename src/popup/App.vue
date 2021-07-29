<template>
  <div :class="{home:true,disable:!active}">
    <header>
      <svg aria-hidden="true">
        <use xlink:href="#icon-notionx"></use>
      </svg>
      <div class="title">
        NotionX
        <span class="title-desc">Enhance Notion experience~</span>
      </div>
      <div
        :class="{switch:true, active:active}"
        @click="switchNotionx"
        :title="active?'禁用Disable':'启用Enable'"
      >
        <!-- <div class="name">关闭插件</div> -->
        <div class="operate">
          <div
            class="button toggle"
          >
            <div class="bg">
              <div class="point"></div>
            </div>
          </div>
        </div>
      </div>
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
          <shortcut-page></shortcut-page>
        </tab-panel>

        <!-- 关于 -->
        <tab-panel class="tab-content" tabKey="about">
          <about-page></about-page>
        </tab-panel>
      </tab>
    </section>
    <div class="disable-mask" v-if="!active">
      <p>已禁用</p>
      <p>Disabled</p>
    </div>
  </div>
</template>

<script>

import '@/assets/svg'
import '@/assets/css/font.css'
import './index.scss'
import Tab from '@/components/Tab.vue'
import TabPanel from '@/components/TabPanel.vue'
import AboutPage from './page/AboutPage.vue'
import ShortcutPage from './page/ShortcutPage.vue'
import OptionPage from './page/OptionPage.vue'

export default {
  name: 'PopUp',
  components: { Tab, TabPanel, AboutPage, ShortcutPage, OptionPage },
  data () {
    return {
      activeTabKey: 'index',
    }
  },
  computed: {
    active () {
      return this.$store.getters.active
    }
  },
  methods: {
    switchNotionx () {
      this.$store.commit('updateOption', {
        option: {
          action: 'disableNotionX',
          value: this.active,
          hide: true,
        },
        needEffect: true
      })
    },
    getCurrentTabId () {
      return new Promise((resolve, reject) => {
        if (chrome) {
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs.length ? tabs[0].id : null)
          })
        } else {
          browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
            resolve(tabs.length ? tabs[0].id : null)
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
      flex: 1 1 auto;
      .title-desc{
        font-size: 12px;
        font-style: italic;
        font-weight: normal;
        margin-left: 1em;
      }
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
    }
  }
  /* 开关 */
  .switch{
    margin: 20px 20px 0 0;
    z-index: 100;
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
        transition: border-color,background-color 200ms ease 0s, box-shadow 200ms ease 0s;
        background: rgba(255,255,255,0.6);
        border: 1px solid transparent;
      }
      .point{
        width: 14px;
        height: 14px;
        border-radius: 44px;
        background: #fff;
        transition: transform 50ms ease-out 0s, background-color 50ms ease-out 0s;
        transform: translateX(0px) translateY(0px);
      }
    }
    &.active .button.toggle{
      .bg{
        background: var(--bgColor);
        border-color: #fff;
      }
      .point{
        transform: translateX(12px) translateY(0px);
      }
    }
  }
  .disable-mask{
    position: absolute;
    width: var(--bodyWidth);
    height: var(--bodyHeight);
    z-index: 99;
    top: 0;
    cursor: not-allowed;
    right: 0;
    background: rgba(200,200,200,0.9);
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    color: #fff;
    padding-top: 5em;
  }
}
/* ==================== 页面内容 end */
</style>
