// ========================================
// TEACHER DASHBOARD - COMPLETE FILE
// ========================================

// ========================================
// GLOBAL VARIABLES
// ========================================
let currentStory = {
    id: null,
    title: '',
    description: '',
    wordCountType: 'none',
    wordCountValue: 0,
    passingScore: 80,
    cards: []
};

let savedStories = [];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadSavedStories();
    createNewStory();
});

// ========================================
// STORY MANAGEMENT
// ========================================
function createNewStory() {
    currentStory = {
        id: generateId(),
        title: 'New Story',
        description: '',
        wordCountType: 'none',
        wordCountValue: 0,
        passingScore: 80,
        cards: []
    };
    
    // Reset form fields
    document.getElementById('storyTitle').value = 'New Story';
    document.getElementById('storyDescription').value = '';
    document.getElementById('wordCountType').value = 'none';
    document.getElementById('wordCountValue').value = '';
    document.getElementById('passingScore').value = '80';
    document.getElementById('totalCards').value = '6';
    
    // Create default 6 cards
    currentStory.cards = [];
    for (let i = 1; i <= 6; i++) {
        currentStory.cards.push({
            id: generateId(),
            number: i,
            sentence: '',
            modelAnswer: '',
            hints: '',
            image: '',
            details: ''
        });
    }
    
    renderCardsEditor();
    showNotification('New story created!', 'success');
}

function saveStory() {
    // Collect form data
    currentStory.title = document.getElementById('storyTitle').value.trim();
    currentStory.description = document.getElementById('storyDescription').value.trim();
    currentStory.wordCountType = document.getElementById('wordCountType').value;
    currentStory.wordCountValue = parseInt(document.getElementById('wordCountValue').value) || 0;
    currentStory.passingScore = parseInt(document.getElementById('passingScore').value) || 80;
    
    // Collect card data
    currentStory.cards = [];
    const cardElements = document.querySelectorAll('.card-editor');
    cardElements.forEach((cardEl, index) => {
        const card = {
            id: cardEl.dataset.cardId || generateId(),
            number: index + 1,
            sentence: document.getElementById(`sentence-${cardEl.dataset.cardId}`).value.trim(),
            modelAnswer: document.getElementById(`modelAnswer-${cardEl.dataset.cardId}`).value.trim(),
            hints: document.getElementById(`hints-${cardEl.dataset.cardId}`).value.trim(),
            image: document.getElementById(`image-${cardEl.dataset.cardId}`).value.trim(),
            details: document.getElementById(`details-${cardEl.dataset.cardId}`).value.trim()
        };
        currentStory.cards.push(card);
    });
    
    // Validate
    if (!currentStory.title) {
        showNotification('Please enter a story title!', 'error');
        return;
    }
    
    if (currentStory.cards.length === 0) {
        showNotification('Please add at least one card!', 'error');
        return;
    }
    
    // Save to localStorage
    if (!currentStory.id) {
        currentStory.id = generateId();
    }
    
    // Check if story exists, update or add
    const existingIndex = savedStories.findIndex(s => s.id === currentStory.id);
    if (existingIndex >= 0) {
        savedStories[existingIndex] = currentStory;
    } else {
        savedStories.push(currentStory);
    }
    
    localStorage.setItem('teacherStories', JSON.stringify(savedStories));
    
    renderSavedStoriesList();
    showNotification('Story saved successfully!', 'success');
}

function loadSavedStories() {
    const saved = localStorage.getItem('teacherStories');
    if (saved) {
        savedStories = JSON.parse(saved);
        renderSavedStoriesList();
    }
}

// ========================================
// LOAD MODAL FUNCTIONS
// ========================================
function openLoadModal() {
    const loadList = document.getElementById('loadStoriesList');
    loadList.innerHTML = '';
    
    if (savedStories.length === 0) {
        loadList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No saved stories yet.</p>';
    } else {
        savedStories.forEach(story => {
            const storyDiv = document.createElement('div');
            storyDiv.className = 'story-item';
            storyDiv.innerHTML = `
                <div class="story-info">
                    <h3>${story.title}</h3>
                    <p>${story.cards.length} cards | ${story.description || 'No description'}</p>
                </div>
                <div class="story-actions">
                    <button class="btn-load-story" onclick="loadStory('${story.id}')">📂 Load</button>
                    <button class="btn-delete-story" onclick="deleteStory('${story.id}')">🗑️ Delete</button>
                </div>
            `;
            loadList.appendChild(storyDiv);
        });
    }
    
    document.getElementById('loadModalOverlay').classList.add('active');
}

function closeLoadModal() {
    document.getElementById('loadModalOverlay').classList.remove('active');
}

function loadStory(storyId) {
    const story = savedStories.find(s => s.id === storyId);
    if (story) {
        currentStory = JSON.parse(JSON.stringify(story));
        
        document.getElementById('storyTitle').value = currentStory.title;
        document.getElementById('storyDescription').value = currentStory.description;
        document.getElementById('wordCountType').value = currentStory.wordCountType;
        document.getElementById('wordCountValue').value = currentStory.wordCountValue;
        document.getElementById('passingScore').value = currentStory.passingScore;
        document.getElementById('totalCards').value = currentStory.cards.length;
        
        renderCardsEditor();
        closeLoadModal();
        showNotification('Story loaded!', 'success');
    }
}

