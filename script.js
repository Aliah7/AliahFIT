// ===== ALIAH APP - VERSIÓN FINAL CORREGIDA =====
class AliahApp {
    constructor() {
        // Sistema de datos unificado
        this.appData = {
            users: {},
            routines: {},
            workouts: {},
            settings: {},
            ratings: {},
            calendar: {}
        };
        
        // Estado actual
        this.currentUser = null;
        this.currentPage = 'home';
        this.pageHistory = [];
        
        // Playlist/Reproductor
        this.currentRoutine = null;
        this.isPlaying = false;
        this.isPlayerMinimized = false;
        this.currentRoundIndex = 0;
        this.currentExerciseIndex = 0;
        this.currentExercise = null;
        this.playlistTimer = null;
        this.totalTimer = null;
        this.timeLeft = 0;
        this.totalTime = 0;
        this.totalElapsedTime = 0;
        this.playbackState = null;
        this.restTimer = null;
        this.isResting = false;
        
        // Creación de rutina
        this.creatingRoutine = {
            name: '',
            description: '',
            rounds: [],
            currentRoundId: 1
        };
        this.currentStep = 'basic';
        this.editingRoutineId = null;
        
        // Sistema de calificación
        this.selectedRating = 0;
        
        // Calendario
        this.currentCalendarDate = new Date();
        
        // Sonidos
        this.soundsEnabled = true;
        this.exerciseSound = document.getElementById('exercise-start-sound');
        this.restSound = document.getElementById('rest-start-sound');
        this.completeSound = document.getElementById('complete-sound');
        
        this.init();
    }
    
    // ===== INICIALIZACIÓN =====
    init() {
        console.log('🚀 Iniciando aplicación Aliah...');
        
        // Cargar datos primero
        this.loadAllData();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Verificar autenticación
        this.checkAuth();
        
        console.log('✅ Aplicación inicializada correctamente');
    }
    
    // ===== SISTEMA DE DATOS UNIFICADO =====
    loadAllData() {
        try {
            const saved = localStorage.getItem('aliah_app_data');
            if (saved) {
                this.appData = JSON.parse(saved);
            } else {
                this.initializeDemoData();
            }
        } catch (e) {
            console.error('Error cargando datos:', e);
            this.initializeDemoData();
        }
    }
    
    initializeDemoData() {
        const demoRoutine = {
            id: 1,
            name: 'Full Body',
            description: 'Rutina completa para todo el cuerpo',
            duration: 45,
            rounds: 3,
            calories: 320,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 5,
            difficulty: 'media',
            roundsData: [
                {
                    id: 1,
                    name: 'Ronda 1',
                    restTime: 60,
                    reps: 3,
                    exercises: [
                        { id: 1, name: 'Flexiones', type: 'time', value: 45, unit: 'seg' },
                        { id: 2, name: 'Sentadillas', type: 'time', value: 60, unit: 'seg' }
                    ]
                },
                {
                    id: 2,
                    name: 'Ronda 2',
                    restTime: 60,
                    reps: 3,
                    exercises: [
                        { id: 3, name: 'Plancha', type: 'time', value: 30, unit: 'seg' },
                        { id: 4, name: 'Burpees', type: 'time', value: 45, unit: 'seg' },
                        { id: 5, name: 'Mountain Climbers', type: 'reps', value: 20, unit: 'reps' }
                    ]
                },
                {
                    id: 3,
                    name: 'Ronda 3',
                    restTime: 45,
                    reps: 2,
                    exercises: [
                        { id: 6, name: 'Abdominales', type: 'reps', value: 15, unit: 'reps' }
                    ]
                }
            ]
        };
        
        const basicRoutine = {
            id: 2,
            name: 'Rutina Básica',
            description: 'Rutina inicial para principiantes',
            duration: 20,
            rounds: 2,
            calories: 150,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 2,
            difficulty: 'baja',
            roundsData: [
                {
                    id: 1,
                    name: 'Ronda 1',
                    restTime: 30,
                    reps: 2,
                    exercises: [
                        { id: 1, name: 'Flexiones', type: 'time', value: 30, unit: 'seg' },
                        { id: 2, name: 'Sentadillas', type: 'reps', value: 15, unit: 'reps' }
                    ]
                }
            ]
        };
        
        this.appData = {
            users: {
                'aliah': { 
                    password: '1234', 
                    email: 'aliah@demo.com', 
                    createdAt: new Date().toISOString(),
                    goals: {
                        weight: 70,
                        endurance: 80,
                        strength: 90
                    }
                },
                'demo': { 
                    password: '1234', 
                    email: 'demo@demo.com', 
                    createdAt: new Date().toISOString(),
                    goals: {
                        weight: 65,
                        endurance: 70,
                        strength: 75
                    }
                }
            },
            routines: {
                'aliah': [demoRoutine],
                'demo': [basicRoutine]
            },
            workouts: {
                'aliah': [
                    {
                        id: Date.now(),
                        routineId: 1,
                        routineName: 'Full Body',
                        date: new Date().toISOString().split('T')[0],
                        duration: 2700,
                        calories: 320,
                        completed: true,
                        rating: 2,
                        notes: 'Buena sesión, sentí el progreso'
                    }
                ],
                'demo': []
            },
            settings: {
                'aliah': { 
                    sounds: true, 
                    notifications: true, 
                    theme: 'default',
                    autoPlay: true,
                    showTips: true
                },
                'demo': { 
                    sounds: true, 
                    notifications: false, 
                    theme: 'default',
                    autoPlay: false,
                    showTips: true
                }
            },
            ratings: {
                'aliah': [
                    {
                        id: Date.now(),
                        routineId: 1,
                        routineName: 'Full Body',
                        rating: 2,
                        notes: 'Buena sesión, sentí el progreso',
                        date: new Date().toISOString().split('T')[0],
                        duration: 2700,
                        calories: 320
                    }
                ],
                'demo': []
            },
            calendar: {
                'aliah': {
                    '2023-05-15': { type: 'completed', calories: 320, duration: 45 },
                    '2023-05-16': { type: 'rest-day' },
                    '2023-05-17': { type: 'completed', calories: 280, duration: 40 },
                    '2023-05-18': { type: 'completed', calories: 300, duration: 42 },
                    '2023-05-20': { type: 'rest-day' }
                },
                'demo': {}
            }
        };
        
        this.saveAllData();
    }
    
    saveAllData() {
        try {
            localStorage.setItem('aliah_app_data', JSON.stringify(this.appData));
        } catch (e) {
            console.error('Error guardando datos:', e);
            this.showNotification('Error guardando datos', 'error');
        }
    }
    
    // ===== AUTENTICACIÓN =====
    login(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            this.showNotification('Por favor completa todos los campos', 'warning');
            return;
        }
        
        // Usuarios demo
        if ((username === 'aliah' && password === '1234') || 
            (username === 'demo' && password === '1234')) {
            this.currentUser = username;
            this.ensureUserData(username);
            this.showApp();
            this.showNotification(`¡Bienvenido ${username}!`, 'success');
            return;
        }
        
        // Usuarios registrados
        const userData = this.appData.users[username];
        
