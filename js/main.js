// 存储所有文章数据
let articlesData = [];

// 获取文章列表容器和分类按钮
const articleList = document.querySelector('.article-list');
const tabs = document.querySelectorAll('.tab-button');

// 从 JSON 文件加载数据
fetch('../articles.json')  // 注意路径：因为 main.js 在 js 文件夹里，所以用 .. 回到根目录
    .then(response => response.json())
    .then(data => {
        articlesData = data;
        renderArticles('all'); // 初始显示全部
    })
    .catch(error => console.error('加载文章失败：', error));

// 渲染指定分类的文章
function renderArticles(category) {
    // 过滤文章
    const filtered = category === 'all'
        ? articlesData
        : articlesData.filter(article => article.category === category);

    // 生成 HTML
    const html = filtered.map(article => `
        <li data-category="${article.category}">
            <a href="article.html?id=${article.id}">${article.title}</a>
        </li>
    `).join('');

    // 更新列表
    articleList.innerHTML = html;
}

// 为每个按钮添加点击事件
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 更新按钮激活状态
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 获取分类并重新渲染
        const category = tab.getAttribute('data-category');
        renderArticles(category);
    });
});