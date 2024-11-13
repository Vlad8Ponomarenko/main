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

const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
  return products.find((product: T) => product.id === id);
};

const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
  return products.filter((product: T) => product.price <= maxPrice);
};

type CartItem<T> = {
  product: T;
  quantity: number;
};

const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T,
  quantity: number
): CartItem<T>[] => {
  const existingItem = cart.find((item: CartItem<T>) => item.product.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  return cart;
};

const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

// Масиви товарів
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

const phone = findProduct(electronics, 1);
console.log(phone); 

const affordableProducts = filterByPrice(electronics, 15000);
console.log(affordableProducts); 

const cart: CartItem<BaseProduct>[] = [];
addToCart(cart, phone!, 2);  
const cartTotal = calculateTotal(cart);  
console.log(cartTotal); 
