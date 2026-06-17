import { escenarios } from './data.js';
import { calcularTiempoFinal, configurarDragAndDrop, guardarPuntuacion } from './game.js';

const container = document.getElementById('game-container');

function init() {
    const ranking = JSON.parse(localStorage.getItem('rankingArcade') || '[]');
    container.innerHTML = `
        <div class="arcade-box">
            <h1>TIME ARCADE</h1>
            <input type="text" id="nombre" placeholder="Nombre...">
            <button id="btn-jugar">JUGAR</button>
            <div id="ranking-list"><h3>TOP 5</h3>${ranking.map(r => `<p>${r.nombre}: ${r.tiempo}s</p>`).join('')}</div>
        </div>
    `;
    document.getElementById('btn-jugar').onclick = () => {
        const nombre = document.getElementById('nombre').value;
        if(nombre) mostrarEscenarios(nombre); 
    };
}

function mostrarEscenarios(nombre) {
    container.innerHTML = `<div class="arcade-box"><h1>Elige Misión</h1></div>`;
    Object.keys(escenarios).forEach(key => {
        const btn = document.createElement('button');
        btn.innerText = key.toUpperCase();
        btn.onclick = () => ejecutarJuego(nombre, escenarios[key]);
        container.querySelector('.arcade-box').appendChild(btn);
    });
}

function ejecutarJuego(nombre, tareas) {
    container.innerHTML = `
        <div class="arcade-box">
            <div id="lista-tareas" class="drop-zone"></div>
            <div id="calendario" class="drop-zone">CALENDARIO (Suelta aquí)</div>
            <button id="btn-finalizar">TERMINAR</button>
        </div>
    `;
    const lista = document.getElementById('lista-tareas');
    tareas.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'task-card'; div.id = 'task-' + i;
        div.innerText = t.nombre; div.draggable = true;
        lista.appendChild(div);
    });
    configurarDragAndDrop();
    document.getElementById('btn-finalizar').onclick = () => {
        const total = calcularTiempoFinal(tareas);
        guardarPuntuacion(nombre, total);
        alert(`¡Finalizado! Tiempo: ${total}s`);
        init();
    };
}
document.addEventListener('DOMContentLoaded', init);
