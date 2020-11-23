const template = {
  notionx: `
  <div id="notionx" class="notionx-sidebar-container">
    <nav class="notionx-sidebar">
      <div class="notionx-resizer"></div>

      <div class="notionx-header">
        <div class="notionx-icon logo">
          <svg aria-hidden="true">
            <use xlink:href="#icon-notionx-svg"></use>
          </svg>
        </div>
        <div class="title-wrap">
          <div class="title">NotionX</div>
          <div class="notionx-icon option-btn">
            <svg aria-hidden="true">
              <use xlink:href="#icon-setting"></use>
            </svg>
          </div>
        </div>
        <div class="notionx-hider-btn notionx-icon">
          <svg aria-hidden="true">
            <use xlink:href="#icon-right-arrow"></use>
          </svg>
        </div>
      </div>

      <div class="notionx-views">
        <div class="notionx-view notionx-view-toc" data-view="toc">
          <div class="header">
            <input type="checkbox" id="toc-inp"/>
            <label for="toc-inp">
              Table Of Content
            </label>
            <div class="content notionx-view-toc-content-wrap">content</div>
          </div>
        </div>
        <div class="notionx-view notionx-view-option" data-view="option">
          <div class="header">
            <label>
              Options
            </label>
            <label for="toc-show-dark">
            显示暗黑模式开关
            </label>
            <input type="checkbox" id="toc-show-dark"/>
          </div>
        </div>
      </div>

      <div class="notionx-footer">
        <div style="flex: 1 1 auto;">
          NotionX by
          <a href="www.scarsu.com">ScarSu</a>
        </div>
        <div class="notionx-icon to-top-btn">
          <svg aria-hidden="true">
            <use xlink:href="#icon-top"></use>
          </svg>
        </div>
      </div>
    </nav>
  </div>
  `,
  // <a class="to-top-btn" href="#">SCROLL TO TOP</a>
  settingView: `
  <div class="notionx-view notionx-view-setting">
    <div>
      <span>how to trigger sidebar:</span>
      <select name="triggerWay" id="triggerWay">
        <option value="hover">hover</option>
        <option value="click">click</option>
      </select>
    </div>
    <div>
      <span>Hide Dark Mode Btn:</span>
      <input type="checkbox" name="showDark" id="showDark"/>
    </div>
  </div>
  `,
  sideBarBtn: `
  <div id="notionx-sidebar-btn" title="Lock Notionx open">
    <div style="position:relative;">
      <div class="icon-wrap inactive">
        <div class="notionx-icon">
          <svg aria-hidden="true">
            <use xlink:href="#icon-list"></use>
          </svg>
        </div>
      </div>
      <div class="icon-wrap active">
        <div class="notionx-icon">
          <svg aria-hidden="true">
            <use xlink:href="#icon-left-arrow"></use>
          </svg>
        </div>
      </div>
    </div>
  </div>
  `,
  darkBtn: `
  <div id="notionx-dark-btn" title="Notionx Dark Mode">
    <input type="checkbox" id="dark-mode-inp"/>
    <label for="dark-mode-inp"></label>
  </div>
  `,
}
// 转换图片资源路径
function _adapterImg (obj) {
  // for (const key in obj) {
  //   const str = obj[key]
  //   str.replace(/<img/, '')
  // }
  return obj
}
export default _adapterImg(template)
