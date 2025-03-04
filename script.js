// Constantes y variables globales
const API_KEY = 'tu_api_key'; // Reemplazar con tu API key real
const MATCHES_GRID = document.getElementById('matches-grid');
const MATCH_MODAL = document.getElementById('match-modal');
const MATCH_DETAILS = document.getElementById('match-details');
const CLOSE_BUTTON = document.querySelector('.close-button');
const NAV_ITEMS = document.querySelectorAll('#tennis-section nav li');
let currentTournament = 'all';

// Datos de ejemplo para desarrollo (mientras se configura la API real)
const SAMPLE_MATCHES = [
    {
        id: 1,
        tournament: {
            name: 'Roland Garros',
            surface: 'Clay',
            location: 'Paris, France',
            category: 'Grand Slam',
            code: 'roland-garros'
        },
        status: 'En Vivo',
        court: 'Court Philippe-Chatrier',
        round: 'Cuartos de Final',
        startTime: '2023-06-06T13:00:00Z',
        player1: {
            name: 'Rafael Nadal',
            country: 'España',
            countryCode: 'ES',
            seed: 3,
            ranking: 4,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2019/nadal_head_ao19.png'
        },
        player2: {
            name: 'Novak Djokovic',
            country: 'Serbia',
            countryCode: 'RS',
            seed: 1,
            ranking: 1,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2019/djokovic_head_ao19.png'
        },
        score: {
            sets: [
                { player1: 6, player2: 4 },
                { player1: 7, player2: 6 },
                { player1: 3, player2: 6 },
                { player1: 4, player2: 3 }
            ],
            currentSet: 3,
            currentGame: {
                player1: 40,
                player2: 30,
                server: 'player1'
            }
        },
        stats: {
            aces: { player1: 5, player2: 8 },
            doubleFaults: { player1: 2, player2: 3 },
            firstServePercentage: { player1: 68, player2: 72 },
            firstServePointsWon: { player1: 75, player2: 70 },
            secondServePointsWon: { player1: 58, player2: 52 },
            breakPointsConverted: { player1: 4, player2: 3 },
            winners: { player1: 32, player2: 28 },
            unforcedErrors: { player1: 18, player2: 24 },
            totalPoints: { player1: 120, player2: 115 }
        }
    },
    {
        id: 2,
        tournament: {
            name: 'Wimbledon',
            surface: 'Grass',
            location: 'London, UK',
            category: 'Grand Slam',
            code: 'wimbledon'
        },
        status: 'En Vivo',
        court: 'Centre Court',
        round: 'Semifinal',
        startTime: '2023-07-14T14:30:00Z',
        player1: {
            name: 'Roger Federer',
            country: 'Suiza',
            countryCode: 'CH',
            seed: 2,
            ranking: 3,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2019/federer_head_ao19.png'
        },
        player2: {
            name: 'Carlos Alcaraz',
            country: 'España',
            countryCode: 'ES',
            seed: 5,
            ranking: 6,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2022/alcaraz_head_2022.png'
        },
        score: {
            sets: [
                { player1: 7, player2: 6 },
                { player1: 4, player2: 6 },
                { player1: 6, player2: 3 },
                { player1: 2, player2: 2 }
            ],
            currentSet: 3,
            currentGame: {
                player1: 15,
                player2: 30,
                server: 'player2'
            }
        },
        stats: {
            aces: { player1: 12, player2: 5 },
            doubleFaults: { player1: 1, player2: 4 },
            firstServePercentage: { player1: 75, player2: 65 },
            firstServePointsWon: { player1: 80, player2: 68 },
            secondServePointsWon: { player1: 60, player2: 55 },
            breakPointsConverted: { player1: 3, player2: 2 },
            winners: { player1: 35, player2: 25 },
            unforcedErrors: { player1: 15, player2: 22 },
            totalPoints: { player1: 125, player2: 110 }
        }
    },
    {
        id: 3,
        tournament: {
            name: 'Australian Open',
            surface: 'Hard',
            location: 'Melbourne, Australia',
            category: 'Grand Slam',
            code: 'australian-open'
        },
        status: 'En Vivo',
        court: 'Rod Laver Arena',
        round: 'Final',
        startTime: '2023-01-29T09:30:00Z',
        player1: {
            name: 'Daniil Medvedev',
            country: 'Rusia',
            countryCode: 'RU',
            seed: 4,
            ranking: 5,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2019/medvedev_head_ao19.png'
        },
        player2: {
            name: 'Stefanos Tsitsipas',
            country: 'Grecia',
            countryCode: 'GR',
            seed: 6,
            ranking: 7,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2019/tsitsipas_head_ao19.png'
        },
        score: {
            sets: [
                { player1: 3, player2: 6 },
                { player1: 6, player2: 4 },
                { player1: 7, player2: 6 },
                { player1: 5, player2: 5 }
            ],
            currentSet: 3,
            currentGame: {
                player1: 0,
                player2: 0,
                server: 'player1'
            }
        },
        stats: {
            aces: { player1: 10, player2: 7 },
            doubleFaults: { player1: 3, player2: 2 },
            firstServePercentage: { player1: 70, player2: 68 },
            firstServePointsWon: { player1: 72, player2: 75 },
            secondServePointsWon: { player1: 55, player2: 58 },
            breakPointsConverted: { player1: 2, player2: 3 },
            winners: { player1: 30, player2: 32 },
            unforcedErrors: { player1: 20, player2: 18 },
            totalPoints: { player1: 115, player2: 118 }
        }
    },
    {
        id: 4,
        tournament: {
            name: 'US Open',
            surface: 'Hard',
            location: 'New York, USA',
            category: 'Grand Slam',
            code: 'us-open'
        },
        status: 'En Vivo',
        court: 'Arthur Ashe Stadium',
        round: 'Octavos de Final',
        startTime: '2023-09-04T18:00:00Z',
        player1: {
            name: 'Alexander Zverev',
            country: 'Alemania',
            countryCode: 'DE',
            seed: 7,
            ranking: 8,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2019/zverev_head_ao19.png'
        },
        player2: {
            name: 'Dominic Thiem',
            country: 'Austria',
            countryCode: 'AT',
            seed: 8,
            ranking: 9,
            avatar: 'https://www.atptour.com/-/media/tennis/players/head-shot/2019/thiem_head_ao19.png'
        },
        score: {
            sets: [
                { player1: 6, player2: 3 },
                { player1: 4, player2: 6 },
                { player1: 2, player2: 1 }
            ],
            currentSet: 2,
            currentGame: {
                player1: 30,
                player2: 15,
                server: 'player2'
            }
        },
        stats: {
            aces: { player1: 8, player2: 6 },
            doubleFaults: { player1: 2, player2: 3 },
            firstServePercentage: { player1: 65, player2: 62 },
            firstServePointsWon: { player1: 70, player2: 68 },
            secondServePointsWon: { player1: 52, player2: 50 },
            breakPointsConverted: { player1: 3, player2: 2 },
            winners: { player1: 25, player2: 22 },
            unforcedErrors: { player1: 18, player2: 20 },
            totalPoints: { player1: 95, player2: 90 }
        }
    }
];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Configurar listeners de eventos
    setupEventListeners();
    
    // Cargar partidos iniciales
    loadMatches(currentTournament);
});

