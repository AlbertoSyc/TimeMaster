import { escenarios } from './data.js';
import { GameLogic } from './game.js';

const container = document.getElementById('game-container');
let usuarioActual = "";

const App = {
    init: () => {
        container.innerHTML = `
            <div class="bg-slate-800 p-8 rounded-xl border-4 border-green-500 shadow-2xl text-center max-w-lg mx-auto mt-10">
                <h1 class="text-3xl font-bold mb-6 text-white">TIME MASTER ARCADE</h1>
                <input type="text" id="nombre" class="w-full p-3 mb-4 bg-slate-900 border-2 border-green-500 text-white" placeholder="Tu nombre">
                <button id="btn-jugar" class="w-full bg-green-500 text-slate-900 px-8 py-3 font-bold">ENTRAR</button>
            </div>`;
        document.getElementById('btn-jugar').onclick = () => {
            usuarioActual = document.getElementById('nombre').value;
            if (usuarioActual) App.menuCategorias();
        };
    },

    menuCategorias: () => {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 text-center">
                <h2 class="text-2xl font-bold mb-8 text-white">Hola ${usuarioActual}, elige entrenamiento:</h2>
                <div class="grid gap-4">
                    <button onclick="App.mostrarEscenarios()" class="bg-blue-600 p-6 text-white font-bold rounded">1. ESCENARIOS</button>
                    <button onclick="App.menuSubCategorias('externo')" class="bg-orange-600 p-6 text-white font-bold rounded">2. TIEMPO EXTERNO</button>
                    <button onclick="App.menuSubCategorias('estimacion')" class="bg-purple-600 p-6 text-white font-bold rounded">3. ESTIMACIÓN TEMPORAL</button>
                </div>
            </div>`;
    },

    menuSubCategorias: (tipo) => {
        container.innerHTML = `<div class="max-w-2xl mx-auto mt-10 text-center" id="submenu"></div>`;
        const sub = (tipo === 'externo') ? 
            [{n: "Time Timer", f: App.juegoTimeTimer}, {n: "Línea del Tiempo", f: App.juegoLinea}, {n: "Colores", f: App.juegoColores}] :
            [{n: "Mi Apuesta", f: App.juegoApuesta}, {n: "Pasos Hormiga", f: App.juegoHormiga}];
        
        const subCont = document.getElementById('submenu');
        sub.forEach(s => {
            const b = document.createElement('button');
            b.className = "block w-full bg-slate-700 m-2 p-6 text-white font-bold rounded hover:bg-slate-600";
            b.innerText = s.n; b.onclick = s.f; subCont.appendChild(b);
        });
        subCont.innerHTML += `<button onclick="App.menuCategorias()" class="bg-red-600 p-4 w-full mt-4 text-white font-bold">VOLVER</button>`;
    },

    // --- CORRECCIÓN JUEGOS ---
    juegoTimeTimer: () => {
        container.innerHTML = `
            <div class="max-w-lg mx-auto mt-10 text-center bg-slate-800 p-8 rounded-lg">
                <div class="w-48 h-48 mx-auto bg-white rounded-full relative overflow-hidden mb-6">
                    <div id="disco-rojo" class="absolute inset-0 bg-red-600 origin-center"></div>
                </div>
                <div id="timer-text" class="text-4xl text-white font-mono mb-4">05:00</div>
                <button onclick="App.startTimer(5)" class="bg-green-600 px-6 py-2 text-white font-bold rounded">INICIAR 5 MIN</button>
                <button onclick="App.menuSubCategorias('externo')" class="block mt-4 text-slate-400">VOLVER</button>
            </div>`;
    },
    
    startTimer: (mins) => {
        let seg = mins * 60;
        const disco = document.getElementById('disco-rojo');
        const txt = document.getElementById('timer-text');
        const interval = setInterval(() => {
            seg--;
            let deg = (seg / (mins * 60)) * 360;
            disco.style.clipPath = `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`;
            disco.style.transform = `rotate(${deg}deg)`;
            txt.innerText = `${Math.floor(seg/60)}:${(seg%60).toString().padStart(2,'0')}`;
            if (seg <= 0) clearInterval(interval);
        }, 1000);
    },

    juegoApuesta: () => {
        container.innerHTML = `
            <div class="max-w-md mx-auto mt-10 bg-slate-800 p-8 text-center text-white">
                <h2 class="text-xl font-bold mb-4">APUESTA DE TIEMPO</h2>
                <input type="number" id="apuesta" placeholder="Segundos" class="text-black p-2 w-full mb-4">
                <div id="cron" class="text-5xl mb-4 font-mono">00:00</div>
                <button id="btn-cron" class="bg-purple-600 p-4 w-full">INICIAR / PARAR</button>
                <div id="res-apuesta" class="mt-4"></div>
            </div>`;
        let seg = 0, running = false, interval;
        document.getElementById('btn-cron').onclick = () => {
            if(!running) {
                running = true;
                interval = setInterval(() => { seg++; document.getElementById('cron').innerText = `00:${seg.toString().padStart(2,'0')}`; }, 1000);
            } else {
                clearInterval(interval);
                const ap = document.getElementById('apuesta').value;
                document.getElementById('res-apuesta').innerHTML = `Tu apuesta: ${ap}s | Real: ${seg}s`;
            }
        };
    },

    mostrarEscenarios: () => {
        container.innerHTML = `<div class="max-w-lg mx-auto mt-10" id="lista-esc"></div>`;
        const list = document.getElementById('lista-esc');
        Object.keys(escenarios).forEach(key => {
            const b = document.createElement('button');
            b.className = "w-full bg-slate-700 p-4 mb-2 text-white font-bold";
            b.innerText = key;
            b.onclick = () => App.ejecutarJuego(key);
            list.appendChild(b);
        });
        list.innerHTML += `<button onclick="App.menuCategorias()" class="bg-red-600 p-4 w-full mt-4 text-white">VOLVER</button>`;
    },
    
    // NOTA: Asegúrate de mantener la lógica de ejecutarJuego y renderConfig que ya teníamos.
    ejecutarJuego: (key) => { /* ... lógica original aquí ... */ }
};

window.App = App; // EXPORTACIÓN GLOBAL PARA QUE LOS BOTONES HTML FUNCIONEN
App.init();