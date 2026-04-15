// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    initializeButtons();
    updateProgress();
    highlightEmptyDropdowns();
});

// Initialize dropdown menus
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.word-dropdown');
    
    dropdowns.forEach(dropdown => {
        // Add change event listener
        dropdown.addEventListener('change', function() {
            handleDropdownChange(this);
        });
        
        // Add focus/blur effects
        dropdown.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            highlightQuestionNumber(this, true);
        });
        
        dropdown.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            highlightQuestionNumber(this, false);
        });
        
        // Add click event for better mobile support
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Initialize empty state
        updateDropdownState(dropdown);
    });
}

// Update dropdown visual state
function updateDropdownState(dropdown) {
    // Remove all state classes first
    dropdown.classList.remove('empty', 'selected', 'correct', 'incorrect');
    
    if (dropdown.value) {
        // Has a selection
        dropdown.classList.add('selected');
    } else {
        // Empty selection
        dropdown.classList.add('empty');
    }
}

// Highlight question number
function highlightQuestionNumber(dropdown, isHighlighted) {
    const wrapper = dropdown.parentElement;
    const questionNumSpan = wrapper.querySelector('.question-number');
    
    if (questionNumSpan) {
        if (isHighlighted) {
            questionNumSpan.style.backgroundColor = '#2196f3';
            questionNumSpan.style.transform = 'translateX(-50%) scale(1.2)';
            questionNumSpan.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.4)';
        } else {
            // Reset to default state based on dropdown value
            if (dropdown.value) {
                questionNumSpan.style.backgroundColor = '#2196f3';
                questionNumSpan.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.3)';
            } else {
                questionNumSpan.style.backgroundColor = '#4caf50';
                questionNumSpan.style.boxShadow = 'none';
            }
            questionNumSpan.style.transform = 'translateX(-50%) scale(1)';
        }
    }
}

// Handle dropdown selection change
function handleDropdownChange(dropdown) {
    updateDropdownState(dropdown);
    highlightQuestionNumber(dropdown, false);
    
    const questionNumber = dropdown.id.replace('dropdown', '');
    console.log(`Question ${questionNumber}: Selected "${dropdown.value}"`);
    
    // Update progress
    updateProgress();
    
    // Remove highlight from empty dropdowns
    highlightEmptyDropdowns();
    
    // Auto-save progress
    autoSaveProgress();
}

// Highlight empty dropdowns periodically
function highlightEmptyDropdowns() {
    const emptyDropdowns = document.querySelectorAll('.word-dropdown.empty');
    
    emptyDropdowns.forEach((dropdown, index) => {
        setTimeout(() => {
            dropdown.parentElement.classList.add('pulse');
            
            setTimeout(() => {
                dropdown.parentElement.classList.remove('pulse');
            }, 1000);
        }, index * 200);
    });
}

// Update progress indicators
function updateProgress() {
    const dropdowns = document.querySelectorAll('.word-dropdown');
    let answeredCount = 0;
    
    dropdowns.forEach(dropdown => {
        if (dropdown.value) {
            answeredCount++;
        }
    });
    
    // Update counter
    const answeredCountElement = document.getElementById('answeredCount');
    if (answeredCountElement) {
        answeredCountElement.textContent = answeredCount;
    }
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressText');
    const answeredText = document.getElementById('answeredText');
    
    if (progressFill && progressText && answeredText) {
        const percentage = Math.round((answeredCount / 10) * 100);
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
        answeredText.textContent = `${answeredCount}/10 answered`;
        
        // Animate progress bar
        progressFill.style.transition = 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
}

// Initialize buttons
function initializeButtons() {
    // Check Answers button
    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkAnswers);
        // Add keyboard shortcut hint
        checkBtn.title = "Ctrl + Enter";
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllAnswers);
        resetBtn.title = "Ctrl + R";
    }
    
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
        backBtn.title = "Ctrl + B";
    }
    
    // Try Again button (in modal)
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            resetAllAnswers();
            closeModal(); // Fixed: Using closeModal instead of closeResults
        });
    }
    
    // Review button (in modal)
    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', reviewAnswers);
    }
    
    // Continue button (in modal)
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', closeModal); // Fixed: Using closeModal
    }
    
    // Close modal button
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal); // Fixed: Using closeModal
    }
    
    // Add click outside modal to close
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(); // Fixed: Using closeModal
            }
        });
    }
}