        if (userData && userData.password === password) {
            this.currentUser = username;
            this.ensureUserData(username);
            this.showApp();
            this.showNotification(`¡Bienvenido de nuevo ${username}!`, 'success');
        } else {
            this.showNotification('Usuario o contraseña incorrectos', 'error');
        }
    }
    
    register(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const email = document.getElementById('register-email').value.trim();
        
        if (!username || !password || !email) {
            this.showNotification('Por favor completa todos los campos', 'warning');
            return;
        }
        
        if (username.length < 3) {
            this.showNotification('El usuario debe tener al menos 3 caracteres', 'warning');
            return;
        }
        
        if (password.length < 4) {
            this.showNotification('La contraseña debe tener al menos 4 caracteres', 'warning');
            return;
        }
        
        if (this.appData.users[username]) {
            this.showNotification('Este usuario ya existe', 'error');
            return;
        }
        
        // Crear usuario
        this.appData.users[username] = {
            password: password,
            email: email,
            createdAt: new Date().toISOString(),
            goals: {
                weight: 70,
                endurance: 75,
                strength: 80
            }
        };
        
        // Inicializar datos del usuario
        this.ensureUserData(username);
        
        this.currentUser = username;
        this.saveAllData();
        this.showApp();
        
        this.showNotification('¡Cuenta creada exitosamente!', 'success');
    }
    
    ensureUserData(username) {
        if (!this.appData.routines[username]) this.appData.routines[username] = [];
        if (!this.appData.workouts[username]) this.appData.workouts[username] = [];
        if (!this.appData.settings[username]) {
            this.appData.settings[username] = { 
                sounds: true, 
                notifications: true, 
                theme: 'default',
                autoPlay: true,
                showTips: true
            };
        }
        if (!this.appData.ratings[username]) this.appData.ratings[username] = [];
        if (!this.appData.calendar[username]) this.appData.calendar[username] = {};
        if (!this.appData.users[username].goals) {
            this.appData.users[username].goals = {
                weight: 70,
                endurance: 75,
                strength: 80
            };
        }
    }
    
    logout() {
        this.savePlaybackState();
        this.currentUser = null;
        this.currentPage = 'home';
        this.pageHistory = [];
        
        document.getElementById('auth-screen').classList.add('active');
        document.getElementById('app').classList.remove('active');
        
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
    }
    
    checkAuth() {
        try {
            const savedUser = sessionStorage.getItem('aliah_currentUser');
            
            if (savedUser && this.appData.users[savedUser]) {
                this.currentUser = savedUser;
                this.showApp();
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ Error en checkAuth:', error);
            return false;
        }
    }
    
    showApp() {
        try {
            // Guardar usuario en sesión
            sessionStorage.setItem('aliah_currentUser', this.currentUser);
            
            // Cambiar pantallas
            const authScreen = document.getElementById('auth-screen');
            const appScreen = document.getElementById('app');
            
            if (authScreen) authScreen.classList.remove('active');
            if (appScreen) appScreen.classList.add('active');
            
            // Actualizar interfaz de usuario
            this.updateUserInterface();
            
            // Cargar datos del usuario
            this.loadUserData();
            
            // Navegar a la página de inicio
            this.navigateToPage('home');
            
            // Actualizar la página de inicio con datos relevantes
            this.updateHomePage();
            
        } catch (error) {
            console.error('❌ Error al mostrar app:', error);
            this.showNotification('Error al iniciar sesión', 'error');
        }
    }
    
    updateUserInterface() {
        document.getElementById('current-user').textContent = this.currentUser;
        document.getElementById('current-user-name').textContent = this.currentUser;
        
        // Actualizar estadísticas rápidas
        const userWorkouts = this.appData.workouts[this.currentUser] || [];
        const thisWeek = this.getWorkoutsThisWeek();
        const totalCalories = userWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        
        document.getElementById('week-sessions').textContent = thisWeek.length;
        document.getElementById('total-calories').textContent = totalCalories.toLocaleString();
        
        // Actualizar sonidos
        this.updateSoundButton();
    }
    
    // ===== PÁGINA DE INICIO =====
    updateHomePage() {
        // 1. Actualizar fecha actual
        this.updateCurrentDate();
        
        // 2. Cargar resumen de estadísticas
        this.loadStatsSummary();
        
        // 3. Cargar resumen de progreso
        this.loadProgressSummary();
        
        // 4. Cargar resumen de rutinas
        this.loadRoutinesSummary();
        
        // 5. Cargar estado de playlist
        this.loadPlaylistSummary();
        
        // 6. Cargar último entrenamiento
        this.loadLastWorkout();
        
        // 7. Cargar objetivos próximos
        this.loadUpcomingGoals();
        
        // 8. Actualizar motivación del día
        this.updateDailyMotivation();
        
        // 9. Actualizar rutinas recientes
        this.loadRecentRoutines();
    }
    
    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('es-ES', options);
        document.getElementById('current-date').textContent = dateStr;
        
        // Actualizar objetivo del día basado en día de la semana
        this.updateTodaysGoal();
    }
    
    updateTodaysGoal() {
        const dayOfWeek = new Date().getDay();
        const goals = [
            "Día de descanso activo - Estiramientos",
            "Rutina de fuerza - Enfoque en tren superior",
            "Cardio intensivo - Quema de grasa",
            "Rutina completa - Full Body",
            "Fuerza y resistencia - Circuit training",
            "Día de descanso - Recuperación",
            "Rutina personalizada - Tu elección"
        ];
        
        const goal = goals[dayOfWeek] || "Rutina recomendada: Full Body";
        document.getElementById('todays-goal').textContent = goal;
        
        // Actualizar nivel de energía basado en día y actividad previa
        this.updateEnergyLevel();
    }
    
    updateEnergyLevel() {
        const workouts = this.appData.workouts[this.currentUser] || [];
        const today = new Date().toISOString().split('T')[0];
        
        // Verificar si ya entrenó hoy
        const trainedToday = workouts.some(w => w.date === today);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const trainedYesterday = workouts.some(w => w.date === yesterdayStr);
        
        let energyLevel = 85; // Nivel base
        
        if (trainedToday) {
            energyLevel = 40; // Ya entrenó hoy
        } else if (!trainedYesterday) {
            energyLevel = 95; // No entrenó ayer, energía alta
        } else if (workouts.length > 3) {
            energyLevel = 75; // Entrenando regularmente
        }
        
        const energyElement = document.getElementById('energy-level');
        if (energyElement) {
            energyElement.style.width = `${energyLevel}%`;
            energyElement.style.backgroundColor = 
                energyLevel > 70 ? '#4CAF50' : 
                energyLevel > 40 ? '#FF9800' : '#F44336';
        }
    }
    
    loadStatsSummary() {
        const userWorkouts = this.appData.workouts[this.currentUser] || [];
        
        // Calcular sesiones esta semana
        const thisWeek = this.getWorkoutsThisWeek();
        document.getElementById('week-sessions').textContent = thisWeek.length;
        
        // Calcular días consecutivos
        const streak = this.calculateStreak();
        document.getElementById('streak-days').textContent = streak;
        
        // Calcular calorías totales
        const totalCalories = userWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        document.getElementById('total-calories').textContent = totalCalories.toLocaleString();
    }
    
    getWorkoutsThisWeek() {
        const workouts = this.appData.workouts[this.currentUser] || [];
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= oneWeekAgo && workout.completed;
        });
    }
    
    calculateStreak() {
        const userCalendar = this.appData.calendar[this.currentUser] || {};
        const dates = Object.keys(userCalendar)
            .filter(date => userCalendar[date].type === 'completed')
            .sort((a, b) => b.localeCompare(a));
        
        if (dates.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (dates.includes(dateStr)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    loadProgressSummary() {
        const workouts = this.appData.workouts[this.currentUser] || [];
        const completedWorkouts = workouts.filter(w => w.completed).length;
        
        // Progreso de peso (simulado)
        const weightProgress = Math.min(100, Math.floor((completedWorkouts / 10) * 100));
        document.getElementById('weight-progress-mini').textContent = `${weightProgress}%`;
        
        // Progreso de resistencia
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const enduranceProgress = Math.min(100, Math.floor((totalDuration / 3600) * 100));
        document.getElementById('endurance-progress-mini').textContent = `${enduranceProgress}%`;
        
        // Progreso de fuerza
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        const strengthProgress = Math.min(100, Math.floor((totalCalories / 5000) * 100));
        document.getElementById('strength-progress-mini').textContent = `${strengthProgress}%`;
        
        // Progreso general
        const overallProgress = Math.floor((weightProgress + enduranceProgress + strengthProgress) / 3);
        const progressCircle = document.getElementById('overall-progress');
        const progressPercent = document.querySelector('.progress-percent');
        
        if (progressCircle && progressPercent) {
            progressCircle.style.background = `
                conic-gradient(var(--wine) ${overallProgress * 3.6}deg, 
                            var(--light-gray) ${overallProgress * 3.6}deg)
            `;
            progressPercent.textContent = `${overallProgress}%`;
        }
        
        // Mensaje de progreso
        const progressMessage = document.getElementById('progress-message');
        if (progressMessage) {
            if (overallProgress === 0) {
                progressMessage.textContent = 'Comienza tu primer entrenamiento';
            } else if (overallProgress < 30) {
                progressMessage.textContent = '¡Buen comienzo! Sigue así';
            } else if (overallProgress < 70) {
                progressMessage.textContent = '¡Excelente progreso!';
            } else {
                progressMessage.textContent = '¡Casi alcanzas tus metas!';
            }
        }
    }
    
    loadRoutinesSummary() {
        const userRoutines = this.appData.routines[this.currentUser] || [];
        
        // Contador de rutinas
        document.getElementById('routine-count').textContent = userRoutines.length;
        
        // Rutina más usada esta semana
        const mostUsed = this.getMostUsedRoutineThisWeek();
        document.getElementById('most-used-routine').textContent = mostUsed || 'Ninguna';
    }
    
    getMostUsedRoutineThisWeek() {
        const thisWeekWorkouts = this.getWorkoutsThisWeek();
        const routineCount = {};
        
        thisWeekWorkouts.forEach(workout => {
            if (workout.routineName) {
                routineCount[workout.routineName] = (routineCount[workout.routineName] || 0) + 1;
            }
        });
        
        let mostUsed = null;
        let maxCount = 0;
        
        for (const [routine, count] of Object.entries(routineCount)) {
            if (count > maxCount) {
                mostUsed = routine;
                maxCount = count;
            }
        }
        
        return mostUsed;
    }
    
    loadRecentRoutines() {
        const userRoutines = this.appData.routines[this.currentUser] || [];
        const recentRoutinesList = document.getElementById('recent-routines-list');
        
        if (userRoutines.length === 0) {
            recentRoutinesList.innerHTML = '<p class="empty-text">No hay rutinas creadas</p>';
            return;
        }
        
        // Ordenar por fecha de actualización
        const sortedRoutines = [...userRoutines].sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA;
        }).slice(0, 3); // Solo 3 más recientes
        
        recentRoutinesList.innerHTML = sortedRoutines.map(routine => `
            <div class="recent-routine-item" onclick="aliahApp.useRoutineInPlaylist(${routine.id})">
                <i class="fas fa-dumbbell"></i>
                <div>
                    <strong>${routine.name}</strong>
                    <small>${this.formatDate(routine.updatedAt || routine.createdAt)}</small>
                </div>
                <span class="routine-stats">${routine.duration}min</span>
            </div>
        `).join('');
    }
    
    loadPlaylistSummary() {
        const statusIndicator = document.getElementById('playlist-status-indicator');
        const playlistInfo = document.getElementById('current-playlist-info');
        
        if (this.currentRoutine && this.isPlaying) {
            // Playlist activa
            statusIndicator.innerHTML = '<i class="fas fa-play-circle"></i><span>En reproducción</span>';
            statusIndicator.className = 'status-indicator active';
            
            playlistInfo.innerHTML = `
                <strong>${this.currentRoutine.name}</strong>
                <small>Ronda ${this.currentRoundIndex + 1} • Ejercicio ${this.currentExerciseIndex + 1}</small>
            `;
        } else if (this.currentRoutine) {
            // Playlist cargada pero no activa
            statusIndicator.innerHTML = '<i class="fas fa-pause-circle"></i><span>Lista para comenzar</span>';
            statusIndicator.className = 'status-indicator ready';
            
            playlistInfo.innerHTML = `
                <strong>${this.currentRoutine.name}</strong>
                <small>${this.currentRoutine.duration}min • ${this.currentRoutine.rounds} rondas</small>
            `;
        } else {
            // No hay playlist
            statusIndicator.innerHTML = '<i class="fas fa-stop-circle"></i><span>No activa</span>';
            statusIndicator.className = 'status-indicator inactive';
            
            playlistInfo.innerHTML = '<p>Selecciona una rutina en la página de Playlist</p>';
        }
    }
    
    loadLastWorkout() {
        const userWorkouts = this.appData.workouts[this.currentUser] || [];
        const lastWorkoutInfo = document.getElementById('last-workout-info');
        
        if (userWorkouts.length === 0) {
            lastWorkoutInfo.innerHTML = '<p class="empty-text">No hay entrenamientos registrados</p>';
            return;
        }
        
        // Ordenar por fecha (más reciente primero)
        const sortedWorkouts = [...userWorkouts].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        const lastWorkout = sortedWorkouts[0];
        const date = new Date(lastWorkout.date);
        const formattedDate = date.toLocaleDateString('es-ES', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
        });
        
        lastWorkoutInfo.innerHTML = `
            <div class="workout-summary">
                <div class="workout-header">
                    <strong>${lastWorkout.routineName || 'Entrenamiento personalizado'}</strong>
                    <span class="workout-date">${formattedDate}</span>
                </div>
                <div class="workout-stats">
                    <span><i class="fas fa-clock"></i> ${Math.floor(lastWorkout.duration / 60)}min</span>
                    <span><i class="fas fa-fire"></i> ${lastWorkout.calories} cal</span>
                    ${lastWorkout.rating ? `<span><i class="fas fa-star"></i> ${lastWorkout.rating}/3</span>` : ''}
                </div>
                ${lastWorkout.notes ? `<p class="workout-notes">"${lastWorkout.notes}"</p>` : ''}
            </div>
        `;
    }
    
    loadUpcomingGoals() {
        const upcomingGoals = document.getElementById('upcoming-goals');
        const userWorkouts = this.appData.workouts[this.currentUser] || [];
        const userRoutines = this.appData.routines[this.currentUser] || [];
        
        let goalsHTML = '';
        
        // Objetivo 1: Primera rutina si no hay ninguna
        if (userRoutines.length === 0) {
            goalsHTML += `
                <div class="goal-card">
                    <i class="fas fa-dumbbell"></i>
                    <div>
                        <h4>Crea tu primera rutina</h4>
                        <p>Personaliza tu propio entrenamiento</p>
                    </div>
                    <button class="btn-icon-small" onclick="aliahApp.navigateToPage('routine')">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        }
        
        // Objetivo 2: Primer entrenamiento si no hay
        if (userWorkouts.length === 0) {
            goalsHTML += `
                <div class="goal-card">
                    <i class="fas fa-play-circle"></i>
                    <div>
                        <h4>Completa tu primer entrenamiento</h4>
                        <p>¡Empieza tu camino fitness!</p>
                    </div>
                    <button class="btn-icon-small" onclick="aliahApp.navigateToPage('playlist')">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        }
        
        // Objetivo 3: 3 entrenamientos esta semana
        const thisWeek = this.getWorkoutsThisWeek();
        if (thisWeek.length < 3) {
            goalsHTML += `
                <div class="goal-card">
                    <i class="fas fa-calendar-check"></i>
                    <div>
                        <h4>3 entrenamientos esta semana</h4>
                        <p>${thisWeek.length}/3 completados</p>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-bar" style="width: ${(thisWeek.length / 3) * 100}%;"></div>
                    </div>
                </div>
            `;
        }
        
        // Objetivo 4: Variedad de rutinas
        if (userRoutines.length > 0 && userRoutines.length < 3) {
            goalsHTML += `
                <div class="goal-card">
                    <i class="fas fa-layer-group"></i>
                    <div>
                        <h4>Crea 3 rutinas diferentes</h4>
                        <p>${userRoutines.length}/3 creadas</p>
                    </div>
                    <button class="btn-icon-small" onclick="aliahApp.navigateToPage('routine')">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
        }
        
        if (!goalsHTML) {
            goalsHTML = `
                <div class="goal-card">
                    <i class="fas fa-trophy"></i>
                    <div>
                        <h4>¡Todos los objetivos completados!</h4>
                        <p>Establece nuevos objetivos en Configuración</p>
                    </div>
                </div>
            `;
        }
        
        upcomingGoals.innerHTML = goalsHTML;
    }
    
    updateDailyMotivation() {
        const motivations = [
            "La disciplina es elegir entre lo que quieres ahora y lo que quieres más.",
            "No cuentes los días, haz que los días cuenten.",
            "El único entrenamiento malo es el que no haces.",
            "Tu cuerpo puede soportar casi cualquier cosa. Es tu mente a la que tienes que convencer.",
            "El dolor que sientes hoy será la fuerza que sientas mañana.",
            "No esperes a estar listo. Empieza ahora.",
            "El éxito no es para los que nunca fallan, sino para los que nunca se rinden.",
            "Cada repetición cuenta. Cada gota de sudor vale.",
            "No busques la perfección, busca el progreso.",
            "El único límite es el que te pones a ti mismo."
        ];
        
        const today = new Date().getDate();
        const motivationIndex = today % motivations.length;
        document.getElementById('daily-motivation').textContent = motivations[motivationIndex];
    }
    
    // ===== FUNCIONES DE ACCIÓN RÁPIDA =====
    quickStartWorkout() {
        const userRoutines = this.appData.routines[this.currentUser] || [];
        
        if (userRoutines.length === 0) {
            this.showNotification('Primero crea una rutina', 'warning');
            this.navigateToPage('routine');
            return;
        }
        
        // Buscar rutina más usada o la primera
        let routineToUse = userRoutines[0];
        const mostUsed = userRoutines.reduce((most, current) => {
            return (current.usageCount || 0) > (most.usageCount || 0) ? current : most;
        });
        
        if (mostUsed) {
            routineToUse = mostUsed;
        }
        
        // Navegar a playlist y cargar rutina
        this.navigateToPage('playlist');
        
        setTimeout(() => {
            this.loadRoutine(routineToUse.id.toString());
            setTimeout(() => {
                this.startPlaylist();
            }, 500);
        }, 300);
    }
    
    logRestDay() {
        const today = new Date().toISOString().split('T')[0];
        const userCalendar = this.appData.calendar[this.currentUser] || {};
        
        if (userCalendar[today]) {
            this.showNotification('Ya hay un registro para hoy', 'info');
            return;
        }
        
        userCalendar[today] = {
            type: 'rest-day',
            loggedAt: new Date().toISOString()
        };
        
        this.appData.calendar[this.currentUser] = userCalendar;
        this.saveAllData();
        
        this.showNotification('Día de descanso registrado correctamente', 'success');
        this.updateHomePage();
    }
    
    addQuickWorkout() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Mostrar modal rápido para agregar entrenamiento
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3><i class="fas fa-dumbbell"></i> Agregar Entrenamiento Rápido</h3>
                    <button class="btn-icon close-modal-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Duración (minutos):</label>
                        <input type="number" id="quick-duration" min="5" max="180" value="30">
                    </div>
                    <div class="form-group">
                        <label>Calorías quemadas:</label>
                        <input type="number" id="quick-calories" min="50" max="1000" value="250">
                    </div>
                    <div class="form-group">
                        <label>Tipo de entrenamiento:</label>
                        <select id="quick-workout-type">
                            <option value="Cardio">Cardio</option>
                            <option value="Fuerza">Fuerza</option>
                            <option value="Flexibilidad">Flexibilidad</option>
                            <option value="Mixto">Mixto</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary cancel-quick-workout">
                            Cancelar
                        </button>
                        <button class="btn-primary save-quick-workout">
                            <i class="fas fa-save"></i>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.close-modal-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.cancel-quick-workout').addEventListener('click', () => modal.remove());
        
        modal.querySelector('.save-quick-workout').addEventListener('click', () => {
            const duration = parseInt(modal.querySelector('#quick-duration').value) || 30;
            const calories = parseInt(modal.querySelector('#quick-calories').value) || 250;
            const type = modal.querySelector('#quick-workout-type').value;
            
            // Guardar en calendario
            this.appData.calendar[this.currentUser] = this.appData.calendar[this.currentUser] || {};
            this.appData.calendar[this.currentUser][todayStr] = {
                type: 'completed',
                duration: duration,
                calories: calories,
                workoutType: type,
                date: todayStr
            };
            
            // Crear workout entry
            const workoutId = Date.now();
            const workoutData = {
                id: workoutId,
                routineId: null,
                routineName: `Entrenamiento ${type}`,
                date: todayStr,
                duration: duration * 60,
                calories: calories,
                completed: true,
                rating: null,
                notes: `Entrenamiento ${type.toLowerCase()} agregado desde inicio`,
                workoutType: type
            };
            
            if (!this.appData.workouts[this.currentUser]) {
                this.appData.workouts[this.currentUser] = [];
            }
            this.appData.workouts[this.currentUser].push(workoutData);
            
            this.saveAllData();
            modal.remove();
            
            this.showNotification(`¡Entrenamiento ${type} guardado!`, 'success');
            this.updateHomePage();
        });
    }
    
    exportTodayData() {
        const today = new Date().toISOString().split('T')[0];
        const userWorkouts = this.appData.workouts[this.currentUser] || [];
        const todayWorkouts = userWorkouts.filter(w => w.date === today);
        
        if (todayWorkouts.length === 0) {
            this.showNotification('No hay entrenamientos hoy para exportar', 'info');
            return;
        }
        
        const exportData = {
            date: today,
            user: this.currentUser,
            totalWorkouts: todayWorkouts.length,
            totalDuration: todayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
            totalCalories: todayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
            workouts: todayWorkouts,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const fileName = `aliah_entrenamientos_${today}.json`;
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', fileName);
        link.click();
        
        this.showNotification('Datos de hoy exportados', 'success');
    }
    
    // ===== NAVEGACIÓN =====
    navigateToPage(e) {
        const page = typeof e === 'string' ? e : e.currentTarget.getAttribute('data-page');
        
        if (this.currentPage !== page) {
            this.pageHistory.push(this.currentPage);
        }
        
        this.currentPage = page;
        
        // Actualizar botones de navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === page) {
                btn.classList.add('active');
            }
        });
        
        // Mostrar página correspondiente
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        
        const pageElement = document.getElementById(`${page}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
        }
        
        // Actualizar título
        const titles = {
            'home': 'INICIO',
            'stats': 'ESTADÍSTICAS',
            'progress': 'PROGRESO',
            'routine': 'RUTINA',
            'playlist': 'PLAYLIST'
        };
        
        document.getElementById('page-title').textContent = titles[page] || 'ALIAH';
        
        this.updateBackButton();
        
        // Cargar datos específicos de la página
        switch(page) {
            case 'home':
                this.loadRoutinesList();
                this.updateHomePage();
                break;
            case 'stats':
                this.generateCalendar();
                break;
            case 'progress':
                this.loadProgressPage();
                break;
            case 'routine':
                this.loadRoutinesPage();
                break;
            case 'playlist':
                this.loadPlaylistPage();
                break;
        }
    }
    
    goBack() {
        if (this.pageHistory.length > 0) {
            const prevPage = this.pageHistory.pop();
            this.navigateToPage(prevPage);
        } else {
            this.navigateToPage('home');
        }
    }
    
    updateBackButton() {
        const backButton = document.getElementById('back-button');
        
        if (this.pageHistory.length > 0) {
            backButton.style.visibility = 'visible';
        } else {
            backButton.style.visibility = 'hidden';
        }
    }
    
    // ===== PÁGINA DE INICIO (RUTINAS) =====
    loadRoutinesList() {
        const routinesList = document.getElementById('routines-list');
        if (!routinesList) return;
        
        const userRoutines = this.appData.routines[this.currentUser] || [];
        
        if (userRoutines.length === 0) {
            routinesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <p>No tienes rutinas guardadas</p>
                    <p>Crea tu primera rutina para comenzar</p>
                    <button class="btn-primary" id="create-first-routine-home" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i>
                        <span>Crear mi primera rutina</span>
                    </button>
                </div>
            `;
            
            document.getElementById('create-first-routine-home')?.addEventListener('click', () => {
                this.navigateToPage('routine');
                setTimeout(() => {
                    this.showRoutineCreation();
                }, 100);
            });
            
            return;
        }
        
        // Ordenar por uso reciente
        const sortedRoutines = [...userRoutines].sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA;
        }).slice(0, 5);
        
        routinesList.innerHTML = sortedRoutines.map(routine => `
            <div class="routine-item" data-id="${routine.id}">
                <div>
                    <h4>${routine.name}</h4>
                    <p>${routine.duration} min • ${routine.rounds} rondas • ${routine.calories} cal</p>
                    <div class="routine-item-tags">
                        ${this.generateRoutineTags(routine)}
                    </div>
                </div>
                <div class="routine-item-actions">
                    <button class="btn-icon-small play-routine-list" title="Reproducir" data-id="${routine.id}">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-icon-small edit-routine-list" title="Editar" data-id="${routine.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Event listeners para rutinas en lista
        routinesList.querySelectorAll('.play-routine-list').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-id'));
                this.selectRoutineForPlaylist(id);
            });
        });
        
        routinesList.querySelectorAll('.edit-routine-list').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-id'));
                this.editRoutineFromList(id);
            });
        });
        
        routinesList.querySelectorAll('.routine-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-icon-small')) {
                    const id = parseInt(item.getAttribute('data-id'));
                    this.selectRoutineForPlaylist(id);
                }
            });
        });
    }
    
    // ===== PÁGINA DE RUTINA =====
    loadRoutinesPage() {
        this.loadRoutinesGrid();
    }
    
    loadRoutinesGrid() {
        const routinesGrid = document.getElementById('routines-grid');
        const userRoutines = this.appData.routines[this.currentUser] || [];
        
        if (userRoutines.length === 0) {
            routinesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fas fa-dumbbell" style="font-size: 3rem; color: var(--medium-gray); margin-bottom: 15px;"></i>
                    <h3>No tienes rutinas creadas</h3>
                    <p>Crea tu primera rutina para comenzar</p>
                    <button class="btn-primary" id="create-first-routine" style="margin-top: 20px;">
                        <i class="fas fa-plus"></i>
                        <span>Crear mi primera rutina</span>
                    </button>
                </div>
            `;
            
            document.getElementById('create-first-routine')?.addEventListener('click', () => {
                this.showRoutineCreation();
            });
            
            return;
        }
        
        // Ordenar por fecha de actualización
        const sortedRoutines = [...userRoutines].sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA;
        });
        
        routinesGrid.innerHTML = sortedRoutines.map(routine => this.createRoutineCard(routine)).join('');
        
        this.setupRoutineGridEvents();
    }
    
    createRoutineCard(routine) {
        const lastUsed = routine.lastUsed ? 
            `Último uso: ${this.formatDate(routine.lastUsed)}` : 
            `Creada: ${this.formatDate(routine.createdAt)}`;
        
        return `
            <div class="routine-card" data-routine-id="${routine.id}">
                <div class="routine-card-header">
                    <div class="routine-card-title">
                        <h4>${routine.name}</h4>
                        <div class="routine-card-meta">
                            <span class="routine-card-type">${this.getRoutineType(routine)}</span>
                            <span class="routine-card-difficulty ${routine.difficulty || 'media'}">
                                <i class="fas fa-signal"></i> ${routine.difficulty || 'media'}
                            </span>
                        </div>
                    </div>
                    <div class="routine-card-actions">
                        <button class="btn-icon-small edit-routine-card" 
                                title="Editar rutina" 
                                data-routine-id="${routine.id}"
                                type="button">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon-small play-routine-card" 
                                title="Usar en playlist" 
                                data-routine-id="${routine.id}"
                                type="button">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                
                <div class="routine-card-description">
                    <p>${routine.description || 'Sin descripción'}</p>
                </div>
                
                <div class="routine-card-stats">
                    <div class="routine-card-stat">
                        <i class="fas fa-clock"></i>
                        <span>${routine.duration} min</span>
                    </div>
                    <div class="routine-card-stat">
                        <i class="fas fa-redo"></i>
                        <span>${routine.rounds} rondas</span>
                    </div>
                    <div class="routine-card-stat">
                        <i class="fas fa-fire"></i>
                        <span>${routine.calories} cal</span>
                    </div>
                    <div class="routine-card-stat">
                        <i class="fas fa-dumbbell"></i>
                        <span>${this.countTotalExercises(routine)} ejercicios</span>
                    </div>
                </div>
                
                <div class="routine-card-tags">
                    ${this.generateRoutineTags(routine)}
                </div>
                
                <div class="routine-card-footer">
                    <div class="footer-left">
                        <span>${lastUsed}</span>
                    </div>
                    <div class="footer-right">
                        <span><i class="fas fa-play-circle"></i> ${routine.usageCount || 0}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupRoutineGridEvents() {
        const routinesGrid = document.getElementById('routines-grid');
        if (!routinesGrid) return;
        
        // Event listener único para el grid
        routinesGrid.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // BOTÓN EDITAR RUTINA
            if (e.target.closest('.edit-routine-card')) {
                const btn = e.target.closest('.edit-routine-card');
                const routineId = parseInt(btn.dataset.routineId);
                this.editRoutine(routineId);
                return;
            }
            
            // BOTÓN PLAY RUTINA
            if (e.target.closest('.play-routine-card')) {
                const btn = e.target.closest('.play-routine-card');
                const routineId = parseInt(btn.dataset.routineId);
                this.useRoutineInPlaylist(routineId);
                return;
            }
            
            // CLIC EN LA TARJETA COMPLETA (para usar en playlist)
            if (e.target.closest('.routine-card') && !e.target.closest('.routine-card-actions')) {
                const card = e.target.closest('.routine-card');
                const routineId = parseInt(card.dataset.routineId);
                this.useRoutineInPlaylist(routineId);
            }
        });
    }
    
    // ===== CREACIÓN DE RUTINAS =====
    showRoutineCreation() {
        // 1. Ocultar lista de rutinas
        const listView = document.getElementById('routine-list-view');
        const creationView = document.getElementById('routine-creation-view');
        
        if (!listView || !creationView) {
            this.showNotification('Error al cargar creación de rutina', 'error');
            return;
        }
        
        // 2. Cambiar vistas
        listView.style.display = 'none';
        creationView.style.display = 'block';
        
        // 3. Resetear solo si NO estamos editando
        if (!this.editingRoutineId) {
            this.resetRoutineCreation();
        }
        
        // 4. Actualizar título si estamos editando
        const titleElement = document.getElementById('creation-title');
        if (titleElement) {
            titleElement.textContent = this.editingRoutineId ? 
                `Editar Rutina: ${this.creatingRoutine.name}` : 
                'Crear Nueva Rutina';
        }
        
        // 5. Mostrar paso básico primero
        this.showStep('basic');
        
        // 6. Si estamos editando y ya hay rondas, mostrar paso de rondas
        if (this.editingRoutineId && this.creatingRoutine.rounds.length > 0) {
            setTimeout(() => {
                this.showStep('rounds');
                this.renderRoundsCreation();
            }, 100);
        }
        
        // 7. Enfocar en el primer campo
        setTimeout(() => {
            const nameInput = document.getElementById('new-routine-name');
            if (nameInput) {
                nameInput.focus();
                if (this.editingRoutineId) {
                    nameInput.select();
                }
            }
        }, 150);
        
        // 8. Actualizar título de la página
        document.getElementById('page-title').textContent = 
            this.editingRoutineId ? 'EDITAR RUTINA' : 'CREAR RUTINA';
    }
    
    showRoutineList() {
        document.getElementById('routine-list-view').style.display = 'block';
        document.getElementById('routine-creation-view').style.display = 'none';
        this.loadRoutinesGrid();
    }
    
    resetRoutineCreation() {
        this.creatingRoutine = {
            name: '',
            description: '',
            rounds: [],
            currentRoundId: 1
        };
        
        this.currentStep = 'basic';
        this.editingRoutineId = null;
        
        // Resetear inputs
        const nameInput = document.getElementById('new-routine-name');
        const descInput = document.getElementById('new-routine-description');
        
        if (nameInput) nameInput.value = '';
        if (descInput) descInput.value = '';
        
        // Resetear título
        const titleElement = document.getElementById('creation-title');
        if (titleElement) {
            titleElement.textContent = 'Crear Nueva Rutina';
        }
        
        // Limpiar lista de rondas
        const roundsList = document.getElementById('rounds-creation-list');
        if (roundsList) {
            roundsList.innerHTML = '';
        }
    }
    
    showStep(step) {
        this.currentStep = step;
        
        document.querySelectorAll('.creation-step').forEach(el => {
            el.classList.remove('active');
        });
        
        const stepElement = document.getElementById(`step-${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
        
        if (step === 'rounds') {
            this.renderRoundsCreation();
        }
    }
    
    goToStep(step) {
        const name = document.getElementById('new-routine-name').value.trim();
        
        if (!name && step === 'rounds') {
            this.showValidationError('Por favor ingresa un nombre para la rutina');
            document.getElementById('new-routine-name').focus();
            return;
        }
        
        this.creatingRoutine.name = name;
        this.creatingRoutine.description = document.getElementById('new-routine-description').value.trim();
        this.showStep(step);
    }
    
    addRoundToCreation() {
        const roundId = Date.now();
        const roundNumber = this.creatingRoutine.rounds.length + 1;
        
        const newRound = {
            id: roundId,
            name: `Ronda ${roundNumber}`,
            restTime: 60,
            reps: 3,
            exercises: []
        };
        
        this.creatingRoutine.rounds.push(newRound);
        this.renderRoundsCreation();
        
        // Desplazar al final de la lista
        setTimeout(() => {
            const container = document.getElementById('rounds-creation-list');
            if (container) {
                const lastItem = container.lastElementChild;
                if (lastItem) {
                    lastItem.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
            }
        }, 100);
    }
    
    // ===== FUNCIÓN MEJORADA PARA AGREGAR EJERCICIO =====
    addExerciseToRound(roundIndex) {
        console.log('🔼 Agregando ejercicio a ronda:', roundIndex);
        
        if (!this.creatingRoutine.rounds[roundIndex]) {
            console.error('❌ No existe la ronda en índice:', roundIndex);
            return;
        }
        
        const exerciseId = Date.now();
        const exerciseNumber = this.creatingRoutine.rounds[roundIndex].exercises.length + 1;
        
        const newExercise = {
            id: exerciseId,
            name: `Ejercicio ${exerciseNumber}`,
            type: 'time',
            value: 30,
            unit: 'seg'
        };
        
        console.log('➕ Nuevo ejercicio:', newExercise);
        this.creatingRoutine.rounds[roundIndex].exercises.push(newExercise);
        
        // Renderizar SOLO la ronda específica
        this.renderSingleRound(roundIndex);
        
        // Enfocar en el nuevo campo de nombre
        setTimeout(() => {
            const container = document.getElementById('rounds-creation-list');
            if (container) {
                const roundElement = container.querySelector(`[data-round-index="${roundIndex}"]`);
                if (roundElement) {
                    const exerciseInputs = roundElement.querySelectorAll('.exercise-name');
                    if (exerciseInputs.length > 0) {
                        const lastInput = exerciseInputs[exerciseInputs.length - 1];
                        lastInput.focus();
                        lastInput.select();
                    }
                }
            }
        }, 100);
    }
    
    // ===== FUNCIÓN MEJORADA PARA RENDERIZAR UNA RONDA ESPECÍFICA =====
    renderSingleRound(roundIndex) {
        const container = document.getElementById('rounds-creation-list');
        if (!container) return;
        
        const round = this.creatingRoutine.rounds[roundIndex];
        if (!round) return;
        
        // Encontrar el elemento de la ronda
        const roundElement = container.querySelector(`[data-round-index="${roundIndex}"]`);
        
        if (!roundElement) {
            // Si no existe, renderizar todas las rondas
            this.renderRoundsCreation();
            return;
        }
        
        // Actualizar solo la sección de ejercicios de esta ronda
        const exercisesContainer = roundElement.querySelector('.exercises-creation-list');
        if (exercisesContainer) {
            exercisesContainer.innerHTML = this.renderExercisesForRound(round, roundIndex);
            
            // Reconfigurar listeners solo para esta ronda
            setTimeout(() => {
                this.setupExerciseInputListeners(roundElement);
            }, 50);
        }
    }
    
    // ===== FUNCIÓN MEJORADA PARA RENDERIZAR TODAS LAS RONDAS =====
    renderRoundsCreation() {
        const container = document.getElementById('rounds-creation-list');
        if (!container) {
            console.error('No se encontró rounds-creation-list');
            return;
        }
        
        container.innerHTML = '';
        
        if (this.creatingRoutine.rounds.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-redo"></i>
                    <p>No hay rondas creadas</p>
                    <p>Haz clic en "Agregar Ronda" para comenzar</p>
                </div>
            `;
            return;
        }
        
        // Renderizar cada ronda
        this.creatingRoutine.rounds.forEach((round, roundIndex) => {
            const roundElement = document.createElement('div');
            roundElement.className = 'round-creation-item';
            roundElement.dataset.roundIndex = roundIndex;
            
            roundElement.innerHTML = `
                <div class="round-creation-header">
                    <h5><i class="fas fa-redo"></i> ${round.name}</h5>
                    <div class="round-actions">
                        <button class="btn-icon-small remove-round-btn" 
                                data-round-index="${roundIndex}"
                                title="Eliminar ronda"
                                type="button">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="round-settings">
                    <div class="round-setting">
                        <label><i class="fas fa-clock"></i> Tiempo de descanso (segundos):</label>
                        <input type="number" 
                               class="round-rest-time" 
                               value="${round.restTime}" 
                               min="10" 
                               max="300"
                               data-round-index="${roundIndex}">
                    </div>
                    <div class="round-setting">
                        <label><i class="fas fa-redo-alt"></i> Repeticiones de la ronda:</label>
                        <input type="number" 
                               class="round-reps-count" 
                               value="${round.reps}" 
                               min="1" 
                               max="10"
                               data-round-index="${roundIndex}">
                    </div>
                </div>
                
                <div class="exercises-creation-list">
                    ${this.renderExercisesForRound(round, roundIndex)}
                </div>
            `;
            
            container.appendChild(roundElement);
            
            // Configurar listeners para esta ronda
            setTimeout(() => {
                this.setupExerciseInputListeners(roundElement);
                this.setupRoundInputListeners(roundElement);
            }, 100);
        });
    }
    
    // ===== FUNCIÓN MEJORADA PARA RENDERIZAR EJERCICIOS =====
    renderExercisesForRound(round, roundIndex) {
        if (round.exercises.length === 0) {
            return `
                <div class="exercises-header">
                    <h6><i class="fas fa-dumbbell"></i> Ejercicios (0)</h6>
                    <button class="btn-primary add-exercise-btn" 
                            data-round-index="${roundIndex}"
                            type="button">
                        <i class="fas fa-plus"></i>
                        <span>Agregar Primer Ejercicio</span>
                    </button>
                </div>
                
                <div class="empty-exercises">
                    <i class="fas fa-dumbbell"></i>
                    <p>No hay ejercicios en esta ronda</p>
                </div>
            `;
        }
        
        let exercisesHTML = `
            <div class="exercises-header">
                <h6><i class="fas fa-dumbbell"></i> Ejercicios (${round.exercises.length})</h6>
                <button class="btn-primary add-exercise-btn" 
                        data-round-index="${roundIndex}"
                        type="button">
                    <i class="fas fa-plus"></i>
                    <span>Agregar Ejercicio</span>
                </button>
            </div>
        `;
        
        round.exercises.forEach((exercise, exerciseIndex) => {
            exercisesHTML += `
                <div class="exercise-creation-item" data-exercise-index="${exerciseIndex}">
                    <div class="exercise-drag-handle">
                        <i class="fas fa-grip-vertical"></i>
                    </div>
                    
                    <div class="exercise-creation-info">
                        <div class="exercise-input-group">
                            <label>Nombre:</label>
                            <input type="text" 
                                class="exercise-name" 
                                value="${this.escapeHtml(exercise.name || `Ejercicio ${exerciseIndex + 1}`)}" 
                                placeholder="Ej: Flexiones"
                                data-round-index="${roundIndex}"
                                data-exercise-index="${exerciseIndex}"
                                required>
                        </div>
                        
                        <div class="exercise-meta-group">
                            <div class="exercise-type-group">
                                <label>Tipo:</label>
                                <select class="exercise-type" 
                                        data-round-index="${roundIndex}"
                                        data-exercise-index="${exerciseIndex}">
                                    <option value="time" ${exercise.type === 'time' ? 'selected' : ''}>Tiempo</option>
                                    <option value="reps" ${exercise.type === 'reps' ? 'selected' : ''}>Repeticiones</option>
                                </select>
                            </div>
                            
                            <div class="exercise-value-group">
                                <label>Valor:</label>
                                <div class="value-input-wrapper">
                                    <input type="number" 
                                        class="exercise-value" 
                                        value="${exercise.value || 30}" 
                                        min="1" 
                                        max="999"
                                        data-round-index="${roundIndex}"
                                        data-exercise-index="${exerciseIndex}"
                                        required>
                                    <span class="exercise-unit">
                                        ${exercise.type === 'time' ? 'seg' : 'reps'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="exercise-actions">
                        <button class="btn-icon-small move-exercise-up" 
                                data-round-index="${roundIndex}"
                                data-exercise-index="${exerciseIndex}"
                                title="Mover arriba"
                                type="button">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="btn-icon-small move-exercise-down" 
                                data-round-index="${roundIndex}"
                                data-exercise-index="${exerciseIndex}"
                                title="Mover abajo"
                                type="button">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button class="btn-icon-small remove-exercise-btn" 
                                data-round-index="${roundIndex}"
                                data-exercise-index="${exerciseIndex}"
                                title="Eliminar ejercicio"
                                type="button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        return exercisesHTML;
    }
    
    // ===== FUNCIÓN MEJORADA PARA CONFIGURAR EVENT LISTENERS DE EJERCICIOS =====
    setupExerciseInputListeners(roundElement) {
        const roundIndex = parseInt(roundElement.dataset.roundIndex);
        
        // 1. Botón Agregar Ejercicio (único por ronda)
        const addExerciseBtn = roundElement.querySelector('.add-exercise-btn');
        if (addExerciseBtn) {
            // Remover listeners anteriores
            const newBtn = addExerciseBtn.cloneNode(true);
            addExerciseBtn.parentNode.replaceChild(newBtn, addExerciseBtn);
            
            // Agregar nuevo listener
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔼 Botón agregar ejercicio clickeado para ronda:', roundIndex);
                this.addExerciseToRound(roundIndex);
            });
        }
        
        // 2. Inputs de ejercicio
        roundElement.querySelectorAll('.exercise-name').forEach(input => {
            input.addEventListener('change', (e) => {
                const exIndex = parseInt(e.target.dataset.exerciseIndex);
                const value = e.target.value.trim();
                
                if (value) {
                    this.creatingRoutine.rounds[roundIndex].exercises[exIndex].name = value;
                }
            });
        });
        
        roundElement.querySelectorAll('.exercise-type').forEach(select => {
            select.addEventListener('change', (e) => {
                const exIndex = parseInt(e.target.dataset.exerciseIndex);
                const value = e.target.value;
                
                const exercise = this.creatingRoutine.rounds[roundIndex].exercises[exIndex];
                exercise.type = value;
                exercise.unit = value === 'time' ? 'seg' : 'reps';
                
                // Actualizar unidad visible
                const unitSpan = e.target.closest('.exercise-creation-item').querySelector('.exercise-unit');
                if (unitSpan) {
                    unitSpan.textContent = exercise.unit;
                }
            });
        });
        
        roundElement.querySelectorAll('.exercise-value').forEach(input => {
            input.addEventListener('change', (e) => {
                const exIndex = parseInt(e.target.dataset.exerciseIndex);
                const value = parseInt(e.target.value) || 30;
                
                if (value >= 1 && value <= 999) {
                    this.creatingRoutine.rounds[roundIndex].exercises[exIndex].value = value;
                }
            });
        });
        
        // 3. Botones de acciones de ejercicio
        roundElement.querySelectorAll('.remove-exercise-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const exIndex = parseInt(btn.dataset.exerciseIndex);
                
                if (confirm('¿Eliminar este ejercicio?')) {
                    this.creatingRoutine.rounds[roundIndex].exercises.splice(exIndex, 1);
                    this.renderSingleRound(roundIndex);
                }
            });
        });
        
        // 4. Botones para mover ejercicios
        roundElement.querySelectorAll('.move-exercise-up').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const exIndex = parseInt(btn.dataset.exerciseIndex);
                
                if (exIndex > 0) {
                    const exercises = this.creatingRoutine.rounds[roundIndex].exercises;
                    [exercises[exIndex], exercises[exIndex - 1]] = 
                    [exercises[exIndex - 1], exercises[exIndex]];
                    this.renderSingleRound(roundIndex);
                }
            });
        });
        
        roundElement.querySelectorAll('.move-exercise-down').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const exIndex = parseInt(btn.dataset.exerciseIndex);
                const exercises = this.creatingRoutine.rounds[roundIndex].exercises;
                
                if (exIndex < exercises.length - 1) {
                    [exercises[exIndex], exercises[exIndex + 1]] = 
                    [exercises[exIndex + 1], exercises[exIndex]];
                    this.renderSingleRound(roundIndex);
                }
            });
        });
    }
    
    // ===== FUNCIÓN SEPARADA PARA INPUTS DE RONDA =====
    setupRoundInputListeners(roundElement) {
        const roundIndex = parseInt(roundElement.dataset.roundIndex);
        
        // Tiempo de descanso
        const restTimeInput = roundElement.querySelector('.round-rest-time');
        if (restTimeInput) {
            restTimeInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value) || 60;
                if (value >= 10 && value <= 300) {
                    this.creatingRoutine.rounds[roundIndex].restTime = value;
                }
            });
        }
        
        // Repeticiones
        const repsInput = roundElement.querySelector('.round-reps-count');
        if (repsInput) {
            repsInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value) || 3;
                if (value >= 1 && value <= 10) {
                    this.creatingRoutine.rounds[roundIndex].reps = value;
                }
            });
        }
        
        // Botón eliminar ronda
        const removeRoundBtn = roundElement.querySelector('.remove-round-btn');
        if (removeRoundBtn) {
            removeRoundBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (confirm('¿Eliminar esta ronda y todos sus ejercicios?')) {
                    this.creatingRoutine.rounds.splice(roundIndex, 1);
                    this.renderRoundsCreation();
                }
            });
        }
    }
    
    saveCreatedRoutine() {
        const name = document.getElementById('new-routine-name').value.trim();
        const description = document.getElementById('new-routine-description').value.trim();
        
        // Validaciones
        if (!name) {
            this.showValidationError('Por favor ingresa un nombre para la rutina');
            this.showStep('basic');
            document.getElementById('new-routine-name').focus();
            return;
        }
        
        if (this.creatingRoutine.rounds.length === 0) {
            this.showValidationError('Debes agregar al menos una ronda a la rutina');
            return;
        }
        
        // Validar que cada ronda tenga ejercicios
        for (let i = 0; i < this.creatingRoutine.rounds.length; i++) {
            const round = this.creatingRoutine.rounds[i];
            
            if (round.exercises.length === 0) {
                this.showValidationError(`La ${round.name} debe tener al menos un ejercicio`);
                return;
            }
            
            // Validar que cada ejercicio tenga nombre
            for (let j = 0; j < round.exercises.length; j++) {
                const exercise = round.exercises[j];
                
                if (!exercise.name || exercise.name.trim() === '') {
                    this.showValidationError(`Ejercicio ${j + 1} en ${round.name} debe tener un nombre`);
                    return;
                }
                
                if (!exercise.value || exercise.value < 1) {
                    this.showValidationError(`"${exercise.name}" debe tener un valor mayor a 0`);
                    return;
                }
            }
        }
        
        // Calcular métricas
        const { duration, calories, difficulty } = this.calculateRoutineMetrics();
        
        // Crear objeto de rutina
        const routineData = {
            id: this.editingRoutineId || Date.now(),
            name: name,
            description: description,
            duration: duration,
            rounds: this.creatingRoutine.rounds.length,
            calories: calories,
            difficulty: difficulty,
            roundsData: JSON.parse(JSON.stringify(this.creatingRoutine.rounds)),
            createdAt: this.editingRoutineId ? 
                (this.appData.routines[this.currentUser]?.find(r => r.id === this.editingRoutineId)?.createdAt || new Date().toISOString()) : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: this.editingRoutineId ? 
                (this.appData.routines[this.currentUser]?.find(r => r.id === this.editingRoutineId)?.usageCount || 0) : 
                0
        };
        
        // Guardar o actualizar
        if (this.editingRoutineId) {
            const index = this.appData.routines[this.currentUser].findIndex(r => r.id === this.editingRoutineId);
            if (index !== -1) {
                this.appData.routines[this.currentUser][index] = routineData;
            }
        } else {
            if (!this.appData.routines[this.currentUser]) {
                this.appData.routines[this.currentUser] = [];
            }
            this.appData.routines[this.currentUser].push(routineData);
        }
        
        this.saveAllData();
        this.showRoutineList();
        
        this.showNotification(
            this.editingRoutineId ? '¡Rutina actualizada!' : '¡Rutina creada exitosamente!',
            'success'
        );
        
        // Limpiar datos de edición
        this.editingRoutineId = null;
        this.creatingRoutine = {
            name: '',
            description: '',
            rounds: [],
            currentRoundId: 1
        };
        
        // Actualizar playlist si está activa
        if (this.currentPage === 'playlist') {
            this.updateRoutineSelect();
        }
    }
    
    calculateRoutineMetrics() {
        let totalSeconds = 0;
        let intensityScore = 0;
        let exerciseCount = 0;
        
        for (const round of this.creatingRoutine.rounds) {
            for (const exercise of round.exercises) {
                exerciseCount++;
                if (exercise.type === 'time') {
                    totalSeconds += exercise.value * round.reps;
                    intensityScore += exercise.value * 0.1 * round.reps;
                } else {
                    // Estimación: 4 segundos por repetición
                    totalSeconds += 4 * exercise.value * round.reps;
                    intensityScore += exercise.value * 0.2 * round.reps;
                }
            }
            totalSeconds += round.restTime * round.reps;
        }
        
        const durationMinutes = Math.max(1, Math.ceil(totalSeconds / 60));
        const calories = Math.round(durationMinutes * 7.5 + intensityScore * 2);
        
        // Determinar dificultad basada en intensidad y duración
        let difficulty = 'media';
        const intensityPerMinute = intensityScore / durationMinutes;
        
        if (intensityPerMinute > 3 || durationMinutes > 50) {
            difficulty = 'alta';
        } else if (intensityPerMinute < 1.5 || durationMinutes < 20) {
            difficulty = 'baja';
        }
        
        return { duration: durationMinutes, calories, difficulty };
    }
    
    editRoutine(routineId) {
        // Buscar la rutina
        const routine = this.appData.routines[this.currentUser]?.find(r => r.id === routineId);
        if (!routine) {
            this.showNotification('Rutina no encontrada', 'error');
            return;
        }
        
        // Preparar datos para edición
        this.creatingRoutine = {
            name: routine.name || '',
            description: routine.description || '',
            rounds: [],
            currentRoundId: 1
        };
        
        // Copiar las rondas
        if (routine.roundsData && Array.isArray(routine.roundsData)) {
            this.creatingRoutine.rounds = JSON.parse(JSON.stringify(routine.roundsData));
            
            // Validar y limpiar datos de ejercicios
            this.creatingRoutine.rounds.forEach((round, roundIndex) => {
                round.name = round.name || `Ronda ${roundIndex + 1}`;
                round.restTime = round.restTime || 60;
                round.reps = round.reps || 3;
                round.exercises = round.exercises || [];
                
                // Validar cada ejercicio
                round.exercises.forEach((exercise, exIndex) => {
                    exercise.id = exercise.id || Date.now() + exIndex;
                    exercise.name = exercise.name || `Ejercicio ${exIndex + 1}`;
                    exercise.type = exercise.type || 'time';
                    exercise.value = exercise.value || (exercise.type === 'time' ? 30 : 10);
                    exercise.unit = exercise.unit || (exercise.type === 'time' ? 'seg' : 'reps');
                });
            });
        } else {
            this.creatingRoutine.rounds = [];
        }
        
        // Guardar ID de edición
        this.editingRoutineId = routineId;
        
        // Navegar a la página de rutina si no está allí
        if (this.currentPage !== 'routine') {
            this.navigateToPage('routine');
            
            // Esperar a que cargue la página
            setTimeout(() => {
                this.loadRoutineForEditing();
            }, 300);
        } else {
            this.loadRoutineForEditing();
        }
    }
    
    loadRoutineForEditing() {
        // Mostrar vista de creación
        const listView = document.getElementById('routine-list-view');
        const creationView = document.getElementById('routine-creation-view');
        
        if (!listView || !creationView) {
            return;
        }
        
        listView.style.display = 'none';
        creationView.style.display = 'block';
        
        // Llenar los campos del formulario
        const nameInput = document.getElementById('new-routine-name');
        const descInput = document.getElementById('new-routine-description');
        const titleElement = document.getElementById('creation-title');
        
        if (nameInput) {
            nameInput.value = this.creatingRoutine.name;
        }
        
        if (descInput) {
            descInput.value = this.creatingRoutine.description;
        }
        
        if (titleElement) {
            titleElement.textContent = `Editar Rutina: ${this.creatingRoutine.name}`;
        }
        
        // Mostrar paso de rondas
        this.showStep('rounds');
        
        // Enfocar en el primer campo
        setTimeout(() => {
            if (nameInput) {
                nameInput.focus();
                nameInput.select();
            }
            
            // Verificar que las rondas se rendericen
            if (this.creatingRoutine.rounds.length > 0) {
                setTimeout(() => {
                    this.renderRoundsCreation();
                }, 100);
            }
        }, 100);
        
        // Actualizar título de la página
        document.getElementById('page-title').textContent = 'EDITAR RUTINA';
    }
    
    editRoutineFromList(id) {
        this.navigateToPage('routine');
        setTimeout(() => {
            this.editRoutine(id);
        }, 100);
    }
    
    duplicateRoutine(routineId) {
        const routine = this.appData.routines[this.currentUser]?.find(r => r.id === routineId);
        if (!routine) {
            this.showNotification('Rutina no encontrada', 'error');
            return;
        }
        
        // Crear copia con nuevo ID
        const duplicatedRoutine = {
            ...JSON.parse(JSON.stringify(routine)),
            id: Date.now(),
            name: `${routine.name} (Copia)`,
            usageCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Remover ID de ejercicios para evitar conflictos
        duplicatedRoutine.roundsData.forEach(round => {
            round.exercises.forEach(exercise => {
                exercise.id = Date.now() + Math.random();
            });
        });
        
        this.appData.routines[this.currentUser].push(duplicatedRoutine);
        this.saveAllData();
        this.loadRoutinesGrid();
        
        this.showNotification('Rutina duplicada exitosamente', 'success');
    }
    
    exportSingleRoutine(routineId) {
        const routine = this.appData.routines[this.currentUser]?.find(r => r.id === routineId);
        if (!routine) {
            this.showNotification('Rutina no encontrada', 'error');
            return;
        }
        
        const exportData = {
            routine: routine,
            exportDate: new Date().toISOString(),
            appVersion: 'AliahFIT 1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `aliah_rutina_${routine.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    deleteRoutine(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
            return;
        }
        
        const initialLength = this.appData.routines[this.currentUser]?.length || 0;
        this.appData.routines[this.currentUser] = this.appData.routines[this.currentUser].filter(r => r.id !== id);
        
        // Si es la rutina actual, limpiarla
        if (this.currentRoutine && this.currentRoutine.id === id) {
            this.currentRoutine = null;
            this.clearRoutineInfo();
            this.updateRoutineSelect();
        }
        
        // Eliminar también calificaciones y workouts relacionados
        this.appData.ratings[this.currentUser] = this.appData.ratings[this.currentUser]?.filter(r => r.routineId !== id) || [];
        this.appData.workouts[this.currentUser] = this.appData.workouts[this.currentUser]?.filter(w => w.routineId !== id) || [];
        
        this.saveAllData();
        
        if (this.appData.routines[this.currentUser]?.length < initialLength) {
            this.loadRoutinesList();
            this.loadRoutinesGrid();
            this.showNotification('Rutina eliminada exitosamente', 'success');
        }
    }
    
    // ===== PÁGINA DE PLAYLIST =====
    loadPlaylistPage() {
        this.updateRoutineSelect();
        
        // Cargar estado de reproducción si existe
        this.loadPlaybackState();
        
        // Si hay rutinas disponibles, cargar la primera
        const userRoutines = this.appData.routines[this.currentUser] || [];
        if (userRoutines.length > 0 && !this.currentRoutine) {
            const firstRoutine = userRoutines[0];
            this.loadRoutine(firstRoutine.id.toString());
        }
        
        // Mostrar opción de continuar si hay estado guardado
        if (this.playbackState && this.playbackState.routineId) {
            this.showContinueOption();
        }
    }
    
    loadRoutine(routineKey) {
        if (!routineKey || routineKey.trim() === '') {
            this.clearRoutineInfo();
            return;
        }
        
        const userRoutines = this.appData.routines[this.currentUser] || [];
        
        // Intentar encontrar por ID primero
        let routine = userRoutines.find(r => r.id.toString() === routineKey);
        
        // Si no se encuentra por ID, buscar por nombre
        if (!routine) {
            for (const r of userRoutines) {
                const routineNameKey = r.name.toLowerCase().replace(/\s+/g, '');
                const inputKey = routineKey.toLowerCase().replace(/\s+/g, '');
                
                if (routineNameKey === inputKey) {
                    routine = r;
                    break;
                }
            }
        }
        
        // Si aún no se encuentra y hay rutinas, usar la primera
        if (!routine && userRoutines.length > 0) {
            routine = userRoutines[0];
        }
        
        // Si aún no hay rutina
        if (!routine) {
            this.clearRoutineInfo();
            return;
        }
        
        // Establecer como rutina actual
        this.currentRoutine = routine;
        
        // Actualizar interfaz
        this.updateRoutineInfo();
        this.generateRoundsHTML();
        
        // Actualizar selector para que muestre la rutina seleccionada
        const select = document.getElementById('routine-select');
        if (select) {
            const option = Array.from(select.options).find(opt => 
                opt.value === routine.id.toString() || 
                opt.text === routine.name
            );
            if (option) {
                select.value = option.value;
            }
        }
        
        // Actualizar contador de uso
        this.incrementRoutineUsage(routine.id);
    }
    
    updateRoutineSelect() {
        const select = document.getElementById('routine-select');
        const userRoutines = this.appData.routines[this.currentUser] || [];
        
        // Guardar valor seleccionado actual
        const currentValue = select.value;
        
        // Limpiar y agregar opciones
        select.innerHTML = '<option value="">Selecciona una rutina</option>';
        
        userRoutines.forEach(routine => {
            const option = new Option(routine.name, routine.id.toString());
            select.appendChild(option);
        });
        
        // Seleccionar la rutina actual si existe
        if (this.currentRoutine) {
            select.value = this.currentRoutine.id.toString();
        } else if (currentValue && userRoutines.some(r => r.id.toString() === currentValue)) {
            select.value = currentValue;
        }
    }
    
    updateRoutineInfo() {
        if (!this.currentRoutine) return;
        
        document.getElementById('routine-name').textContent = this.currentRoutine.name.toUpperCase();
        document.getElementById('routine-duration').textContent = this.currentRoutine.duration;
        document.getElementById('routine-rounds').textContent = this.currentRoutine.rounds;
        document.getElementById('routine-calories').textContent = this.currentRoutine.calories;
    }
    
    clearRoutineInfo() {
        document.getElementById('routine-name').textContent = 'SIN RUTINA SELECCIONADA';
        document.getElementById('routine-duration').textContent = '0';
        document.getElementById('routine-rounds').textContent = '0';
        document.getElementById('routine-calories').textContent = '0';
        document.getElementById('rounds-container').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dumbbell"></i>
                <p>No hay rutina seleccionada</p>
                <p>Selecciona una rutina de la lista</p>
            </div>
        `;
    }
    
    generateRoundsHTML() {
        const roundsContainer = document.getElementById('rounds-container');
        
        if (!roundsContainer) {
            return;
        }
        
        if (!this.currentRoutine) {
            roundsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <p>Selecciona una rutina para comenzar</p>
                </div>
            `;
            return;
        }
        
        if (!this.currentRoutine.roundsData || !Array.isArray(this.currentRoutine.roundsData) || this.currentRoutine.roundsData.length === 0) {
            roundsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <p>Esta rutina no tiene rondas configuradas</p>
                    <p>Edita la rutina para agregar ejercicios</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        let hasExercises = false;
        
        // Generar HTML para cada ronda
        this.currentRoutine.roundsData.forEach((round, roundIndex) => {
            if (!round.exercises || !Array.isArray(round.exercises) || round.exercises.length === 0) {
                return;
            }
            
            hasExercises = true;
            
            html += `
                <div class="round-card-modern" data-round-index="${roundIndex}">
                    <div class="round-header-modern">
                        <div class="round-title">
                            <i class="fas fa-redo"></i>
                            <h5>${round.name || `Ronda ${roundIndex + 1}`}</h5>
                        </div>
                        <div class="round-header-stats">
                            <span class="round-stat-badge">
                                <i class="fas fa-clock"></i> ${round.restTime || 60}s descanso
                            </span>
                            <span class="round-stat-badge">
                                <i class="fas fa-redo-alt"></i> ${round.reps || 1} repeticiones
                            </span>
                        </div>
                    </div>
                    
                    <div class="exercise-list-modern">
            `;
            
            // Agregar cada ejercicio
            round.exercises.forEach((exercise, exIndex) => {
                if (!exercise || !exercise.name) return;
                
                html += `
                        <div class="exercise-item-modern" 
                             data-round-index="${roundIndex}"
                             data-exercise-index="${exIndex}">
                            <div class="exercise-info-modern">
                                <h6>${exercise.name}</h6>
                                <div class="exercise-details">
                                    <span class="exercise-type">${exercise.type === 'time' ? '⏱️ Tiempo' : '🔢 Repeticiones'}</span>
                                    <span>Ejercicio ${exIndex + 1}/${round.exercises.length}</span>
                                </div>
                            </div>
                            <div class="exercise-value">
                                ${exercise.value || 0} ${exercise.unit || (exercise.type === 'time' ? 'seg' : 'reps')}
                            </div>
                        </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        if (!hasExercises) {
            html = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <p>Esta rutina no tiene ejercicios</p>
                    <p>Edita la rutina para agregar ejercicios</p>
                </div>
            `;
        }
        
        roundsContainer.innerHTML = html;
    }
    
    showContinueOption() {
        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn-primary';
        continueBtn.style.cssText = `
            margin-top: 15px;
            width: 100%;
            padding: 12px;
            font-size: 1rem;
        `;
        continueBtn.innerHTML = `
            <i class="fas fa-play-circle"></i>
            <span>Continuar entrenamiento interrumpido</span>
        `;
        continueBtn.addEventListener('click', () => {
            this.continueInterruptedWorkout();
        });
        
        const routineInfo = document.querySelector('.routine-info-modern');
        if (routineInfo && !document.querySelector('.continue-workout-btn')) {
            continueBtn.className = 'btn-primary continue-workout-btn';
            routineInfo.appendChild(continueBtn);
        }
    }
    
    continueInterruptedWorkout() {
        if (!this.playbackState || !this.playbackState.routineId) {
            this.showNotification('No hay entrenamiento para continuar', 'warning');
            return;
        }
        
        // Cargar la rutina del estado guardado
        const routine = this.appData.routines[this.currentUser]?.find(r => r.id === this.playbackState.routineId);
        if (!routine) {
            this.showNotification('La rutina del entrenamiento ya no existe', 'error');
            this.clearPlaybackState();
            return;
        }
        
        this.currentRoutine = routine;
        this.updateRoutineInfo();
        this.generateRoundsHTML();
        this.updateRoutineSelect();
        
        // Preguntar si quiere continuar desde donde quedó
        if (confirm(`¿Continuar desde Ronda ${this.playbackState.roundIndex + 1}, Ejercicio ${this.playbackState.exerciseIndex + 1}?`)) {
            this.currentRoundIndex = this.playbackState.roundIndex;
            this.currentExerciseIndex = this.playbackState.exerciseIndex;
            this.totalElapsedTime = this.playbackState.elapsedTime;
            this.startPlaylist();
        } else {
            // Comenzar desde el inicio
            this.currentRoundIndex = 0;
            this.currentExerciseIndex = 0;
            this.totalElapsedTime = 0;
            this.clearPlaybackState();
        }
    }
    
    // ===== REPRODUCTOR DE PLAYLIST =====
    startPlaylist() {
        if (!this.currentRoutine) {
            this.showNotification('No hay ninguna rutina seleccionada', 'error');
            return;
        }
        
        if (!this.currentRoutine.roundsData || this.currentRoutine.roundsData.length === 0) {
            this.showNotification('La rutina no tiene rondas configuradas', 'error');
            return;
        }
        
        let hasExercises = false;
        for (const round of this.currentRoutine.roundsData) {
            if (round.exercises && round.exercises.length > 0) {
                hasExercises = true;
                break;
            }
        }
        
        if (!hasExercises) {
            this.showNotification('La rutina no tiene ejercicios', 'error');
            return;
        }
        
        this.isPlaying = true;
        
        // Mostrar reproductor
        const player = document.getElementById('playlist-player');
        if (player) {
            player.classList.remove('minimized');
        }
        
        // Actualizar controles
        this.updatePlaybackControls(true);
        
        // Iniciar temporizadores
        this.startTotalTimer();
        this.startCurrentExercise();
    }
    
    updatePlaybackControls(isPlaying) {
        const startBtn = document.getElementById('start-playlist');
        const pauseBtn = document.getElementById('pause-playlist');
        const restartBtn = document.getElementById('restart-playlist');
        const stopBtn = document.getElementById('stop-playlist');
        
        if (isPlaying) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            restartBtn.disabled = false;
            stopBtn.disabled = false;
            
            // Actualizar ícono del botón pausa
            pauseBtn.querySelector('i').className = 'fas fa-pause';
            pauseBtn.querySelector('span').textContent = 'Pausar';
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            restartBtn.disabled = true;
            stopBtn.disabled = true;
            
            // Cambiar botón pausa a "Reanudar" si hay algo en reproducción
            if (this.currentRoutine && this.totalElapsedTime > 0) {
                pauseBtn.disabled = false;
                pauseBtn.querySelector('i').className = 'fas fa-play';
                pauseBtn.querySelector('span').textContent = 'Reanudar';
            }
        }
    }
    
    startTotalTimer() {
        // Limpiar temporizador anterior si existe
        if (this.totalTimer) {
            clearInterval(this.totalTimer);
            this.totalTimer = null;
        }
        
        // Iniciar nuevo temporizador
        this.totalTimer = setInterval(() => {
            this.totalElapsedTime++;
            
            // Actualizar tiempo total en el reproductor
            const totalTimerElement = document.getElementById('player-total-time');
            if (totalTimerElement) {
                totalTimerElement.textContent = this.formatTime(this.totalElapsedTime);
            }
            
            // Guardar estado periódicamente
            if (this.totalElapsedTime % 5 === 0) {
                this.savePlaybackState();
            }
        }, 1000);
    }
    
    startCurrentExercise() {
        if (!this.currentRoutine || !this.currentRoutine.roundsData) {
            return;
        }
        
        if (this.currentRoundIndex >= this.currentRoutine.roundsData.length) {
            return;
        }
        
        const round = this.currentRoutine.roundsData[this.currentRoundIndex];
        
        if (!round || !round.exercises) {
            return;
        }
        
        if (this.currentExerciseIndex >= round.exercises.length) {
            return;
        }
        
        const exercise = round.exercises[this.currentExerciseIndex];
        
        if (!exercise) {
            return;
        }
        
        this.currentExercise = exercise;
        this.isResting = false;
        
        // Guardar estado actual
        this.savePlaybackState();
        
        // Reproducir sonido de inicio de ejercicio
        this.playExerciseSound();
        
        // Actualizar interfaz del ejercicio actual
        const exerciseNameElement = document.getElementById('current-exercise-name');
        if (exerciseNameElement) {
            exerciseNameElement.textContent = exercise.name || 'Sin nombre';
        }
        
        // Actualizar tipo de ejercicio
        const typeElement = document.querySelector('.exercise-type');
        if (typeElement) {
            typeElement.textContent = exercise.type === 'time' ? 'Tiempo' : 'Repeticiones';
        }
        
        // Configurar temporizador según tipo de ejercicio
        const exerciseTimeElement = document.getElementById('current-exercise-time');
        if (exerciseTimeElement) {
            if (exercise.type === 'time') {
                // Ejercicio por tiempo
                const timeValue = exercise.value || 30;
                exerciseTimeElement.textContent = this.formatTime(timeValue);
                this.timeLeft = timeValue;
                this.totalTime = timeValue;
                
                // Configurar para tiempo
                exerciseTimeElement.innerHTML = this.formatTime(timeValue);
                this.startExerciseTimer();
            } else {
                // Ejercicio por repeticiones
                const repsValue = exercise.value || 10;
                this.timeLeft = 0;
                this.totalTime = 1;
                
                // Mostrar botón para completar manualmente
                exerciseTimeElement.innerHTML = `
                    <div class="manual-completion">
                        <span class="reps-display">${repsValue} reps</span>
                        <button class="complete-manual-btn" onclick="aliahApp.completeManualExercise()">
                            <i class="fas fa-check"></i> Completar
                        </button>
                    </div>
                `;
            }
        }
        
        // Actualizar información de ronda y progreso
        this.updateRoundAndProgressInfo();
        
        // Resaltar ejercicio actual en la lista
        this.highlightCurrentExercise();
        
        // Actualizar barra de progreso
        this.updateProgressBar();
    }
    
    startExerciseTimer() {
        // Limpiar temporizador anterior si existe
        if (this.playlistTimer) {
            clearInterval(this.playlistTimer);
            this.playlistTimer = null;
        }
        
        this.playlistTimer = setInterval(() => {
            if (this.isPlaying && !this.isResting) {
                this.timeLeft--;
                
                // Actualizar tiempo restante
                const exerciseTimeElement = document.getElementById('current-exercise-time');
                if (exerciseTimeElement) {
                    exerciseTimeElement.textContent = this.formatTime(this.timeLeft);
                }
                
                // Actualizar barra de progreso
                this.updateProgressBar();
                
                // Si el tiempo se agota, pasar al siguiente ejercicio
                if (this.timeLeft <= 0) {
                    clearInterval(this.playlistTimer);
                    this.nextExercise();
                }
            }
        }, 1000);
    }
    
    completeManualExercise() {
        // Ejercicio por repeticiones completado manualmente
        this.nextExercise();
    }
    
    togglePausePlaylist() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            // Reanudar
            this.updatePlaybackControls(true);
            
            if (this.currentExercise?.type === 'time' && !this.isResting) {
                this.startExerciseTimer();
            }
            
            this.startTotalTimer();
        } else {
            // Pausar
            this.updatePlaybackControls(false);
            
            if (this.playlistTimer) {
                clearInterval(this.playlistTimer);
            }
            
            if (this.totalTimer) {
                clearInterval(this.totalTimer);
            }
        }
        
        // Guardar estado
        this.savePlaybackState();
    }
    
    stopPlaylist() {
        this.isPlaying = false;
        
        if (this.playlistTimer) {
            clearInterval(this.playlistTimer);
            this.playlistTimer = null;
        }
        
        if (this.totalTimer) {
            clearInterval(this.totalTimer);
            this.totalTimer = null;
        }
        
        this.updatePlaybackControls(false);
        
        const player = document.getElementById('playlist-player');
        if (player) {
            player.classList.add('minimized');
        }
        
        this.totalElapsedTime = 0;
        const totalTimerElement = document.getElementById('player-total-time');
        if (totalTimerElement) {
            totalTimerElement.textContent = '00:00';
        }
        
        // Quitar resaltado de ejercicio actual
        document.querySelectorAll('.exercise-item-modern').forEach(item => {
            item.classList.remove('active', 'playing');
        });
        
        // Limpiar estado de reproducción
        this.clearPlaybackState();
    }
    
    restartPlaylist() {
        this.stopPlaylist();
        setTimeout(() => {
            this.currentRoundIndex = 0;
            this.currentExerciseIndex = 0;
            this.totalElapsedTime = 0;
            this.startPlaylist();
        }, 100);
    }
    
    prevExercise() {
        if (this.currentExerciseIndex > 0) {
            this.currentExerciseIndex--;
        } else if (this.currentRoundIndex > 0) {
            this.currentRoundIndex--;
            const prevRound = this.currentRoutine.roundsData[this.currentRoundIndex];
            this.currentExerciseIndex = prevRound.exercises.length - 1;
        }
        
        this.startCurrentExercise();
    }
    
    nextExercise() {
        const currentRound = this.currentRoutine.roundsData[this.currentRoundIndex];
        
        if (this.currentExerciseIndex < currentRound.exercises.length - 1) {
            this.currentExerciseIndex++;
            this.startCurrentExercise();
        } else if (this.currentRoundIndex < this.currentRoutine.roundsData.length - 1) {
            // Mostrar descanso entre rondas
            this.showRestTimer(currentRound.restTime || 30);
        } else {
            this.completePlaylist();
        }
    }
    
    showRestTimer(seconds) {
        this.isResting = true;
        
        // Reproducir sonido de descanso
        this.playRestSound();
        
        const exerciseNameElement = document.getElementById('current-exercise-name');
        if (exerciseNameElement) {
            exerciseNameElement.textContent = 'DESCANSO';
        }
        
        const exerciseTimeElement = document.getElementById('current-exercise-time');
        if (exerciseTimeElement) {
            exerciseTimeElement.textContent = this.formatTime(seconds);
        }
        
        const typeElement = document.querySelector('.exercise-type');
        if (typeElement) {
            typeElement.textContent = 'Descanso';
        }
        
        this.timeLeft = seconds;
        this.totalTime = seconds;
        this.updateProgressBar();
        
        // Mostrar timer de descanso
        const restTimerDisplay = document.getElementById('rest-timer-display');
        if (restTimerDisplay) {
            restTimerDisplay.style.display = 'flex';
        }
        
        // Configurar temporizador de descanso
        if (this.playlistTimer) {
            clearInterval(this.playlistTimer);
        }
        
        let restTimer = seconds;
        this.playlistTimer = setInterval(() => {
            if (this.isPlaying && this.isResting) {
                restTimer--;
                
                // Actualizar tiempo de descanso
                if (exerciseTimeElement) {
                    exerciseTimeElement.textContent = this.formatTime(restTimer);
                }
                
                const restTimeElement = document.getElementById('rest-time');
                if (restTimeElement) {
                    restTimeElement.textContent = `${restTimer}s`;
                }
                
                this.updateProgressBar((seconds - restTimer) / seconds * 100);
                
                if (restTimer <= 0) {
                    clearInterval(this.playlistTimer);
                    this.isResting = false;
                    this.currentRoundIndex++;
                    this.currentExerciseIndex = 0;
                    
                    // Ocultar timer de descanso
                    if (restTimerDisplay) {
                        restTimerDisplay.style.display = 'none';
                    }
                    
                    this.startCurrentExercise();
                }
            }
        }, 1000);
    }
    
    completePlaylist() {
        // Reproducir sonido de completado
        this.playCompleteSound();
        
        this.stopPlaylist();
        
        // Guardar entrenamiento completado
        this.saveCompletedWorkout();
        
        // Mostrar modal de calificación después de un breve retraso
        setTimeout(() => {
            this.showRatingModal();
        }, 1500);
    }
    
    // ===== PERSISTENCIA DE REPRODUCCIÓN =====
    savePlaybackState() {
        this.playbackState = {
            routineId: this.currentRoutine?.id,
            roundIndex: this.currentRoundIndex,
            exerciseIndex: this.currentExerciseIndex,
            elapsedTime: this.totalElapsedTime,
            timeLeft: this.timeLeft,
            isPlaying: this.isPlaying,
            isResting: this.isResting,
            timestamp: Date.now()
        };
        
        localStorage.setItem(`aliah_playback_${this.currentUser}`, JSON.stringify(this.playbackState));
    }
    
    loadPlaybackState() {
        try {
            const saved = localStorage.getItem(`aliah_playback_${this.currentUser}`);
            if (saved) {
                const state = JSON.parse(saved);
                
                // Verificar que no haya pasado demasiado tiempo (2 horas)
                const twoHours = 2 * 60 * 60 * 1000;
                if (Date.now() - state.timestamp < twoHours) {
                    this.playbackState = state;
                    return true;
                } else {
                    // Estado demasiado viejo, limpiar
                    this.clearPlaybackState();
                }
            }
        } catch (e) {
            console.error('Error cargando estado de reproducción:', e);
        }
        return false;
    }
    
    clearPlaybackState() {
        localStorage.removeItem(`aliah_playback_${this.currentUser}`);
        this.playbackState = null;
    }
    
    // ===== SISTEMA DE CALIFICACIONES Y WORKOUTS =====
    saveCompletedWorkout() {
        if (!this.currentRoutine) return;
        
        const workoutId = Date.now();
        
        const workoutData = {
            id: workoutId,
            routineId: this.currentRoutine.id,
            routineName: this.currentRoutine.name,
            date: new Date().toISOString().split('T')[0],
            duration: this.totalElapsedTime,
            calories: this.currentRoutine.calories,
            completed: true,
            rating: null,
            notes: '',
            roundsCompleted: this.currentRoundIndex + 1,
            exercisesCompleted: this.getTotalExercisesCompleted()
        };
        
        if (!this.appData.workouts[this.currentUser]) {
            this.appData.workouts[this.currentUser] = [];
        }
        
        this.appData.workouts[this.currentUser].push(workoutData);
        
        // Registrar en calendario
        const today = new Date().toISOString().split('T')[0];
        this.appData.calendar[this.currentUser] = this.appData.calendar[this.currentUser] || {};
        this.appData.calendar[this.currentUser][today] = {
            type: 'completed',
            calories: this.currentRoutine.calories,
            duration: Math.floor(this.totalElapsedTime / 60)
        };
        
        this.saveAllData();
    }
    
    showRatingModal() {
        this.selectedRating = 0;
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const ratingText = document.getElementById('rating-text');
        if (ratingText) {
            ratingText.textContent = 'Selecciona una calificación';
        }
        
        const routineNotes = document.getElementById('routine-notes');
        if (routineNotes) {
            routineNotes.value = '';
        }
        
        const modal = document.getElementById('rating-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    hideRatingModal() {
        const modal = document.getElementById('rating-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    setRating(e) {
        const rating = parseInt(e.currentTarget.dataset.rating);
        this.selectedRating = rating;
        
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.rating) === rating) {
                btn.classList.add('active');
            }
        });
        
        const ratingTexts = {
            1: 'Difícil - Necesita ajustes o fue muy intenso',
            2: 'Adecuada - Perfecta para tu nivel actual',
            3: 'Fácil - Puedes aumentar la intensidad'
        };
        
        const ratingText = document.getElementById('rating-text');
        if (ratingText) {
            ratingText.textContent = ratingTexts[rating] || 'Selecciona una calificación';
        }
    }
    
    saveRating() {
        if (!this.selectedRating) {
            this.showNotification('Por favor califica la rutina', 'warning');
            return;
        }
        
        const notes = document.getElementById('routine-notes')?.value.trim() || '';
        const ratingId = Date.now();
        
        // Guardar calificación
        const ratingData = {
            id: ratingId,
            routineId: this.currentRoutine.id,
            routineName: this.currentRoutine.name,
            rating: this.selectedRating,
            notes: notes,
            duration: this.totalElapsedTime,
            calories: this.currentRoutine.calories,
            date: new Date().toISOString(),
            userId: this.currentUser
        };
        
        if (!this.appData.ratings[this.currentUser]) {
            this.appData.ratings[this.currentUser] = [];
        }
        this.appData.ratings[this.currentUser].push(ratingData);
        
        // Actualizar el workout más reciente con la calificación
        const workouts = this.appData.workouts[this.currentUser] || [];
        if (workouts.length > 0) {
            const lastWorkout = workouts[workouts.length - 1];
            lastWorkout.rating = this.selectedRating;
            lastWorkout.notes = notes;
        }
        
        // Incrementar contador de uso de la rutina
        this.incrementRoutineUsage(this.currentRoutine.id);
        
        this.saveAllData();
        this.hideRatingModal();
        
        this.showNotification(
            `¡Entrenamiento completado en ${this.formatTime(this.totalElapsedTime)}! Calificación: ${this.selectedRating}/3`,
            'success'
        );
        
        // Preguntar si quiere exportar
        setTimeout(() => {
            if (confirm('¿Deseas exportar los datos de este entrenamiento?')) {
                this.exportTrainingData(ratingData);
            }
        }, 1000);
    }
    
    exportTrainingData(specificRating = null) {
        const exportData = {
            user: this.currentUser,
            exportDate: new Date().toISOString(),
            appVersion: 'AliahFIT 1.0',
            data: {
                ratings: this.appData.ratings[this.currentUser] || [],
                workouts: this.appData.workouts[this.currentUser] || [],
                routines: this.appData.routines[this.currentUser] || [],
                calendar: this.appData.calendar[this.currentUser] || {}
            }
        };
        
        if (specificRating) {
            exportData.currentSession = specificRating;
        }
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `aliah_entrenamientos_${this.currentUser}_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Datos exportados exitosamente', 'success');
    }
    
    exportAllData() {
        const exportData = {
            user: this.currentUser,
            exportDate: new Date().toISOString(),
            appVersion: 'AliahFIT 1.0',
            data: this.appData
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `aliah_datos_completos_${this.currentUser}_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Todos los datos exportados exitosamente', 'success');
    }
    
    // ===== CALENDARIO =====
    generateCalendar() {
        this.updateCalendar();
    }
    
    updateCalendar() {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const month = this.currentCalendarDate.getMonth();
        const year = this.currentCalendarDate.getFullYear();
        
        const currentMonthElement = document.getElementById('current-month');
        if (currentMonthElement) {
            currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        }
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        const calendarDays = document.getElementById('calendar-days');
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        
        // Días vacíos al inicio
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        const userCalendar = this.appData.calendar[this.currentUser] || {};
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            // Verificar si es hoy
            if (dateStr === todayStr) {
                dayElement.classList.add('today');
            }
            
            // Verificar si hay registro para este día
            if (userCalendar[dateStr]) {
                dayElement.classList.add(userCalendar[dateStr].type);
                
                // Agregar tooltip con información
                if (userCalendar[dateStr].type === 'completed') {
                    dayElement.title = `✅ Entrenamiento\n⏱️ ${userCalendar[dateStr].duration} min\n🔥 ${userCalendar[dateStr].calories} cal`;
                } else {
                    dayElement.title = '😴 Día de descanso';
                }
            }
            
            // Hacer clicable para agregar/editar
            dayElement.addEventListener('click', (e) => {
                this.handleDayClick(dateStr, userCalendar[dateStr], dayElement);
            });
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    handleDayClick(dateStr, dayData, dayElement) {
        if (dayData) {
            // Si ya hay datos, mostrar detalles
            this.showDayDetails(dateStr, dayData);
        } else {
            // Si no hay datos, permitir agregar
            this.showAddWorkoutModal(dateStr, dayElement);
        }
    }
    
    showAddWorkoutModal(dateStr, dayElement) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3><i class="fas fa-dumbbell"></i> Agregar Entrenamiento</h3>
                    <button class="btn-icon close-modal-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Agregar entrenamiento para: <strong>${dateStr}</strong></p>
                    
                    <div class="form-group">
                        <label>Tipo:</label>
                        <div class="type-selector">
                            <button class="type-btn workout-type-btn active" data-type="completed">
                                <i class="fas fa-check-circle"></i>
                                <span>Entrenamiento</span>
                            </button>
                            <button class="type-btn workout-type-btn" data-type="rest-day">
                                <i class="fas fa-bed"></i>
                                <span>Descanso</span>
                            </button>
                        </div>
                    </div>
                    
                    <div id="workout-details">
                        <div class="form-group">
                            <label for="workout-duration">Duración (minutos):</label>
                            <input type="number" id="workout-duration" min="5" max="180" value="45">
                        </div>
                        
                        <div class="form-group">
                            <label for="workout-calories">Calorías quemadas:</label>
                            <input type="number" id="workout-calories" min="50" max="1000" value="300">
                        </div>
                        
                        <div class="form-group">
                            <label for="workout-routine">Rutina (opcional):</label>
                            <select id="workout-routine">
                                <option value="">Seleccionar rutina</option>
                                ${(this.appData.routines[this.currentUser] || []).map(r => 
                                    `<option value="${r.id}">${r.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary cancel-workout-btn">
                            <i class="fas fa-times"></i>
                            <span>Cancelar</span>
                        </button>
                        <button class="btn-primary save-workout-btn">
                            <i class="fas fa-save"></i>
                            <span>Guardar</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners para el modal
        const closeBtn = modal.querySelector('.close-modal-btn');
        const cancelBtn = modal.querySelector('.cancel-workout-btn');
        const saveBtn = modal.querySelector('.save-workout-btn');
        const typeBtns = modal.querySelectorAll('.workout-type-btn');
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        
        typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                typeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const workoutDetails = modal.querySelector('#workout-details');
                if (btn.dataset.type === 'rest-day') {
                    workoutDetails.style.display = 'none';
                } else {
                    workoutDetails.style.display = 'block';
                }
            });
        });
        
        saveBtn.addEventListener('click', () => {
            const selectedType = modal.querySelector('.workout-type-btn.active').dataset.type;
            
            if (selectedType === 'completed') {
                const duration = parseInt(modal.querySelector('#workout-duration').value) || 45;
                const calories = parseInt(modal.querySelector('#workout-calories').value) || 300;
                const routineId = modal.querySelector('#workout-routine').value;
                const routine = routineId ? this.appData.routines[this.currentUser]?.find(r => r.id.toString() === routineId) : null;
                
                // Guardar en calendario
                this.appData.calendar[this.currentUser] = this.appData.calendar[this.currentUser] || {};
                this.appData.calendar[this.currentUser][dateStr] = {
                    type: 'completed',
                    duration: duration,
                    calories: calories,
                    routineId: routineId,
                    routineName: routine?.name || 'Personalizado'
                };
                
                // Crear workout entry
                const workoutId = Date.now();
                const workoutData = {
                    id: workoutId,
                    routineId: routineId,
                    routineName: routine?.name || 'Entrenamiento personalizado',
                    date: dateStr,
                    duration: duration * 60,
                    calories: calories,
                    completed: true,
                    rating: null,
                    notes: 'Agregado manualmente desde calendario'
                };
                
                if (!this.appData.workouts[this.currentUser]) {
                    this.appData.workouts[this.currentUser] = [];
                }
                this.appData.workouts[this.currentUser].push(workoutData);
                
                // Actualizar elemento del día
                dayElement.classList.add('completed');
                dayElement.title = `✅ Entrenamiento\n⏱️ ${duration} min\n🔥 ${calories} cal`;
                
            } else {
                // Día de descanso
                this.appData.calendar[this.currentUser] = this.appData.calendar[this.currentUser] || {};
                this.appData.calendar[this.currentUser][dateStr] = {
                    type: 'rest-day'
                };
                
                dayElement.classList.add('rest-day');
                dayElement.title = '😴 Día de descanso';
            }
            
            this.saveAllData();
            modal.remove();
            this.showNotification('Entrenamiento guardado exitosamente', 'success');
        });
    }
    
    changeMonth(delta) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + delta);
        this.updateCalendar();
    }
    
    showDayDetails(dateStr, dayData) {
        if (!dayData) {
            this.showNotification('No hay entrenamientos registrados en esta fecha', 'info');
            return;
        }
        
        let message = `Fecha: ${dateStr}\n`;
        
        if (dayData.type === 'completed') {
            message += `✅ Entrenamiento completado\n`;
            message += `⏱️ Duración: ${dayData.duration} min\n`;
            message += `🔥 Calorías: ${dayData.calories}\n`;
            
            // Buscar workout específico
            const workout = this.appData.workouts[this.currentUser]?.find(w => w.date === dateStr);
            if (workout) {
                message += `📝 Rutina: ${workout.routineName}\n`;
                if (workout.rating) {
                    message += `⭐ Calificación: ${workout.rating}/3\n`;
                }
            }
        } else {
            message += `😴 Día de descanso`;
        }
        
        alert(message);
    }
    
    // ===== PÁGINA DE PROGRESO =====
    loadProgressPage() {
        this.updateProgressBars();
        this.updateGoalsList();
    }
    
    updateProgressBars() {
        const workouts = this.appData.workouts[this.currentUser] || [];
        const completedWorkouts = workouts.filter(w => w.completed).length;
        
        // Progreso de peso (simulado)
        const weightProgress = Math.min(85, Math.floor((completedWorkouts / 10) * 100));
        const weightBar = document.getElementById('weight-progress');
        if (weightBar) {
            weightBar.style.width = `${weightProgress}%`;
            weightBar.parentElement.nextElementSibling.textContent = `${weightProgress}% del objetivo`;
        }
        
        // Progreso de resistencia (basado en duración total)
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const enduranceProgress = Math.min(70, Math.floor((totalDuration / 3600) * 100));
        const enduranceBar = document.getElementById('endurance-progress');
        if (enduranceBar) {
            enduranceBar.style.width = `${enduranceProgress}%`;
            enduranceBar.parentElement.nextElementSibling.textContent = `${enduranceProgress}% del objetivo`;
        }
        
        // Progreso de fuerza (basado en calorías)
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        const strengthProgress = Math.min(90, Math.floor((totalCalories / 5000) * 100));
        const strengthBar = document.getElementById('strength-progress');
        if (strengthBar) {
            strengthBar.style.width = `${strengthProgress}%`;
            strengthBar.parentElement.nextElementSibling.textContent = `${strengthProgress}% del objetivo`;
        }
    }
    
    updateGoalsList() {
        const goalsList = document.querySelector('.goals-list');
        if (!goalsList) return;
        
        const workouts = this.appData.workouts[this.currentUser] || [];
        const completedWorkouts = workouts.filter(w => w.completed);
        const thisMonth = new Date().getMonth();
        const monthlyWorkouts = completedWorkouts.filter(w => {
            const workoutDate = new Date(w.date);
            return workoutDate.getMonth() === thisMonth;
        });
        
        goalsList.innerHTML = `
            <div class="goal-item">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Completar 12 sesiones este mes</h4>
                    <p>${monthlyWorkouts.length}/12 completadas</p>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar" style="width: ${(monthlyWorkouts.length / 12) * 100}%;"></div>
                </div>
            </div>
            
            <div class="goal-item">
                <i class="fas fa-dumbbell"></i>
                <div>
                    <h4>Quemar 3000 calorías</h4>
                    <p>${workouts.reduce((sum, w) => sum + (w.calories || 0), 0)}/3000 calorías</p>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar" style="width: ${Math.min(100, (workouts.reduce((sum, w) => sum + (w.calories || 0), 0) / 3000) * 100)}%;"></div>
                </div>
            </div>
            
            <div class="goal-item">
                <i class="fas fa-clock"></i>
                <div>
                    <h4>Acumular 10 horas de entrenamiento</h4>
                    <p>${Math.floor(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / 3600)}/10 horas</p>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar" style="width: ${Math.min(100, (workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / 36000) * 100)}%;"></div>
                </div>
            </div>
        `;
    }
    
    // ===== FUNCIONES AUXILIARES =====
    updateRoundAndProgressInfo() {
        if (!this.currentRoutine || !this.currentRoutine.roundsData) return;
        
        const round = this.currentRoutine.roundsData[this.currentRoundIndex];
        if (!round) return;
        
        // Actualizar información de ronda
        const currentRoundElement = document.getElementById('player-current-round');
        if (currentRoundElement) {
            currentRoundElement.textContent = 
                `${this.currentRoundIndex + 1}/${this.currentRoutine.roundsData.length}`;
        }
        
        // Actualizar calorías
        const caloriesElement = document.getElementById('player-current-calories');
        if (caloriesElement) {
            // Calorías estimadas basadas en tiempo transcurrido
            const estimatedCalories = Math.round((this.totalElapsedTime / 60) * (this.currentRoutine.calories / this.currentRoutine.duration));
            caloriesElement.textContent = estimatedCalories;
        }
        
        // Actualizar duración de rutina
        const durationElement = document.getElementById('player-routine-duration');
        if (durationElement) {
            durationElement.textContent = `${this.currentRoutine.duration}min`;
        }
    }
    
    highlightCurrentExercise() {
        // Remover clase active de todos los ejercicios
        document.querySelectorAll('.exercise-item-modern').forEach(item => {
            item.classList.remove('active', 'playing');
        });
        
        // Agregar clase active al ejercicio actual
        const currentExercise = document.querySelector(
            `.exercise-item-modern[data-round-index="${this.currentRoundIndex}"][data-exercise-index="${this.currentExerciseIndex}"]`
        );
        
        if (currentExercise) {
            currentExercise.classList.add('active', 'playing');
            
            // Desplazar para que sea visible
            currentExercise.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    updateProgressBar(percentage = null) {
        if (percentage === null) {
            percentage = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        }
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    togglePlayerMinimize() {
        this.isPlayerMinimized = !this.isPlayerMinimized;
        const player = document.getElementById('playlist-player');
        if (player) {
            player.classList.toggle('minimized');
        }
        
        const minimizeBtn = document.getElementById('minimize-player');
        if (minimizeBtn) {
            minimizeBtn.innerHTML = this.isPlayerMinimized ? 
                '<i class="fas fa-window-maximize"></i>' : 
                '<i class="fas fa-window-minimize"></i>';
        }
    }
    
    closePlayer() {
        this.stopPlaylist();
    }
    
    toggleSounds() {
        this.soundsEnabled = !this.soundsEnabled;
        const soundBtn = document.getElementById('sound-toggle');
        
        if (soundBtn) {
            if (this.soundsEnabled) {
                soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                soundBtn.classList.add('sound-active');
                this.showNotification('Sonidos: ACTIVADOS', 'success');
            } else {
                soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                soundBtn.classList.remove('sound-active');
                this.showNotification('Sonidos: DESACTIVADOS', 'info');
            }
        }
    }
    
    playExerciseSound() {
        if (this.soundsEnabled && this.exerciseSound) {
            this.exerciseSound.currentTime = 0;
            this.exerciseSound.play().catch(e => console.log('Error reproduciendo sonido de ejercicio:', e));
        }
    }
    
    playRestSound() {
        if (this.soundsEnabled && this.restSound) {
            this.restSound.currentTime = 0;
            this.restSound.play().catch(e => console.log('Error reproduciendo sonido de descanso:', e));
        }
    }
    
    playCompleteSound() {
        if (this.soundsEnabled && this.completeSound) {
            this.completeSound.currentTime = 0;
            this.completeSound.play().catch(e => console.log('Error reproduciendo sonido de completado:', e));
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    getRoutineType(routine) {
        const name = routine.name.toLowerCase();
        if (name.includes('full') || name.includes('complete')) return 'Full Body';
        if (name.includes('upper')) return 'Upper Body';
        if (name.includes('lower') || name.includes('leg')) return 'Leg Day';
        if (name.includes('cardio')) return 'Cardio';
        if (name.includes('strength')) return 'Fuerza';
        return 'Personalizada';
    }
    
    countTotalExercises(routine) {
        if (!routine.roundsData) return 0;
        return routine.roundsData.reduce((total, round) => total + (round.exercises?.length || 0), 0);
    }
    
    getTotalExercisesCompleted() {
        if (!this.currentRoutine || !this.currentRoutine.roundsData) return 0;
        
        let total = 0;
        for (let i = 0; i < this.currentRoundIndex; i++) {
            total += this.currentRoutine.roundsData[i].exercises?.length || 0;
        }
        total += this.currentExerciseIndex + 1;
        
        return total;
    }
    
    generateRoutineTags(routine) {
        const tags = [];
        
        // Dificultad
        if (routine.difficulty === 'alta') tags.push('💪 Intensa');
        else if (routine.difficulty === 'baja') tags.push('😌 Leve');
        else tags.push('⚖️ Media');
        
        // Duración
        if (routine.duration < 20) tags.push('⏱️ Corta');
        else if (routine.duration > 40) tags.push('⏱️ Larga');
        
        // Tipo de ejercicios
        const hasTime = routine.roundsData?.some(r => r.exercises?.some(e => e.type === 'time'));
        const hasReps = routine.roundsData?.some(r => r.exercises?.some(e => e.type === 'reps'));
        
        if (hasTime && hasReps) tags.push('🔄 Mixta');
        else if (hasTime) tags.push('⏰ Por tiempo');
        else if (hasReps) tags.push('🔢 Por repeticiones');
        
        // Popularidad
        if (routine.usageCount > 10) tags.push('🔥 Popular');
        if (routine.usageCount === 0) tags.push('🆕 Nueva');
        
        return tags.map(tag => `<span class="routine-tag">${tag}</span>`).join('');
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Reciente';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short',
            year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
        });
    }
    
    useRoutineInPlaylist(routineId) {
        const routine = this.appData.routines[this.currentUser]?.find(r => r.id === routineId);
        if (!routine) {
            this.showNotification('Rutina no encontrada', 'error');
            return;
        }
        
        // Navegar a playlist y cargar rutina
        this.navigateToPage('playlist');
        
        // Cargar rutina
        setTimeout(() => {
            this.loadRoutine(routine.id.toString());
        }, 100);
    }
    
    selectRoutineForPlaylist(id) {
        const routine = this.appData.routines[this.currentUser]?.find(r => r.id === id);
        if (routine) {
            this.useRoutineInPlaylist(id);
        }
    }
    
    incrementRoutineUsage(routineId) {
        const routine = this.appData.routines[this.currentUser]?.find(r => r.id === routineId);
        if (routine) {
            routine.usageCount = (routine.usageCount || 0) + 1;
            routine.lastUsed = new Date().toISOString();
            this.saveAllData();
        }
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `app-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showValidationError(message) {
        this.showNotification(message, 'error');
    }
    
    loadUserData() {
        // Asegurar que el usuario tenga todos los datos necesarios
        this.ensureUserData(this.currentUser);
        
        // Cargar preferencias de sonido
        const userSettings = this.appData.settings[this.currentUser];
        if (userSettings) {
            this.soundsEnabled = userSettings.sounds !== false;
            this.updateSoundButton();
        }
    }
    
    updateSoundButton() {
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) {
            if (this.soundsEnabled) {
                soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                soundBtn.classList.add('sound-active');
            } else {
                soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                soundBtn.classList.remove('sound-active');
            }
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // ===== AUTENTICACIÓN =====
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.login(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.register(e));
        }
        
        // Tabs de autenticación
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e));
        });
        
        // ===== NAVEGACIÓN PRINCIPAL =====
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.navigateToPage(e));
        });
        
        // Botón volver
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
        }
        
        // Botón logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // ===== PLAYLIST =====
        const routineSelect = document.getElementById('routine-select');
        if (routineSelect) {
            routineSelect.addEventListener('change', (e) => {
                this.loadRoutine(e.target.value);
            });
        }
        
        const refreshRoutinesBtn = document.getElementById('refresh-routines-btn');
        if (refreshRoutinesBtn) {
            refreshRoutinesBtn.addEventListener('click', () => {
                this.updateRoutineSelect();
                this.showNotification('Lista de rutinas actualizada', 'success');
            });
        }
        
        const gotoCreateRoutine = document.getElementById('goto-create-routine');
        if (gotoCreateRoutine) {
            gotoCreateRoutine.addEventListener('click', () => {
                this.navigateToPage('routine');
            });
        }
        
        const playRoutineBtn = document.querySelector('.play-routine');
        if (playRoutineBtn) {
            playRoutineBtn.addEventListener('click', () => {
                this.startPlaylist();
            });
        }
        
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleSounds();
            });
        }
        
        // ===== CONTROLES DE PLAYLIST =====
        const startPlaylistBtn = document.getElementById('start-playlist');
        if (startPlaylistBtn) {
            startPlaylistBtn.addEventListener('click', () => {
                this.startPlaylist();
            });
        }
        
        const pausePlaylistBtn = document.getElementById('pause-playlist');
        if (pausePlaylistBtn) {
            pausePlaylistBtn.addEventListener('click', () => {
                this.togglePausePlaylist();
            });
        }
        
        const restartPlaylistBtn = document.getElementById('restart-playlist');
        if (restartPlaylistBtn) {
            restartPlaylistBtn.addEventListener('click', () => {
                this.restartPlaylist();
            });
        }
        
        const stopPlaylistBtn = document.getElementById('stop-playlist');
        if (stopPlaylistBtn) {
            stopPlaylistBtn.addEventListener('click', () => {
                this.stopPlaylist();
            });
        }
        
        // ===== REPRODUCTOR =====
        const minimizePlayerBtn = document.getElementById('minimize-player');
        if (minimizePlayerBtn) {
            minimizePlayerBtn.addEventListener('click', () => {
                this.togglePlayerMinimize();
            });
        }
        
        const closePlayerBtn = document.getElementById('close-player');
        if (closePlayerBtn) {
            closePlayerBtn.addEventListener('click', () => {
                this.closePlayer();
            });
        }
        
        // Controles del reproductor de 5 columnas
        const playerPrevBtn = document.getElementById('player-prev-btn');
        if (playerPrevBtn) {
            playerPrevBtn.addEventListener('click', () => {
                this.prevExercise();
            });
        }
        
        const playerPauseBtn = document.getElementById('player-pause-btn');
        if (playerPauseBtn) {
            playerPauseBtn.addEventListener('click', () => {
                this.togglePausePlaylist();
                // Actualizar ícono del botón
                const pauseIcon = document.getElementById('pause-icon');
                const pauseText = document.getElementById('pause-text');
                if (pauseIcon && pauseText) {
                    if (this.isPlaying) {
                        pauseIcon.className = 'fas fa-pause';
                        pauseText.textContent = 'PAUSA';
                    } else {
                        pauseIcon.className = 'fas fa-play';
                        pauseText.textContent = 'PLAY';
                    }
                }
            });
        }
        
        const playerNextBtn = document.getElementById('player-next-btn');
        if (playerNextBtn) {
            playerNextBtn.addEventListener('click', () => {
                this.nextExercise();
            });
        }
        
        // ===== MODAL DE CALIFICACIÓN =====
        const closeRatingModalBtn = document.getElementById('close-rating-modal');
        if (closeRatingModalBtn) {
            closeRatingModalBtn.addEventListener('click', () => {
                this.hideRatingModal();
            });
        }
        
        const skipRatingBtn = document.getElementById('skip-rating');
        if (skipRatingBtn) {
            skipRatingBtn.addEventListener('click', () => {
                this.hideRatingModal();
            });
        }
        
        const saveRatingBtn = document.getElementById('save-rating');
        if (saveRatingBtn) {
            saveRatingBtn.addEventListener('click', () => {
                this.saveRating();
            });
        }
        
        // Sistema de calificación
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setRating(e));
        });
        
        // ===== CALENDARIO =====
        const prevMonthBtn = document.getElementById('prev-month');
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.changeMonth(-1);
            });
        }
        
        const nextMonthBtn = document.getElementById('next-month');
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.changeMonth(1);
            });
        }
        
        // ===== CREACIÓN DE RUTINAS =====
        // Botón principal de crear rutina (en vista lista)
        const createRoutineBtn = document.getElementById('create-routine-btn');
        if (createRoutineBtn) {
            createRoutineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showRoutineCreation();
            });
        }
        
        // SIMPLIFICAR EL EVENT LISTENER PRINCIPAL
        document.addEventListener('click', (e) => {
            // 1. BOTÓN AGREGAR RONDA (principal)
            if (e.target.closest('#add-round-creation')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔼 Agregando nueva ronda');
                this.addRoundToCreation();
                return;
            }
            
            // 2. BOTÓN GUARDAR RUTINA
            if (e.target.closest('#save-routine-btn')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('💾 Guardando rutina...');
                this.saveCreatedRoutine();
                return;
            }
            
            // 3. BOTONES DE PASOS
            if (e.target.closest('.next-step')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.next-step');
                const step = btn.getAttribute('data-step');
                this.goToStep(step);
                return;
            }
            
            if (e.target.closest('.prev-step')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.prev-step');
                const step = btn.getAttribute('data-step');
                this.showStep(step);
                return;
            }
            
            // 4. BOTÓN VOLVER A LISTA
            if (e.target.closest('.back-to-list-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.showRoutineList();
                return;
            }
        });
        
        // ===== ACCIONES RÁPIDAS EN HOME =====
        // Los botones de acciones rápidas ya tienen onclick en HTML
        // Solo necesitamos asegurarnos de que las funciones estén disponibles globalmente
        window.aliahApp = this;
        
        // ===== EXPORTACIÓN DE DATOS =====
        this.addExportButtons();
    }
    
    addExportButtons() {
        // Agregar botón de exportación en estadísticas
        const statsPage = document.getElementById('stats-page');
        if (statsPage && !document.getElementById('export-all-data-btn')) {
            const exportBtn = document.createElement('button');
            exportBtn.id = 'export-all-data-btn';
            exportBtn.className = 'btn-primary';
            exportBtn.style.cssText = 'margin-top: 20px; width: 100%; padding: 12px;';
            exportBtn.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Exportar todos mis datos</span>
            `;
            exportBtn.addEventListener('click', () => {
                this.exportAllData();
            });
            
            statsPage.appendChild(exportBtn);
        }
    }
    
    switchAuthTab(e) {
        const tab = e.currentTarget;
        const tabId = tab.getAttribute('data-tab');
        
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        const form = document.getElementById(`${tabId}-form`);
        if (form) {
            form.classList.add('active');
        }
    }
}

// Hacer funciones accesibles globalmente
window.completeManualExercise = function() {
    if (window.aliahApp) {
        window.aliahApp.completeManualExercise();
    }
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.aliahApp = new AliahApp();
});
