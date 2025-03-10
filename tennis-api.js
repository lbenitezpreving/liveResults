/**
 * Módulo para manejar las llamadas a la API de API-Sports para tenis
 * Documentación: https://api-sports.io/documentation/tennis/v1
 */

// Configuración de la API
const API_CONFIG = {
    baseUrl: 'https://v1.tennis.api-sports.io',
    headers: {
        'x-rapidapi-key': CONFIG.TENNIS_API_KEY || 'TU_API_KEY_AQUI', // Usa la clave del archivo config.js
        'x-rapidapi-host': 'v1.tennis.api-sports.io'
    }
};

// IDs de los jugadores (estos IDs son ejemplos, debes usar los IDs reales de la API)
const PLAYER_IDS = {
    'alcaraz': 202, // ID de Carlos Alcaraz en la API
    'badosa': 215   // ID de Paula Badosa en la API
};

/**
 * Obtiene los partidos de un jugador específico
 * @param {string} playerName - Nombre del jugador ('alcaraz' o 'badosa')
 * @param {number} limit - Número máximo de partidos a obtener
 * @returns {Promise<Array>} - Promesa que resuelve a un array de partidos
 */
async function getPlayerMatches(playerName, limit = 10) {
    try {
        const playerId = PLAYER_IDS[playerName.toLowerCase()];
        
        if (!playerId) {
            throw new Error(`Jugador no configurado: ${playerName}`);
        }
        
        const url = `${API_CONFIG.baseUrl}/players/${playerId}/matches/last/${limit}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: API_CONFIG.headers
        });
        
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Verificar si la respuesta contiene datos válidos
        if (!data || !data.response || !Array.isArray(data.response)) {
            console.warn('La API no devolvió datos válidos:', data);
            return [];
        }
        
        // Transformar los datos al formato esperado por nuestra aplicación
        return transformApiMatches(data.response, playerName);
        
    } catch (error) {
        console.error(`Error al obtener partidos de ${playerName}:`, error);
        throw error;
    }
}

/**
 * Transforma los datos de la API al formato esperado por nuestra aplicación
 * @param {Array} apiMatches - Partidos obtenidos de la API
 * @param {string} playerName - Nombre del jugador ('alcaraz' o 'badosa')
 * @returns {Array} - Partidos en el formato de nuestra aplicación
 */
function transformApiMatches(apiMatches, playerName) {
    return apiMatches.map((match, index) => {
        // Determinar si nuestro jugador es el jugador 1 o 2 en el partido
        const isPlayerOne = match.players.player1.id === PLAYER_IDS[playerName.toLowerCase()];
        
        // Crear objetos de jugador en nuestro formato
        const player1 = {
            name: match.players.player1.name,
            country: match.players.player1.country.name,
            countryCode: match.players.player1.country.code,
            ranking: match.players.player1.ranking || 0,
            seed: match.players.player1.seed || null
        };
        
        const player2 = {
            name: match.players.player2.name,
            country: match.players.player2.country.name,
            countryCode: match.players.player2.country.code,
            ranking: match.players.player2.ranking || 0,
            seed: match.players.player2.seed || null
        };
        
        // Determinar el estado del partido
        let status = 'upcoming';
        if (match.status.short === 'FT') {
            status = 'completed';
        } else if (match.status.short === 'LIVE') {
            status = 'live';
        }
        
        // Transformar el puntaje
        const score = transformScore(match.scores, status);
        
        // Crear el objeto de partido en nuestro formato
        return {
            id: `api-${match.id || index}`,
            tournament: {
                name: match.tournament.name,
                surface: match.tournament.surface || 'Unknown'
            },
            round: match.round || 'Unknown Round',
            court: match.venue.name || 'Unknown Court',
            startTime: match.date,
            status: status,
            player1: player1,
            player2: player2,
            score: score,
            // Añadir estadísticas si están disponibles
            stats: match.statistics ? transformStats(match.statistics) : null
        };
    });
}

/**
 * Transforma el puntaje de la API a nuestro formato
 * @param {Object} apiScores - Puntaje de la API
 * @param {string} status - Estado del partido
 * @returns {Object} - Puntaje en nuestro formato
 */
function transformScore(apiScores, status) {
    if (!apiScores || !apiScores.sets) {
        return null;
    }
    
    // Transformar los sets
    const sets = [];
    for (let i = 1; i <= 5; i++) {
        const setKey = `set${i}`;
        if (apiScores.sets[setKey]) {
            sets.push({
                player1: parseInt(apiScores.sets[setKey].player1) || 0,
                player2: parseInt(apiScores.sets[setKey].player2) || 0
            });
        }
    }
    
    // Si no hay sets, devolver null
    if (sets.length === 0) {
        return null;
    }
    
    // Crear objeto de puntaje
    const score = {
        sets: sets,
        currentSet: sets.length
    };
    
    // Añadir información del juego actual si el partido está en vivo
    if (status === 'live' && apiScores.game) {
        score.currentGame = {
            player1: apiScores.game.player1 || '0',
            player2: apiScores.game.player2 || '0',
            server: apiScores.game.server === '1' ? 'player1' : 'player2'
        };
    }
    
    return score;
}

/**
 * Transforma las estadísticas de la API a nuestro formato
 * @param {Object} apiStats - Estadísticas de la API
 * @returns {Object} - Estadísticas en nuestro formato
 */
function transformStats(apiStats) {
    if (!apiStats) {
        return null;
    }
    
    return {
        player1: {
            aces: apiStats.player1.aces || 0,
            doubleFaults: apiStats.player1.double_faults || 0,
            firstServePercentage: apiStats.player1.first_serve_percentage || 0,
            winners: apiStats.player1.winners || 0,
            unforcedErrors: apiStats.player1.unforced_errors || 0,
            totalPointsWon: apiStats.player1.total_points_won || 0
        },
        player2: {
            aces: apiStats.player2.aces || 0,
            doubleFaults: apiStats.player2.double_faults || 0,
            firstServePercentage: apiStats.player2.first_serve_percentage || 0,
            winners: apiStats.player2.winners || 0,
            unforcedErrors: apiStats.player2.unforced_errors || 0,
            totalPointsWon: apiStats.player2.total_points_won || 0
        }
    };
}

// Exportar las funciones para usar en otros archivos
const TennisAPI = {
    getPlayerMatches
}; 