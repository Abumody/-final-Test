// ========================================
// CHECK FOR EMBEDDED STORY DATA (From Teacher Export)
// ========================================
if (typeof embeddedStoryData !== 'undefined' && embeddedStoryData) {
    // Use embedded story data from teacher export
    const cardData = {};
    embeddedStoryData.cards.forEach((card, index) => {
        cardData[index + 1] = {
            sentence: card.sentence,
            modelAnswer: card.modelAnswer,
            hint: card.hints || '',
            image: card.image || `images/card${index + 1}.jpg`,
            imageAlt: `Card ${index + 1}`,
            details: card.details || ''
        };
    });
    
    // Update story title if available
    if (embeddedStoryData.title) {
        document.querySelector('.dashboard-header h1').textContent = `📚 ${embeddedStoryData.title}`;
    }
}// ========================================
// CARD DATA WITH MODEL ANSWERS & DETAILS
// ========================================
const cardData = {
    1: {
        sentence: 'One day Sarah and her family <span class="mistake">want to see for</span> holiday.',
        modelAnswer: 'One day Sarah and her family went on holiday.',
        image: 'images/shopping_card1.jpg',
        imageAlt: 'Sarah\'s family preparing for holiday',
        details: `
            <ul>
                <li><strong>Tense:</strong> Use past tense "went" instead of present "want" because this already happened</li>
                <li><strong>Preposition:</strong> We say "go ON holiday" (not "see for")</li>
                <li><strong>Common phrase:</strong> "Go on holiday/vacation/trip" are fixed expressions</li>
            </ul>
        `
    },
    2: {
        sentence: 'Next the family <span class="mistake">was ate</span> after that.',
        modelAnswer: 'Next the family ate after that.',
        image: 'images/card2-family-eating.jpg',
        imageAlt: 'Family eating together',
        details: `
            <ul>
                <li><strong>Double past error:</strong> "Was" + "ate" is incorrect - choose one past tense</li>
                <li><strong>Simple past:</strong> "Ate" is the past tense of "eat" - no auxiliary needed</li>
                <li><strong>When to use "was":</strong> Only with -ing form (was eating) or past participle (was eaten)</li>
            </ul>
        `
    },
    3: {
        sentence: 'Ali <span class="mistake">want to swim</span> but the family <span class="mistake">didn\'t saw</span> to Ali.',
        modelAnswer: 'Ali wanted to swim but the family didn\'t see Ali.',
        image: 'images/card3-ali-swimming.jpg',
        imageAlt: 'Ali wanting to swim',
        details: `
            <ul>
                <li><strong>Regular verb:</strong> "Want" → "wanted" (add -ed for past)</li>
                <li><strong>Negative past:</strong> "Didn't" + base verb (not past tense)</li>
                <li><strong>Correct:</strong> "didn't see" ❌ "didn't saw"</li>
                <li><strong>Remove "to":</strong> "See Ali" not "saw to Ali"</li>
            </ul>
        `
    },
    4: {
        sentence: 'Then, Ali <span class="mistake">want to the beach</span> after Ali <span class="mistake">drrowni</span>.',
        modelAnswer: 'Then, Ali went to the beach after Ali drowned.',
        image: 'images/card4-ali-beach.jpg',
        imageAlt: 'Ali at the beach',
        details: `
            <ul>
                <li><strong>Missing verb:</strong> "Want to the beach" → "went to the beach"</li>
                <li><strong>Spelling:</strong> "Drowned" (not "drrowni")</li>
                <li><strong>Past tense:</strong> This happened in the past, so use "went" and "drowned"</li>
                <li><strong>Tip:</strong> Read aloud to catch spelling errors</li>
            </ul>
        `
    },
    5: {
        sentence: 'The rescuer saved Ali, the Dad <span class="mistake">say thank you</span> to rescuer.',
        modelAnswer: 'The rescuer saved Ali, the Dad said thank you to the rescuer.',
        image: 'images/card5-rescuer.jpg',
        imageAlt: 'Rescuer saving Ali',
        details: `
            <ul>
                <li><strong>Irregular verb:</strong> "Say" → "said" (irregular past tense)</li>
                <li><strong>Articles:</strong> Use "the" before specific nouns like "the rescuer"</li>
                <li><strong>Politeness:</strong> "Said thank you" shows gratitude</li>
                <li><strong>Remember:</strong> Irregular verbs must be memorized</li>
            </ul>
        `
    },
    6: {
        sentence: 'Finally the family enjoyed their holiday and <span class="mistake">went to go to sea but be carful to saw Ali</span>.',
        modelAnswer: 'Finally the family enjoyed their holiday and went to sea but were careful to watch Ali.',
        image: 'images/card6-family-sea.jpg',
        imageAlt: 'Family at the sea',
        details: `
            <ul>
                <li><strong>Redundancy:</strong> "Went to go" → just "went"</li>
                <li><strong>Spelling:</strong> "Careful" (not "carful")</li>
                <li><strong>Past tense:</strong> "Were careful" (not "be careful")</li>
                <li><strong>Word choice:</strong> "Watch" (monitor) vs "saw" (past of see)</li>
                <li><strong>Meaning:</strong> They watched/cared for Ali's safety</li>
            </ul>
        `
    }
};

