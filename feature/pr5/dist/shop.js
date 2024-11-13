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
// Популярні товари
var electronics = [
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
var clothing = [
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
var renderProducts = function (products) {
    var productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Очистити список
    products.forEach(function (product) {
        var productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = "\n      <h2>".concat(product.name, "</h2>\n      <p class=\"price\">").concat(product.price, " \u0433\u0440\u043D</p>\n      <p>").concat(product.description || "Опис відсутній", "</p>\n    ");
        productList.appendChild(productCard);
    });
};
// Фільтрація товарів
var filterProducts = function (category) {
    if (category === "all") {
        renderProducts(__spreadArray(__spreadArray([], electronics, true), clothing, true));
    }
    else if (category === "electronics") {
        renderProducts(electronics);
    }
    else if (category === "clothing") {
        renderProducts(clothing);
    }
};
// Відобразити всі товари за замовчуванням
renderProducts(__spreadArray(__spreadArray([], electronics, true), clothing, true));
