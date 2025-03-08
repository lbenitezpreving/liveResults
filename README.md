# Tennis Live - Resultados de Tenis en Vivo

Una aplicación web moderna para visualizar resultados de partidos de tenis en vivo de los torneos Grand Slam (Australian Open, Roland Garros, Wimbledon y US Open).

![Tennis Live Preview](https://via.placeholder.com/800x400?text=Tennis+Live+Preview)

## Características

- Visualización de partidos en vivo con diseño moderno y atractivo
- Filtrado por torneos Grand Slam
- Detalles completos de cada partido al hacer clic en una tarjeta
- Estadísticas detalladas de los jugadores
- Diseño responsive para todos los dispositivos
- Iconografía relacionada con el tenis
- Actualización periódica de resultados

## Tecnologías utilizadas

- HTML5
- CSS3 (con variables CSS, Flexbox y Grid)
- JavaScript (ES6+)
- Font Awesome para iconos
- Google Fonts
- API de banderas (flagcdn.com)

## Configuración de la API

Para obtener datos reales de partidos de tenis en vivo, necesitas configurar una API. En este proyecto, se ha preparado para usar una API de RapidAPI, pero puedes adaptarlo a cualquier otra API de tenis.

### Opciones de APIs recomendadas:

1. **API-Sports (Tennis API)** - [https://rapidapi.com/api-sports/api/api-tennis/](https://rapidapi.com/api-sports/api/api-tennis/)
2. **SportsData.io** - [https://sportsdata.io/developers/api-documentation/tennis](https://sportsdata.io/developers/api-documentation/tennis)
3. **SportRadar** - [https://developer.sportradar.com/docs/read/tennis/Tennis_v2](https://developer.sportradar.com/docs/read/tennis/Tennis_v2)

### Pasos para configurar la API:

1. Regístrate en la plataforma de API que prefieras
2. Obtén tu API key
3. Abre el archivo `script.js`
4. Reemplaza el valor de la constante `API_KEY` con tu clave:

```javascript
const API_KEY = 'tu_api_key'; // Reemplazar con tu API key real
```

5. Descomenta y adapta la función `fetchLiveMatches()` según la documentación de la API que hayas elegido.

## Modo de desarrollo

Actualmente, la aplicación está configurada para funcionar con datos de ejemplo (SAMPLE_MATCHES) para facilitar el desarrollo y las pruebas. Para cambiar a datos reales de la API:

1. En la función `loadMatches()`, comenta las líneas relacionadas con los datos de ejemplo:

```javascript
// Usamos datos de ejemplo para desarrollo
// let matches = SAMPLE_MATCHES;
```

2. Descomenta las líneas relacionadas con la llamada a la API:

```javascript
const response = await fetchLiveMatches(tournament);
const matches = await response.json();
```

## Instalación y uso

1. Clona este repositorio:
```
git clone https://github.com/tu-usuario/tennis-live.git
```

2. Abre el archivo `index.html` en tu navegador web

3. Para desarrollo, puedes usar un servidor local como Live Server en VS Code

## Personalización

Puedes personalizar fácilmente la apariencia de la aplicación modificando las variables CSS en el archivo `styles.css`:

```css
:root {
    --primary-color: #2e8b57; /* Verde tenis */
    --secondary-color: #f8f8f8;
    --accent-color: #ffcc00; /* Amarillo pelota de tenis */
    --dark-color: #333;
    --light-color: #fff;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --border-radius: 8px;
}
```

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes alguna mejora, no dudes en abrir un issue o enviar un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

---

Desarrollado con ❤️ por Leo Benítez