// Configuración de listeners de eventos
function setupEventListeners() {
    // Evento para cerrar el modal
    CLOSE_BUTTON.addEventListener('click', () => {
        MATCH_MODAL.style.display = 'none';
    });
    
    // Evento para cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === MATCH_MODAL) {
            MATCH_MODAL.style.display = 'none';
        }
    });
    
    // Eventos para los elementos de navegación de tenis
    NAV_ITEMS.forEach(item => {
        item.addEventListener('click', () => {
            // Actualizar clase activa
            NAV_ITEMS.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Actualizar torneo seleccionado y cargar partidos
            currentTournament = item.getAttribute('data-tournament');
            loadMatches(currentTournament);
        });
    });
}

// Cargar partidos desde la API (o datos de ejemplo)
async function loadMatches(tournament) {
    // Mostrar indicador de carga
    MATCHES_GRID.innerHTML = '';
    document.querySelector('#tennis-section .loading').style.display = 'flex';
    
    try {
        // En una implementación real, aquí se haría la llamada a la API
        // const response = await fetchLiveMatches(tournament);
        // const matches = await response.json();
        
        // Simulamos un retraso para mostrar la carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Usamos datos de ejemplo para desarrollo
        let matches = SAMPLE_MATCHES;
        
        // Filtrar por torneo si no es 'all'
        if (tournament !== 'all') {
            matches = matches.filter(match => match.tournament.code === tournament);
        }
        
        // Ocultar indicador de carga
        document.querySelector('#tennis-section .loading').style.display = 'none';
        
        // Renderizar partidos
        if (matches.length > 0) {
            renderMatches(matches);
        } else {
            MATCHES_GRID.innerHTML = '<p class="no-matches">No hay partidos en vivo en este momento para este torneo.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los partidos:', error);
        document.querySelector('#tennis-section .loading').style.display = 'none';
        MATCHES_GRID.innerHTML = '<p class="error-message">Ha ocurrido un error al cargar los partidos. Por favor, intenta de nuevo más tarde.</p>';
    }
}

