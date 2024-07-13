<?php

// 是否开启跳转
$conf["wxqqjump"]="yes";
// 排除路径 vpay回调地址
$conf["vpayurl"]="vpay";
$conf["payurl"]="pay";
// 排除路径 后台登陆地址
$conf["adminurl"]="admin";


if(strpos($_SERVER['HTTP_USER_AGENT'], 'QQ/')||strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')!==false

    && strpos($_SERVER['REQUEST_URI'], strval($conf["vpayurl"]))===false
    && strpos($_SERVER['REQUEST_URI'], strval($conf["adminurl"]))===false
    && strpos($_SERVER['REQUEST_URI'], strval($conf["payurl"]))===false

    && $conf["wxqqjump"]==="yes"){
   $siteurl='http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];


echo '<html>
<head>
    <meta charset="UTF-8">
    <title>清使用浏览器打开</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta name="format-detection" content="telephone=no">
    <meta content="false" name="twcClient" id="twcClient">
    <meta name="aplus-touch" content="1">
    <style>
        body,html{width:100%;height:100%}
        *{margin:0;padding:0}
        body{background-color:#fff}
        #browser img{
            width:50px;
        }
        #browser{
            margin: 0px 10px;
            text-align:center;
        }
        #contens{
            font-weight: bold;
            color: #2466f4;
            margin:-285px 0px 10px;
            text-align:center;
            font-size:20px;
            margin-bottom: 125px;
        }
        .top-bar-guidance{font-size:15px;color:#fff;height:70%;line-height:1.8;padding-left:20px;padding-top:20px;background:url(banner.png) center top/contain no-repeat}
        .top-bar-guidance .icon-safari{width:25px;height:25px;vertical-align:middle;margin:0 .2em}
        .app-download-tip{margin:0 auto;width:290px;text-align:center;font-size:15px;color:#2466f4;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAcAQMAAACak0ePAAAABlBMVEUAAAAdYfh+GakkAAAAAXRSTlMAQObYZgAAAA5JREFUCNdjwA8acEkAAAy4AIE4hQq/AAAAAElFTkSuQmCC) left center/auto 15px repeat-x}
        .app-download-tip .guidance-desc{background-color:#fff;padding:0 5px}
        .app-download-tip .icon-sgd{width:25px;height:25px;vertical-align:middle;margin:0 .2em}
        .app-download-btn{display:block;width:214px;height:40px;line-height:40px;margin:18px auto 0 auto;text-align:center;font-size:18px;color:#2466f4;border-radius:20px;border:.5px #2466f4 solid;text-decoration:none}
    </style>
</head>
<body>

<div class="top-bar-guidance">
    <p>点击右上角<img src="3dian.png" class="icon-safari">在 浏览器 打开</p>
    <p>苹果设备<img src="iphone.png" class="icon-safari">安卓设备<img src="android.png" class="icon-safari">↗↗↗</p>
</div>

<div id="contens">
<p><br/><br/></p>
<p>1.本站不支持 微信或QQ 内访问</p>
<p><br/></p>
<p>2.请按提示在手机 浏览器 打开</p>
</div>

<div class="app-download-tip">
    <span class="guidance-desc">'.$siteurl.'</span>
</div>
<p><br/></p>
<div class="app-download-tip">
    <span class="guidance-desc">点击右上角<img src="3dian.png" class="icon-sgd"> or 复制网址自行打开</span>
</div>

<script src="jquery-3.3.1.min.js"></script>
<script src="clipboard.min.js"></script>
<a data-clipboard-text="'.$siteurl.'" class="app-download-btn" id="vurl" >点此复制本站网址</a>
<script src="https://cdn.staticfile.org/jquery/1.12.3/jquery.min.js"></script>
<script src="layer/layer.js"></script>
<script type="text/javascript">new ClipboardJS(".app-download-btn");</script>
<script>
$(".app-download-btn").click(function() {
layer.msg("复制成功，请粘贴到浏览器内打开", function(){
      //关闭后的操作
      });})
</script>

<script>
function openu(u){
document.getElementById("vurl").href= u;
document.getElementById("vurl").click();
}
var url = window.location.href;
    if(navigator.userAgent.indexOf("QQ/")> -1){
        openu("ucbrowser://"+url);
        openu("mttbrowser://url="+url);
        openu("baiduboxapp://browse?url="+url);
        openu("googlechrome://browse?url="+url);
        openu("mibrowser:"+url);
        openu("taobao://"+url.split("://")[1]);
        openu("alipays://platformapi/startapp?appId=20000067&url="+url);
        $("html").on("click",function(){
            openu("ucbrowser://"+url);
            openu("mttbrowser://url="+url);
            openu("baiduboxapp://browse?url="+url);
            openu("googlechrome://browse?url="+url);
            openu("mibrowser:"+url);
            openu("taobao://"+url.split("://")[1]);
            openu("alipays://platformapi/startapp?appId=20000067&url="+url);
        });
    }else if(navigator.userAgent.indexOf("MicroMessenger") > -1){
        if(navigator.userAgent.indexOf("Android") > -1){
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
        }else{
               
        }
    }
</script>
<body>
</html>';
exit;
}
?>