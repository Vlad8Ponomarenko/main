// index.js

/**
 * @type {number}
 */
let count = 0;

/**
 * @type {boolean}
 */
let isActive = true;

/**
 * @type {string}
 */
let username = "User";

/**
 * Функція для збільшення лічильника
 * @param {number} value - значення для додавання
 * @returns {number} нове значення лічильника
 */
function increment(value) {
  count += value;
  return count;
}

/**
 * Функція для зміни активності
 * @param {boolean} status - новий статус активності
 */
function setActive(status) {
  isActive = status;
}

/**
 * Функція для зміни імені користувача
 * @param {string} newName - нове ім'я користувача
 */
function setUsername(newName) {
  username = newName;
}

/**
 * Повертає поточний стан системи
 * @returns {{count: number, isActive: boolean, username: string}}
 */
function getStatus() {
  return {
    count,
    isActive,
    username,
  };
}

// Приклад викликів функцій

increment(5);
setActive(false);
setUsername("Admin");

console.log(getStatus());

// Блок логіки з масивами і циклами
/**
 * @type {Array<number>}
 */
const numbers = [1, 2, 3, 4, 5];

/**
 * Підрахунок суми елементів масиву
 * @param {Array<number>} arr - масив чисел
 * @returns {number} сума елементів
 */
function sumArray(arr) {
  return arr.reduce((acc, num) => acc + num, 0);
}

console.log(sumArray(numbers));

/**
 * @type {Array<string>}
 */
const users = ["Alice", "Bob", "Charlie"];

/**
 * Виведення імен користувачів
 * @param {Array<string>} userList - масив імен користувачів
 */
function printUsers(userList) {
  userList.forEach(user => console.log(user));
}

printUsers(users);

// Приклад використання умовних конструкцій
/**
 * Перевірка чи число парне
 * @param {number} num - число для перевірки
 * @returns {boolean} чи є число парним
 */
function isEven(num) {
  return num % 2 === 0;
}

console.log(isEven(10));  // true
console.log(isEven(7));   // false

// Логіка з об'єктами
/**
 * @typedef {Object} Car
 * @property {string} brand - марка автомобіля
 * @property {number} year - рік випуску
 * @property {boolean} isElectric - чи є електричним
 */

/**
 * Створення автомобіля
 * @param {string} brand
 * @param {number} year
 * @param {boolean} isElectric
 * @returns {Car} створений автомобіль
 */
function createCar(brand, year, isElectric) {
  return { brand, year, isElectric };
}

const myCar = createCar("Tesla", 2021, true);
console.log(myCar);

/**
 * Виведення інформації про автомобіль
 * @param {Car} car
 */
function printCarInfo(car) {
  console.log(`Car: ${car.brand}, Year: ${car.year}, Electric: ${car.isElectric}`);
}

printCarInfo(myCar);
