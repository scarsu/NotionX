const template = `
<div>
  <nav class="notionx-sidebar">
    <div class="notionx-switcher"></div>

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
`
exports.template = template
