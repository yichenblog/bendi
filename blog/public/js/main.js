// 配置Marked库选项
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (e) {
                console.error(e);
                return hljs.highlightAuto(code).value;
            }
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true, // 启用段落内换行
    gfm: true,    // 启用GitHub风格的Markdown
});

// 兼容不同版本的marked库
const markdownToHtml = (markdown) => {
    try {
        // 处理marked可能是对象而非函数的情况
        if (typeof marked === 'function') {
            return marked(markdown);
        } else if (typeof marked.parse === 'function') {
            return marked.parse(markdown);
        } else if (typeof marked.marked === 'function') {
            return marked.marked(markdown);
        } else {
            console.error('marked库不可用，无法解析Markdown');
            return markdown; // 返回原始文本
        }
    } catch (e) {
        console.error('解析Markdown出错:', e);
        return `<p>Markdown解析错误: ${e.message}</p><pre>${markdown}</pre>`;
    }
};

// 存储所有加载的文章数据
let allArticles = [];

// 分页相关变量
let currentPage = 1;
const articlesPerPage = 6; // 每页显示6篇文章
let isLoading = false;

// DOM元素
const articlesList = document.getElementById('article-list');
const articlesSection = document.getElementById('articles');
const articleContentSection = document.getElementById('article-content');
const aboutSection = document.getElementById('about');
const articleBody = document.getElementById('article-body');
const articleMeta = document.getElementById('article-meta');
const backToListBtn = document.getElementById('back-to-list');
const searchInput = document.getElementById('search-input');
const articlesLink = document.getElementById('articles-link');
const homeLink = document.getElementById('home-link');
const aboutLink = document.getElementById('about-link');

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否加载了marked库
    if (typeof marked === 'undefined') {
        console.error('未能加载marked库，将使用纯文本显示');
        document.body.innerHTML = `<div style="padding: 20px; color: red; text-align: center;">
            <h1>加载失败</h1>
            <p>Markdown解析库未加载。请检查网络连接或刷新页面。</p>
        </div>`;
        return;
    }
    
    // 加载所有MD文件
    loadAllMarkdownFiles();
    
    // 事件监听器设置
    setupEventListeners();
});

// 文章排序功能
function addSortingControls() {
    // 创建排序控制区域
    const sortControls = document.createElement('div');
    sortControls.className = 'sort-controls';
    
    // 创建排序方式选择器
    const sortSelect = document.createElement('select');
    sortSelect.id = 'sort-select';
    sortSelect.innerHTML = `
        <option value="filename-desc">日期（新到旧）</option>
        <option value="filename-asc">日期（旧到新）</option>
        <option value="title-asc">标题（A-Z）</option>
        <option value="title-desc">标题（Z-A）</option>
    `;
    
    // 添加标签
    const sortLabel = document.createElement('label');
    sortLabel.htmlFor = 'sort-select';
    sortLabel.textContent = '排序方式: ';
    
    // 组合并添加到控制区域
    sortControls.appendChild(sortLabel);
    sortControls.appendChild(sortSelect);
    
    // 将控制区域添加到文章控制区
    const articleControls = document.querySelector('.article-controls');
    articleControls.appendChild(sortControls);
    
    // 添加事件监听
    sortSelect.addEventListener('change', function() {
        sortArticles(this.value);
    });
}

// 排序文章
function sortArticles(sortMethod) {
    // 根据不同的排序方法排序文章
    switch(sortMethod) {
        case 'date-desc': // 日期降序（最新优先）
            allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc': // 日期升序（最早优先）
            allArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'title-asc': // 标题升序（A-Z）
            allArticles.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
            break;
        case 'title-desc': // 标题降序（Z-A）
            allArticles.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'));
            break;
        case 'filename-asc': // 文件名数字升序（小到大）
            allArticles.sort((a, b) => {
                const numA = extractNumberFromFilename(a.url);
                const numB = extractNumberFromFilename(b.url);
                return numA - numB;
            });
            break;
        case 'filename-desc': // 文件名数字降序（大到小）
            allArticles.sort((a, b) => {
                const numA = extractNumberFromFilename(a.url);
                const numB = extractNumberFromFilename(b.url);
                return numB - numA;
            });
            break;
    }
    
    // 重新渲染排序后的文章列表
    renderArticleList(allArticles);
}