function deleteStory(storyId) {
    if (confirm('Are you sure you want to delete this story? This cannot be undone.')) {
        savedStories = savedStories.filter(s => s.id !== storyId);
        localStorage.setItem('teacherStories', JSON.stringify(savedStories));
        renderSavedStoriesList();
        openLoadModal();
        showNotification('Story deleted!', 'success');
    }
}

function renderSavedStoriesList() {
    const list = document.getElementById('storiesList');
    list.innerHTML = '';
    
    if (savedStories.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No saved stories yet. Create your first story!</p>';
    } else {
        savedStories.forEach(story => {
            const storyDiv = document.createElement('div');
            storyDiv.className = 'story-item';
            storyDiv.innerHTML = `
                <div class="story-info">
                    <h3>${story.title}</h3>
                    <p>${story.cards.length} cards | Created: ${new Date(parseInt(story.id.substr(0, 10), 36)).toLocaleDateString()}</p>
                </div>
                <div class="story-actions">
                    <button class="btn-load-story" onclick="loadStory('${story.id}')">📂 Load</button>
                    <button class="btn-delete-story" onclick="deleteStory('${story.id}')">🗑️ Delete</button>
                </div>
            `;
            list.appendChild(storyDiv);
        });
    }
}

// ========================================
// CARDS EDITOR
// ========================================
function renderCardsEditor() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';
    
    currentStory.cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-editor';
        cardDiv.dataset.cardId = card.id;
        cardDiv.innerHTML = `
            <div class="card-header">
                <span class="card-number-badge">Card ${index + 1}</span>
                <div class="card-actions">
                    <button class="btn-move-up" onclick="moveCard(${index}, -1)" ${index === 0 ? 'disabled' : ''}>⬆️ Up</button>
                    <button class="btn-move-down" onclick="moveCard(${index}, 1)" ${index === currentStory.cards.length - 1 ? 'disabled' : ''}>⬇️ Down</button>
                    <button class="btn-delete-card" onclick="deleteCard(${index})">🗑️ Delete</button>
                </div>
            </div>
            
            <div class="editor-field">
                <label>Sentence with Mistakes:</label>
                <textarea id="sentence-${card.id}" placeholder="e.g., One day Sarah and her family want to see for holiday.">${card.sentence || ''}</textarea>
                <p class="field-hint">Write the sentence AS IS with grammar mistakes.</p>
            </div>
            
            <div class="editor-field">
                <label>Model Answer (Correct Version):</label>
                <textarea id="modelAnswer-${card.id}" placeholder="e.g., One day Sarah and her family went on holiday.">${card.modelAnswer || ''}</textarea>
                <p class="field-hint">This is the correct version students can compare with.</p>
            </div>
            
            <div class="editor-field">
                <label>Hints (Optional):</label>
                <input type="text" id="hints-${card.id}" placeholder="e.g., Think about past tense..." value="${card.hints || ''}">
            </div>
            
            <div class="editor-field">
                <label>Image Filename (Optional):</label>
                <input type="text" id="image-${card.id}" placeholder="e.g., images/card1.jpg" value="${card.image || ''}">
            </div>
            
            <div class="editor-field">
                <label>Grammar Details/Explanation (Optional):</label>
                <textarea id="details-${card.id}" placeholder="Detailed grammar explanation for students..." style="min-height: 100px;">${card.details || ''}</textarea>
            </div>
        `;
        container.appendChild(cardDiv);
    });
}

function addNewCard() {
    const newCard = {
        id: generateId(),
        number: currentStory.cards.length + 1,
        sentence: '',
        modelAnswer: '',
        hints: '',
        image: '',
        details: ''
    };
    currentStory.cards.push(newCard);
    renderCardsEditor();
    document.getElementById('totalCards').value = currentStory.cards.length;
    showNotification('New card added!', 'success');
}

function deleteCard(index) {
    if (currentStory.cards.length <= 1) {
        showNotification('You need at least one card!', 'error');
        return;
    }
    
    if (confirm('Delete this card?')) {
        currentStory.cards.splice(index, 1);
        renderCardsEditor();
        document.getElementById('totalCards').value = currentStory.cards.length;
        showNotification('Card deleted!', 'success');
    }
}

function moveCard(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= currentStory.cards.length) return;
    
    [currentStory.cards[index], currentStory.cards[newIndex]] = 
    [currentStory.cards[newIndex], currentStory.cards[index]];
    
    renderCardsEditor();
    showNotification('Card moved!', 'info');
}

