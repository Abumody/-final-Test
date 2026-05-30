document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const els = {
    testTitle: document.getElementById('testTitle'),
    gradeSem: document.getElementById('gradeSem'),
    totalScore: document.getElementById('totalScore'),
    qCount: document.getElementById('qCount'),
    optionsCount: document.getElementById('optionsCount'),
    bgColor: document.getElementById('bgColor'),
    headerColor: document.getElementById('headerColor'),
    cardBgColor: document.getElementById('cardBgColor'),
    syncBtn: document.getElementById('syncBlanksBtn'),
    sentencesContainer: document.getElementById('sentencesContainer'),
    generateBtn: document.getElementById('generateBtn'),
    previewBtn: document.getElementById('previewBtn'),
    previewSection: document.getElementById('previewSection'),
    previewFrame: document.getElementById('previewFrame'),
    refreshPreviewBtn: document.getElementById('refreshPreviewBtn'),
    newBtn: document.getElementById('newBtn'),
    saveBtn: document.getElementById('saveBtn'),
    loadBtn: document.getElementById('loadBtn'),
    editBtn: document.getElementById('editBtn'),
    loadModal: document.getElementById('loadModal'),
    closeLoadModal: document.getElementById('closeLoadModal'),
    savedExamsList: document.getElementById('savedExamsList')
  };

  let currentExamId = null;
  let isEditMode = false;
  let previewHTML = null;

  // Update total score
  function updateTotalScore() {
    const qCount = parseInt(els.qCount.value) || 0;
    els.totalScore.value = qCount;
    return qCount;
  }

  els.qCount.addEventListener('input', updateTotalScore);
  updateTotalScore();

  // Get all blanks from all sentences
  function getAllBlanksFromSentences() {
    const allBlanks = [];
    const sentenceCount = parseInt(els.qCount.value) || 0;
    
    for (let s = 1; s <= sentenceCount; s++) {
      const sentenceInput = document.querySelector(`.sentence-text[data-sentence="${s}"]`);
      if (sentenceInput) {
        const text = sentenceInput.value;
        const matches = text.match(/\((\d+)\)/g) || [];
        matches.forEach(m => {
          const blankNum = parseInt(m.replace(/[()]/g, ''));
          if (!allBlanks.includes(blankNum)) {
            allBlanks.push(blankNum);
          }
        });
      }
    }
    return allBlanks.sort((a, b) => a - b);
  }

  // Create complete UI with sentences and their blanks below
  function createFullUI() {
    const sentenceCount = parseInt(els.qCount.value) || 0;
    const optionsPerBlank = parseInt(els.optionsCount.value) || 4;
    
    els.sentencesContainer.innerHTML = '';
    
    for (let s = 1; s <= sentenceCount; s++) {
      const sentenceDiv = document.createElement('div');
      sentenceDiv.className = 'sentence-container';
      sentenceDiv.style.cssText = 'margin-bottom: 2rem; border-bottom: 2px dashed var(--border); padding-bottom: 1rem;';
      
      sentenceDiv.innerHTML = `
        <div class="sentence-display" style="background: #f1f5f9; padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem;">
          <label class="sentence-label" style="font-weight: bold; color: var(--primary); margin-bottom: 0.5rem; display: block;">📖 Sentence ${s}</label>
          <input type="text" class="sentence-text" data-sentence="${s}" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border); border-radius: var(--radius); font-size: 1rem;" placeholder="Example: This is a (1) sentence with a (2) blank.">
        </div>
      `;
      
      els.sentencesContainer.appendChild(sentenceDiv);
    }
    
    // Add event listeners to sentence inputs
    document.querySelectorAll('.sentence-text').forEach(input => {
      input.removeEventListener('input', onSentenceInput);
      input.addEventListener('input', onSentenceInput);
      input.addEventListener('input', debouncedValidate);
    });
    
    validateForm();
  }

  // Handle sentence input to dynamically add blank sections
  function onSentenceInput(event) {
    const sentenceNum = event.target.dataset.sentence;
    const sentenceText = event.target.value;
    const matches = sentenceText.match(/\((\d+)\)/g) || [];
    const blanksInSentence = matches.map(m => parseInt(m.replace(/[()]/g, '')));
    
    const sentenceDiv = event.target.closest('.sentence-container');
    if (!sentenceDiv) return;
    
    // Remove existing blank sections
    const existingBlanks = sentenceDiv.querySelectorAll('.blank-section');
    existingBlanks.forEach(blank => blank.remove());
    
    // Add new blank sections
    if (blanksInSentence.length > 0) {
      const optionsPerBlank = parseInt(els.optionsCount.value) || 4;
      
      blanksInSentence.forEach(blankNum => {
        const blankDiv = document.createElement('div');
        blankDiv.className = 'blank-section';
        blankDiv.style.cssText = 'background: #f8fafc; border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem; border: 1px solid var(--border);';
        blankDiv.dataset.blankNum = blankNum;
        
        // Check for existing values
        let savedOptions = '';
        let savedCorrect = '';
        const existingOptions = document.querySelector(`.q-options[data-blank="${blankNum}"]`);
        const existingCorrect = document.querySelector(`.q-correct[data-blank="${blankNum}"]`);
        if (existingOptions) savedOptions = existingOptions.value;
        if (existingCorrect) savedCorrect = existingCorrect.value;
        
        if (!savedOptions) {
          const defaultOptions = [];
          for (let opt = 1; opt <= optionsPerBlank; opt++) {
            defaultOptions.push(`option${blankNum}${String.fromCharCode(96 + opt)}`);
          }
          savedOptions = defaultOptions.join(', ');
          savedCorrect = defaultOptions[0];
        }
        
        blankDiv.innerHTML = `
          <div class="blank-header" style="background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: var(--radius); margin-bottom: 1rem; font-weight: bold;">▼ Options for Blank (${blankNum})</div>
          <div class="blank-options-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <label style="display: flex; flex-direction: column; gap: 0.3rem; font-weight: 500;">📋 Dropdown Options (comma separated)
              <input type="text" class="q-options" data-blank="${blankNum}" placeholder="e.g., option1, option2, option3" value="${escapeHtml(savedOptions)}" style="width: 100%; padding: 0.6rem; border: 2px solid var(--border); border-radius: var(--radius); margin-top: 0.3rem;">
            </label>
            <label style="display: flex; flex-direction: column; gap: 0.3rem; font-weight: 500;">✓ Correct Answer
              <input type="text" class="q-correct" data-blank="${blankNum}" placeholder="e.g., option1" value="${escapeHtml(savedCorrect)}" style="width: 100%; padding: 0.6rem; border: 2px solid var(--border); border-radius: var(--radius); margin-top: 0.3rem;">
            </label>
          </div>
        `;
        sentenceDiv.appendChild(blankDiv);
      });
    } else {
      const noBlankDiv = document.createElement('div');
      noBlankDiv.className = 'blank-section';
      noBlankDiv.style.cssText = 'background: #fef3c7; border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem; border: 1px solid #f59e0b;';
      noBlankDiv.innerHTML = `
        <div class="blank-header" style="background: #f59e0b; color: white; padding: 0.5rem 1rem; border-radius: var(--radius); margin-bottom: 0.5rem; font-weight: bold;">⚠️ No blanks detected</div>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">Use (1), (2), etc. in the sentence above to create blanks.</p>
      `;
      sentenceDiv.appendChild(noBlankDiv);
    }
    
    // Add event listeners to new inputs
    document.querySelectorAll('.q-options, .q-correct').forEach(input => {
      input.removeEventListener('input', debouncedValidate);
      input.addEventListener('input', debouncedValidate);
    });
    
    validateForm();
  }

  // Sync everything
  function syncEverything() {
    const existingSentences = {};
    document.querySelectorAll('.sentence-text').forEach(input => {
      const num = input.dataset.sentence;
      if (num) existingSentences[num] = input.value;
    });
    
    createFullUI();
    
    setTimeout(() => {
      Object.keys(existingSentences).forEach(num => {
        const input = document.querySelector(`.sentence-text[data-sentence="${num}"]`);
        if (input) {
          input.value = existingSentences[num];
          input.dispatchEvent(new Event('input'));
        }
      });
    }, 100);
  }

  // Debounce validation
  let validateTimeout;
  function debouncedValidate() {
    clearTimeout(validateTimeout);
    validateTimeout = setTimeout(validateForm, 150);
  }

  // Validate form
  function validateForm() {
    const title = els.testTitle.value.trim();
    const grade = els.gradeSem.value.trim();
    const score = els.totalScore.value;
    const sentenceCount = parseInt(els.qCount.value) || 0;
    
    let sentencesValid = true;
    for (let s = 1; s <= sentenceCount; s++) {
      const sentenceInput = document.querySelector(`.sentence-text[data-sentence="${s}"]`);
      if (!sentenceInput || !sentenceInput.value.trim()) {
        sentencesValid = false;
        break;
      }
    }
    
    let blanksValid = true;
    const optionsInputs = document.querySelectorAll('.q-options');
    const correctInputs = document.querySelectorAll('.q-correct');
    
    if (optionsInputs.length === 0 && sentenceCount > 0) {
      blanksValid = false;
    }
    
    optionsInputs.forEach(input => {
      if (!input.value.trim()) blanksValid = false;
    });
    correctInputs.forEach(input => {
      if (!input.value.trim()) blanksValid = false;
    });
    
    const allValid = title && grade && score && sentenceCount > 0 && sentencesValid && blanksValid;
    
    els.generateBtn.disabled = !allValid;
    els.previewBtn.disabled = !allValid;
    els.saveBtn.disabled = !allValid;
    
    return allValid;
  }

  // Collect exam data
  function collectExamData() {
    const title = els.testTitle.value.trim();
    const grade = els.gradeSem.value.trim();
    const totalScore = els.totalScore.value;
    const sentenceCount = parseInt(els.qCount.value);
    const optionsPerBlank = parseInt(els.optionsCount.value);
    const bgColor = els.bgColor.value;
    const headerColor = els.headerColor.value;
    const cardBgColor = els.cardBgColor.value;
    
    const sentences = [];
    for (let s = 1; s <= sentenceCount; s++) {
      const sentenceInput = document.querySelector(`.sentence-text[data-sentence="${s}"]`);
      if (sentenceInput) {
        sentences.push(sentenceInput.value.trim());
      }
    }
    
    const blanks = [];
    const blankMap = new Map();
    document.querySelectorAll('.q-options').forEach(input => {
      const blankNum = parseInt(input.dataset.blank);
      const options = input.value.split(',').map(o => o.trim()).filter(Boolean);
      blankMap.set(blankNum, { id: blankNum, options: options, correct: '' });
    });
    document.querySelectorAll('.q-correct').forEach(input => {
      const blankNum = parseInt(input.dataset.blank);
      const existing = blankMap.get(blankNum) || { id: blankNum, options: [], correct: '' };
      existing.correct = input.value.trim();
      blankMap.set(blankNum, existing);
    });
    
    blankMap.forEach((value) => {
      blanks.push(value);
    });
    blanks.sort((a, b) => a.id - b.id);
    
    return { title, grade, totalScore, sentenceCount, optionsPerBlank, sentences, blanks, bgColor, headerColor, cardBgColor };
  }

  // Prepare sentences HTML with dropdowns INSIDE the sentence
  function prepareSentencesForTest(exam) {
    let sentencesHTML = '';
    
    exam.sentences.forEach((sentence, idx) => {
      let processedSentence = sentence;
      
      exam.blanks.forEach(blank => {
        const regex = new RegExp(`\\(${blank.id}\\)`, 'g');
        const optsHTML = blank.options.map(opt => 
          `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`
        ).join('');
        
        const dropdownHTML = `<select id="dropdown${blank.id}" class="word-dropdown" data-correct="${escapeHtml(blank.correct)}">
          <option value="">Select...</option>
          ${optsHTML}
        </select>`;
        
        processedSentence = processedSentence.replace(regex, dropdownHTML);
      });
      
      sentencesHTML += `
        <div class="sentence-item">
          <div class="sentence-number">${idx + 1}.</div>
          <div class="sentence-text-preview">${processedSentence}</div>
        </div>
      `;
    });
    
    return sentencesHTML;
  }

  // Build test file
  function buildTestFile(exam, sentencesHTML) {
    const totalQuestions = exam.blanks.length;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(exam.title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: ${exam.bgColor};
      min-height: 100vh;
      padding: 40px 20px;
    }
    .test-container { max-width: 1000px; margin: 0 auto; }
    .test-card {
      background: ${exam.cardBgColor};
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }
    .test-header {
      background: ${exam.headerColor};
      color: white;
      padding: 40px;
      text-align: center;
    }
    .test-header h1 { font-size: 2.2rem; margin-bottom: 10px; }
    .test-header p { font-size: 1.1rem; opacity: 0.9; }
    .progress-area {
      padding: 20px 30px;
      background: ${exam.cardBgColor === '#ffffff' ? '#f8fafc' : '#f0fdf4'};
      border-bottom: 1px solid #e2e8f0;
    }
    .progress-bar-container { margin-top: 10px; }
    .progress-bar {
      height: 10px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, ${exam.headerColor}, ${exam.headerColor}dd);
      width: 0%;
      transition: width 0.3s ease;
    }
    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #64748b;
    }
    .sentences-area { padding: 30px; }
    .sentence-item {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }
    .sentence-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    .sentence-number {
      display: inline-block;
      background: ${exam.headerColor};
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .sentence-text-preview { font-size: 1.05rem; line-height: 1.6; color: #1e293b; }
    .word-dropdown {
      padding: 8px 12px;
      border-radius: 10px;
      border: 2px solid #cbd5e1;
      font-size: 0.95rem;
      margin: 0 4px;
      font-family: inherit;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .word-dropdown:focus {
      outline: none;
      border-color: ${exam.headerColor};
      box-shadow: 0 0 0 3px ${exam.headerColor}33;
    }
    .word-dropdown.correct { border-color: #10b981; background: #f0fdf4; }
    .word-dropdown.incorrect { border-color: #ef4444; background: #fef2f2; }
    .actions-area {
      padding: 20px 30px 30px;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    .btn {
      flex: 1;
      padding: 14px 24px;
      border: none;
      border-radius: 40px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }
    .btn-primary { background: ${exam.headerColor}; color: white; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px ${exam.headerColor}66; }
    .btn-secondary { background: #e2e8f0; color: #1e293b; }
    .btn-secondary:hover { background: #cbd5e1; }
    .result-area {
      margin: 0 30px 30px;
      padding: 20px;
      border-radius: 16px;
      background: #f0fdf4;
      text-align: center;
      display: none;
    }
    .result-area.show { display: block; }
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .modal-overlay.show { opacity: 1; visibility: visible; }
    .modal-container {
      background: white;
      border-radius: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      padding: 30px;
    }
    @media (max-width: 768px) {
      body { padding: 20px; }
      .test-header h1 { font-size: 1.6rem; }
      .sentence-text-preview { font-size: 0.95rem; }
      .word-dropdown { width: 120px; }
      .actions-area { flex-direction: column; }
      .btn { width: 100%; }
    }
  </style>
</head>
<body>
<div class="test-container">
  <div class="test-card">
    <div class="test-header">
      <h1>📝 ${escapeHtml(exam.title)}</h1>
      <p>${escapeHtml(exam.grade)}</p>
    </div>
    <div class="progress-area">
      <div class="progress-stats">
        <span>📊 Progress</span>
        <span id="progressCount">0/${totalQuestions}</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
      </div>
    </div>
    <div class="sentences-area" id="sentencesArea">${sentencesHTML}</div>
    <div class="actions-area">
      <button id="checkBtn" class="btn btn-primary">✓ Check Answers</button>
      <button id="resetBtn" class="btn btn-secondary">🔄 Clear All</button>
      <button id="backBtn" class="btn btn-secondary">← Back</button>
    </div>
    <div id="resultArea" class="result-area"></div>
  </div>
</div>
<div id="resultModal" class="modal-overlay">
  <div class="modal-container">
    <div id="modalContent"></div>
    <button id="closeModalBtn" class="btn btn-secondary" style="width:100%; margin-top:20px;">Close</button>
  </div>
</div>
<script>
  (function() {
    const totalQuestions = ${totalQuestions};
    const headerColor = "${exam.headerColor}";
    let reviewInProgress = false;
    
    const correctAnswers = {};
    document.querySelectorAll('.word-dropdown').forEach(d => {
      correctAnswers[d.id.replace('dropdown', '')] = d.getAttribute('data-correct');
    });
    
    function updateProgress() {
      const dropdowns = document.querySelectorAll('.word-dropdown');
      let answered = 0;
      dropdowns.forEach(d => { if (d.value) answered++; });
      const percent = (answered / totalQuestions) * 100;
      const fillBar = document.getElementById('progressFill');
      if (fillBar) fillBar.style.width = percent + '%';
      const countSpan = document.getElementById('progressCount');
      if (countSpan) countSpan.innerText = answered + '/' + totalQuestions;
    }
    
    function checkAnswers() {
      let score = 0;
      const results = [];
      const dropdowns = document.querySelectorAll('.word-dropdown');
      dropdowns.forEach(d => d.classList.remove('correct', 'incorrect'));
      dropdowns.forEach(d => {
        const qNum = d.id.replace('dropdown', '');
        const userAnswer = d.value;
        const correctAnswer = correctAnswers[qNum];
        if (userAnswer && userAnswer === correctAnswer) {
          score++;
          d.classList.add('correct');
          results.push({ num: qNum, status: 'correct', user: userAnswer, correct: correctAnswer });
        } else if (userAnswer) {
          d.classList.add('incorrect');
          results.push({ num: qNum, status: 'incorrect', user: userAnswer, correct: correctAnswer });
        } else {
          results.push({ num: qNum, status: 'unanswered', user: '—', correct: correctAnswer });
        }
      });
      const percentage = Math.round((score / totalQuestions) * 100);
      let emoji = '', message = '';
      if (percentage >= 85) { emoji = '🌟'; message = 'Excellent work!'; }
      else if (percentage >= 60) { emoji = '👏'; message = 'Good job!'; }
      else { emoji = '📘'; message = 'Keep practicing!'; }
      let modalHTML = '<div style="text-align:center">' +
        '<div style="font-size:3rem">' + emoji + '</div>' +
        '<h2 style="color:#1e293b;margin:10px 0">' + message + '</h2>' +
        '<div style="font-size:2rem;font-weight:bold;color:' + headerColor + '">' + score + ' / ' + totalQuestions + '</div>' +
        '<p style="margin-top:10px">✅ ' + percentage + '% Correct</p><hr style="margin:20px 0"><h3>📋 Answer Details</h3>';
      results.forEach(r => {
        const icon = r.status === 'correct' ? '✅' : (r.status === 'incorrect' ? '❌' : '⭕');
        const color = r.status === 'correct' ? '#10b981' : (r.status === 'incorrect' ? '#ef4444' : '#f59e0b');
        modalHTML += '<div style="text-align:left;padding:10px;margin:8px 0;background:#f8fafc;border-radius:12px">' +
          '<span style="display:inline-block;width:30px">' + icon + '</span>' +
          '<strong>Question ' + r.num + ':</strong><br>' +
          '<span style="margin-left:30px">Your answer: <span style="color:' + color + '">' + escapeHtmlStatic(r.user) + '</span></span><br>' +
          '<span style="margin-left:30px;font-size:0.85rem">Correct: ' + escapeHtmlStatic(r.correct) + '</span></div>';
      });
      modalHTML += '</div>';
      document.getElementById('modalContent').innerHTML = modalHTML;
      document.getElementById('resultModal').classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    
    function resetAllAnswers() {
      document.querySelectorAll('.word-dropdown').forEach(d => { d.value = ''; d.classList.remove('correct', 'incorrect'); });
      updateProgress();
      showToast('All answers have been reset!', 'success');
    }
    
    function goBack() { window.location.href = 'test-maker.html'; }
    
    function closeModal() {
      const modal = document.getElementById('resultModal');
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        document.querySelectorAll('.focused, .pulse').forEach(el => {
          el.classList.remove('focused', 'pulse');
        });
      }
    }
    
    function navigateToQuestion(questionNum) {
      reviewInProgress = true;
      const modal = document.getElementById('resultModal');
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
      setTimeout(function() {
        const dropdown = document.getElementById('dropdown' + questionNum);
        if (dropdown) {
          dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
          dropdown.focus();
          const wrapper = dropdown.parentElement;
          if (wrapper) {
            wrapper.classList.add('focused', 'pulse');
            setTimeout(function() {
              wrapper.classList.remove('focused', 'pulse');
              reviewInProgress = false;
            }, 2000);
          }
        } else {
          reviewInProgress = false;
        }
      }, 200);
    }
    
    function reviewAnswers() {
      if (reviewInProgress) return;
      reviewInProgress = true;
      const modal = document.getElementById('resultModal');
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
      setTimeout(function() {
        const dropdowns = document.querySelectorAll('.word-dropdown');
        let targetDropdown = null;
        for (let i = 0; i < dropdowns.length; i++) {
          if (dropdowns[i].classList.contains('incorrect')) {
            targetDropdown = dropdowns[i];
            break;
          }
        }
        if (!targetDropdown) {
          for (let i = 0; i < dropdowns.length; i++) {
            if (!dropdowns[i].value) {
              targetDropdown = dropdowns[i];
              break;
            }
          }
        }
        if (targetDropdown) {
          const questionNum = targetDropdown.id.replace('dropdown', '');
          navigateToQuestion(questionNum);
        } else {
          const firstDropdown = document.getElementById('dropdown1');
          if (firstDropdown) {
            navigateToQuestion('1');
          } else {
            reviewInProgress = false;
          }
        }
      }, 200);
    }
    
    function showToast(message, type) {
      const existingToast = document.querySelector('.toast-notification');
      if (existingToast) existingToast.remove();
      const toast = document.createElement('div');
      toast.className = 'toast-notification toast-' + (type || 'info');
      toast.innerHTML = '<span class="toast-icon">' + (type === 'success' ? '✅' : 'ℹ️') + '</span><span class="toast-message">' + message + '</span>';
      document.body.appendChild(toast);
      setTimeout(function() { toast.classList.add('show'); }, 10);
      setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
      }, 3000);
    }
    
    function escapeHtmlStatic(str) {
      if (!str) return '';
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }
    
    function initializeButtons() {
      const checkBtn = document.getElementById('checkBtn');
      if (checkBtn) {
        const newBtn = checkBtn.cloneNode(true);
        checkBtn.parentNode.replaceChild(newBtn, checkBtn);
        newBtn.addEventListener('click', checkAnswers);
      }
      const resetBtn = document.getElementById('resetBtn');
      if (resetBtn) {
        const newBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newBtn, resetBtn);
        newBtn.addEventListener('click', resetAllAnswers);
      }
      const backBtn = document.getElementById('backBtn');
      if (backBtn) {
        const newBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBtn, backBtn);
        newBtn.addEventListener('click', goBack);
      }
      const closeModalBtn = document.getElementById('closeModalBtn');
      if (closeModalBtn) {
        const newBtn = closeModalBtn.cloneNode(true);
        closeModalBtn.parentNode.replaceChild(newBtn, closeModalBtn);
        newBtn.addEventListener('click', closeModal);
      }
      const modal = document.getElementById('resultModal');
      if (modal) {
        const newModal = modal.cloneNode(true);
        modal.parentNode.replaceChild(newModal, modal);
        newModal.addEventListener('click', function(e) { if (e.target === newModal) closeModal(); });
      }
    }
    
    document.querySelectorAll('.word-dropdown').forEach(d => d.addEventListener('change', updateProgress));
    initializeButtons();
    updateProgress();
    
    if (!document.querySelector('#toastStyles')) {
      const toastCSS = '.toast-notification{position:fixed;top:20px;right:20px;background:white;padding:15px 20px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.15);display:flex;align-items:center;gap:12px;z-index:9999;transform:translateX(100%);opacity:0;transition:all 0.3s ease;border-left:4px solid #4caf50;max-width:300px}.toast-notification.show{transform:translateX(0);opacity:1}.toast-success{border-left-color:#4caf50}.toast-info{border-left-color:#2196f3}.toast-icon{font-size:1.2rem}.toast-message{color:#333;font-weight:500}';
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.id = 'toastStyles';
      styleSheet.innerText = toastCSS;
      document.head.appendChild(styleSheet);
    }
  })();
<\/script>
</body>
</html>`;
  }

  // Preview functions
  function refreshPreview() {
    const exam = collectExamData();
    if (!exam) { showToast('Please complete all fields first', 'info'); return; }
    const sentencesHTML = prepareSentencesForTest(exam);
    previewHTML = buildTestFile(exam, sentencesHTML);
    els.previewFrame.srcdoc = previewHTML;
    showToast('Preview updated', 'success');
  }

  function togglePreview() {
    if (!validateForm()) { showToast('Please complete all fields first', 'info'); return; }
    if (els.previewSection.style.display === 'none') {
      refreshPreview();
      els.previewSection.style.display = 'block';
      els.previewBtn.textContent = '🙈 Hide Preview';
      els.previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      els.previewSection.style.display = 'none';
      els.previewBtn.textContent = '👁️ Show Preview';
    }
  }

  function generateAndDownload() {
    if (!validateForm()) { showToast('Please complete all fields first', 'info'); return; }
    const exam = collectExamData();
    if (!exam) return;
    const sentencesHTML = prepareSentencesForTest(exam);
    const outputHTML = previewHTML || buildTestFile(exam, sentencesHTML);
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(outputHTML);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${exam.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Test downloaded! 🎉', 'success');
  }

  // Workflow functions
  function newExam() {
    if (document.querySelectorAll('.sentence-text').length > 0 && !confirm('Discard current changes?')) return;
    els.testTitle.value = '';
    els.gradeSem.value = '';
    els.totalScore.value = '10';
    els.qCount.value = '5';
    els.optionsCount.value = '4';
    els.bgColor.value = 'linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)';
    els.headerColor.value = '#4caf50';
    els.cardBgColor.value = '#ffffff';
    createFullUI();
    currentExamId = null;
    isEditMode = false;
    els.previewSection.style.display = 'none';
    previewHTML = null;
    validateForm();
    updateWorkflowButtons();
    showToast('New exam started', 'info');
  }

  function saveExam() {
    const exam = collectExamData();
    if (!exam) return;
    const examId = currentExamId || `exam_${Date.now()}`;
    const saved = JSON.parse(localStorage.getItem('testMakerExams') || '{}');
    saved[examId] = { ...exam, lastModified: new Date().toISOString() };
    localStorage.setItem('testMakerExams', JSON.stringify(saved));
    currentExamId = examId;
    updateWorkflowButtons();
    loadSavedExamsList();
    showToast('Exam saved to browser storage', 'success');
  }

  function showLoadModal() { loadSavedExamsList(); els.loadModal.classList.add('show'); }

  function loadSavedExamsList() {
    const saved = JSON.parse(localStorage.getItem('testMakerExams') || '{}');
    const ids = Object.keys(saved).sort((a, b) => new Date(saved[b].lastModified) - new Date(saved[a].lastModified));
    if (ids.length === 0) { els.savedExamsList.innerHTML = '<p style="text-align:center">No saved exams found.</p>'; return; }
    els.savedExamsList.innerHTML = ids.map(id => {
      const exam = saved[id];
      const date = new Date(exam.lastModified).toLocaleString();
      return `<div class="saved-exam-item" data-id="${id}">
        <h4>${escapeHtml(exam.title)}</h4>
        <p>${escapeHtml(exam.grade)} • ${exam.sentenceCount} sentences • ${date}</p>
        <div class="exam-actions">
          <button class="btn-tiny load-action">Load</button>
          <button class="btn-tiny edit-action">Edit</button>
          <button class="btn-tiny delete-action">Delete</button>
        </div>
      </div>`;
    }).join('');
    els.savedExamsList.querySelectorAll('.saved-exam-item').forEach(item => {
      const id = item.dataset.id;
      item.querySelector('.load-action').onclick = () => loadExam(id);
      item.querySelector('.edit-action').onclick = () => editExam(id);
      item.querySelector('.delete-action').onclick = (e) => { e.stopPropagation(); deleteExam(id); };
    });
  }

  function loadExam(id) {
    const saved = JSON.parse(localStorage.getItem('testMakerExams') || '{}');
    const exam = saved[id];
    if (!exam) return;
    if (document.querySelectorAll('.sentence-text').length > 0 && !confirm('Discard current changes?')) return;
    els.testTitle.value = exam.title;
    els.gradeSem.value = exam.grade;
    els.totalScore.value = exam.totalScore;
    els.qCount.value = exam.sentenceCount;
    els.optionsCount.value = exam.optionsPerBlank;
    els.bgColor.value = exam.bgColor;
    els.headerColor.value = exam.headerColor;
    els.cardBgColor.value = exam.cardBgColor;
    createFullUI();
    setTimeout(() => {
      exam.sentences.forEach((sentence, idx) => {
        const input = document.querySelector(`.sentence-text[data-sentence="${idx + 1}"]`);
        if (input) { input.value = sentence; input.dispatchEvent(new Event('input')); }
      });
      exam.blanks.forEach(blank => {
        const optionsInput = document.querySelector(`.q-options[data-blank="${blank.id}"]`);
        const correctInput = document.querySelector(`.q-correct[data-blank="${blank.id}"]`);
        if (optionsInput) optionsInput.value = blank.options.join(', ');
        if (correctInput) correctInput.value = blank.correct;
      });
    }, 200);
    currentExamId = id;
    isEditMode = false;
    els.previewSection.style.display = 'none';
    previewHTML = null;
    els.loadModal.classList.remove('show');
    validateForm();
    updateWorkflowButtons();
    showToast('Exam loaded', 'success');
  }

  function editExam(id) { loadExam(id); enableEditMode(); }
  function enableEditMode() { if (!currentExamId) { showToast('Save exam first', 'info'); return; } isEditMode = true; updateWorkflowButtons(); showToast('Edit mode: make changes and click Save', 'info'); }
  function deleteExam(id) { if (!confirm('Delete this saved exam?')) return; const saved = JSON.parse(localStorage.getItem('testMakerExams') || '{}'); delete saved[id]; localStorage.setItem('testMakerExams', JSON.stringify(saved)); if (currentExamId === id) { currentExamId = null; isEditMode = false; updateWorkflowButtons(); } loadSavedExamsList(); showToast('Exam deleted', 'success'); }
  function updateWorkflowButtons() { els.editBtn.disabled = !currentExamId || isEditMode; }
  function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }
  function showToast(message, type = 'info') { const existing = document.querySelector('.toast-notification'); if (existing) existing.remove(); const toast = document.createElement('div'); toast.className = `toast-notification toast-${type}`; toast.innerHTML = `<span>${type === 'success' ? '✅' : 'ℹ️'}</span><span>${escapeHtml(message)}</span>`; document.body.appendChild(toast); setTimeout(() => toast.remove(), 3000); }

  // Setup event listeners
  function setupEventListeners() {
    els.syncBtn.addEventListener('click', syncEverything);
    els.qCount.addEventListener('change', () => { createFullUI(); });
    els.optionsCount.addEventListener('change', syncEverything);
    [els.testTitle, els.gradeSem, els.totalScore].forEach(el => { el.addEventListener('input', debouncedValidate); el.addEventListener('change', debouncedValidate); });
    els.newBtn.addEventListener('click', newExam);
    els.saveBtn.addEventListener('click', saveExam);
    els.loadBtn.addEventListener('click', showLoadModal);
    els.editBtn.addEventListener('click', enableEditMode);
    els.closeLoadModal.addEventListener('click', () => els.loadModal.classList.remove('show'));
    els.loadModal.addEventListener('click', (e) => { if (e.target === els.loadModal) els.loadModal.classList.remove('show'); });
    els.previewBtn.addEventListener('click', togglePreview);
    els.refreshPreviewBtn.addEventListener('click', refreshPreview);
    els.generateBtn.addEventListener('click', generateAndDownload);
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); if (!els.saveBtn.disabled) saveExam(); }
      if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); if (!els.generateBtn.disabled) generateAndDownload(); }
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); if (!els.previewBtn.disabled) togglePreview(); }
    });
  }

  // Initialize
  function init() {
    createFullUI();
    setupEventListeners();
    loadSavedExamsList();
    validateForm();
  }
  init();
});