// Función para hacer la llamada a la API (en una implementación real)
async function fetchLiveMatches(tournament) {
    // Esta es una implementación de ejemplo. En un caso real, se usaría una API como:
    // - API-Sports (Tennis API)
    // - SportsData.io
    // - RapidAPI (varias APIs de tenis)
    
    // Ejemplo de URL para API-Sports
    const url = `https://api-tennis.p.rapidapi.com/tournaments/live?category=atp`;
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'api-tennis.p.rapidapi.com'
        }
    };
    
    return fetch(url, options);
}

// Renderizar partidos en la interfaz
function renderMatches(matches) {
    matches.forEach(match => {
        const matchCard = createMatchCard(match);
        MATCHES_GRID.appendChild(matchCard);
    });
}

// Crear tarjeta de partido
function createMatchCard(match) {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    matchCard.dataset.matchId = match.id;
    
    // Determinar el icono del torneo según el tipo de superficie
    let surfaceIcon = 'fa-circle'; // Icono por defecto
    switch (match.tournament.surface.toLowerCase()) {
        case 'clay':
            surfaceIcon = 'fa-circle';
            break;
        case 'grass':
            surfaceIcon = 'fa-square';
            break;
        case 'hard':
            surfaceIcon = 'fa-square-full';
            break;
    }
    
    // Crear el HTML de la tarjeta
    matchCard.innerHTML = `
        <div class="match-header">
            <div class="tournament-name">
                <i class="fas ${surfaceIcon}"></i>
                <span>${match.tournament.name}</span>
            </div>
            <div class="match-status">${match.status}</div>
        </div>
        <div class="match-content">
            <div class="player">
                <img class="player-flag" src="https://flagcdn.com/w40/${match.player1.countryCode.toLowerCase()}.png" alt="${match.player1.country}">
                <span class="player-name">${match.player1.name}</span>
                <span class="player-score">${getCurrentScore(match, 'player1')}</span>
            </div>
            <div class="player">
                <img class="player-flag" src="https://flagcdn.com/w40/${match.player2.countryCode.toLowerCase()}.png" alt="${match.player2.country}">
                <span class="player-name">${match.player2.name}</span>
                <span class="player-score">${getCurrentScore(match, 'player2')}</span>
            </div>
            <div class="match-info">
                <span><i class="fas fa-trophy"></i>${match.round}</span>
                <span><i class="fas fa-map-marker-alt"></i>${match.court}</span>
            </div>
        </div>
    `;
    
    // Agregar evento para mostrar detalles del partido
    matchCard.addEventListener('click', () => {
        showMatchDetails(match);
    });
    
    return matchCard;
}

// Obtener puntuación actual para mostrar en la tarjeta
function getCurrentScore(match, player) {
    const sets = match.score.sets;
    let scoreText = '';
    
    // Mostrar puntuación de sets
    sets.forEach((set, index) => {
        scoreText += set[player];
        if (index < sets.length - 1) {
            scoreText += ' ';
        }
    });
    
    return scoreText;
}