function updateCardCount() {
    const count = parseInt(document.getElementById('totalCards').value) || 6;
    const currentCount = currentStory.cards.length;
    
    if (count > currentCount) {
        for (let i = currentCount; i < count; i++) {
            currentStory.cards.push({
                id: generateId(),
                number: i + 1,
                sentence: '',
                modelAnswer: '',
                hints: '',
                image: '',
                details: ''
            });
        }
    } else if (count < currentCount) {
        if (confirm(`Reduce from ${currentCount} to ${count} cards? The extra cards will be deleted.`)) {
            currentStory.cards = currentStory.cards.slice(0, count);
        } else {
            document.getElementById('totalCards').value = currentCount;
        }
    }
    
    renderCardsEditor();
}

// ========================================
// PREVIEW
// ========================================
function previewStudentView() {
    currentStory.title = document.getElementById('storyTitle').value.trim();
    currentStory.cards = [];
    
    const cardElements = document.querySelectorAll('.card-editor');
    cardElements.forEach((cardEl, index) => {
        currentStory.cards.push({
            id: cardEl.dataset.cardId,
            number: index + 1,
            sentence: document.getElementById(`sentence-${cardEl.dataset.cardId}`).value.trim(),
            modelAnswer: document.getElementById(`modelAnswer-${cardEl.dataset.cardId}`).value.trim(),
            hints: document.getElementById(`hints-${cardEl.dataset.cardId}`).value.trim()
        });
    });
    
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <h3 style="text-align: center; color: #667eea; margin-bottom: 20px;">${currentStory.title || 'Untitled Story'}</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <strong>Total Cards:</strong> ${currentStory.cards.length}<br>
            <strong>Word Count Requirement:</strong> ${currentStory.wordCountType === 'none' ? 'None' : `${currentStory.wordCountType} ${currentStory.wordCountValue} words`}
        </div>
        <div style="border-top: 2px solid #ddd; padding-top: 20px;">
            ${currentStory.cards.map((card, i) => `
                <div style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <strong>Card ${i + 1}:</strong><br>
                    <em>Sentence:</em> ${card.sentence || '<span style="color: #999;">Not set</span>'}<br>
                    <em>Model Answer:</em> ${card.modelAnswer || '<span style="color: #999;">Not set</span>'}
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('previewModalOverlay').classList.add('active');
}

function closePreviewModal() {
    document.getElementById('previewModalOverlay').classList.remove('active');
}

// ========================================
// EXPORT FUNCTIONS - EXPORT 3 FILES (HTML + CSS + JS)
// ========================================
function exportStudentVersion() {
    openExportModal();
}

function openExportModal() {
    document.getElementById('exportModalOverlay').classList.add('active');
}

function closeExportModal() {
    document.getElementById('exportModalOverlay').classList.remove('active');
}

function confirmExport() {
    const exportType = document.querySelector('input[name="exportType"]:checked');
    
    if (!exportType) {
        showNotification('Please select an export option!', 'error');
        return;
    }
    
    const exportTypeValue = exportType.value;
    
    saveStory();
    
    if (exportTypeValue === 'html') {
        exportAsThreeFiles();
    } else if (exportTypeValue === 'json') {
        exportAsJSON();
    } else if (exportTypeValue === 'link') {
        generateShareableLink();
    }
    
    closeExportModal();
}

// ✅ EXPORT AS 3 SEPARATE FILES (HTML + CSS + JS)
function exportAsThreeFiles() {
    const storyData = {
        title: document.getElementById('storyTitle').value.trim() || 'Grammar Story',
        description: document.getElementById('storyDescription').value.trim(),
        wordCountType: document.getElementById('wordCountType').value,
        wordCountValue: parseInt(document.getElementById('wordCountValue').value) || 0,
        passingScore: parseInt(document.getElementById('passingScore').value) || 80,
        cards: []
    };
    
    const cardElements = document.querySelectorAll('.card-editor');
    cardElements.forEach((cardEl, index) => {
        storyData.cards.push({
            id: generateId(),
            number: index + 1,
            sentence: document.getElementById(`sentence-${cardEl.dataset.cardId}`).value.trim(),
            modelAnswer: document.getElementById(`modelAnswer-${cardEl.dataset.cardId}`).value.trim(),
            hints: document.getElementById(`hints-${cardEl.dataset.cardId}`).value.trim(),
            image: document.getElementById(`image-${cardEl.dataset.cardId}`).value.trim(),
            details: document.getElementById(`details-${cardEl.dataset.cardId}`).value.trim()
        });
    });
    
    // Validate cards
    const emptyCards = storyData.cards.filter(c => !c.sentence || !c.modelAnswer);
    if (emptyCards.length > 0) {
        if (!confirm(`${emptyCards.length} card(s) have empty sentences or model answers. Export anyway?`)) {
            return;
        }
    }
    
    // Generate safe filename
    const safeTitle = storyData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Export all 3 files
    exportHTMLFile(safeTitle, storyData);
    exportCSSFile(safeTitle);
    exportJSFile(safeTitle, storyData);
    
    showNotification('3 files exported successfully! (HTML + CSS + JS)', 'success');
}

function exportHTMLFile(safeTitle, storyData) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${storyData.title} - Grammar Challenge</title>
    <link rel="stylesheet" href="${safeTitle}_style.css">
</head>
<body>

    <!-- DASHBOARD HEADER -->
    <header class="dashboard-header">
        <h1>📚 ${storyData.title}</h1>
        <p class="subtitle">Click on any card to correct the grammar mistakes</p>
        
        <div class="header-actions">
            <div class="progress-container">
                <span>Progress: </span>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <span id="progressText">0/${storyData.cards.length} Completed</span>
            </div>
            
            <button class="reset-btn" onclick="confirmReset()">🔄 Reset Progress</button>
            
            <button class="review-btn" id="reviewBtn" onclick="openReviewModal()" disabled>
                📝 Review & Finish
            </button>
        </div>
    </header>

    <!-- DASHBOARD GRID -->
    <main class="dashboard-grid">
        ${storyData.cards.map((card, index) => `
        <div class="dashboard-card" data-card-id="${index + 1}" onclick="openCard(${index + 1})">
            <div class="card-preview">
                <div class="card-number">${index + 1}</div>
                <div class="card-icon">📝</div>
                <p class="card-preview-text">${card.sentence}</p>
                <div class="card-status" id="status${index + 1}">
                    <span class="status-pending">⏳ Not Started</span>
                </div>
            </div>
        </div>
        `).join('')}
    </main>

    <!-- COMPLETE STORY SECTION -->
    <section class="complete-story-section" id="completeStorySection">
        <div class="story-header">
            <h2>🎉 Your Complete Story</h2>
            <p class="story-subtitle">Great job! Here's the story with your corrections:</p>
        </div>
        
        <div class="story-content">
            <div class="story-text" id="fullStoryText"></div>
            
            <div class="story-stats">
                <div class="stat-box">
                    <span class="stat-icon">📝</span>
                    <span class="stat-label">Total Words</span>
                    <span class="stat-value" id="wordCount">0</span>
                </div>
                <div class="stat-box">
                    <span class="stat-icon">📄</span>
                    <span class="stat-label">Sentences</span>
                    <span class="stat-value" id="sentenceCount">0</span>
                </div>
                <div class="stat-box">
                    <span class="stat-icon">✅</span>
                    <span class="stat-label">Completed</span>
                    <span class="stat-value" id="completionDate">-</span>
                </div>
            </div>
            
            <div class="story-actions">
                <button class="compare-btn" onclick="toggleCompareView()">🔍 Compare with Model Answer</button>
                <button class="print-btn" onclick="printStory()">🖨️ Print Story</button>
                <button class="copy-btn" onclick="copyStory()">📋 Copy to Clipboard</button>
                <button class="restart-btn" onclick="confirmReset()">🔄 Start Over</button>
            </div>
            
            <div class="comparison-view" id="comparisonView" style="display: none;">
                <h3>Side-by-Side Comparison</h3>
                <p class="comparison-note">Compare your version with the model answer to see differences</p>
                <div class="comparison-container" id="comparisonContainer"></div>
            </div>
        </div>
    </section>

    <!-- CARD MODAL -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content">
            <button class="close-modal" onclick="closeModal()">✕ Close</button>
            
            <div class="modal-card-number" id="modalCardNumber">Card 1</div>
            
            <div class="story-image" id="modalImage">
                <img id="modalImageSrc" src="" alt="Story image">
            </div>

            <div class="sentence-container" id="modalSentence"></div>

            <div class="details-section" id="detailsSection" style="display: none;">
                <h4>📖 Grammar Tips & Context:</h4>
                <div class="details-content" id="detailsContent"></div>
            </div>

            <button class="toggle-tips-btn" onclick="toggleTips()">💡 Show Grammar Tips</button>

            <div class="student-answer-section">
                <label for="studentAnswer">✏️ Your Correction:</label>
                <input type="text" id="studentAnswer" class="student-answer-input" placeholder="Write the corrected sentence here...">
                <div class="answer-length" id="answerLength">0 words</div>
            </div>

            <div class="button-container">
                <button class="save-btn" onclick="saveAnswer()">💾 Save Answer</button>
                <button class="model-btn" onclick="toggleModelAnswer()">📖 Show Model Answer</button>
            </div>

            <div class="feedback-message" id="feedbackMessage"></div>
            <div class="model-answer-box" id="modelAnswerBox"></div>

            <div class="navigation-buttons">
                <button class="nav-btn" id="prevBtn" onclick="navigateCard(-1)">← Previous</button>
                <button class="nav-btn" id="nextBtn" onclick="navigateCard(1)">Next →</button>
            </div>
        </div>
    </div>

    <!-- REVIEW MODAL -->
    <div class="modal-overlay" id="reviewModalOverlay">
        <div class="modal-content review-modal-content">
            <button class="close-modal" onclick="closeReviewModal()">✕ Close</button>
            
            <h2>📝 Review Your Story</h2>
            <p class="review-subtitle">Review your corrections before finishing. You can still edit any sentence!</p>
            
            <div class="review-story-container">
                <div class="review-sentences" id="reviewSentences"></div>
            </div>
            
            <div class="review-stats">
                <div class="review-stat">
                    <span class="stat-label">Total Words:</span>
                    <span class="stat-value" id="reviewWordCount">0</span>
                </div>
                <div class="review-stat">
                    <span class="stat-label">Sentences Completed:</span>
                    <span class="stat-value" id="reviewCompletedCount">0/${storyData.cards.length}</span>
                </div>
            </div>
            
            <div class="review-buttons">
                <button class="back-to-edit-btn" onclick="closeReviewModal()">✏️ Back to Editing</button>
                <button class="finish-btn" onclick="finishStory()">✅ Finish & View Story</button>
            </div>
        </div>
    </div>

    <!-- CONFIRM RESET MODAL -->
    <div class="modal-overlay" id="resetModalOverlay">
        <div class="modal-content reset-modal-content">
            <h2>⚠️ Reset Progress?</h2>
            <p>This will clear all your completed cards and answers. Are you sure?</p>
            <div class="reset-buttons">
                <button class="cancel-reset-btn" onclick="closeResetModal()">Cancel</button>
                <button class="confirm-reset-btn" onclick="resetProgress()">Yes, Reset Everything</button>
            </div>
        </div>
    </div>

    <script src="${safeTitle}_script.js"></script>
</body>
</html>`;

    downloadFile(`${safeTitle}_student.html`, htmlContent, 'text/html');
}

function exportCSSFile(safeTitle) {
    // This is your existing style.css content
    const cssContent = `/* ========================================
GLOBAL STYLES
======================================== */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}
/* ========================================
DASHBOARD HEADER
======================================== */
.dashboard-header {
    text-align: center;
    color: white;
    margin-bottom: 40px;
    padding: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(10px);
}
.dashboard-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
.subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 20px;
}
.header-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    margin-top: 20px;
}
.progress-container {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}
.progress-bar {
    width: 200px;
    height: 20px;
    background: rgba(255,255,255,0.3);
    border-radius: 10px;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #66bb6a, #43a047);
    width: 0%;
    transition: width 0.5s ease;
    border-radius: 10px;
}
#progressText {
    font-weight: bold;
    font-size: 1.1rem;
}
.reset-btn {
    background: rgba(255, 82, 82, 0.9);
    color: white;
    border: 2px solid white;
    padding: 12px 25px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.reset-btn:hover {
    background: #ff5252;
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(255, 82, 82, 0.5);
}
.review-btn {
    background: linear-gradient(135deg, #66bb6a, #43a047);
    color: white;
    border: 2px solid white;
    padding: 12px 25px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.review-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #43a047, #2e7d32);
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(102, 187, 106, 0.5);
}
.review-btn:disabled {
    background: #bdbdbd;
    border-color: #9e9e9e;
    cursor: not-allowed;
    opacity: 0.6;
}
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
    max-width: 1400px;
    margin: 0 auto;
}
.dashboard-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    position: relative;
    overflow: hidden;
}
.dashboard-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}
.dashboard-card.completed {
    border: 3px solid #66bb6a;
}
.dashboard-card.completed .card-number {
    background: #66bb6a;
}
.card-preview {
    text-align: center;
}
.card-number {
    display: inline-block;
    background: #764ba2;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 50px;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 15px;
}
.card-icon {
    font-size: 3rem;
    margin-bottom: 15px;
}
.card-preview-text {
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}
.preview-mistake {
    background: #ffcdd2;
    color: #c62828;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
    text-decoration: underline;
}
.card-status {
    padding: 10px;
    border-radius: 8px;
    font-weight: 600;
}
.status-pending {
    color: #ff9800;
    background: #fff3e0;
}
.status-completed {
    color: #66bb6a;
    background: #e8f5e9;
}
.complete-story-section {
    display: none;
    max-width: 1000px;
    margin: 50px auto;
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    animation: slideUp 0.6s ease;
}
.complete-story-section.visible {
    display: block;
}
@keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
}
.story-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 3px solid #667eea;
}
.story-header h2 {
    color: #764ba2;
    font-size: 2rem;
    margin-bottom: 10px;
}
.story-subtitle {
    color: #666;
    font-size: 1.1rem;
}
.story-content {
    padding: 20px;
}
.story-text {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 12px;
    border-left: 5px solid #66bb6a;
    font-size: 1.2rem;
    line-height: 2;
    color: #333;
    margin-bottom: 30px;
    white-space: pre-line;
}
.story-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}
.stat-box {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.3s;
}
.stat-box:hover {
    transform: scale(1.05);
}
.stat-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 10px;
}
.stat-label {
    display: block;
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 5px;
}
.stat-value {
    display: block;
    font-size: 1.8rem;
    font-weight: bold;
}
.story-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}
.compare-btn {
    background: #2196f3;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
    margin: 10px 5px;
}
.compare-btn:hover {
    background: #1976d2;
    transform: translateY(-2px);
}
.print-btn, .copy-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
    margin: 10px 5px;
}
.print-btn:hover, .copy-btn:hover {
    background: #5e35b1;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
.restart-btn {
    background: #ff5252;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
    margin: 10px 5px;
}
.restart-btn:hover {
    background: #ff1744;
    transform: translateY(-2px);
}
.comparison-view {
    margin-top: 40px;
    padding: 30px;
    background: #f5f5f5;
    border-radius: 12px;
}
.comparison-view h3 {
    text-align: center;
    color: #764ba2;
    margin-bottom: 10px;
}
.comparison-note {
    text-align: center;
    color: #666;
    margin-bottom: 25px;
    font-style: italic;
}
.comparison-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}
.comparison-column {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.comparison-column h4 {
    text-align: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #ddd;
}
.your-version h4 {
    color: #667eea;
}
.model-version h4 {
    color: #66bb6a;
}
.comparison-sentence {
    margin: 15px 0;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 0.95rem;
    line-height: 1.5;
}
.comparison-sentence strong {
    display: block;
    margin-bottom: 5px;
    font-size: 0.85rem;
    color: #757575;
}
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 1000;
    overflow-y: auto;
    padding: 20px;
}
.modal-overlay.active {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
.modal-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 900px;
    width: 100%;
    margin: 40px auto;
    position: relative;
    animation: slideDown 0.4s ease;
}
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-50px); }
    to { opacity: 1; transform: translateY(0); }
}
.reset-modal-content {
    max-width: 500px;
    text-align: center;
}
.reset-modal-content h2 {
    color: #ff5252;
    margin-bottom: 20px;
}
.reset-modal-content p {
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1rem;
}
.reset-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}
.cancel-reset-btn {
    background: #9e9e9e;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.cancel-reset-btn:hover {
    background: #757575;
}
.confirm-reset-btn {
    background: #ff5252;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.confirm-reset-btn:hover {
    background: #ff1744;
}
.close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #ff5252;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
}
.close-modal:hover {
    background: #ff1744;
    transform: rotate(90deg);
}
.modal-card-number {
    text-align: center;
    background: #764ba2;
    color: white;
    padding: 10px 30px;
    border-radius: 25px;
    display: inline-block;
    margin: 20px auto;
    font-size: 1.2rem;
    font-weight: bold;
}
.story-image {
    width: 100%;
    max-width: 600px;
    height: 350px;
    background: #e3f2fd;
    border-radius: 12px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px dashed #90caf9;
    overflow: hidden;
}
.story-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.sentence-container {
    font-size: 1.5rem;
    color: #333;
    margin: 30px 0;
    line-height: 1.8;
    padding: 25px;
    background: #f8f9fa;
    border-radius: 12px;
    border-left: 5px solid #667eea;
    text-align: center;
}
.mistake {
    background: #ffcdd2;
    color: #c62828;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: bold;
    border-bottom: 3px solid #c62828;
    cursor: help;
}
.toggle-tips-btn {
    background: #ff9800;
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
    margin: 15px auto;
    display: block;
}
.toggle-tips-btn:hover {
    background: #f57c00;
    transform: translateY(-2px);
}
.details-section {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
    text-align: left;
}
.details-section h4 {
    color: #1976d2;
    margin-bottom: 10px;
    font-size: 1.1rem;
}
.details-content {
    color: #424242;
    line-height: 1.6;
    font-size: 0.95rem;
}
.details-content ul {
    margin: 10px 0;
    padding-left: 20px;
}
.details-content li {
    margin: 5px 0;
}
.student-answer-section {
    margin: 30px 0;
    text-align: left;
}
.student-answer-section label {
    display: block;
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 10px;
    font-weight: 600;
}
.student-answer-input {
    width: 100%;
    padding: 15px;
    font-size: 1.2rem;
    border: 2px solid #ddd;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s;
    font-family: inherit;
}
.student-answer-input:focus {
    border-color: #667eea;
}
.answer-length {
    text-align: right;
    font-size: 0.85rem;
    color: #757575;
    margin-top: 5px;
    font-style: italic;
}
.button-container {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 25px;
}
.save-btn {
    background: linear-gradient(135deg, #66bb6a, #43a047);
    color: white;
    border: none;
    padding: 15px 35px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.save-btn:hover {
    background: linear-gradient(135deg, #43a047, #2e7d32);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 187, 106, 0.4);
}
.model-btn {
    background: #2196f3;
    color: white;
    border: none;
    padding: 15px 35px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.model-btn:hover {
    background: #1976d2;
    transform: translateY(-2px);
}
.nav-btn {
    background: #764ba2;
    color: white;
    margin-top: 20px;
    padding: 15px 35px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
    border: none;
}
.nav-btn:hover {
    background: #5e35b1;
    transform: translateY(-2px);
}
.nav-btn:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
    transform: none;
}
.navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #eee;
}
.feedback-message {
    margin-top: 15px;
    padding: 15px;
    border-radius: 8px;
    font-size: 1.1rem;
    display: none;
    text-align: center;
    font-weight: 600;
}
.feedback-saved {
    background: #c8e6c9;
    color: #2e7d32;
    border: 2px solid #81c784;
}
.model-answer-box {
    margin-top: 20px;
    padding: 20px;
    background: #e8f5e9;
    border: 2px solid #81c784;
    border-radius: 12px;
    color: #2e7d32;
    font-size: 1.2rem;
    font-weight: 600;
    display: none;
    text-align: center;
    animation: slideIn 0.5s ease;
}
@keyframes slideIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}
.review-modal-content {
    max-width: 1000px;
}
.review-modal-content h2 {
    color: #764ba2;
    text-align: center;
    margin-bottom: 10px;
}
.review-subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1rem;
}
.review-story-container {
    max-height: 500px;
    overflow-y: auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    margin-bottom: 20px;
}
.review-sentence-item {
    background: white;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.review-sentence-number {
    display: inline-block;
    background: #667eea;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-weight: bold;
    margin-right: 10px;
}
.review-sentence-text {
    font-size: 1.1rem;
    color: #333;
    line-height: 1.6;
    margin: 10px 0;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 6px;
}
.review-edit-btn {
    background: #ff9800;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s;
    margin-top: 10px;
}
.review-edit-btn:hover {
    background: #f57c00;
    transform: translateY(-2px);
}
.review-stats {
    display: flex;
    gap: 30px;
    justify-content: center;
    margin: 20px 0;
    padding: 20px;
    background: #e8f5e9;
    border-radius: 8px;
}
.review-stat {
    text-align: center;
}
.review-stat .stat-label {
    display: block;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 5px;
}
.review-stat .stat-value {
    display: block;
    color: #2e7d32;
    font-size: 1.5rem;
    font-weight: bold;
}
.review-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
}
.back-to-edit-btn {
    background: #9e9e9e;
    color: white;
    border: none;
    padding: 15px 35px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.back-to-edit-btn:hover {
    background: #757575;
}
.finish-btn {
    background: linear-gradient(135deg, #66bb6a, #43a047);
    color: white;
    border: none;
    padding: 15px 35px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}
.finish-btn:hover {
    background: linear-gradient(135deg, #43a047, #2e7d32);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 187, 106, 0.4);
}
@media (max-width: 768px) {
    .dashboard-grid { grid-template-columns: 1fr; }
    .dashboard-header h1 { font-size: 1.8rem; }
    .header-actions { flex-direction: column; gap: 15px; }
    .progress-bar { width: 150px; }
    .modal-content { padding: 25px; margin: 20px auto; }
    .sentence-container { font-size: 1.2rem; }
    .button-container { flex-direction: column; }
    .save-btn, .model-btn { width: 100%; }
    .navigation-buttons { flex-direction: column; gap: 10px; }
    .nav-btn { width: 100%; }
    .comparison-container { grid-template-columns: 1fr; }
    .review-stats { flex-direction: column; gap: 15px; }
    .review-buttons { flex-direction: column; }
    .back-to-edit-btn, .finish-btn { width: 100%; }
    .complete-story-section { padding: 25px; }
    .story-text { font-size: 1rem; padding: 20px; }
    .story-actions { flex-direction: column; }
    .compare-btn, .print-btn, .copy-btn, .restart-btn { width: 100%; }
}
@media print {
    body { background: white; }
    .dashboard-header, .dashboard-grid, .reset-btn, .review-btn, .modal-overlay { display: none !important; }
    .complete-story-section { display: block !important; box-shadow: none; margin: 0; }
    .story-actions, .comparison-view { display: none; }
}`;

    downloadFile(`${safeTitle}_style.css`, cssContent, 'text/css');
}

function exportJSFile(safeTitle, storyData) {
    // Build cardData object with story data
    const cardDataObject = {};
    storyData.cards.forEach((card, index) => {
        cardDataObject[index + 1] = {
            sentence: card.sentence,
            modelAnswer: card.modelAnswer,
            hint: card.hints || '',
            image: card.image || `images/card${index + 1}.jpg`,
            imageAlt: card.imageAlt || `Card ${index + 1}`,
            details: card.details || ''
        };
    });

    const jsContent = `// ========================================
// CARD DATA (From Teacher Export)
// ========================================
const cardData = ${JSON.stringify(cardDataObject, null, 4)};

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
    
    document.getElementById('modalCardNumber').textContent = \`Card \${cardId} of \${totalCards}\`;
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
    const wordCount = text.trim() ? text.trim().split(/\\s+/).length : 0;
    document.getElementById('answerLength').textContent = \`\${wordCount} word\${wordCount !== 1 ? 's' : ''}\`;
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
        modelBox.innerHTML = \`📖 <strong>Model Answer:</strong><br>\${cardData[currentCardId].modelAnswer}\`;
    } else {
        modelBox.style.display = 'none';
    }
}

// ========================================
// DASHBOARD UPDATE
// ========================================
function updateDashboard() {
    for (let i = 1; i <= totalCards; i++) {
        const statusDiv = document.getElementById(\`status\${i}\`);
        const cardElement = document.querySelector(\`[data-card-id="\${i}"]\`);
        
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
    document.getElementById('progressFill').style.width = \`\${progress}%\`;
    document.getElementById('progressText').textContent = \`\${answeredCount}/\${totalCards} Completed\`;
}

function updateReviewButton() {
    const reviewBtn = document.getElementById('reviewBtn');
    const answeredCount = Object.keys(studentAnswers).length;
    
    if (answeredCount > 0) {
        reviewBtn.disabled = false;
        reviewBtn.textContent = \`📝 Review & Finish (\${answeredCount}/\${totalCards})\`;
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
            const wordCount = studentAnswer.trim().split(/\\s+/).length;
            totalWords += wordCount;
            
            const sentenceDiv = document.createElement('div');
            sentenceDiv.className = 'review-sentence-item';
            sentenceDiv.innerHTML = \`
                <div>
                    <span class="review-sentence-number">\${i}</span>
                    <strong>Your Answer:</strong>
                </div>
                <div class="review-sentence-text">\${studentAnswer}</div>
                <button class="review-edit-btn" onclick="editSentence(\${i})">✏️ Edit</button>
            \`;
            
            reviewSentences.appendChild(sentenceDiv);
        } else {
            const sentenceDiv = document.createElement('div');
            sentenceDiv.className = 'review-sentence-item';
            sentenceDiv.style.borderLeftColor = '#ff9800';
            sentenceDiv.style.opacity = '0.7';
            sentenceDiv.innerHTML = \`
                <div>
                    <span class="review-sentence-number">\${i}</span>
                    <strong>Not Answered Yet</strong>
                </div>
                <div class="review-sentence-text" style="color: #999;">[No answer provided]</div>
                <button class="review-edit-btn" onclick="editSentence(\${i})">✏️ Answer Now</button>
            \`;
            
            reviewSentences.appendChild(sentenceDiv);
        }
    }
    
    document.getElementById('reviewWordCount').textContent = totalWords;
    document.getElementById('reviewCompletedCount').textContent = \`\${completedCount}/\${totalCards}\`;
    
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
        const confirmFinish = confirm(\`⚠️ You've only answered \${answeredCount} out of \${totalCards} questions.\\n\\nYour story will only include the sentences you answered. Do you want to finish anyway?\`);
        
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
            
            const wordCount = studentAnswer.trim().split(/\\s+/).length;
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
    document.getElementById('sentenceCount').textContent = \`\${answeredCount}/\${totalCards}\`;
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
            
            yourVersionHTML += \`
                <div class="comparison-sentence">
                    <strong>Sentence \${i}:</strong>
                    \${studentAnswer}
                </div>
            \`;
            
            modelVersionHTML += \`
                <div class="comparison-sentence">
                    <strong>Sentence \${i}:</strong>
                    \${modelAnswer}
                </div>
            \`;
        }
    }
    
    if (!hasAnswers) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">📝 Answer some cards first to see the comparison!</p>';
        return;
    }
    
    container.innerHTML = \`
        <div class="comparison-column your-version">
            <h4>Your Version</h4>
            \${yourVersionHTML}
        </div>
        <div class="comparison-column model-version">
            <h4>Model Answer</h4>
            \${modelVersionHTML}
        </div>
    \`;
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
`;

    downloadFile(`${safeTitle}_script.js`, jsContent, 'application/javascript');
}

function exportAsJSON() {
    const storyData = {
        title: document.getElementById('storyTitle').value.trim() || 'Grammar Story',
        description: document.getElementById('storyDescription').value.trim(),
        wordCountType: document.getElementById('wordCountType').value,
        wordCountValue: parseInt(document.getElementById('wordCountValue').value) || 0,
        passingScore: parseInt(document.getElementById('passingScore').value) || 80,
        cards: []
    };
    
    const cardElements = document.querySelectorAll('.card-editor');
    cardElements.forEach((cardEl, index) => {
        storyData.cards.push({
            id: generateId(),
            number: index + 1,
            sentence: document.getElementById(`sentence-${cardEl.dataset.cardId}`).value.trim(),
            modelAnswer: document.getElementById(`modelAnswer-${cardEl.dataset.cardId}`).value.trim(),
            hints: document.getElementById(`hints-${cardEl.dataset.cardId}`).value.trim(),
            image: document.getElementById(`image-${cardEl.dataset.cardId}`).value.trim(),
            details: document.getElementById(`details-${cardEl.dataset.cardId}`).value.trim()
        });
    });
    
    const filename = `${storyData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.json`;
    downloadFile(filename, JSON.stringify(storyData, null, 2), 'application/json');
    
    showNotification('JSON data exported successfully!', 'success');
}

function generateShareableLink() {
    alert('🔗 Shareable Link Feature\n\nThis feature requires a server backend to host the stories.\n\nFor now, please use the HTML export option and upload the file to your school website or learning management system.');
}

// ========================================
// FILE DOWNLOAD UTILITY
// ========================================
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ========================================
// UTILITIES
// ========================================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
document.getElementById('loadModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeLoadModal();
});

document.getElementById('exportModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeExportModal();
});

document.getElementById('previewModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closePreviewModal();
});