<template>
<div class="app">
  <div class="header">
    <div class="left">
      <svg aria-hidden="true">
        <use xlink:href="#icon-notionx"></use>
      </svg>
      <div class="title">NotionX</div>
    </div>
    <div class="right">
      <a href="#" @click="openPage('https://www.notion.so/product')">
        Notion
        <svg aria-hidden="true">
          <use xlink:href="#icon-link"></use>
        </svg>
      </a>
      <a href="#" @click="openPage('https://github.com/scarsu/NotionX')">
        Github
        <svg aria-hidden="true">
          <use xlink:href="#icon-link"></use>
        </svg>
      </a>
    </div>
  </div>
  <div class="content">
    <header>
      <p class="title">NotionX</p>
      <p class="desc">A Browser Extension that enhances Notion experience.</p>
    </header>
    <section>
      <div class="feat">
        <img src="https://scarsu.oss-cn-shanghai.aliyuncs.com/picgo20201126192421.gif" alt="preview">
        <p class="title">Dynamic TOC</p>
        <p class="desc">The TOC of Notion Page will automatically generate in the sidebar of the page，according to Heading Block Header 1-3 in Notion Page.</p>
        <p class="desc">根据Notion Page中的Heading Block 1-3，在网页侧边栏自动生成Notion文章的TOC目录。</p>
      </div>
      <div class="feat">
        <img src="https://scarsu.oss-cn-shanghai.aliyuncs.com/picgo20201126192422.gif" alt="preview">
        <p class="title">Global Low Contrast</p>
        <p class="desc">Compared with Notion's official dark mode, the built-in dark mode of the extension has a lower visual contrast, which takes effect globally, including all contents such as pictures. .</p>
        <p class="desc">相比于Notion官方的暗黑模式，插件内置的暗黑模式的视觉对比度较低，在网页全局生效，包括图片等所有的内容。</p>
      </div>
    </section>
    <footer>
      <div class="row">
        <div class="button">Get from Google Store →</div>
        <a target="_blank" href="https://github.com/scarsu/NotionX/issues" title="Feedback Here">Want more features?</a>
      </div>
      <div class="copyright">© 2020 ScarSu</div>
    </footer>
  </div>
</div>
</template>

<script>

import '@/assets/svg'
export default {
  name: 'App',
  methods: {
    openPage (url) {
      window.open(url)
    }
  },
}
</script>
<style lang="scss">
html,body{
  margin: 0;
  padding: 0;
  font-size:14px;
  font-family: inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  p{
    padding: 0;
    margin: 0;
  }
  *{
    box-sizing: border-box;
  }
}
.app{
  width: 100%;
  display: flex;
  flex-direction: column;
  .header{
    height: 50px;
    width: 100%;
    border-bottom:1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    user-select: none;
    .left{
      margin-left:5vw;
      display: flex;
      flex-direction: row;
      justify-content:center;
      align-items: center;
    }
    .right{
      margin-right:5vw;
      display: flex;
      flex-direction: row;
      justify-content:center;
      align-items: center;
    }
    svg{
      width: 35px;
      height: 35px;
      margin:0 10px;
    }
    .title{
      font-size: 1.3em;
      font-weight: bold;
    }
    a{
      color: #404040;
      text-decoration: none;
      margin: 0 1px;
      padding: 6px;
      border-radius:2px;
      display: inline-block;
      svg{
        width: 1em;
        height: 1em;
        margin: 0;
      }
      // transition: all 0.1s linear;
      &:hover{
        background:#EFEFEF;
      }
    }
  }
  .content{
    min-width: 100%;
    height: calc( 100vh - 50px );
    overflow-y: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    header{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .title{
        font-size: 1.8em;
        font-weight: bold;
        margin: 2vh 0 2vh 0;
      }
      .desc{
        font-size: 1.4em;
        color: #454545;
        padding: 0 2em;
      }
    }
    section{
      width: 70vw;
      margin: 5vh 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0px 60px;
      .feat{
        // width: 200px;
        // height: 150px;
        grid-column: span 1 / auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 1em;
        border-radius: 4px;
        &.clickable{
          cursor: pointer;
          user-select: none;
          transition: all 0.1s cubic-bezier(0.68, -0.85, 0.27, 1.55);
          &:hover{
            // background:#EFEFEF;
            // transform: scale(1.05);
            box-shadow: rgba(84, 70, 35, 0.15) 0px 2px 15px, rgba(84, 70, 35, 0.15) 0px 1px 8px;
          }
        }
        img{
          width: 100%;
          box-shadow: rgba(84, 70, 35, 0.15) 0px 2px 8px, rgba(84, 70, 35, 0.15) 0px 1px 3px;
          border-radius: 4px;
        }
        .title{
          font-size: 1.3em;
          margin: 0.5em 0;
          font-weight: bold;
        }
        .desc{
          color: rgba(0, 0, 0, 0.6);
          font-size: 1em;
          line-height: 1.3em;
        }
      }
    }
    footer{
      .row{
        display: flex;
        flex-direction: row;
      }
      a{
        color: rgba(0, 0, 0, 0.8);
        margin-left: 20px;
        line-height: 2.5em;
        svg{
          width: 1em;
          height: 1em;
          margin: 0;
        }
        &:hover{
          color: rgba(0,0,0,0.95);
        }
      }
      .button{
        height: 2.5em;
        line-height: 2.5em;
        padding: 0 1em;
        border:none;
        font-size: 1.3em;
        user-select: none;
        transition: background 20ms ease-in 0s;
        cursor: pointer;
        flex-shrink: 0;
        white-space: nowrap;
        border-radius: 3px;
        box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset, rgba(15, 15, 15, 0.1) 0px 1px 2px;
        background: rgb(46, 170, 220);
        color: white;
        fill: white;
        font-weight: 500;
        &:hover{
          background: #069CCD;
        }
      }
      .copyright{
        font-size: 1em;
        color: #666;
        text-align: center;
        margin: 1em 0;
      }
    }
  }
}
::-webkit-scrollbar {
  background: transparent;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: #D3D1CB;
}
::-webkit-scrollbar-track {
  background: #EDECE9;
}
</style>
