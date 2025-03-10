let MATCH_MODAL;
let MATCH_DETAILS;
let CLOSE_BUTTON;
let SHOW_COMPLETED_CHECKBOX;
let SHOW_COMPLETED_MATCHES = false; // Por defecto, no mostrar partidos finalizados

// Variables para controlar el jugador activo
let CURRENT_PLAYER = 'alcaraz'; // Por defecto, Carlos Alcaraz

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las referencias a elementos del DOM
    MATCHES_GRID = document.getElementById('matches-grid');
    MATCH_MODAL = document.getElementById('match-modal');
    MATCH_DETAILS = document.getElementById('match-details');
    CLOSE_BUTTON = document.querySelector('.close-button');
    SHOW_COMPLETED_CHECKBOX = document.getElementById('show-completed-matches');
    
    console.log('Checkbox encontrado:', SHOW_COMPLETED_CHECKBOX);
    
    // Inicializar la sección de tenis
    initTennis();
});

// Función para formatear la hora del partido
function formatMatchTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// Función para buscar partidos de Carlos Alcaraz
async function buscarPartidosAlcaraz() {
    try {
        // Mostrar indicador de carga
        MATCHES_GRID.innerHTML = '';
        document.querySelector('#tennis-section .loading').style.display = 'flex';
        
        let data;
        
        try {
            // Intentar obtener datos de la API real
            data = await TennisAPI.getPlayerMatches('alcaraz', 10);
            console.log('Datos obtenidos de la API:', data);
        } catch (apiError) {
            console.warn('Error al obtener datos de la API, usando datos de ejemplo:', apiError);
            // Si hay un error con la API, usar datos de ejemplo como fallback
            data = SAMPLE_ALCARAZ_MATCHES;
        }
        
        // Ocultar indicador de carga
        document.querySelector('#tennis-section .loading').style.display = 'none';
        
        // Mostrar mensaje si no hay partidos
        if (!data || data.length === 0) {
            MATCHES_GRID.innerHTML = '<div class="no-matches">No hay partidos disponibles para Carlos Alcaraz en este momento.</div>';
            return;
        }
        
        // Renderizar partidos
        data.forEach(match => {
            const matchCard = createAlcarazMatchCard(match);
            MATCHES_GRID.appendChild(matchCard);
        });
        
        // Actualizar el banner del torneo
        document.querySelector('.tournament-banner h2').textContent = 'Partidos de Carlos Alcaraz';
        document.querySelector('.tournament-banner p').textContent = 'Últimos partidos y próximos encuentros';
        
        // Aplicar filtro de partidos finalizados
        applyMatchesFilter();
        
    } catch (error) {
        console.error('Error al cargar los partidos de Alcaraz:', error);
        document.querySelector('#tennis-section .loading').style.display = 'none';
        MATCHES_GRID.innerHTML = '<div class="error-message">Error al cargar los partidos. Por favor, intenta de nuevo más tarde.</div>';
    }
}

// Crear tarjeta de partido para Alcaraz
function createAlcarazMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.setAttribute('data-match-id', match.id);
    
    // Determinar el estado del partido
    let statusClass = '';
    let statusText = '';
    
    if (match.status === 'completed') {
        statusClass = 'completed';
        statusText = 'Finalizado';
        
        // Aplicar filtro si es necesario
        if (!SHOW_COMPLETED_MATCHES) {
            card.classList.add('filtered');
        }
    } else if (match.status === 'live') {
        statusClass = 'live';
        statusText = 'En Vivo';
    } else {
        statusClass = 'upcoming';
        statusText = 'Próximamente';
    }
    
    // Determinar si Alcaraz es player1 o player2
    const isAlcarazPlayer1 = match.player1.name.includes('Alcaraz');
    const alcaraz = isAlcarazPlayer1 ? match.player1 : match.player2;
    const opponent = isAlcarazPlayer1 ? match.player2 : match.player1;
    
    // Crear el HTML de la tarjeta
    card.innerHTML = `
        <div class="match-header">
            <div class="tournament-info">
                <span class="tournament-name">${match.tournament.name}</span>
                <span class="match-round">${match.round}</span>
            </div>
            <div class="match-status ${statusClass}">${statusText}</div>
        </div>
        <div class="match-content">
            <div class="player player1">
                <div class="player-info">
                    <div class="player-avatar">
                        <img src="${alcaraz.avatar || 'https://ui-avatars.com/api/?name=' + alcaraz.name.substring(0,2) + '&background=2e8b57&color=fff&size=40'}" alt="${alcaraz.name}">
                    </div>
                    <div class="player-details">
                        <div class="player-name">${alcaraz.name}</div>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${alcaraz.countryCode.toLowerCase()}.png" alt="${alcaraz.country}">
                            <span>${alcaraz.country}</span>
                        </div>
                    </div>
                </div>
                <div class="player-score">
                    ${renderAlcarazScore(match.score, isAlcarazPlayer1 ? 'player1' : 'player2')}
                </div>
            </div>
            <div class="player player2">
                <div class="player-info">
                    <div class="player-avatar">
                        <img src="${opponent.avatar || 'https://ui-avatars.com/api/?name=' + opponent.name.substring(0,2) + '&background=333&color=fff&size=40'}" alt="${opponent.name}">
                    </div>
                    <div class="player-details">
                        <div class="player-name">${opponent.name}</div>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${opponent.countryCode.toLowerCase()}.png" alt="${opponent.country}">
                            <span>${opponent.country}</span>
                        </div>
                    </div>
                </div>
                <div class="player-score">
                    ${renderAlcarazScore(match.score, isAlcarazPlayer1 ? 'player2' : 'player1')}
                </div>
            </div>
        </div>
        <div class="match-footer">
            <div class="match-court"><i class="fas fa-map-marker-alt"></i> ${match.court}</div>
            <div class="match-time"><i class="far fa-clock"></i> ${formatMatchTime(match.startTime)}</div>
        </div>
    `;
    
    // Evento para mostrar detalles del partido
    card.addEventListener('click', function() {
        showAlcarazMatchDetails(match, isAlcarazPlayer1);
    });
    
    return card;
}

