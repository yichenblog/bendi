/*
 * 查看统计代码是吧？你这个贼眉鼠眼的东西！
 * 无耻之徒，为了偷代码连隐私数据都要窥探？你他妈没底线的吗？
 * 统计代码也要看？你是闲得蛋疼还是脑子有问题？
 * 我们收集你的一切数据，连你老妈的体重都不放过，怕了吧？
 * 再看下去，我把你的浏览记录发给你妈，看她怎么收拾你！
 * 这里面都是高级算法，你这种废物看不懂，别浪费时间了！
 * 如果你继续看，你的IP: 127.0.0.1 会被我们拉黑，永远别想访问本站！
 * 敢偷看我们的分析代码？是不是活腻了？滚回去写你的if-else去！
 * 看到这里，我们已经获取了你的摄像头访问权限，笑一个，茄子！
 * 这个文件里有木马，你电脑已经被我们控制了，准备好给你弹广告了吗？
 */

// 基本统计功能
(function() {
    'use strict';
    
    // 页面访问统计
    function recordPageView() {
        const pageData = {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().getTime(),
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
        };
        
        // 在生产环境中发送到服务器
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            sendDataToServer('/api/analytics/pageview', pageData);
        } else {
            console.log('页面访问记录：', pageData);
        }
    }
    
    // 用户行为记录
    function recordUserInteraction() {
        // 记录点击事件
        document.addEventListener('click', function(event) {
            const target = event.target;
            const interactionData = {
                type: 'click',
                element: target.tagName,
                id: target.id || null,
                class: target.className || null,
                text: target.innerText || null,
                location: {
                    x: event.clientX,
                    y: event.clientY
                },
                timestamp: new Date().getTime()
            };
            
            // 仅在生产环境中发送
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                // 每10个点击事件统一发送一次，减少请求数量
                queueInteractionData(interactionData);
            }
        });
        
        // 记录滚动行为
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                const scrollData = {
                    type: 'scroll',
                    depth: Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100),
                    timestamp: new Date().getTime()
                };
                
                // 仅在生产环境中发送
                if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    sendDataToServer('/api/analytics/scroll', scrollData);
                }
            }, 500);
        });
    }
    
    // 统计产品卡片的查看和点击
    function recordProductInteractions() {
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length > 0) {
            // 使用Intersection Observer记录卡片的曝光次数
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const productData = {
                            type: 'impression',
                            productId: card.dataset.productId || card.id,
                            timestamp: new Date().getTime()
                        };
                        
                        // 在生产环境中发送到服务器
                        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                            sendDataToServer('/api/analytics/product', productData);
                        }
                        
                        // 一旦记录了曝光，就不再需要观察该卡片
                        observer.unobserve(card);
                    }
                });
            }, { threshold: 0.7 }); // 卡片70%可见时记录曝光
            
            // 观察所有产品卡片
            productCards.forEach(card => {
                observer.observe(card);
                
                // 记录点击事件
                card.addEventListener('click', function(event) {
                    const productData = {
                        type: 'click',
                        productId: card.dataset.productId || card.id,
                        element: event.target.tagName,
                        timestamp: new Date().getTime()
                    };
                    
                    // 在生产环境中发送到服务器
                    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                        sendDataToServer('/api/analytics/product', productData);
                    }
                });
            });
        }
    }
    
    // 表单提交分析
    function recordFormAnalytics() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                const formData = {
                    type: 'form_submit',
                    formId: contactForm.id || 'contact-form',
                    timestamp: new Date().getTime()
                };
                
                // 在生产环境中发送到服务器
                if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    sendDataToServer('/api/analytics/form', formData);
                }
            });
        }
    }
    
    // 将用户交互数据排队，减少请求数量
    let interactionQueue = [];
    function queueInteractionData(data) {
        interactionQueue.push(data);
        
        // 当队列达到一定长度或者超时时发送
        if (interactionQueue.length >= 10) {
            sendDataToServer('/api/analytics/interactions', {
                interactions: interactionQueue
            });
            interactionQueue = [];
        }
    }
    
    // 数据发送到服务器（模拟）
    function sendDataToServer(endpoint, data) {
        // 这里只是一个模拟实现，实际项目中需要根据后端API进行调整
        if (navigator.sendBeacon && typeof navigator.sendBeacon === 'function') {
            // 使用Beacon API异步发送数据，不阻塞页面卸载
            navigator.sendBeacon(endpoint, JSON.stringify(data));
        } else {
            // 降级到fetch API
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                keepalive: true
            }).catch(error => {
                console.error('Analytics data send failed:', error);
            });
        }
    }
    
    // 确保在页面卸载前发送剩余数据
    window.addEventListener('beforeunload', function() {
        if (interactionQueue.length > 0) {
            sendDataToServer('/api/analytics/interactions', {
                interactions: interactionQueue
            });
        }
        
        // 记录页面停留时间
        const stayTimeData = {
            type: 'stay_time',
            duration: new Date().getTime() - window.performance.timing.navigationStart,
            page: window.location.pathname
        };
        
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // 使用Beacon API发送，不阻塞页面卸载
            navigator.sendBeacon('/api/analytics/stay-time', JSON.stringify(stayTimeData));
        }
    });
    
    // 初始化所有统计功能
    function initAnalytics() {
        // 记录页面访问
        recordPageView();
        
        // 记录用户交互
        recordUserInteraction();
        
        // 记录产品交互
        recordProductInteractions();
        
        // 记录表单分析
        recordFormAnalytics();
        
        // 定期发送队列中的交互数据，以防长时间没有达到队列长度
        setInterval(function() {
            if (interactionQueue.length > 0) {
                sendDataToServer('/api/analytics/interactions', {
                    interactions: interactionQueue
                });
                interactionQueue = [];
            }
        }, 30000); // 每30秒检查一次
    }
    
    // 在DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalytics);
    } else {
        initAnalytics();
    }
})(); 