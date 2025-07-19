// Application State
var currentUser = null;
var courses = [];
var userProgress = {};
var quizQuestions = [];
var currentQuizIndex = 0;
var quizScore = 0;
var isQuizActive = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadCourses();
    loadQuizQuestions();
    updateProgressBar();
});

function initializeApp() {
    // Load user data from localStorage
    var savedUser = localStorage.getItem('growMoreUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateLoginStatus();
    }

    // Load user progress
    var savedProgress = localStorage.getItem('growMoreProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }

    // Set initial theme
    var savedTheme = localStorage.getItem('growMoreTheme') || 'light';
    setTheme(savedTheme);

    // Update dashboard
    updateDashboard();
}

function setupEventListeners() {
    // Navigation
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = link.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Hamburger menu
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Theme toggle
    var themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Login button
    var loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', openLoginModal);

    // Login form
    var loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);

    // Course search and filter
    var searchInput = document.getElementById('course-search');
    var filterSelect = document.getElementById('course-filter');
    searchInput.addEventListener('input', filterCourses);
    filterSelect.addEventListener('change', filterCourses);

    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModals();
        }
    });

    // Scroll progress bar
    window.addEventListener('scroll', updateProgressBar);
}

// Navigation Functions
function navigateToSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });

    // Show target section
    var targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.classList.remove('active');
    });
    
    var activeLink = document.querySelector('[href="#' + sectionId + '"]');
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Close mobile menu
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');

    // Scroll to top
    window.scrollTo(0, 0);
}

function scrollToSection(sectionId) {
    navigateToSection(sectionId);
}

// Theme Functions
function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var themeToggle = document.getElementById('theme-toggle');
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('growMoreTheme', theme);
}

