// Configuración de la API de Fórmula 1 en RapidAPI
const F1_API_KEY = 'TU_API_KEY'; // Reemplazar con tu API key de RapidAPI
const F1_API_HOST = 'api-formula-1.p.rapidapi.com';

// Objeto para almacenar datos en caché
const apiCache = {
    drivers: null,
    circuits: null,
    lastFetch: {
        drivers: null,
        circuits: null
    }
};

// Función para realizar peticiones a la API
async function fetchFromAPI(endpoint) {
    // Verificar si tenemos datos en caché y si son recientes (menos de 1 hora)
    const cacheKey = endpoint.split('/').pop();
    if (apiCache[cacheKey] && apiCache.lastFetch[cacheKey]) {
        const cacheAge = Date.now() - apiCache.lastFetch[cacheKey];
        if (cacheAge < 3600000) { // 1 hora en milisegundos
            console.log(`Usando datos en caché para ${cacheKey}`);
            return apiCache[cacheKey];
        }
    }

    const url = `https://${F1_API_HOST}/${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': F1_API_KEY,
                'X-RapidAPI-Host': F1_API_HOST
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Guardar en caché
        if (cacheKey in apiCache) {
            apiCache[cacheKey] = data;
            apiCache.lastFetch[cacheKey] = Date.now();
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        
        // Si hay un error, intentamos usar datos en caché aunque sean antiguos
        if (apiCache[cacheKey]) {
            console.log(`Usando datos en caché antiguos para ${cacheKey} debido a un error en la API`);
            return apiCache[cacheKey];
        }
        
        // Si no hay datos en caché, usamos datos de ejemplo
        return getFallbackData(cacheKey);
    }
}

// Datos de ejemplo para usar en caso de error o durante el desarrollo
function getFallbackData(type) {
    if (type === 'drivers') {
        return {
            response: [
                {
                    id: 1,
                    name: "Max Verstappen",
                    abbr: "VER",
                    number: 1,
                    image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/verstappen.jpg.img.1920.medium.jpg",
                    team: {
                        id: 1,
                        name: "Red Bull Racing",
                        logo: "https://media.formula1.com/content/dam/fom-website/teams/2023/red-bull-racing-logo.png.img.1920.medium.png"
                    },
                    country: {
                        name: "Netherlands",
                        code: "NL"
                    },
                    birthdate: "1997-09-30",
                    birthplace: "Hasselt, Belgium",
                    podiums: 98,
                    championshipWins: 3
                },
                {
                    id: 2,
                    name: "Lewis Hamilton",
                    abbr: "HAM",
                    number: 44,
                    image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/hamilton.jpg.img.1920.medium.jpg",
                    team: {
                        id: 2,
                        name: "Mercedes",
                        logo: "https://media.formula1.com/content/dam/fom-website/teams/2023/mercedes-logo.png.img.1920.medium.png"
                    },
                    country: {
                        name: "United Kingdom",
                        code: "GB"
                    },
                    birthdate: "1985-01-07",
                    birthplace: "Stevenage, England",
                    podiums: 197,
                    championshipWins: 7
                },
                {
                    id: 3,
                    name: "Fernando Alonso",
                    abbr: "ALO",
                    number: 14,
                    image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/alonso.jpg.img.1920.medium.jpg",
                    team: {
                        id: 3,
                        name: "Aston Martin",
                        logo: "https://media.formula1.com/content/dam/fom-website/teams/2023/aston-martin-logo.png.img.1920.medium.png"
                    },
                    country: {
                        name: "Spain",
                        code: "ES"
                    },
                    birthdate: "1981-07-29",
                    birthplace: "Oviedo, Spain",
                    podiums: 106,
                    championshipWins: 2
                }
            ]
        };
    } else if (type === 'circuits') {
        return {
            response: [
                {
                    id: 1,
                    name: "Circuit de Monaco",
                    image: "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png.img.1920.medium.png",
                    competition: {
                        name: "Monaco Grand Prix"
                    },
                    country: {
                        name: "Monaco",
                        code: "MC"
                    },
                    city: "Monte Carlo",
                    length: "3.337 km",
                    laps: 78,
                    opened: 1929,
                    firstGrandPrix: 1950,
                    lapRecord: {
                        time: "1:12.909",
                        driver: "Lewis Hamilton",
                        year: 2021
                    }
                },
                {
                    id: 2,
                    name: "Silverstone Circuit",
                    image: "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png.img.1920.medium.png",
                    competition: {
                        name: "British Grand Prix"
                    },
                    country: {
                        name: "United Kingdom",
                        code: "GB"
                    },
                    city: "Silverstone",
                    length: "5.891 km",
                    laps: 52,
                    opened: 1947,
                    firstGrandPrix: 1950,
                    lapRecord: {
                        time: "1:27.097",
                        driver: "Max Verstappen",
                        year: 2020
                    }
                },
                {
                    id: 3,
                    name: "Circuit de Spa-Francorchamps",
                    image: "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png.img.1920.medium.png",
                    competition: {
                        name: "Belgian Grand Prix"
                    },
                    country: {
                        name: "Belgium",
                        code: "BE"
                    },
                    city: "Stavelot",
                    length: "7.004 km",
                    laps: 44,
                    opened: 1921,
                    firstGrandPrix: 1950,
                    lapRecord: {
                        time: "1:46.286",
                        driver: "Valtteri Bottas",
                        year: 2018
                    }
                }
            ]
        };
    }
    return { response: [] };
}

// Función para obtener los pilotos
async function getDrivers() {
    return fetchFromAPI('drivers');
}

// Función para obtener los circuitos
async function getCircuits() {
    return fetchFromAPI('circuits');
}

// Función para crear una tarjeta de piloto
function createDriverCard(driver) {
    // Obtener colores del equipo para la barra superior
    const teamColors = {
        'Red Bull Racing': '#0600EF',
        'Mercedes': '#00D2BE',
        'Ferrari': '#DC0000',
        'McLaren': '#FF8700',
        'Aston Martin': '#006F62',
        'Alpine': '#0090FF',
        'Williams': '#005AFF',
        'AlphaTauri': '#2B4562',
        'Alfa Romeo': '#900000',
        'Haas F1 Team': '#FFFFFF'
    };

    const teamColor = driver.team && driver.team.name ? teamColors[driver.team.name] || '#333333' : '#333333';
    
    // Crear la estructura de la tarjeta
    const card = document.createElement('div');
    card.className = 'driver-card';
    card.style.animationDelay = `${Math.random() * 0.5}s`;
    
    // Contenido de la tarjeta
    card.innerHTML = `
        <div class="driver-team-color" style="background-color: ${teamColor};"></div>
        <div class="driver-number">${driver.number || '?'}</div>
        <div class="driver-card-header">
            <img src="${driver.image || 'https://via.placeholder.com/300x180?text=Piloto'}" alt="${driver.name}">
        </div>
        <div class="driver-card-body">
            <h3 class="driver-name">${driver.name}</h3>
            <p class="driver-team">${driver.team ? driver.team.name : 'Equipo desconocido'}</p>
            <div class="driver-stats">
                <div class="driver-stat">
                    <span class="stat-label">País</span>
                    <span class="stat-value">${driver.country ? driver.country.name : 'Desconocido'}</span>
                </div>
                <div class="driver-stat">
                    <span class="stat-label">Número</span>
                    <span class="stat-value">${driver.number || 'N/A'}</span>
                </div>
                <div class="driver-stat">
                    <span class="stat-label">Nacimiento</span>
                    <span class="stat-value">${formatDate(driver.birthdate) || 'Desconocido'}</span>
                </div>
                <div class="driver-stat">
                    <span class="stat-label">Podios</span>
                    <span class="stat-value">${driver.podiums || '0'}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Función para crear una tarjeta de circuito
function createCircuitCard(circuit) {
    // Crear la estructura de la tarjeta
    const card = document.createElement('div');
    card.className = 'circuit-card';
    card.style.animationDelay = `${Math.random() * 0.5}s`;
    
    // Contenido de la tarjeta
    card.innerHTML = `
        <div class="circuit-country-flag" style="background: linear-gradient(to right, #ff0000, #ffff00, #ff0000);"></div>
        <div class="circuit-card-header">
            <img src="${circuit.image || 'https://via.placeholder.com/300x180?text=Circuito'}" alt="${circuit.name}">
        </div>
        <div class="circuit-card-body">
            <h3 class="circuit-name">${circuit.name}</h3>
            <p class="circuit-location">${circuit.country ? circuit.country.name : 'País desconocido'}, ${circuit.city || ''}</p>
            <div class="circuit-stats">
                <div class="circuit-stat">
                    <span class="stat-label">Longitud</span>
                    <span class="stat-value">${circuit.length || 'Desconocida'}</span>
                </div>
                <div class="circuit-stat">
                    <span class="stat-label">Vueltas</span>
                    <span class="stat-value">${circuit.laps || 'N/A'}</span>
                </div>
                <div class="circuit-stat">
                    <span class="stat-label">Inauguración</span>
                    <span class="stat-value">${circuit.opened || 'Desconocida'}</span>
                </div>
                <div class="circuit-stat">
                    <span class="stat-label">Primer GP</span>
                    <span class="stat-value">${circuit.firstGrandPrix || 'Desconocido'}</span>
                </div>
            </div>
            ${circuit.lapRecord ? `
            <div class="circuit-stat" style="margin-top: 10px; grid-column: 1 / span 2;">
                <span class="stat-label">Vuelta récord</span>
                <span class="stat-value">${circuit.lapRecord.time} (${circuit.lapRecord.driver}, ${circuit.lapRecord.year})</span>
            </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Función para formatear fechas
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// Función para cargar los pilotos
async function loadDrivers() {
    const driversContainer = document.querySelector('.drivers-grid');
    const loadingIndicator = document.querySelector('.drivers-container .loading-indicator');
    
    if (!driversContainer || !loadingIndicator) return;
    
    try {
        loadingIndicator.style.display = 'block';
        driversContainer.innerHTML = '';
        
        const data = await getDrivers();
        
        if (data && data.response && data.response.length > 0) {
            loadingIndicator.style.display = 'none';
            
            // Ordenar pilotos por equipo y nombre
            const sortedDrivers = [...data.response].sort((a, b) => {
                if (a.team && b.team && a.team.name !== b.team.name) {
                    return a.team.name.localeCompare(b.team.name);
                }
                return a.name.localeCompare(b.name);
            });
            
            sortedDrivers.forEach(driver => {
                const card = createDriverCard(driver);
                driversContainer.appendChild(card);
            });
        } else {
            loadingIndicator.textContent = 'No se encontraron datos de pilotos';
        }
    } catch (error) {
        console.error('Error al cargar los pilotos:', error);
        loadingIndicator.textContent = 'Error al cargar los datos. Inténtalo de nuevo más tarde.';
    }
}

// Función para cargar los circuitos
async function loadCircuits() {
    const circuitsContainer = document.querySelector('.circuits-grid');
    const loadingIndicator = document.querySelector('.circuits-container .loading-indicator');
    
    if (!circuitsContainer || !loadingIndicator) return;
    
    try {
        loadingIndicator.style.display = 'block';
        circuitsContainer.innerHTML = '';
        
        const data = await getCircuits();
        
        if (data && data.response && data.response.length > 0) {
            loadingIndicator.style.display = 'none';
            
            // Ordenar circuitos por nombre
            const sortedCircuits = [...data.response].sort((a, b) => a.name.localeCompare(b.name));
            
            sortedCircuits.forEach(circuit => {
                const card = createCircuitCard(circuit);
                circuitsContainer.appendChild(card);
            });
        } else {
            loadingIndicator.textContent = 'No se encontraron datos de circuitos';
        }
    } catch (error) {
        console.error('Error al cargar los circuitos:', error);
        loadingIndicator.textContent = 'Error al cargar los datos. Inténtalo de nuevo más tarde.';
    }
}

// Exportar funciones para usar en otros archivos
window.F1API = {
    loadDrivers,
    loadCircuits
}; 