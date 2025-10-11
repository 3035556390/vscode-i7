const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// 定义静态文件目录
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME类型映射表
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

// 获取文件的MIME类型
const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
};

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
    // 设置CORS头部，允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 处理GET请求
    if (req.method === 'GET') {
        try {
            // 确定请求的文件路径，默认为index.html
            let filePath;
            if (req.url === '/') {
                filePath = path.join(PUBLIC_DIR, 'my.html');
            } else {
                // 2. 提取请求路径的扩展名（判断是否有后缀）
                const urlExt = path.extname(req.url);
                // 3. 无后缀时，拼接 .html 后缀；有后缀时，直接使用原路径
                const targetPath = urlExt ? req.url : `${req.url}.html`;
                // 4. 拼接最终的文件路径（指向 public 目录）
                filePath = path.join(PUBLIC_DIR, targetPath);
            }
            // 检查文件是否存在
            await fs.access(filePath);

            // 读取文件内容
            const fileContent = await fs.readFile(filePath);

            // 设置响应头
            res.writeHead(200, { 'Content-Type': getMimeType(filePath) });

            // 返回文件内容
            res.end(fileContent);
            console.log(`已返回文件: ${req.url}，类型: ${getMimeType(filePath)}`);
        } catch (err) {
            // 处理文件读取错误
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`未找到文件: ${req.url}`);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`服务器错误: ${err.message}`);
            }
            console.error('文件处理错误:', err);
        }
    } else {
        // 处理不支持的请求方法
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('不支持的请求方法，仅支持GET');
    }
});

// 启动服务器
const PORT = 8081;
const HOST = '0.0.0.0'; // 允许所有网络接口访问

// 确保public目录存在
fs.mkdir(PUBLIC_DIR, { recursive: true })
    .then(() => {
        server.listen(PORT, HOST, () => {
            console.log(`服务器已启动，监听 ${HOST}:${PORT}`);
            console.log(`本地访问: http://127.0.0.1:${PORT}`);
            console.log(`请将HTML、CSS、JS文件放在 ${PUBLIC_DIR} 目录下`);
        });
    })
    .catch(err => {
        console.error('创建public目录失败:', err);
    });

// 处理服务器错误
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`端口 ${PORT} 已被占用，请关闭占用程序后重试`);
    } else {
        console.error('服务器错误:', err);
    }
});
