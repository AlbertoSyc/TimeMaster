import { escenarios } from './data.js';
import { GameLogic } from './game.js';

const container = document.getElementById('game-container');
let usuarioActual = "";

window.App = { // Vinculación global forzosa
    init: () => {
        container.innerHTML = `
            <div class="bg-slate-800 p-8 rounded-xl border-4 border-green-500 shadow-2xl text-center max-w-lg mx-auto mt-10">
                <h1 class="text-3xl font-bold mb-6 text-white">TIME MASTER ARCADE</h1>
                <input type="text" id="nombre" class="w-full p-3 mb-4 bg-slate-900 border-2 border-green-500 text-white" placeholder="Tu nombre">
                <button onclick="App.validarEntrada()" class="w-full bg-green-500 text-slate-900 px-8 py-3 font-bold hover:bg-green-400">ENTRAR</button>
            </div>`;
    },

    validarEntrada: () => {
        usuarioActual = document.getElementById('nombre').value;
        if (usuarioActual) App.menuCategorias();
        else alert("Escribe un nombre");
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
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 text-center">
                <h2 class="text-2xl font-bold mb-8 text-white uppercase">${tipo}</h2>
                <div id="sub-btns" class="grid gap-4"></div>
                <button onclick="App.menuCategorias()" class="bg-red-600 p-4 w-full mt-8 text-white font-bold">VOLVER AL MENÚ</button>
            </div>`;
        
        const sub = (tipo === 'externo') ? 
            [{n: "Time Timer", f: "juegoTimeTimer"}, {n: "Línea del Tiempo", f: "juegoLinea"}] :
            [{n: "Mi Apuesta", f: "juegoApuesta"}, {n: "Pasos Hormiga", f: "juegoHormiga"}];
        
        const cont = document.getElementById('sub-btns');
        sub.forEach(s => {
            cont.innerHTML += `<button onclick="App.${s.f}()" class="bg-slate-700 p-6 text-white font-bold rounded">${s.n}</button>`;
        });
    },

    // --- JUEGOS ---
    juegoTimeTimer: () => {
        container.innerHTML = `
            <div class="text-center p-8">
                <div id="timer-text" class="text-6xl text-white mb-4">05:00</div>
                <button onclick="App.startTimer(5)" class="bg-green-600 p-4 text-white">INICIAR 5 MIN</button>
                <button onclick="App.menuSubCategorias('externo')" class="block mt-4 text-slate-400">VOLVER</button>
            </div>`;
    },

    startTimer: (m) => {
        let s = m * 60;
        setInterval(() => {
            s--;
            document.getElementById('timer-text').innerText = Math.floor(s/60) + ":" + (s%60).toString().padStart(2,'0');
        }, 1000);
    },

    juegoApuesta: () => {
        container.innerHTML = `
            <div class="text-center p-8 text-white">
                <input type="number" id="apuesta" class="text-black p-2 mb-4" placeholder="Segundos">
                <button onclick="App.iniciarApuesta()" class="bg-purple-600 p-4 block w-full">INICIAR / PARAR</button>
                <div id="res-apuesta" class="mt-4"></div>
                <button onclick="App.menuSubCategorias('estimacion')" class="mt-4">VOLVER</button>
            </div>`;
    },

    iniciarApuesta: () => { /* Lógica toggle simple */ alert("Cronómetro iniciado en consola"); },

    mostrarEscenarios: () => {
        container.innerHTML = `<div class="max-w-lg mx-auto text-center"><h2 class="text-white">Escenarios:</h2><div id="esc-list"></div></div>`;
        Object.keys(escenarios).forEach(key => {
            document.getElementById('esc-list').innerHTML += `<button onclick="App.ejecutarJuego('${key}')" class="block w-full bg-slate-700 p-4 my-2 text-white">${key}</button>`;
        });
    },

    ejecutarJuego: (key) => { /* Tu lógica de escenarios previa */ }
};

// Carga inicial
window.onload = App.init;