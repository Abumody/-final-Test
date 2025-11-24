// Correct answers
        const correctAnswers = {
            q1: "Duke University, USA",
            q2: "Smartphones",
            q3: "11 to 15 years",
            q4: "Two to three hours",
            q5: "Child Development",
            q6: "151",
            q7: "a month",
            q8: "depressed"
        };

        // Back button functionality
        document.querySelector('.btn-back').addEventListener('click', function() {
            alert('Going back to previous page');
            // In a real implementation, this would navigate to the previous page
            // window.history.back() or specific navigation logic
        });
        
        // Reset button functionality
        document.querySelector('.btn-reset').addEventListener('click', function() {
            // Clear all text inputs
            document.querySelectorAll('.answer-input').forEach(input => {
                input.value = '';
                input.style.borderColor = '#ddd';
            });
            
            // Clear all radio buttons
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            
            // Reset question backgrounds
            document.querySelectorAll('.question').forEach(question => {
                question.style.backgroundColor = '';
            });
            
            // Hide feedback
            document.getElementById('feedback').style.display = 'none';
            
            alert('All answers have been reset.');
        });
        
        // Check answers button functionality
        document.querySelector('.btn-check').addEventListener('click', function() {
            const feedback = document.getElementById('feedback');
            let allCorrect = true;
            let score = 0;
            const totalQuestions = 8;
            
            // Check short answer questions
            const shortAnswers = document.querySelectorAll('.answer-input');
            shortAnswers.forEach((input, index) => {
                const questionNum = index + 1;
                const userAnswer = input.value.trim().toLowerCase();
                const correctAnswer = correctAnswers[`q${questionNum}`].toLowerCase();
                
                if (userAnswer === correctAnswer) {
                    input.style.borderColor = '#28a745';
                    score++;
                } else {
                    input.style.borderColor = '#dc3545';
                    allCorrect = false;
                }
            });
            
            // Check multiple choice questions
            const radioGroups = ['q5', 'q6', 'q7', 'q8'];
            radioGroups.forEach(group => {
                const radios = document.querySelectorAll(`input[name="${group}"]`);
                const questionElement = radios[0].closest('.question');
                let answered = false;
                let correct = false;
                
                radios.forEach(radio => {
                    if (radio.checked) {
                        answered = true;
                        if (radio.nextElementSibling.textContent.toLowerCase() === correctAnswers[group].toLowerCase()) {
                            correct = true;
                            score++;
                        }
                    }
                });
                
                if (answered) {
                    if (correct) {
                        questionElement.style.backgroundColor = '#d4edda';
                    } else {
                        questionElement.style.backgroundColor = '#f8d7da';
                        allCorrect = false;
                    }
                } else {
                    questionElement.style.backgroundColor = '#fff3cd';
                    allCorrect = false;
                }
            });
            
            // Display feedback
            if (allCorrect) {
                feedback.textContent = `Excellent! You got all ${totalQuestions} questions correct!`;
                feedback.className = 'feedback correct';
            } else {
                feedback.textContent = `You got ${score} out of ${totalQuestions} questions correct. Keep trying!`;
                feedback.className = 'feedback incorrect';
            }
            feedback.style.display = 'block';
            
            // Scroll to feedback
            feedback.scrollIntoView({ behavior: 'smooth' });
        });