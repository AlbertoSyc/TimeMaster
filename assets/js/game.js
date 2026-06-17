export function calcularTiempoFinal(tareas) {
    let total = 0;
    for (let i = 0; i < tareas.length; i++) {
        total += tareas[i].tiempo;
        if (i > 0 && tareas[i].lugar !== tareas[i-1].lugar) total += 60;
    }
    return total;
}

export function guardarPuntuacion(nombre, tiempo) {
    const ranking = JSON.parse(localStorage.getItem('rankingArcade') || '[]');
    ranking.push({ nombre, tiempo });
    ranking.sort((a, b) => a.tiempo - b.tiempo);
    localStorage.setItem('rankingArcade', JSON.stringify(ranking.slice(0, 5)));
}

export function configurarDragAndDrop() {
    const cards = document.querySelectorAll('.task-card');
    const dropZone = document.getElementById('calendario');
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', e.target.id));
    });
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        dropZone.appendChild(document.getElementById(id));
    });
}
