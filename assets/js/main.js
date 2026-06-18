import { escenarios } from './data.js';
import { GameLogic } from './game.js';

const container = document.getElementById('game-container');
let usuarioActual = "";

const App = {
    init: () => {
        const ranking = JSON.parse(localStorage.getItem('rankingArcade') || '[]');
        container.innerHTML = `
            <div class="bg-slate-800 p-8 rounded-xl border-4 border-green-500 shadow-2xl text-center max-w-lg mx-auto mt-10">
                <h1 class="text-3xl font-bold mb-6 text-white">TIME MASTER ARCADE</h1>
                <input type="text" id="nombre" class="w-full p-3 mb-4 bg-slate-900 border-2 border-green-500 text-white" placeholder="Tu nombre">
                <div class="flex flex-col gap-2">
                    <button id="btn-jugar" class="bg-green-500 text-slate-900 px-8 py-3 font-bold">ENTRAR</button>
                    <button id="btn-config" class="bg-purple-600 text-white px-8 py-3 font-bold">AJUSTES</button>
                </div>
                <div id="ranking-box" class="mt-6 text-green-300 border-t border-slate-700 pt-4">
                    <h3 class="text-xl mb-2 italic">Récords</h3>
                    ${ranking.length > 0 ? ranking.map(r => `<p>${r.nombre}: ${GameLogic.formatearTiempo(r.tiempo)}</p>`).join('') : '<p>Sin récords</p>'}
                </div>
            </div>`;
        document.getElementById('btn-jugar').addEventListener('click', () => {
            usuarioActual = document.getElementById('nombre').value;
            if(usuarioActual) App.menuCategorias();
        });
        document.getElementById('btn-config').addEventListener('click', App.renderConfig);
    },

    menuCategorias: () => {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 text-center">
                <h2 class="text-3xl font-bold mb-8 text-white uppercase">Hola ${usuarioActual}, elige:</h2>
                <div class="grid gap-4">
                    <button id="cat-escenarios" class="bg-blue-600 p-8 text-white font-bold text-xl">1. ESCENARIOS</button>
                    <button id="cat-externo" class="bg-orange-600 p-8 text-white font-bold text-xl">2. TIEMPO EXTERNO</button>
                    <button id="cat-estimacion" class="bg-purple-600 p-8 text-white font-bold text-xl">3. ESTIMACIÓN</button>
                    <button id="btn-salir" class="bg-red-600 p-4 text-white font-bold mt-4">SALIR</button>
                </div>
            </div>`;
        document.getElementById('cat-escenarios').addEventListener('click', App.mostrarEscenarios);
        document.getElementById('cat-externo').addEventListener('click', () => App.renderSub('externo'));
        document.getElementById('cat-estimacion').addEventListener('click', () => App.renderSub('estimacion'));
        document.getElementById('btn-salir').addEventListener('click', () => location.reload());
    },

    renderSub: (tipo) => {
        container.innerHTML = `<div id="sub-cont" class="max-w-lg mx-auto p-8"></div>`;
        const cont = document.getElementById('sub-cont');
        const juegos = tipo === 'externo' ? 
            [{n: "Time Timer", f: App.juegoTimeTimer}, {n: "Línea del Tiempo", f: App.juegoLinea}] : 
            [{n: "Mi Apuesta", f: App.juegoApuesta}, {n: "Pasos Hormiga", f: App.juegoHormiga}];
        
        juegos.forEach(j => {
            const b = document.createElement('button');
            b.className = "w-full bg-slate-700 p-4 my-2 text-white rounded font-bold";
            b.innerText = j.n;
            b.addEventListener('click', j.f);
            cont.appendChild(b);
        });
        
        const back = document.createElement('button');
        back.innerText = "VOLVER";
        back.className = "w-full bg-red-600 p-4 mt-4 text-white font-bold";
        back.addEventListener('click', App.menuCategorias);
        cont.appendChild(back);
    },

    // --- MANTENIMIENTO DE TUS JUEGOS ---
    juegoTimeTimer: () => { App.renderBasicGame("Time Timer", "externo"); },
    juegoLinea: () => { App.renderBasicGame("Línea del Tiempo", "externo"); },
    juegoApuesta: () => { App.renderBasicGame("Mi Apuesta", "estimacion"); },
    juegoHormiga: () => { App.renderBasicGame("Pasos Hormiga", "estimacion"); },

    renderBasicGame: (titulo, tipo) => {
        container.innerHTML = `
            <div class="p-8 text-white text-center">
                <h2 class="text-2xl font-bold mb-4">${titulo}</h2>
                <div class="bg-slate-800 p-10 rounded">LÓGICA DEL JUEGO AQUÍ</div>
                <button id="btn-back" class="mt-4 bg-slate-600 p-2">VOLVER</button>
            </div>`;
        document.getElementById('btn-back').addEventListener('click', () => App.renderSub(tipo));
    },

    mostrarEscenarios: () => {
        container.innerHTML = `<div id="esc-cont" class="max-w-lg mx-auto p-8"></div>`;
        const cont = document.getElementById('esc-cont');
        Object.keys(escenarios).forEach(key => {
            const b = document.createElement('button');
            b.className = "w-full bg-blue-700 p-4 my-2 text-white font-bold";
            b.innerText = key.replace('_', ' ');
            b.addEventListener('click', () => alert("Iniciando " + key));
            cont.appendChild(b);
        });
        const back = document.createElement('button');
        back.innerText = "VOLVER";
        back.className = "w-full bg-red-600 p-4 mt-4 text-white font-bold";
        back.addEventListener('click', App.menuCategorias);
        cont.appendChild(back);
    },

    renderConfig: () => { 
        container.innerHTML = `<div class="p-8 text-white text-center"><h1>AJUSTES</h1><button id="btn-back" class="bg-red-600 p-4">VOLVER</button></div>`;
        document.getElementById('btn-back').addEventListener('click', App.init);
    }
};

App.init();