// Course Management
function loadCourses() {
    courses = [
        {
            id: 1,
            title: 'JavaScript Fundamentals by letsUpgrade',
            description: 'Learn the core concepts of JavaScript programming',
            category: 'frontend',
            level: 'Beginner',
            duration: '6 weeks',
            progress: userProgress[1] || 0,
            instructor: 'John Doe',
            rating: 4.8,
            students: 12543,
            videoUrl: 'https://www.youtube.com/embed/0dZvKQmotf4?si=DpKZ51-QE0F-pnJL',
            imageUrl: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: 2,
            title: 'React Development by letsUpgrade',
            description: 'Build modern web applications with React',
            category: 'frontend',
            level: 'Intermediate',
            duration: '8 weeks',
            progress: userProgress[2] || 0,
            instructor: 'Jane Smith',
            rating: 4.9,
            students: 8965,
            videoUrl: 'https://www.youtube.com/embed/h-yW0biVj00?si=NoZypuBWRdemi2Fp',
            imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: 3,
            title: 'Node.js Backend by letsUpgrade',
            description: 'Server-side development with Node.js',
            category: 'backend',
            level: 'Intermediate',
            duration: '10 weeks',
            progress: userProgress[3] || 0,
            instructor: 'Mike Johnson',
            rating: 4.7,
            students: 7234,
            videoUrl: 'https://www.youtube.com/embed/hiKr99ScTkI?si=w_Q3sQXcAUkHh7uC',
            imageUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: 4,
            title: 'Python for Data Science by letsUpgrade',
            description: 'Data analysis and machine learning with Python',
            category: 'data',
            level: 'Advanced',
            duration: '12 weeks',
            progress: userProgress[4] || 0,
            instructor: 'Sarah Wilson',
            rating: 4.8,
            students: 9876,
            videoUrl: 'https://www.youtube.com/embed/cCNwVbY-e0o?si=Be1cNFHnTqHvKclX',
            imageUrl: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: 5,
            title: 'React Native Mobile by letsUpgrade',
            description: 'Cross-platform mobile app development',
            category: 'mobile',
            level: 'Intermediate',
            duration: '9 weeks',
            progress: userProgress[5] || 0,
            instructor: 'Tom Brown',
            rating: 4.6,
            students: 5432,
            videoUrl: 'https://www.youtube.com/embed/4RrlTfjh-vw?si=SWO1NkGGifFlZiC8',
            imageUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: 6,
            title: 'Vue.js Framework by letsUpgrade',
            description: 'Progressive web apps with Vue.js',
            category: 'frontend',
            level: 'Intermediate',
            duration: '7 weeks',
            progress: userProgress[6] || 0,
            instructor: 'Lisa Davis',
            rating: 4.7,
            students: 6543,
            videoUrl: 'https://www.youtube.com/embed/FXpIoQ_rT_c?si=mnop3456',
            imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
    ];

    renderCourses();
}

function renderCourses() {
    var coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';

    courses.forEach(function(course) {
        var courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    var card = document.createElement('div');
    card.className = 'course-card';
    
    // Create course image div with background image
    var courseImageDiv = document.createElement('div');
    courseImageDiv.className = 'course-image';
    courseImageDiv.style.backgroundImage = 'url(' + course.imageUrl + ')';
    courseImageDiv.style.backgroundSize = 'cover';
    courseImageDiv.style.backgroundPosition = 'center';
    courseImageDiv.style.backgroundRepeat = 'no-repeat';
    
    // Create course content
    var courseContent = document.createElement('div');
    courseContent.className = 'course-content';
    
    var courseTitle = document.createElement('h3');
    courseTitle.className = 'course-title';
    courseTitle.textContent = course.title;
    
    var courseDesc = document.createElement('p');
    courseDesc.className = 'course-description';
    courseDesc.textContent = course.description;
    
    var courseMeta = document.createElement('div');
    courseMeta.className = 'course-meta';
    
    var courseLevel = document.createElement('span');
    courseLevel.className = 'course-level';
    courseLevel.textContent = course.level;
    
    var courseDuration = document.createElement('span');
    courseDuration.className = 'course-duration';
    courseDuration.textContent = course.duration;
    
    courseMeta.appendChild(courseLevel);
    courseMeta.appendChild(courseDuration);
    
    var courseProgress = document.createElement('div');
    courseProgress.className = 'course-progress';
    
    var courseProgressFill = document.createElement('div');
    courseProgressFill.className = 'course-progress-fill';
    courseProgressFill.style.width = course.progress + '%';
    courseProgress.appendChild(courseProgressFill);
    
    var courseActions = document.createElement('div');
    courseActions.className = 'course-actions';
    
    var enrollBtn = document.createElement('button');
    enrollBtn.className = 'btn btn-primary btn-small';
    enrollBtn.textContent = course.progress > 0 ? 'Continue' : 'Enroll';
    enrollBtn.onclick = function() { enrollInCourse(course.id); };
    
    var watchBtn = document.createElement('button');
    watchBtn.className = 'btn btn-secondary btn-small';
    watchBtn.textContent = 'Watch';
    watchBtn.onclick = function() { watchCourseVideo(course.id); };
    
    courseActions.appendChild(enrollBtn);
    courseActions.appendChild(watchBtn);
    
    courseContent.appendChild(courseTitle);
    courseContent.appendChild(courseDesc);
    courseContent.appendChild(courseMeta);
    courseContent.appendChild(courseProgress);
    courseContent.appendChild(courseActions);
    
    card.appendChild(courseImageDiv);
    card.appendChild(courseContent);
    
    return card;
}

function filterCourses() {
    var searchTerm = document.getElementById('course-search').value.toLowerCase();
    var categoryFilter = document.getElementById('course-filter').value;

    var filteredCourses = courses.filter(function(course) {
        var matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                          course.description.toLowerCase().includes(searchTerm);
        var matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    renderFilteredCourses(filteredCourses);
}

function renderFilteredCourses(filteredCourses) {
    var coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';

    filteredCourses.forEach(function(course) {
        var courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

function enrollInCourse(courseId) {
    if (!currentUser) {
        openLoginModal();
        return;
    }

    var course = courses.find(function(c) { return c.id === courseId; });
    if (course) {
        // Simulate enrollment with progress increment
        userProgress[courseId] = Math.min((userProgress[courseId] || 0) + 25, 100);
        saveProgress();
        
        // Update course display
        renderCourses();
        updateDashboard();
        
        // Show success message
        showNotification('Successfully enrolled in ' + course.title + '!', 'success');
    }
}

function watchCourseVideo(courseId) {
    var course = courses.find(function(c) { return c.id === courseId; });
    if (course) {
        openVideoModal(course);
    }
}

// Video Player Functions
function openVideoModal(course) {
    var modal = document.getElementById('video-modal');
    var title = document.getElementById('modal-title');
    var iframe = document.getElementById('course-video');
    
    title.textContent = course.title;
    iframe.src = course.videoUrl;
    modal.classList.add('active');
}

function closeVideoModal() {
    var modal = document.getElementById('video-modal');
    var iframe = document.getElementById('course-video');
    
    iframe.src = '';
    modal.classList.remove('active');
}

// Authentication Functions
function openLoginModal() {
    var modal = document.getElementById('login-modal');
    modal.classList.add('active');
}

function closeLoginModal() {
    var modal = document.getElementById('login-modal');
    modal.classList.remove('active');
}

function handleLogin(e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Simple authentication simulation
    if (username && password) {
        currentUser = {
            id: 1,
            username: username,
            email: username + '@example.com',
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('growMoreUser', JSON.stringify(currentUser));
        updateLoginStatus();
        closeLoginModal();
        showNotification('Login successful!', 'success');
        
        // Clear form
        document.getElementById('login-form').reset();
    } else {
        showNotification('Please enter both username and password', 'error');
    }
}

function updateLoginStatus() {
    var loginBtn = document.getElementById('login-btn');
    if (currentUser) {
        loginBtn.textContent = 'Hi, ' + currentUser.username;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = openLoginModal;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('growMoreUser');
    updateLoginStatus();
    updateDashboard();
    showNotification('Logged out successfully', 'info');
}

// Dashboard Functions
function updateDashboard() {
    var enrolledCount = Object.keys(userProgress).length;
    var completedCount = Object.values(userProgress).filter(function(p) { return p === 100; }).length;
    var averageScore = calculateAverageQuizScore();
    var streakCount = calculateStreak();

    document.getElementById('enrolled-count').textContent = enrolledCount;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('quiz-score').textContent = averageScore + '%';
    document.getElementById('streak-count').textContent = streakCount;

    updateProgressList();
}

function updateProgressList() {
    var progressList = document.getElementById('progress-list');
    progressList.innerHTML = '';

    Object.entries(userProgress).forEach(function(entry) {
        var courseId = entry[0];
        var progress = entry[1];
        var course = courses.find(function(c) { return c.id === parseInt(courseId); });
        
        if (course) {
            var progressItem = document.createElement('div');
            progressItem.className = 'progress-item';
            
            var progressTitle = document.createElement('h4');
            progressTitle.textContent = course.title;
            
            var progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-bar-container';
            
            var progressBarFill = document.createElement('div');
            progressBarFill.className = 'progress-bar-fill';
            
            var progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = progress + '%';
            
            var progressPercentage = document.createElement('span');
            progressPercentage.className = 'progress-percentage';
            progressPercentage.textContent = progress + '%';
            
            progressBarFill.appendChild(progressFill);
            progressBarContainer.appendChild(progressBarFill);
            progressBarContainer.appendChild(progressPercentage);
            
            progressItem.appendChild(progressTitle);
            progressItem.appendChild(progressBarContainer);
            
            progressList.appendChild(progressItem);
        }
    });
}

function calculateAverageQuizScore() {
    var savedQuizScores = localStorage.getItem('growMoreQuizScores');
    if (savedQuizScores) {
        var scores = JSON.parse(savedQuizScores);
        return scores.length > 0 ? Math.round(scores.reduce(function(a, b) { return a + b; }, 0) / scores.length) : 0;
    }
    return 0;
}

function calculateStreak() {
    var savedStreak = localStorage.getItem('growMoreStreak');
    return savedStreak ? parseInt(savedStreak) : 0;
}

// Quiz Functions
function loadQuizQuestions() {
    quizQuestions = [
        {
            question: "What does HTML stand for?",
            options: [
                "HyperText Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language",
                "Hyperlink and Text Markup Language"
            ],
            correct: 0
        },
        {
            question: "Which CSS property is used to change the text color?",
            options: ["color", "text-color", "font-color", "text-style"],
            correct: 0
        },
        {
            question: "What does CSS stand for?",
            options: [
                "Computer Style Sheets",
                "Cascading Style Sheets",
                "Creative Style Sheets",
                "Colorful Style Sheets"
            ],
            correct: 1
        },
        {
            question: "Which HTML tag is used to create a hyperlink?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            correct: 1
        },
        {
            question: "What is the correct way to declare a JavaScript variable?",
            options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
            correct: 0
        },
        {
            question: "Which method is used to add an element to the end of an array in JavaScript?",
            options: ["append()", "push()", "add()", "insert()"],
            correct: 1
        },
        {
            question: "What does API stand for?",
            options: [
                "Application Programming Interface",
                "Advanced Programming Interface",
                "Application Process Interface",
                "Advanced Process Interface"
            ],
            correct: 0
        },
        {
            question: "Which of the following is a JavaScript framework?",
            options: ["Django", "Laravel", "React", "Flask"],
            correct: 2
        },
        {
            question: "What is the purpose of the <head> tag in HTML?",
            options: [
                "To display content",
                "To contain metadata",
                "To create headings",
                "To define the body"
            ],
            correct: 1
        },
        {
            question: "Which CSS property is used to make text bold?",
            options: ["font-weight", "text-bold", "font-style", "text-weight"],
            correct: 0
        }
    ];
}

function startQuiz() {
    if (!currentUser) {
        openLoginModal();
        return;
    }

    isQuizActive = true;
    currentQuizIndex = 0;
    quizScore = 0;
    displayQuestion();
}

function displayQuestion() {
    var quizContent = document.getElementById('quiz-content');
    var question = quizQuestions[currentQuizIndex];
    
    var quizQuestionDiv = document.createElement('div');
    quizQuestionDiv.className = 'quiz-question';
    
    var quizProgress = document.createElement('div');
    quizProgress.className = 'quiz-progress';
    
    var quizProgressBar = document.createElement('div');
    quizProgressBar.className = 'quiz-progress-bar';
    
    var quizProgressFill = document.createElement('div');
    quizProgressFill.className = 'quiz-progress-fill';
    quizProgressFill.style.width = (currentQuizIndex / quizQuestions.length) * 100 + '%';
    
    var progressText = document.createElement('p');
    progressText.textContent = 'Question ' + (currentQuizIndex + 1) + ' of ' + quizQuestions.length;
    
    quizProgressBar.appendChild(quizProgressFill);
    quizProgress.appendChild(quizProgressBar);
    quizProgress.appendChild(progressText);
    
    var questionTitle = document.createElement('h3');
    questionTitle.textContent = question.question;
    
    var quizOptions = document.createElement('div');
    quizOptions.className = 'quiz-options';
    
    question.options.forEach(function(option, index) {
        var optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = function() { selectOption(index); };
        quizOptions.appendChild(optionDiv);
    });
    
    var quizActions = document.createElement('div');
    quizActions.className = 'quiz-actions';
    
    var endBtn = document.createElement('button');
    endBtn.className = 'btn btn-secondary';
    endBtn.textContent = 'End Quiz';
    endBtn.onclick = endQuiz;
    
    var nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.id = 'next-question';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = true;
    nextBtn.onclick = nextQuestion;
    
    quizActions.appendChild(endBtn);
    quizActions.appendChild(nextBtn);
    
    quizQuestionDiv.appendChild(quizProgress);
    quizQuestionDiv.appendChild(questionTitle);
    quizQuestionDiv.appendChild(quizOptions);
    quizQuestionDiv.appendChild(quizActions);
    
    quizContent.innerHTML = '';
    quizContent.appendChild(quizQuestionDiv);
}

function selectOption(optionIndex) {
    var options = document.querySelectorAll('.quiz-option');
    options.forEach(function(option) {
        option.classList.remove('selected');
    });
    options[optionIndex].classList.add('selected');
    
    // Store selected answer
    var nextBtn = document.getElementById('next-question');
    nextBtn.disabled = false;
    nextBtn.setAttribute('data-selected', optionIndex);
}

function nextQuestion() {
    var nextBtn = document.getElementById('next-question');
    var selectedAnswer = parseInt(nextBtn.getAttribute('data-selected'));
    var correctAnswer = quizQuestions[currentQuizIndex].correct;
    
    if (selectedAnswer === correctAnswer) {
        quizScore++;
    }
    
    currentQuizIndex++;
    
    if (currentQuizIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    isQuizActive = false;
    var percentage = Math.round((quizScore / quizQuestions.length) * 100);
    
    // Save quiz score
    var savedScores = localStorage.getItem('growMoreQuizScores');
    var scores = savedScores ? JSON.parse(savedScores) : [];
    scores.push(percentage);
    localStorage.setItem('growMoreQuizScores', JSON.stringify(scores));
    
    // Update streak
    var currentStreak = calculateStreak();
    var newStreak = percentage >= 70 ? currentStreak + 1 : 0;
    localStorage.setItem('growMoreStreak', newStreak.toString());
    
    // Display results
    var quizContent = document.getElementById('quiz-content');
    
    var quizScoreDiv = document.createElement('div');
    quizScoreDiv.className = 'quiz-score';
    
    var scoreTitle = document.createElement('h3');
    scoreTitle.textContent = 'Quiz Complete!';
    
    var scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = percentage + '%';
    
    var scoreText = document.createElement('p');
    scoreText.textContent = 'You scored ' + quizScore + ' out of ' + quizQuestions.length + ' questions correctly.';
    
    var scoreMessage = document.createElement('p');
    scoreMessage.textContent = getScoreMessage(percentage);
    
    var retakeBtn = document.createElement('button');
    retakeBtn.className = 'btn btn-primary';
    retakeBtn.textContent = 'Take Quiz Again';
    retakeBtn.onclick = startQuiz;
    
    quizScoreDiv.appendChild(scoreTitle);
    quizScoreDiv.appendChild(scoreDisplay);
    quizScoreDiv.appendChild(scoreText);
    quizScoreDiv.appendChild(scoreMessage);
    quizScoreDiv.appendChild(retakeBtn);
    
    quizContent.innerHTML = '';
    quizContent.appendChild(quizScoreDiv);
    
    updateDashboard();
    showNotification('Quiz completed! You scored ' + percentage + '%', 'success');
}

function getScoreMessage(percentage) {
    if (percentage >= 90) return "Excellent! You're a tech expert!";
    if (percentage >= 70) return "Great job! You have solid knowledge.";
    if (percentage >= 50) return "Good effort! Keep learning.";
    return "Keep studying and try again!";
}

// Utility Functions
function saveProgress() {
    localStorage.setItem('growMoreProgress', JSON.stringify(userProgress));
}

function closeModals() {
    var modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        modal.classList.remove('active');
    });
}

function showNotification(message, type) {
    if (type === undefined) type = 'info';
    
    // Create notification element
    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    
    // Style the notification
    var bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = bgColor;
    notification.style.color = 'white';
    notification.style.padding = '16px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(function() {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function updateProgressBar() {
    var progressBar = document.getElementById('progress-bar');
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = progress + '%';
}

// Performance optimizations
function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function() {
            clearTimeout(timeout);
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced search function
var debouncedSearch = debounce(filterCourses, 300);

// Add animation styles
var style = document.createElement('style');
style.textContent = 
    '@keyframes slideIn {' +
    'from { transform: translateX(100%); opacity: 0; }' +
    'to { transform: translateX(0); opacity: 1; }' +
    '}' +
    
    '@keyframes slideOut {' +
    'from { transform: translateX(0); opacity: 1; }' +
    'to { transform: translateX(100%); opacity: 0; }' +
    '}';
document.head.appendChild(style);

// Initialize intersection observer for animations
var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, observerOptions);

// Observe course cards when they're created
function observeCourseCards() {
    var courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(function(card) {
        observer.observe(card);
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'h':
                e.preventDefault();
                navigateToSection('home');
                break;
            case 'c':
                e.preventDefault();
                navigateToSection('courses');
                break;
            case 'd':
                e.preventDefault();
                navigateToSection('dashboard');
                break;
            case '/':
                e.preventDefault();
                document.getElementById('course-search').focus();
                break;
        }
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Initialize performance monitoring
var performanceMetrics = {
    pageLoadTime: 0,
    interactionTime: 0
};

window.addEventListener('load', function() {
    performanceMetrics.pageLoadTime = performance.now();
});

// Add error handling for better user experience
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An error occurred. Please try again.', 'error');
});
