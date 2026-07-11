// ==================== STATE MANAGEMENT ====================
let appState = {
  currentTab: 'home',
  quiz: {
    topic: '',
    count: 5,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    started: false,
    completed: false
  },
  notes: [],
  timer: {
    workDuration: 25,
    breakDuration: 5,
    isRunning: false,
    isPaused: false,
    timeRemaining: 25 * 60,
    isWorkSession: true,
    sessionsToday: 0,
    totalMinutesToday: 0
  },
  stats: {
    quizzesToday: 0,
    notesToday: 0,
    minutesStudiedToday: 0,
    recentActivities: []
  }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  initializeEventListeners();
  updateStats();
  renderNotes();
});

function initializeEventListeners() {
  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
  });

  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', openModal);

  // Load dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode(true);
  }
}

// ==================== TAB MANAGEMENT ====================
function switchTab(tabName) {
  appState.currentTab = tabName;

  // Hide all tabs
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  // Show active tab
  document.getElementById(tabName).classList.add('active');

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  // Update timer display when switching to timer tab
  if (tabName === 'timer') {
    updateTimerDisplay();
  }
}

// ==================== QUIZ FUNCTIONALITY ====================
function startQuiz() {
  const topic = document.getElementById('quizTopic').value.trim();
  const count = parseInt(document.getElementById('quizCount').value);

  if (!topic) {
    alert('Please enter a topic');
    return;
  }

  appState.quiz.topic = topic;
  appState.quiz.count = count;
  appState.quiz.questions = generateQuestions(topic, count);
  appState.quiz.currentQuestionIndex = 0;
  appState.quiz.answers = new Array(count).fill(null);
  appState.quiz.started = true;
  appState.quiz.completed = false;

  if (appState.quiz.questions.length === 0) {
    alert('No questions available for this topic. Try: Math, Science, or Exams');
    return;
  }

  document.getElementById('quizSetup').classList.add('hidden');
  document.getElementById('quizSession').classList.remove('hidden');
  document.getElementById('quizResults').classList.add('hidden');

  displayQuestion();
  addActivity(`Started quiz on ${topic}`);
}

function generateQuestions(topic, count) {
  // Use QB_BRAIN from data.js
  const questions = getQuestionsByTopic(topic);
  
  if (questions.length === 0) {
    return [];
  }
  
  return getRandomQuestions(questions, count);
}

function displayQuestion() {
  const question = appState.quiz.questions[appState.quiz.currentQuestionIndex];
  const progress = ((appState.quiz.currentQuestionIndex + 1) / appState.quiz.count) * 100;

  document.getElementById('questionNumber').textContent = 
    `Question ${appState.quiz.currentQuestionIndex + 1} of ${appState.quiz.count}`;
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('questionText').textContent = question.q;

  const container = document.getElementById('answersContainer');
  container.innerHTML = '';

  question.a.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = answer;
    
    if (appState.quiz.answers[appState.quiz.currentQuestionIndex] === index) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => selectAnswer(index));
    container.appendChild(btn);
  });

  document.getElementById('prevBtn').disabled = appState.quiz.currentQuestionIndex === 0;
  const isLastQuestion = appState.quiz.currentQuestionIndex === appState.quiz.count - 1;
  document.getElementById('nextBtn').textContent = isLastQuestion ? 'Finish' : 'Next →';
}

