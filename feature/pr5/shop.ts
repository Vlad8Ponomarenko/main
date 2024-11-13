document.addEventListener('DOMContentLoaded', () => {
  type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description?: string;
    category: string;
  };

  type CartItem<T> = {
    product: T;
    quantity: number;
  };

  const electronics: BaseProduct[] = [
    { id: 1, name: 'Телефон', price: 10000, description: 'Новий смартфон', category: 'electronics' },
    { id: 2, name: 'Ноутбук', price: 20000, description: 'Сучасний ноутбук', category: 'electronics' }
  ];

  const clothing: BaseProduct[] = [
    { id: 3, name: 'Куртка', price: 1500, description: 'Тепла зимова куртка', category: 'clothing' },
    { id: 4, name: 'Джинси', price: 1200, description: 'Стильні джинси', category: 'clothing' }
  ];

  const books: BaseProduct[] = [
    { id: 5, name: 'Книга JavaScript', price: 500, description: 'Покроковий посібник з JS', category: 'book' },
    { id: 6, name: 'Книга CSS', price: 450, description: 'Дизайн та стиль для веб', category: 'book' }
  ];

  const products = [...electronics, ...clothing, ...books];
  let cart: CartItem<BaseProduct>[] = [];

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
        <button id="add-to-cart-${product.id}">Додати в кошик</button>
      `;

      productListContainer.appendChild(productCard);

      document.getElementById(`add-to-cart-${product.id}`)!.addEventListener('click', () => addToCart(product.id));
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
    if (cart.length === 0) {
      cartContainer.innerHTML = '<span>Кошик порожній</span>';
    } else {
      const totalPrice = calculateTotal(cart);
      cartContainer.innerHTML = `
        <span>Кошик (${cart.length} товарів) - ${totalPrice} грн</span>
      `;
    }
  };

  const calculateTotal = (cart: CartItem<BaseProduct>[]): number => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const filterProducts = (category: string): void => {
    let filteredProducts = products;
    if (category !== 'all') {
      filteredProducts = products.filter(product => product.category === category);
    }
    displayProducts(filteredProducts);
  };

  displayProducts(products);
  updateCartDisplay();

  const filterButtons = document.querySelectorAll('.nav button');
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const category = (e.target as HTMLButtonElement).textContent?.toLowerCase() || 'all';
      filterProducts(category);
    });
  });
});
