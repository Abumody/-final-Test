document.addEventListener('DOMContentLoaded', function() {
  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const testTitle = document.getElementById('testTitle');
  const gradeSem = document.getElementById('gradeSem');
  const pictureCount = document.getElementById('pictureCount');
  const pointsPerMatch = document.getElementById('pointsPerMatch');
  const totalScore = document.getElementById('totalScore');
  const bgColor = document.getElementById('bgColor');
  const syncItemsBtn = document.getElementById('syncItemsBtn');
  const itemsContainer = document.getElementById('itemsContainer');
  const generateBtn = document.getElementById('generateBtn');
  const previewBtn = document.getElementById('previewBtn');
  const previewSection = document.getElementById('previewSection');
  const previewFrame = document.getElementById('previewFrame');
  const refreshPreviewBtn = document.getElementById('refreshPreviewBtn');
  const newBtn = document.getElementById('newBtn');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const editBtn = document.getElementById('editBtn');
  const loadModal = document.getElementById('loadModal');
  const closeLoadModal = document.getElementById('closeLoadModal');
  const savedTestsList = document.getElementById('savedTestsList');
  const uiLangBtn = document.getElementById('uiLangBtn');

  // ============================================================
  // GLOBAL VARIABLES
  // ============================================================
  let currentTestId = null;
  let isEditMode = false;
  let previewHTML = null;
  let imageDataUrls = {};
  let currentUILang = localStorage.getItem('dragDropUILang') || 'en';

  // ============================================================
  // TRANSLATIONS
  // ============================================================
  const translations = {
    en: {
      sidebarTitle: "🖼️ Drag & Drop Test Maker",
      sidebarDesc: "Create picture-word matching drag & drop tests",
      tipTitle: "💡 How to use",
      tipList: [
        "Enter test title and grade",
        "Set number of pictures (2-12)",
        "Upload images for each picture",
        "Enter matching words for each picture",
        "Set points per correct match",
        "Preview → Generate → Download"
      ],
      settingsTitle: "⚙️ Test Settings",
      testTitleLabel: "Test Title",
      gradeLabel: "Grade & Semester",
      pictureCountLabel: "Number of Pictures",
      pointsLabel: "Points per Match",
      totalScoreLabel: "Total Score",
      bgColorLabel: "Background Color",
      itemsTitle: "🖼️ Pictures & Matching Words",
      previewTitle: "👁️ Live Preview",
      modalTitle: "📂 Load Saved Test",
      newBtn: "🆕 New",
      saveBtn: "💾 Save",
      loadBtn: "📂 Load",
      editBtn: "✏️ Edit",
      previewBtn: "👁️ Preview",
      generateBtn: "📥 Generate & Download",
      hidePreview: "🙈 Hide Preview",
      showPreview: "👁️ Preview",
      syncItems: "🔄 Sync Items",
      refreshPreview: "🔄 Refresh",
      delete: "Delete",
      load: "Load",
      noSavedTests: "No saved tests found",
      item: "Item",
      uploadPicture: "Upload Picture",
      matchingWord: "Matching Word (English/عربي)",
      deleteConfirm: "Delete this test permanently?",
      discardChanges: "Discard current changes?",
      minPictures: "Minimum 2 pictures required",
      completeFields: "Please complete all fields first",
      previewUpdated: "Preview updated",
      testDownloaded: "Test downloaded successfully! 🎉",
      testSaved: "Test saved successfully",
      testLoaded: "Test loaded successfully",
      testDeleted: "Test deleted",
      newTestCreated: "New test created",
      saveFirst: "Save the test first",
      editMode: "Edit mode: make changes and click Save",
      newTestConfirm: "Discard current changes and create a new test?"
    },
    ar: {
      sidebarTitle: "🖼️ منشئ اختبار السحب والإفلات",
      sidebarDesc: "أنشئ اختبارات مطابقة الصور والكلمات",
      tipTitle: "💡 طريقة الاستخدام",
      tipList: [
        "أدخل عنوان الاختبار والصف",
        "حدد عدد الصور (2-12)",
        "ارفع الصور لكل صورة",
        "أدخل الكلمات المطابقة لكل صورة",
        "حدد الدرجة لكل تطابق صحيح",
        "معاينة ← إنشاء ← تحميل"
      ],
      settingsTitle: "⚙️ إعدادات الاختبار",
      testTitleLabel: "عنوان الاختبار",
      gradeLabel: "الصف الدراسي",
      pictureCountLabel: "عدد الصور",
      pointsLabel: "الدرجة لكل تطابق",
      totalScoreLabel: "الدرجة الكلية",
      bgColorLabel: "لون الخلفية",
      itemsTitle: "🖼️ الصور والكلمات المطابقة",
      previewTitle: "👁️ معاينة مباشرة",
      modalTitle: "📂 تحميل اختبار محفوظ",
      newBtn: "🆕 جديد",
      saveBtn: "💾 حفظ",
      loadBtn: "📂 تحميل",
      editBtn: "✏️ تعديل",
      previewBtn: "👁️ معاينة",
      generateBtn: "📥 إنشاء وتحميل",
      hidePreview: "🙈 إخفاء المعاينة",
      showPreview: "👁️ معاينة",
      syncItems: "🔄 مزامنة العناصر",
      refreshPreview: "🔄 تحديث",
      delete: "حذف",
      load: "تحميل",
      noSavedTests: "لا توجد اختبارات محفوظة",
      item: "عنصر",
      uploadPicture: "رفع صورة",
      matchingWord: "الكلمة المطابقة (English/عربي)",
      deleteConfirm: "هل تريد حذف هذا الاختبار نهائياً؟",
      discardChanges: "هل تريد تجاهل التغييرات الحالية؟",
      minPictures: "الحد الأدنى 2 صور مطلوب",
      completeFields: "الرجاء إكمال جميع الحقول أولاً",
      previewUpdated: "تم تحديث المعاينة",
      testDownloaded: "تم تحميل الاختبار بنجاح! 🎉",
      testSaved: "تم حفظ الاختبار بنجاح",
      testLoaded: "تم تحميل الاختبار بنجاح",
      testDeleted: "تم حذف الاختبار",
      newTestCreated: "تم إنشاء اختبار جديد",
      saveFirst: "احفظ الاختبار أولاً",
      editMode: "وضع التعديل: قم بالتغييرات ثم اضغط حفظ",
      newTestConfirm: "هل تريد تجاهل التغييرات الحالية وإنشاء اختبار جديد؟"
    }
  };

  // ============================================================
  // UI LANGUAGE FUNCTIONS
  // ============================================================
  function updateUILanguage() {
    const t = translations[currentUILang];
    
    document.getElementById('sidebarTitle').innerHTML = t.sidebarTitle;
    document.getElementById('sidebarDesc').innerText = t.sidebarDesc;
    document.getElementById('tipTitle').innerHTML = t.tipTitle;
    
    const tipList = document.getElementById('tipList');
    tipList.innerHTML = '';
    t.tipList.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      tipList.appendChild(li);
    });
    
    document.getElementById('settingsTitle').innerText = t.settingsTitle;
    document.getElementById('itemsTitle').innerHTML = t.itemsTitle;
    document.getElementById('previewTitle').innerHTML = t.previewTitle;
    document.getElementById('modalTitle').innerText = t.modalTitle;
    
    newBtn.innerHTML = t.newBtn;
    saveBtn.innerHTML = t.saveBtn;
    loadBtn.innerHTML = t.loadBtn;
    editBtn.innerHTML = t.editBtn;
    
    const isPreviewVisible = previewSection.style.display !== 'none';
    previewBtn.innerHTML = isPreviewVisible ? t.hidePreview : t.showPreview;
    generateBtn.innerHTML = t.generateBtn;
    syncItemsBtn.innerHTML = t.syncItems;
    refreshPreviewBtn.innerHTML = t.refreshPreview;
    
    // Update labels without destroying inputs
    const testTitleLabel = document.getElementById('testTitleLabel');
    testTitleLabel.childNodes[0].textContent = t.testTitleLabel + ' ';
    
    const gradeLabel = document.getElementById('gradeLabel');
    gradeLabel.childNodes[0].textContent = t.gradeLabel + ' ';
    
    const pictureCountLabel = document.getElementById('pictureCountLabel');
    pictureCountLabel.childNodes[0].textContent = t.pictureCountLabel + ' ';
    
    const pointsLabel = document.getElementById('pointsLabel');
    pointsLabel.childNodes[0].textContent = t.pointsLabel + ' ';
    
    const totalScoreLabel = document.getElementById('totalScoreLabel');
    totalScoreLabel.childNodes[0].textContent = t.totalScoreLabel + ' ';
    
    const bgColorLabel = document.getElementById('bgColorLabel');
    bgColorLabel.childNodes[0].textContent = t.bgColorLabel + ' ';
    
    const htmlRoot = document.documentElement;
    const body = document.body;
    if (currentUILang === 'ar') {
      htmlRoot.setAttribute('dir', 'rtl');
      body.classList.add('rtl');
    } else {
      htmlRoot.setAttribute('dir', 'ltr');
      body.classList.remove('rtl');
    }
    
    localStorage.setItem('dragDropUILang', currentUILang);
    updateItemsLanguage();
  }
  
  function updateItemsLanguage() {
    const t = translations[currentUILang];
    document.querySelectorAll('.item-card').forEach((card, idx) => {
      const itemNum = idx + 1;
      const numberSpan = card.querySelector('.item-number');
      if (numberSpan) numberSpan.textContent = t.item + ' ' + itemNum;
      
      const labels = card.querySelectorAll('label');
      if (labels[0]) {
        const labelText = labels[0].childNodes[0];
        if (labelText && labelText.nodeType === 3) labelText.textContent = t.uploadPicture;
      }
      if (labels[1]) {
        const labelText = labels[1].childNodes[0];
        if (labelText && labelText.nodeType === 3) labelText.textContent = t.matchingWord;
      }
      
      const deleteBtn = card.querySelector('.delete-item');
      if (deleteBtn) deleteBtn.textContent = t.delete;
    });
  }

  function toggleUILanguage() {
    currentUILang = currentUILang === 'en' ? 'ar' : 'en';
    updateUILanguage();
  }
  if (uiLangBtn) uiLangBtn.addEventListener('click', toggleUILanguage);

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================
  function updateTotalScore() {
    const count = pictureCount ? parseInt(pictureCount.value) || 0 : 0;
    const points = pointsPerMatch ? parseFloat(pointsPerMatch.value) || 0 : 0;
    const total = (count * points).toFixed(1);
    if (totalScore) totalScore.value = total;
    return total;
  }
  if (pictureCount) pictureCount.addEventListener('input', updateTotalScore);
  if (pointsPerMatch) pointsPerMatch.addEventListener('input', updateTotalScore);
  updateTotalScore();

  // ============================================================
  // ITEM MANAGEMENT
  // ============================================================
  function attachItemEvents() {
    document.querySelectorAll('.image-upload').forEach(input => {
      input.removeEventListener('change', handleImageUpload);
      input.addEventListener('change', handleImageUpload);
    });
    document.querySelectorAll('.matching-word').forEach(input => {
      input.removeEventListener('input', debouncedValidate);
      input.addEventListener('input', debouncedValidate);
    });
    document.querySelectorAll('.delete-item').forEach(btn => {
      btn.removeEventListener('click', handleDeleteItem);
      btn.addEventListener('click', handleDeleteItem);
    });
  }

  function handleImageUpload(event) {
    const id = event.target.dataset.id;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageDataUrls[id] = e.target.result;
        const img = document.querySelector(`.image-preview[data-id="${id}"]`);
        if (img) {
          img.src = e.target.result;
          img.style.display = 'block';
        }
        validateForm();
      };
      reader.readAsDataURL(file);
    }
  }

  function handleDeleteItem(event) {
    const id = parseInt(event.target.dataset.id);
    const count = pictureCount ? parseInt(pictureCount.value) || 0 : 0;
    const t = translations[currentUILang];
    if (count <= 2) {
      showToast(t.minPictures, 'info');
      return;
    }
    delete imageDataUrls[id];
    if (pictureCount) pictureCount.value = count - 1;
    updateTotalScore();
    createItems();
  }

  function createItems() {
    const count = pictureCount ? parseInt(pictureCount.value) || 0 : 0;
    const t = translations[currentUILang];
    if (itemsContainer) itemsContainer.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.dataset.itemId = i;
      div.innerHTML = `
        <div class="item-header">
          <span class="item-number">${t.item} ${i}</span>
          <button type="button" class="delete-item" data-id="${i}">${t.delete}</button>
        </div>
        <label>${t.uploadPicture}
          <input type="file" class="image-upload" data-id="${i}" accept="image/*">
          <div class="image-preview-container" style="margin-top: 0.5rem;">
            <img class="image-preview" data-id="${i}" style="display: none; width: 100px; height: 100px; object-fit: cover; border-radius: 12px;">
          </div>
        </label>
        <label style="margin-top: 0.8rem;">${t.matchingWord}
          <input type="text" class="matching-word" data-id="${i}" placeholder="e.g., Cat / قط" value="">
        </label>
      `;
      if (itemsContainer) itemsContainer.appendChild(div);
    }
    setTimeout(function() {
      for (let i = 1; i <= count; i++) {
        if (imageDataUrls[i]) {
          const img = document.querySelector(`.image-preview[data-id="${i}"]`);
          if (img) {
            img.src = imageDataUrls[i];
            img.style.display = 'block';
          }
        }
      }
    }, 50);
    attachItemEvents();
    validateForm();
  }

  function syncItems() {
    const existingWords = {};
    const existingImages = {};
    document.querySelectorAll('.matching-word').forEach(input => {
      const id = input.dataset.id;
      if (id) existingWords[id] = input.value;
    });
    Object.keys(imageDataUrls).forEach(id => {
      existingImages[id] = imageDataUrls[id];
    });
    createItems();
    setTimeout(function() {
      for (let id in existingWords) {
        const wordInput = document.querySelector(`.matching-word[data-id="${id}"]`);
        if (wordInput) wordInput.value = existingWords[id];
      }
      for (let id in existingImages) {
        const img = document.querySelector(`.image-preview[data-id="${id}"]`);
        if (img) {
          img.src = existingImages[id];
          img.style.display = 'block';
          imageDataUrls[id] = existingImages[id];
        }
      }
      validateForm();
    }, 100);
  }

  // ============================================================
  // VALIDATION
  // ============================================================
  let validateTimeout;
  function debouncedValidate() {
    clearTimeout(validateTimeout);
    validateTimeout = setTimeout(validateForm, 150);
  }

  function validateForm() {
    const title = testTitle ? testTitle.value.trim() : '';
    const grade = gradeSem ? gradeSem.value.trim() : '';
    const count = pictureCount ? parseInt(pictureCount.value) || 0 : 0;
    let itemsValid = true;
    for (let i = 1; i <= count; i++) {
      const wordInput = document.querySelector(`.matching-word[data-id="${i}"]`);
      const hasImage = imageDataUrls[i];
      const hasWord = wordInput && wordInput.value.trim();
      if (!hasImage || !hasWord) {
        itemsValid = false;
        break;
      }
    }
    const allValid = title && grade && count > 0 && itemsValid;
    if (generateBtn) generateBtn.disabled = !allValid;
    if (previewBtn) previewBtn.disabled = !allValid;
    if (saveBtn) saveBtn.disabled = !allValid;
    return allValid;
  }

  // ============================================================
  // DATA COLLECTION
  // ============================================================
  function collectTestData() {
    const title = testTitle ? testTitle.value.trim() : '';
    const grade = gradeSem ? gradeSem.value.trim() : '';
    const count = pictureCount ? parseInt(pictureCount.value) : 0;
    const points = pointsPerMatch ? parseFloat(pointsPerMatch.value) : 0;
    const bg = bgColor ? bgColor.value : 'linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)';
    const items = [];
    for (let i = 1; i <= count; i++) {
      const wordInput = document.querySelector(`.matching-word[data-id="${i}"]`);
      const word = wordInput ? wordInput.value.trim() : '';
      const imageData = imageDataUrls[i];
      if (imageData && word) {
        items.push({ id: i, image: imageData, word: word });
      }
    }
    return { title, grade, count, points, bg, items };
  }

  // ============================================================
  // SHUFFLE & ESCAPE
  // ============================================================
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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

  // ============================================================
  // BUILD TEST FILE (words on top, images below, compact grid)
  // ============================================================
  function buildTestFile(testData) {
    const shuffledItems = shuffleArray([...testData.items]);
    let imagesHTML = '';
    let wordsHTML = '';
    let matchesArray = [];
    
    testData.items.forEach(function(item) {
      imagesHTML += `
        <div class="image-card" data-id="${item.id}" data-word="${item.word.toLowerCase()}">
          <img src="${item.image}" alt="Picture ${item.id}">
          <div class="drop-zone" data-id="${item.id}">
            <span class="drop-placeholder">Drop word here</span>
          </div>
        </div>
      `;
      matchesArray.push({ id: item.id, word: item.word.toLowerCase() });
    });
    
    shuffledItems.forEach(function(item, idx) {
      wordsHTML += `
        <div class="word-card" draggable="true" data-word="${item.word.toLowerCase()}" data-word-id="${idx + 1}" data-original-word="${escapeHtml(item.word)}">
          <span class="word-text">${escapeHtml(item.word)}</span>
        </div>
      `;
    });
    
    const matchesScript = JSON.stringify(matchesArray);
    
    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(testData.title)} - Drag & Drop Test</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: ${testData.bg}; min-height: 100vh; padding: 20px; }
    body.rtl { direction: rtl; font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
    .test-container { max-width: 1200px; margin: 0 auto; }
    .test-card { background: white; border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; }
    .test-header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; position: relative; }
    .language-switch { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; padding: 8px 16px; border-radius: 30px; color: white; cursor: pointer; font-weight: bold; }
    body.rtl .language-switch { right: auto; left: 20px; }
    .test-header h1 { font-size: 1.8rem; margin-bottom: 8px; }
    .test-header p { font-size: 1rem; opacity: 0.9; }
    .progress-area { padding: 12px 25px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .progress-stats { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: 600; color: #166534; }
    .progress-bar { height: 6px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #16a34a, #22c55e); width: 0%; transition: width 0.3s ease; }
    .game-area { display: flex; flex-direction: column; gap: 20px; padding: 20px; }
    .words-area { background: #f1f5f9; border-radius: 20px; padding: 15px; }
    .words-area h2 { color: #166534; margin-bottom: 15px; font-size: 1.2rem; }
    .words-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    .word-card { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 10px 24px; border-radius: 40px; cursor: grab; user-select: none; font-weight: bold; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: inline-block; }
    .word-card:active { cursor: grabbing; }
    .word-card.dragging { opacity: 0.5; }
    .word-card.dragged { opacity: 0.3; pointer-events: none; }
    .images-area { background: #f1f5f9; border-radius: 20px; padding: 15px; }
    .images-area h2 { color: #166534; margin-bottom: 15px; font-size: 1.2rem; }
    .images-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
    .image-card { background: white; border-radius: 16px; padding: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .image-card img { width: 100%; height: 130px; object-fit: cover; border-radius: 12px; margin-bottom: 10px; }
    .drop-zone { min-height: 50px; background: #f0fdf4; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-top: 8px; padding: 8px; }
    .drop-zone.drag-over { border-color: #16a34a; background: #dcfce7; }
    .drop-zone.filled { background: #dcfce7; border-color: #16a34a; border-style: solid; }
    .drop-placeholder { color: #94a3b8; font-size: 0.8rem; }
    .dropped-word { font-weight: bold; color: #166534; }
    .actions-area { padding: 15px 20px 20px; display: flex; gap: 15px; border-top: 1px solid #e2e8f0; }
    .btn { flex: 1; padding: 12px 20px; border: none; border-radius: 40px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; }
    .btn-secondary { background: #e2e8f0; color: #1e293b; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
    .modal-overlay.show { opacity: 1; visibility: visible; }
    .modal-container { background: white; border-radius: 24px; max-width: 550px; width: 90%; max-height: 80vh; overflow-y: auto; padding: 25px; }
    .toast-notification { position: fixed; bottom: 20px; right: 20px; background: white; padding: 10px 18px; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; z-index: 9999; transform: translateX(100%); opacity: 0; transition: all 0.3s ease; border-left: 4px solid #16a34a; }
    body.rtl .toast-notification { right: auto; left: 20px; border-left: none; border-right: 4px solid #16a34a; transform: translateX(-100%); }
    .toast-notification.show { transform: translateX(0); opacity: 1; }
    @media (max-width: 700px) { .test-header h1 { font-size: 1.4rem; } .images-grid { grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); } .word-card { padding: 6px 18px; font-size: 0.9rem; } }
  </style>
</head>
<body>
<div class="test-container">
  <div class="test-card">
    <div class="test-header">
      <button id="languageBtn" class="language-switch">العربية / English</button>
      <h1>🖼️ ${escapeHtml(testData.title)}</h1>
      <p>${escapeHtml(testData.grade)}</p>
    </div>
    <div class="progress-area">
      <div class="progress-stats"><span id="progressLabel">📊 Progress</span><span id="progressCount">0/${testData.count}</span></div>
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    </div>
    <div class="game-area">
      <div class="words-area"><h2 id="wordsTitle">📝 Drag Words</h2><div class="words-grid">${wordsHTML}</div></div>
      <div class="images-area"><h2 id="imagesTitle">🖼️ Pictures</h2><div class="images-grid">${imagesHTML}</div></div>
    </div>
    <div class="actions-area">
      <button id="checkBtn" class="btn btn-primary">✓ Check Answers</button>
      <button id="resetBtn" class="btn btn-secondary">🔄 Reset All</button>
      <button id="backBtn" class="btn btn-secondary">← Back</button>
    </div>
  </div>
</div>
<div id="resultModal" class="modal-overlay"><div class="modal-container"><div id="modalContent"></div><button id="closeModalBtn" class="btn btn-secondary" style="width:100%; margin-top:20px;">Close</button></div></div>
<script>
  (function() {
    const totalQuestions = ${testData.count};
    const pointsPerMatch = ${testData.points};
    const correctMatches = ${matchesScript};
    let currentMatches = {};
    let currentLang = localStorage.getItem('dragDropTestLang') || 'en';
    
    const translations = {
      en: { progress: "📊 Progress", pictures: "🖼️ Pictures", words: "📝 Drag Words", dropPlaceholder: "Drop word here", checkAnswers: "✓ Check Answers", resetAll: "🔄 Reset All", back: "← Back", close: "Close", wrongMatch: "Wrong match! Try again.", resetSuccess: "All answers have been reset!", excellent: "Excellent work!", goodJob: "Good job!", keepPracticing: "Keep practicing!", correct: "Correct", incorrect: "Incorrect", unanswered: "Unanswered", yourMatch: "Your match", correctAnswer: "Correct" },
      ar: { progress: "📊 التقدم", pictures: "🖼️ الصور", words: "📝 اسحب الكلمات", dropPlaceholder: "أسقط الكلمة هنا", checkAnswers: "✓ تصحيح الإجابات", resetAll: "🔄 إعادة تعيين", back: "← رجوع", close: "إغلاق", wrongMatch: "إجابة خاطئة! حاول مرة أخرى", resetSuccess: "تم إعادة تعيين جميع الإجابات!", excellent: "عمل ممتاز!", goodJob: "عمل جيد!", keepPracticing: "واصل التدريب!", correct: "صحيح", incorrect: "خطأ", unanswered: "لم يتم الإجابة", yourMatch: "إجابتك", correctAnswer: "الإجابة الصحيحة" }
    };
    
    function updateLanguage() {
      const t = translations[currentLang];
      document.getElementById('progressLabel').innerText = t.progress;
      document.getElementById('imagesTitle').innerText = t.pictures;
      document.getElementById('wordsTitle').innerText = t.words;
      document.getElementById('checkBtn').innerHTML = t.checkAnswers;
      document.getElementById('resetBtn').innerHTML = t.resetAll;
      document.getElementById('backBtn').innerHTML = t.back;
      document.getElementById('closeModalBtn').innerText = t.close;
      document.querySelectorAll('.drop-placeholder').forEach(el => el.innerText = t.dropPlaceholder);
      if (currentLang === 'ar') { document.documentElement.setAttribute('dir', 'rtl'); document.body.classList.add('rtl'); }
      else { document.documentElement.setAttribute('dir', 'ltr'); document.body.classList.remove('rtl'); }
      localStorage.setItem('dragDropTestLang', currentLang);
    }
    
    function toggleLanguage() { currentLang = currentLang === 'en' ? 'ar' : 'en'; updateLanguage(); }
    
    function handleDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
    function handleDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
    
    function handleDrop(e) {
      e.preventDefault();
      const dropZone = e.currentTarget;
      dropZone.classList.remove('drag-over');
      const wordId = e.dataTransfer.getData('wordId');
      const wordText = e.dataTransfer.getData('wordText');
      const draggedWord = document.querySelector('.word-card[data-word-id="' + wordId + '"]');
      if (!draggedWord || draggedWord.classList.contains('dragged')) return;
      const targetImageId = dropZone.parentElement.dataset.id;
      const targetCorrectWord = dropZone.parentElement.dataset.word;
      const t = translations[currentLang];
      if (wordText.toLowerCase() === targetCorrectWord) {
        dropZone.innerHTML = '<span class="dropped-word">✓ ' + escapeHtmlStatic(wordText) + '</span>';
        dropZone.classList.add('filled');
        draggedWord.classList.add('dragged');
        draggedWord.setAttribute('draggable', 'false');
        draggedWord.style.opacity = '0.4';
        currentMatches[targetImageId] = wordText;
        updateProgress();
      } else {
        dropZone.style.backgroundColor = '#fef2f2';
        dropZone.style.borderColor = '#ef4444';
        setTimeout(() => { dropZone.style.backgroundColor = ''; dropZone.style.borderColor = ''; }, 500);
        showToast(t.wrongMatch, 'error');
      }
    }
    
    function handleDragStart(e) {
      const wordCard = e.target.closest('.word-card');
      if (!wordCard || wordCard.classList.contains('dragged')) { e.preventDefault(); return false; }
      e.dataTransfer.setData('wordId', wordCard.dataset.wordId);
      e.dataTransfer.setData('wordText', wordCard.dataset.word);
      e.dataTransfer.effectAllowed = 'copy';
      wordCard.classList.add('dragging');
    }
    
    function handleDragEnd(e) { const w = e.target.closest('.word-card'); if (w) w.classList.remove('dragging'); }
    
    function initializeGame() {
      document.querySelectorAll('.word-card').forEach((word, idx) => { word.setAttribute('data-word-id', idx + 1); word.addEventListener('dragstart', handleDragStart); word.addEventListener('dragend', handleDragEnd); });
      document.querySelectorAll('.drop-zone').forEach(zone => { zone.addEventListener('dragover', handleDragOver); zone.addEventListener('dragleave', handleDragLeave); zone.addEventListener('drop', handleDrop); });
    }
    
    function updateProgress() {
      const matched = Object.keys(currentMatches).length;
      const percent = (matched / totalQuestions) * 100;
      document.getElementById('progressFill').style.width = percent + '%';
      document.getElementById('progressCount').innerText = matched + '/' + totalQuestions;
    }
    
    function checkAnswers() {
      let score = 0, results = [];
      const t = translations[currentLang];
      for (let i = 0; i < correctMatches.length; i++) {
        const m = correctMatches[i];
        const user = currentMatches[m.id] || null;
        const correct = user && user.toLowerCase() === m.word.toLowerCase();
        if (correct) { score++; results.push({ id: m.id, status: 'correct', user: user, correct: m.word }); }
        else { results.push({ id: m.id, status: user ? 'incorrect' : 'unanswered', user: user || (currentLang === 'ar' ? 'لم يتم الإجابة' : 'Not answered'), correct: m.word }); }
      }
      const finalScore = (score * pointsPerMatch).toFixed(1);
      const total = (totalQuestions * pointsPerMatch).toFixed(1);
      const percentage = Math.round((score / totalQuestions) * 100);
      let emoji = '', msg = '';
      if (percentage >= 85) { emoji = '🌟'; msg = t.excellent; }
      else if (percentage >= 60) { emoji = '👏'; msg = t.goodJob; }
      else { emoji = '📘'; msg = t.keepPracticing; }
      let modalHTML = '<div style="text-align:center"><div style="font-size:3rem">' + emoji + '</div><h2>' + msg + '</h2><div style="font-size:2rem;font-weight:bold;color:#16a34a">' + finalScore + ' / ' + total + '</div><p>✅ ' + score + ' / ' + totalQuestions + '</p><hr><h3>' + (currentLang === 'ar' ? 'النتائج التفصيلية' : 'Detailed Results') + '</h3>';
      results.forEach(r => {
        const icon = r.status === 'correct' ? '✅' : (r.status === 'incorrect' ? '❌' : '⭕');
        const color = r.status === 'correct' ? '#10b981' : (r.status === 'incorrect' ? '#ef4444' : '#f59e0b');
        modalHTML += '<div style="text-align:left;padding:10px;margin:8px 0;background:#f8fafc;border-radius:12px"><span>' + icon + '</span><strong>' + (currentLang === 'ar' ? 'صورة' : 'Picture') + ' ' + r.id + ':</strong><br><span style="margin-left:30px">' + t.yourMatch + ': <span style="color:' + color + '">' + escapeHtmlStatic(r.user) + '</span></span><br><span style="margin-left:30px">' + t.correctAnswer + ': ' + escapeHtmlStatic(r.correct) + '</span></div>';
      });
      modalHTML += '</div>';
      document.getElementById('modalContent').innerHTML = modalHTML;
      document.getElementById('resultModal').classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    
    function resetAll() {
      const t = translations[currentLang];
      document.querySelectorAll('.drop-zone').forEach(z => { z.innerHTML = '<span class="drop-placeholder">' + t.dropPlaceholder + '</span>'; z.classList.remove('filled'); });
      document.querySelectorAll('.word-card').forEach(c => { c.classList.remove('dragged'); c.setAttribute('draggable', 'true'); c.style.opacity = '1'; });
      currentMatches = {};
      updateProgress();
      showToast(t.resetSuccess, 'success');
    }
    
    function goBack() { window.location.href = 'dragdrop_test_maker.html'; }
    function closeModal() { const m = document.getElementById('resultModal'); if (m) { m.classList.remove('show'); document.body.style.overflow = 'auto'; } }
    function showToast(msg, type) { const existing = document.querySelector('.toast-notification'); if (existing) existing.remove(); const toast = document.createElement('div'); toast.className = 'toast-notification'; toast.innerHTML = '<span>' + (type === 'success' ? '✅' : '❌') + '</span><span>' + msg + '</span>'; document.body.appendChild(toast); setTimeout(() => toast.classList.add('show'), 10); setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000); }
    function escapeHtmlStatic(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }
    
    initializeGame();
    document.getElementById('checkBtn').addEventListener('click', checkAnswers);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    document.getElementById('backBtn').addEventListener('click', goBack);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('languageBtn').addEventListener('click', toggleLanguage);
    updateLanguage();
    updateProgress();
  })();
<\/script>
</body>
</html>`;
  }

  // ============================================================
  // PREVIEW FUNCTIONS
  // ============================================================
  function refreshPreview() {
    const t = translations[currentUILang];
    const testData = collectTestData();
    if (!testData || testData.items.length === 0) {
      showToast(t.completeFields, 'info');
      return;
    }
    try {
      previewHTML = buildTestFile(testData);
      if (previewFrame) {
        previewFrame.srcdoc = previewHTML;
        showToast(t.previewUpdated, 'success');
      } else {
        showToast('Preview frame not found', 'error');
      }
    } catch (error) {
      console.error('Preview error:', error);
      showToast('Error generating preview', 'error');
    }
  }

  function togglePreview() {
    const t = translations[currentUILang];
    if (!validateForm()) {
      showToast(t.completeFields, 'info');
      return;
    }
    if (previewSection && previewBtn) {
      if (previewSection.style.display === 'none' || previewSection.style.display === '') {
        refreshPreview();
        previewSection.style.display = 'block';
        previewBtn.innerHTML = t.hidePreview;
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        previewSection.style.display = 'none';
        previewBtn.innerHTML = t.showPreview;
      }
    }
  }

  // ============================================================
  // GENERATE AND DOWNLOAD
  // ============================================================
  function generateAndDownload() {
    const t = translations[currentUILang];
    if (!validateForm()) {
      showToast(t.completeFields, 'info');
      return;
    }
    const testData = collectTestData();
    if (!testData || testData.items.length === 0) {
      showToast(t.completeFields, 'info');
      return;
    }
    try {
      const outputHTML = buildTestFile(testData);
      const fileName = testData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.html';
      const blob = new Blob([outputHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t.testDownloaded, 'success');
    } catch (error) {
      console.error('Generate error:', error);
      showToast('Error generating test', 'error');
    }
  }

  // ============================================================
  // SAVE / LOAD / DELETE / NEW / EDIT
  // ============================================================
  function saveTest() {
    const t = translations[currentUILang];
    const testData = collectTestData();
    if (!testData || testData.items.length === 0) {
      showToast(t.completeFields, 'info');
      return;
    }
    const testId = currentTestId || 'dragdrop_test_' + Date.now();
    const saved = JSON.parse(localStorage.getItem('dragDropTests') || '{}');
    saved[testId] = {
      title: testData.title,
      grade: testData.grade,
      count: testData.count,
      points: testData.points,
      bg: testData.bg,
      items: testData.items,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem('dragDropTests', JSON.stringify(saved));
    currentTestId = testId;
    updateWorkflowButtons();
    loadSavedTestsList();
    showToast(t.testSaved, 'success');
  }

  function loadSavedTestsList() {
    const t = translations[currentUILang];
    const saved = JSON.parse(localStorage.getItem('dragDropTests') || '{}');
    const ids = Object.keys(saved).sort((a, b) => new Date(saved[b].lastModified) - new Date(saved[a].lastModified));
    if (!savedTestsList) return;
    if (ids.length === 0) {
      savedTestsList.innerHTML = '<p style="text-align:center; color: #64748b;">' + t.noSavedTests + '</p>';
      return;
    }
    savedTestsList.innerHTML = '';
    ids.forEach(function(id) {
      const test = saved[id];
      const date = new Date(test.lastModified).toLocaleString();
      const div = document.createElement('div');
      div.className = 'saved-item';
      div.setAttribute('data-id', id);
      div.innerHTML = '<h4>' + escapeHtml(test.title) + '</h4>' +
        '<p>' + escapeHtml(test.grade) + ' • ' + test.count + ' pictures • ' + date + '</p>' +
        '<div style="display:flex; gap:0.5rem; margin-top:0.5rem;">' +
        '<button class="load-action" style="padding:4px 12px; background:#e2e8f0; border:none; border-radius:8px; cursor:pointer;">' + t.load + '</button>' +
        '<button class="delete-action" style="padding:4px 12px; background:#fee2e2; border:none; border-radius:8px; cursor:pointer; color:#dc2626;">' + t.delete + '</button>' +
        '</div>';
      const loadBtnEl = div.querySelector('.load-action');
      const deleteBtnEl = div.querySelector('.delete-action');
      if (loadBtnEl) loadBtnEl.addEventListener('click', function() { loadTest(id); });
      if (deleteBtnEl) deleteBtnEl.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteTest(id);
      });
      savedTestsList.appendChild(div);
    });
  }

  function loadTest(id) {
    const t = translations[currentUILang];
    const saved = JSON.parse(localStorage.getItem('dragDropTests') || '{}');
    const test = saved[id];
    if (!test) return;
    if (document.querySelectorAll('.item-card').length > 0 && !confirm(t.discardChanges)) return;
    
    if (testTitle) testTitle.value = test.title;
    if (gradeSem) gradeSem.value = test.grade;
    if (pictureCount) pictureCount.value = test.count;
    if (pointsPerMatch) pointsPerMatch.value = test.points;
    if (bgColor) bgColor.value = test.bg;
    updateTotalScore();
    
    createItems();
    
    setTimeout(function() {
      test.items.forEach(function(item) {
        const wordInput = document.querySelector(`.matching-word[data-id="${item.id}"]`);
        if (wordInput) wordInput.value = item.word;
        imageDataUrls[item.id] = item.image;
        const img = document.querySelector(`.image-preview[data-id="${item.id}"]`);
        if (img) {
          img.src = item.image;
          img.style.display = 'block';
        }
      });
      validateForm();
    }, 200);
    
    currentTestId = id;
    isEditMode = false;
    if (previewSection) previewSection.style.display = 'none';
    if (previewBtn) previewBtn.innerHTML = t.showPreview;
    if (loadModal) loadModal.classList.remove('show');
    validateForm();
    updateWorkflowButtons();
    showToast(t.testLoaded, 'success');
  }

  function deleteTest(id) {
    const t = translations[currentUILang];
    if (!confirm(t.deleteConfirm)) return;
    const saved = JSON.parse(localStorage.getItem('dragDropTests') || '{}');
    delete saved[id];
    localStorage.setItem('dragDropTests', JSON.stringify(saved));
    if (currentTestId === id) {
      currentTestId = null;
      isEditMode = false;
      updateWorkflowButtons();
    }
    loadSavedTestsList();
    showToast(t.testDeleted, 'success');
  }

  function newTest() {
    const t = translations[currentUILang];
    const items = document.querySelectorAll('.item-card');
    if (items.length > 0 && !confirm(t.newTestConfirm)) return;
    
    if (testTitle) testTitle.value = 'Picture Word Match';
    if (gradeSem) gradeSem.value = 'Grade 1';
    if (pictureCount) pictureCount.value = '4';
    if (pointsPerMatch) pointsPerMatch.value = '1';
    if (bgColor) bgColor.value = 'linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)';
    updateTotalScore();
    
    imageDataUrls = {};
    createItems();
    
    currentTestId = null;
    isEditMode = false;
    if (previewSection) previewSection.style.display = 'none';
    if (previewBtn) previewBtn.innerHTML = t.showPreview;
    
    validateForm();
    updateWorkflowButtons();
    showToast(t.newTestCreated, 'info');
  }

  function enableEditMode() {
    const t = translations[currentUILang];
    if (!currentTestId) {
      showToast(t.saveFirst, 'info');
      return;
    }
    isEditMode = true;
    updateWorkflowButtons();
    showToast(t.editMode, 'info');
  }

  function showLoadModal() {
    loadSavedTestsList();
    if (loadModal) loadModal.classList.add('show');
  }

  function updateWorkflowButtons() {
    if (editBtn) editBtn.disabled = !currentTestId || isEditMode;
  }

  function showToast(message, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<span>' + (type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')) + '</span><span>' + escapeHtml(message) + '</span>';
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================
  if (syncItemsBtn) syncItemsBtn.addEventListener('click', syncItems);
  if (pictureCount) pictureCount.addEventListener('change', function() { createItems(); });
  if (generateBtn) generateBtn.addEventListener('click', generateAndDownload);
  if (previewBtn) previewBtn.addEventListener('click', togglePreview);
  if (refreshPreviewBtn) refreshPreviewBtn.addEventListener('click', refreshPreview);
  if (newBtn) newBtn.addEventListener('click', newTest);
  if (saveBtn) saveBtn.addEventListener('click', saveTest);
  if (loadBtn) loadBtn.addEventListener('click', showLoadModal);
  if (editBtn) editBtn.addEventListener('click', enableEditMode);
  if (closeLoadModal) closeLoadModal.addEventListener('click', function() { if (loadModal) loadModal.classList.remove('show'); });
  if (loadModal) loadModal.addEventListener('click', function(e) {
    if (e.target === loadModal) loadModal.classList.remove('show');
  });

  // ============================================================
  // INITIALIZE
  // ============================================================
  updateUILanguage();
  createItems();
  validateForm();
  loadSavedTestsList();
});