const prompt = require("prompt-sync")();
const dedent = require("dedent");

let tasks = [];
let completedTasks = [];

function createTask(title, description){
    const newTask = {
        title,
        description,
        isCompleted: false,
        createdDate: new Date(),
        completedDate:  null,
    }

    const validateResult = validateTask(newTask);
    validateResult ? 
        sendTaskToList(newTask) : 
        renderMessage('Ошибка добавления задачи, проверьте корректность ввода');
}

function validateTask(taskObj){
    return validateString(taskObj?.title) && validateString(taskObj?.description);
}

function validateString(str){
    return String(str).trim().length > 2;
}

function validateNumber(number){
    return Number.isFinite(Number(number));
}

function sendTaskToList(taskObj){
    tasks.push(taskObj);
    renderMessage(`Задача ${taskObj.title} Успешно добавлена`);
}

function showTasks(){
    renderTemplateTaskList(tasks, 'Список активных задач:');
    renderTemplateTaskList(completedTasks, 'Список завершенных задач:');
}

function renderTemplateTaskList(tasksArr, templateTitle = ''){ 
    renderMessage(templateTitle);
    if(tasksArr.length === 0){
        console.log('Задач нет');
    }else{
        tasksArr.map((task, index) => {
            return console.log(dedent`
                ${index + 1}: ${task.title}
                ${task.description}
                Статус: ${task.isCompleted ? 'Завершена' : 'Активна'}
                Дата создания: ${task.createdDate.toLocaleString()}
                ${task.isCompleted ? 'Дата завершения:' + task.completedDate : '' }
            `);
        });
        console.log('');
    }
}

function renderMessage(messageStr){
    console.log(`\n${messageStr}`);
}

function completeTask(){
    if(tasks.length === 0){
        renderMessage('Список активных задач пуст, завершение невозможно');
        backToMenu();
    }else{
        renderTemplateTaskList(tasks, 'Список активных задач:');
        renderMessage('Введите номер задачи для завершения');

        const taskId = Number(prompt()) - 1;
        if(validateNumber(taskId) && taskId >= 0 && taskId < tasks.length){
            const selectedTask = tasks[taskId]
            tasks.splice(taskId, 1);

            selectedTask.isCompleted = true;
            selectedTask.completedDate = new Date().toLocaleString();
            completedTasks.push(selectedTask);

            renderMessage(`Задача ${selectedTask.title} успешно выполнена`);
        }else{
            renderMessage('Ошибка выбора задачи, проверьте введенный номер');
            afterErrorCallBack(completeTask);
        }
    }
}

function deleteTask(){
    if(tasks.length === 0){
        renderMessage('Список активных задач пуст, удаление невозможно');
        backToMenu();
    }else{
        renderTemplateTaskList(tasks, 'Список активных задач:');
        renderMessage('Введите номер задачи для удаления');

        const taskId = Number(prompt()) - 1;
        if(validateNumber(taskId) && taskId >= 1 && taskId < tasks.length){
            const selectedTask = tasks[taskId]
            tasks.splice(taskId, 1);

            renderMessage(`Задача ${selectedTask.title} успешно удалена`);
        }else{
            renderMessage('Ошибка выбора задачи, проверьте введенный номер');
            afterErrorCallBack(deleteTask);
        }
    }
}

function addTask(){
    console.log('Введите название задачи');
    const title = prompt();

    console.log('Введите описание задачи и нажмите Enter');
    const description = prompt();

    createTask(title, description);
}

function afterErrorCallBack(callback){
    console.log('Выберите следующее действие:');
    console.log('1. Вернуться в меню');
    console.log('2. Повторить');

    const actionId = Number(prompt())
    if(validateNumber(actionId)){
        switch(actionId){
            case 1:
                displayAllInfo();
                break;
            case 2:
                callback();
                break;
        }
    }else{
        afterErrorCallBack();
    }
}

function renderBaseInfo(){
    console.log('\r')
    console.log('Менеджер задач.');
    console.log('\r')
    showTasks();
}

function backToMenu(){
    console.log('\r')
    console.log('Выберите дальнейшее действие:')
    console.log('1.Вернуться в меню')
    let select = Number(prompt());
     switch(select){
        case 1:
            displayAllInfo();
            break;
    }
}

function renderMenu(){
    console.log('\r')
    console.log('Выберите дальнейшее действие:')
    console.log('1.Показать задачи')
    console.log('2.Добавить задачу')
    console.log('3.Завершить задачу')
    console.log('4.Удалить задачу')
    console.log('\r')
}

function menu(){
    renderMenu();

    console.log('Введите номер пункта меню и нажмите Enter...');
    let select = Number(prompt());

    switch(select){
        case 1:
            showTasks();
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
    }

    backToMenu();
} 


function displayAllInfo(){
    renderBaseInfo();
    menu();
}

displayAllInfo();