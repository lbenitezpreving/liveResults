// Constantes y variables globales para F1
const SPORT_ITEMS = document.querySelectorAll('.sport-item');
const SPORT_SECTIONS = document.querySelectorAll('.sport-section');
const F1_RACE_TABS = document.querySelectorAll('#f1-section nav li');
const TRACK_SVG = document.getElementById('track-svg');
const TRACK_PATH = document.getElementById('track-path');
const RACE_STANDINGS_BODY = document.getElementById('race-standings-body');
const TELEMETRY_CHART_CTX = document.getElementById('telemetry-chart');

// Variables para la simulación
let raceInterval;
let telemetryChart;
let currentDriverFocus = 'Hamilton';
let currentLap = 32;
let totalLaps = 66;
let raceStarted = true;
let driverPositions = [];
let carElements = [];

// Datos de ejemplo para la carrera
const SAMPLE_RACE_DATA = {
    name: 'Gran Premio de España',
    circuit: {
        name: 'Circuit de Barcelona-Catalunya',
        location: 'Barcelona, España',
        length: '4.675 km',
        laps: 66,
        layout: 'https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png.transform/7col/image.png'
    },
    startTime: '2023-06-04T14:00:00Z',
    drivers: [
        {
            number: 1,
            code: 'VER',
            name: 'Max Verstappen',
            team: 'Red Bull Racing',
            teamColor: '#0600ef',
            position: 1,
            timeGap: 'Leader',
            lastLap: '1:18.249',
            bestLap: '1:18.249',
            pitStops: 1,
            status: 'running',
            progress: 0.75, // Posición en la pista (0-1)
            telemetry: {
                speed: [320, 310, 290, 180, 220, 330, 310, 290, 180, 220, 330, 320],
                throttle: [100, 90, 70, 20, 50, 100, 90, 70, 20, 50, 100, 100],
                brake: [0, 10, 30, 80, 50, 0, 10, 30, 80, 50, 0, 0]
            }
        },
        {
            number: 16,
            code: 'LEC',
            name: 'Charles Leclerc',
            team: 'Ferrari',
            teamColor: '#ff1801',
            position: 2,
            timeGap: '+3.245s',
            lastLap: '1:18.512',
            bestLap: '1:18.402',
            pitStops: 1,
            status: 'running',
            progress: 0.72, // Posición en la pista (0-1)
            telemetry: {
                speed: [315, 305, 285, 175, 215, 325, 305, 285, 175, 215, 325, 315],
                throttle: [100, 85, 65, 15, 45, 100, 85, 65, 15, 45, 100, 100],
                brake: [0, 15, 35, 85, 55, 0, 15, 35, 85, 55, 0, 0]
            }
        },
        {
            number: 44,
            code: 'HAM',
            name: 'Lewis Hamilton',
            team: 'Mercedes',
            teamColor: '#00d2be',
            position: 3,
            timeGap: '+5.342s',
            lastLap: '1:19.342',
            bestLap: '1:18.756',
            pitStops: 1,
            status: 'running',
            progress: 0.69, // Posición en la pista (0-1)
            telemetry: {
                speed: [310, 300, 280, 170, 210, 320, 300, 280, 170, 210, 320, 310],
                throttle: [100, 80, 60, 10, 40, 100, 80, 60, 10, 40, 100, 100],
                brake: [0, 20, 40, 90, 60, 0, 20, 40, 90, 60, 0, 0]
            }
        },
        {
            number: 11,
            code: 'PER',
            name: 'Sergio Pérez',
            team: 'Red Bull Racing',
            teamColor: '#0600ef',
            position: 4,
            timeGap: '+8.127s',
            lastLap: '1:19.127',
            bestLap: '1:18.901',
            pitStops: 1,
            status: 'running',
            progress: 0.66, // Posición en la pista (0-1)
            telemetry: {
                speed: [312, 302, 282, 172, 212, 322, 302, 282, 172, 212, 322, 312],
                throttle: [100, 82, 62, 12, 42, 100, 82, 62, 12, 42, 100, 100],
                brake: [0, 18, 38, 88, 58, 0, 18, 38, 88, 58, 0, 0]
            }
        },
        {
            number: 55,
            code: 'SAI',
            name: 'Carlos Sainz',
            team: 'Ferrari',
            teamColor: '#ff1801',
            position: 5,
            timeGap: '+10.982s',
            lastLap: '1:19.342',
            bestLap: '1:19.012',
            pitStops: 1,
            status: 'running',
            progress: 0.63, // Posición en la pista (0-1)
            telemetry: {
                speed: [318, 308, 288, 178, 218, 328, 308, 288, 178, 218, 328, 318],
                throttle: [100, 88, 68, 18, 48, 100, 88, 68, 18, 48, 100, 100],
                brake: [0, 12, 32, 82, 52, 0, 12, 32, 82, 52, 0, 0]
            }
        },
        {
            number: 63,
            code: 'RUS',
            name: 'George Russell',
            team: 'Mercedes',
            teamColor: '#00d2be',
            position: 6,
            timeGap: '+12.543s',
            lastLap: '1:19.543',
            bestLap: '1:19.123',
            pitStops: 1,
            status: 'running',
            progress: 0.60, // Posición en la pista (0-1)
            telemetry: {
                speed: [308, 298, 278, 168, 208, 318, 298, 278, 168, 208, 318, 308],
                throttle: [100, 78, 58, 8, 38, 100, 78, 58, 8, 38, 100, 100],
                brake: [0, 22, 42, 92, 62, 0, 22, 42, 92, 62, 0, 0]
            }
        },
        {
            number: 4,
            code: 'NOR',
            name: 'Lando Norris',
            team: 'McLaren',
            teamColor: '#ff8700',
            position: 7,
            timeGap: '+15.876s',
            lastLap: '1:19.876',
            bestLap: '1:19.345',
            pitStops: 1,
            status: 'running',
            progress: 0.57, // Posición en la pista (0-1)
            telemetry: {
                speed: [305, 295, 275, 165, 205, 315, 295, 275, 165, 205, 315, 305],
                throttle: [100, 75, 55, 5, 35, 100, 75, 55, 5, 35, 100, 100],
                brake: [0, 25, 45, 95, 65, 0, 25, 45, 95, 65, 0, 0]
            }
        },
        {
            number: 14,
            code: 'ALO',
            name: 'Fernando Alonso',
            team: 'Aston Martin',
            teamColor: '#006f62',
            position: 8,
            timeGap: '+18.432s',
            lastLap: '1:19.932',
            bestLap: '1:19.567',
            pitStops: 1,
            status: 'running',
            progress: 0.54, // Posición en la pista (0-1)
            telemetry: {
                speed: [302, 292, 272, 162, 202, 312, 292, 272, 162, 202, 312, 302],
                throttle: [100, 72, 52, 2, 32, 100, 72, 52, 2, 32, 100, 100],
                brake: [0, 28, 48, 98, 68, 0, 28, 48, 98, 68, 0, 0]
            }
        }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar listeners de eventos
    setupEventListeners();
    
    // Inicializar la visualización de F1
    initializeF1Visualization();
});

