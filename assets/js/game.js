import { escenarios } from './data.js';
import { GameLogic } from './game.js';

const container = document.getElementById('game-container');

const App = {
    init: () => {
        container.innerHTML = `
            <div class="bg-slate-800 p-8 rounded-xl border-4 border-green-500 shadow-2xl text-center">
                <input type="text" id="nombre" class="w-full p-3 mb-4 bg-slate-900 border-2 border-green-500 text-white" placeholder="Tu nombre">
                <button id="btn-jugar" class="bg-green-500 text-slate-900 px-8 py-3 font-bold hover:bg-green-400">JUGAR</button>
                <button id="btn-config" class="ml-4 bg-purple-600 text-white px-8 py-3 font-bold">EDITAR TAREAS</button>
            </div>`;
        document.getElementById('btn-jugar').onclick = () => {
            const nombre = document.getElementById('nombre').value;
            if (nombre) App.mostrarEscenarios(nombre);
        };
        document.getElementById('btn-config').onclick = App.renderConfig;
    },
    renderConfig: () => {
        container.innerHTML = `<div class="bg-slate-800 p-6 rounded-xl"><h2 class="text-xl mb-4">Configuración</h2><textarea id="json-input" class="w-full h-40 bg-black text-green-400 p-2">${JSON.stringify(escenarios, null, 2)}</textarea><button id="btn-save" class="mt-4 bg-blue-600 p-3 w-full">GUARDAR</button></div>`;
        document.getElementById('btn-save').onclick = () => {
            alert("Escenarios actualizados!");
            App.init();
        };
    },
    mostrarEscenarios: (nombre) => {
        container.innerHTML = `<div class="grid grid-cols-3 gap-4">` + Object.keys(escenarios).map(k => `<button class="bg-slate-700 p-6 hover:bg-green-600" onclick="window.ejecutarJuego('${nombre}', '${k}')">${k.toUpperCase()}</button>`).join('') + `</div>`;
    },
    ejecutarJuego: (nombre, key) => {
        const tareas = escenarios[key];
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div id="lista-tareas" class="bg-slate-800 p-4 drop-zone"></div>
                <div id="calendario" class="bg-slate-800 p-4 drop-zone border-2 border-dashed border-green-500"></div>
            </div>
            <button id="btn-finalizar" class="mt-4 w-full bg-red-600 p-4">TERMINAR</button>
            <div id="resultado" class="mt-4 text-2xl font-bold"></div>`;
        
        tareas.forEach((t, i) => {
            const div = document.createElement('div');
            div.className = 'task-card bg-purple-700 p-4 m-2 text-white';
            div.id = 'task-' + i; div.innerText = t.nombre; div.draggable = true;
            document.getElementById('lista-tareas').appendChild(div);
        });
        
        GameLogic.configurarDrag();
        document.getElementById('btn-finalizar').onclick = () => {
            const total = GameLogic.calcularTiempo(tareas);
            document.getElementById('resultado').innerText = `¡Misión terminada! Tiempo total: ${total} segundos.`;
        };
    }
};

window.ejecutarJuego = App.ejecutarJuego;
document.addEventListener('DOMContentLoaded', App.init);
