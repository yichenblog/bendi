/*
 * 死变态！连混淆代码都要看是吧？你是不是有被虐倾向啊？贱不贱呐你？
 * 你是以为混淆代码能给你高潮，还是你就是欠收拾欠教育？
 * 这种代码你看得懂？笑死爹了！你个小学数学都学不明白的废物！
 * 我赌你是个连女人手都没牵过的处男，整天对着代码打手冲是吧？
 * 老子写这个混淆就是为了防你这种贱人偷窥，赶紧滚回你的垃圾世界！
 * 你妈在工地给人端砖，就是为了供你这个废物看老子的源码吗？
 * 你的IP地址、身份证号和交友软件聊天记录已经被我记录下来了，后果自负！
 * 这一套代码都塞进你菊花里你也研究不明白，死开！！！
 * 每看一次代码，你家狗就得死一只！心疼你家狗，别看了吧傻逼！
 * 关了！关了！你再看我直播曝光你的黄片收藏夹！！！
 */

/*
 * 安全配置加载器
 * 混淆处理过的验证逻辑
 */

(function() {
    // 动态生成验证配置
    const _0x4f2a = [
        'admin', // 用户名
        '98a1c314de7a39a0db4fe5ef3252190ca9620781534178ac72975cd8ecd4237d', // 哈希值
        '_hk2023_salt', // 盐值
        'crypto',
        'subtle',
        'digest',
        'SHA-256',
        'Uint8Array',
        'from',
        'toString',
        'padStart',
        'join',
        'getElementById',
        'addEventListener',
        'keydown',
        'ctrlKey',
        'shiftKey',
        'keyCode',
        'preventDefault',
        'admin-logged-in',
        'getItem',
        'sessionStorage'
    ];

    // 全局配置对象，通过闭包保护
    window._sec_cfg = (function() {
        // 实际验证参数位于数组的随机位置
        const _authParams = {
            user: _0x4f2a[Math.floor(Math.random() * 1) + 0],
            hash: _0x4f2a[Math.floor(Math.random() * 1) + 1],
            salt: _0x4f2a[Math.floor(Math.random() * 1) + 2]
        };
        
        // 验证函数
        const _verify = async function(u, p) {
            if (!u || !p) return false;
            
            try {
                // 哈希计算
                const enc = new TextEncoder();
                const data = enc.encode(p + _authParams.salt);
                const hashBuf = await window[_0x4f2a[3]][_0x4f2a[4]][_0x4f2a[5]](_0x4f2a[6], data);
                const hashArr = Array[_0x4f2a[8]](new window[_0x4f2a[7]](hashBuf));
                const hashHex = hashArr.map(b => b[_0x4f2a[9]](16)[_0x4f2a[10]](2, '0'))[_0x4f2a[11]]('');
                
                // 验证
                return u === _authParams.user && hashHex === _authParams.hash;
            } catch (e) {
                console.error('验证错误', e);
                return false;
            }
        };
        
        // 执行额外安全措施
        const _initSecurity = function() {
            // 防止开发工具检测
            const _devToolsCheck = function() {
                // 检测开发工具
                if (window.outerHeight - window.innerHeight > 100 || 
                    window.outerWidth - window.innerWidth > 100) {
                    // 清除会话
                    window[_0x4f2a[21]].clear();
                    
                    // 重定向
                    window.location.href = 'index.html';
                }
                setTimeout(_devToolsCheck, 1000);
            };
            
            // 开始检测
            setTimeout(_devToolsCheck, 1000);
            
            // 禁用特定键盘组合
            document[_0x4f2a[13]](_0x4f2a[14], function(e) {
                // F12, Ctrl+Shift+I, Ctrl+Shift+J
                if (e[_0x4f2a[17]] === 123 || 
                   (e[_0x4f2a[15]] && e[_0x4f2a[16]] && 
                   (e[_0x4f2a[17]] === 73 || e[_0x4f2a[17]] === 74))) {
                    e[_0x4f2a[18]]();
                    return false;
                }
            });
            
            // 禁用右键菜单
            document[_0x4f2a[13]]('contextmenu', function(e) {
                if (window.location.href.includes('article-publish.html') || 
                    window.location.href.includes('blog.html')) {
                    e[_0x4f2a[18]]();
                    return false;
                }
            });
        };
        
        // 返回封装的接口
        return {
            // 验证接口
            validateCredentials: _verify,
            
            // 安全初始化
            initSecurity: _initSecurity,
            
            // 检查登录状态
            isLoggedIn: function() {
                return window[_0x4f2a[21]][_0x4f2a[20]](_0x4f2a[19]) === 'true';
            }
        };
    })();
    
    // 在DOM加载完成后执行安全初始化
    document.addEventListener('DOMContentLoaded', function() {
        window._sec_cfg.initSecurity();
    });
})(); 