// ========================================
// GLOBAL VARIABLES
// ========================================
let currentCardId = 1;
let studentAnswers = {}; // Store ONLY student's answers
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
    
    // Reset visibility states for new card
    tipsVisible = false;
    modelAnswerVisible = false;
    document.getElementById('detailsSection').style.display = 'none';
    document.getElementById('modelAnswerBox').style.display = 'none';
    document.getElementById('feedbackMessage').style.display = 'none';
    
    // Update modal content
    document.getElementById('modalCardNumber').textContent = `Card ${cardId} of ${totalCards}`;
    document.getElementById('modalSentence').innerHTML = card.sentence;
    
    // Load student's previous answer if exists
    const previousAnswer = studentAnswers[cardId] || '';
    document.getElementById('studentAnswer').value = previousAnswer;
    updateAnswerLength(previousAnswer);
    
    // Update image
    const imgElement = document.getElementById('modalImageSrc');
    imgElement.src = card.image;
    imgElement.alt = card.imageAlt;
    
    // Update details content
    document.getElementById('detailsContent').innerHTML = card.details;
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = cardId === 1;
    document.getElementById('nextBtn').disabled = cardId === totalCards;
    
    // Update tips button text
    updateTipsButtonText();
    
    // Show modal
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

// Listen for typing to update word count in real-time
document.addEventListener('input', function(e) {
    if (e.target.id === 'studentAnswer') {
        updateAnswerLength(e.target.value);
    }
});

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
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
// SAVE ANSWER (NO RIGHT/WRONG FEEDBACK)
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
    
    // Save answer without judgment
    studentAnswers[currentCardId] = answer;
    
    // Show positive feedback only
    feedbackDiv.style.display = 'block';
    feedbackDiv.className = 'feedback-message feedback-saved';
    feedbackDiv.textContent = '✅ Answer Saved! Great work!';
    
    // Auto-hide feedback after 3 seconds
    setTimeout(() => {
        feedbackDiv.style.display = 'none';
    }, 3000);
    
    saveProgress();
    updateDashboard();
    updateReviewButton();
}

// ========================================
// TOGGLE TIPS (HIDDEN BY DEFAULT)
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
// TOGGLE MODEL ANSWER (OPTIONAL - STUDENT CHOOSES)
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
    
    // Calculate progress based on answered questions
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
            // Answered question
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
            // Unanswered question - show as reminder
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
// FINISH STORY (WITH WARNING IF INCOMPLETE)
// ========================================
function finishStory() {
    const answeredCount = Object.keys(studentAnswers).length;
    
    // Warn if not all questions answered
    if (answeredCount < totalCards) {
        const confirmFinish = confirm(`⚠️ You've only answered ${answeredCount} out of ${totalCards} questions.\n\nYour story will only include the sentences you answered. Do you want to finish anyway?`);
        
        if (!confirmFinish) {
            return; // Stay in review modal
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

// Close review modal when clicking outside
document.getElementById('reviewModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeReviewModal();
    }
});

// ========================================
// COMPLETE STORY SECTION (ONLY STUDENT ANSWERS)
// ========================================
function checkCompleteStoryVisibility() {
    const storySection = document.getElementById('completeStorySection');
    const answeredCount = Object.keys(studentAnswers).length;
    
    // Only show story if finished AND has at least 1 answer
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
    
    // Loop through all cards and ONLY include answered ones
    for (let i = 1; i <= totalCards; i++) {
        if (studentAnswers[i]) {
            const studentAnswer = studentAnswers[i];
            fullStory += studentAnswer + ' ';
            
            const wordCount = studentAnswer.trim().split(/\s+/).length;
            totalWords += wordCount;
            answeredCount++;
        }
    }
    
    // Handle case where no answers exist
    if (answeredCount === 0) {
        document.getElementById('fullStoryText').textContent = '📝 Start answering the cards to build your story!';
        document.getElementById('wordCount').textContent = '0';
        document.getElementById('sentenceCount').textContent = '0';
        document.getElementById('completionDate').textContent = '-';
        return;
    }
    
    // Update story text with ONLY student's answers (NO model answers)
    document.getElementById('fullStoryText').textContent = fullStory.trim();
    
    // Update statistics to show actual answered count
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
    
    // Only include answered questions in comparison
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
    
    // Handle case where no answers exist
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
    // Clear all data
    studentAnswers = {};
    storyFinished = false;
    tipsVisible = false;
    modelAnswerVisible = false;
    
    // Clear localStorage
    localStorage.removeItem('sarahsHolidayProgress');
    localStorage.removeItem('sarahsHolidayAnswers');
    localStorage.removeItem('sarahsHolidayFinished');
    
    // Update UI
    updateDashboard();
    checkCompleteStoryVisibility();
    updateReviewButton();
    closeResetModal();
    
    alert('🔄 Progress has been reset! You can start fresh now.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close reset modal when clicking outside
document.getElementById('resetModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeResetModal();
    }
});

// ========================================
// LOCAL STORAGE (Save & Load Progress)
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
    // When card modal is open
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
    
    // Close modals with Escape
    if (e.key === 'Escape') {
        closeResetModal();
        closeReviewModal();
    }
});

// ========================================
// ADD NEW CARDS (For Future Expansion)
// ========================================
function addNewCard(cardId, cardInfo) {
    cardData[cardId] = cardInfo;
    console.log(`New card ${cardId} added! Remember to add it to the dashboard HTML.`);
}