// Check all answers
function checkAnswers() {
    // Add loading animation to check button
    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) {
        const originalText = checkBtn.innerHTML;
        checkBtn.innerHTML = '<span class="btn-icon">⏳</span> Checking...';
        checkBtn.disabled = true;
        
        setTimeout(() => {
            performCheck();
            checkBtn.innerHTML = originalText;
            checkBtn.disabled = false;
        }, 500);
    } else {
        performCheck();
    }
}

// Perform the actual check
function performCheck() {
    let correctCount = 0;
    const results = [];
    const dropdowns = document.querySelectorAll('.word-dropdown');
    
    // First, clear all result styling
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('correct', 'incorrect');
        dropdown.classList.add('selected'); // Keep selected class if has value
    });
    
    // Check each dropdown
    dropdowns.forEach(dropdown => {
        const questionNumber = dropdown.id.replace('dropdown', '');
        const correctAnswer = dropdown.getAttribute('data-correct');
        const userAnswer = dropdown.value;
        
        if (userAnswer) {
            if (userAnswer === correctAnswer) {
                // Correct answer
                dropdown.classList.add('correct');
                correctCount++;
                results.push({
                    question: questionNumber,
                    status: 'correct',
                    userAnswer: userAnswer,
                    correctAnswer: correctAnswer
                });
            } else {
                // Incorrect answer
                dropdown.classList.add('incorrect');
                results.push({
                    question: questionNumber,
                    status: 'incorrect',
                    userAnswer: userAnswer,
                    correctAnswer: correctAnswer
                });
            }
        } else {
            // Not answered
            dropdown.classList.remove('selected');
            dropdown.classList.add('empty');
            results.push({
                question: questionNumber,
                status: 'unanswered',
                userAnswer: null,
                correctAnswer: correctAnswer
            });
        }
    });
    
    // Show results modal
    showResults(correctCount, results);
}

// Show results modal
function showResults(correctCount, results) {
    const modal = document.getElementById('resultsModal');
    const scoreValue = document.getElementById('scoreValue');
    const percentageValue = document.getElementById('percentageValue');
    const feedback = document.getElementById('feedback');
    const answersGrid = document.getElementById('answersGrid');
    
    if (!modal || !scoreValue || !percentageValue || !feedback || !answersGrid) {
        console.error('Required modal elements not found');
        return;
    }
    
    // Update scores
    scoreValue.textContent = correctCount;
    const percentage = Math.round((correctCount / 10) * 100);
    percentageValue.textContent = `${percentage}%`;
    
    // Update score circle color based on percentage
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        if (percentage >= 90) {
            scoreCircle.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
        } else if (percentage >= 70) {
            scoreCircle.style.background = 'linear-gradient(135deg, #8bc34a, #689f38)';
        } else if (percentage >= 50) {
            scoreCircle.style.background = 'linear-gradient(135deg, #ffc107, #ff9800)';
        } else {
            scoreCircle.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
        }
    }
    
    // Update feedback
    let feedbackHTML = '';
    if (correctCount === 10) {
        feedbackHTML = `
            <h3>🎉 Perfect Score!</h3>
            <p>Excellent work! You answered all 10 questions correctly. Your understanding of grammar and vocabulary is outstanding!</p>
            <div style="margin-top: 15px; padding: 12px; background: rgba(76, 175, 80, 0.15); border-radius: 10px; border-left: 4px solid #4caf50;">
                <strong style="color: #2e7d32;">🌟 Outstanding Achievement!</strong> 
                <p style="margin: 8px 0 0 0; color: #555;">You've mastered this exercise completely.</p>
            </div>
        `;
    } else if (percentage >= 80) {
        feedbackHTML = `
            <h3>🌟 Excellent Work!</h3>
            <p>Great job! You got ${correctCount} out of 10 correct (${percentage}%). You're doing very well with grammar and vocabulary!</p>
            <div style="margin-top: 15px; padding: 12px; background: rgba(76, 175, 80, 0.1); border-radius: 10px; border-left: 4px solid #4caf50;">
                <strong style="color: #2e7d32;">Tip:</strong> 
                <p style="margin: 8px 0 0 0; color: #555;">Review the questions you missed for even better results next time.</p>
            </div>
        `;
    } else if (percentage >= 60) {
        feedbackHTML = `
            <h3>👍 Good Effort!</h3>
            <p>You got ${correctCount} out of 10 correct (${percentage}%). You're on the right track! With a bit more practice, you'll improve even more.</p>
            <div style="margin-top: 15px; padding: 12px; background: rgba(255, 152, 0, 0.1); border-radius: 10px; border-left: 4px solid #ff9800;">
                <strong style="color: #ff9800;">Tip:</strong> 
                <p style="margin: 8px 0 0 0; color: #555;">Pay close attention to context clues in the sentences.</p>
            </div>
        `;
    } else {
        feedbackHTML = `
            <h3>📚 Keep Practicing!</h3>
            <p>You got ${correctCount} out of 10 correct (${percentage}%). Don't get discouraged! Every mistake is a learning opportunity.</p>
            <div style="margin-top: 15px; padding: 12px; background: rgba(244, 67, 54, 0.1); border-radius: 10px; border-left: 4px solid #f44336;">
                <strong style="color: #f44336;">Tip:</strong> 
                <p style="margin: 8px 0 0 0; color: #555;">Read each sentence carefully and think about what makes the most sense.</p>
            </div>
        `;
    }
    
    feedback.innerHTML = feedbackHTML;
    
    // Update answers grid
    let answersHTML = '';
    results.forEach(result => {
        const statusClass = result.status;
        const statusText = result.status === 'correct' ? 'Correct' : 
                          result.status === 'incorrect' ? 'Incorrect' : 'Not Answered';
        const statusIcon = result.status === 'correct' ? '✅' : 
                          result.status === 'incorrect' ? '❌' : '⭕';
        
        answersHTML += `
            <div class="answer-card ${statusClass}" data-question="${result.question}">
                <div class="answer-header">
                    <div class="answer-number">${result.question}</div>
                    <div class="answer-status ${statusClass}">${statusIcon} ${statusText}</div>
                </div>
                <div class="answer-details">
                    <div><strong>Correct Answer:</strong> <span style="color: #4caf50; font-weight: bold;">${result.correctAnswer}</span></div>
                    ${result.userAnswer ? 
                        `<div><strong>Your Answer:</strong> <span style="color: ${result.status === 'correct' ? '#4caf50' : '#f44336'}; font-weight: bold;">${result.userAnswer}</span></div>` : 
                        `<div><strong>Your Answer:</strong> <em style="color: #ff9800;">Not selected</em></div>`
                    }
                </div>
            </div>
        `;
    });
    
    answersGrid.innerHTML = answersHTML;
    
    // Add click event to answer cards for navigation
    document.querySelectorAll('.answer-card').forEach(card => {
        card.addEventListener('click', function() {
            const questionNum = this.getAttribute('data-question');
            navigateToQuestion(questionNum);
        });
    });
    
    // Show modal with animation
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Add animation to modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.animation = 'modalSlideUp 0.5s ease';
    }
}

