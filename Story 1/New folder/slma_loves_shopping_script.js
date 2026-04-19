// ========================================
// CARD DATA (From Teacher Export)
// ========================================
const cardData = {
    "1": {
        "sentence": "",
        "modelAnswer": "",
        "hint": "",
        "image": "images/card1.jpg",
        "imageAlt": "Card 1",
        "details": ""
    },
    "2": {
        "sentence": "",
        "modelAnswer": "",
        "hint": "",
        "image": "images/card2.jpg",
        "imageAlt": "Card 2",
        "details": ""
    },
    "3": {
        "sentence": "",
        "modelAnswer": "",
        "hint": "",
        "image": "images/card3.jpg",
        "imageAlt": "Card 3",
        "details": ""
    },
    "4": {
        "sentence": "",
        "modelAnswer": "",
        "hint": "",
        "image": "images/card4.jpg",
        "imageAlt": "Card 4",
        "details": ""
    },
    "5": {
        "sentence": "",
        "modelAnswer": "",
        "hint": "",
        "image": "images/card5.jpg",
        "imageAlt": "Card 5",
        "details": ""
    },
    "6": {
        "sentence": "",
        "modelAnswer": "",
        "hint": "",
        "image": "images/card6.jpg",
        "imageAlt": "Card 6",
        "details": ""
    }
};

// ========================================
// GLOBAL VARIABLES
// ========================================
let currentCardId = 1;
let studentAnswers = {};
let storyFinished = false;
let tipsVisible = false;
let modelAnswerVisible = false;
const totalCards = Object.keys(cardData).length;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateDashboard();
    checkCompleteStoryVisibility();
    updateReviewButton();
});

// ========================================
// MODAL FUNCTIONS
// ========================================
function openCard(cardId) {
    currentCardId = cardId;
    const card = cardData[cardId];
    
    tipsVisible = false;
    modelAnswerVisible = false;
    document.getElementById('detailsSection').style.display = 'none';
    document.getElementById('modelAnswerBox').style.display = 'none';
    document.getElementById('feedbackMessage').style.display = 'none';
    
    document.getElementById('modalCardNumber').textContent = `Card ${cardId} of ${totalCards}`;
    document.getElementById('modalSentence').innerHTML = card.sentence;
    
    const previousAnswer = studentAnswers[cardId] || '';
    document.getElementById('studentAnswer').value = previousAnswer;
    updateAnswerLength(previousAnswer);
    
    const imgElement = document.getElementById('modalImageSrc');
    imgElement.src = card.image;
    imgElement.alt = card.imageAlt;
    
    document.getElementById('detailsContent').innerHTML = card.details;
    
    document.getElementById('prevBtn').disabled = cardId === 1;
    document.getElementById('nextBtn').disabled = cardId === totalCards;
    
    updateTipsButtonText();
    
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    saveCurrentAnswer();
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    updateDashboard();
    saveProgress();
    checkCompleteStoryVisibility();
    updateReviewButton();
}

function saveCurrentAnswer() {
    const answer = document.getElementById('studentAnswer').value.trim();
    if (answer) {
        studentAnswers[currentCardId] = answer;
    }
}

function updateAnswerLength(text) {
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('answerLength').textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
}

document.addEventListener('input', function(e) {
    if (e.target.id === 'studentAnswer') {
        updateAnswerLength(e.target.value);
    }
});

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// ========================================
// NAVIGATION
// ========================================
function navigateCard(direction) {
    saveCurrentAnswer();
    const newCardId = currentCardId + direction;
    if (newCardId >= 1 && newCardId <= totalCards) {
        closeModal();
        setTimeout(() => openCard(newCardId), 300);
    }
}

// ========================================
// SAVE ANSWER
// ========================================
function saveAnswer() {
    const answer = document.getElementById('studentAnswer').value.trim();
    const feedbackDiv = document.getElementById('feedbackMessage');
    
    if (!answer) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.className = 'feedback-message feedback-saved';
        feedbackDiv.textContent = '⚠️ Please write your answer first!';
        return;
    }
    
    studentAnswers[currentCardId] = answer;
    
    feedbackDiv.style.display = 'block';
    feedbackDiv.className = 'feedback-message feedback-saved';
    feedbackDiv.textContent = '✅ Answer Saved! Great work!';
    
    setTimeout(() => {
        feedbackDiv.style.display = 'none';
    }, 3000);
    
    saveProgress();
    updateDashboard();
    updateReviewButton();
}

// ========================================
// TOGGLE TIPS
// ========================================
function toggleTips() {
    const detailsSection = document.getElementById('detailsSection');
    tipsVisible = !tipsVisible;
    
    if (tipsVisible) {
        detailsSection.style.display = 'block';
    } else {
        detailsSection.style.display = 'none';
    }
    
    updateTipsButtonText();
}

