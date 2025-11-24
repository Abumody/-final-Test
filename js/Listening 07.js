// Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeAudioPlayer();
            initializeQuestionHandlers();
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

        // Question Handling Functions
        function initializeQuestionHandlers() {
            // Add click event to options
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', function() {
                    // Remove selected class from all options in this question
                    const question = this.closest('.question');
                    question.querySelectorAll('.option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked option
                    this.classList.add('selected');
                });
            });
        }

        // Check answers function
        function checkAnswers() {
            let correctCount = 0;
            const totalQuestions = document.querySelectorAll('.question').length;
            
            document.querySelectorAll('.question').forEach(question => {
                const correctAnswer = question.getAttribute('data-correct');
                const selectedOption = question.querySelector('.option.selected');
                
                // Reset previous correct/incorrect classes
                question.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });
                
                if (selectedOption) {
                    const selectedAnswer = selectedOption.querySelector('.option-text').textContent;
                    
                    if (selectedAnswer === correctAnswer) {
                        selectedOption.classList.add('correct');
                        correctCount++;
                    } else {
                        selectedOption.classList.add('incorrect');
                        
                        // Highlight the correct answer
                        question.querySelectorAll('.option').forEach(opt => {
                            if (opt.querySelector('.option-text').textContent === correctAnswer) {
                                opt.classList.add('correct');
                            }
                        });
                    }
                } else {
                    // If no answer selected, show correct answer
                    question.querySelectorAll('.option').forEach(opt => {
                        if (opt.querySelector('.option-text').textContent === correctAnswer) {
                            opt.classList.add('correct');
                        }
                    });
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
                    feedback.textContent = "Excellent! You got all answers correct!";
                } else if (correctCount >= totalQuestions * 0.7) {
                    feedback.textContent = "Good job! You did well on this exercise.";
                } else if (correctCount >= totalQuestions * 0.5) {
                    feedback.textContent = "Not bad, but you might want to review the material.";
                } else {
                    feedback.textContent = "You may need more practice with this topic.";
                }
                
                // Scroll to results
                results.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Reset answers function
        function resetAnswers() {
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Hide results
            const results = document.getElementById('results');
            if (results) {
                results.classList.remove('show');
            }
        }

        // Go back function - FIXED FOR NESTED FOLDER STRUCTURE
        function goBack() {
            // Based on your folder structure:
            // Grade 11 English test 1st semester/
            //   ├── Listening 7/
            //   │   └── Listening 07 - Grade 11.html (THIS FILE)
            //   └── Listening Activities - Grade 11.html (TARGET FILE)
            
            // Go up one level from "Listening 7" folder to main folder
            window.location.href = "../Listening Activities 1 - Grade 11.html";
        }