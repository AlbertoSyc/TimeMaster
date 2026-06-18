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
            b.className = "w-full bg-slate-700 p-4 my-2 text-white rounded font-bold hover:bg-slate-600";
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

    juegoTimeTimer: () => {
        container.innerHTML = `
            <div class="max-w-md mx-auto mt-10 text-center bg-slate-800 p-8 rounded-xl">
                <h2 class="text-white mb-4">Time Timer (Visualizador)</h2>
                <div class="w-48 h-48 mx-auto bg-white rounded-full relative overflow-hidden mb-6 border-4 border-slate-600">
                    <div id="disco" class="absolute inset-0 bg-red-600 origin-center transition-transform duration-1000 ease-linear"></div>
                </div>
                <div id="timer-text" class="text-4xl text-white font-mono mb-6">05:00</div>
                <button id="btn-start" class="bg-green-600 px-8 py-3 text-white font-bold rounded">INICIAR 5 MIN</button>
                <button id="btn-back" class="block w-full mt-4 text-slate-400">VOLVER</button>
            </div>`;
        document.getElementById('btn-start').addEventListener('click', () => {
            let s = 300;
            const d = document.getElementById('disco');
            const t = document.getElementById('timer-text');
            const i = setInterval(() => {
                s--;
                d.style.transform = `rotate(${(300 - s) * (360/300)}deg)`;
                t.innerText = Math.floor(s/60) + ":" + (s%60).toString().padStart(2,'0');
                if(s <= 0) { clearInterval(i); alert("¡Tiempo terminado!"); }
            }, 1000);
        });
        document.getElementById('btn-back').addEventListener('click', () => App.renderSub('externo'));
    },

    juegoApuesta: () => {
        container.innerHTML = `
            <div class="max-w-md mx-auto mt-10 p-8 bg-slate-800 text-white rounded-xl">
                <input type="number" id="apuesta" class="w-full p-3 text-black mb-4" placeholder="Segundos que crees tardar">
                <div id="progress-bar" class="w-full h-4 bg-slate-600 rounded-full mb-4 overflow-hidden">
                    <div id="progress" class="h-full bg-purple-500 w-0 transition-all duration-500"></div>
                </div>
                <div id="cron" class="text-5xl font-mono text-center mb-6">00:00</div>
                <button id="btn-cron" class="w-full bg-purple-600 p-4 font-bold rounded">INICIAR / PARAR</button>
                <button id="btn-back" class="w-full mt-4 text-slate-400">VOLVER</button>
            </div>`;
        let seg = 0, run = false, interval;
        document.getElementById('btn-cron').addEventListener('click', () => {
            const prog = document.getElementById('progress');
            if(!run) {
                run = true;
                interval = setInterval(() => {
                    seg++;
                    document.getElementById('cron').innerText = `00:${seg.toString().padStart(2,'0')}`;
                    prog.style.width = Math.min((seg/60)*100, 100) + "%";
                }, 1000);
            } else {
                clearInterval(interval);
                alert("Terminado en " + seg + "s. Tu apuesta: " + document.getElementById('apuesta').value);
            }
        });
        document.getElementById('btn-back').addEventListener('click', () => App.renderSub('estimacion'));
    },

    juegoHormiga: () => {
        container.innerHTML = `
            <div class="max-w-lg mx-auto mt-10 p-8 bg-slate-800 text-white rounded-xl">
                <h2 class="text-xl mb-4">Pasos Hormiga (Mini-tareas)</h2>
                <div id="lista-pasos" class="mb-4"></div>
                <input type="text" id="input-paso" class="w-full p-2 text-black mb-2" placeholder="Nuevo paso...">
                <button id="btn-add" class="w-full bg-purple-600 p-2 mb-4">AÑADIR PASO</button>
                <button id="btn-back" class="w-full text-slate-400">VOLVER</button>
            </div>`;
        document.getElementById('btn-add').addEventListener('click', () => {
            const val = document.getElementById('input-paso').value;
            if(val) {
                const div = document.createElement('div');
                div.className = "bg-slate-700 p-2 my-1 rounded flex justify-between";
                div.innerHTML = `<span>🐜 ${val}</span><input type="checkbox">`;
                document.getElementById('lista-pasos').appendChild(div);
                document.getElementById('input-paso').value = "";
            }
        });
        document.getElementById('btn-back').addEventListener('click', () => App.renderSub('estimacion'));
    },

    juegoLinea: () => {
        container.innerHTML = `<div class="p-8 text-white text-center"><h2>Línea del Tiempo (En desarrollo)</h2><button id="btn-back" class="bg-slate-600 p-2 mt-4">VOLVER</button></div>`;
        document.getElementById('btn-back').addEventListener('click', () => App.renderSub('externo'));
    },

    mostrarEscenarios: () => {
        container.innerHTML = `<div id="esc-cont" class="max-w-lg mx-auto p-8"></div>`;
        const cont = document.getElementById('esc-cont');
        Object.keys(escenarios).forEach(key => {
            const b = document.createElement('button');
            b.className = "w-full bg-blue-700 p-4 my-2 text-white font-bold";
            b.innerText = key.replace('_', ' ');
            b.addEventListener('click', () => alert("Iniciando: " + key));
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