// Configuración de listeners de eventos
function setupEventListeners() {
    // Cambio entre deportes
    SPORT_ITEMS.forEach(item => {
        item.addEventListener('click', () => {
            const sport = item.getAttribute('data-sport');
            
            // Actualizar clases activas
            SPORT_ITEMS.forEach(sportItem => sportItem.classList.remove('active'));
            item.classList.add('active');
            
            // Mostrar la sección correspondiente
            SPORT_SECTIONS.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sport}-section`) {
                    section.classList.add('active');
                }
            });
            
            // Si se selecciona F1, iniciar la simulación
            if (sport === 'f1' && raceStarted) {
                startRaceSimulation();
            } else {
                stopRaceSimulation();
            }
        });
    });
    
    // Cambio entre pestañas de F1
    F1_RACE_TABS.forEach(tab => {
        tab.addEventListener('click', () => {
            const raceView = tab.getAttribute('data-race');
            
            // Actualizar clases activas
            F1_RACE_TABS.forEach(raceTab => raceTab.classList.remove('active'));
            tab.classList.add('active');
            
            // Aquí se podría implementar la lógica para cambiar entre vistas
            // (carrera actual, próximas, resultados, clasificación)
        });
    });
    
    // Evento para seleccionar un piloto al hacer clic en la tabla
    RACE_STANDINGS_BODY.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (row) {
            const driverCode = row.getAttribute('data-driver');
            if (driverCode) {
                focusOnDriver(driverCode);
            }
        }
    });
}

// Inicializar la visualización de F1
function initializeF1Visualization() {
    // Cargar datos de la carrera
    loadRaceData(SAMPLE_RACE_DATA);
    
    // Inicializar la visualización del circuito
    initializeTrackVisualization();
    
    // Inicializar la tabla de posiciones
    updateRaceStandings();
    
    // Inicializar la telemetría
    initializeTelemetryChart();
    
    // Enfocar en un piloto por defecto
    focusOnDriver('HAM');
}

// Cargar datos de la carrera
function loadRaceData(raceData) {
    // Actualizar información de la carrera
    document.getElementById('current-race-name').textContent = raceData.name;
    document.getElementById('circuit-name').textContent = raceData.circuit.name;
    document.getElementById('circuit-length').textContent = raceData.circuit.length;
    document.getElementById('circuit-layout').src = raceData.circuit.layout;
    document.getElementById('current-lap').textContent = currentLap;
    document.getElementById('total-laps').textContent = raceData.circuit.laps;
    
    // Guardar los datos de los pilotos
    driverPositions = [...raceData.drivers];
}

// Inicializar la visualización del circuito
function initializeTrackVisualization() {
    // Obtener la longitud total del path
    const pathLength = TRACK_PATH.getTotalLength();
    
    // Crear elementos para cada coche
    driverPositions.forEach(driver => {
        // Calcular la posición en el path
        const point = TRACK_PATH.getPointAtLength(pathLength * driver.progress);
        
        // Crear elemento del coche
        const car = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        car.setAttribute('cx', point.x);
        car.setAttribute('cy', point.y);
        car.setAttribute('r', '8');
        car.setAttribute('fill', driver.teamColor);
        car.setAttribute('stroke', '#fff');
        car.setAttribute('stroke-width', '2');
        car.setAttribute('data-driver', driver.code);
        car.classList.add('car');
        
        // Añadir número del coche
        const carNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        carNumber.setAttribute('x', point.x);
        carNumber.setAttribute('y', point.y + 1);
        carNumber.setAttribute('text-anchor', 'middle');
        carNumber.setAttribute('dominant-baseline', 'middle');
        carNumber.setAttribute('fill', '#fff');
        carNumber.setAttribute('font-size', '8px');
        carNumber.setAttribute('font-weight', 'bold');
        carNumber.textContent = driver.position;
        
        // Añadir elementos al SVG
        TRACK_SVG.appendChild(car);
        TRACK_SVG.appendChild(carNumber);
        
        // Guardar referencia al elemento del coche
        carElements.push({ car, carNumber, driver });
    });
}

// Actualizar la tabla de posiciones
function updateRaceStandings() {
    // Limpiar tabla
    RACE_STANDINGS_BODY.innerHTML = '';
    
    // Añadir filas para cada piloto
    driverPositions.forEach(driver => {
        const row = document.createElement('tr');
        row.setAttribute('data-driver', driver.code);
        
        // Añadir clase activa si es el piloto enfocado
        if (driver.code === currentDriverFocus) {
            row.classList.add('active-driver');
        }
        
        row.innerHTML = `
            <td>${driver.position}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 4px; height: 16px; background-color: ${driver.teamColor};"></div>
                    <span>${driver.code}</span>
                </div>
            </td>
            <td>${driver.team}</td>
            <td>${driver.position === 1 ? 'Leader' : driver.timeGap}</td>
            <td>${driver.position === 1 ? '-' : driver.timeGap}</td>
            <td>${currentLap}</td>
            <td>${driver.lastLap}</td>
        `;
        
        RACE_STANDINGS_BODY.appendChild(row);
    });
}

// Inicializar el gráfico de telemetría
function initializeTelemetryChart() {
    // Destruir el gráfico anterior si existe
    if (telemetryChart) {
        telemetryChart.destroy();
    }
    
    // Encontrar el piloto enfocado
    const focusedDriver = driverPositions.find(driver => driver.code === currentDriverFocus);
    
    if (!focusedDriver) return;
    
    // Configurar datos para el gráfico
    const data = {
        labels: Array.from({ length: 12 }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Velocidad (km/h)',
                data: focusedDriver.telemetry.speed,
                borderColor: '#e10600',
                backgroundColor: 'rgba(225, 6, 0, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Acelerador (%)',
                data: focusedDriver.telemetry.throttle,
                borderColor: '#00d2be',
                backgroundColor: 'rgba(0, 210, 190, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Freno (%)',
                data: focusedDriver.telemetry.brake,
                borderColor: '#0600ef',
                backgroundColor: 'rgba(6, 0, 239, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };
    
    // Configuración del gráfico
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 350
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    };
    
    // Crear el gráfico
    telemetryChart = new Chart(TELEMETRY_CHART_CTX, config);
}

// Enfocar en un piloto específico
function focusOnDriver(driverCode) {
    // Actualizar el piloto enfocado
    currentDriverFocus = driverCode;
    
    // Encontrar el piloto
    const driver = driverPositions.find(d => d.code === driverCode);
    
    if (!driver) return;
    
    // Actualizar la información del piloto enfocado
    document.getElementById('focus-driver-name').textContent = driver.name;
    document.getElementById('focus-driver-team').textContent = driver.team;
    document.getElementById('focus-position').textContent = driver.position;
    document.getElementById('focus-gap').textContent = driver.position === 1 ? 'Leader' : driver.timeGap;
    document.getElementById('focus-last-lap').textContent = driver.lastLap;
    document.getElementById('focus-pit-stops').textContent = driver.pitStops;
    
    // Actualizar la telemetría
    initializeTelemetryChart();
    
    // Actualizar la tabla de posiciones (para resaltar el piloto)
    updateRaceStandings();
}

// Iniciar la simulación de la carrera
function startRaceSimulation() {
    // Detener cualquier simulación anterior
    stopRaceSimulation();
    
    // Iniciar intervalo para actualizar la posición de los coches
    raceInterval = setInterval(() => {
        // Actualizar la posición de cada coche
        updateCarPositions();
        
        // Actualizar la vuelta actual
        if (Math.random() > 0.9) {
            currentLap++;
            document.getElementById('current-lap').textContent = currentLap;
            
            // Terminar la carrera si se alcanza el número total de vueltas
            if (currentLap >= totalLaps) {
                stopRaceSimulation();
                alert('¡Carrera finalizada!');
            }
        }
        
        // Actualizar tiempos y posiciones aleatoriamente
        updateRaceData();
        
        // Actualizar la tabla de posiciones
        updateRaceStandings();
        
        // Actualizar la información del piloto enfocado
        focusOnDriver(currentDriverFocus);
    }, 2000);
}

// Detener la simulación de la carrera
function stopRaceSimulation() {
    if (raceInterval) {
        clearInterval(raceInterval);
        raceInterval = null;
    }
}

// Actualizar la posición de los coches en el circuito
function updateCarPositions() {
    // Obtener la longitud total del path
    const pathLength = TRACK_PATH.getTotalLength();
    
    // Actualizar la posición de cada coche
    carElements.forEach(({ car, carNumber, driver }) => {
        // Actualizar el progreso del piloto (simulación)
        const driverData = driverPositions.find(d => d.code === driver.code);
        if (driverData) {
            // Avanzar el coche
            driverData.progress += (Math.random() * 0.01) + 0.005;
            if (driverData.progress > 1) {
                driverData.progress -= 1;
            }
            
            // Calcular la nueva posición en el path
            const point = TRACK_PATH.getPointAtLength(pathLength * driverData.progress);
            
            // Actualizar la posición del coche
            car.setAttribute('cx', point.x);
            car.setAttribute('cy', point.y);
            
            // Actualizar la posición del número
            carNumber.setAttribute('x', point.x);
            carNumber.setAttribute('y', point.y + 1);
            carNumber.textContent = driverData.position;
        }
    });
}

// Actualizar los datos de la carrera (simulación)
function updateRaceData() {
    // Simular cambios en los tiempos y posiciones
    driverPositions.forEach(driver => {
        // Actualizar última vuelta
        const lapTimeParts = driver.lastLap.split(':');
        let minutes = parseInt(lapTimeParts[0]);
        let seconds = parseFloat(lapTimeParts[1]);
        
        // Añadir variación aleatoria (-0.5s a +0.5s)
        seconds += (Math.random() - 0.5);
        if (seconds < 0) {
            seconds += 60;
            minutes -= 1;
        }
        if (seconds >= 60) {
            seconds -= 60;
            minutes += 1;
        }
        
        driver.lastLap = `${minutes}:${seconds.toFixed(3)}`;
        
        // Actualizar diferencia de tiempo
        if (driver.position !== 1) {
            const gapValue = parseFloat(driver.timeGap);
            const newGap = gapValue + (Math.random() - 0.4) * 0.5;
            driver.timeGap = `+${newGap.toFixed(3)}s`;
        }
    });
    
    // Ocasionalmente cambiar posiciones
    if (Math.random() > 0.8) {
        // Seleccionar dos pilotos aleatorios para intercambiar posiciones
        const idx1 = Math.floor(Math.random() * driverPositions.length);
        let idx2 = idx1;
        while (idx2 === idx1) {
            idx2 = Math.floor(Math.random() * driverPositions.length);
        }
        
        // Intercambiar posiciones
        const tempPos = driverPositions[idx1].position;
        driverPositions[idx1].position = driverPositions[idx2].position;
        driverPositions[idx2].position = tempPos;
        
        // Ordenar array por posición
        driverPositions.sort((a, b) => a.position - b.position);
    }
    
    // Actualizar estadísticas de carrera
    document.getElementById('remaining-time').textContent = `${Math.floor((totalLaps - currentLap) * 1.5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    
    // Actualizar vuelta más rápida ocasionalmente
    if (Math.random() > 0.9) {
        const randomDriver = driverPositions[Math.floor(Math.random() * driverPositions.length)];
        document.getElementById('fastest-lap').textContent = randomDriver.lastLap;
        document.querySelector('.stats-card:nth-child(2) .stat-driver').textContent = randomDriver.name;
    }
    
    // Actualizar velocidad máxima ocasionalmente
    if (Math.random() > 0.9) {
        const randomDriver = driverPositions[Math.floor(Math.random() * driverPositions.length)];
        const maxSpeed = 320 + Math.floor(Math.random() * 30);
        document.getElementById('max-speed').textContent = `${maxSpeed} km/h`;
        document.querySelector('.stats-card:nth-child(1) .stat-driver').textContent = randomDriver.name;
    }
    
    // Actualizar paradas en boxes ocasionalmente
    if (Math.random() > 0.95) {
        const randomDriver = driverPositions[Math.floor(Math.random() * driverPositions.length)];
        randomDriver.pitStops += 1;
        const totalPitStops = driverPositions.reduce((sum, driver) => sum + driver.pitStops, 0);
        document.getElementById('pit-stops').textContent = totalPitStops;
        document.querySelector('.stats-card:nth-child(3) .stat-info').textContent = `Última: ${randomDriver.name} (Vuelta ${currentLap})`;
    }
} 