// Add click event to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options in this reading item
                const readingItem = this.closest('.reading-item');
                readingItem.querySelectorAll('.option').forEach(opt => {
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
            const totalItems = document.querySelectorAll('.reading-item').length;
            
            document.querySelectorAll('.reading-item').forEach(item => {
                const correctAnswer = item.getAttribute('data-correct');
                const selectedOption = item.querySelector('.option.selected');
                
                // Reset previous correct/incorrect classes
                item.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });
                
                if (selectedOption) {
                    const isTrueSelected = selectedOption.classList.contains('true');
                    const userAnswer = isTrueSelected ? 'true' : 'false';
                    
                    if (userAnswer === correctAnswer) {
                        selectedOption.classList.add('correct');
                        correctCount++;
                    } else {
                        selectedOption.classList.add('incorrect');
                        
                        // Highlight the correct answer
                        item.querySelectorAll('.option').forEach(opt => {
                            if ((opt.classList.contains('true') && correctAnswer === 'true') ||
                                (opt.classList.contains('false') && correctAnswer === 'false')) {
                                opt.classList.add('correct');
                            }
                        });
                    }
                } else {
                    // If no answer selected, show correct answer
                    item.querySelectorAll('.option').forEach(opt => {
                        if ((opt.classList.contains('true') && correctAnswer === 'true') ||
                            (opt.classList.contains('false') && correctAnswer === 'false')) {
                            opt.classList.add('correct');
                        }
                    });
                }
            });
            
            // Calculate percentage
            const percentage = Math.round((correctCount / totalItems) * 100);
            
            // Show results
            const results = document.getElementById('results');
            const scoreValue = document.getElementById('score-value');
            const feedback = document.getElementById('feedback');
            
            scoreValue.textContent = correctCount;
            updateProgressCircle(percentage);
            results.classList.add('show');
            
            // Provide feedback based on score
            if (correctCount === totalItems) {
                feedback.textContent = "🎉 Excellent! Perfect score! You've mastered this reading exercise!";
                feedback.style.background = "#e8f5e9";
                feedback.style.color = "#2e7d32";
            } else if (correctCount >= totalItems * 0.7) {
                feedback.textContent = "👍 Good job! You did well on this reading exercise.";
                feedback.style.background = "#e3f2fd";
                feedback.style.color = "#1565c0";
            } else if (correctCount >= totalItems * 0.5) {
                feedback.textContent = "💡 Not bad, but you might want to practice reading comprehension more.";
                feedback.style.background = "#fff3e0";
                feedback.style.color = "#ef6c00";
            } else {
                feedback.textContent = "📚 You may need more practice with reading comprehension. Try reading more carefully.";
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
            alert("In a real application, this would navigate back to the main page.");
            // In a real implementation, this would be: window.location.href = "main-page.html";
        }
        
        // Initialize progress circle
        updateProgressCircle(0);