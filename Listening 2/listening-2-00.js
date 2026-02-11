// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAudioPlayers();
    initializeQuestionHandlers();
    initializeButtonHandlers();
    updateAudioPlayers();
});

// Audio Players Management
let audioPlayers = {};

function initializeAudioPlayers() {
    // Initialize Test 01 audio player
    const audio01 = document.getElementById('audioPlayer01');
    const playBtn01 = document.getElementById('playBtn01');
    const progressBar01 = document.getElementById('progressBar01');
    const timeDisplay01 = document.getElementById('timeDisplay01');
    const volumeSlider01 = document.getElementById('volumeSlider01');
    
    if (audio01 && playBtn01) {
        audioPlayers.test01 = {
            audio: audio01,
            playBtn: playBtn01,
            progressBar: progressBar01,
            timeDisplay: timeDisplay01,
            volumeSlider: volumeSlider01,
            isPlaying: false
        };
        
        setupAudioPlayer(audioPlayers.test01, 'test01');
    }
    
    // Initialize Test 02 audio player
    const audio02 = document.getElementById('audioPlayer02');
    const playBtn02 = document.getElementById('playBtn02');
    const progressBar02 = document.getElementById('progressBar02');
    const timeDisplay02 = document.getElementById('timeDisplay02');
    const volumeSlider02 = document.getElementById('volumeSlider02');
    
    if (audio02 && playBtn02) {
        audioPlayers.test02 = {
            audio: audio02,
            playBtn: playBtn02,
            progressBar: progressBar02,
            timeDisplay: timeDisplay02,
            volumeSlider: volumeSlider02,
            isPlaying: false
        };
        
        setupAudioPlayer(audioPlayers.test02, 'test02');
    }
}

function setupAudioPlayer(player, testId) {
    const { audio, playBtn, progressBar, timeDisplay, volumeSlider } = player;
    
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
            if (progressBar) {
                progressBar.style.width = `${progressPercent}%`;
            }
        }
        updateTimeDisplay();
    }
    
    // Set progress bar when clicked
    function setProgress(e) {
        if (!audio.duration || isNaN(audio.duration)) return;
        
        const progressContainer = e.currentTarget;
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    }
    
    // Toggle play/pause
    function togglePlay() {
        // Pause other audio if playing
        Object.keys(audioPlayers).forEach(key => {
            if (key !== testId && audioPlayers[key].isPlaying) {
                const otherPlayer = audioPlayers[key];
                otherPlayer.audio.pause();
                otherPlayer.playBtn.textContent = '▶';
                otherPlayer.playBtn.classList.remove('playing');
                otherPlayer.isPlaying = false;
            }
        });
        
        if (audio.paused) {
            audio.play().catch(error => {
                console.error(`Audio play failed for ${testId}:`, error);
                alert(`Unable to play audio for ${testId}. Please check if the audio file exists.`);
            });
            playBtn.textContent = '⏸';
            playBtn.classList.add('playing');
            player.isPlaying = true;
        } else {
            audio.pause();
            playBtn.textContent = '▶';
            playBtn.classList.remove('playing');
            player.isPlaying = false;
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
        player.isPlaying = false;
    });
    audio.addEventListener('loadedmetadata', updateTimeDisplay);
    audio.addEventListener('error', function() {
        console.error(`Audio loading error for ${testId}`);
        timeDisplay.textContent = "Audio Error";
        playBtn.disabled = true;
        playBtn.style.opacity = "0.5";
        playBtn.style.cursor = "not-allowed";
    });
    
    // Progress container click event
    const progressContainer = playBtn.parentElement.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.addEventListener('click', setProgress);
    }
    
    // Volume slider event
    if (volumeSlider) {
        volumeSlider.addEventListener('input', setVolume);
    }
    
    // Initial setup
    updateTimeDisplay();
}

function updateAudioPlayers() {
    // Update all audio players periodically
    setInterval(() => {
        Object.keys(audioPlayers).forEach(testId => {
            const player = audioPlayers[testId];
            if (player.audio && player.timeDisplay) {
                // Format time as minutes:seconds
                function formatTime(seconds) {
                    if (isNaN(seconds)) return "0:00";
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                }
                
                if (player.audio.duration && !isNaN(player.audio.duration)) {
                    player.timeDisplay.textContent = 
                        `${formatTime(player.audio.currentTime)} / ${formatTime(player.audio.duration)}`;
                }
            }
        });
    }, 1000);
}

