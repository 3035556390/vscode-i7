// 监听表单提交事件
document.querySelector('form').addEventListener('submit', async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault();

    // 获取用户名和密码
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username, password);

    try {
        const response = await fetch('http://zzy13.top/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('登录成功！');
            // 可以在这里添加页面跳转逻辑
            // window.location.href = 'dashboard.html';
        } else {
            alert('登录失败：' + data.message);
        }
    } catch (error) {
        console.error('请求出错：', error);
        alert('网络错误，请稍后重试');
    }
});