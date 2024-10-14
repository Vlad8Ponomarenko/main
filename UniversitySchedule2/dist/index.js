"use strict";
// ===============================================
// Розробка системи управління розкладом в університеті
// ===============================================
// ===============================================
// 3. Робота з масивами даних
// ===============================================
// a) Створення масивів даних
let professors = [];
let classrooms = [];
let courses = [];
let schedule = [];
// b) Функція для додавання нового професора
function addProfessor(professor) {
    // Перевірка на унікальність id
    if (professors.some(p => p.id === professor.id)) {
        throw new Error(`Професор з ID ${professor.id} вже існує.`);
    }
    professors.push(professor);
}
// c) Функція для додавання аудиторії
function addClassroom(classroom) {
    // Перевірка на унікальність номера аудиторії
    if (classrooms.some(c => c.number === classroom.number)) {
        throw new Error(`Аудиторія з номером ${classroom.number} вже існує.`);
    }
    classrooms.push(classroom);
}
// d) Функція для додавання курсу
function addCourse(course) {
    // Перевірка на унікальність id курсу
    if (courses.some(c => c.id === course.id)) {
        throw new Error(`Курс з ID ${course.id} вже існує.`);
    }
    courses.push(course);
}
// e) Функція для додавання заняття до розкладу, якщо немає конфліктів
function addLesson(lesson) {
    // Перевірка на конфлікти
    const conflict = validateLesson(lesson);
    if (conflict) {
        throw new Error(`Неможливо додати заняття через конфлікт: ${conflict.type}`);
    }
    schedule.push(lesson);
    return true;
}
// ===============================================
// 4. Функції пошуку та фільтрації
// ===============================================
// a) Функція для знаходження вільних аудиторій у вказаний час
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    // Всі аудиторії
    const allClassrooms = classrooms.map(c => c.number);
    // Аудиторії, які вже зайняті у вказаний час
    const occupiedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    // Вільні аудиторії - це ті, які не в списку зайнятих
    const availableClassrooms = allClassrooms.filter(number => !occupiedClassrooms.includes(number));
    return availableClassrooms;
}
// b) Функція для отримання розкладу конкретного професора
function getProfessorSchedule(professorId) {
    return schedule.filter(lesson => lesson.professorId === professorId);
}
// b) Функція для валідації заняття на конфлікти
function validateLesson(lesson) {
    // Перевірка конфлікту для професора
    const professorConflict = schedule.find(existingLesson => existingLesson.professorId === lesson.professorId &&
        existingLesson.dayOfWeek === lesson.dayOfWeek &&
        existingLesson.timeSlot === lesson.timeSlot);
    if (professorConflict) {
        return {
            type: "ProfessorConflict",
            lessonDetails: professorConflict
        };
    }
    // Перевірка конфлікту для аудиторії
    const classroomConflict = schedule.find(existingLesson => existingLesson.classroomNumber === lesson.classroomNumber &&
        existingLesson.dayOfWeek === lesson.dayOfWeek &&
        existingLesson.timeSlot === lesson.timeSlot);
    if (classroomConflict) {
        return {
            type: "ClassroomConflict",
            lessonDetails: classroomConflict
        };
    }
    return null; // Конфліктів немає
}
// ===============================================
// 6. Аналіз та звіти
// ===============================================
// a) Функція для отримання відсотка використання аудиторії
function getClassroomUtilization(classroomNumber) {
    const totalSlots = 5 /* днів */ * 5 /* слотів на день */; // Припускаємо 5 днів та 5 слотів на день
    const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}
