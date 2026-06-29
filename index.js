const prompt = require("prompt-sync")();
const dedent = require("dedent");

let tasks = [];
let completedTasks = [];
let completedTaskCount = 0;

function addTask() {
    const title = prompt("Введите название задачи: ");
    const description = prompt("Введите описание задачи: ");

    const task = createTask(title, description);

    if (!task) {
        console.log("Ошибка добавления задачи, проверьте корректность ввода");
        return;
    }

    setTask(task);
}

function createTask(title, description) {
    if (!validateString(title) || !validateString(description)) {
        return null;
    }

    return {
        title: title.trim(),
        description: description.trim(),
        isCompleted: false,
        createdDate: new Date(),
        completedDate: null,
    };
}

function validateString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function validateNumber(value) {
    return Number.isInteger(value);
}

function setTask(task) {
    tasks.push(task);
    console.log(`Задача "${task.title}" успешно добавлена`);
}

function showTask() {
    console.log("Список активных задач:");
    tasks.forEach((task, index) => renderTask(task, index));

    console.log("Список завершенных задач:");
    completedTasks.forEach((task, index) => renderTask(task, index));
}

function renderTask(task, index) {
    const {title, description, isCompleted, createdDate, completedDate} = task;

    console.log(dedent`
        ${index + 1}: ${title}
        ${description}
        Статус: ${isCompleted ? "Завершена" : "Активна"}
        Дата создания: ${createdDate.toLocaleString()}
        ${completedDate ? `Дата завершения: ${completedDate.toLocaleString()}` : ""}
    `);
}

function selectTask(actionName) {
    if (tasks.length === 0) {
        console.log(`Список активных задач пуст, ${actionName} невозможно`);
        return null;
    }

    console.log("Список активных задач:");
    tasks.forEach((task, index) => renderTask(task, index));
    console.log(`Введите номер задачи для ${actionName}:`);

    const taskIndex = Number(prompt()) - 1;

    if (!validateNumber(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
        console.log("Ошибка выбора задачи, проверьте введенный номер");
        return null;
    }

    return tasks[taskIndex];
}

function completeTask() {
    const task = selectTask("выполнения");

    if (!task) {
        return;
    }

    task.isCompleted = true;
    task.completedDate = new Date();

    const taskIndex = tasks.findIndex(taskItem => taskItem.title === task.title && taskItem.createdDate.getTime() === task.createdDate.getTime());
    tasks.splice(taskIndex, 1);
    completedTasks.push(task);
    completedTaskCount += 1;

    console.log(`Задача "${task.title}" успешно выполнена`);
}

function deleteTask() {
    const task = selectTask("удаления");

    if (!task) {
        return;
    }

    if (!task.isCompleted && !confirmAction("Задача еще не выполнена, удалить?")) {
        console.log("Удаление отменено");
        return;
    }

    const taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1);

    const completedTaskIndex = completedTasks.indexOf(task);
    if (completedTaskIndex !== -1) {
        completedTasks.splice(completedTaskIndex, 1);
    }

    console.log(`Задача "${task.title}" успешно удалена`);
}

function clearTasks() {
    tasks = [];
    completedTasks = [];
    completedTaskCount = 0;
    console.log("Все задачи удалены");
}

function getTaskDescriptions() {
    return tasks.map(task => task.description);
}

function getLongTasks() {
    return tasks.filter(task => task.title.length > 10 || task.description.length > 10);
}

function getTasksByDateRange(startDate, endDate, isCompleted = false) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isCompleted === true) {
        return completedTasks.filter(task => task.completedDate >= start && task.completedDate <= end);
    }

    return tasks.filter(task => task.createdDate >= start && task.createdDate <= end);
}

function clearShortTasks() {
    tasks = tasks.filter(task => task.title.length >= 5 && task.description.length >= 5);
}

function updateTaskTitle(index, newTitle) {
    if (!validateNumber(index) || index < 0 || index >= tasks.length) {
        return null;
    }

    if (!validateString(newTitle)) {
        return null;
    }

    tasks[index].title = newTitle.trim();
    return tasks[index];
}

function confirmAction(question) {
    const answer = prompt(`${question} (y/n): `);

    return typeof answer === "string" && answer.trim().toLowerCase() === "y";
}

function renderBaseInfo() {
    console.log("\r");
    console.log("Менеджер задач.");
    console.log("\r");
    showTask();
}

function renderMenu() {
    console.log("\r");
    console.log("Выберите дальнейшее действие:");
    console.log("1. Показать задачи");
    console.log("2. Добавить задачу");
    console.log("3. Завершить задачу");
    console.log("4. Удалить задачу");
    console.log("5. Очистить все задачи");
    console.log("\r");
}

function menu() {
    renderMenu();

    console.log("Введите номер пункта меню и нажмите Enter...");
    const select = Number(prompt());

    switch (select) {
        case 1:
            showTask();
            break;
        case 2:
            addTask();
            break;
        case 3:
            completeTask();
            break;
        case 4:
            deleteTask();
            break;
        case 5:
            clearTasks();
            break;
        default:
            console.log("Неизвестная команда");
    }

    backToMenu();
}

function backToMenu() {
    console.log("\r");
    console.log("Выберите дальнейшее действие:");
    console.log("1. Вернуться в меню");

    const select = Number(prompt());

    if (select === 1) {
        displayAllInfo();
    }
}

function displayAllInfo() {
    renderBaseInfo();
    menu();
}

displayAllInfo();