// Navigate to specific question
function navigateToQuestion(questionNum) {
    closeModal();
    
    setTimeout(() => {
        const dropdown = document.getElementById(`dropdown${questionNum}`);
        if (dropdown) {
            dropdown.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Highlight the dropdown
            dropdown.focus();
            dropdown.parentElement.classList.add('focused');
            
            // Pulse animation
            dropdown.parentElement.classList.add('pulse');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                dropdown.parentElement.classList.remove('focused', 'pulse');
            }, 3000);
        }
    }, 300);
}

// Reset all answers
function resetAllAnswers() {
    const dropdowns = document.querySelectorAll('.word-dropdown');
    const questionNumbers = document.querySelectorAll('.question-number');
    
    // Reset all dropdowns
    dropdowns.forEach(dropdown => {
        dropdown.value = '';
        updateDropdownState(dropdown);
    });
    
    // Reset question number highlights
    questionNumbers.forEach(number => {
        number.style.backgroundColor = '#4caf50';
        number.style.transform = 'translateX(-50%) scale(1)';
        number.style.boxShadow = 'none';
    });
    
    // Clear any results modal if open
    closeModal();
    
    // Update progress
    updateProgress();
    
    // Highlight empty dropdowns
    highlightEmptyDropdowns();
    
    // Clear localStorage
    localStorage.removeItem('grammarTestProgress');
    
    // Show confirmation
    showToast('All answers have been reset!', 'success');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close modal function (FIXED - replaced closeResults)
function closeModal() {
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Review answers (scroll to first incorrect/unanswered)
function reviewAnswers() {
    closeModal();
    
    setTimeout(() => {
        // Find first incorrect or unanswered dropdown
        const dropdowns = document.querySelectorAll('.word-dropdown');
        let targetDropdown = null;
        
        for (let dropdown of dropdowns) {
            if (dropdown.classList.contains('incorrect') || !dropdown.value) {
                targetDropdown = dropdown;
                break;
            }
        }
        
        if (targetDropdown) {
            navigateToQuestion(targetDropdown.id.replace('dropdown', ''));
        } else {
            // If all are correct, scroll to first one
            const firstDropdown = document.getElementById('dropdown1');
            if (firstDropdown) {
                navigateToQuestion('1');
            }
        }
    }, 300);
}

// Go back to activities
function goBack() {
    // Show confirmation before leaving
    if (hasUnsavedProgress()) {
        if (confirm('You have unsaved progress. Are you sure you want to leave?')) {
            window.location.href = "../Grammar & Vocabulary Activities - Grade 7.html";
        }
    } else {
        window.location.href = "../Grammar & Vocabulary Activities - Grade 7.html";
    }
}

// Check if there's unsaved progress
function hasUnsavedProgress() {
    const dropdowns = document.querySelectorAll('.word-dropdown');
    for (let dropdown of dropdowns) {
        if (dropdown.value) {
            return true;
        }
    }
    return false;
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Auto-save functionality
let saveTimeout;
function autoSaveProgress() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const selections = {};
        const dropdowns = document.querySelectorAll('.word-dropdown');
        
        dropdowns.forEach(dropdown => {
            const questionNumber = dropdown.id.replace('dropdown', '');
            selections[questionNumber] = dropdown.value;
        });
        
        localStorage.setItem('grammarTestProgress', JSON.stringify(selections));
        console.log('Progress auto-saved');
    }, 1000);
}

