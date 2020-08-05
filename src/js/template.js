const template = {
  notionx: `
  <div id="notionx" class="notionx-sidebar-container">
    <nav class="notionx-sidebar">
      <div class="notionx-hider-btn">
        <svg class="notionx-icon" aria-hidden="true">
          <use xlink:href="#icon-list"></use>
        </svg>
      </div>

      <div class="notionx-header">
        <div>
          <i>setting btn</i>
          <i>pin btn</i>
          <i>top btn</i>
          <i>sidebar orientation btn</i>
        </div>
      </div>

      <div class="notionx-views">
        <div class="notionx-view notionx-view-toc">
          <li>
            <a href="#test"></a>
          </li>
        </div>

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
      </div>

      <div class="notionx-footer">
        <p>
          NotionX by
          <a href="www.scarsu.com">ScarSu</a>
        </p>
      </div>
    </nav>
  </div>
  `,
  sideBarBtn: `
  <div id="notionx-sidebar-btn" title="Lock Notionx open">
    icon
  </div>
  `,
  darkBtn: `
  <div id="notionx-dark-btn" title="Notionx Dark Mode">
    <input type="checkbox" id="dark-mode-inp"/>
    <label for="dark-mode-inp"></label>
  </div>
  `
}
export default template
