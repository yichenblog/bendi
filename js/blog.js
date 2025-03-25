// 修正 Markdown 文件的加载路径
document.addEventListener('DOMContentLoaded', function() {
  const blogContent = document.querySelector('.blog-content');
  const articlePath = new URLSearchParams(window.location.search).get('article');
  
  if (articlePath) {
    // 修改这里 - 使用正确的文件路径
    fetch(`/blog/public/md/${articlePath}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error('无法加载文章');
        }
        return response.text();
      })
      .then(markdown => {
        // 使用 markdown 解析器转换内容
        const html = convertMarkdownToHtml(markdown);
        blogContent.innerHTML = html;
        
        // 提取文章标题和描述
        const title = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] || '文章';
        const description = html.replace(/<[^>]*>/g, '').slice(0, 150);
        
        updateMetaTags(title, description);
      })
      .catch(error => {
        console.error('加载文章失败:', error);
        blogContent.innerHTML = `
          <div class="error-message">
            <h2>加载失败</h2>
            <p>无法加载Markdown文件，路径：/blog/public/md/${articlePath}.md</p>
            <p>请检查文件路径是否正确。</p>
            <a href="javascript:history.back()" class="btn btn-primary">返回列表</a>
          </div>
        `;
      });
  } else {
    blogContent.innerHTML = '<p>请选择一篇文章</p>';
  }
  
  function convertMarkdownToHtml(markdown) {
    // 确保已正确引入 marked.js 或其他 Markdown 解析库
    if (typeof marked !== 'undefined') {
      return marked(markdown);
    } else {
      console.error('未找到 Markdown 解析器');
      return '<p>无法解析 Markdown，请确保已引入解析库</p>' + 
             '<pre>' + markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
    }
  }

  function updateMetaTags(articleTitle, articleDescription) {
    document.title = `${articleTitle} - 流量卡资讯 | 3.rl1.cc`;
    
    // 更新 meta 描述
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', articleDescription);
  }
}); 