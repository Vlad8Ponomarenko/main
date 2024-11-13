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
let cart: CartItem<BaseProduct>[] = [];

type CartItem<T> = {
  product: T;
  quantity: number;
};

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

const addToCart = (productId: number): void => {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }
    updateCartDisplay(); 
  }
};

const updateCartDisplay = (): void => {
  const cartContainer = document.getElementById('cart')!;
  const cartSummary = document.createElement('div');
  cartSummary.classList.add('cart-summary');

  if (cart.length === 0) {
    cartContainer.innerHTML = '<span>Кошик порожній</span>';
  } else {
    cartSummary.innerHTML = ''; 
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <p>${item.product.name} - Кількість: ${item.quantity}</p>
        <p>Ціна: ${item.product.price * item.quantity} грн</p>
      `;
      cartSummary.appendChild(cartItem);
    });

    const total = calculateTotal(cart);
    const totalPrice = document.createElement('div');
    totalPrice.classList.add('cart-total');
    totalPrice.innerHTML = `<h3>Загальна сума: ${total} грн</h3>`;
    cartSummary.appendChild(totalPrice);

    cartContainer.innerHTML = ''; 
    cartContainer.appendChild(cartSummary); 
  }
};

const calculateTotal = (cart: CartItem<BaseProduct>[]): number => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

document.addEventListener('DOMContentLoaded', () => {
  displayProducts(products); 
  updateCartDisplay(); 
});
