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
document.addEventListener('DOMContentLoaded', function () {
    var electronics = [
        { id: 1, name: 'Телефон', price: 10000, description: 'Новий смартфон', category: 'electronics' },
        { id: 2, name: 'Ноутбук', price: 20000, description: 'Сучасний ноутбук', category: 'electronics' }
    ];
    var clothing = [
        { id: 3, name: 'Куртка', price: 1500, description: 'Тепла зимова куртка', category: 'clothing' },
        { id: 4, name: 'Джинси', price: 1200, description: 'Стильні джинси', category: 'clothing' }
    ];
    var books = [
        { id: 5, name: 'Книга JavaScript', price: 500, description: 'Покроковий посібник з JS', category: 'book' },
        { id: 6, name: 'Книга CSS', price: 450, description: 'Дизайн та стиль для веб', category: 'book' }
    ];
    var products = __spreadArray(__spreadArray(__spreadArray([], electronics, true), clothing, true), books, true);
    var cart = [];
    var displayProducts = function (products) {
        var productListContainer = document.getElementById('product-list');
        productListContainer.innerHTML = '';
        products.forEach(function (product) {
            var productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = "\n        <h2>".concat(product.name, "</h2>\n        <p>\u0426\u0456\u043D\u0430: ").concat(product.price, " \u0433\u0440\u043D</p>\n        ").concat(product.description ? "<p>".concat(product.description, "</p>") : '', "\n        <button id=\"add-to-cart-").concat(product.id, "\">\u0414\u043E\u0434\u0430\u0442\u0438 \u0432 \u043A\u043E\u0448\u0438\u043A</button>\n      ");
            productListContainer.appendChild(productCard);
            document.getElementById("add-to-cart-".concat(product.id)).addEventListener('click', function () { return addToCart(product.id); });
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
            cartContainer.innerHTML = "\n        <span>\u041A\u043E\u0448\u0438\u043A (".concat(cart.length, " \u0442\u043E\u0432\u0430\u0440\u0456\u0432) - ").concat(totalPrice, " \u0433\u0440\u043D</span>\n      ");
        }
    };
    var calculateTotal = function (cart) {
        return cart.reduce(function (total, item) { return total + item.product.price * item.quantity; }, 0);
    };
    var filterProducts = function (category) {
        var filteredProducts = products;
        if (category !== 'all') {
            filteredProducts = products.filter(function (product) { return product.category === category; });
        }
        displayProducts(filteredProducts);
    };
    displayProducts(products);
    updateCartDisplay();
    var filterButtons = document.querySelectorAll('.nav button');
    filterButtons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            var _a;
            var category = ((_a = e.target.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'all';
            filterProducts(category);
        });
    });
});
