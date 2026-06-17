export const GameLogic = {
    calcularTiempo: (tareas) => {
        let total = 0;
        for (let i = 0; i < tareas.length; i++) {
            total += tareas[i].tiempo;
            if (i > 0 && tareas[i].lugar !== tareas[i-1].lugar) total += 60;
        }
        return total;
    },
    configurarDrag: () => {
        const cards = document.querySelectorAll('.task-card');
        const dropZone = document.getElementById('calendario');
        cards.forEach(card => card.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', e.target.id)));
        dropZone.addEventListener('dragover', (e) => e.preventDefault());
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const el = document.getElementById(id);
            if (el) dropZone.appendChild(el);
        });
    }
};