// Mostrar detalles del partido en el modal
function showMatchDetails(match) {
    // Crear el contenido del modal
    MATCH_DETAILS.innerHTML = `
        <div class="match-detail-header">
            <div class="match-detail-tournament">
                <i class="fas fa-trophy"></i>
                <h3>${match.tournament.name} - ${match.round}</h3>
            </div>
            <div class="match-detail-status">${match.status}</div>
        </div>
        
        <div class="match-detail-players">
            <div class="match-detail-player">
                <img class="player-avatar" src="${match.player1.avatar}" alt="${match.player1.name}">
                <div class="player-detail-name">${match.player1.name}</div>
                <div class="player-country">
                    <img src="https://flagcdn.com/w40/${match.player1.countryCode.toLowerCase()}.png" alt="${match.player1.country}">
                    <span>${match.player1.country}</span>
                </div>
                <div class="player-stats">
                    <div class="stat-item">
                        <span>Ranking:</span>
                        <span>#${match.player1.ranking}</span>
                    </div>
                    <div class="stat-item">
                        <span>Seed:</span>
                        <span>${match.player1.seed}</span>
                    </div>
                </div>
            </div>
            
            <div class="match-detail-player">
                <img class="player-avatar" src="${match.player2.avatar}" alt="${match.player2.name}">
                <div class="player-detail-name">${match.player2.name}</div>
                <div class="player-country">
                    <img src="https://flagcdn.com/w40/${match.player2.countryCode.toLowerCase()}.png" alt="${match.player2.country}">
                    <span>${match.player2.country}</span>
                </div>
                <div class="player-stats">
                    <div class="stat-item">
                        <span>Ranking:</span>
                        <span>#${match.player2.ranking}</span>
                    </div>
                    <div class="stat-item">
                        <span>Seed:</span>
                        <span>${match.player2.seed}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="match-score-details">
            <div class="set-scores">
                <div class="set-header">Jugador</div>
                ${generateSetHeaders(match.score.sets.length)}
                
                <div class="player-row">
                    <div class="player-name-cell">${match.player1.name}</div>
                    ${generateSetScores(match.score.sets, 'player1', match.score.currentSet)}
                </div>
                
                <div class="player-row">
                    <div class="player-name-cell">${match.player2.name}</div>
                    ${generateSetScores(match.score.sets, 'player2', match.score.currentSet)}
                </div>
            </div>
            
            <div class="current-game">
                <p>Juego actual: ${match.score.currentGame.player1} - ${match.score.currentGame.player2} (Saque: ${match.score.currentGame.server === 'player1' ? match.player1.name : match.player2.name})</p>
            </div>
        </div>
        
        <h4 class="match-stats-title">Estadísticas del Partido</h4>
        
        <div class="match-stats">
            ${generateStatsGrid(match.stats)}
        </div>
        
        <div class="match-info-footer">
            <p>Superficie: ${match.tournament.surface}</p>
            <p>Ubicación: ${match.tournament.location}</p>
            <p>Inicio del partido: ${formatDate(match.startTime)}</p>
        </div>
    `;
    
    // Mostrar el modal
    MATCH_MODAL.style.display = 'block';
}

// Generar encabezados para los sets
function generateSetHeaders(numSets) {
    let headers = '';
    for (let i = 1; i <= numSets; i++) {
        headers += `<div class="set-header">Set ${i}</div>`;
    }
    return headers;
}

// Generar celdas de puntuación para los sets
function generateSetScores(sets, player, currentSet) {
    let scoresCells = '';
    sets.forEach((set, index) => {
        const isCurrentSet = index === currentSet - 1;
        scoresCells += `<div class="score-cell ${isCurrentSet ? 'current-set' : ''}">${set[player]}</div>`;
    });
    return scoresCells;
}

// Generar grid de estadísticas
function generateStatsGrid(stats) {
    const statsToShow = [
        { key: 'aces', label: 'Aces' },
        { key: 'doubleFaults', label: 'Dobles Faltas' },
        { key: 'firstServePercentage', label: '% Primer Servicio' },
        { key: 'firstServePointsWon', label: '% Puntos Ganados 1er Servicio' },
        { key: 'secondServePointsWon', label: '% Puntos Ganados 2do Servicio' },
        { key: 'breakPointsConverted', label: 'Puntos de Quiebre Convertidos' },
        { key: 'winners', label: 'Winners' },
        { key: 'unforcedErrors', label: 'Errores No Forzados' },
        { key: 'totalPoints', label: 'Puntos Totales' }
    ];
    
    let statsHTML = '';
    
    statsToShow.forEach(stat => {
        const p1Value = stats[stat.key].player1;
        const p2Value = stats[stat.key].player2;
        const total = p1Value + p2Value;
        const p1Percentage = total > 0 ? (p1Value / total) * 100 : 50;
        const p2Percentage = total > 0 ? (p2Value / total) * 100 : 50;
        
        statsHTML += `
            <div class="stat-label">${p1Value}</div>
            <div class="stat-bar-container">
                <div class="stat-bar-p1" style="width: ${p1Percentage}%"></div>
                <div class="stat-bar-p2" style="width: ${p2Percentage}%"></div>
            </div>
            <div class="stat-label">${p2Value}</div>
            <div class="stat-name" style="grid-column: span 3;">${stat.label}</div>
        `;
    });
    
    return statsHTML;
}

// Formatear fecha
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Actualizar datos periódicamente (en una implementación real)
// setInterval(() => {
//     loadMatches(currentTournament);
// }, 60000); // Actualizar cada minuto 