function selectAnswer(index) {
  appState.quiz.answers[appState.quiz.currentQuestionIndex] = index;
  document.querySelectorAll('.answer-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });
}

function nextQuestion() {
  if (appState.quiz.currentQuestionIndex === appState.quiz.count - 1) {
    completeQuiz();
  } else {
    appState.quiz.currentQuestionIndex++;
    displayQuestion();
  }
}

function prevQuestion() {
  if (appState.quiz.currentQuestionIndex > 0) {
    appState.quiz.currentQuestionIndex--;
    displayQuestion();
  }
}

function completeQuiz() {
  const correct = appState.quiz.answers.filter((ans, i) => 
    ans === appState.quiz.questions[i].c
  ).length;
  const score = Math.round((correct / appState.quiz.count) * 100);

  appState.quiz.completed = true;
  appState.stats.quizzesToday++;

  document.getElementById('quizSession').classList.add('hidden');
  document.getElementById('quizResults').classList.remove('hidden');
  document.getElementById('finalScore').textContent = score;

  if (score >= 80) {
    document.getElementById('resultMessage').textContent = 'Excellent work! 🌟';
  } else if (score >= 60) {
    document.getElementById('resultMessage').textContent = 'Good job! Keep practicing! 💪';
  } else {
    document.getElementById('resultMessage').textContent = 'Review the material and try again! 📚';
  }

  updateStats();
  addActivity(`Completed quiz on ${appState.quiz.topic} - Score: ${score}%`);
  saveToStorage();
}

function resetQuiz() {
  appState.quiz = {
    topic: '',
    count: 5,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    started: false,
    completed: false
  };

  document.getElementById('quizTopic').value = '';
  document.getElementById('quizCount').value = '5';
  document.getElementById('quizSetup').classList.remove('hidden');
  document.getElementById('quizSession').classList.add('hidden');
  document.getElementById('quizResults').classList.add('hidden');
}

// ==================== NOTES FUNCTIONALITY ====================
function saveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if (!title || !content) {
    alert('Please enter both title and content');
    return;
  }

  const note = {
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleDateString()
  };

  appState.notes.unshift(note);
  appState.stats.notesToday++;

  clearNote();
  renderNotes();
  updateStats();
  addActivity(`Created note: ${title}`);
  saveToStorage();
}

function clearNote() {
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
}

function renderNotes() {
  const container = document.getElementById('notesList');

  if (appState.notes.length === 0) {
    container.innerHTML = '<p class="empty-state">No notes yet. Create your first note!</p>';
    return;
  }

  container.innerHTML = appState.notes.map(note => `
    <div class="note-card">
      <h4>${escapeHtml(note.title)}</h4>
      <p>${escapeHtml(note.content)}</p>
      <span class="note-date">${note.date}</span>
      <button class="note-delete" onclick="deleteNote(${note.id})">Delete</button>
    </div>
  `).join('');
}

function deleteNote(id) {
  appState.notes = appState.notes.filter(note => note.id !== id);
  renderNotes();
  saveToStorage();
}

// ==================== TIMER FUNCTIONALITY ====================
function startTimer() {
  if (!appState.timer.isRunning) {
    appState.timer.isRunning = true;
    appState.timer.isPaused = false;
    document.getElementById('startTimerBtn').disabled = true;
    document.getElementById('pauseTimerBtn').disabled = false;

    const interval = setInterval(() => {
      if (!appState.timer.isPaused && appState.timer.isRunning) {
        appState.timer.timeRemaining--;

        if (appState.timer.timeRemaining <= 0) {
          completeTimerSession(interval);
        }

        updateTimerDisplay();
      }
    }, 1000);
  }
}

function pauseTimer() {
  appState.timer.isPaused = !appState.timer.isPaused;
  document.getElementById('pauseTimerBtn').textContent = appState.timer.isPaused ? 'Resume' : 'Pause';
}

function resetTimer() {
  appState.timer.isRunning = false;
  appState.timer.isPaused = false;
  appState.timer.timeRemaining = appState.timer.workDuration * 60;
  document.getElementById('startTimerBtn').disabled = false;
  document.getElementById('pauseTimerBtn').disabled = true;
  document.getElementById('pauseTimerBtn').textContent = 'Pause';
  updateTimerDisplay();
}

