"use strict";
const generateId = () => Math.random().toString(36).substring(2, 9);
// Завантаження статей з localStorage
const loadArticles = () => {
    const data = localStorage.getItem('articles');
    if (data) {
        return JSON.parse(data).map((article) => (Object.assign(Object.assign({}, article), { createdAt: new Date(article.createdAt), updatedAt: new Date(article.updatedAt) })));
    }
    return [];
};
// Збереження статей до localStorage
const saveArticles = (articles) => {
    localStorage.setItem('articles', JSON.stringify(articles));
};
const articles = loadArticles();
// Оновлення розділу Articles
const updateArticlesList = () => {
    const articlesDiv = document.getElementById('articles');
    if (!articlesDiv)
        return;
    if (articles.length === 0) {
        articlesDiv.innerHTML = `<p>No articles available. Add one using the form below.</p>`;
        return;
    }
    articlesDiv.innerHTML = articles
        .map((article) => `
      <div class="article">
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        <small><strong>Author:</strong> ${article.author}</small><br>
        <small><strong>Status:</strong> ${article.status}</small><br>
        <small><strong>Created At:</strong> ${article.createdAt.toLocaleString()}</small><br>
        <small><strong>Updated At:</strong> ${article.updatedAt.toLocaleString()}</small>
      </div>
    `)
        .join('');
};
// Додавання нової статті
const handleNewArticle = (event) => {
    event.preventDefault();
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const authorInput = document.getElementById('author');
    if (!titleInput || !contentInput || !authorInput)
        return;
    const newArticle = {
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        title: titleInput.value,
        content: contentInput.value,
        author: authorInput.value,
    };
    articles.push(newArticle);
    saveArticles(articles);
    // Очищаємо форму
    titleInput.value = '';
    contentInput.value = '';
    authorInput.value = '';
    updateArticlesList();
};
// Підключення обробників подій
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('articleForm');
    if (form) {
        form.addEventListener('submit', handleNewArticle);
    }
    updateArticlesList();
});
