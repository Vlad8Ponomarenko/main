"use strict";
// Enum типи для статусів студентів, типів курсів, семестрів, оцінок та факультетів
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// Клас для керування університетом
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.grades = [];
    }
    // Додавання нового студента
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.students.length + 1, enrollmentDate: new Date() });
        this.students.push(newStudent);
        return newStudent;
    }
    // Реєстрація студента на курс
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (student && course && course.faculty === student.faculty && course.maxStudents > 0) {
            alert(`Student ${student.fullName} successfully registered for course ${course.name}`);
            course.maxStudents--;
        }
        else {
            alert('Registration failed. Ensure student and course are valid.');
        }
    }
    // Виставлення оцінки студенту
    setGrade(studentId, courseId, grade) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (student && course) {
            const gradeRecord = {
                studentId: student.id,
                courseId: course.id,
                grade: grade,
                date: new Date(),
                semester: course.semester
            };
            this.grades.push(gradeRecord);
            alert(`Grade set for student ${student.fullName} in course ${course.name}`);
        }
        else {
            alert('Student or course not found!');
        }
    }
    // Оновлення статусу студента
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            if (newStatus === StudentStatus.Graduated && student.status !== StudentStatus.Active) {
                alert('Can only graduate an active student!');
                return;
            }
            student.status = newStatus;
            alert(`Student ${student.fullName} status updated to ${newStatus}`);
        }
        else {
            alert('Student not found!');
        }
    }
    // Отримання студентів за факультетом
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    // Отримання оцінок студента
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    // Отримання доступних курсів за факультетом та семестром
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }
    // Розрахунок середнього балу студента
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0)
            return 0;
        const totalGrade = studentGrades.reduce((sum, record) => sum + record.grade, 0);
        return totalGrade / studentGrades.length;
    }
    // Додавання нового курсу
    addCourse(course) {
        const newCourse = Object.assign(Object.assign({}, course), { id: this.courses.length + 1, maxStudents: 30 });
        this.courses.push(newCourse);
        return newCourse;
    }
    // Отримання відмінників по факультету
    getHonorStudentsByFaculty(faculty) {
        return this.getStudentsByFaculty(faculty).filter(student => {
            const avgGrade = this.calculateAverageGrade(student.id);
            return avgGrade >= 4.5; // Визначаємо відмінників
        });
    }
}
// Тестування функціоналу
const universitySystem = new UniversityManagementSystem();
// Додавання студентів
const student1 = universitySystem.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    groupNumber: "CS101",
    enrollmentDate: new Date() // Додаємо дату реєстрації
});
const student2 = universitySystem.enrollStudent({
    fullName: "Jane Smith",
    faculty: Faculty.Economics,
    year: 2,
    status: StudentStatus.Active,
    groupNumber: "ECO201",
    enrollmentDate: new Date() // Додаємо дату реєстрації
});
// Додавання курсів
const course1 = universitySystem.addCourse({
    name: "Intro to Programming",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30
});
const course2 = universitySystem.addCourse({
    name: "Microeconomics",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 30
});
// Реєстрація студентів на курси
universitySystem.registerForCourse(student1.id, course1.id);
universitySystem.registerForCourse(student2.id, course2.id);
// Виставлення оцінок
universitySystem.setGrade(student1.id, course1.id, Grade.Excellent);
universitySystem.setGrade(student2.id, course2.id, Grade.Good);
// Оновлення статусу студента
universitySystem.updateStudentStatus(student1.id, StudentStatus.Graduated);
// Перевірка відмінників
const honorStudents = universitySystem.getHonorStudentsByFaculty(Faculty.Computer_Science);
console.log(honorStudents);
