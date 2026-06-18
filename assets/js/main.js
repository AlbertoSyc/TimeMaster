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
                <div id="ranking" class="mt-6 text-green-300 border-t border-slate-700 pt-4"></div>
            </div>`;
        
        const rankDiv = document.getElementById('ranking');
        rankDiv.innerHTML = `<h3 class="text-xl mb-2 italic">Récords</h3>` + 
            (ranking.length > 0 ? ranking.map(r => `<p>${r.nombre}: ${GameLogic.formatearTiempo(r.tiempo)}</p>`).join('') : '<p>Sin récords</p>');

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
                <div class="grid grid-cols-1 gap-4">
                    <button id="cat-escenarios" class="bg-blue-600 p-8 rounded-xl text-white font-bold text-xl">1. ESCENARIOS</button>
                    <button id="cat-externo" class="bg-orange-600 p-8 rounded-xl text-white font-bold text-xl">2. TIEMPO EXTERNO</button>
                    <button id="cat-estimacion" class="bg-purple-600 p-8 rounded-xl text-white font-bold text-xl">3. ESTIMACIÓN TEMPORAL</button>
                    <button id="btn-salir" class="bg-red-600 p-4 text-white font-bold mt-4">SALIR</button>
                </div>
            </div>`;
        document.getElementById('cat-escenarios').addEventListener('click', App.mostrarEscenarios);
        document.getElementById('cat-externo').addEventListener('click', () => App.renderSub('externo'));
        document.getElementById('cat-estimacion').addEventListener('click', () => App.renderSub('estimacion'));
        document.getElementById('btn-salir').addEventListener('click', () => location.reload());
    },

    renderSub: (tipo) => {
        const titulo = tipo === 'externo' ? "TIEMPO EXTERNO" : "ESTIMACIÓN TEMPORAL";
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 text-center">
                <h2 class="text-3xl font-bold mb-8 text-white uppercase">${titulo}</h2>
                <div id="submenu-btns" class="grid grid-cols-1 gap-4"></div>
                <button id="btn-back" class="w-full bg-slate-600 p-4 text-white font-bold mt-4">VOLVER ATRÁS</button>
            </div>`;
        
        const menu = document.getElementById('submenu-btns');
        const juegos = tipo === 'externo' ? 
            [{n: "Time Timer", f: App.juegoTimeTimer}, {n: "Línea del Tiempo", f: App.juegoLinea}, {n: "Colores", f: App.juegoColores}] :
            [{n: "Mi Apuesta", f: App.juegoApuesta}, {n: "Pasos Hormiga", f: App.juegoHormiga}];
            
        juegos.forEach(s => {
            const b = document.createElement('button');
            b.className = "bg-slate-700 p-6 text-white font-bold rounded-lg border-2 border-slate-500";
            b.innerText = s.n;
            b.addEventListener('click', s.f);
            menu.appendChild(b);
        });
        document.getElementById('btn-back').addEventListener('click', App.menuCategorias);
    },

    // --- JUEGOS ---
    juegoTimeTimer: () => {
        container.innerHTML = `<div class="max-w-md mx-auto mt-10 text-center bg-slate-800 p-8 rounded-lg">
            <div id="timer-text" class="text-6xl text-white font-mono mb-6">05:00</div>
            <button id="start-5" class="bg-green-600 p-4 text-white">INICIAR 5 MIN</button>
            <button id="btn-back" class="block w-full mt-4 text-slate-400">VOLVER</button>
        </div>`;
        document.getElementById('start-5').addEventListener('click', () => App.startTimer(5));
        document.getElementById('btn-back').addEventListener('click', () => App.renderSub('externo'));
    },

    startTimer: (m) => {
        let s = m * 60;
        const txt = document.getElementById('timer-text');
        const i = setInterval(() => {
            s--;
            txt.innerText = Math.floor(s/60) + ":" + (s%60).toString().padStart(2,'0');
            if(s <= 0) { clearInterval(i); alert("¡Terminado!"); }
        }, 1000);
    },

    juegoApuesta: () => {
        container.innerHTML = `<div class="max-w-md mx-auto mt-10 p-8 bg-slate-800 text-white text-center">
            <input type="number" id="apuesta" class="text-black p-2 w-full mb-4" placeholder="Segundos">
            <div id="cron" class="text-5xl mb-4 font-mono">00:00</div>
            <button id="btn-cron" class="bg-purple-600 w-full p-4">INICIAR / PARAR</button>
            <button id="btn-back" class="mt-4 text-slate-400">VOLVER</button>
        </div>`;
        let seg = 0, run = false, interval;
        document.getElementById('btn-cron').addEventListener('click', () => {
            if(!run) { run = true; interval = setInterval(() => { seg++; document.getElementById('cron').innerText = `00:${seg.toString().padStart(2,'0')}`; }, 1000); }
            else { clearInterval(interval); alert("Finalizado en " + seg + "s"); }
        });
        document.getElementById('btn-back').addEventListener('click', () => App.renderSub('estimacion'));
    },

    mostrarEscenarios: () => {
        container.innerHTML = `<div class="max-w-lg mx-auto text-center mt-10" id="esc-list"></div>`;
        Object.keys(escenarios).forEach(key => {
            const b = document.createElement('button');
            b.className = "w-full bg-blue-700 p-4 mb-2 text-white font-bold";
            b.innerText = key.replace('_', ' ');
            b.addEventListener('click', () => App.ejecutarJuego(key));
            document.getElementById('esc-list').appendChild(b);
        });
        const back = document.createElement('button');
        back.innerText = "VOLVER";
        back.className = "bg-red-600 w-full p-4 mt-4 text-white";
        back.addEventListener('click', App.menuCategorias);
        document.getElementById('esc-list').appendChild(back);
    },

    ejecutarJuego: (key) => { 
        // Lógica de juego existente
        alert("Iniciando escenario: " + key);
    },

    renderConfig: () => { /* Tu lógica de configuración aquí */ }
};

App.init();