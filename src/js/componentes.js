import { Todo } from '../classes/todo.class.js';
import { todoList } from '../index.js';

// Referencias en el HTML
const divTodoList = document.querySelector('.todo-list');
const txtInput = document.querySelector('.new-todo');
const btnBorrar = document.querySelector('.clear-completed');
const ulFiltros = document.querySelector('.filters');
const anchorFiltros = document.querySelectorAll('.filtro');


export const crearTodoHtml = (todo) => {
    const htmlTodo = `
    <li class="${ (todo.completado) ? 'completed' : '' }" data-id="${ todo.id }">
        <div class="view">
            <input class="toggle" type="checkbox" ${ (todo.completado) ? 'checked' : '' }>
            <label>${ todo.tarea }</label>
            <button class="destroy"></button>
        </div>
        <input class="edit" value="Create a TodoMVC template">
    </li>`;

    const div = document.createElement('div');
    div.innerHTML = htmlTodo;

    // Extraemos del div el li para solo añadir este
    divTodoList.append(div.firstElementChild);
    return div.firstElementChild;
}

// Eventos
txtInput.addEventListener('keyup', (event) => {
    // Comprobamos si se pulsa Enter (13) y si el texto tiene contenido.
    if (event.keyCode === 13 && txtInput.value.length > 0) {
        const nuevoTodo = new Todo(txtInput.value);
        todoList.nuevoTodo(nuevoTodo);
        crearTodoHtml(nuevoTodo);

        txtInput.value = '';
    }
});

divTodoList.addEventListener('click', (event) => {
    const nombreElemento = event.target.localName; // input, label o button para este caso
    const todoElemento = event.target.parentElement.parentElement; // Busco el li
    const todoId = todoElemento.getAttribute('data-id');

    if (nombreElemento.includes('input')) { // Click en el check
        todoList.marcarCompletado(todoId);
        todoElemento.classList.toggle('completed');
    } else if (nombreElemento.includes('button')) { // Click en la X para borrar
        todoList.eliminarTodo(todoId);
        divTodoList.removeChild(todoElemento);
    }
});

btnBorrar.addEventListener('click', () => {
    todoList.eliminarCompletados();

    // Debemos ir hacia atrás porque vamos a ir borrando elementos de "children"
    for (let i = divTodoList.children.length - 1; i >= 0; i--) {
        const elemento = divTodoList.children[i];
        
        if (elemento.classList.contains('completed')) {
            divTodoList.removeChild(elemento);
        }
    }
});

ulFiltros.addEventListener('click', (event) => {
    const filtro = event.target.text;
    
    if ( !filtro) return;

    anchorFiltros.forEach(elem => elem.classList.remove('selected'));
    event.target.classList.add('selected');

    for (const elemento of divTodoList.children) {
        elemento.classList.remove('hidden');
        const completado = elemento.classList.contains('completed');

        switch (filtro) {
            case 'Pendientes':
                if (completado) {
                    elemento.classList.add('hidden');
                }
                break;
            case 'Completados':
                if ( !completado) {
                    elemento.classList.add('hidden');
                }
                break;
            
        }
    }
});