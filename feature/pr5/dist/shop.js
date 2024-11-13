"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
var products = __spreadArray(__spreadArray(__spreadArray([], electronics, true), clothing, true), books, true);
var cart = [];
var displayProducts = function (products) {
    var productListContainer = document.getElementById('product-list');
    productListContainer.innerHTML = '';
    products.forEach(function (product) {
        var productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = "\n      <h2>".concat(product.name, "</h2>\n      <p>\u0426\u0456\u043D\u0430: ").concat(product.price, " \u0433\u0440\u043D</p>\n      ").concat(product.description ? "<p>".concat(product.description, "</p>") : '', "\n      <button onclick=\"addToCart(").concat(product.id, ")\">\u0414\u043E\u0434\u0430\u0442\u0438 \u0432 \u043A\u043E\u0448\u0438\u043A</button>\n    ");
        productListContainer.appendChild(productCard);
    });
};
var addToCart = function (productId) {
    var product = products.find(function (p) { return p.id === productId; });
    if (product) {
        var existingItem = cart.find(function (item) { return item.product.id === product.id; });
        if (existingItem) {
            existingItem.quantity += 1;
        }
        else {
            cart.push({ product: product, quantity: 1 });
        }
        updateCartDisplay();
    }
};
var updateCartDisplay = function () {
    var cartContainer = document.getElementById('cart');
    if (cart.length === 0) {
        cartContainer.innerHTML = '<span>Кошик порожній</span>';
    }
    else {
        var totalPrice = calculateTotal(cart);
        cartContainer.innerHTML = "\n      <span>\u041A\u043E\u0448\u0438\u043A (".concat(cart.length, " \u0442\u043E\u0432\u0430\u0440\u0456\u0432) - ").concat(totalPrice, " \u0433\u0440\u043D</span>\n    ");
    }
};
var calculateTotal = function (cart) {
    return cart.reduce(function (total, item) { return total + item.product.price * item.quantity; }, 0);
};
document.addEventListener('DOMContentLoaded', function () {
    displayProducts(products);
    updateCartDisplay();
});
