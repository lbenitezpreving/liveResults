// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la navegación entre deportes
    initSportsNavigation();
});

// Inicializar la navegación entre deportes
function initSportsNavigation() {
    // Evento para cambiar entre deportes
    document.querySelectorAll('.sport-item').forEach(item => {
        item.addEventListener('click', function() {
            const sportId = this.getAttribute('data-sport');
            
            // Actualizar clase activa en el menú
            document.querySelectorAll('.sport-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar la sección correspondiente
            document.querySelectorAll('.sport-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${sportId}-section`).classList.add('active');
            
            // Si es F1, cargar datos específicos
            if (sportId === 'f1') {
                // Verificar si estamos en la pestaña de pilotos o circuitos
                const activeTab = document.querySelector('#f1-section nav li.active');
                if (activeTab) {
                    const tabId = activeTab.getAttribute('data-race');
                    if (tabId === 'drivers') {
                        window.F1API.loadDrivers();
                    } else if (tabId === 'circuits') {
                        window.F1API.loadCircuits();
                    }
                }
            }
        });
    });

    // Evento para cambiar entre pestañas de F1
    document.querySelectorAll('#f1-section nav li').forEach(item => {
        item.addEventListener('click', function() {
            const raceTab = this.getAttribute('data-race');
            
            // Actualizar clase activa
            document.querySelectorAll('#f1-section nav li').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.race-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Mostrar el contenido de la carrera actual si es la pestaña seleccionada
            if (raceTab === 'current') {
                document.querySelector('.race-info-container').style.display = 'block';
            } else {
                document.querySelector('.race-info-container').style.display = 'none';
                document.getElementById(`race-${raceTab}`).style.display = 'block';
                
                // Cargar datos específicos según la pestaña
                if (raceTab === 'drivers') {
                    window.F1API.loadDrivers();
                } else if (raceTab === 'circuits') {
                    window.F1API.loadCircuits();
                }
            }
        });
    });
} 