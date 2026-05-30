const prompt = require("prompt-sync")();

let task = null;
let completeTaskCount = 0;

function showTask(){
    if(task){
        console.log(task);
    }else{
        console.log('Задача отсутствует');
    }
}

function setTask(taskDescription){
    if(task){
        console.log('Не могу добавить задачу, завершите или удалите предыдущую');
    }else{
        task = taskDescription;
        console.log('Задача добавлена');
    }
}

function completeTask(){
    if(task){
        completeTaskCount++;
        console.log('Задача');
        console.log(task);
        console.log('Выполнена');
        deleteTask(false);
    }else {
        console.log('Ошибка выполнения задачи, задача не найдена');
    }
}

function deleteTask(showMessage = true){
    if(task){
        if(showMessage){
            console.log('Задача');
            console.log(task);
            console.log('Удалена');
        }
        task = null;
    }else {
        console.log('Ошибка удаления, задача не найдена');
    }
}

function addTask(){
    console.log('Введите описание задачи и нажмите Enter');
    const description = prompt();
    setTask(description);
}

function renderBaseInfo(){
    console.log('\r')
    console.log('Менеджер задач.');
    console.log('Выполненных:' + completeTaskCount);
    console.log('\r')
    console.log('Активная:');
    showTask();
}

function renderMenu(){
    console.log('\r')
    console.log('Выберите дальнейшее действие:')
    console.log('1.Показать задачу')
    console.log('2.Добавить задачу')
    console.log('3.Завершить задачу')
    console.log('4.Удалить задачу')
    console.log('\r')
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

function menu(){
    renderMenu();

    console.log('Введите номер пункта меню и нажмите Enter...');
    let select = Number(prompt());

    switch(select){
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
    }

    backToMenu();
} 


function displayAllInfo(){
    renderBaseInfo();
    menu();
}

displayAllInfo();