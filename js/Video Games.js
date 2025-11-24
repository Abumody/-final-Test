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
        
        // Update progress circle
        function updateProgressCircle(percentage) {
            const circle = document.getElementById('progressCircle');
            const text = document.getElementById('progressText');
            const radius = 50;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
            text.textContent = `${percentage}%`;
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
            
            // Calculate percentage
            const percentage = Math.round((correctCount / totalQuestions) * 100);
            
            // Show results
            const results = document.getElementById('results');
            const scoreValue = document.getElementById('score-value');
            const feedback = document.getElementById('feedback');
            
            scoreValue.textContent = correctCount;
            updateProgressCircle(percentage);
            results.classList.add('show');
            
            // Provide feedback based on score
            if (correctCount === totalQuestions) {
                feedback.textContent = "🎉 Excellent! Perfect score! You've mastered this reading exercise!";
                feedback.style.background = "#e8f5e9";
                feedback.style.color = "#2e7d32";
            } else if (correctCount >= totalQuestions * 0.7) {
                feedback.textContent = "👍 Good job! You did well on this reading exercise.";
                feedback.style.background = "#e3f2fd";
                feedback.style.color = "#1565c0";
            } else if (correctCount >= totalQuestions * 0.5) {
                feedback.textContent = "💡 Not bad, but you might want to read the text more carefully.";
                feedback.style.background = "#fff3e0";
                feedback.style.color = "#ef6c00";
            } else {
                feedback.textContent = "📚 You may need more practice with reading comprehension. Try reading the text again.";
                feedback.style.background = "#ffebee";
                feedback.style.color = "#c62828";
            }
            
            // Scroll to results
            results.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset answers function
        function resetAnswers() {
            // Reset all options
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Hide results
            document.getElementById('results').classList.remove('show');
            updateProgressCircle(0);
        }
        
        // Go back to main page function
        function goBack() {
            window.location.href = "../Reading 2- Grade 11.html";
        }
        
        // Initialize progress circle
        updateProgressCircle(0);