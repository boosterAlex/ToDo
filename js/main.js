const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    console.log(localStorage.getItem('tasks'));

    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((newTask) => renderHTML(newTask));
}

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

checkEmptyList();

function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);
    saveToLocalStorage();

    renderHTML(newTask);
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') return;
    const parentNode = e.target.closest('li');

    console.log(parentNode.id);
    const id = +parentNode.id;

    // const index = tasks.findIndex((el) => {
    //     if (el.id === id) {
    //         return el.id;
    //     }
    // });
    // tasks.splice(index, 1);

    tasks = tasks.filter((el) => el.id !== id);

    saveToLocalStorage();

    parentNode.remove();

    checkEmptyList();
}

function doneTask(e) {
    if (e.target.dataset.action !== 'done') return;

    const parentNode = e.target.closest('li');

    const id = +parentNode.id;

    const el = tasks.find((el) => el.id === id);
    el.done = !el.done;

    saveToLocalStorage();
    parentNode
        .querySelector('.task-title')
        .classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } else {
        const emptyListHTML = document.querySelector('#emptyList');
        emptyListHTML ? emptyListHTML.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderHTML(newTask) {
    const cssClass = newTask.done
        ? 'task-title task-title--done'
        : 'task-title';

    const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${newTask.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                 </li>`;

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
