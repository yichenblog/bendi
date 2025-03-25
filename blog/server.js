const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown',
    '.xml': 'application/xml',
    '.txt': 'text/plain'
};

// 站点基础URL
const BASE_URL = 'https://3.rl1.cc/blog';

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // 处理API请求
    if (req.url === '/api/md-files') {
        handleApiRequest(req, res);
        return;
    }
    
    // 处理站点地图请求
    if (req.url === '/sitemap.xml') {
        generateSitemap(req, res);
        return;
    }
    
    // 处理robots.txt请求
    if (req.url === '/robots.txt') {
        generateRobotsTxt(req, res);
        return;
    }

    // 解析URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // 获取文件扩展名
    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 页面未找到
                fs.readFile('./404.html', (err, content) => {
                    if (err) {
                        // 如果404.html也不存在
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 Not Found</h1><p>页面未找到</p>', 'utf-8');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end(`服务器错误: ${err.code}`);
            }
        } else {
            // 成功响应
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 处理API请求，获取MD文件列表
function handleApiRequest(req, res) {
    const mdDir = path.join(__dirname, 'public', 'md');
    
    fs.readdir(mdDir, (err, files) => {
        if (err) {
            console.error('读取MD目录失败:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '无法读取Markdown文件目录' }));
            return;
        }

        // 只返回.md结尾的文件
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // 允许跨域访问
        });
        res.end(JSON.stringify(mdFiles));
    });
}

// 生成站点地图
function generateSitemap(req, res) {
    const mdDir = path.join(__dirname, 'public', 'md');
    
    fs.readdir(mdDir, (err, files) => {
        if (err) {
            console.error('生成站点地图失败:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('无法生成站点地图');
            return;
        }

        // 只处理.md结尾的文件
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // 添加首页
        sitemap += '  <url>\n';
        sitemap += `    <loc>${BASE_URL}/</loc>\n`;
        sitemap += '    <changefreq>daily</changefreq>\n';
        sitemap += '    <priority>1.0</priority>\n';
        sitemap += '  </url>\n';
        
        // 为每个Markdown文件添加条目
        mdFiles.forEach(file => {
            const fileStats = fs.statSync(path.join(mdDir, file));
            const lastMod = new Date(fileStats.mtime).toISOString().split('T')[0];
            const fileName = file.replace('.md', '');
            
            sitemap += '  <url>\n';
            sitemap += `    <loc>${BASE_URL}/#article/${fileName}</loc>\n`;
            sitemap += `    <lastmod>${lastMod}</lastmod>\n`;
            sitemap += '    <changefreq>weekly</changefreq>\n';
            sitemap += '    <priority>0.8</priority>\n';
            sitemap += '  </url>\n';
        });
        
        sitemap += '</urlset>';
        
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.end(sitemap, 'utf-8');
    });
}

// 生成robots.txt
function generateRobotsTxt(req, res) {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(robotsTxt, 'utf-8');
}

server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`MD文件目录: ${path.join(__dirname, 'public', 'md')}`);
    console.log(`站点地图可访问: http://localhost:${PORT}/sitemap.xml`);
    console.log(`robots.txt可访问: http://localhost:${PORT}/robots.txt`);
    console.log('按 Ctrl+C 关闭服务器');
}); 