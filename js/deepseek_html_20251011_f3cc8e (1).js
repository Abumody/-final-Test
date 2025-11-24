// Show hint function
        function showHint(questionNumber) {
            const hint = document.getElementById(`hint${questionNumber}`);
            hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
        }
        
        // Auto-focus next input
        document.querySelectorAll('.blank-input input').forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.length === this.maxLength) {
                    const inputs = this.parentElement.querySelectorAll('input');
                    const currentIndex = Array.from(inputs).indexOf(this);
                    if (currentIndex < inputs.length - 1) {
                        inputs[currentIndex + 1].focus();
                    }
                }
            });
        });
        
        // Check answers function
        function checkAnswers() {
            let correctCount = 0;
            const totalQuestions = document.querySelectorAll('.question').length;
            
            document.querySelectorAll('.question').forEach(question => {
                const correctAnswer = question.getAttribute('data-correct');
                const inputs = question.querySelectorAll('.blank-input input');
                
                // Build user's answer
                let userAnswer = '';
                inputs.forEach(input => {
                    userAnswer += input.value.toLowerCase();
                });
                
                // Reset previous correct/incorrect classes
                inputs.forEach(input => {
                    input.classList.remove('correct', 'incorrect');
                });
                
                if (userAnswer === correctAnswer) {
                    // All correct
                    inputs.forEach(input => {
                        input.classList.add('correct');
                    });
                    correctCount++;
                } else {
                    // Incorrect
                    inputs.forEach(input => {
                        input.classList.add('incorrect');
                    });
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
                feedback.textContent = "Not bad, but you might want to review the grammar rules.";
            } else {
                feedback.textContent = "You may need more practice with these grammar concepts.";
            }
            
            // Scroll to results
            results.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset answers function
        function resetAnswers() {
            document.querySelectorAll('.blank-input input').forEach(input => {
                input.value = '';
                input.classList.remove('correct', 'incorrect');
            });
            
            // Hide all hints
            document.querySelectorAll('.hint').forEach(hint => {
                hint.style.display = 'none';
            });
            
            // Hide results
            document.getElementById('results').classList.remove('show');
        }
        
        // Go back to main page function
        function goBack() {
           window.location.href = "../Main Page - Grade 11.html";
        }