function completeTimerSession(interval) {
  clearInterval(interval);
  appState.timer.isRunning = false;

  const minutesStudied = appState.timer.workDuration;
  appState.timer.totalMinutesToday += minutesStudied;
  appState.stats.minutesStudiedToday += minutesStudied;

  if (appState.timer.isWorkSession) {
    appState.timer.sessionsToday++;
    alert(`Great work! Take a ${appState.timer.breakDuration} minute break.`);
    appState.timer.isWorkSession = false;
    appState.timer.timeRemaining = appState.timer.breakDuration * 60;
  } else {
    alert('Break time over! Ready for another session?');
    appState.timer.isWorkSession = true;
    appState.timer.timeRemaining = appState.timer.workDuration * 60;
  }

  document.getElementById('startTimerBtn').disabled = false;
  document.getElementById('pauseTimerBtn').disabled = true;
  updateTimerDisplay();
  updateStats();
  saveToStorage();
}

function updateTimerSettings() {
  const work = parseInt(document.getElementById('workDuration').value);
  const breakDuration = parseInt(document.getElementById('breakDuration').value);

  if (work < 1 || breakDuration < 1) {
    alert('Please enter valid durations');
    return;
  }

  appState.timer.workDuration = work;
  appState.timer.breakDuration = breakDuration;
  resetTimer();
  alert('Timer settings updated!');
}

function updateTimerDisplay() {
  const minutes = Math.floor(appState.timer.timeRemaining / 60);
  const seconds = appState.timer.timeRemaining % 60;
  document.getElementById('timerValue').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  document.getElementById('sessionsToday').textContent = appState.timer.sessionsToday;
  document.getElementById('totalMinutes').textContent = appState.timer.totalMinutesToday;
}

// ==================== STATS & ACTIVITY ====================
function updateStats() {
  document.getElementById('todayQuizzes').textContent = appState.stats.quizzesToday;
  document.getElementById('todayNotes').textContent = appState.stats.notesToday;
  document.getElementById('todayMinutes').textContent = appState.stats.minutesStudiedToday;
  renderRecentActivity();
}

function addActivity(message) {
  appState.stats.recentActivities.unshift({
    message,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  if (appState.stats.recentActivities.length > 5) {
    appState.stats.recentActivities.pop();
  }
}

function renderRecentActivity() {
  const container = document.getElementById('recentList');

  if (appState.stats.recentActivities.length === 0) {
    container.innerHTML = '<p class="empty-state">No recent activity. Start studying!</p>';
    return;
  }

  container.innerHTML = appState.stats.recentActivities.map(activity => `
    <div class="activity-item">
      <strong>${activity.message}</strong>
      <small>${activity.time}</small>
    </div>
  `).join('');
}

// ==================== SETTINGS & MODAL ====================
function openModal() {
  document.getElementById('settingsModal').classList.add('active');
}

function closeModal() {
  document.getElementById('settingsModal').classList.remove('active');
}

function toggleDarkMode(skipSave = false) {
  const isDarkMode = document.body.classList.toggle('light-mode');
  
  if (!skipSave) {
    document.getElementById('darkMode').checked = isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
  } else {
    document.getElementById('darkMode').checked = isDarkMode;
  }
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    appState = {
      currentTab: 'home',
      quiz: {
        topic: '',
        count: 5,
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        started: false,
        completed: false
      },
      notes: [],
      timer: {
        workDuration: 25,
        breakDuration: 5,
        isRunning: false,
        isPaused: false,
        timeRemaining: 25 * 60,
        isWorkSession: true,
        sessionsToday: 0,
        totalMinutesToday: 0
      },
      stats: {
        quizzesToday: 0,
        notesToday: 0,
        minutesStudiedToday: 0,
        recentActivities: []
      }
    };

    localStorage.removeItem('appState');
    alert('All data cleared!');
    closeModal();
    location.reload();
  }
}

// ==================== STORAGE ====================
function saveToStorage() {
  localStorage.setItem('appState', JSON.stringify(appState));
}

function loadFromStorage() {
  const stored = localStorage.getItem('appState');
  if (stored) {
    try {
      appState = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }
}

// ==================== UTILITY ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.addEventListener('beforeunload', saveToStorage);
setInterval(saveToStorage, 30000);
