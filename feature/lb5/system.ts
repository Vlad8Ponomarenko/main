interface BaseContent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
}

interface Article extends BaseContent {
  title: string;
  content: string;
  author: string;
}

const articles: Article[] = [];

// Генерує унікальний ID
const generateId = (): string => Math.random().toString(36).substring(2, 9);

// Оновлює список статей в HTML
const updateArticlesList = () => {
  const articlesDiv = document.getElementById('articles');
  if (!articlesDiv) return;

  if (articles.length === 0) {
    articlesDiv.innerHTML = `<p>No articles available. Add one using the form below.</p>`;
    return;
  }

  articlesDiv.innerHTML = articles
    .map(
      (article) => `
      <div class="article">
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        <small><strong>Author:</strong> ${article.author}</small>
        <small><strong>Status:</strong> ${article.status}</small>
      </div>
    `
    )
    .join('');
};

// Обробляє створення нової статті
const handleNewArticle = (event: Event) => {
  event.preventDefault();

  const titleInput = document.getElementById('title') as HTMLInputElement;
  const contentInput = document.getElementById('content') as HTMLTextAreaElement;
  const authorInput = document.getElementById('author') as HTMLInputElement;

  if (!titleInput || !contentInput || !authorInput) return;

  const newArticle: Article = {
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
