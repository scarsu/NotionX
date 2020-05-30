var $notion=$("#notion-app")
var notionFlag = $notion.length>0

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
  }

  // 定时
  setInterval(updateList,10000)
  setInterval(function checkUrl(){
    if(path !== location.pathname){
      updateList()
    }
  },1000)

}