// b) Функція для визначення найпопулярнішого типу занять
function getMostPopularCourseType() {
    if (courses.length === 0)
        return null;
    // Підрахунок кількості кожного типу курсів
    const typeCount = {};
    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            typeCount[course.type] = (typeCount[course.type] || 0) + 1;
        }
    });
    // Визначення типу з найбільшою кількістю
    let mostPopular = null;
    let maxCount = 0;
    for (const type in typeCount) {
        if (typeCount[type] > maxCount) {
            maxCount = typeCount[type];
            mostPopular = type;
        }
    }
    return mostPopular;
}
// ===============================================
// 7. Модифікація даних
// ===============================================
// a) Функція для зміни аудиторії для заняття, якщо це можливо
function reassignClassroom(lessonId, newClassroomNumber) {
    const lessonIndex = schedule.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) {
        throw new Error(`Заняття з ID ${lessonId} не знайдено.`);
    }
    const lesson = schedule[lessonIndex];
    // Створюємо новий об'єкт заняття з новою аудиторією
    const updatedLesson = Object.assign(Object.assign({}, lesson), { classroomNumber: newClassroomNumber });
    // Перевірка на конфлікти
    const conflict = validateLesson(updatedLesson);
    if (conflict) {
        throw new Error(`Неможливо змінити аудиторію через конфлікт: ${conflict.type}`);
    }
    // Оновлюємо розклад
    schedule[lessonIndex] = updatedLesson;
    return true;
}
// b) Функція для видалення заняття з розкладу
function cancelLesson(lessonId) {
    const lessonIndex = schedule.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) {
        throw new Error(`Заняття з ID ${lessonId} не знайдено.`);
    }
    schedule.splice(lessonIndex, 1);
    console.log(`Заняття з ID ${lessonId} було видалено.`);
}
// ===============================================
// 8. Робота з DOM елементами та UI
// ===============================================
// Форма додавання професора
const addProfessorForm = document.getElementById('addProfessorForm');
const addProfessorMessage = document.getElementById('addProfessorMessage');
// Форма додавання аудиторії
const addClassroomForm = document.getElementById('addClassroomForm');
const addClassroomMessage = document.getElementById('addClassroomMessage');
// Форма додавання курсу
const addCourseForm = document.getElementById('addCourseForm');
const addCourseMessage = document.getElementById('addCourseMessage');
// Форма додавання заняття
const addLessonForm = document.getElementById('addLessonForm');
const addLessonMessage = document.getElementById('addLessonMessage');
// Таблиця розкладу
const scheduleTableBody = document.querySelector('#scheduleTable tbody');
// Форма для отримання використання аудиторії
const utilizationForm = document.getElementById('utilizationForm');
const utilizationResult = document.getElementById('utilizationResult');
const utilizationClassroomSelect = document.getElementById('utilizationClassroom');
// Кнопка для визначення найпопулярнішого типу курсу
const popularCourseTypeBtn = document.getElementById('popularCourseTypeBtn');
const popularCourseTypeResult = document.getElementById('popularCourseTypeResult');
// ===============================================
// 9. Функції для роботи з UI
// ===============================================
/**
 * Оновлює таблицю розкладу
 */