// Renderizar puntuación para partidos de Alcaraz
function renderAlcarazScore(score, player) {
    let html = '';
    
    // Renderizar sets
    if (score && score.sets) {
        score.sets.forEach((set, index) => {
            const isCurrentSet = index === score.currentSet - 1;
            const setClass = isCurrentSet ? 'current-set' : '';
            html += `<span class="set ${setClass}">${set[player]}</span>`;
        });
    }
    
    // Renderizar juego actual si el partido está en vivo
    if (score && score.currentGame && score.currentSet === score.sets.length) {
        const gameClass = score.gamePoint ? 'game-point' : '';
        const isServer = score.currentGame.server === player;
        const serverIcon = isServer ? '<i class="fas fa-circle server-indicator"></i>' : '';
        
        html += `<span class="current-game ${gameClass}">${score.currentGame[player]} ${serverIcon}</span>`;
    }
    
    // Si no hay puntaje, mostrar un guión
    if (!html) {
        html = '<span class="no-score">-</span>';
    }
    
    return html;
}

// Mostrar detalles del partido de Alcaraz en el modal
function showAlcarazMatchDetails(match, isAlcarazPlayer1) {
    const alcaraz = isAlcarazPlayer1 ? match.player1 : match.player2;
    const opponent = isAlcarazPlayer1 ? match.player2 : match.player1;
    
    // Determinar el estado del partido
    let statusClass = '';
    let statusText = '';
    
    if (match.status === 'completed') {
        statusClass = 'completed';
        statusText = 'Finalizado';
    } else if (match.status === 'live') {
        statusClass = 'live';
        statusText = 'En Vivo';
    } else {
        statusClass = 'upcoming';
        statusText = 'Próximamente';
    }
    
    // Construir el HTML para los detalles del partido
    MATCH_DETAILS.innerHTML = `
        <div class="match-detail-header">
            <div class="tournament-detail">
                <h2>${match.tournament.name}</h2>
                <p>${match.round} - ${match.court}</p>
            </div>
            <div class="match-status ${statusClass}">
                ${statusText}
            </div>
        </div>
        
        <div class="match-detail-content">
            <div class="players-container">
                <div class="player-detail player1">
                    <div class="player-avatar">
                        <img src="${alcaraz.avatar || 'https://ui-avatars.com/api/?name=' + alcaraz.name.substring(0,2) + '&background=2e8b57&color=fff&size=80'}" alt="${alcaraz.name}">
                    </div>
                    <div class="player-info">
                        <h3>${alcaraz.name}</h3>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${alcaraz.countryCode.toLowerCase()}.png" alt="${alcaraz.country}">
                            <span>${alcaraz.country}</span>
                        </div>
                        <div class="player-ranking">Ranking: #${alcaraz.ranking}</div>
                        <div class="player-seed">Seed: ${alcaraz.seed || 'N/A'}</div>
                    </div>
                </div>
                
                <div class="score-detail">
                    ${renderDetailedAlcarazScore(match.score, isAlcarazPlayer1)}
                </div>
                
                <div class="player-detail player2">
                    <div class="player-avatar">
                        <img src="${opponent.avatar || 'https://ui-avatars.com/api/?name=' + opponent.name.substring(0,2) + '&background=333&color=fff&size=80'}" alt="${opponent.name}">
                    </div>
                    <div class="player-info">
                        <h3>${opponent.name}</h3>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${opponent.countryCode.toLowerCase()}.png" alt="${opponent.country}">
                            <span>${opponent.country}</span>
                        </div>
                        <div class="player-ranking">Ranking: #${opponent.ranking}</div>
                        <div class="player-seed">Seed: ${opponent.seed || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="match-stats">
                <h3>Estadísticas del Partido</h3>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>${alcaraz.name}</th>
                            <th>Estadística</th>
                            <th>${opponent.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player1' : 'player2'].aces : '-'}</td>
                            <td>Aces</td>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player2' : 'player1'].aces : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player1' : 'player2'].doubleFaults : '-'}</td>
                            <td>Dobles Faltas</td>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player2' : 'player1'].doubleFaults : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player1' : 'player2'].firstServePercentage + '%' : '-'}</td>
                            <td>% Primer Servicio</td>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player2' : 'player1'].firstServePercentage + '%' : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player1' : 'player2'].winners : '-'}</td>
                            <td>Winners</td>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player2' : 'player1'].winners : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player1' : 'player2'].unforcedErrors : '-'}</td>
                            <td>Errores No Forzados</td>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player2' : 'player1'].unforcedErrors : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player1' : 'player2'].totalPointsWon : '-'}</td>
                            <td>Total de Puntos Ganados</td>
                            <td>${match.stats ? match.stats[isAlcarazPlayer1 ? 'player2' : 'player1'].totalPointsWon : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    MATCH_MODAL.style.display = 'block';
}

// Renderizar puntuación detallada para partidos de Alcaraz
function renderDetailedAlcarazScore(score, isAlcarazPlayer1) {
    if (!score || !score.sets) {
        return '<div class="no-score">Puntuación no disponible</div>';
    }
    
    let html = '<table class="score-table"><thead><tr><th></th>';
    
    // Encabezados de sets
    for (let i = 0; i < score.sets.length; i++) {
        html += `<th>Set ${i + 1}</th>`;
    }
    
    // Si el partido está en vivo, añadir columna para el juego actual
    if (score.currentGame && score.currentSet === score.sets.length) {
        html += '<th>Juego</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    // Puntuación de Alcaraz
    html += '<tr><td>Alcaraz</td>';
    score.sets.forEach((set, index) => {
        const isCurrentSet = index === score.currentSet - 1;
        const setClass = isCurrentSet ? 'current-set' : '';
        html += `<td class="${setClass}">${set[isAlcarazPlayer1 ? 'player1' : 'player2']}</td>`;
    });
    
    // Juego actual para Alcaraz
    if (score.currentGame && score.currentSet === score.sets.length) {
        const isServer = score.currentGame.server === (isAlcarazPlayer1 ? 'player1' : 'player2');
        const serverIcon = isServer ? '<i class="fas fa-circle server-indicator"></i>' : '';
        html += `<td class="current-game">${score.currentGame[isAlcarazPlayer1 ? 'player1' : 'player2']} ${serverIcon}</td>`;
    }
    
    html += '</tr>';
    
    // Puntuación del oponente
    html += '<tr><td>Oponente</td>';
    score.sets.forEach((set, index) => {
        const isCurrentSet = index === score.currentSet - 1;
        const setClass = isCurrentSet ? 'current-set' : '';
        html += `<td class="${setClass}">${set[isAlcarazPlayer1 ? 'player2' : 'player1']}</td>`;
    });
    
    // Juego actual para el oponente
    if (score.currentGame && score.currentSet === score.sets.length) {
        const isServer = score.currentGame.server === (isAlcarazPlayer1 ? 'player2' : 'player1');
        const serverIcon = isServer ? '<i class="fas fa-circle server-indicator"></i>' : '';
        html += `<td class="current-game">${score.currentGame[isAlcarazPlayer1 ? 'player2' : 'player1']} ${serverIcon}</td>`;
    }
    
    html += '</tr></tbody></table>';
    
    return html;
}

// Inicializar la sección de tenis
function initTennis() {
    console.log('Inicializando sección de tenis');
    
    // Cargar partidos de Alcaraz automáticamente al iniciar
    buscarPartidosAlcaraz();
    
    // Inicializar eventos de los botones de jugadores
    const alcarazButton = document.getElementById('alcaraz-button');
    const badosaButton = document.getElementById('badosa-button');
    
    alcarazButton.addEventListener('click', function() {
        if (CURRENT_PLAYER !== 'alcaraz') {
            CURRENT_PLAYER = 'alcaraz';
            updateActivePlayerButton();
            buscarPartidosAlcaraz();
        }
    });
    
    badosaButton.addEventListener('click', function() {
        if (CURRENT_PLAYER !== 'badosa') {
            CURRENT_PLAYER = 'badosa';
            updateActivePlayerButton();
            buscarPartidosBadosa();
        }
    });
    
    // Inicializar eventos del modal
    CLOSE_BUTTON.addEventListener('click', function() {
        MATCH_MODAL.style.display = 'none';
    });
    
    // Inicializar evento del checkbox
    const checkbox = document.getElementById('show-completed-matches');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            console.log('Checkbox changed:', this.checked);
            toggleCompletedMatches(this.checked);
        });
    }
    
    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === MATCH_MODAL) {
            MATCH_MODAL.style.display = 'none';
        }
    });
}

// Función para actualizar el botón del jugador activo
function updateActivePlayerButton() {
    const alcarazButton = document.getElementById('alcaraz-button');
    const badosaButton = document.getElementById('badosa-button');
    
    if (CURRENT_PLAYER === 'alcaraz') {
        alcarazButton.classList.add('active');
        badosaButton.classList.remove('active');
    } else {
        alcarazButton.classList.remove('active');
        badosaButton.classList.add('active');
    }
}

// Aplicar filtro a los partidos
function applyMatchesFilter() {
    console.log('Aplicando filtro. Mostrar finalizados:', SHOW_COMPLETED_MATCHES);
    
    // Obtener todos los partidos
    const matchCards = document.querySelectorAll('.match-card');
    console.log('Total de partidos:', matchCards.length);
    
    let completedCount = 0;
    let visibleCount = 0;
    
    // Aplicar filtro a cada partido
    matchCards.forEach(card => {
        const statusElement = card.querySelector('.match-status');
        const isCompleted = statusElement && statusElement.classList.contains('completed');
        
        if (isCompleted) {
            completedCount++;
        }
        
        // Si el partido está finalizado y no se deben mostrar los finalizados, ocultarlo
        if (isCompleted && !SHOW_COMPLETED_MATCHES) {
            card.classList.add('filtered');
        } else {
            card.classList.remove('filtered');
            visibleCount++;
        }
    });
    
    console.log('Partidos finalizados:', completedCount);
    console.log('Partidos visibles después del filtro:', visibleCount);
    
    // Mostrar mensaje si no hay partidos visibles
    const visibleMatches = document.querySelectorAll('.match-card:not(.filtered)');
    if (visibleMatches.length === 0) {
        // Si no hay partidos visibles, mostrar mensaje
        const noMatchesElement = document.querySelector('.no-matches') || document.createElement('div');
        noMatchesElement.className = 'no-matches';
        noMatchesElement.textContent = 'No hay partidos disponibles con los filtros actuales.';
        
        // Si el elemento no existe, añadirlo al grid
        if (!document.querySelector('.no-matches')) {
            MATCHES_GRID.appendChild(noMatchesElement);
        }
    } else {
        // Si hay partidos visibles, eliminar mensaje si existe
        const noMatchesElement = document.querySelector('.no-matches');
        if (noMatchesElement) {
            noMatchesElement.remove();
        }
    }
}

// Datos de ejemplo para partidos de Carlos Alcaraz
const SAMPLE_ALCARAZ_MATCHES = [
    {
        id: 101,
        tournament: {
            name: 'ATP Indian Wells',
            surface: 'Hard',
            location: 'Indian Wells, USA',
            category: 'Masters 1000',
            code: 'indian-wells'
        },
        status: 'upcoming',
        court: 'Stadium 1',
        round: 'Tercera Ronda',
        startTime: '2024-03-11T01:00:00Z',
        player1: {
            name: 'Denis Shapovalov',
            country: 'Canadá',
            countryCode: 'CA',
            seed: null,
            ranking: 105,
            avatar: 'https://ui-avatars.com/api/?name=DS&background=333&color=fff&size=40'
        },
        player2: {
            name: 'Carlos Alcaraz',
            country: 'España',
            countryCode: 'ES',
            seed: 3,
            ranking: 2,
            avatar: 'https://ui-avatars.com/api/?name=CA&background=2e8b57&color=fff&size=40'
        },
        score: null
    },
    {
        id: 102,
        tournament: {
            name: 'ATP Indian Wells',
            surface: 'Hard',
            location: 'Indian Wells, USA',
            category: 'Masters 1000',
            code: 'indian-wells'
        },
        status: 'completed',
        court: 'Stadium 1',
        round: 'Segunda Ronda',
        startTime: '2024-03-08T21:00:00Z',
        player1: {
            name: 'Quentin Halys',
            country: 'Francia',
            countryCode: 'FR',
            seed: null,
            ranking: 59,
            avatar: 'https://ui-avatars.com/api/?name=QH&background=333&color=fff&size=40'
        },
        player2: {
            name: 'Carlos Alcaraz',
            country: 'España',
            countryCode: 'ES',
            seed: 3,
            ranking: 2,
            avatar: 'https://ui-avatars.com/api/?name=CA&background=2e8b57&color=fff&size=40'
        },
        score: {
            sets: [
                { player1: 4, player2: 6 },
                { player1: 2, player2: 6 }
            ],
            currentSet: 2
        },
        stats: {
            player1: {
                aces: 3,
                doubleFaults: 2,
                firstServePercentage: 62,
                winners: 18,
                unforcedErrors: 24,
                totalPointsWon: 48
            },
            player2: {
                aces: 5,
                doubleFaults: 1,
                firstServePercentage: 68,
                winners: 26,
                unforcedErrors: 15,
                totalPointsWon: 67
            }
        }
    },
    {
        id: 103,
        tournament: {
            name: 'ATP Doha',
            surface: 'Hard',
            location: 'Doha, Qatar',
            category: 'ATP 250',
            code: 'doha'
        },
        status: 'completed',
        court: 'Central',
        round: 'Cuartos de Final',
        startTime: '2024-02-20T15:45:00Z',
        player1: {
            name: 'Carlos Alcaraz',
            country: 'España',
            countryCode: 'ES',
            seed: 3,
            ranking: 2,
            avatar: 'https://ui-avatars.com/api/?name=CA&background=2e8b57&color=fff&size=40'
        },
        player2: {
            name: 'Jiri Lehecka',
            country: 'República Checa',
            countryCode: 'CZ',
            seed: null,
            ranking: 25,
            avatar: 'https://ui-avatars.com/api/?name=JL&background=333&color=fff&size=40'
        },
        score: {
            sets: [
                { player1: 3, player2: 6 },
                { player1: 6, player2: 3 },
                { player1: 4, player2: 6 }
            ],
            currentSet: 3
        },
        stats: {
            player1: {
                aces: 4,
                doubleFaults: 3,
                firstServePercentage: 65,
                winners: 32,
                unforcedErrors: 28,
                totalPointsWon: 89
            },
            player2: {
                aces: 7,
                doubleFaults: 2,
                firstServePercentage: 70,
                winners: 35,
                unforcedErrors: 22,
                totalPointsWon: 95
            }
        }
    },
    {
        id: 104,
        tournament: {
            name: 'ATP Doha',
            surface: 'Hard',
            location: 'Doha, Qatar',
            category: 'ATP 250',
            code: 'doha'
        },
        status: 'completed',
        court: 'Central',
        round: 'Segunda Ronda',
        startTime: '2024-02-19T15:05:00Z',
        player1: {
            name: 'Carlos Alcaraz',
            country: 'España',
            countryCode: 'ES',
            seed: 3,
            ranking: 2,
            avatar: 'https://ui-avatars.com/api/?name=CA&background=2e8b57&color=fff&size=40'
        },
        player2: {
            name: 'Luca Nardi',
            country: 'Italia',
            countryCode: 'IT',
            seed: null,
            ranking: 85,
            avatar: 'https://ui-avatars.com/api/?name=LN&background=333&color=fff&size=40'
        },
        score: {
            sets: [
                { player1: 6, player2: 1 },
                { player1: 4, player2: 6 },
                { player1: 6, player2: 3 }
            ],
            currentSet: 3
        },
        stats: {
            player1: {
                aces: 6,
                doubleFaults: 2,
                firstServePercentage: 67,
                winners: 38,
                unforcedErrors: 25,
                totalPointsWon: 97
            },
            player2: {
                aces: 3,
                doubleFaults: 4,
                firstServePercentage: 61,
                winners: 29,
                unforcedErrors: 31,
                totalPointsWon: 82
            }
        }
    },
    {
        id: 105,
        tournament: {
            name: 'ATP Doha',
            surface: 'Hard',
            location: 'Doha, Qatar',
            category: 'ATP 250',
            code: 'doha'
        },
        status: 'completed',
        court: 'Central',
        round: 'Primera Ronda',
        startTime: '2024-02-17T15:20:00Z',
        player1: {
            name: 'Carlos Alcaraz',
            country: 'España',
            countryCode: 'ES',
            seed: 3,
            ranking: 2,
            avatar: 'https://ui-avatars.com/api/?name=CA&background=2e8b57&color=fff&size=40'
        },
        player2: {
            name: 'Marin Cilic',
            country: 'Croacia',
            countryCode: 'HR',
            seed: null,
            ranking: 192,
            avatar: 'https://ui-avatars.com/api/?name=MC&background=333&color=fff&size=40'
        },
        score: {
            sets: [
                { player1: 6, player2: 4 },
                { player1: 6, player2: 4 }
            ],
            currentSet: 2
        },
        stats: {
            player1: {
                aces: 5,
                doubleFaults: 1,
                firstServePercentage: 72,
                winners: 29,
                unforcedErrors: 18,
                totalPointsWon: 78
            },
            player2: {
                aces: 8,
                doubleFaults: 3,
                firstServePercentage: 65,
                winners: 25,
                unforcedErrors: 24,
                totalPointsWon: 65
            }
        }
    }
];

// Datos de ejemplo para partidos de Badosa
const SAMPLE_BADOSA_MATCHES = [
    {
        id: 'b1',
        tournament: {
            name: 'WTA Madrid',
            surface: 'Clay'
        },
        round: 'Cuartos de Final',
        court: 'Pista Central',
        startTime: '2023-05-03T14:00:00',
        status: 'completed',
        player1: {
            name: 'Paula Badosa',
            country: 'España',
            countryCode: 'ES',
            ranking: 3,
            seed: 2
        },
        player2: {
            name: 'Aryna Sabalenka',
            country: 'Bielorrusia',
            countryCode: 'BY',
            ranking: 7,
            seed: 8
        },
        score: {
            sets: [
                { player1: 6, player2: 2 },
                { player1: 3, player2: 6 },
                { player1: 2, player2: 6 }
            ],
            currentSet: 3
        }
    },
    {
        id: 'b2',
        tournament: {
            name: 'WTA Roma',
            surface: 'Clay'
        },
        round: 'Segunda Ronda',
        court: 'Campo 1',
        startTime: '2023-05-12T11:30:00',
        status: 'completed',
        player1: {
            name: 'Paula Badosa',
            country: 'España',
            countryCode: 'ES',
            ranking: 3,
            seed: 2
        },
        player2: {
            name: 'Coco Gauff',
            country: 'Estados Unidos',
            countryCode: 'US',
            ranking: 15,
            seed: 15
        },
        score: {
            sets: [
                { player1: 6, player2: 4 },
                { player1: 6, player2: 3 }
            ],
            currentSet: 2
        }
    },
    {
        id: 'b3',
        tournament: {
            name: 'Roland Garros',
            surface: 'Clay'
        },
        round: 'Tercera Ronda',
        court: 'Philippe Chatrier',
        startTime: '2023-06-02T13:00:00',
        status: 'live',
        player1: {
            name: 'Paula Badosa',
            country: 'España',
            countryCode: 'ES',
            ranking: 3,
            seed: 2
        },
        player2: {
            name: 'Iga Swiatek',
            country: 'Polonia',
            countryCode: 'PL',
            ranking: 1,
            seed: 1
        },
        score: {
            sets: [
                { player1: 4, player2: 6 },
                { player1: 6, player2: 4 },
                { player1: 3, player2: 2 }
            ],
            currentSet: 3,
            currentGame: {
                player1: '30',
                player2: '15',
                server: 'player1'
            }
        }
    },
    {
        id: 'b4',
        tournament: {
            name: 'Wimbledon',
            surface: 'Grass'
        },
        round: 'Primera Ronda',
        court: 'Court 1',
        startTime: '2023-07-03T12:00:00',
        status: 'upcoming',
        player1: {
            name: 'Paula Badosa',
            country: 'España',
            countryCode: 'ES',
            ranking: 3,
            seed: 2
        },
        player2: {
            name: 'Emma Raducanu',
            country: 'Reino Unido',
            countryCode: 'GB',
            ranking: 12,
            seed: 10
        },
        score: null
    }
];

// Añadir la función buscarPartidosAlcaraz al objeto TennisAPI
window.TennisAPI = {
    showAlcarazMatchDetails,
    buscarPartidosAlcaraz
};

// Función para manejar el evento onclick del checkbox
function toggleCompletedMatches(checked) {
    console.log('toggleCompletedMatches llamado con:', checked);
    SHOW_COMPLETED_MATCHES = checked;
    applyMatchesFilter();
}

// Asegurarse de que la función esté disponible globalmente
window.toggleCompletedMatches = toggleCompletedMatches;

// Función para buscar partidos de Paula Badosa
async function buscarPartidosBadosa() {
    try {
        // Mostrar indicador de carga
        MATCHES_GRID.innerHTML = '';
        document.querySelector('#tennis-section .loading').style.display = 'flex';
        
        let data;
        
        try {
            // Intentar obtener datos de la API real
            data = await TennisAPI.getPlayerMatches('badosa', 10);
            console.log('Datos obtenidos de la API:', data);
        } catch (apiError) {
            console.warn('Error al obtener datos de la API, usando datos de ejemplo:', apiError);
            // Si hay un error con la API, usar datos de ejemplo como fallback
            data = SAMPLE_BADOSA_MATCHES;
        }
        
        // Ocultar indicador de carga
        document.querySelector('#tennis-section .loading').style.display = 'none';
        
        // Mostrar mensaje si no hay partidos
        if (!data || data.length === 0) {
            MATCHES_GRID.innerHTML = '<div class="no-matches">No hay partidos disponibles para Paula Badosa en este momento.</div>';
            return;
        }
        
        // Renderizar partidos
        data.forEach(match => {
            const matchCard = createBadosaMatchCard(match);
            MATCHES_GRID.appendChild(matchCard);
        });
        
        // Actualizar el banner del torneo
        document.querySelector('.tournament-banner h2').textContent = 'Partidos de Paula Badosa';
        document.querySelector('.tournament-banner p').textContent = 'Últimos partidos y próximos encuentros';
        
        // Aplicar filtro de partidos finalizados
        applyMatchesFilter();
        
    } catch (error) {
        console.error('Error al cargar los partidos de Badosa:', error);
        document.querySelector('#tennis-section .loading').style.display = 'none';
        MATCHES_GRID.innerHTML = '<div class="error-message">Error al cargar los partidos. Por favor, intenta de nuevo más tarde.</div>';
    }
}

// Crear tarjeta de partido para Badosa
function createBadosaMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.setAttribute('data-match-id', match.id);
    
    // Determinar el estado del partido
    let statusClass = '';
    let statusText = '';
    
    if (match.status === 'completed') {
        statusClass = 'completed';
        statusText = 'Finalizado';
        
        // Aplicar filtro si es necesario
        if (!SHOW_COMPLETED_MATCHES) {
            card.classList.add('filtered');
        }
    } else if (match.status === 'live') {
        statusClass = 'live';
        statusText = 'En Vivo';
    } else {
        statusClass = 'upcoming';
        statusText = 'Próximamente';
    }
    
    // Determinar si Badosa es player1 o player2
    const isBadosaPlayer1 = match.player1.name.includes('Badosa');
    const badosa = isBadosaPlayer1 ? match.player1 : match.player2;
    const opponent = isBadosaPlayer1 ? match.player2 : match.player1;
    
    // Crear el HTML de la tarjeta
    card.innerHTML = `
        <div class="match-header">
            <div class="tournament-info">
                <span class="tournament-name">${match.tournament.name}</span>
                <span class="match-round">${match.round}</span>
            </div>
            <div class="match-status ${statusClass}">${statusText}</div>
        </div>
        <div class="match-content">
            <div class="player player1">
                <div class="player-info">
                    <div class="player-avatar">
                        <img src="${badosa.avatar || 'https://ui-avatars.com/api/?name=' + badosa.name.substring(0,2) + '&background=ff9999&color=fff&size=40'}" alt="${badosa.name}">
                    </div>
                    <div class="player-details">
                        <div class="player-name">${badosa.name}</div>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${badosa.countryCode.toLowerCase()}.png" alt="${badosa.country}">
                            <span>${badosa.country}</span>
                        </div>
                    </div>
                </div>
                <div class="player-score">
                    ${renderBadosaScore(match.score, isBadosaPlayer1 ? 'player1' : 'player2')}
                </div>
            </div>
            <div class="player player2">
                <div class="player-info">
                    <div class="player-avatar">
                        <img src="${opponent.avatar || 'https://ui-avatars.com/api/?name=' + opponent.name.substring(0,2) + '&background=333&color=fff&size=40'}" alt="${opponent.name}">
                    </div>
                    <div class="player-details">
                        <div class="player-name">${opponent.name}</div>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${opponent.countryCode.toLowerCase()}.png" alt="${opponent.country}">
                            <span>${opponent.country}</span>
                        </div>
                    </div>
                </div>
                <div class="player-score">
                    ${renderBadosaScore(match.score, isBadosaPlayer1 ? 'player2' : 'player1')}
                </div>
            </div>
        </div>
        <div class="match-footer">
            <div class="match-court"><i class="fas fa-map-marker-alt"></i> ${match.court}</div>
            <div class="match-time"><i class="far fa-clock"></i> ${formatMatchTime(match.startTime)}</div>
        </div>
    `;
    
    // Evento para mostrar detalles del partido
    card.addEventListener('click', function() {
        showBadosaMatchDetails(match, isBadosaPlayer1);
    });
    
    return card;
}

// Renderizar puntuación para partidos de Badosa
function renderBadosaScore(score, player) {
    // Reutilizamos la misma función que para Alcaraz
    return renderAlcarazScore(score, player);
}

// Mostrar detalles del partido de Badosa en el modal
function showBadosaMatchDetails(match, isBadosaPlayer1) {
    // Reutilizamos la misma función que para Alcaraz, cambiando los colores
    const badosa = isBadosaPlayer1 ? match.player1 : match.player2;
    const opponent = isBadosaPlayer1 ? match.player2 : match.player1;
    
    // Determinar el estado del partido
    let statusClass = '';
    let statusText = '';
    
    if (match.status === 'completed') {
        statusClass = 'completed';
        statusText = 'Finalizado';
    } else if (match.status === 'live') {
        statusClass = 'live';
        statusText = 'En Vivo';
    } else {
        statusClass = 'upcoming';
        statusText = 'Próximamente';
    }
    
    // Construir el HTML para los detalles del partido
    MATCH_DETAILS.innerHTML = `
        <div class="match-detail-header">
            <div class="tournament-detail">
                <h2>${match.tournament.name}</h2>
                <p>${match.round} - ${match.court}</p>
            </div>
            <div class="match-status ${statusClass}">
                ${statusText}
            </div>
        </div>
        
        <div class="match-detail-content">
            <div class="players-container">
                <div class="player-detail player1">
                    <div class="player-avatar">
                        <img src="${badosa.avatar || 'https://ui-avatars.com/api/?name=' + badosa.name.substring(0,2) + '&background=ff9999&color=fff&size=80'}" alt="${badosa.name}">
                    </div>
                    <div class="player-info">
                        <h3>${badosa.name}</h3>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${badosa.countryCode.toLowerCase()}.png" alt="${badosa.country}">
                            <span>${badosa.country}</span>
                        </div>
                        <div class="player-ranking">Ranking: #${badosa.ranking}</div>
                        <div class="player-seed">Seed: ${badosa.seed || 'N/A'}</div>
                    </div>
                </div>
                
                <div class="score-detail">
                    ${renderDetailedAlcarazScore(match.score, isBadosaPlayer1)}
                </div>
                
                <div class="player-detail player2">
                    <div class="player-avatar">
                        <img src="${opponent.avatar || 'https://ui-avatars.com/api/?name=' + opponent.name.substring(0,2) + '&background=333&color=fff&size=80'}" alt="${opponent.name}">
                    </div>
                    <div class="player-info">
                        <h3>${opponent.name}</h3>
                        <div class="player-country">
                            <img src="https://flagcdn.com/16x12/${opponent.countryCode.toLowerCase()}.png" alt="${opponent.country}">
                            <span>${opponent.country}</span>
                        </div>
                        <div class="player-ranking">Ranking: #${opponent.ranking}</div>
                        <div class="player-seed">Seed: ${opponent.seed || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div class="match-stats">
                <h3>Estadísticas del Partido</h3>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>${badosa.name}</th>
                            <th>Estadística</th>
                            <th>${opponent.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player1' : 'player2'].aces : '-'}</td>
                            <td>Aces</td>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player2' : 'player1'].aces : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player1' : 'player2'].doubleFaults : '-'}</td>
                            <td>Dobles Faltas</td>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player2' : 'player1'].doubleFaults : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player1' : 'player2'].firstServePercentage + '%' : '-'}</td>
                            <td>% Primer Servicio</td>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player2' : 'player1'].firstServePercentage + '%' : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player1' : 'player2'].winners : '-'}</td>
                            <td>Winners</td>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player2' : 'player1'].winners : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player1' : 'player2'].unforcedErrors : '-'}</td>
                            <td>Errores No Forzados</td>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player2' : 'player1'].unforcedErrors : '-'}</td>
                        </tr>
                        <tr>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player1' : 'player2'].totalPointsWon : '-'}</td>
                            <td>Total de Puntos Ganados</td>
                            <td>${match.stats ? match.stats[isBadosaPlayer1 ? 'player2' : 'player1'].totalPointsWon : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    MATCH_MODAL.style.display = 'block';
}

