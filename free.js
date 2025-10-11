// 引入 Node.js 内置的 http 模块
const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
    // 设置响应头：状态码 200（成功），内容类型为 HTML
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    // 构建响应内容，包含请求信息
    const responseContent = `
    <h1>本地服务器已接收到请求</h1>
    <p>请求方法: ${req.method}</p>
    <p>请求路径: ${req.url}</p>
    <p>请求头: ${JSON.stringify(req.headers, null, 2)}</p>
    <p>服务器时间: ${new Date().toLocaleString()}</p>
  `;

    // 发送响应并结束
    res.end(responseContent);
});

// 配置服务器端口和主机
const PORT = 8081;
// 使用 0.0.0.0 可以让服务器监听所有网络接口，包括手机热点分配的 IP
const HOST = '0.0.0.0';

// 启动服务器
server.listen(PORT, HOST, () => {
    console.log(`服务器已启动，正在监听 ${HOST}:${PORT}`);
    console.log(`本地访问: http://127.0.0.1:${PORT}`);
    console.log(`局域网访问: http://你的热点内网IP:${PORT}`);
});

// 处理错误
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`端口 ${PORT} 已被占用，请关闭占用该端口的程序后重试`);
    } else {
        console.error('服务器错误:', err);
    }
});
