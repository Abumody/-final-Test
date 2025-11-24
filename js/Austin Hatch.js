// Get audio elements
        const audio = document.getElementById('audioPlayer');
        const playBtn = document.getElementById('playBtn');
        const progressBar = document.getElementById('progressBar');
        const progressContainer = document.getElementById('progressContainer');
        const timeDisplay = document.getElementById('timeDisplay');
        const volumeSlider = document.getElementById('volumeSlider');
        
        // Format time as minutes:seconds
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        // Update time display
        function updateTimeDisplay() {
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
        
        // Update progress bar
        function updateProgress() {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            updateTimeDisplay();
        }
        
        // Set progress bar when clicked
        function setProgress(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            
            audio.currentTime = (clickX / width) * duration;
        }
        
        // Toggle play/pause
        function togglePlay() {
            if (audio.paused) {
                audio.play();
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
        progressContainer.addEventListener('click', setProgress);
        volumeSlider.addEventListener('input', setVolume);
        
        // Initialize time display when audio metadata is loaded
        audio.addEventListener('loadedmetadata', function() {
            updateTimeDisplay();
        });
        
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
        
        // Check answers function
        function checkAnswers() {
            let correctCount = 0;
            const totalQuestions = document.querySelectorAll('.question').length;
            
            document.querySelectorAll('.question').forEach(question => {
                const correctAnswer = question.getAttribute('data-correct').toLowerCase();
                
                // Check if it's a multiple choice question
                const selectedOption = question.querySelector('.option.selected');
                
                if (selectedOption) {
                    // Multiple choice question
                    const selectedAnswer = selectedOption.querySelector('.option-text').textContent.toLowerCase();
                    
                    // Reset previous correct/incorrect classes
                    question.querySelectorAll('.option').forEach(opt => {
                        opt.classList.remove('correct', 'incorrect');
                    });
                    
                    if (selectedAnswer === correctAnswer) {
                        selectedOption.classList.add('correct');
                        correctCount++;
                    } else {
                        selectedOption.classList.add('incorrect');
                        
                        // Highlight the correct answer
                        question.querySelectorAll('.option').forEach(opt => {
                            if (opt.querySelector('.option-text').textContent.toLowerCase() === correctAnswer) {
                                opt.classList.add('correct');
                            }
                        });
                    }
                } else {
                    // Short answer question
                    const input = question.querySelector('.short-answer-input');
                    const userAnswer = input.value.trim().toLowerCase();
                    
                    // Reset previous correct/incorrect classes
                    input.classList.remove('correct', 'incorrect');
                    
                       // For questions with multiple correct answers (e.g., "15 minutes / fifteen minutes")
                    const correctAnswers = correctAnswer.split('/').map(a => a.trim());
                    
                    if (correctAnswers.some(answer => userAnswer.includes(answer))) {
                        input.classList.add('correct');
                        correctCount++;
                    } else {
                        input.classList.add('incorrect');
                    }
                }
            });
            // Show results
            const results = document.getElementById('results');
            const scoreValue = document.getElementById('score-value');
            const feedback = document.getElementById('feedback');
            
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
        
        // Reset answers function
        function resetAnswers() {
            // Reset multiple choice questions
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Reset short answer questions
            document.querySelectorAll('.short-answer-input').forEach(input => {
                input.value = '';
                input.classList.remove('correct', 'incorrect');
            });
            
            // Hide results
            document.getElementById('results').classList.remove('show');
        }
        
        // Go back to main page function
        function goBack() {
            window.location.href = "../Listening Activities 2 - Grade 11.html";
        }