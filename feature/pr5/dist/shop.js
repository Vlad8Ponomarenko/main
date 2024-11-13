"use strict";
var findProduct = function (products, id) {
    return products.find(function (product) { return product.id === id; });
};
var filterByPrice = function (products, maxPrice) {
    return products.filter(function (product) { return product.price <= maxPrice; });
};
var addToCart = function (cart, product, quantity) {
    var existingItem = cart.find(function (item) { return item.product.id === product.id; });
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        cart.push({ product: product, quantity: quantity });
    }
    return cart;
};
var calculateTotal = function (cart) {
    return cart.reduce(function (total, item) { return total + item.product.price * item.quantity; }, 0);
};
var electronics = [
    { id: 1, name: 'Телефон', price: 10000, category: 'electronics', brand: 'Samsung' },
    { id: 2, name: 'Ноутбук', price: 20000, category: 'electronics', brand: 'Apple' }
];
var clothing = [
    { id: 3, name: 'Куртка', price: 1500, category: 'clothing', size: 'M', material: 'Поліестер' },
    { id: 4, name: 'Джинси', price: 1200, category: 'clothing', size: 'L', material: 'Бавовна' }
];
var books = [
    { id: 5, name: 'Книга "JavaScript для початківців"', price: 500, category: 'book', author: 'John Doe', genre: 'Programming' },
    { id: 6, name: 'Книга "CSS для початківців"', price: 450, category: 'book', author: 'Jane Smith', genre: 'Web Design' }
];
var phone = findProduct(electronics, 1);
console.log(phone);
var affordableProducts = filterByPrice(electronics, 15000);
console.log(affordableProducts);
var cart = [];
addToCart(cart, phone, 2);
var cartTotal = calculateTotal(cart);
console.log(cartTotal);
