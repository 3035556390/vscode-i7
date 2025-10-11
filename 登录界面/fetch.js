const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
app.use(cors());

// 解析JSON格式的请求体（必须添加，否则无法获取前端发送的JSON数据）
app.use(express.json());

// 模拟数据库中的用户（实际项目中会连接真实数据库）
const mockUsers = [
    { id: 1, username: 'admin', password: '123456' }, // 实际项目中密码会加密存储
    { id: 2, username: 'user1', password: 'abc123' }
];

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '3035556390',
    database: 'myobject'
});

// 登录接口（POST请求）
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 参数验证
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: '请输入用户名和密码'
        });
    }

    // 查询数据库验证用户
    const query = 'SELECT id, username, password FROM login WHERE username = ? AND password = ?';
    db.execute(query, [username, password], (err, results) => {
        if (err) {
            console.error('数据库查询错误:', err);
            return res.status(500).json({
                success: false,
                message: '服务器内部错误'
            });
        }

        if (results.length > 0) {
            const user = results[0];
            // 生成 token（实际项目中应使用 jwt 等库）
            const token = 'fake-token-' + user.id;

            res.json({
                success: true,
                message: '登录成功',
                data: {
                    token: token,
                    userInfo: {
                        id: user.id,
                        username: user.username
                    }
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }
    });
});

// 启动服务器，监听3000端口
const port = 8081;
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
