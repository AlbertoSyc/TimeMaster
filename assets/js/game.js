export function calcularTiempoTotal(tareasOrdenadas) {
    let total = 0;
    for (let i = 0; i < tareasOrdenadas.length; i++) {
        total += tareasOrdenadas[i].tiempo;
        // Penalización si cambia de lugar
        if (i > 0 && tareasOrdenadas[i].lugar !== tareasOrdenadas[i-1].lugar) {
            total += 60; 
        }
    }
    return total;
}
