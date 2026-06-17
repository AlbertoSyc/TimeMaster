import { escenarios as dataInicial } from './data.js';
import { GameLogic } from './game.js';

// Usamos un objeto mutable para los escenarios
let escenarios = { ...dataInicial };
const container = document.getElementById('game-container');

const App = {
    init: () => {
        const ranking = JSON.parse(localStorage.getItem('rankingArcade') || '[]');
        container.innerHTML = `
            <div class="bg-slate-800 p-8 rounded-xl border-4 border-green-500 shadow-2xl text-center max-w-lg mx-auto mt-10">
                <input type="text" id="nombre" class="w-full p-3 mb-4 bg-slate-900 border-2 border-green-500 text-white" placeholder="Tu nombre">
                <div class="flex flex-col gap-2">
                    <button id="btn-jugar" class="bg-green-500 text-slate-900 px-8 py-3 font-bold">JUGAR</button>
                    <button id="btn-config" class="bg-purple-600 text-white px-8 py-3 font-bold">MODIFICAR ESCENARIOS</button>
                </div>
            </div>`;
        document.getElementById('btn-jugar').onclick = () => {
            const nombre = document.getElementById('nombre').value;
            if (nombre) App.mostrarEscenarios(nombre);
        };
        document.getElementById('btn-config').onclick = App.renderConfig;
    },

    renderConfig: () => {
        container.innerHTML = `
            <div class="bg-slate-800 p-6 rounded-xl max-w-lg mx-auto mt-10">
                <textarea id="json-input" class="w-full h-60 bg-black text-green-400 p-4 font-mono text-xs">${JSON.stringify(escenarios, null, 2)}</textarea>
                <div class="flex flex-col gap-2 mt-4">
                    <button id="btn-save" class="bg-blue-600 p-3 text-white">GUARDAR ESCENARIOS</button>
                    <button id="btn-back" class="bg-slate-600 p-3 text-white">VOLVER</button>
                </div>
            </div>`;
        document.getElementById('btn-save').onclick = () => {
            try {
                escenarios = JSON.parse(document.getElementById('json-input').value);
                alert("Escenarios actualizados dinámicamente");
                App.init();
            } catch(e) { alert("Error en el formato JSON"); }
        };
        document.getElementById('btn-back').onclick = App.init;
    },

    mostrarEscenarios: (nombre) => {
        container.innerHTML = `<div class="bg-slate-800 p-6 rounded-xl text-center max-w-lg mx-auto mt-10"><h2 class="text-2xl mb-4 text-white">Elige Misión</h2></div>`;
        
        // Generación dinámica de botones basada en las llaves del objeto 'escenarios'
        Object.keys(escenarios).forEach(key => {
            const btn = document.createElement('button');
            btn.className = "block w-full bg-slate-700 m-2 p-6 text-white hover:bg-green-600 font-bold uppercase";
            btn.innerText = key.replace('_', ' ');
            btn.onclick = () => App.ejecutarJuego(nombre, key);
            container.querySelector('div').appendChild(btn);
        });
        
        const backBtn = document.createElement('button');
        backBtn.className = "bg-red-600 p-4 w-full mt-4 text-white font-bold";
        backBtn.innerText = "VOLVER AL INICIO";
        backBtn.onclick = App.init;
        container.querySelector('div').appendChild(backBtn);
    },

    ejecutarJuego: (nombre, key) => {
        const tareas = escenarios[key];
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
                <div id="lista-tareas" class="bg-slate-800 p-4 border border-slate-600"></div>
                <div id="calendario" class="bg-slate-800 p-4 border-2 border-dashed border-green-500"></div>
            </div>
            <div class="flex gap-2 max-w-2xl mx-auto mt-4">
                <button id="btn-finalizar" class="flex-1 bg-green-600 p-4 font-bold">TERMINAR</button>
                <button id="btn-reiniciar" class="flex-1 bg-yellow-600 p-4 font-bold">REINICIAR</button>
                <button id="btn-volver" class="flex-1 bg-red-600 p-4 font-bold">VOLVER</button>
            </div>
            <div id="resumen-detalle" class="max-w-2xl mx-auto mt-6 bg-slate-800 p-4 text-white"></div>`;
        
        tareas.forEach((t, i) => {
            const div = document.createElement('div');
            div.className = 'task-card bg-purple-700 p-4 m-2 text-white shadow-lg flex justify-between';
            div.id = 'task-' + i; 
            div.innerHTML = `<span>${t.nombre}</span> <span class="font-bold opacity-75">(${t.lugar.charAt(0).toUpperCase()})</span>`;
            div.draggable = true;
            document.getElementById('lista-tareas').appendChild(div);
        });

        GameLogic.configurarDrag();
        document.getElementById('btn-finalizar').onclick = () => {
            const calendario = document.getElementById('calendario');
            const tareasOrdenadas = Array.from(calendario.children).map(el => tareas[parseInt(el.id.split('-')[1])]);
            let total = 0;
            let html = `<h3 class='text-green-400 mb-2 font-bold'>Resumen:</h3>`;
            tareasOrdenadas.forEach((t, i) => {
                let pen = (i > 0 && t.lugar !== tareasOrdenadas[i-1].lugar) ? 60 : 0;
                total += t.tiempo + pen;
                html += `<p class='text-sm'>${t.nombre}: ${t.tiempo}s ${pen > 0 ? `<span class='text-yellow-400'>+60s (cambio ${tareasOrdenadas[i-1].lugar[0].toUpperCase()}→${t.lugar[0].toUpperCase()})</span>` : ''}</p>`;
            });
            document.getElementById('resumen-detalle').innerHTML = html + `<p class='font-bold mt-2 text-lg'>TOTAL: ${GameLogic.formatearTiempo(total)}</p>`;
        };
        document.getElementById('btn-reiniciar').onclick = () => App.ejecutarJuego(nombre, key);
        document.getElementById('btn-volver').onclick = () => App.mostrarEscenarios(nombre);
    }
};

App.init();