function updateTipsButtonText() {
    const btn = document.querySelector('.toggle-tips-btn');
    if (tipsVisible) {
        btn.textContent = '💡 Hide Grammar Tips';
    } else {
        btn.textContent = '💡 Show Grammar Tips';
    }
}

// ========================================
// TOGGLE MODEL ANSWER
// ========================================
function toggleModelAnswer() {
    const modelBox = document.getElementById('modelAnswerBox');
    modelAnswerVisible = !modelAnswerVisible;
    
    if (modelAnswerVisible) {
        modelBox.style.display = 'block';
        modelBox.innerHTML = `📖 <strong>Model Answer:</strong><br>${cardData[currentCardId].modelAnswer}`;
    } else {
        modelBox.style.display = 'none';
    }
}

// ========================================
// DASHBOARD UPDATE
// ========================================
function updateDashboard() {
    for (let i = 1; i <= totalCards; i++) {
        const statusDiv = document.getElementById(`status${i}`);
        const cardElement = document.querySelector(`[data-card-id="${i}"]`);
        
        if (studentAnswers[i]) {
            statusDiv.innerHTML = '<span class="status-completed">✅ Completed</span>';
            cardElement.classList.add('completed');
        } else {
            statusDiv.innerHTML = '<span class="status-pending">⏳ Not Started</span>';
            cardElement.classList.remove('completed');
        }
    }
    
    const answeredCount = Object.keys(studentAnswers).length;
    const progress = (answeredCount / totalCards) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${answeredCount}/${totalCards} Completed`;
}

function updateReviewButton() {
    const reviewBtn = document.getElementById('reviewBtn');
    const answeredCount = Object.keys(studentAnswers).length;
    
    if (answeredCount > 0) {
        reviewBtn.disabled = false;
        reviewBtn.textContent = `📝 Review & Finish (${answeredCount}/${totalCards})`;
    } else {
        reviewBtn.disabled = true;
        reviewBtn.textContent = '📝 Review & Finish';
    }
}

// ========================================
// REVIEW MODAL FUNCTIONS
// ========================================
function openReviewModal() {
    const reviewSentences = document.getElementById('reviewSentences');
    reviewSentences.innerHTML = '';
    
    let totalWords = 0;
    let completedCount = 0;
    
    for (let i = 1; i <= totalCards; i++) {
        const studentAnswer = studentAnswers[i];
        
        if (studentAnswer) {
            completedCount++;
            const wordCount = studentAnswer.trim().split(/\s+/).length;
            totalWords += wordCount;
            
            const sentenceDiv = document.createElement('div');
            sentenceDiv.className = 'review-sentence-item';
            sentenceDiv.innerHTML = `
                <div>
                    <span class="review-sentence-number">${i}</span>
                    <strong>Your Answer:</strong>
                </div>
                <div class="review-sentence-text">${studentAnswer}</div>
                <button class="review-edit-btn" onclick="editSentence(${i})">✏️ Edit</button>
            `;
            
            reviewSentences.appendChild(sentenceDiv);
        } else {
            const sentenceDiv = document.createElement('div');
            sentenceDiv.className = 'review-sentence-item';
            sentenceDiv.style.borderLeftColor = '#ff9800';
            sentenceDiv.style.opacity = '0.7';
            sentenceDiv.innerHTML = `
                <div>
                    <span class="review-sentence-number">${i}</span>
                    <strong>Not Answered Yet</strong>
                </div>
                <div class="review-sentence-text" style="color: #999;">[No answer provided]</div>
                <button class="review-edit-btn" onclick="editSentence(${i})">✏️ Answer Now</button>
            `;
            
            reviewSentences.appendChild(sentenceDiv);
        }
    }
    
    document.getElementById('reviewWordCount').textContent = totalWords;
    document.getElementById('reviewCompletedCount').textContent = `${completedCount}/${totalCards}`;
    
    document.getElementById('reviewModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
    document.getElementById('reviewModalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function editSentence(cardId) {
    closeReviewModal();
    setTimeout(() => openCard(cardId), 300);
}

// ========================================
// FINISH STORY
// ========================================
function finishStory() {
    const answeredCount = Object.keys(studentAnswers).length;
    
    if (answeredCount < totalCards) {
        const confirmFinish = confirm(`⚠️ You've only answered ${answeredCount} out of ${totalCards} questions.\n\nYour story will only include the sentences you answered. Do you want to finish anyway?`);
        
        if (!confirmFinish) {
            return;
        }
    }
    
    storyFinished = true;
    saveProgress();
    closeReviewModal();
    generateStudentStory();
    checkCompleteStoryVisibility();
    
    setTimeout(() => {
        document.getElementById('completeStorySection').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

document.getElementById('reviewModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeReviewModal();
});

// ========================================
// COMPLETE STORY SECTION
// ========================================
function checkCompleteStoryVisibility() {
    const storySection = document.getElementById('completeStorySection');
    const answeredCount = Object.keys(studentAnswers).length;
    
    if (storyFinished && answeredCount > 0) {
        storySection.classList.add('visible');
        generateStudentStory();
    } else {
        storySection.classList.remove('visible');
    }
}

function generateStudentStory() {
    let fullStory = '';
    let totalWords = 0;
    let answeredCount = 0;
    
    for (let i = 1; i <= totalCards; i++) {
        if (studentAnswers[i]) {
            const studentAnswer = studentAnswers[i];
            fullStory += studentAnswer + ' ';
            
            const wordCount = studentAnswer.trim().split(/\s+/).length;
            totalWords += wordCount;
            answeredCount++;
        }
    }
    
    if (answeredCount === 0) {
        document.getElementById('fullStoryText').textContent = '📝 Start answering the cards to build your story!';
        document.getElementById('wordCount').textContent = '0';
        document.getElementById('sentenceCount').textContent = '0';
        document.getElementById('completionDate').textContent = '-';
        return;
    }
    
    document.getElementById('fullStoryText').textContent = fullStory.trim();
    document.getElementById('wordCount').textContent = totalWords;
    document.getElementById('sentenceCount').textContent = `${answeredCount}/${totalCards}`;
    document.getElementById('completionDate').textContent = new Date().toLocaleDateString();
    
    updateComparisonView();
}

function updateComparisonView() {
    const container = document.getElementById('comparisonContainer');
    let yourVersionHTML = '';
    let modelVersionHTML = '';
    let hasAnswers = false;
    
    for (let i = 1; i <= totalCards; i++) {
        if (studentAnswers[i]) {
            hasAnswers = true;
            const studentAnswer = studentAnswers[i];
            const modelAnswer = cardData[i].modelAnswer;
            
            yourVersionHTML += `
                <div class="comparison-sentence">
                    <strong>Sentence ${i}:</strong>
                    ${studentAnswer}
                </div>
            `;
            
            modelVersionHTML += `
                <div class="comparison-sentence">
                    <strong>Sentence ${i}:</strong>
                    ${modelAnswer}
                </div>
            `;
        }
    }
    
    if (!hasAnswers) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">📝 Answer some cards first to see the comparison!</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="comparison-column your-version">
            <h4>Your Version</h4>
            ${yourVersionHTML}
        </div>
        <div class="comparison-column model-version">
            <h4>Model Answer</h4>
            ${modelVersionHTML}
        </div>
    `;
}

function toggleCompareView() {
    const comparisonView = document.getElementById('comparisonView');
    if (comparisonView.style.display === 'none' || comparisonView.style.display === '') {
        comparisonView.style.display = 'block';
        updateComparisonView();
        comparisonView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        comparisonView.style.display = 'none';
    }
}

function printStory() {
    window.print();
}

function copyStory() {
    const storyText = document.getElementById('fullStoryText').textContent;
    navigator.clipboard.writeText(storyText).then(function() {
        alert('✅ Story copied to clipboard!');
    }, function() {
        alert('❌ Failed to copy. Please try again.');
    });
}

// ========================================
// RESET FUNCTIONALITY
// ========================================
function confirmReset() {
    document.getElementById('resetModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeResetModal() {
    document.getElementById('resetModalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function resetProgress() {
    studentAnswers = {};
    storyFinished = false;
    tipsVisible = false;
    modelAnswerVisible = false;
    
    localStorage.removeItem('sarahsHolidayAnswers');
    localStorage.removeItem('sarahsHolidayFinished');
    
    updateDashboard();
    checkCompleteStoryVisibility();
    updateReviewButton();
    closeResetModal();
    
    alert('🔄 Progress has been reset! You can start fresh now.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('resetModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeResetModal();
});

// ========================================
// LOCAL STORAGE
// ========================================
function saveProgress() {
    localStorage.setItem('sarahsHolidayAnswers', JSON.stringify(studentAnswers));
    localStorage.setItem('sarahsHolidayFinished', storyFinished.toString());
}

function loadProgress() {
    const savedAnswers = localStorage.getItem('sarahsHolidayAnswers');
    const savedFinished = localStorage.getItem('sarahsHolidayFinished');
    
    if (savedAnswers) {
        studentAnswers = JSON.parse(savedAnswers);
    }
    
    if (savedFinished) {
        storyFinished = savedFinished === 'true';
    }
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', function(e) {
    if (document.getElementById('modalOverlay').classList.contains('active')) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft' && currentCardId > 1) {
            navigateCard(-1);
        } else if (e.key === 'ArrowRight' && currentCardId < totalCards) {
            navigateCard(1);
        } else if (e.key === 'Enter' && e.ctrlKey) {
            saveAnswer();
        }
    }
    
    if (e.key === 'Escape') {
        closeResetModal();
        closeReviewModal();
    }
});
