// Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Add input event listeners to all answer inputs
            document.querySelectorAll('.answer-input').forEach(input => {
                input.addEventListener('input', function() {
                    // Remove any previous correct/incorrect styling
                    this.classList.remove('correct', 'incorrect');
                });
            });
        });

        // Check answers function
        function checkAnswers() {
            let correctCount = 0;
            const totalQuestions = document.querySelectorAll('.question').length;
            
            document.querySelectorAll('.question').forEach(question => {
                const correctAnswer = question.getAttribute('data-correct').toLowerCase();
                const input = question.querySelector('.answer-input');
                const userAnswer = input.value.trim().toLowerCase();
                
                // Reset previous correct/incorrect classes
                input.classList.remove('correct', 'incorrect');
                
                if (userAnswer === correctAnswer) {
                    input.classList.add('correct');
                    correctCount++;
                } else {
                    input.classList.add('incorrect');
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
                feedback.textContent = "Excellent! You got all answers correct! Perfect grammar skills!";
            } else if (correctCount >= totalQuestions * 0.8) {
                feedback.textContent = "Great job! You have a good understanding of grammar rules.";
            } else if (correctCount >= totalQuestions * 0.6) {
                feedback.textContent = "Good effort! Review the incorrect answers to improve your grammar.";
            } else {
                feedback.textContent = "You may need more practice with grammar. Review the rules and try again.";
            }
            
            // Scroll to results
            results.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset answers function
        function resetAnswers() {
            document.querySelectorAll('.answer-input').forEach(input => {
                input.value = '';
                input.classList.remove('correct', 'incorrect');
            });
            
            // Hide results
            document.getElementById('results').classList.remove('show');
        }

        // Go back function
        function goBack() {
            window.location.href = "../Grammar Activities - Grade 11.html";
        }