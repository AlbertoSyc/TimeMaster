import { escenarios } from './data.js';
import { GameLogic } from './game.js';

const container = document.getElementById('game-container');
let usuarioActual = "";

const App = {
    init: () => {
        const ranking = JSON.parse(localStorage.getItem('rankingArcade') || '[]');
        container.innerHTML = `
            <div class="bg-slate-800 p-8 rounded-xl border-4 border-green-500 shadow-2xl text-center max-w-lg mx-auto mt-10">
                <h1 class="text-3xl font-bold mb-6 text-white text-center">TIME MASTER ARCADE</h1>
                <input type="text" id="nombre" class="w-full p-3 mb-4 bg-slate-900 border-2 border-green-500 text-white" placeholder="Tu nombre">
                <div class="flex flex-col gap-2">
                    <button id="btn-jugar" class="bg-green-500 text-slate-900 px-8 py-3 font-bold hover:bg-green-400">ENTRAR</button>
                    <button id="btn-config" class="bg-purple-600 text-white px-8 py-3 font-bold">AJUSTES</button>
                </div>
                <div class="mt-6 text-green-300 border-t border-slate-700 pt-4">
                    <h3 class="text-xl mb-2 italic">Récords</h3>
                    ${ranking.length > 0 ? ranking.map(r => `<p>${r.nombre}: ${GameLogic.formatearTiempo(r.tiempo)}</p>`).join('') : '<p>Sin récords</p>'}
                </div>
            </div>`;
        document.getElementById('btn-jugar').onclick = () => {
            const n = document.getElementById('nombre').value;
            if (n) { usuarioActual = n; App.menuCategorias(); }
        };
        document.getElementById('btn-config').onclick = App.renderConfig;
    },

    menuCategorias: () => {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 text-center">
                <h2 class="text-3xl font-bold mb-8 text-white uppercase">Hola ${usuarioActual}, elige entrenamiento:</h2>
                <div class="grid grid-cols-1 gap-4">
                    <button id="cat-escenarios" class="bg-blue-600 p-8 rounded-xl text-white font-bold text-xl hover:scale-105 transition">1. LOS ESCENARIOS (ORDENAR TAREAS)</button>
                    <button id="cat-externo" class="bg-orange-600 p-8 rounded-xl text-white font-bold text-xl hover:scale-105 transition">2. TIEMPO EXTERNO (VISUALIZACIÓN)</button>
                    <button id="cat-estimacion" class="bg-purple-600 p-8 rounded-xl text-white font-bold text-xl hover:scale-105 transition">3. ESTIMACIÓN TEMPORAL (PERCEPCIÓN)</button>
                    <button onclick="location.reload()" class="bg-red-600 p-4 text-white font-bold mt-4">SALIR</button>
                </div>
            </div>`;
        document.getElementById('cat-escenarios').onclick = () => App.mostrarEscenarios(usuarioActual);
        document.getElementById('cat-externo').onclick = () => App.menuSubCategorias('externo');
        document.getElementById('cat-estimacion').onclick = () => App.menuSubCategorias('estimacion');
    },

    menuSubCategorias: (tipo) => {
        let titulo = tipo === 'externo' ? "TIEMPO EXTERNO" : "ESTIMACIÓN TEMPORAL";
        let color = tipo === 'externo' ? "bg-orange-800" : "bg-purple-800";
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 text-center">
                <h2 class="text-3xl font-bold mb-8 text-white uppercase">${titulo}</h2>
                <div class="grid grid-cols-1 gap-4" id="submenu-btns"></div>
                <button onclick="App.menuCategorias()" class="w-full bg-slate-600 p-4 text-white font-bold mt-4 italic">VOLVER ATRÁS</button>
            </div>`;
        
        const menu = document.getElementById('submenu-btns');
        if (tipo === 'externo') {
            const sub = [
                { n: "Time Timer (Disco Rojo)", f: () => App.juegoTimeTimer() },
                { n: "La Línea del Tiempo", f: () => App.juegoLinea() },
                { n: "Códigos de Colores", f: () => App.juegoColores() }
            ];
            sub.forEach(s => {
                const b = document.createElement('button');
                b.className = `${color} p-6 text-white font-bold rounded-lg border-2 border-orange-400`;
                b.innerText = s.n; b.onclick = s.f; menu.appendChild(b);
            });
        } else {
            const sub = [
                { n: "Mi Apuesta de Tiempo", f: () => App.juegoApuesta() },
                { n: "Pasos de Hormiga", f: () => App.juegoHormiga() }
            ];
            sub.forEach(s => {
                const b = document.createElement('button');
                b.className = `${color} p-6 text-white font-bold rounded-lg border-2 border-purple-400`;
                b.innerText = s.n; b.onclick = s.f; menu.appendChild(b);
            });
        }
    },

    // --- DESARROLLO DE LOS 5 NUEVOS JUEGOS ---

    // 1.1 TIME TIMER (Disco Rojo)
    juegoTimeTimer: () => {
        container.innerHTML = `
            <div class="max-w-lg mx-auto mt-10 text-center bg-slate-800 p-8 rounded-full border-8 border-slate-700">
                <h3 class="text-white mb-4 italic">Visualiza el paso del tiempo</h3>
                <div class="relative w-64 h-64 mx-auto bg-white rounded-full overflow-hidden border-4 border-slate-400">
                    <div id="disco-rojo" class="absolute inset-0 bg-red-600 origin-center transition-all linear" style="clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-bold text-3xl text-slate-800 z-10" id="timer-text">05:00</div>
                </div>
                <div class="flex gap-2 mt-8 justify-center">
                    <button onclick="App.startTimer(1)" class="bg-green-600 p-3 text-white">1 MIN</button>
                    <button onclick="App.startTimer(5)" class="bg-green-600 p-3 text-white">5 MIN</button>
                    <button onclick="App.startTimer(10)" class="bg-green-600 p-3 text-white">10 MIN</button>
                </div>
                <button onclick="App.menuSubCategorias('externo')" class="mt-6 text-slate-400">VOLVER</button>
            </div>`;
    },
    startTimer: (mins) => {
        let total = mins * 60;
        let seg = total;
        const disco = document.getElementById('disco-rojo');
        const txt = document.getElementById('timer-text');
        const interval = setInterval(() => {
            seg--;
            let perc = (seg / total) * 360;
            disco.style.transform = `rotate(${360 - perc}deg)`; // Simula el disco desapareciendo
            txt.innerText = `${Math.floor(seg/60).toString().padStart(2,'0')}:${(seg%60).toString().padStart(2,'0')}`;
            if (seg <= 0) { clearInterval(interval); alert("¡Tiempo terminado!"); }
        }, 1000);
    },

    // 1.2 LA LÍNEA DEL TIEMPO
    juegoLinea: () => {
        container.innerHTML = `
            <div class="max-w-3xl mx-auto mt-10 bg-slate-800 p-6 rounded-xl border-l-8 border-orange-500">
                <h2 class="text-2xl text-white font-bold mb-4">MI LÍNEA DE TAREAS</h2>
                <div class="flex items-center gap-4 mb-8 overflow-x-auto p-4 border-b border-slate-700" id="linea-container">
                    <div class="text-slate-500 italic text-sm">Añade pasos para empezar...</div>
                </div>
                <div class="flex gap-2">
                    <input type="text" id="paso-nombre" class="flex-1 p-2 bg-slate-900 border border-orange-500 text-white" placeholder="Ej: Sacar libros">
                    <input type="number" id="paso-tiempo" class="w-24 p-2 bg-slate-900 border border-orange-500 text-white" placeholder="Seg">
                    <button id="add-paso" class="bg-orange-600 px-4 text-white font-bold">+</button>
                </div>
                <button onclick="App.menuSubCategorias('externo')" class="mt-10 block w-full bg-slate-700 p-2 text-white">VOLVER</button>
            </div>`;
        
        document.getElementById('add-paso').onclick = () => {
            const n = document.getElementById('paso-nombre').value;
            const t = document.getElementById('paso-tiempo').value;
            if (n && t) {
                const cont = document.getElementById('linea-container');
                if (cont.innerText.includes("Añade")) cont.innerHTML = "";
                const step = document.createElement('div');
                step.className = "flex-shrink-0 bg-white p-4 rounded-lg text-slate-800 border-t-4 border-orange-500 relative cursor-pointer hover:bg-orange-100";
                step.innerHTML = `<div class="font-bold">${n}</div><div class="text-xs">${t}s</div>`;
                step.onclick = () => step.classList.toggle('opacity-25'); // Marcar con una cruz (visual)
                cont.appendChild(step);
                cont.appendChild(document.createElement('div')).innerText = "→";
            }
        };
    },

    // 1.3 CÓDIGOS DE COLORES
    juegoColores: () => {
        container.innerHTML = `
            <div class="max-w-3xl mx-auto mt-10">
                <h2 class="text-white font-bold mb-4">CLASIFICA POR COLORES (LUGAR)</h2>
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div id="zone-red" class="bg-red-900/50 p-4 rounded-xl border-2 border-red-500 min-h-[150px]"><h3 class="text-red-400 font-bold">ESTUDIO (Rojo)</h3></div>
                    <div id="zone-blue" class="bg-blue-900/50 p-4 rounded-xl border-2 border-blue-500 min-h-[150px]"><h3 class="text-blue-400 font-bold">HIGIENE (Azul)</h3></div>
                    <div id="zone-green" class="bg-green-900/50 p-4 rounded-xl border-2 border-green-500 min-h-[150px]"><h3 class="text-green-400 font-bold">JUEGO (Verde)</h3></div>
                </div>
                <div id="tareas-colores" class="bg-slate-800 p-4 rounded-xl flex flex-wrap gap-2">
                    <div draggable="true" class="item-color bg-slate-600 p-3 rounded" data-color="red">Hacer deberes</div>
                    <div draggable="true" class="item-color bg-slate-600 p-3 rounded" data-color="blue">Ducharme</div>
                    <div draggable="true" class="item-color bg-slate-600 p-3 rounded" data-color="green">Lego</div>
                    <div draggable="true" class="item-color bg-slate-600 p-3 rounded" data-color="blue">Dientes</div>
                </div>
                <button onclick="App.menuSubCategorias('externo')" class="mt-8 block w-full bg-slate-700 p-2 text-white">VOLVER</button>
            </div>`;
        
        // Lógica simple de drag and drop para colores
        const items = document.querySelectorAll('.item-color');
        items.forEach(it => it.addEventListener('dragstart', (e) => e.dataTransfer.setData('targetColor', it.dataset.color)));
        const zones = ['red','blue','green'].map(c => document.getElementById('zone-'+c));
        zones.forEach(z => {
            z.addEventListener('dragover', (e) => e.preventDefault());
            z.addEventListener('drop', (e) => {
                const color = e.dataTransfer.getData('targetColor');
                if (z.id.includes(color)) z.innerHTML += `<div class='bg-slate-700 p-1 mt-1 text-xs'>✓ Correcto</div>`;
            });
        });
    },

    // 2.1 MI APUESTA DE TIEMPO
    juegoApuesta: () => {
        container.innerHTML = `
            <div class="max-w-xl mx-auto mt-10 bg-slate-800 p-8 rounded-2xl border-4 border-purple-500">
                <h2 class="text-2xl text-white font-bold mb-4 uppercase">¿Cuánto tardarás?</h2>
                <div class="mb-6">
                    <p class="text-slate-400 mb-2">Tarea: Recoger 10 juguetes</p>
                    <input type="number" id="apuesta" class="w-full p-4 bg-black text-purple-400 text-3xl text-center border-2 border-purple-600" placeholder="APUESTA (SEG)">
                </div>
                <div id="cronometro" class="text-5xl font-mono text-white mb-6 text-center">00:00</div>
                <button id="btn-cron" class="w-full bg-purple-600 p-4 text-white font-bold text-xl">EMPEZAR CRONÓMETRO</button>
                <div id="apuesta-resultado" class="mt-6 hidden p-4 bg-slate-900 rounded-lg"></div>
                <button onclick="App.menuSubCategorias('estimacion')" class="mt-8 text-slate-500 w-full">VOLVER</button>
            </div>`;
        
        let seg = 0; let running = false; let interval;
        const btn = document.getElementById('btn-cron');
        btn.onclick = () => {
            if (!running) {
                running = true; btn.innerText = "¡YA HE TERMINADO!";
                interval = setInterval(() => { seg++; document.getElementById('cronometro').innerText = GameLogic.formatearTiempo(seg); }, 1000);
            } else {
                clearInterval(interval);
                const apuesta = document.getElementById('apuesta').value;
                const res = document.getElementById('apuesta-resultado');
                res.classList.remove('hidden');
                let dif = Math.abs(apuesta - seg);
                res.innerHTML = `
                    <p class="text-xl">Tu apuesta: <b>${apuesta}s</b></p>
                    <p class="text-xl">Tiempo real: <b>${seg}s</b></p>
                    <p class="mt-2 text-yellow-400 font-bold italic">Diferencia: ${dif} segundos. ¡Buen intento!</p>`;
            }
        };
    },

    // 2.2 PASOS DE HORMIGA
    juegoHormiga: () => {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto mt-10 bg-slate-800 p-6 rounded-xl">
                <h2 class="text-xl text-white font-bold mb-2 uppercase">LA TAREA GIGANTE: Limpiar el cuarto</h2>
                <p class="text-slate-400 text-sm mb-6 italic">Divídela en pasos de menos de 5 minutos (300 seg)</p>
                <div id="hormiga-list" class="space-y-2 mb-6"></div>
                <div class="flex gap-2">
                    <input type="text" id="mini-n" class="flex-1 p-2 bg-slate-900 text-white border border-purple-500" placeholder="Mini tarea...">
                    <input type="number" id="mini-t" class="w-24 p-2 bg-slate-900 text-white border border-purple-500" placeholder="Seg">
                    <button id="btn-mini" class="bg-purple-600 px-4 text-white font-bold">+</button>
                </div>
                <button onclick="App.menuSubCategorias('estimacion')" class="mt-10 block w-full bg-slate-700 p-2 text-white">VOLVER</button>
            </div>`;
        
        document.getElementById('btn-mini').onclick = () => {
            const n = document.getElementById('mini-n').value;
            const t = document.getElementById('mini-t').value;
            if (n && t) {
                const list = document.getElementById('hormiga-list');
                const row = document.createElement('div');
                row.className = `flex justify-between p-3 rounded ${t > 300 ? 'bg-red-900/50' : 'bg-slate-700'}`;
                row.innerHTML = `<span>🐜 ${n}</span> <span class="font-bold">${t}s</span>`;
                if (t > 300) row.innerHTML += ` <span class="text-[10px] text-red-400 block w-full">¡Demasiado larga!</span>`;
                list.appendChild(row);
            }
        };
    },

    // --- REUTILIZACIÓN DE LÓGICA ANTERIOR (ORDENAR TAREAS) ---
    mostrarEscenarios: (nombre) => {
        container.innerHTML = `<div class="bg-slate-800 p-6 rounded-xl text-center max-w-lg mx-auto mt-10"><h2 class="text-2xl mb-4 text-white italic underline">Elige una misión:</h2></div>`;
        Object.keys(escenarios).forEach(key => {
            const btn = document.createElement('button');
            btn.className = "block w-full bg-slate-700 m-2 p-6 text-white hover:bg-green-600 font-bold uppercase transition";
            btn.innerText = key.replace('_', ' ');
            btn.onclick = () => App.ejecutarJuego(nombre, key);
            container.querySelector('div').appendChild(btn);
        });
        const backBtn = document.createElement('button');
        backBtn.className = "bg-red-600 p-4 w-full mt-4 text-white font-bold";
        backBtn.innerText = "VOLVER AL MENÚ";
        backBtn.onclick = App.menuCategorias;
        container.querySelector('div').appendChild(backBtn);
    },

    ejecutarJuego: (nombre, key) => {
        const tareas = escenarios[key];
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
                <div id="lista-tareas" class="bg-slate-800 p-4 border border-slate-600 rounded"></div>
                <div id="calendario" class="bg-slate-800 p-4 border-2 border-dashed border-green-500 rounded"></div>
            </div>
            <div class="flex gap-2 max-w-2xl mx-auto mt-4">
                <button id="btn-finalizar" class="flex-1 bg-green-600 p-4 font-bold text-slate-900">TERMINAR</button>
                <button id="btn-reiniciar" class="flex-1 bg-yellow-600 p-4 font-bold text-slate-900">LIMPIAR</button>
                <button id="btn-volver" class="flex-1 bg-red-600 p-4 font-bold text-white">VOLVER</button>
            </div>
            <div id="resumen-detalle" class="max-w-2xl mx-auto mt-6 bg-slate-800 p-4 text-white border-t-2 border-green-500 rounded-b shadow-xl"></div>`;
        
        tareas.forEach((t, i) => {
            const div = document.createElement('div');
            div.className = 'task-card bg-purple-700 p-4 m-2 text-white shadow-lg flex justify-between cursor-grab active:cursor-grabbing';
            div.id = 'task-' + i; 
            div.innerHTML = `<span>${t.nombre}</span> <span class="font-bold opacity-75">(${t.lugar.charAt(0).toUpperCase()})</span>`;
            div.draggable = true;
            document.getElementById('lista-tareas').appendChild(div);
        });

        GameLogic.configurarDrag();
        document.getElementById('btn-finalizar').onclick = () => {
            const tareasOrdenadas = Array.from(document.getElementById('calendario').children).map(el => tareas[parseInt(el.id.split('-')[1])]);
            if(tareasOrdenadas.length === 0) return alert("¡Pon tareas en el calendario!");
            let total = 0;
            let html = `<h3 class='text-green-400 mb-2 font-bold'>¿Qué ha pasado con tu tiempo?</h3>`;
            tareasOrdenadas.forEach((t, i) => {
                let pen = (i > 0 && t.lugar !== tareasOrdenadas[i-1].lugar) ? 60 : 0;
                total += t.tiempo + pen;
                html += `<p class='text-sm border-b border-slate-700 py-1'>${t.nombre}: ${t.tiempo}s ${pen > 0 ? `<span class='text-yellow-400'>+60s por moverte de ${tareasOrdenadas[i-1].lugar} a ${t.lugar}</span>` : ''}</p>`;
            });
            GameLogic.guardarPuntuacion(nombre, total);
            document.getElementById('resumen-detalle').innerHTML = html + `<p class='font-bold mt-4 text-2xl text-center bg-green-500 text-slate-900 py-2 rounded'>TOTAL: ${GameLogic.formatearTiempo(total)}</p>`;
        };
        document.getElementById('btn-reiniciar').onclick = () => App.ejecutarJuego(nombre, key);
        document.getElementById('btn-volver').onclick = () => App.mostrarEscenarios(nombre);
    },

    renderConfig: () => {
        container.innerHTML = `
            <div class="bg-slate-800 p-6 rounded-xl max-w-lg mx-auto mt-10 border-4 border-purple-500">
                <h2 class="text-white mb-2 font-bold uppercase">Editor de Misiones</h2>
                <textarea id="json-input" class="w-full h-60 bg-black text-green-400 p-4 font-mono text-xs">${JSON.stringify(escenarios, null, 2)}</textarea>
                <div class="flex flex-col gap-2 mt-4">
                    <button id="btn-save" class="bg-blue-600 p-3 text-white font-bold">GUARDAR CAMBIOS</button>
                    <button id="btn-borrar" class="bg-red-600 p-3 text-white font-bold">RESETEAR RÉCORDS</button>
                    <button id="btn-back" class="bg-slate-600 p-3 text-white">VOLVER</button>
                </div>
            </div>`;
        document.getElementById('btn-save').onclick = () => {
            try {
                let nuevos = JSON.parse(document.getElementById('json-input').value);
                Object.keys(escenarios).forEach(key => delete escenarios[key]);
                Object.assign(escenarios, nuevos);
                alert("Guardado!"); App.init();
            } catch(e) { alert("Error en el formato"); }
        };
        document.getElementById('btn-borrar').onclick = () => { if(confirm("¿Borrar todo?")) { localStorage.removeItem('rankingArcade'); App.init(); } };
        document.getElementById('btn-back').onclick = App.init;
    }
};

App.init();
