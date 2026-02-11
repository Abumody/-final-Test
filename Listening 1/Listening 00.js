// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAudioPlayer();
    initializeBubbleHandlers();
    initializeButtonHandlers();
});

// Audio Player Functions
function initializeAudioPlayer() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const timeDisplay = document.getElementById('timeDisplay');
    const volumeSlider = document.getElementById('volumeSlider');

    if (!audio || !playBtn) return;

    // Format time as minutes:seconds
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update time display
    function updateTimeDisplay() {
        if (audio.duration && !isNaN(audio.duration)) {
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        } else {
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / 0:00`;
        }
    }

    // Update progress bar
    function updateProgress() {
        if (audio.duration && !isNaN(audio.duration)) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        updateTimeDisplay();
    }

    // Set progress bar when clicked
    function setProgress(e) {
        if (!audio.duration || isNaN(audio.duration)) return;
        
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    }

    // Toggle play/pause
    function togglePlay() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error("Audio play failed:", error);
                alert("Unable to play audio. Please check if the audio file exists.");
            });
            playBtn.textContent = '⏸';
            playBtn.classList.add('playing');
        } else {
            audio.pause();
            playBtn.textContent = '▶';
            playBtn.classList.remove('playing');
        }
    }

    // Update volume
    function setVolume() {
        audio.volume = volumeSlider.value;
    }

    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', function() {
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
    });
    audio.addEventListener('loadedmetadata', updateTimeDisplay);
    audio.addEventListener('error', function() {
        console.error("Audio loading error");
        timeDisplay.textContent = "Audio Error";
        alert("Error loading audio file. Please check the file path.");
    });
    
    if (progressContainer) {
        progressContainer.addEventListener('click', setProgress);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', setVolume);
    }

    // Initial setup
    updateTimeDisplay();
}

// Bubble Selection Functions
function initializeBubbleHandlers() {
    // Add click event to all bubbles
    document.querySelectorAll('.bubble').forEach(bubble => {
        bubble.addEventListener('click', function() {
            const row = this.closest('.question-row');
            const questionId = row.getAttribute('data-qid');
            
            // Remove selected class from all bubbles in this row
            row.querySelectorAll('.bubble').forEach(b => {
                b.classList.remove('selected');
            });
            
            // Add selected class to clicked bubble
            this.classList.add('selected');
            
            // Remove any previous correct/incorrect markings
            this.classList.remove('correct', 'incorrect');
            
            // Log selection for debugging
            console.log(`Question ${questionId}: Selected option ${this.getAttribute('data-option')}`);
        });
    });
}

// Button Handlers
function initializeButtonHandlers() {
    // Check answers button
    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkAnswers);
    }
    
    // Reset answers button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAnswers);
    }
    
    // Try again button
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', resetAnswers);
    }
    
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
}

// Check answers function
function checkAnswers() {
    let correctCount = 0;
    const totalQuestions = document.querySelectorAll('.question-row').length;
    
    document.querySelectorAll('.question-row').forEach(row => {
        const correctAnswer = row.getAttribute('data-correct');
        const selectedBubble = row.querySelector('.bubble.selected');
        
        // Remove previous correct/incorrect classes
        row.querySelectorAll('.bubble').forEach(bubble => {
            bubble.classList.remove('correct', 'incorrect');
        });
        
        if (selectedBubble) {
            const selectedOption = selectedBubble.getAttribute('data-option');
            
            if (selectedOption === correctAnswer) {
                selectedBubble.classList.add('correct');
                correctCount++;
            } else {
                selectedBubble.classList.add('incorrect');
                
                // Highlight the correct answer
                const correctBubble = row.querySelector(`.bubble[data-option="${correctAnswer}"]`);
                if (correctBubble) {
                    correctBubble.classList.add('correct');
                }
            }
        } else {
            // If no answer selected, show correct answer
            const correctBubble = row.querySelector(`.bubble[data-option="${correctAnswer}"]`);
            if (correctBubble) {
                correctBubble.classList.add('correct');
            }
        }
    });
    
    // Show results
    const results = document.getElementById('results');
    const scoreValue = document.getElementById('score-value');
    const feedback = document.getElementById('feedback');
    
    if (results && scoreValue && feedback) {
        scoreValue.textContent = correctCount;
        results.classList.add('show');
        
        // Provide feedback based on score
        if (correctCount === totalQuestions) {
            feedback.textContent = "🎉 Excellent! Perfect score! All answers are correct.";
            feedback.style.color = "#2ecc71";
        } else if (correctCount >= totalQuestions * 0.8) {
            feedback.textContent = "👍 Very good! You matched most pictures correctly.";
            feedback.style.color = "#3498db";
        } else if (correctCount >= totalQuestions * 0.6) {
            feedback.textContent = "Good effort! Review the audio and try again.";
            feedback.style.color = "#f39c12";
        } else {
            feedback.textContent = "Keep practicing! Listen carefully to the audio descriptions.";
            feedback.style.color = "#e74c3c";
        }
        
        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth' });
    }
}

// Reset answers function
function resetAnswers() {
    // Clear all bubble selections
    document.querySelectorAll('.bubble').forEach(bubble => {
        bubble.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Hide results
    const results = document.getElementById('results');
    if (results) {
        results.classList.remove('show');
    }
    
    // Pause audio if playing
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    if (audio && !audio.paused) {
        audio.pause();
        if (playBtn) {
            playBtn.textContent = '▶';
            playBtn.classList.remove('playing');
        }
    }
}

// Go back function
function goBack() {
    // Change this URL to your actual listening activities page
    window.location.href = "../Listening Activities 1 - Grade 7.html";
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to play/pause audio
    if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const playBtn = document.getElementById('playBtn');
        if (playBtn) playBtn.click();
    }
    
    // Ctrl + Enter to check answers
    if (e.ctrlKey && e.code === 'Enter') {
        e.preventDefault();
        const checkBtn = document.getElementById('checkBtn');
        if (checkBtn) checkBtn.click();
    }
    
    // Ctrl + R to reset answers
    if (e.ctrlKey && e.code === 'KeyR') {
        e.preventDefault();
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.click();
    }
});