// 从文件名中提取数字
function extractNumberFromFilename(url) {
    // 从url中获取文件名
    const filename = url.replace('public/md/', '').replace('.md', '');
    // 从文件名中提取数字，如果没有数字，则返回0
    const match = filename.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

// 加载指定路径下所有Markdown文件
async function loadAllMarkdownFiles() {
    try {
        // 获取所有MD文件列表
        const response = await fetch('/api/md-files');
        if (!response.ok) {
            throw new Error('无法获取Markdown文件列表');
        }
        
        const files = await response.json();
        if (files.length === 0) {
            console.log('未找到Markdown文件，使用默认示例');
            loadDefaultArticles();
            return;
        }
        
        // 处理每个文件，转换为文章对象
        const articlePromises = files.map(async file => {
            try {
                // 获取MD文件内容
                const mdResponse = await fetch(`public/md/${file}`);
                if (!mdResponse.ok) {
                    throw new Error(`无法加载文件: ${file}`);
                }
                
                const mdContent = await mdResponse.text();
                // 提取标题、摘要等信息
                const article = extractArticleInfo(mdContent, file);
                return article;
            } catch (error) {
                console.error(`处理文件时出错: ${file}`, error);
                return null;
            }
        });
        
        // 等待所有文件处理完成
        const articles = await Promise.all(articlePromises);
        // 过滤掉加载失败的文章
        allArticles = articles.filter(article => article !== null);
        
        if (allArticles.length === 0) {
            loadDefaultArticles();
            return;
        }
        
        // 默认按文件名数字从大到小排序
        allArticles.sort((a, b) => {
            const numA = extractNumberFromFilename(a.url);
            const numB = extractNumberFromFilename(b.url);
            return numB - numA;
        });
        
        // 渲染文章列表
        renderArticleList(allArticles);
        
        // 添加排序控件
        addSortingControls();
        
        // 设置排序选择器的默认值为"filename-desc"
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'filename-desc';
        }
        
    } catch (error) {
        console.error('加载Markdown文件列表失败', error);
        loadDefaultArticles();
    }
}

