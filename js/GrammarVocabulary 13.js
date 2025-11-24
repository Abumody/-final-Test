// Correct answers for each blank
        const correctAnswers = {
            blank1: "the",
            blank2: "designed",
            blank3: "take",
            blank4: "and",
            blank5: "has",
            blank6: "watch",
            blank7: "to",
            blank8: "used",
            blank9: "are",
            blank10: "destination"
        };
        
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
            const totalBlanks = Object.keys(correctAnswers).length;
            
            // Check each blank
            Object.keys(correctAnswers).forEach(blankId => {
                const select = document.getElementById(blankId);
                const userAnswer = select.value;
                const correctAnswer = correctAnswers[blankId];
                
                // Reset previous styling
                select.classList.remove('correct', 'incorrect');
                
                if (userAnswer === correctAnswer) {
                    select.classList.add('correct');
                    correctCount++;
                } else if (userAnswer !== "") {
                    select.classList.add('incorrect');
                }
            });
            
            // Calculate percentage
            const percentage = Math.round((correctCount / totalBlanks) * 100);
            
            // Show results
            const results = document.getElementById('results');
            const scoreValue = document.getElementById('score-value');
            const feedback = document.getElementById('feedback');
            
            scoreValue.textContent = correctCount;
            updateProgressCircle(percentage);
            results.classList.add('show');
            
            // Provide feedback based on score
            if (correctCount === totalBlanks) {
                feedback.textContent = "🎉 Excellent! Perfect score! You've mastered this exercise!";
                feedback.style.background = "#e8f5e9";
                feedback.style.color = "#2e7d32";
            } else if (correctCount >= totalBlanks * 0.7) {
                feedback.textContent = "👍 Good job! You did well on this exercise.";
                feedback.style.background = "#e3f2fd";
                feedback.style.color = "#1565c0";
            } else if (correctCount >= totalBlanks * 0.5) {
                feedback.textContent = "💡 Not bad, but you might want to review the grammar and vocabulary.";
                feedback.style.background = "#fff3e0";
                feedback.style.color = "#ef6c00";
            } else {
                feedback.textContent = "📚 You may need more practice with these grammar and vocabulary concepts.";
                feedback.style.background = "#ffebee";
                feedback.style.color = "#c62828";
            }
            
            // Scroll to results
            results.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset answers function
        function resetAnswers() {
            // Reset all dropdowns
            Object.keys(correctAnswers).forEach(blankId => {
                const select = document.getElementById(blankId);
                select.value = '';
                select.classList.remove('correct', 'incorrect');
            });
            
            // Hide results
            document.getElementById('results').classList.remove('show');
            updateProgressCircle(0);
        }
        
        // Go back to main page function
        function goBack() {
            window.location.href = "../Grammar & Vocabulary Activities - Grade 11.html";
        }
        
        // Initialize progress circle
        updateProgressCircle(0);