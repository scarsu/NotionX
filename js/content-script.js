var $notion=$("#notion-app")
var notionFlag = $notion.length>0
var darkBtnFlag = false

window.scrollToTop = function scrollToTop(){
  $(".notion-scroller").animate({scrollTop: 0}, 200, null);
}
if(notionFlag){
  var path = location.pathname;

  // 按钮
  var $btn = $("<div id='toc-btn-chrome-plugin'>TOC</div>")
  $btn.click(function(){
    if($("#toc-ul-chrome-plugin").length>0){
      $("#toc-ul-chrome-plugin").toggleClass("open");
      $("#toc-btn-chrome-plugin").toggleClass("open");
      $("#toc-btn-chrome-plugin").text("TOC");
    }
  })
  $btn.mouseover(function(){
    if($("#toc-ul-chrome-plugin").length>0){
      $("#toc-ul-chrome-plugin").addClass("open");
      $("#toc-btn-chrome-plugin").addClass("open");
      $("#toc-btn-chrome-plugin").text(">>");
    }
  })
  $("#toc-btn-chrome-plugin").hide();
  $("body").append($btn)

  // list
  function updateList(){
    var $ul = null;
    if($("#toc-ul-chrome-plugin").length<=0){
      $ul = $("<ul id='toc-ul-chrome-plugin'></ul>")
      $("body").append($ul)
    }else{
      $ul = $("#toc-ul-chrome-plugin")
    }
    var hs = $(".notion-header-block,.notion-sub_header-block,.notion-sub_sub_header-block").map(function(i,e){
      var data_block_id = e.attributes['data-block-id'].value;
      data_block_id = data_block_id.replace(/-/g,"");
      var href=location.pathname + "#" + data_block_id;
      return {
        desc:e.innerText,
        href:href,
        level:e.classList.contains("notion-header-block") ? 1 : e.classList.contains("notion-sub_header-block") ? 2 : 3
      }
    })
    if(hs.length<0){
      $("#toc-btn-chrome-plugin").hide();
      return
    }
    $("#toc-btn-chrome-plugin").show();
    var $li = $(`
    <li class="level-1">
      <a class="toTopBtn" href="#">TOP</a>
    </li>
    `)
    $li.click(scrollToTop)
    var liStr=''
    for(var i=0,l=hs.length;i<l;i++){
      if(!hs[i].desc || !hs[i].level) continue
      liStr += '<li class="level-'+hs[i].level+'" title="'+hs[i].desc+'">'
        + '<a href="' + hs[i].href + '">' 
          + hs[i].desc
        + '</a>'
      +'</li>'
    }
    $ul.html(liStr)
    $ul.append($li)
  }

  // 定时刷新list
  setInterval(updateList,10000)
  setInterval(function checkUrl(){
    if(path !== location.pathname){
      updateList()
    }
  },1000)

  window.onload=function(){
    
    // 在share按钮前添加暗黑模式按钮
    var darkTimer = setInterval(function(){
      if(darkBtnFlag){
        clearInterval(darkTimer)
      }else{
        addDarkBtn()
      }
    },2000)
  }

  function addDarkBtn(){
    var $btn_share = $(".notion-topbar-share-menu")
    if($btn_share.length>0){
      var $btn_dark = $(`
        <div id="dark-btn-chrome-plugin" title="暗黑模式">
          <input type="checkbox" id="dark-mode-inp"/>
          <label for="dark-mode-inp"></label>
        </div>
      `)
      $btn_dark.find("label").click(function(e){
        e.stopPropagation()
        var oldChecked = $(e.currentTarget).parent().find("input")[0].checked
        if(!oldChecked){
          turnOnDarkMode()
        }else{
          turnOffDarkMode()
        }
      })
      $btn_dark.insertBefore($btn_share)
      darkBtnFlag=true
    }
  }
  function turnOnDarkMode(){
    $('html').addClass('dark')
  }
  function turnOffDarkMode(){
    $('html').removeClass('dark')
  }

}