function updateScheduleTable() {
    // Очистити таблицю
    scheduleTableBody.innerHTML = '';
    // Додати кожне заняття
    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        const professor = professors.find(p => p.id === lesson.professorId);
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${lesson.id}</td>
      <td>${course ? course.name : 'Не знайдено'}</td>
      <td>${professor ? professor.name : 'Не знайдено'}</td>
      <td>${lesson.classroomNumber}</td>
      <td>${lesson.dayOfWeek}</td>
      <td>${lesson.timeSlot}</td>
      <td>
        <button onclick="deleteLesson(${lesson.id})">Видалити</button>
        <button onclick="changeClassroom(${lesson.id})">Змінити Аудиторію</button>
      </td>
    `;
        scheduleTableBody.appendChild(row);
    });
    // Оновити селекти для розкладу
    populateLessonSelects();
    populateUtilizationSelect();
}
/**
 * Оновлює списки в селектах для додавання заняття
 */
function populateLessonSelects() {
    const lessonCourseSelect = document.getElementById('lessonCourse');
    const lessonProfessorSelect = document.getElementById('lessonProfessor');
    const lessonClassroomSelect = document.getElementById('lessonClassroom');
    // Очистити існуючі опції та додати загальні запрошення
    lessonCourseSelect.innerHTML = '<option value="" disabled selected>Виберіть курс</option>';
    lessonProfessorSelect.innerHTML = '<option value="" disabled selected>Виберіть професора</option>';
    lessonClassroomSelect.innerHTML = '<option value="" disabled selected>Виберіть аудиторію</option>';
    // Додати опції курсів
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id.toString();
        option.textContent = `${course.name} (${course.type})`;
        lessonCourseSelect.appendChild(option);
    });
    // Додати опції професорів
    professors.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.id.toString();
        option.textContent = `${prof.name} (${prof.department})`;
        lessonProfessorSelect.appendChild(option);
    });
    // Додати опції аудиторій
    classrooms.forEach(classroom => {
        const option = document.createElement('option');
        option.value = classroom.number;
        option.textContent = `${classroom.number} (Вмісткість: ${classroom.capacity})`;
        lessonClassroomSelect.appendChild(option);
    });
}
/**
 * Оновлює селект для використання аудиторії
 */
function populateUtilizationSelect() {
    utilizationClassroomSelect.innerHTML = '<option value="" disabled selected>Виберіть аудиторію</option>';
    classrooms.forEach(classroom => {
        const option = document.createElement('option');
        option.value = classroom.number;
        option.textContent = `${classroom.number}`;
        utilizationClassroomSelect.appendChild(option);
    });
}
/**
 * Видаляє заняття з розкладу
 * @param {number} lessonId
 */
function deleteLesson(lessonId) {
    if (confirm(`Ви впевнені, що хочете видалити заняття з ID ${lessonId}?`)) {
        try {
            cancelLesson(lessonId);
            updateScheduleTable();
            alert('Заняття видалено успішно.');
        }
        catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
            else {
                alert('Сталася невідома помилка.');
            }
        }
    }
}
/**
 * Змінює аудиторію для заняття
 * @param {number} lessonId
 */
function changeClassroom(lessonId) {
    const newClassroomNumber = prompt('Введіть новий номер аудиторії:');
    if (newClassroomNumber) {
        try {
            reassignClassroom(lessonId, newClassroomNumber.trim());
            updateScheduleTable();
            alert('Аудиторію змінено успішно.');
        }
        catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
            else {
                alert('Сталася невідома помилка.');
            }
        }
    }
}
// ===============================================
// 10. Обробка подій форм
// ===============================================
// Обробка додавання професора
addProfessorForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const idInput = document.getElementById('professorId');
    const nameInput = document.getElementById('professorName');
    const deptInput = document.getElementById('professorDept');
    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();
    const department = deptInput.value.trim();
    try {
        addProfessor({ id, name, department });
        addProfessorMessage.textContent = 'Професора додано успішно.';
        addProfessorMessage.className = 'success';
        addProfessorForm.reset();
        updateScheduleTable();
    }
    catch (error) {
        if (error instanceof Error) {
            addProfessorMessage.textContent = error.message;
        }
        else {
            addProfessorMessage.textContent = 'Сталася невідома помилка.';
        }
        addProfessorMessage.className = 'error';
    }
});
// Обробка додавання аудиторії
addClassroomForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const numberInput = document.getElementById('classroomNumber');
    const capacityInput = document.getElementById('classroomCapacity');
    const projectorSelect = document.getElementById('classroomProjector');
    const number = numberInput.value.trim();
    const capacity = parseInt(capacityInput.value);
    const hasProjector = projectorSelect.value === 'true';
    try {
        addClassroom({ number, capacity, hasProjector });
        addClassroomMessage.textContent = 'Аудиторію додано успішно.';
        addClassroomMessage.className = 'success';
        addClassroomForm.reset();
        updateScheduleTable();
    }
    catch (error) {
        if (error instanceof Error) {
            addClassroomMessage.textContent = error.message;
        }
        else {
            addClassroomMessage.textContent = 'Сталася невідома помилка.';
        }
        addClassroomMessage.className = 'error';
    }
});
// Обробка додавання курсу
addCourseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const idInput = document.getElementById('courseId');
    const nameInput = document.getElementById('courseName');
    const typeSelect = document.getElementById('courseType');
    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();
    const type = typeSelect.value;
    try {
        addCourse({ id, name, type });
        addCourseMessage.textContent = 'Курс додано успішно.';
        addCourseMessage.className = 'success';
        addCourseForm.reset();
        updateScheduleTable();
    }
    catch (error) {
        if (error instanceof Error) {
            addCourseMessage.textContent = error.message;
        }
        else {
            addCourseMessage.textContent = 'Сталася невідома помилка.';
        }
        addCourseMessage.className = 'error';
    }
});
// Обробка додавання заняття
addLessonForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const idInput = document.getElementById('lessonId');
    const courseSelect = document.getElementById('lessonCourse');
    const professorSelect = document.getElementById('lessonProfessor');
    const classroomSelect = document.getElementById('lessonClassroom');
    const daySelect = document.getElementById('lessonDay');
    const timeSelect = document.getElementById('lessonTime');
    const id = parseInt(idInput.value);
    const courseId = parseInt(courseSelect.value);
    const professorId = parseInt(professorSelect.value);
    const classroomNumber = classroomSelect.value;
    const dayOfWeek = daySelect.value;
    const timeSlot = timeSelect.value;
    try {
        addLesson({ id, courseId, professorId, classroomNumber, dayOfWeek, timeSlot });
        addLessonMessage.textContent = 'Заняття додано успішно.';
        addLessonMessage.className = 'success';
        addLessonForm.reset();
        updateScheduleTable();
    }
    catch (error) {
        if (error instanceof Error) {
            addLessonMessage.textContent = error.message;
        }
        else {
            addLessonMessage.textContent = 'Сталася невідома помилка.';
        }
        addLessonMessage.className = 'error';
    }
});
// Обробка отримання використання аудиторії
utilizationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const classroomNumber = utilizationClassroomSelect.value;
    const utilization = getClassroomUtilization(classroomNumber);
    utilizationResult.textContent = `Відсоток використання аудиторії ${classroomNumber}: ${utilization.toFixed(2)}%`;
});
// Обробка визначення найпопулярнішого типу курсу
popularCourseTypeBtn.addEventListener('click', function () {
    const popularType = getMostPopularCourseType();
    if (popularType) {
        popularCourseTypeResult.textContent = `Найпопулярніший тип курсу: ${popularType}`;
    }
    else {
        popularCourseTypeResult.textContent = 'Немає даних для визначення.';
    }
});
// ===============================================
// 11. Ініціалізація та приклади даних
// ===============================================
function initializeSampleData() {
    try {
        // Додавання професорів
        addProfessor({ id: 1, name: "Dr. Іванов", department: "Комп'ютерні науки" });
        addProfessor({ id: 2, name: "Prof. Петрова", department: "Математика" });
        addProfessor({ id: 3, name: "Dr. Сидоренко", department: "Інформаційні технології" });
        addProfessor({ id: 4, name: "Prof. Коваль", department: "Комп'ютерна інженерія" });
        // Додавання аудиторій
        addClassroom({ number: "101A", capacity: 30, hasProjector: true });
        addClassroom({ number: "202B", capacity: 50, hasProjector: false });
        addClassroom({ number: "303C", capacity: 40, hasProjector: true });
        addClassroom({ number: "404D", capacity: 35, hasProjector: false });
        // Додавання курсів
        addCourse({ id: 1, name: "Алгоритми та структури даних", type: "Lecture" });
        addCourse({ id: 2, name: "Об'єктно-орієнтоване програмування", type: "Seminar" });
        addCourse({ id: 3, name: "Бази даних", type: "Lab" });
        addCourse({ id: 4, name: "Мережеві технології", type: "Practice" });
        // Додавання занять
        addLesson({
            id: 1,
            courseId: 1,
            professorId: 1,
            classroomNumber: "101A",
            dayOfWeek: "Monday",
            timeSlot: "8:30-10:00"
        });
        addLesson({
            id: 2,
            courseId: 2,
            professorId: 2,
            classroomNumber: "202B",
            dayOfWeek: "Tuesday",
            timeSlot: "10:15-11:45"
        });
        addLesson({
            id: 3,
            courseId: 3,
            professorId: 3,
            classroomNumber: "303C",
            dayOfWeek: "Wednesday",
            timeSlot: "12:15-13:45"
        });
        addLesson({
            id: 4,
            courseId: 4,
            professorId: 4,
            classroomNumber: "404D",
            dayOfWeek: "Thursday",
            timeSlot: "14:00-15:30"
        });
        updateScheduleTable();
    }
    catch (error) {
        console.error("Помилка ініціалізації даних:", error instanceof Error ? error.message : 'Невідома помилка');
    }
}
// Виклик функції ініціалізації при завантаженні сторінки
window.onload = function () {
    initializeSampleData();
    // Додамо функції до window для доступу з HTML атрибутів onclick
    window.deleteLesson = deleteLesson;
    window.changeClassroom = changeClassroom;
};