// Question Handling Functions
function initializeQuestionHandlers() {
    // Add click event to all options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const question = this.closest('.question');
            
            // Remove selected class from all options in this question
            question.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Remove any previous correct/incorrect markings
            this.classList.remove('correct', 'incorrect');
            
            const questionId = question.getAttribute('data-qid');
            const selectedAnswer = this.getAttribute('data-answer');
            console.log(`Question ${questionId}: Selected answer "${selectedAnswer}"`);
        });
    });
}

// Button Handlers
function initializeButtonHandlers() {
    // Check Test 01 button
    const checkTest01Btn = document.getElementById('checkTest01Btn');
    if (checkTest01Btn) {
        checkTest01Btn.addEventListener('click', () => checkTest('test01'));
    }
    
    // Check Test 02 button
    const checkTest02Btn = document.getElementById('checkTest02Btn');
    if (checkTest02Btn) {
        checkTest02Btn.addEventListener('click', () => checkTest('test02'));
    }
    
    // Check All Tests button
    const checkAllBtn = document.getElementById('checkAllBtn');
    if (checkAllBtn) {
        checkAllBtn.addEventListener('click', checkAllTests);
    }
    
    // Reset All Answers button
    const resetAllBtn = document.getElementById('resetAllBtn');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', resetAllAnswers);
    }
    
    // Try Again button
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', resetAllAnswers);
    }
    
    // Show Details button
    const showDetailsBtn = document.getElementById('showDetailsBtn');
    if (showDetailsBtn) {
        showDetailsBtn.addEventListener('click', toggleDetails);
    }
    
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
}

