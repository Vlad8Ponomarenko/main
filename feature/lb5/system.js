"use strict";
const articles = [];
// Генерує унікальний ID
const generateId = () => Math.random().toString(36).substring(2, 9);
// Оновлює список статей в HTML
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
        <small><strong>Author:</strong> ${article.author}</small>
        <small><strong>Status:</strong> ${article.status}</small>
      </div>
    `)
        .join('');
};
// Обробляє створення нової статті
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
    // Очищаємо форму
    titleInput.value = '';
    contentInput.value = '';
    authorInput.value = '';
    updateArticlesList();
};
// Додаємо слухач подій на форму
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('articleForm');
    if (form) {
        form.addEventListener('submit', handleNewArticle);
    }
    updateArticlesList();
});