// 从Markdown内容中提取文章信息
function extractArticleInfo(mdContent, filename) {
    // 默认值
    let article = {
        title: filename.replace('.md', ''),
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        author: '好卡好货流量卡',
        image: 'https://hk.rl1.cc/tp/hkhh.png',
        url: `public/md/${filename}`,
        content: mdContent
    };
    
    // 尝试提取标题 (第一个#开头的行)
    const titleMatch = mdContent.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
        article.title = titleMatch[1].trim();
    }
    
    // 尝试提取日期 (寻找类似日期格式的文本)
    const dateMatch = mdContent.match(/(\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2})/);
    if (dateMatch && dateMatch[1]) {
        article.date = dateMatch[1].replace(/[\/\.]/g, '-');
    }
    
    // 尝试提取作者 (寻找"作者:"或"author:"后面的文本)
    const authorMatch = mdContent.match(/(?:作者|author)[：:]\s*(.+?)(?:\n|$)/i);
    if (authorMatch && authorMatch[1]) {
        article.author = authorMatch[1].trim();
    }
    
    // 提取摘要 (除标题外的第一段)
    const paragraphs = mdContent.split('\n\n');
    for (const para of paragraphs) {
        const trimmed = para.trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('![')) {
            // 提取纯文本作为摘要
            article.excerpt = trimmed.replace(/[*_`#]/g, '').substring(0, 150);
            if (article.excerpt.length === 150) {
                article.excerpt += '...';
            }
            break;
        }
    }
    
    return article;
}

// 加载默认示例文章
function loadDefaultArticles() {
    const sampleArticles = [
        {
            title: "中国移动最新套餐详解",
            excerpt: "本文详细介绍中国移动2024年最新推出的5G套餐，包括资费、流量、通话时长等详细信息。",
            date: "2024-03-20",
            author: "号卡专家",
            image: "https://hk.rl1.cc/tp/hkhh.png",
            url: "public/md/mobile.md"
        },
        {
            title: "电信大王卡最新活动",
            excerpt: "中国电信推出全新大王卡活动，每月仅需19元即可享受20GB流量，本文深入分析其优缺点。",
            date: "2024-03-15",
            author: "资费分析师",
            image: "https://hk.rl1.cc/tp/hkhh.png",
            url: "public/md/telecom.md"
        },
        {
            title: "联通新用户特惠套餐",
            excerpt: "中国联通推出新用户专属特惠套餐，首月免费，还有丰富的会员权益，值得办理吗？",
            date: "2024-03-10",
            author: "号卡评测员",
            image: "https://hk.rl1.cc/tp/hkhh.png",
            url: "public/md/unicom.md"
        }
    ];
    
    allArticles = sampleArticles;
    renderArticleList(allArticles);
}

// 渲染文章列表
function renderArticleList(articles, isLoadMore = false) {
    if (!isLoadMore) {
        articlesList.innerHTML = '';
        currentPage = 1;
    }
    
    if (articles.length === 0) {
        articlesList.innerHTML = '<p class="no-articles">未找到文章</p>';
        return;
    }
    
    // 计算当前页应该显示的文章
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = articles.slice(startIndex, endIndex);
    
    // 创建文章卡片
    currentArticles.forEach(article => {
        const articleSlug = article.url.replace('public/md/', '').replace('.md', '');
        
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        articleCard.setAttribute('data-slug', articleSlug);
        articleCard.innerHTML = `
            <div class="article-card-image" style="background-image: url('${article.image}')"></div>
            <div class="article-card-content">
                <h3 class="article-card-title">${article.title}</h3>
                <p class="article-card-excerpt">${article.excerpt}</p>
                <div class="article-card-meta">
                    <span>${article.date}</span>
                    <span>${article.author}</span>
                </div>
            </div>
        `;
        
        // 点击文章卡片显示文章内容并更新URL
        articleCard.addEventListener('click', () => {
            if (article.content) {
                displayArticleContent(article);
                window.history.pushState({ article: articleSlug }, article.title, `#article/${articleSlug}`);
                document.title = `${article.title} - 好卡好货流量卡`;
            } else {
                loadArticle(article.url, article, articleSlug);
            }
        });
        
        articlesList.appendChild(articleCard);
    });
    
    // 移除旧的加载更多按钮（如果存在）
    const oldLoadMoreBtn = document.querySelector('.load-more-btn');
    if (oldLoadMoreBtn) {
        oldLoadMoreBtn.remove();
    }
    
    // 如果还有更多文章，添加"继续加载"按钮
    if (endIndex < articles.length) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = '继续加载';
        loadMoreBtn.onclick = () => {
            if (!isLoading) {
                isLoading = true;
                loadMoreBtn.textContent = '加载中...';
                currentPage++;
                setTimeout(() => {
                    renderArticleList(articles, true);
                    isLoading = false;
                }, 500); // 添加小延迟以展示加载效果
            }
        };
        articlesList.insertAdjacentElement('afterend', loadMoreBtn);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 返回文章列表按钮
    backToListBtn.addEventListener('click', showArticlesList);
    
    // 搜索输入
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredArticles = allArticles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) || 
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.author.toLowerCase().includes(searchTerm)
        );
        renderArticleList(filteredArticles);
    });
    
    // 导航项点击事件
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            // 获取当前点击的链接的href属性
            const targetHref = link.getAttribute('href');
            
            // 移除所有链接的active类
            document.querySelectorAll('.nav a').forEach(item => item.classList.remove('active'));
            // 给当前点击的链接添加active类
            link.classList.add('active');
            
            // 根据href属性处理不同的导航目标
            if (targetHref === '#home') {
                showArticlesList();
            } else if (targetHref === '#articles') {
                showArticlesList();
            } else if (targetHref === '#about') {
                showAboutPage();
            }
        });
    });
}

// 加载并显示文章
function loadArticle(url, articleInfo, slug) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载Markdown文件');
            }
            return response.text();
        })
        .then(markdown => {
            // 保存文章内容到文章对象中
            articleInfo.content = markdown;
            
            // 显示文章
            displayArticleContent(articleInfo);
            
            // 更新URL
            if (slug) {
                window.history.pushState({ article: slug }, articleInfo.title, `#article/${slug}`);
                // 更新文档标题
                document.title = `${articleInfo.title} - 好卡好货流量卡`;
            }
        })
        .catch(error => {
            console.error('加载文章失败', error);
            articleBody.innerHTML = `
                <div class="error-message">
                    <h2>加载失败</h2>
                    <p>${error.message}</p>
                    <p>请检查文件路径是否正确，或尝试刷新页面。</p>
                </div>
            `;
            showArticleContent();
        });
}

