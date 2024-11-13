type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

type Electronics = BaseProduct & {
  category: 'electronics';
  brand: string;
};

type Clothing = BaseProduct & {
  category: 'clothing';
  size: string;
  material: string;
};

type Book = BaseProduct & {
  category: 'book';
  author: string;
  genre: string;
};

const electronics: Electronics[] = [
  { id: 1, name: 'Телефон', price: 10000, category: 'electronics', brand: 'Samsung' },
  { id: 2, name: 'Ноутбук', price: 20000, category: 'electronics', brand: 'Apple' }
];

const clothing: Clothing[] = [
  { id: 3, name: 'Куртка', price: 1500, category: 'clothing', size: 'M', material: 'Поліестер' },
  { id: 4, name: 'Джинси', price: 1200, category: 'clothing', size: 'L', material: 'Бавовна' }
];

const books: Book[] = [
  { id: 5, name: 'Книга "JavaScript для початківців"', price: 500, category: 'book', author: 'John Doe', genre: 'Programming' },
  { id: 6, name: 'Книга "CSS для початківців"', price: 450, category: 'book', author: 'Jane Smith', genre: 'Web Design' }
];

const products = [...electronics, ...clothing, ...books];

const displayProducts = (products: BaseProduct[]): void => {
  const productListContainer = document.getElementById('product-list')!;
  productListContainer.innerHTML = ''; 
  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
      <h2>${product.name}</h2>
      <p>Ціна: ${product.price} грн</p>
      ${product.description ? `<p>${product.description}</p>` : ''}
      <button onclick="addToCart(${product.id})">Додати в кошик</button>
    `;

    productListContainer.appendChild(productCard);
  });
};

const filterProducts = (category: string): void => {
  let filteredProducts: BaseProduct[] = [];
  
  if (category === 'electronics') {
    filteredProducts = electronics;
  } else if (category === 'clothing') {
    filteredProducts = clothing;
  } else if (category === 'book') {
    filteredProducts = books;
  } else {
    filteredProducts = products; 
  }

  displayProducts(filteredProducts);
};

const addToCart = (productId: number): void => {
  const product = products.find(p => p.id === productId);
  if (product) {
    console.log(`Додано товар: ${product.name}`);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  filterProducts('all'); 
});
