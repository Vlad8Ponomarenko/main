type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

type Electronics = BaseProduct & {
  category: "electronics";
  brand: string;
};

type Clothing = BaseProduct & {
  category: "clothing";
  size: string;
  material: string;
};

// Популярні товари
const electronics: Electronics[] = [
  {
    id: 1,
    name: "Смартфон Samsung Galaxy S21",
    price: 29999,
    category: "electronics",
    brand: "Samsung",
    description: "Флагманський смартфон з чудовою камерою та дизайном."
  },
  {
    id: 2,
    name: "Ноутбук Apple MacBook Air",
    price: 54999,
    category: "electronics",
    brand: "Apple",
    description: "Легкий та потужний ноутбук для роботи та навчання."
  }
];

const clothing: Clothing[] = [
  {
    id: 3,
    name: "Куртка зимова",
    price: 1999,
    category: "clothing",
    size: "M",
    material: "Поліестер",
    description: "Тепла куртка для зимового сезону."
  },
  {
    id: 4,
    name: "Джинси Levis",
    price: 1499,
    category: "clothing",
    size: "L",
    material: "Бавовна",
    description: "Класичні джинси з високоякісного деніму."
  }
];

// Рендеринг товарів
const renderProducts = (products: BaseProduct[]) => {
  const productList = document.getElementById("product-list")!;
  productList.innerHTML = ""; // Очистити список
  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <h2>${product.name}</h2>
      <p class="price">${product.price} грн</p>
      <p>${product.description || "Опис відсутній"}</p>
    `;
    productList.appendChild(productCard);
  });
};

// Фільтрація товарів
const filterProducts = (category: string) => {
  if (category === "all") {
    renderProducts([...electronics, ...clothing]);
  } else if (category === "electronics") {
    renderProducts(electronics);
  } else if (category === "clothing") {
    renderProducts(clothing);
  }
};

// Відобразити всі товари за замовчуванням
renderProducts([...electronics, ...clothing]);