// 显示文章内容
function displayArticleContent(articleInfo) {
    try {
        // 使用兼容函数将Markdown转换为HTML
        const htmlContent = markdownToHtml(articleInfo.content);
        
        // 设置文章内容（不包含广告）
        articleBody.innerHTML = htmlContent;
        
        // 更新文章元数据
        articleMeta.innerHTML = `
            <span>发布日期: ${articleInfo.date}</span> | 
            <span>作者: ${articleInfo.author}</span>
        `;
        
        // 添加结构化数据，帮助搜索引擎更好地理解内容
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": articleInfo.title,
            "datePublished": articleInfo.date,
            "dateModified": articleInfo.date,
            "author": {
                "@type": "Person",
                "name": articleInfo.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "好卡好货流量卡",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://hk.rl1.cc/tp/hkhh.png"
                }
            },
            "description": articleInfo.excerpt,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://3.rl1.cc/blog/#" + articleInfo.url.replace("public/md/", "").replace(".md", "")
            }
        };

        // 插入结构化数据
        const scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.text = JSON.stringify(structuredData);
        document.head.appendChild(scriptTag);
        
        // 显示文章内容区
        showArticleContent();
        
        // 激活代码高亮
        document.querySelectorAll('pre code').forEach(block => {
            try {
                hljs.highlightElement(block);
            } catch (e) {
                console.error('代码高亮失败:', e);
            }
        });
    } catch (error) {
        console.error('显示文章内容失败:', error);
        articleBody.innerHTML = `
            <div class="error-message">
                <h2>内容显示失败</h2>
                <p>${error.message}</p>
                <p>请刷新页面重试。</p>
                <pre>${articleInfo.content.substring(0, 300)}...</pre>
            </div>
        `;
        showArticleContent();
    }
}

// 显示文章列表
function showArticlesList() {
    articlesSection.style.display = 'block';
    articleContentSection.style.display = 'none';
    aboutSection.style.display = 'none';
    backToListBtn.style.display = 'none';
    
    // 更新导航栏状态
    document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
    homeLink.classList.add('active');
    
    // 更新URL和标题
    window.history.pushState({}, '好卡好货流量卡 - 首页', '#home');
    document.title = '好卡好货流量卡 - 通信号卡资讯分享平台';
}

// 显示文章内容
function showArticleContent() {
    articlesSection.style.display = 'none';
    articleContentSection.style.display = 'block';
    aboutSection.style.display = 'none';
    backToListBtn.style.display = 'block';
    
    // 更新导航栏状态
    document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
    articlesLink.classList.add('active');
}

// 显示关于页面
function showAboutPage() {
    articlesSection.style.display = 'none';
    articleContentSection.style.display = 'none';
    aboutSection.style.display = 'block';
    backToListBtn.style.display = 'block';
    
    // 更新导航栏状态
    document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
    aboutLink.classList.add('active');
}

// 设置地址栏URL变化监听
window.addEventListener('popstate', function(event) {
    const hash = window.location.hash;
    
    if (hash.startsWith('#article/')) {
        // 提取文章标识符
        const slug = hash.replace('#article/', '');
        
        // 查找对应的文章
        const article = allArticles.find(a => {
            const articleSlug = a.url.replace('public/md/', '').replace('.md', '');
            return articleSlug === slug;
        });
        
        if (article) {
            if (article.content) {
                displayArticleContent(article);
            } else {
                loadArticle(article.url, article);
            }
            return;
        }
    }
    
    if (hash === '#about') {
        showAboutPage();
    } else if (hash === '#articles') {
        showArticlesList();
    } else {
        // 默认显示首页
        showArticlesList();
    }
});

// 初始化时检查URL
document.addEventListener('DOMContentLoaded', function() {
    // 加载所有MD文件之后，再处理初始URL
    const checkUrlAfterLoad = setInterval(() => {
        if (allArticles.length > 0) {
            clearInterval(checkUrlAfterLoad);
            
            const hash = window.location.hash;
            if (hash.startsWith('#article/')) {
                const slug = hash.replace('#article/', '');
                const article = allArticles.find(a => {
                    const articleSlug = a.url.replace('public/md/', '').replace('.md', '');
                    return articleSlug === slug;
                });
                
                if (article) {
                    loadArticle(article.url, article, slug);
                } else {
                    showArticlesList();
                }
            } else if (hash === '#about') {
                showAboutPage();
            } else if (hash === '#articles') {
                showArticlesList();
            }
        }
    }, 100);
}); 