// Load saved progress
function loadSavedProgress() {
    try {
        const saved = localStorage.getItem('grammarTestProgress');
        if (saved) {
            const selections = JSON.parse(saved);
            let loadedCount = 0;
            
            Object.keys(selections).forEach(questionNumber => {
                const dropdown = document.getElementById(`dropdown${questionNumber}`);
                if (dropdown && selections[questionNumber]) {
                    dropdown.value = selections[questionNumber];
                    updateDropdownState(dropdown);
                    loadedCount++;
                }
            });
            
            if (loadedCount > 0) {
                updateProgress();
                console.log(`Loaded ${loadedCount} saved answers`);
                showToast(`Loaded ${loadedCount} saved answers`, 'success');
            }
        }
    } catch (e) {
        console.error('Error loading progress:', e);
        localStorage.removeItem('grammarTestProgress'); // Clear corrupted data
    }
}

// Initialize auto-save
document.querySelectorAll('.word-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', autoSaveProgress);
});

// Load saved progress on page load
window.addEventListener('load', function() {
    // Small delay to ensure DOM is fully ready
    setTimeout(loadSavedProgress, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter to check answers
    if (e.ctrlKey && e.code === 'Enter') {
        e.preventDefault();
        const checkBtn = document.getElementById('checkBtn');
        if (checkBtn) {
            checkBtn.click();
            showToast('Checking answers...', 'info');
        }
    }
    
    // Ctrl + R to reset answers
    if (e.ctrlKey && e.code === 'KeyR') {
        e.preventDefault();
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn && confirm('Are you sure you want to reset all answers?')) {
            resetBtn.click();
        }
    }
    
    // Ctrl + B to go back
    if (e.ctrlKey && e.code === 'KeyB') {
        e.preventDefault();
        const backBtn = document.getElementById('backBtn');
        if (backBtn) backBtn.click();
    }
    
    // Escape to close modal
    if (e.code === 'Escape') {
        const modal = document.getElementById('resultsModal');
        if (modal && modal.classList.contains('show')) {
            closeModal();
            showToast('Results closed', 'info');
        }
    }
    
    // Number keys 1-0 to focus on corresponding dropdowns
    if (e.key >= '1' && e.key <= '0' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        let questionNum = e.key === '0' ? 10 : parseInt(e.key);
        navigateToQuestion(questionNum.toString());
    }
});

// Add CSS for toast notifications
const toastCSS = `
.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 9999;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    border-left: 4px solid #4caf50;
    max-width: 300px;
}

.toast-notification.show {
    transform: translateX(0);
    opacity: 1;
}

.toast-success {
    border-left-color: #4caf50;
}

.toast-info {
    border-left-color: #2196f3;
}

.toast-icon {
    font-size: 1.2rem;
}

.toast-message {
    color: #333;
    font-weight: 500;
}

.pulse {
    animation: pulseAnimation 1s ease;
}

@keyframes pulseAnimation {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;

// Add the CSS to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = toastCSS;
document.head.appendChild(styleSheet);