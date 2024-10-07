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
        console.error(`Professor with id ${professor.id} already exists.`);
        return;
    }
    professors.push(professor);
}
// c) Функція для додавання заняття до розкладу, якщо немає конфліктів
function addLesson(lesson) {
    // Перевірка на конфлікти
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.error(`Cannot add lesson due to conflict: ${conflict.type}`);
        return false;
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
    const totalSlots = 5 /* days */ * 5 /* time slots per day */; // Припускаємо 5 днів та 5 слотів на день
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
        console.error(`Lesson with id ${lessonId} not found.`);
        return false;
    }
    const lesson = schedule[lessonIndex];
    // Створюємо новий об'єкт заняття з новою аудиторією
    const updatedLesson = Object.assign(Object.assign({}, lesson), { classroomNumber: newClassroomNumber });
    // Перевірка на конфлікти
    const conflict = validateLesson(updatedLesson);
    if (conflict) {
        console.error(`Cannot reassign classroom due to conflict: ${conflict.type}`);
        return false;
    }
    // Оновлюємо розклад
    schedule[lessonIndex] = updatedLesson;
    return true;
}
// b) Функція для видалення заняття з розкладу
function cancelLesson(lessonId) {
    const lessonIndex = schedule.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) {
        console.error(`Lesson with id ${lessonId} not found.`);
        return;
    }
    schedule.splice(lessonIndex, 1);
    console.log(`Lesson with id ${lessonId} has been canceled.`);
}
// ===============================================
// 8. Приклад використання системи
// ===============================================
// Додавання деяких даних для демонстрації
addProfessor({ id: 1, name: "Dr. Ivanov", department: "Computer Science" });
addProfessor({ id: 2, name: "Prof. Petrova", department: "Mathematics" });
classrooms.push({ number: "101A", capacity: 30, hasProjector: true });
classrooms.push({ number: "202B", capacity: 50, hasProjector: false });
courses.push({ id: 1, name: "Algorithms", type: "Lecture" });
courses.push({ id: 2, name: "Calculus", type: "Seminar" });
// Додавання заняття
const newLesson = {
    id: 1,
    courseId: 1,
    professorId: 1,
    classroomNumber: "101A",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};
if (addLesson(newLesson)) {
    console.log("Lesson added successfully.");
}
else {
    console.log("Failed to add lesson.");
}
// Спроба додати конфліктне заняття
const conflictingLesson = {
    id: 2,
    courseId: 2,
    professorId: 1, // Той же професор
    classroomNumber: "202B",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00" // Той же час
};
if (addLesson(conflictingLesson)) {
    console.log("Conflicting lesson added successfully.");
}
else {
    console.log("Failed to add conflicting lesson.");
}
// Перевірка розкладу професора
const scheduleProfessor1 = getProfessorSchedule(1);
console.log("Schedule for Professor 1:", scheduleProfessor1);
// Знаходження вільних аудиторій
const availableClassrooms = findAvailableClassrooms("8:30-10:00", "Monday");
console.log("Available Classrooms on Monday 8:30-10:00:", availableClassrooms);
// Аналіз використання аудиторій
const utilization101A = getClassroomUtilization("101A");
console.log("Utilization of Classroom 101A:", utilization101A + "%");
// Визначення найпопулярнішого типу занять
const popularCourseType = getMostPopularCourseType();
console.log("Most Popular Course Type:", popularCourseType);
// Зміна аудиторії для заняття
const reassigned = reassignClassroom(1, "202B");
console.log(`Reassign Classroom Result: ${reassigned}`);
// Видалення заняття
cancelLesson(1);
console.log("Updated Schedule:", schedule);
