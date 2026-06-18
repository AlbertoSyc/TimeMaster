import { escenarios } from './data.js';
import { GameLogic } from './game.js';

const container = document.getElementById('game-container');

const App = {
    init: () => {
        container.innerHTML = `
            <div class="bg-slate-800 p-8 rounded-xl text-center max-w-lg mx-auto mt-10">
                <h1 class="text-3xl font-bold mb-6 text-white">TIME MASTER</h1>
                <input type="text" id="nombre" class="w-full p-3 mb-4 bg-slate-900 border text-white" placeholder="Tu nombre">
                <button id="btn-entrar" class="w-full bg-green-600 p-4 text-white font-bold">ENTRAR</button>
            </div>`;
        document.getElementById('btn-entrar').addEventListener('click', App.menuPrincipal);
    },

    menuPrincipal: () => {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 p-8">
                <h2 class="text-white text-xl mb-6 text-center">Elige un entrenamiento:</h2>
                <div class="grid gap-4">
                    <button id="btn-esc" class="bg-blue-600 p-6 text-white font-bold rounded">1. ESCENARIOS</button>
                    <button id="btn-ext" class="bg-orange-600 p-6 text-white font-bold rounded">2. TIEMPO EXTERNO</button>
                    <button id="btn-est" class="bg-purple-600 p-6 text-white font-bold rounded">3. ESTIMACIÓN TEMPORAL</button>
                </div>
            </div>`;
        document.getElementById('btn-esc').addEventListener('click', App.mostrarEscenarios);
        document.getElementById('btn-ext').addEventListener('click', () => App.mostrarSubMenu('externo'));
        document.getElementById('btn-est').addEventListener('click', () => App.mostrarSubMenu('estimacion'));
    },

    mostrarSubMenu: (tipo) => {
        // Implementación de navegación segura
        container.innerHTML = `<div id="submenu" class="p-8 text-center text-white"></div>`;
        const menu = document.getElementById('submenu');
        const juegos = tipo === 'externo' ? ['Time Timer', 'Línea del Tiempo'] : ['Mi Apuesta', 'Pasos Hormiga'];
        
        juegos.forEach(j => {
            const btn = document.createElement('button');
            btn.className = "block w-full bg-slate-700 p-4 my-2 rounded";
            btn.innerText = j;
            btn.addEventListener('click', () => alert("Juego: " + j));
            menu.appendChild(btn);
        });
        
        const back = document.createElement('button');
        back.innerText = "VOLVER";
        back.className = "bg-red-600 p-4 w-full mt-4";
        back.addEventListener('click', App.menuPrincipal);
        menu.appendChild(back);
    },

    mostrarEscenarios: () => {
        // Lógica de escenarios...
        App.menuPrincipal(); // placeholder
    }
};

App.init();