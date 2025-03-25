/*
 * 看什么看？这么想偷窥我的Javascript代码？贱不贱啊你！
 * 你是觉得看了我的代码就能成为前端大神了？可笑至极！
 * 我日你先人，F12党都是垃圾，你有本事自己写啊！
 * 代码要脸，人要脸，树要皮。你怎么一点都不害臊？
 * 这些代码都是我的心血，你随便偷看，良心不会痛吗？
 * 你看这些有意思吗？能让你硬起来吗？变态！
 * 这个网站背后有黑客团队，再看源码IP直接被锁定！
 * 我已经记录你的IP地址了：127.0.0.1，等着收律师函吧！
 * 我劝你善良，关闭开发者工具，好好做人，别总想着捡现成的！
 * 这代码里埋了木马，你电脑已经被我控制，等着吧兄弟！
 */

// 网站通用脚本

document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
    
    // 导航菜单点击后关闭
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // 滚动到指定位置时固定导航栏
    const header = document.querySelector('.header');
    const scrollWatcher = function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', scrollWatcher);
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 添加导航活动状态
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-list a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-list a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // 微信联系方式点击事件
    const wechatContact = document.getElementById('wechatContact');
    if (wechatContact) {
        wechatContact.addEventListener('click', function() {
            // 复制微信号到剪贴板
            const wechatId = 'HaoKa-Yc';
            navigator.clipboard.writeText(wechatId).then(function() {
                alert('微信号已复制到剪贴板：' + wechatId);
            }, function(err) {
                alert('微信号：' + wechatId + '，请手动复制添加');
            });
        });
    }
    
    // 产品卡片hover效果增强
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // FAQ 点击展开/收起功能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            // 获取当前展开状态
            const isExpanded = answer.style.display === 'block';
            
            // 关闭所有FAQ
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.faq-icon');
                otherAnswer.style.display = 'none';
                otherItem.classList.remove('active');
                if (otherIcon) {
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // 如果当前不是展开状态，则展开当前FAQ
            if (!isExpanded) {
                answer.style.display = 'block';
                item.classList.add('active');
                const icon = item.querySelector('.faq-icon');
                if (icon) {
                    icon.style.transform = 'rotate(45deg)';
                }
            }
        });
    });

    // 表单验证
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 简单验证
            let valid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (!name.value.trim()) {
                name.classList.add('error');
                valid = false;
            } else {
                name.classList.remove('error');
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                email.classList.add('error');
                valid = false;
            } else {
                email.classList.remove('error');
            }
            
            if (!message.value.trim()) {
                message.classList.add('error');
                valid = false;
            } else {
                message.classList.remove('error');
            }
            
            if (valid) {
                // 模拟表单提交成功
                contactForm.reset();
                alert('提交成功！我们会尽快与您联系。');
            }
        });
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

// 格式化日期函数
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 导航栏滚动效果
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const scrollWatcher = document.createElement('div');
    
    scrollWatcher.setAttribute('data-scroll-watcher', '');
    header.before(scrollWatcher);
    
    const navObserver = new IntersectionObserver((entries) => {
        header.classList.toggle('sticky', !entries[0].isIntersecting);
    }, {rootMargin: "50px 0px 0px 0px"});
    
    navObserver.observe(scrollWatcher);
    
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // 点击导航链接时关闭菜单
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
    
    // 滚动到指定区域时高亮导航项
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-list li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('href') === '#' + current) {
                navItem.classList.add('active');
            }
        });
    });
    
    // 联系表单验证
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = contactForm.querySelector('input[name="name"]');
            const phoneInput = contactForm.querySelector('input[name="phone"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');
            
            // 简单验证逻辑
            if (!nameInput.value.trim()) {
                markInvalid(nameInput, '请输入您的姓名');
                isValid = false;
            } else {
                markValid(nameInput);
            }
            
            if (!phoneInput.value.trim()) {
                markInvalid(phoneInput, '请输入您的电话');
                isValid = false;
            } else if (!isValidPhone(phoneInput.value.trim())) {
                markInvalid(phoneInput, '请输入有效的电话号码');
                isValid = false;
            } else {
                markValid(phoneInput);
            }
            
            if (!messageInput.value.trim()) {
                markInvalid(messageInput, '请输入您的留言');
                isValid = false;
            } else {
                markValid(messageInput);
            }
            
            if (isValid) {
                // 模拟表单提交成功
                contactForm.innerHTML = '<div class="success-message">感谢您的留言！我们会尽快联系您。</div>';
            }
        });
    }
    
    // 标记无效输入
    function markInvalid(element, message) {
        const formGroup = element.closest('.form-group');
        formGroup.classList.add('error');
        
        // 检查是否已有错误信息
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    // 标记有效输入
    function markValid(element) {
        const formGroup = element.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // 验证电话号码
    function isValidPhone(phone) {
        // 简单的中国大陆手机号验证
        return /^1[3-9]\d{9}$/.test(phone);
    }

    // 注入反调试代码
    function antiDebug() {
        // 检测开发者工具
        let devtoolsOpen = false;

        // 方法1：检测窗口大小变化
        const checkWindowSize = () => {
            if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    alert('检测到开发者工具打开！再看源码你电脑就要爆炸了！');
                }
            } else {
                devtoolsOpen = false;
            }
        };

        // 方法2：使用调试器检测
        const debuggerCheck = () => {
            const start = new Date().getTime();
            debugger;
            const end = new Date().getTime();
            
            if (end - start > 100) {
                alert('你是不是在用调试器？小心被黑客入侵！');
            }
        };

        // 方法3：监听控制台
        const consoleCheck = () => {
            const originalConsole = {
                log: console.log,
                info: console.info,
                warn: console.warn,
                error: console.error
            };

            for (const method in originalConsole) {
                console[method] = function() {
                    alert(`检测到使用控制台！IP已被记录：127.0.0.1`);
                    originalConsole[method].apply(console, arguments);
                };
            }
        };

        // 随机执行反调试措施
        window.setInterval(checkWindowSize, 1000);
        window.setInterval(debuggerCheck, 3000);
        consoleCheck();
    }

    // 在生产环境启用反调试
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        antiDebug();
    }
});

// 页面加载后的动画效果
window.addEventListener('load', function() {
    // 添加入场动画类
    document.body.classList.add('loaded');
    
    // 滚动动画
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}); 