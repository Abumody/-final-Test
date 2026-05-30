// ========================================
// TEACHER DASHBOARD - COMPLETE WORKING VERSION
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
    
    document.getElementById('storyTitle').value = 'New Story';
    document.getElementById('storyDescription').value = '';
    document.getElementById('wordCountType').value = 'none';
    document.getElementById('wordCountValue').value = '';
    document.getElementById('passingScore').value = '80';
    document.getElementById('totalCards').value = '6';
    
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
    currentStory.title = document.getElementById('storyTitle').value.trim();
    currentStory.description = document.getElementById('storyDescription').value.trim();
    currentStory.wordCountType = document.getElementById('wordCountType').value;
    currentStory.wordCountValue = parseInt(document.getElementById('wordCountValue').value) || 0;
    currentStory.passingScore = parseInt(document.getElementById('passingScore').value) || 80;
    
    currentStory.cards = [];
    const cardElements = document.querySelectorAll('.card-editor');
    cardElements.forEach((cardEl, index) => {
        const uploadedImage = document.getElementById(`imageData-${cardEl.dataset.cardId}`)?.value || '';
        const imageUrl = document.getElementById(`image-${cardEl.dataset.cardId}`)?.value.trim() || '';
        const finalImage = uploadedImage || imageUrl || '';
        
        currentStory.cards.push({
            id: cardEl.dataset.cardId || generateId(),
            number: index + 1,
            sentence: document.getElementById(`sentence-${cardEl.dataset.cardId}`)?.value.trim() || '',
            modelAnswer: document.getElementById(`modelAnswer-${cardEl.dataset.cardId}`)?.value.trim() || '',
            hints: document.getElementById(`hints-${cardEl.dataset.cardId}`)?.value.trim() || '',
            image: finalImage,
            details: document.getElementById(`details-${cardEl.dataset.cardId}`)?.value.trim() || ''
        });
    });
    
    if (!currentStory.title) {
        showNotification('Please enter a story title!', 'error');
        return;
    }
    
    if (currentStory.cards.length === 0) {
        showNotification('Please add at least one card!', 'error');
        return;
    }
    
    if (!currentStory.id) {
        currentStory.id = generateId();
    }
    
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
    if (!loadList) return;
    loadList.innerHTML = '';
    
    if (savedStories.length === 0) {
        loadList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No saved stories yet.</p>';
    } else {
        savedStories.forEach(story => {
            const storyDiv = document.createElement('div');
            storyDiv.className = 'story-item';
            storyDiv.innerHTML = `
                <div class="story-info">
                    <h3>${escapeHtml(story.title)}</h3>
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
    
    const modal = document.getElementById('loadModalOverlay');
    if (modal) modal.classList.add('active');
}

function closeLoadModal() {
    const modal = document.getElementById('loadModalOverlay');
    if (modal) modal.classList.remove('active');
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
    if (!list) return;
    list.innerHTML = '';
    
    if (savedStories.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No saved stories yet. Create your first story!</p>';
    } else {
        savedStories.forEach(story => {
            const storyDiv = document.createElement('div');
            storyDiv.className = 'story-item';
            storyDiv.innerHTML = `
                <div class="story-info">
                    <h3>${escapeHtml(story.title)}</h3>
                    <p>${story.cards.length} cards | ${story.description || 'No description'}</p>
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
// IMAGE PREVIEW WITH COMPRESSION
// ========================================
function previewImage(input, cardId) {
    const file = input.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image too large! Max 5MB before compression.', 'error');
        input.value = '';
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file!', 'error');
        input.value = '';
        return;
    }
    
    showNotification('Compressing image... please wait', 'info');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const compressedDataUrl = compressImage(img, 800, 0.7);
            
            const previewDiv = document.getElementById(`imagePreview-${cardId}`);
            if (previewDiv) {
                previewDiv.innerHTML = `
                    <div class="image-preview">
                        <img src="${compressedDataUrl}" alt="Preview">
                        <br>
                        <button class="btn-clear-image" onclick="clearImage('${cardId}')">🗑️ Remove Image</button>
                    </div>
                `;
            }
            const imageDataInput = document.getElementById(`imageData-${cardId}`);
            if (imageDataInput) imageDataInput.value = compressedDataUrl;
            
            const imageUrlInput = document.getElementById(`image-${cardId}`);
            if (imageUrlInput) imageUrlInput.value = '';
            
            showNotification('Image compressed and added!', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function compressImage(img, maxWidth, quality) {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', quality);
}

function clearImage(cardId) {
    const previewDiv = document.getElementById(`imagePreview-${cardId}`);
    if (previewDiv) {
        previewDiv.innerHTML = '<div class="image-preview-empty">No image selected</div>';
    }
    const imageDataInput = document.getElementById(`imageData-${cardId}`);
    if (imageDataInput) imageDataInput.value = '';
    
    const imageUrlInput = document.getElementById(`image-${cardId}`);
    if (imageUrlInput) imageUrlInput.value = '';
    
    const fileInput = document.getElementById(`imageFile-${cardId}`);
    if (fileInput) fileInput.value = '';
    
    showNotification('Image removed', 'info');
}

// ========================================
// CARDS EDITOR
// ========================================
function renderCardsEditor() {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    currentStory.cards.forEach((card, index) => {
        const imageValue = card.image || '';
        const isBase64 = imageValue.startsWith('data:image');
        const hasImage = imageValue && imageValue.length > 0;
        
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
            
            ${hasImage ? `<div style="margin-bottom: 15px; text-align: center;">
                <img src="${escapeHtml(imageValue)}" style="max-width: 100px; max-height: 80px; border-radius: 8px; border: 2px solid #667eea;">
            </div>` : ''}
            
            <div class="editor-field">
                <label>Sentence with Mistakes:</label>
                <textarea id="sentence-${card.id}" placeholder="e.g., One day Sarah and her family want to see for holiday.">${escapeHtml(card.sentence)}</textarea>
            </div>
            
            <div class="editor-field">
                <label>Model Answer (Correct Version):</label>
                <textarea id="modelAnswer-${card.id}" placeholder="e.g., One day Sarah and her family went on holiday.">${escapeHtml(card.modelAnswer)}</textarea>
            </div>
            
            <div class="editor-field">
                <label>Hints (Optional):</label>
                <input type="text" id="hints-${card.id}" placeholder="e.g., Think about past tense..." value="${escapeHtml(card.hints)}">
            </div>
            
            <div class="editor-field">
                <label>🖼️ Upload Image (Optional):</label>
                <input type="file" id="imageFile-${card.id}" accept="image/*" onchange="previewImage(this, '${card.id}')">
                <div id="imagePreview-${card.id}" style="margin-top: 10px;">
                    ${hasImage ? `<div class="image-preview"><img src="${escapeHtml(imageValue)}" style="max-width: 100%; max-height: 150px; border-radius: 8px;"><br><button class="btn-clear-image" onclick="clearImage('${card.id}')">🗑️ Remove Image</button></div>` : '<div class="image-preview-empty">No image selected</div>'}
                </div>
                <input type="hidden" id="imageData-${card.id}" value="${escapeHtml(imageValue)}">
            </div>
            
            <div class="editor-field">
                <label>Image URL (Optional - external link):</label>
                <input type="text" id="image-${card.id}" placeholder="e.g., https://example.com/pic.jpg" value="${escapeHtml(isBase64 ? '' : imageValue)}">
            </div>
            
            <div class="editor-field">
                <label>Grammar Details/Explanation (Optional):</label>
                <textarea id="details-${card.id}" placeholder="Detailed grammar explanation for students..." style="min-height: 100px;">${escapeHtml(card.details)}</textarea>
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
    // Save current data first
    saveStory();
    
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) return;
    
    previewContent.innerHTML = `
        <h3 style="text-align: center; color: #667eea; margin-bottom: 20px;">${escapeHtml(currentStory.title || 'Untitled Story')}</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <strong>Total Cards:</strong> ${currentStory.cards.length}<br>
            <strong>Word Count Requirement:</strong> ${currentStory.wordCountType === 'none' ? 'None' : `${currentStory.wordCountType} ${currentStory.wordCountValue} words`}
        </div>
        <div style="border-top: 2px solid #ddd; padding-top: 20px;">
            ${currentStory.cards.map((card, i) => `
                <div style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <strong>Card ${i + 1}:</strong><br>
                    ${card.image ? `<div style="margin: 10px 0;"><img src="${card.image}" style="max-width: 100%; max-height: 150px; border-radius: 8px;"></div>` : ''}
                    <em>Sentence:</em> ${escapeHtml(card.sentence) || '<span style="color: #999;">Not set</span>'}<br>
                    <em>Model Answer:</em> ${escapeHtml(card.modelAnswer) || '<span style="color: #999;">Not set</span>'}
                </div>
            `).join('')}
        </div>
    `;
    
    const modal = document.getElementById('previewModalOverlay');
    if (modal) modal.classList.add('active');
}

function closePreviewModal() {
    const modal = document.getElementById('previewModalOverlay');
    if (modal) modal.classList.remove('active');
}

// ========================================
// EXPORT FUNCTIONS
// ========================================
function openExportModal() {
    const modal = document.getElementById('exportModalOverlay');
    if (modal) modal.classList.add('active');
}

function closeExportModal() {
    const modal = document.getElementById('exportModalOverlay');
    if (modal) modal.classList.remove('active');
}

function confirmExport() {
    const exportType = document.querySelector('input[name="exportType"]:checked');
    
    if (!exportType) {
        showNotification('Please select an export option!', 'error');
        return;
    }
    
    saveStory();
    
    if (exportType.value === 'html') {
        exportAsHTML();
    } else if (exportType.value === 'json') {
        exportAsJSON();
    } else if (exportType.value === 'link') {
        generateShareableLink();
    }
    
    closeExportModal();
}

function exportAsHTML() {
    const storyData = {
        title: currentStory.title,
        description: currentStory.description,
        wordCountType: currentStory.wordCountType,
        wordCountValue: currentStory.wordCountValue,
        passingScore: currentStory.passingScore,
        cards: currentStory.cards
    };
    
    const safeTitle = storyData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fullHTML = generateFullHTML(storyData);
    downloadFile(`${safeTitle}_student.html`, fullHTML, 'text/html');
    showNotification('HTML file exported with images!', 'success');
}

function generateFullHTML(storyData) {
    const cardDataObject = {};
    storyData.cards.forEach((card, index) => {
        cardDataObject[index + 1] = {
            sentence: card.sentence,
            modelAnswer: card.modelAnswer,
            hint: card.hints || '',
            image: card.image || '',
            imageAlt: `Card ${index + 1}`,
            details: card.details || ''
        };
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(storyData.title)} - Grammar Challenge</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .dashboard-header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            padding: 30px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        .dashboard-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .subtitle { font-size: 1.1rem; opacity: 0.9; margin-bottom: 20px; }
        .header-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        .progress-container { display: flex; align-items: center; gap: 15px; }
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
        }
        .reset-btn, .review-btn {
            background: rgba(255,82,82,0.9);
            color: white;
            border: 2px solid white;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        .review-btn { background: linear-gradient(135deg, #66bb6a, #43a047); }
        .review-btn:disabled { background: #bdbdbd; cursor: not-allowed; opacity: 0.6; }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
        }
        .dashboard-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }
        .dashboard-card:hover { transform: translateY(-8px); }
        .dashboard-card.completed { border: 3px solid #66bb6a; }
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
        .dashboard-card.completed .card-number { background: #66bb6a; }
        .card-icon { font-size: 3rem; margin-bottom: 15px; }
        .card-preview-text {
            font-size: 1rem;
            color: #333;
            line-height: 1.6;
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .card-status { padding: 10px; border-radius: 8px; font-weight: 600; }
        .status-pending { color: #ff9800; background: #fff3e0; }
        .status-completed { color: #66bb6a; background: #e8f5e9; }
        .complete-story-section {
            display: none;
            max-width: 1000px;
            margin: 50px auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .complete-story-section.visible { display: block; }
        .story-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }
        .story-header h2 { color: #764ba2; font-size: 2rem; }
        .story-text {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 12px;
            border-left: 5px solid #66bb6a;
            font-size: 1.2rem;
            line-height: 2;
            margin-bottom: 30px;
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
        }
        .stat-value { font-size: 1.8rem; font-weight: bold; }
        .story-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .compare-btn, .print-btn, .copy-btn, .restart-btn {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        .compare-btn { background: #2196f3; color: white; }
        .print-btn, .copy-btn { background: #667eea; color: white; }
        .restart-btn { background: #ff5252; color: white; }
        .comparison-view { margin-top: 40px; padding: 30px; background: #f5f5f5; border-radius: 12px; }
        .comparison-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .comparison-column { background: white; padding: 20px; border-radius: 8px; }
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
        .modal-overlay.active { display: flex; justify-content: center; align-items: flex-start; }
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 900px;
            width: 100%;
            margin: 40px auto;
            position: relative;
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
        }
        .student-answer-input {
            width: 100%;
            padding: 15px;
            font-size: 1.2rem;
            border: 2px solid #ddd;
            border-radius: 10px;
            margin: 10px 0;
        }
        .save-btn, .model-btn, .nav-btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin: 5px;
        }
        .save-btn { background: #4caf50; color: white; }
        .model-btn { background: #2196f3; color: white; }
        .nav-btn { background: #764ba2; color: white; }
        @media (max-width: 768px) {
            .dashboard-grid { grid-template-columns: 1fr; }
            .comparison-container { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
<div class="container">
    <header class="dashboard-header">
        <h1>📚 ${escapeHtml(storyData.title)}</h1>
        <p class="subtitle">Click on any card to correct the grammar mistakes</p>
        <div class="header-actions">
            <div class="progress-container">
                <span>Progress: </span>
                <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
                <span id="progressText">0/${storyData.cards.length} Completed</span>
            </div>
            <button class="reset-btn" onclick="confirmReset()">🔄 Reset Progress</button>
            <button class="review-btn" id="reviewBtn" onclick="openReviewModal()" disabled>📝 Review & Finish</button>
        </div>
    </header>

    <main class="dashboard-grid">
        ${storyData.cards.map((card, index) => `
        <div class="dashboard-card" data-card-id="${index + 1}" onclick="openCard(${index + 1})">
            <div class="card-preview">
                <div class="card-number">${index + 1}</div>
                <div class="card-icon">📝</div>
                ${card.image && card.image.trim() !== '' ? `
                <div style="margin: 10px 0; text-align: center;">
                    <img src="${escapeHtml(card.image)}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 10px; border: 2px solid #667eea;">
                </div>
                ` : ''}
                <p class="card-preview-text">${escapeHtml(card.sentence)}</p>
                <div class="card-status" id="status${index + 1}">
                    <span class="status-pending">⏳ Not Started</span>
                </div>
            </div>
        </div>
        `).join('')}
    </main>

    <section class="complete-story-section" id="completeStorySection">
        <div class="story-header">
            <h2>🎉 Your Complete Story</h2>
            <p class="story-subtitle">Great job! Here's the story with your corrections:</p>
        </div>
        <div class="story-content">
            <div class="story-text" id="fullStoryText"></div>
            <div class="story-stats">
                <div class="stat-box"><span class="stat-icon">📝</span><span class="stat-label">Total Words</span><span class="stat-value" id="wordCount">0</span></div>
                <div class="stat-box"><span class="stat-icon">📄</span><span class="stat-label">Sentences</span><span class="stat-value" id="sentenceCount">0</span></div>
                <div class="stat-box"><span class="stat-icon">✅</span><span class="stat-label">Completed</span><span class="stat-value" id="completionDate">-</span></div>
            </div>
            <div class="story-actions">
                <button class="compare-btn" onclick="toggleCompareView()">🔍 Compare with Model Answer</button>
                <button class="print-btn" onclick="printStory()">🖨️ Print Story</button>
                <button class="copy-btn" onclick="copyStory()">📋 Copy to Clipboard</button>
                <button class="restart-btn" onclick="confirmReset()">🔄 Start Over</button>
            </div>
            <div class="comparison-view" id="comparisonView" style="display: none;">
                <h3>Side-by-Side Comparison</h3>
                <div class="comparison-container" id="comparisonContainer"></div>
            </div>
        </div>
    </section>

    <!-- Modals -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content">
            <button class="close-modal" onclick="closeModal()">✕</button>
            <div class="modal-card-number" id="modalCardNumber">Card 1</div>
            <div class="story-image" id="modalImage" style="text-align:center;"><img id="modalImageSrc" src="" style="max-width:100%; max-height:300px; border-radius:12px;"></div>
            <div class="sentence-container" id="modalSentence" style="padding:20px; background:#f8f9fa; border-radius:12px; margin:20px 0;"></div>
            <div class="student-answer-section">
                <input type="text" id="studentAnswer" class="student-answer-input" placeholder="Write the corrected sentence here...">
                <div class="answer-length" id="answerLength">0 words</div>
            </div>
            <div class="button-container">
                <button class="save-btn" onclick="saveAnswer()">💾 Save Answer</button>
                <button class="model-btn" onclick="toggleModelAnswer()">📖 Show Model Answer</button>
            </div>
            <div class="feedback-message" id="feedbackMessage"></div>
            <div class="model-answer-box" id="modelAnswerBox" style="display:none; padding:20px; background:#e8f5e9; border-radius:12px; margin-top:20px;"></div>
            <div class="navigation-buttons">
                <button class="nav-btn" id="prevBtn" onclick="navigateCard(-1)">← Previous</button>
                <button class="nav-btn" id="nextBtn" onclick="navigateCard(1)">Next →</button>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="reviewModalOverlay">
        <div class="modal-content review-modal-content">
            <button class="close-modal" onclick="closeReviewModal()">✕</button>
            <h2>📝 Review Your Story</h2>
            <div class="review-sentences" id="reviewSentences"></div>
            <div class="review-buttons" style="display:flex; gap:15px; justify-content:center; margin-top:20px;">
                <button class="back-to-edit-btn" onclick="closeReviewModal()">✏️ Back to Editing</button>
                <button class="finish-btn" onclick="finishStory()">✅ Finish & View Story</button>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="resetModalOverlay">
        <div class="modal-content reset-modal-content">
            <h2>⚠️ Reset Progress?</h2>
            <p>This will clear all your completed cards and answers.</p>
            <div class="reset-buttons" style="display:flex; gap:15px; justify-content:center; margin-top:20px;">
                <button class="cancel-reset-btn" onclick="closeResetModal()">Cancel</button>
                <button class="confirm-reset-btn" onclick="resetProgress()">Yes, Reset</button>
            </div>
        </div>
    </div>
</div>

<script>
    const cardData = ${JSON.stringify(cardDataObject)};
    let currentCardId = 1;
    let studentAnswers = {};
    let storyFinished = false;
    const totalCards = Object.keys(cardData).length;

    document.addEventListener('DOMContentLoaded', function() { loadProgress(); updateDashboard(); checkCompleteStoryVisibility(); updateReviewButton(); });

    function openCard(cardId) {
        currentCardId = cardId;
        const card = cardData[cardId];
        document.getElementById('modalCardNumber').innerHTML = 'Card ' + cardId + ' of ' + totalCards;
        document.getElementById('modalSentence').innerHTML = card.sentence;
        document.getElementById('studentAnswer').value = studentAnswers[cardId] || '';
        updateAnswerLength(document.getElementById('studentAnswer').value);
        const modalImg = document.getElementById('modalImageSrc');
        if (card.image && card.image.trim() !== '') {
            modalImg.src = card.image;
            modalImg.style.display = 'block';
        } else {
            modalImg.style.display = 'none';
        }
        document.getElementById('prevBtn').disabled = cardId === 1;
        document.getElementById('nextBtn').disabled = cardId === totalCards;
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() { saveCurrentAnswer(); document.getElementById('modalOverlay').classList.remove('active'); document.body.style.overflow = 'auto'; updateDashboard(); saveProgress(); checkCompleteStoryVisibility(); updateReviewButton(); }
    function saveCurrentAnswer() { const answer = document.getElementById('studentAnswer').value.trim(); if(answer) studentAnswers[currentCardId] = answer; }
    function updateAnswerLength(text) { const count = text.trim() ? text.trim().split(/\\s+/).length : 0; document.getElementById('answerLength').innerHTML = count + ' word' + (count !== 1 ? 's' : ''); }
    document.getElementById('studentAnswer').addEventListener('input', function(e) { updateAnswerLength(e.target.value); });
    function navigateCard(direction) { saveCurrentAnswer(); const newId = currentCardId + direction; if(newId >= 1 && newId <= totalCards) { closeModal(); setTimeout(() => openCard(newId), 300); } }
    function saveAnswer() { const answer = document.getElementById('studentAnswer').value.trim(); if(!answer) { showFeedback('⚠️ Please write your answer first!'); return; } studentAnswers[currentCardId] = answer; showFeedback('✅ Answer Saved!'); saveProgress(); updateDashboard(); updateReviewButton(); }
    function showFeedback(msg) { const fb = document.getElementById('feedbackMessage'); fb.innerHTML = msg; fb.style.display = 'block'; fb.className = 'feedback-message'; setTimeout(() => fb.style.display = 'none', 3000); }
    function toggleModelAnswer() { const box = document.getElementById('modelAnswerBox'); if(box.style.display === 'none') { box.style.display = 'block'; box.innerHTML = '📖 <strong>Model Answer:</strong><br>' + cardData[currentCardId].modelAnswer; } else box.style.display = 'none'; }
    function updateDashboard() { for(let i=1; i<=totalCards; i++) { const status = document.getElementById('status' + i); const card = document.querySelector('[data-card-id="' + i + '"]'); if(studentAnswers[i]) { status.innerHTML = '<span class=\"status-completed\">✅ Completed</span>'; card.classList.add('completed'); } else { status.innerHTML = '<span class=\"status-pending\">⏳ Not Started</span>'; card.classList.remove('completed'); } } const answered = Object.keys(studentAnswers).length; document.getElementById('progressFill').style.width = (answered/totalCards)*100 + '%'; document.getElementById('progressText').innerHTML = answered + '/' + totalCards + ' Completed'; }
    function updateReviewButton() { const btn = document.getElementById('reviewBtn'); const answered = Object.keys(studentAnswers).length; btn.disabled = answered === 0; if(answered > 0) btn.innerHTML = '📝 Review & Finish (' + answered + '/' + totalCards + ')'; }
    function openReviewModal() { const container = document.getElementById('reviewSentences'); container.innerHTML = ''; let totalWords = 0, completed = 0; for(let i=1; i<=totalCards; i++) { const ans = studentAnswers[i]; if(ans) { completed++; totalWords += ans.trim().split(/\\s+/).length; container.innerHTML += '<div class=\"review-sentence-item\"><strong>Card ' + i + ':</strong><div>' + ans + '</div><button onclick=\"editSentence(' + i + ')\">✏️ Edit</button></div>'; } else { container.innerHTML += '<div class=\"review-sentence-item\"><strong>Card ' + i + ':</strong><div style=\"color:#999\">[No answer]</div><button onclick=\"editSentence(' + i + ')\">✏️ Answer Now</button></div>'; } } document.getElementById('reviewModalOverlay').classList.add('active'); }
    function closeReviewModal() { document.getElementById('reviewModalOverlay').classList.remove('active'); }
    function editSentence(cardId) { closeReviewModal(); setTimeout(() => openCard(cardId), 300); }
    function finishStory() { storyFinished = true; saveProgress(); closeReviewModal(); generateStudentStory(); checkCompleteStoryVisibility(); setTimeout(() => document.getElementById('completeStorySection').scrollIntoView({ behavior: 'smooth' }), 500); }
    function checkCompleteStoryVisibility() { const section = document.getElementById('completeStorySection'); if(storyFinished && Object.keys(studentAnswers).length > 0) { section.classList.add('visible'); generateStudentStory(); } else section.classList.remove('visible'); }
    function generateStudentStory() { let story = '', totalWords = 0, answered = 0; for(let i=1; i<=totalCards; i++) { if(studentAnswers[i]) { story += studentAnswers[i] + ' '; totalWords += studentAnswers[i].trim().split(/\\s+/).length; answered++; } } if(answered === 0) { document.getElementById('fullStoryText').innerHTML = '📝 Start answering the cards to build your story!'; document.getElementById('wordCount').innerHTML = '0'; document.getElementById('sentenceCount').innerHTML = '0'; return; } document.getElementById('fullStoryText').innerHTML = story.trim(); document.getElementById('wordCount').innerHTML = totalWords; document.getElementById('sentenceCount').innerHTML = answered + '/' + totalCards; document.getElementById('completionDate').innerHTML = new Date().toLocaleDateString(); updateComparisonView(); }
    function updateComparisonView() { let yourHTML = '', modelHTML = '', has = false; for(let i=1; i<=totalCards; i++) { if(studentAnswers[i]) { has = true; yourHTML += '<div><strong>Sentence ' + i + ':</strong> ' + studentAnswers[i] + '</div>'; modelHTML += '<div><strong>Sentence ' + i + ':</strong> ' + cardData[i].modelAnswer + '</div>'; } } const container = document.getElementById('comparisonContainer'); if(!has) { container.innerHTML = '<p>Answer some cards first!</p>'; return; } container.innerHTML = '<div class=\"comparison-column\"><h4>Your Version</h4>' + yourHTML + '</div><div class=\"comparison-column\"><h4>Model Answer</h4>' + modelHTML + '</div>'; }
    function toggleCompareView() { const v = document.getElementById('comparisonView'); if(v.style.display === 'none') { v.style.display = 'block'; updateComparisonView(); } else v.style.display = 'none'; }
    function printStory() { window.print(); }
    function copyStory() { navigator.clipboard.writeText(document.getElementById('fullStoryText').innerText).then(() => alert('✅ Copied!')); }
    function confirmReset() { document.getElementById('resetModalOverlay').classList.add('active'); }
    function closeResetModal() { document.getElementById('resetModalOverlay').classList.remove('active'); }
    function resetProgress() { studentAnswers = {}; storyFinished = false; localStorage.removeItem('grammarStoryAnswers'); localStorage.removeItem('grammarStoryFinished'); updateDashboard(); checkCompleteStoryVisibility(); updateReviewButton(); closeResetModal(); alert('Progress reset!'); }
    function saveProgress() { localStorage.setItem('grammarStoryAnswers', JSON.stringify(studentAnswers)); localStorage.setItem('grammarStoryFinished', storyFinished.toString()); }
    function loadProgress() { const saved = localStorage.getItem('grammarStoryAnswers'); if(saved) studentAnswers = JSON.parse(saved); const finished = localStorage.getItem('grammarStoryFinished'); if(finished) storyFinished = finished === 'true'; }
    document.getElementById('modalOverlay').addEventListener('click', function(e) { if(e.target === this) closeModal(); });
    document.getElementById('reviewModalOverlay').addEventListener('click', function(e) { if(e.target === this) closeReviewModal(); });
    document.getElementById('resetModalOverlay').addEventListener('click', function(e) { if(e.target === this) closeResetModal(); });
</script>
</body>
</html>`;
}

function exportAsJSON() {
    const storyData = {
        title: currentStory.title,
        description: currentStory.description,
        wordCountType: currentStory.wordCountType,
        wordCountValue: currentStory.wordCountValue,
        passingScore: currentStory.passingScore,
        cards: currentStory.cards
    };
    
    const filename = `${storyData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.json`;
    downloadFile(filename, JSON.stringify(storyData, null, 2), 'application/json');
    showNotification('JSON data exported!', 'success');
}

function generateShareableLink() {
    alert('🔗 Shareable Link Feature\n\nThis requires a server backend. Use HTML export for now.');
}

// ========================================
// UTILITIES
// ========================================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:15px 25px;border-radius:8px;color:white;font-weight:600;z-index:2000;animation:slideIn 0.3s ease;';
    notification.style.background = type === 'success' ? '#4caf50' : (type === 'error' ? '#ff5252' : '#2196f3');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

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

// Close modals when clicking outside
document.getElementById('loadModalOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeLoadModal();
});

document.getElementById('exportModalOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeExportModal();
});

document.getElementById('previewModalOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closePreviewModal();
});