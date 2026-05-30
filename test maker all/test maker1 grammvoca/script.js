document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const els = {
    testTitle: document.getElementById('testTitle'),
    gradeSem: document.getElementById('gradeSem'),
    totalScore: document.getElementById('totalScore'),
    qCount: document.getElementById('qCount'),
    passageText: document.getElementById('passageText'),
    detectedBlanks: document.getElementById('detectedBlanks'),
    syncBtn: document.getElementById('syncBlanksBtn'),
    blanksContainer: document.getElementById('blanksContainer'),
    generateBtn: document.getElementById('generateBtn'),
    previewBtn: document.getElementById('previewBtn'),
    previewSection: document.getElementById('previewSection'),
    previewFrame: document.getElementById('previewFrame'),
    refreshPreviewBtn: document.getElementById('refreshPreviewBtn'),
    // Workflow
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

  // Initialize
  syncBlanks(); // Initial blank fields
  detectPlaceholders();
  setupEventListeners();
  loadSavedExamsList();

  function setupEventListeners() {
    // Auto-detect placeholders
    els.passageText.addEventListener('input', () => {
      detectPlaceholders();
      debouncedValidate();
    });
    
    // Sync blanks button
    els.syncBtn.addEventListener('click', syncBlanksWithPreserve);
    
    // QCount change
    els.qCount.addEventListener('change', syncBlanksWithPreserve);
    
    // Form validation on any change
    [els.testTitle, els.gradeSem, els.totalScore, els.passageText].forEach(el => {
      el.addEventListener('input', debouncedValidate);
      el.addEventListener('change', debouncedValidate);
    });
    
    // Workflow buttons
    els.newBtn.addEventListener('click', newExam);
    els.saveBtn.addEventListener('click', saveExam);
    els.loadBtn.addEventListener('click', showLoadModal);
    els.editBtn.addEventListener('click', enableEditMode);
    els.closeLoadModal.addEventListener('click', () => els.loadModal.classList.remove('show'));
    els.loadModal.addEventListener('click', (e) => {
      if (e.target === els.loadModal) els.loadModal.classList.remove('show');
    });
    
    // Preview & Generate
    els.previewBtn.addEventListener('click', togglePreview);
    els.refreshPreviewBtn.addEventListener('click', refreshPreview);
    els.generateBtn.addEventListener('click', generateAndDownload);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); if (!els.saveBtn.disabled) saveExam(); }
      if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); if (!els.generateBtn.disabled) generateAndDownload(); }
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); if (!els.previewBtn.disabled) togglePreview(); }
    });
  }

  // Debounce validation to avoid lag
  let validateTimeout;
  function debouncedValidate() {
    clearTimeout(validateTimeout);
    validateTimeout = setTimeout(validateForm, 150);
  }

  // Detect (N) placeholders
  function detectPlaceholders() {
    const text = els.passageText.value;
    const matches = text.match(/\(\d+\)/g) || [];
    const unique = [...new Set(matches.map(m => parseInt(m.replace(/[()]/g, ''))))];
    els.detectedBlanks.textContent = unique.length;
    
    // Auto-sync if count changed significantly
    const qCount = parseInt(els.qCount.value) || 0;
    if (unique.length > 0 && Math.abs(unique.length - qCount) <= 5) {
      els.qCount.value = unique.length;
      syncBlanksWithPreserve();
    }
    validateForm();
  }

  // Sync blanks WHILE PRESERVING existing values
  function syncBlanksWithPreserve() {
    // 1. Save existing values
    const existing = {};
    document.querySelectorAll('.blank-row').forEach((row, i) => {
      const num = i + 1;
      existing[num] = {
        options: row.querySelector('.q-options')?.value || '',
        correct: row.querySelector('.q-correct')?.value || ''
      };
    });
    
    // 2. Rebuild fields
    syncBlanks();
    
    // 3. Restore values
    document.querySelectorAll('.blank-row').forEach((row, i) => {
      const num = i + 1;
      if (existing[num]) {
        row.querySelector('.q-options').value = existing[num].options;
        row.querySelector('.q-correct').value = existing[num].correct;
      }
    });
    
    validateForm();
  }

  // Basic sync (used initially) - MODIFIED with default values
  function syncBlanks() {
    const count = parseInt(els.qCount.value) || 0;
    els.blanksContainer.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
      const row = document.createElement('div');
      row.className = 'blank-row';
      row.dataset.blankNum = i;
      // DEFAULT VALUES ADDED HERE TO ENABLE BUTTONS INITIALLY
      const defaultOptions = `option${i}a, option${i}b, option${i}c`;
      const defaultCorrect = `option${i}a`;
      row.innerHTML = `
        <div class="blank-label">(${i})</div>
        <label>Dropdown Options (comma separated)
          <input type="text" class="q-options" placeholder="e.g., born, studied" data-blank="${i}" value="${defaultOptions}">
        </label>
        <label>Correct Answer
          <input type="text" class="q-correct" placeholder="e.g., born" data-blank="${i}" value="${defaultCorrect}">
        </label>
      `;
      els.blanksContainer.appendChild(row);
    }
    
    // Add listeners to new inputs
    document.querySelectorAll('.q-options, .q-correct').forEach(input => {
      input.addEventListener('input', debouncedValidate);
    });
  }

  // Validate form and update button states
  function validateForm() {
    const title = els.testTitle.value.trim();
    const grade = els.gradeSem.value.trim();
    const score = els.totalScore.value;
    const passage = els.passageText.value.trim();
    const qCount = parseInt(els.qCount.value) || 0;
    
    // Check blank configurations
    let blanksValid = true;
    const blankRows = document.querySelectorAll('.blank-row');
    
    // If no blanks exist yet, consider it valid (buttons will be enabled after creation)
    if (blankRows.length === 0 && qCount > 0) {
      blanksValid = false;
    } else {
      document.querySelectorAll('.blank-row').forEach(row => {
        const opts = row.querySelector('.q-options')?.value.trim();
        const correct = row.querySelector('.q-correct')?.value.trim();
        const isValid = opts && correct;
        row.classList.toggle('invalid', !isValid);
        row.classList.toggle('valid', isValid);
        if (!isValid) blanksValid = false;
      });
    }
    
    const allValid = title && grade && score && passage && qCount > 0 && blanksValid;
    
    // Update button states
    els.generateBtn.disabled = !allValid;
    els.previewBtn.disabled = !allValid;
    els.saveBtn.disabled = !allValid;
    
    return allValid;
  }

  // ============ WORKFLOW FUNCTIONS ============
  
  function newExam() {
    if (hasUnsavedChanges() && !confirm('Discard current changes?')) return;
    
    // Reset all fields
    els.testTitle.value = '';
    els.gradeSem.value = '';
    els.totalScore.value = '10';
    els.qCount.value = '10';
    els.passageText.value = '';
    
    syncBlanks();
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

  function showLoadModal() {
    loadSavedExamsList();
    els.loadModal.classList.add('show');
  }

  function loadSavedExamsList() {
    const saved = JSON.parse(localStorage.getItem('testMakerExams') || '{}');
    const ids = Object.keys(saved).sort((a, b) => 
      new Date(saved[b].lastModified) - new Date(saved[a].lastModified)
    );
    
    if (ids.length === 0) {
      els.savedExamsList.innerHTML = '<p style="color:var(--muted);text-align:center">No saved exams found.</p>';
      return;
    }
    
    els.savedExamsList.innerHTML = ids.map(id => {
      const exam = saved[id];
      const date = new Date(exam.lastModified).toLocaleString();
      return `
        <div class="saved-exam-item" data-id="${id}">
          <h4>${escapeHtml(exam.title)}</h4>
          <p>${escapeHtml(exam.grade)} • ${exam.qCount} blanks • ${date}</p>
          <div class="exam-actions">
            <button class="btn-tiny load-action">Load</button>
            <button class="btn-tiny edit-action">Edit</button>
            <button class="btn-tiny delete-action">Delete</button>
          </div>
        </div>
      `;
    }).join('');
    
    // Attach event listeners
    els.savedExamsList.querySelectorAll('.saved-exam-item').forEach(item => {
      const id = item.dataset.id;
      item.querySelector('.load-action').onclick = () => loadExam(id);
      item.querySelector('.edit-action').onclick = () => editExam(id);
      item.querySelector('.delete-action').onclick = (e) => {
        e.stopPropagation();
        deleteExam(id);
      };
    });
  }

  function loadExam(id) {
    const saved = JSON.parse(localStorage.getItem('testMakerExams') || '{}');
    const exam = saved[id];
    if (!exam) return;
    
    if (hasUnsavedChanges() && !confirm('Discard current changes?')) return;
    
    // Populate form
    els.testTitle.value = exam.title;
    els.gradeSem.value = exam.grade;
    els.totalScore.value = exam.totalScore;
    els.qCount.value = exam.qCount;
    els.passageText.value = exam.passage;
    
    syncBlanks();
    
    // Fill blank configs
    exam.blanks.forEach((blank, i) => {
      const rows = document.querySelectorAll('.blank-row');
      if (rows[i]) {
        rows[i].querySelector('.q-options').value = blank.options.join(', ');
        rows[i].querySelector('.q-correct').value = blank.correct;
      }
    });
    
    currentExamId = id;
    isEditMode = false;
    els.previewSection.style.display = 'none';
    previewHTML = null;
    
    els.loadModal.classList.remove('show');
    validateForm();
    updateWorkflowButtons();
    showToast('Exam loaded', 'success');
  }

  function editExam(id) {
    loadExam(id);
    enableEditMode();
  }

  function enableEditMode() {
    if (!currentExamId) {
      showToast('Save exam first to enable editing', 'info');
      return;
    }
    isEditMode = true;
    updateWorkflowButtons();
    showToast('Edit mode: make changes and click Save', 'info');
  }

  function deleteExam(id) {
    if (!confirm('Delete this saved exam? This cannot be undone.')) return;
    
    const saved = JSON.parse(localStorage.getItem('testMakerExams') || '{}');
    delete saved[id];
    localStorage.setItem('testMakerExams', JSON.stringify(saved));
    
    if (currentExamId === id) {
      currentExamId = null;
      isEditMode = false;
      updateWorkflowButtons();
    }
    
    loadSavedExamsList();
    showToast('Exam deleted', 'success');
  }

  function collectExamData() {
    const title = els.testTitle.value.trim();
    const grade = els.gradeSem.value.trim();
    const totalScore = els.totalScore.value;
    const qCount = parseInt(els.qCount.value);
    const passage = els.passageText.value.trim();
    
    if (!title || !grade || !passage) {
      showToast('Please fill all required fields', 'info');
      return null;
    }
    
    const blanks = [];
    for (let i = 1; i <= qCount; i++) {
      const row = document.querySelector(`.blank-row[data-blank-num="${i}"], .blank-row:nth-child(${i})`);
      if (!row) continue;
      
      const opts = row.querySelector('.q-options')?.value.split(',').map(o => o.trim()).filter(Boolean) || [];
      const correct = row.querySelector('.q-correct')?.value.trim() || '';
      
      if (!opts.length || !correct) {
        showToast(`Please configure blank (${i})`, 'info');
        return null;
      }
      blanks.push({ id: i, options: opts, correct });
    }
    
    if (blanks.length !== qCount) {
      showToast(`Expected ${qCount} blanks, found ${blanks.length}`, 'info');
      return null;
    }
    
    return { title, grade, totalScore, qCount, passage, blanks };
  }

  function hasUnsavedChanges() {
    return els.testTitle.value.trim() && !currentExamId;
  }

  function updateWorkflowButtons() {
    els.editBtn.disabled = !currentExamId || isEditMode;
  }

  // ============ PREVIEW FUNCTIONALITY ============
  
  function togglePreview() {
    if (!validateForm()) {
      showToast('Please complete all fields first', 'info');
      return;
    }
    
    if (els.previewSection.style.display === 'none') {
      refreshPreview();
      els.previewSection.style.display = 'block';
      els.previewBtn.textContent = '🙈 Hide Preview';
      // Scroll to preview
      els.previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      els.previewSection.style.display = 'none';
      els.previewBtn.textContent = '👁️ Show Preview';
    }
  }

  function refreshPreview() {
    const exam = collectExamData();
    if (!exam) return;
    
    // Generate preview HTML
    previewHTML = buildTestFile(exam, preparePassage(exam));
    
    // Load into iframe
    els.previewFrame.srcdoc = previewHTML;
    
    showToast('Preview updated', 'success');
  }

  function preparePassage(exam) {
    let passage = exam.passage;
    exam.blanks.forEach(blank => {
      const optsHTML = blank.options.map(opt => 
        `<option value="${escapeHtml(opt)}" ${opt === blank.correct ? 'data-correct="true"' : ''}>${escapeHtml(opt)}</option>`
      ).join('\n             ');
      
      const dropdownHTML = `<span class="dropdown-wrapper">
           <select id="dropdown${blank.id}" class="word-dropdown" data-correct="${escapeHtml(blank.correct)}">
             <option value="">Select...</option>
             ${optsHTML}
           </select>
           <span class="question-number">${blank.id}</span>
         </span>`;
      
      const regex = new RegExp(`\\(${blank.id}\\)`, 'g');
      passage = passage.replace(regex, dropdownHTML);
    });
    return passage;
  }

  // ============ GENERATION & DOWNLOAD ============
  
  function generateAndDownload() {
    if (!validateForm()) {
      showToast('Please complete all fields first', 'info');
      return;
    }
    
    const exam = collectExamData();
    if (!exam) return;
    
    // Use preview if already generated, otherwise build fresh
    const outputHTML = previewHTML || buildTestFile(exam, preparePassage(exam));
    
    // Create download using data URL (file:// compatible)
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(outputHTML);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${exam.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showToast('Test downloaded! 🎉', 'success');
  }

  // Build the final test HTML (matches Gravocabulary exactly)
  function buildTestFile(exam, passageHTML) {
    // Use EXACT CSS from your Gravocabulary-00.css
    const cssContent = `*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}
body{background:linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%);color:#1b5e20;line-height:1.6;min-height:100vh;padding:20px}
.container{max-width:1200px;margin:0 auto;background:white;border-radius:20px;box-shadow:0 15px 35px rgba(76,175,80,0.2);overflow:hidden;border:2px solid #4caf50}
header{background:linear-gradient(135deg,#4caf50,#2e7d32);color:white;padding:30px 40px;text-align:center;position:relative;overflow:hidden}
h1{font-size:2.2rem;margin-bottom:10px;position:relative;z-index:1;text-shadow:2px 2px 4px rgba(0,0,0,0.2)}
.subtitle{font-size:1.2rem;opacity:0.9;position:relative;z-index:1}
.instructions{background:#f1f8e9;padding:25px 40px;border-bottom:2px solid #c8e6c9}
.instructions p{font-size:1.2rem;color:#2e7d32;margin-bottom:15px;font-weight:600;text-align:center}
.instructions-tips{display:flex;justify-content:center;gap:30px;flex-wrap:wrap;margin-top:15px}
.tip{background:white;padding:10px 20px;border-radius:25px;font-size:0.95rem;color:#555;display:flex;align-items:center;gap:8px;box-shadow:0 3px 8px rgba(0,0,0,0.1)}
.passage-container{padding:30px 40px}
.passage-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #e8f5e9}
.passage-header h2{color:#2e7d32;font-size:1.8rem;margin:0}
.progress-indicator{background:#4caf50;color:white;padding:10px 20px;border-radius:20px;font-weight:600;font-size:1.1rem;box-shadow:0 4px 8px rgba(76,175,80,0.3)}
.passage-content{display:grid;grid-template-columns:2fr 1fr;gap:40px;align-items:start}
@media(max-width:992px){.passage-content{grid-template-columns:1fr}}
.passage-text{background:#f9f9f9;padding:35px;border-radius:15px;border:2px solid #e0f2e1;line-height:1.8;font-size:1.2rem;color:#333}
.passage-text p{margin-bottom:25px}
.dropdown-wrapper{display:inline-block;position:relative;margin:0 5px;min-width:150px;vertical-align:middle}
.dropdown-wrapper:hover .question-number{opacity:1;transform:translateY(-5px)}
.question-number{position:absolute;top:-25px;left:50%;transform:translateX(-50%);background:#4caf50;color:white;width:25px;height:25px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:bold;opacity:0.7;transition:all 0.3s ease;z-index:10}
.word-dropdown{width:100%;padding:12px 15px;font-size:1.1rem;border:2px solid #a5d6a7;border-radius:10px;background:white;color:#2e7d32;cursor:pointer;transition:all 0.3s ease;appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234caf50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right 15px center;background-size:20px;padding-right:45px;font-weight:500}
.word-dropdown:hover{border-color:#4caf50;box-shadow:0 4px 8px rgba(76,175,80,0.2);transform:translateY(-2px)}
.word-dropdown:focus{outline:none;border-color:#2e7d32;box-shadow:0 0 0 3px rgba(76,175,80,0.3)}
.word-dropdown.empty{color:#999;border-style:dashed;background-color:#f9f9f9}
.word-dropdown.selected{background-color:#e3f2fd;border-color:#2196f3;color:#0d47a1}
.word-dropdown.correct{background-color:#c8e6c9;border-color:#4caf50;color:#2e7d32;animation:pulse 0.5s ease}
.word-dropdown.incorrect{background-color:#ffcdd2;border-color:#f44336;color:#c62828;animation:shake 0.5s ease}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.passage-sidebar{display:flex;flex-direction:column;gap:25px}
.sidebar-card{background:white;padding:25px;border-radius:15px;border:2px solid #e0f2e1;box-shadow:0 5px 15px rgba(0,0,0,0.05)}
.sidebar-card h3{color:#2e7d32;margin-bottom:20px;font-size:1.3rem;display:flex;align-items:center;gap:10px}
.icon{font-size:1.2rem}
.guide-steps{display:flex;flex-direction:column;gap:15px}
.step{display:flex;align-items:center;gap:15px;padding:12px;background:#f9f9f9;border-radius:10px;transition:all 0.3s ease}
.step:hover{background:#e8f5e9;transform:translateX(5px)}
.step-number{background:#4caf50;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;flex-shrink:0}
.step-text{color:#555;font-size:0.95rem}
.progress-bar-container{margin-top:10px}
.progress-bar{height:12px;background:#e0e0e0;border-radius:6px;overflow:hidden;margin-bottom:10px}
.progress-fill{height:100%;background:linear-gradient(90deg,#4caf50,#2e7d32);width:0%;transition:width 0.5s ease;border-radius:6px}
.progress-text{display:flex;justify-content:space-between;font-size:0.9rem;color:#666}
.legend-items{display:flex;flex-direction:column;gap:12px}
.legend-item{display:flex;align-items:center;gap:12px}
.color-box{width:20px;height:20px;border-radius:4px;border:2px solid transparent;flex-shrink:0}
.color-box.empty{background:#f9f9f9;border-color:#a5d6a7;border-style:dashed}
.color-box.selected{background:#e3f2fd;border-color:#2196f3}
.color-box.correct{background:#c8e6c9;border-color:#4caf50}
.color-box.incorrect{background:#ffcdd2;border-color:#f44336}
.legend-item span{color:#555;font-size:0.9rem}
.action-buttons{background:#f1f8e9;padding:30px 40px;border-top:2px solid #c8e6c9;display:flex;justify-content:center;gap:25px;flex-wrap:wrap}
.btn{padding:18px 35px;border:none;border-radius:12px;font-size:1.2rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;display:flex;align-items:center;gap:12px;min-width:200px;justify-content:center;box-shadow:0 6px 12px rgba(0,0,0,0.15)}
.btn:hover{transform:translateY(-4px);box-shadow:0 10px 20px rgba(0,0,0,0.2)}
.btn:active{transform:translateY(-1px)}
.btn-primary{background:linear-gradient(135deg,#4caf50,#2e7d32);color:white}
.btn-primary:hover{background:linear-gradient(135deg,#43a047,#1b5e20);box-shadow:0 10px 20px rgba(76,175,80,0.4)}
.btn-secondary{background:linear-gradient(135deg,#757575,#616161);color:white}
.btn-secondary:hover{background:linear-gradient(135deg,#6d6d6d,#545454);box-shadow:0 10px 20px rgba(117,117,117,0.4)}
.btn-back{background:linear-gradient(135deg,#2196f3,#1976d2);color:white}
.btn-back:hover{background:linear-gradient(135deg,#1e88e5,#1565c0);box-shadow:0 10px 20px rgba(33,150,243,0.4)}
.btn-outline{background:transparent;border:2px solid #4caf50;color:#4caf50;box-shadow:none}
.btn-outline:hover{background:#4caf50;color:white;box-shadow:0 10px 20px rgba(76,175,80,0.4)}
.btn-icon{font-size:1.3rem}
.results-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;z-index:1000;opacity:0;visibility:hidden;transition:all 0.3s ease}
.results-modal.show{opacity:1;visibility:visible}
.modal-content{background:white;border-radius:25px;width:100%;max-width:900px;max-height:90vh;overflow-y:auto;animation:modalSlideUp 0.5s ease;box-shadow:0 20px 50px rgba(0,0,0,0.3)}
@keyframes modalSlideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
.modal-header{background:linear-gradient(135deg,#4caf50,#2e7d32);color:white;padding:30px 40px;border-radius:25px 25px 0 0;display:flex;justify-content:space-between;align-items:center}
.modal-header h2{font-size:1.8rem;margin:0;display:flex;align-items:center;gap:12px}
.close-modal{background:rgba(255,255,255,0.2);border:none;width:45px;height:45px;border-radius:50%;font-size:1.8rem;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease}
.close-modal:hover{background:rgba(255,255,255,0.3);transform:rotate(90deg)}
.modal-body{padding:40px}
.score-section{display:grid;grid-template-columns:1fr 2fr;gap:40px;margin-bottom:40px;align-items:center}
@media(max-width:768px){.score-section{grid-template-columns:1fr;gap:30px}}
.score-display{display:flex;align-items:center;gap:30px}
.score-circle{background:linear-gradient(135deg,#4caf50,#2e7d32);width:150px;height:150px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;box-shadow:0 10px 25px rgba(76,175,80,0.4)}
.score-value{font-size:3.5rem;font-weight:bold;line-height:1}
.score-total{font-size:1.5rem;opacity:0.9}
.score-info{text-align:center}
.percentage{font-size:2.5rem;font-weight:bold;color:#4caf50;margin-bottom:5px}
.score-label{color:#666;font-size:1.1rem}
.feedback{background:#f1f8e9;padding:25px;border-radius:15px;border-left:5px solid #4caf50}
.feedback h3{color:#2e7d32;margin-bottom:15px;font-size:1.4rem}
.feedback p{color:#555;line-height:1.6;margin-bottom:15px}
.details-section h3{color:#2e7d32;margin-bottom:25px;font-size:1.4rem;display:flex;align-items:center;gap:10px}
.answers-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px}
.answer-card{padding:20px;border-radius:12px;border:2px solid #e0f2e1;transition:all 0.3s ease;background:white}
.answer-card:hover{transform:translateY(-5px);box-shadow:0 8px 20px rgba(0,0,0,0.1)}
.answer-card.correct{border-color:#4caf50;background:#f1f8e9}
.answer-card.incorrect{border-color:#f44336;background:#ffebee}
.answer-card.unanswered{border-color:#ff9800;background:#fff3e0}
.answer-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;padding-bottom:10px;border-bottom:1px dashed #e0e0e0}
.answer-number{background:#4caf50;color:white;width:35px;height:35px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.1rem}
.answer-status{font-size:0.9rem;font-weight:600;padding:5px 15px;border-radius:15px}
.answer-status.correct{background:#4caf50;color:white}
.answer-status.incorrect{background:#f44336;color:white}
.answer-status.unanswered{background:#ff9800;color:white}
.answer-details{font-size:0.95rem;color:#555}
.answer-details div{margin-bottom:8px}
.answer-details strong{color:#333}
.modal-footer{padding:30px 40px;background:#f9f9f9;border-radius:0 0 25px 25px;display:flex;justify-content:center;gap:20px;flex-wrap:wrap}
.modal-footer .btn{min-width:180px}
@media(max-width:768px){.container{margin:10px;padding:15px}header,.instructions,.passage-container,.action-buttons{padding:20px}h1{font-size:1.8rem}.passage-header{flex-direction:column;gap:15px;text-align:center}.passage-text{padding:25px;font-size:1.1rem}.dropdown-wrapper{min-width:130px}.word-dropdown{padding:10px 12px;font-size:1rem;padding-right:40px}.btn{min-width:100%;padding:16px 25px;font-size:1.1rem}.modal-body{padding:25px}.modal-footer{padding:25px;flex-direction:column}.modal-footer .btn{width:100%}.answers-grid{grid-template-columns:1fr}}
@media(max-width:480px){.score-display{flex-direction:column;text-align:center}.score-circle{width:120px;height:120px}.score-value{font-size:2.8rem}.percentage{font-size:2rem}.action-buttons{flex-direction:column}}
.pulse{animation:pulseAnimation 1s ease}.focused .word-dropdown{border-color:#2196f3;box-shadow:0 0 0 3px rgba(33,150,243,0.3)}@keyframes pulseAnimation{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}`;

    const totalQ = exam.qCount;
    
    const jsContent = `
(function() {
  const totalQuestions = ${totalQ};
  
  function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.word-dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', function() { handleDropdownChange(this); });
      dropdown.addEventListener('focus', function() { highlightQuestionNumber(this, true); });
      dropdown.addEventListener('blur', function() { highlightQuestionNumber(this, false); });
      updateDropdownState(dropdown);
    });
  }
  
  function updateDropdownState(dropdown) {
    dropdown.classList.remove('empty', 'selected', 'correct', 'incorrect');
    dropdown.classList.add(dropdown.value ? 'selected' : 'empty');
  }
  
  function highlightQuestionNumber(dropdown, isHighlighted) {
    const wrapper = dropdown.parentElement;
    const questionNumSpan = wrapper.querySelector('.question-number');
    if (questionNumSpan) {
      if (isHighlighted) {
        questionNumSpan.style.backgroundColor = '#2196f3';
        questionNumSpan.style.transform = 'translateX(-50%) scale(1.2)';
      } else {
        questionNumSpan.style.backgroundColor = dropdown.value ? '#2196f3' : '#4caf50';
        questionNumSpan.style.transform = 'translateX(-50%) scale(1)';
      }
    }
  }
  
  function handleDropdownChange(dropdown) {
    updateDropdownState(dropdown);
    highlightQuestionNumber(dropdown, false);
    updateProgress();
    autoSaveProgress();
  }
  
  function updateProgress() {
    const dropdowns = document.querySelectorAll('.word-dropdown');
    let answeredCount = 0;
    dropdowns.forEach(dropdown => { if (dropdown.value) answeredCount++; });
    
    const answeredCountElement = document.getElementById('answeredCount');
    if (answeredCountElement) {
      answeredCountElement.textContent = answeredCount + '/' + totalQuestions + ' answered';
    }
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressText');
    const answeredText = document.getElementById('answeredText');
    
    if (progressFill && progressText && answeredText) {
      const percentage = Math.round((answeredCount / totalQuestions) * 100);
      progressFill.style.width = percentage + '%';
      progressText.textContent = percentage + '% Complete';
      answeredText.textContent = answeredCount + '/' + totalQuestions + ' answered';
    }
  }
  
  function checkAnswers() {
    let correctCount = 0;
    const results = [];
    const dropdowns = document.querySelectorAll('.word-dropdown');
    
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('correct', 'incorrect');
    });
    
    dropdowns.forEach(dropdown => {
      const questionNumber = dropdown.id.replace('dropdown', '');
      const correctAnswer = dropdown.getAttribute('data-correct');
      const userAnswer = dropdown.value;
      
      if (userAnswer) {
        if (userAnswer === correctAnswer) {
          dropdown.classList.add('correct');
          correctCount++;
          results.push({ question: questionNumber, status: 'correct', userAnswer: userAnswer, correctAnswer: correctAnswer });
        } else {
          dropdown.classList.add('incorrect');
          results.push({ question: questionNumber, status: 'incorrect', userAnswer: userAnswer, correctAnswer: correctAnswer });
        }
      } else {
        results.push({ question: questionNumber, status: 'unanswered', userAnswer: null, correctAnswer: correctAnswer });
      }
    });
    
    showResults(correctCount, results);
  }
  
  function showResults(correctCount, results) {
    const modal = document.getElementById('resultsModal');
    const scoreValue = document.getElementById('scoreValue');
    const percentageValue = document.getElementById('percentageValue');
    const feedback = document.getElementById('feedback');
    const answersGrid = document.getElementById('answersGrid');
    
    if (!modal) return;
    
    scoreValue.textContent = correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    percentageValue.textContent = percentage + '%';
    
    let feedbackHTML = '';
    if (correctCount === totalQuestions) {
      feedbackHTML = '<h3>🎉 Perfect Score!</h3><p>Excellent work! You answered all ' + totalQuestions + ' questions correctly.</p>';
    } else if (percentage >= 80) {
      feedbackHTML = '<h3>🌟 Excellent Work!</h3><p>Great job! You got ' + correctCount + ' out of ' + totalQuestions + ' correct (' + percentage + '%).</p>';
    } else if (percentage >= 60) {
      feedbackHTML = '<h3>👍 Good Effort!</h3><p>You got ' + correctCount + ' out of ' + totalQuestions + ' correct (' + percentage + '%).</p>';
    } else {
      feedbackHTML = '<h3>📚 Keep Practicing!</h3><p>You got ' + correctCount + ' out of ' + totalQuestions + ' correct (' + percentage + '%).</p>';
    }
    feedback.innerHTML = feedbackHTML;
    
    let answersHTML = '';
    results.forEach(result => {
      const statusClass = result.status;
      const statusText = result.status === 'correct' ? 'Correct' : (result.status === 'incorrect' ? 'Incorrect' : 'Not Answered');
      const statusIcon = result.status === 'correct' ? '✅' : (result.status === 'incorrect' ? '❌' : '⭕');
      answersHTML += '<div class="answer-card ' + statusClass + '" data-question="' + result.question + '">' +
        '<div class="answer-header">' +
        '<div class="answer-number">' + result.question + '</div>' +
        '<div class="answer-status ' + statusClass + '">' + statusIcon + ' ' + statusText + '</div>' +
        '</div>' +
        '<div class="answer-details">' +
        '<div><strong>Correct Answer:</strong> <span style="color:#4caf50;font-weight:bold;">' + escapeHtmlStatic(result.correctAnswer) + '</span></div>' +
        (result.userAnswer ? '<div><strong>Your Answer:</strong> <span style="color:' + (result.status === 'correct' ? '#4caf50' : '#f44336') + ';font-weight:bold;">' + escapeHtmlStatic(result.userAnswer) + '</span></div>' : '<div><strong>Your Answer:</strong> <em style="color:#ff9800;">Not selected</em></div>') +
        '</div></div>';
    });
    answersGrid.innerHTML = answersHTML;
    
    document.querySelectorAll('.answer-card').forEach(card => {
      card.addEventListener('click', function() {
        const questionNum = this.getAttribute('data-question');
        navigateToQuestion(questionNum);
      });
    });
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  function navigateToQuestion(questionNum) {
    closeModal();
    setTimeout(() => {
      const dropdown = document.getElementById('dropdown' + questionNum);
      if (dropdown) {
        dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
        dropdown.focus();
        dropdown.parentElement.classList.add('focused', 'pulse');
        setTimeout(() => {
          dropdown.parentElement.classList.remove('focused', 'pulse');
        }, 3000);
      }
    }, 300);
  }
  
  function resetAllAnswers() {
    document.querySelectorAll('.word-dropdown').forEach(d => {
      d.value = '';
      updateDropdownState(d);
    });
    document.querySelectorAll('.question-number').forEach(n => {
      n.style.backgroundColor = '#4caf50';
      n.style.transform = 'translateX(-50%) scale(1)';
    });
    closeModal();
    updateProgress();
    localStorage.removeItem('grammarTestProgress');
    showToast('All answers have been reset!', 'success');
  }
  
  function closeModal() {
    const modal = document.getElementById('resultsModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }
  
  function reviewAnswers() {
    closeModal();
    setTimeout(() => {
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
        const firstDropdown = document.getElementById('dropdown1');
        if (firstDropdown) navigateToQuestion('1');
      }
    }, 300);
  }
  
  function goBack() {
    if (hasUnsavedProgress()) {
      if (confirm('You have unsaved progress. Are you sure you want to leave?')) {
        window.location.href = '../Grammar & Vocabulary Activities - Grade 7.html';
      }
    } else {
      window.location.href = '../Grammar & Vocabulary Activities - Grade 7.html';
    }
  }
  
  function hasUnsavedProgress() {
    const dropdowns = document.querySelectorAll('.word-dropdown');
    for (let dropdown of dropdowns) {
      if (dropdown.value) {
        return true;
      }
    }
    return false;
  }
  
  function showToast(message, type) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + (type || 'info');
    toast.innerHTML = '<span class="toast-icon">' + (type === 'success' ? '✅' : 'ℹ️') + '</span><span class="toast-message">' + message + '</span>';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  function escapeHtmlStatic(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  let saveTimeout;
  function autoSaveProgress() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const selections = {};
      document.querySelectorAll('.word-dropdown').forEach(d => {
        selections[d.id.replace('dropdown', '')] = d.value;
      });
      localStorage.setItem('grammarTestProgress', JSON.stringify(selections));
    }, 1000);
  }
  
  function loadSavedProgress() {
    try {
      const saved = localStorage.getItem('grammarTestProgress');
      if (saved) {
        const selections = JSON.parse(saved);
        let loadedCount = 0;
        Object.keys(selections).forEach(questionNumber => {
          const dropdown = document.getElementById('dropdown' + questionNumber);
          if (dropdown && selections[questionNumber]) {
            dropdown.value = selections[questionNumber];
            updateDropdownState(dropdown);
            loadedCount++;
          }
        });
        if (loadedCount > 0) {
          updateProgress();
          showToast('Loaded ' + loadedCount + ' saved answers', 'success');
        }
      }
    } catch(e) {
      console.error('Error loading progress:', e);
    }
  }
  
  function initializeButtons() {
    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) checkBtn.addEventListener('click', checkAnswers);
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetAllAnswers);
    
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.addEventListener('click', goBack);
    
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) tryAgainBtn.addEventListener('click', function() { resetAllAnswers(); closeModal(); });
    
    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn) reviewBtn.addEventListener('click', reviewAnswers);
    
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) continueBtn.addEventListener('click', closeModal);
    
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    const modal = document.getElementById('resultsModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeDropdowns();
      initializeButtons();
      updateProgress();
      loadSavedProgress();
    });
  } else {
    initializeDropdowns();
    initializeButtons();
    updateProgress();
    loadSavedProgress();
  }
  
  // Add toast CSS if not already added
  if (!document.querySelector('#toastStyles')) {
    const toastCSS = '.toast-notification{position:fixed;top:20px;right:20px;background:white;padding:15px 20px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.15);display:flex;align-items:center;gap:12px;z-index:9999;transform:translateX(100%);opacity:0;transition:all 0.3s ease;border-left:4px solid #4caf50;max-width:300px}.toast-notification.show{transform:translateX(0);opacity:1}.toast-success{border-left-color:#4caf50}.toast-info{border-left-color:#2196f3}.toast-icon{font-size:1.2rem}.toast-message{color:#333;font-weight:500}';
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.id = "toastStyles";
    styleSheet.innerText = toastCSS;
    document.head.appendChild(styleSheet);
  }
})();
`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(exam.title)}</title>
  <style>${cssContent}</style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(exam.title)}</h1>
      <p class="subtitle">${escapeHtml(exam.grade)}</p>
    </header>
    <div class="instructions">
      <p>Read the passage carefully. For each numbered blank, select the correct option from the dropdown menu.</p>
      <div class="instructions-tips">
        <div class="tip">💡 Click on each blank to see the options</div>
        <div class="tip">✅ Choose the best word for each sentence</div>
      </div>
    </div>
    <div class="passage-container">
      <div class="passage-header">
        <h2>📖 ${escapeHtml(exam.title)}</h2>
        <div class="progress-indicator"><span id="answeredCount">0/${exam.qCount}</span> answered</div>
      </div>
      <div class="passage-content">
        <div class="passage-text">
          <p>${passageHTML}</p>
        </div>
        <div class="passage-sidebar">
          <div class="sidebar-card">
            <h3><span class="icon">📌</span> Quick Guide</h3>
            <div class="guide-steps">
              <div class="step"><div class="step-number">1</div><div class="step-text">Read the entire story first</div></div>
              <div class="step"><div class="step-number">2</div><div class="step-text">Click on any blank to see options</div></div>
              <div class="step"><div class="step-number">3</div><div class="step-text">Choose the word that fits best</div></div>
              <div class="step"><div class="step-number">4</div><div class="step-text">Check your answers when ready</div></div>
            </div>
          </div>
          <div class="sidebar-card">
            <h3><span class="icon">📊</span> Your Progress</h3>
            <div class="progress-bar-container">
              <div class="progress-bar"><div class="progress-fill"></div></div>
              <div class="progress-text">
                <span id="progressText">0% Complete</span>
                <span id="answeredText">0/${exam.qCount} answered</span>
              </div>
            </div>
          </div>
          <div class="sidebar-card">
            <h3><span class="icon">🎨</span> Color Guide</h3>
            <div class="legend-items">
              <div class="legend-item"><div class="color-box empty"></div><span>Not answered</span></div>
              <div class="legend-item"><div class="color-box selected"></div><span>Answered</span></div>
              <div class="legend-item"><div class="color-box correct"></div><span>Correct answer</span></div>
              <div class="legend-item"><div class="color-box incorrect"></div><span>Incorrect answer</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      <button type="button" id="checkBtn" class="btn btn-primary"><span class="btn-icon">✓</span> Check My Answers</button>
      <button type="button" id="resetBtn" class="btn btn-secondary"><span class="btn-icon">🔄</span> Clear All Answers</button>
      <button type="button" id="backBtn" class="btn btn-back"><span class="btn-icon">←</span> Back to Activities</button>
    </div>
  </div>

  <div id="resultsModal" class="results-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>📊 Test Results</h2>
        <button id="closeModalBtn" class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="score-section">
          <div class="score-display">
            <div class="score-circle">
              <div class="score-value" id="scoreValue">0</div>
              <div class="score-total">/${exam.qCount}</div>
            </div>
            <div class="score-info">
              <div class="percentage" id="percentageValue">0%</div>
              <div class="score-label">Success Rate</div>
            </div>
          </div>
          <div class="feedback" id="feedback">
            <h3>Ready to check your work?</h3>
            <p>Select answers and click "Check My Answers" to see your score.</p>
          </div>
        </div>
        <div class="details-section">
          <h3>📋 Answer Details</h3>
          <div id="answersGrid" class="answers-grid"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="reviewBtn" class="btn btn-outline">👁️ Review Answers</button>
        <button id="tryAgainBtn" class="btn btn-secondary">🔄 Try Again</button>
        <button id="continueBtn" class="btn btn-primary">→ Continue</button>
      </div>
    </div>
  </div>

  <script>${jsContent}<\/script>
</body>
</html>`;
  }

  // Utility: Escape HTML to prevent XSS
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Toast notification
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : 'ℹ️'}</span><span class="toast-message">${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});