const prompt = require("prompt-sync")();
const dedent = require("dedent");

let tasks = [];
let completedTasks = [];

function addTask(){
    console.log('Введите название задачи');
    const title = prompt();

    console.log('Введите описание задачи и нажмите Enter');
    const description = prompt();

    createTask(title, description);
}

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
        setTasks(newTask) : 
        console.log('Ошибка добавления задачи, проверьте корректность ввода');
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

function setTasks(taskObj){
    tasks.push(taskObj);
    console.log(`Задача ${taskObj.title} Успешно добавлена`);
}

function showTasks(){
    renderTemplateTaskList(tasks, 'Список активных задач:');
    renderTemplateTaskList(completedTasks, 'Список завершенных задач:');
}

function renderTemplateTaskList(tasksArr, templateTitle = ''){ 
    console.log(templateTitle);
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

function completeTask(){
    const task = selectTask('выполнение', (task) => {
        task.isCompleted = true;
        task.completedDate = new Date().toLocaleString();
        completedTasks.push(task);
    });

    if (task) {
        console.log(`Задача ${task.title} успешно выполнена`);
    } else {
        afterErrorCallBack(completeTask);
    }
}

function deleteTask(){
    const task = selectTask('удаление', () => {});

    if(task){
        if(!task.isCompleted){
            console.log('Задача еще не выполнена, удалить?');
            console.log('1. Да');
            console.log('2. Нет');

            const answer = Number(prompt());

            if(answer === 1){
                console.log(`Задача ${task.title} успешно удалена`);
            }else{
                tasks.push(task);
                console.log('Удаление отменено');
            }
        }else{
            console.log(`Задача ${task.title} успешно удалена`);
        }
    }else{
        afterErrorCallBack(deleteTask);
    }
}

function selectTask(actionName, callback){
    if(tasks.length === 0){
        console.log(`Список активных задач пуст, ${actionName} невозможно`);
        backToMenu();
        return;
    }
    
    renderTemplateTaskList(tasks, 'Список активных задач:');
    console.log(`Введите номер задачи для ${actionName}`);

    const taskId = Number(prompt()) - 1;

    if(!validateNumber(taskId) || taskId < 0 || taskId >= tasks.length){
        console.log('Ошибка выбора задачи, проверьте введенный номер');
        return;
    }

    const selectedTask = tasks[taskId]
    tasks.splice(taskId, 1);

    callback(selectedTask);

    return selectedTask;
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
        afterErrorCallBack(callback);
    }
}

function renderBaseInfo(){
    console.log('\r')
    console.log('Менеджер задач.');
    console.log('\r')
    showTasks();
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

function displayAllInfo(){
    renderBaseInfo();
    menu();
}

displayAllInfo();