// Check specific test
function checkTest(testName) {
    let correctCount = 0;
    let totalQuestions = 0;
    const testSelector = testName === 'test01' ? '.test-01-questions' : '.test-02-questions';
    const questions = document.querySelectorAll(`${testSelector} .question`);
    
    questions.forEach(question => {
        totalQuestions++;
        const correctAnswer = question.getAttribute('data-correct');
        const selectedOption = question.querySelector('.option.selected');
        
        // Remove previous correct/incorrect classes
        question.querySelectorAll('.option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
        
        if (selectedOption) {
            const selectedAnswer = selectedOption.getAttribute('data-answer');
            
            if (selectedAnswer === correctAnswer) {
                selectedOption.classList.add('correct');
                correctCount++;
            } else {
                selectedOption.classList.add('incorrect');
                
                // Highlight the correct answer
                question.querySelectorAll('.option').forEach(option => {
                    if (option.getAttribute('data-answer') === correctAnswer) {
                        option.classList.add('correct');
                    }
                });
            }
        } else {
            // If no answer selected, show correct answer
            question.querySelectorAll('.option').forEach(option => {
                if (option.getAttribute('data-answer') === correctAnswer) {
                    option.classList.add('correct');
                }
            });
        }
    });
    
    // Update score display for this test
    const scoreElement = document.getElementById(`score-value-${testName === 'test01' ? '01' : '02'}`);
    if (scoreElement) {
        scoreElement.textContent = correctCount;
    }
    
    // Show results panel
    showResults();
    
    // Provide feedback
    const feedback = document.getElementById('feedback');
    if (feedback) {
        const testTitle = testName === 'test01' ? 'Test 01 (Ibn Battuta)' : 'Test 02 (Whales)';
        if (correctCount === totalQuestions) {
            feedback.innerHTML = `<span style="color: #27ae60; font-weight: bold;">🎉 Perfect! </span>You got all ${totalQuestions} answers correct in ${testTitle}!`;
        } else if (correctCount >= totalQuestions * 0.7) {
            feedback.innerHTML = `<span style="color: #3498db; font-weight: bold;">👍 Good job! </span>You got ${correctCount} out of ${totalQuestions} correct in ${testTitle}.`;
        } else if (correctCount >= totalQuestions * 0.5) {
            feedback.innerHTML = `<span style="color: #f39c12; font-weight: bold;">📚 Keep practicing! </span>You got ${correctCount} out of ${totalQuestions} correct in ${testTitle}.`;
        } else {
            feedback.innerHTML = `<span style="color: #e74c3c; font-weight: bold;">💪 Need more practice! </span>You got ${correctCount} out of ${totalQuestions} correct in ${testTitle}. Listen carefully and try again!`;
        }
    }
    
    return { correct: correctCount, total: totalQuestions };
}

// Check all tests
function checkAllTests() {
    const test01Result = checkTest('test01');
    const test02Result = checkTest('test02');
    
    // Update total score
    const totalScore = test01Result.correct + test02Result.correct;
    const totalQuestions = test01Result.total + test02Result.total;
    
    const totalScoreElement = document.getElementById('score-value-total');
    if (totalScoreElement) {
        totalScoreElement.textContent = totalScore;
    }
    
    // Update feedback for all tests
    const feedback = document.getElementById('feedback');
    if (feedback) {
        const percentage = (totalScore / totalQuestions) * 100;
        
        if (percentage === 100) {
            feedback.innerHTML = `<span style="color: #27ae60; font-weight: bold;">🏆 Excellent! </span>Perfect score! You got all ${totalQuestions} answers correct in both tests!`;
        } else if (percentage >= 80) {
            feedback.innerHTML = `<span style="color: #3498db; font-weight: bold;">🌟 Very good! </span>You got ${totalScore} out of ${totalQuestions} correct (${percentage.toFixed(0)}%).`;
        } else if (percentage >= 60) {
            feedback.innerHTML = `<span style="color: #f39c12; font-weight: bold;">📖 Good effort! </span>You got ${totalScore} out of ${totalQuestions} correct (${percentage.toFixed(0)}%). Keep practicing!`;
        } else {
            feedback.innerHTML = `<span style="color: #e74c3c; font-weight: bold;">🎯 Practice more! </span>You got ${totalScore} out of ${totalQuestions} correct (${percentage.toFixed(0)}%). Listen carefully to the audio and try again!`;
        }
    }
    
    showResults();
}

// Show results panel
function showResults() {
    const results = document.getElementById('results');
    if (results) {
        results.classList.add('show');
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Reset all answers
function resetAllAnswers() {
    // Clear all selections
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Reset audio players
    Object.keys(audioPlayers).forEach(testId => {
        const player = audioPlayers[testId];
        if (player.audio && !player.audio.paused) {
            player.audio.pause();
            player.audio.currentTime = 0;
        }
        if (player.playBtn) {
            player.playBtn.textContent = '▶';
            player.playBtn.classList.remove('playing');
            player.isPlaying = false;
        }
        if (player.progressBar) {
            player.progressBar.style.width = '0%';
        }
        if (player.timeDisplay) {
            player.timeDisplay.textContent = '0:00 / 0:00';
        }
    });
    
    // Hide results
    const results = document.getElementById('results');
    if (results) {
        results.classList.remove('show');
    }
    
    // Hide details panel
    const detailsPanel = document.getElementById('detailsPanel');
    if (detailsPanel) {
        detailsPanel.classList.remove('show');
        detailsPanel.innerHTML = '';
    }
    
    // Reset scores
    document.getElementById('score-value-01').textContent = '0';
    document.getElementById('score-value-02').textContent = '0';
    document.getElementById('score-value-total').textContent = '0';
}

// Toggle details panel
function toggleDetails() {
    const detailsPanel = document.getElementById('detailsPanel');
    const showDetailsBtn = document.getElementById('showDetailsBtn');
    
    if (detailsPanel.classList.contains('show')) {
        detailsPanel.classList.remove('show');
        showDetailsBtn.textContent = 'Show Details';
    } else {
        detailsPanel.classList.add('show');
        showDetailsBtn.textContent = 'Hide Details';
        populateDetails();
    }
}

// Populate details panel
function populateDetails() {
    const detailsPanel = document.getElementById('detailsPanel');
    if (!detailsPanel) return;
    
    let html = '<h3>Question Details</h3>';
    
    // Test 01 details
    html += '<h4 style="color: #3498db; margin-top: 15px;">Test 01: Ibn Battuta</h4>';
    document.querySelectorAll('.test-01-questions .question').forEach((question, index) => {
        const questionNum = index + 1;
        const correctAnswer = question.getAttribute('data-correct');
        const selectedOption = question.querySelector('.option.selected');
        const isCorrect = selectedOption && selectedOption.getAttribute('data-answer') === correctAnswer;
        
        html += `<div class="detail-item ${isCorrect ? 'correct' : 'incorrect'}">
            <strong>Question ${questionNum}:</strong> ${question.querySelector('.question-text').textContent}<br>
            <span style="color: #27ae60;">✓ Correct answer: ${correctAnswer}</span><br>`;
        
        if (selectedOption) {
            html += `<span style="color: ${isCorrect ? '#27ae60' : '#e74c3c'};">${isCorrect ? '✓' : '✗'} Your answer: ${selectedOption.getAttribute('data-answer')}</span>`;
        } else {
            html += `<span style="color: #f39c12;">ⓘ No answer selected</span>`;
        }
        
        html += '</div>';
    });
    
    // Test 02 details
    html += '<h4 style="color: #2ecc71; margin-top: 15px;">Test 02: Whales</h4>';
    document.querySelectorAll('.test-02-questions .question').forEach((question, index) => {
        const questionNum = index + 1;
        const correctAnswer = question.getAttribute('data-correct');
        const selectedOption = question.querySelector('.option.selected');
        const isCorrect = selectedOption && selectedOption.getAttribute('data-answer') === correctAnswer;
        
        html += `<div class="detail-item ${isCorrect ? 'correct' : 'incorrect'}">
            <strong>Question ${questionNum}:</strong> ${question.querySelector('.question-text').textContent}<br>
            <span style="color: #27ae60;">✓ Correct answer: ${correctAnswer}</span><br>`;
        
        if (selectedOption) {
            html += `<span style="color: ${isCorrect ? '#27ae60' : '#e74c3c'};">${isCorrect ? '✓' : '✗'} Your answer: ${selectedOption.getAttribute('data-answer')}</span>`;
        } else {
            html += `<span style="color: #f39c12;">ⓘ No answer selected</span>`;
        }
        
        html += '</div>';
    });
    
    detailsPanel.innerHTML = html;
}

// Go back function
function goBack() {
    window.location.href = "../Listening Activities 2 - Grade 7.html";
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to play/pause current audio
    if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        
        // Find which audio is currently playing or was last interacted with
        let activeTest = null;
        Object.keys(audioPlayers).forEach(testId => {
            if (audioPlayers[testId].isPlaying) {
                activeTest = testId;
            }
        });
        
        // If no audio is playing, default to Test 01
        if (!activeTest) {
            activeTest = 'test01';
        }
        
        const playBtn = audioPlayers[activeTest]?.playBtn;
        if (playBtn) playBtn.click();
    }
    
    // Ctrl + 1 to check Test 01
    if (e.ctrlKey && e.code === 'Digit1') {
        e.preventDefault();
        const checkTest01Btn = document.getElementById('checkTest01Btn');
        if (checkTest01Btn) checkTest01Btn.click();
    }
    
    // Ctrl + 2 to check Test 02
    if (e.ctrlKey && e.code === 'Digit2') {
        e.preventDefault();
        const checkTest02Btn = document.getElementById('checkTest02Btn');
        if (checkTest02Btn) checkTest02Btn.click();
    }
    
    // Ctrl + Enter to check all tests
    if (e.ctrlKey && e.code === 'Enter') {
        e.preventDefault();
        const checkAllBtn = document.getElementById('checkAllBtn');
        if (checkAllBtn) checkAllBtn.click();
    }
    
    // Ctrl + R to reset all answers
    if (e.ctrlKey && e.code === 'KeyR') {
        e.preventDefault();
        const resetAllBtn = document.getElementById('resetAllBtn');
        if (resetAllBtn) resetAllBtn.click();
    }
    
    // Ctrl + D to show/hide details
    if (e.ctrlKey && e.code === 'KeyD') {
        e.preventDefault();
        const showDetailsBtn = document.getElementById('showDetailsBtn');
        if (showDetailsBtn) showDetailsBtn.click();
    }
});