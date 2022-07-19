//Select the form element
const form = document.querySelector( '#todoform' );
const todosList = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');

//Vars
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let todoInput = document.getElementById( 'newtodo' );
let editingTodo = -1;

//1st render
renderTodo();

//Form submit action
form.addEventListener( 'submit', function(event) {
  event.preventDefault();
  saveTodo();
  renderTodo();

  //Store the todo items in the local storage
  localStorage.setItem('todos', JSON.stringify(todos));
});

// Save the Todo
function saveTodo() {

  const todoValue = todoInput.value;

  //Check if todo is empty
  const isEmpty = todoValue === '';

  //check for duplicate todos
  const isduplicate = todos.find( element => element.value.toLowerCase() === todoValue.toLowerCase() );

  if ( isEmpty ) {
    showNotification( 'Todo is empty' );
  }
  else if( isduplicate ) {
    showNotification( 'Todo is duplicate' );
  }
  else {
    // Edit the existing todo
    if (editingTodo !== -1) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === editingTodo ? todoInput.value : todo.value,
       }));

       editingTodo = -1;
    }
    else {
     //Push thenew todo in the array
      todos.push({
        value: todoValue,
        checked: false,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      });
    }
  }
  
    //Empty the value of the todo once it is pushed to the array
    todoInput.value = '';
    console.log(todos);
}

//Render Todo
function renderTodo() {
  if ( todos.length === 0 ) {
    todosList.innerHTML = `<center>Nothing to do!</center>`;
    return;
  }

  //Clear element before a re-render
  todosList.innerHTML = '';

  todos.forEach((todo, index) => {
    todosList.innerHTML += `
    <div class="todo" id=${index}>
    <i 
      class="bi ${todo.checked ? `bi-check-circle-fill` : `bi-circle`}"
      style="color: ${todo.color}"
      data-action="check"
      ></i>
    <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
    <i class="bi bi-pencil-square" data-action="edit"></i>
    <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

//Click event listener for all todos
todosList.addEventListener('click', (event) => {
  const target = event.target;
  const parentElement = target.parentElement;

  if ( parentElement.className !== 'todo' ) return;

  // Get the todo Id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // Get the todo action
  const action = target.dataset.action;

  // Call the appropriate function based on the action selected by the user
  if( action === 'check') checkTodo(todoId);
  if( action === 'edit') editTodo(todoId);
  if( action === 'delete') deleteTodo(todoId);

  //console.log(todoId, action);
})

// Check a todo
function checkTodo(todoId) {
  todos = todos.map((todo, index) => 
     ({
      ...todo,
      checked: index === todoId ? !todo.checked : todo.checked,
    })
  );
  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Edit a Todo
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  editingTodo = todoId;
}

//Delete a Todo
function deleteTodo(todoId) {
  todos.splice(todoId, 1);

  // If a user edits a Todo  but cilicks on the delete button before saving the 
  // previous Todo, it will cause the wrong Todo to be deleted from the list. So
  // we need to set the editingToDo = -1 to prevent this behaviour
  editingTodo = -1;

  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todos));
}

//Show a notification
function showNotification(msg) {
  // Set the notification message
  notificationEl.innerHTML = msg;
  //Add the class to show the notification panel
  notificationEl.classList.add('notif-enter');

  // Remove the notification after 2 sec
  setTimeout(() => {
    notificationEl.classList.remove('notif-enter');
  }, 2000);
}