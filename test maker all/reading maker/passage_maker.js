document.addEventListener('DOMContentLoaded', function() {
  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const testTitle = document.getElementById('testTitle');
  const gradeSem = document.getElementById('gradeSem');
  const instructions = document.getElementById('instructions');
  const passageText = document.getElementById('passageText');
  const questionsCount = document.getElementById('questionsCount');
  const pointsPerAnswer = document.getElementById('pointsPerAnswer');
  const totalScore = document.getElementById('totalScore');
  const wordLimit = document.getElementById('wordLimit');
  const bgColor = document.getElementById('bgColor');
  const syncQuestionsBtn = document.getElementById('syncQuestionsBtn');
  const questionsContainer = document.getElementById('questionsContainer');
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
  let currentUILang = localStorage.getItem('passageUILang') || 'en';
  let questionsData = [];

  // ============================================================
  // TRANSLATIONS
  // ============================================================
  const translations = {
    en: {
      sidebarTitle: "📖 Passage Test Maker",
      sidebarDesc: "Create reading comprehension tests with passage and written answers",
      tipTitle: "💡 How to use",
      tipList: [
        "Enter test title, grade & semester",
        "Set number of questions, points per answer, word limit",
        "Write or paste the passage text",
        "Add questions and multiple possible answers (comma separated)",
        "Preview → Generate → Download"
      ],
      settingsTitle: "⚙️ Test Settings",
      testTitleLabel: "Test Title",
      gradeLabel: "Grade & Semester",
      instructionsLabel: "Instructions",
      questionsCountLabel: "Number of Questions",
      pointsLabel: "Points per Answer",
      totalScoreLabel: "Total Score",
      wordLimitLabel: "Max Words per Answer",
      bgColorLabel: "Background Color",
      passageTitle: "📄 Passage Text",
      passageLabel: "Passage Content",
      questionsTitle: "❓ Questions & Acceptable Answers",
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
      syncQuestions: "🔄 Sync Questions",
      refreshPreview: "🔄 Refresh",
      delete: "Delete",
      load: "Load",
      noSavedTests: "No saved tests found",
      question: "Question",
      acceptableAnswers: "Acceptable Answers (comma separated)",
      deleteConfirm: "Delete this test permanently?",
      discardChanges: "Discard current changes?",
      completeFields: "Please complete all fields first",
      previewUpdated: "Preview updated",
      testDownloaded: "Test downloaded successfully! 🎉",
      testSaved: "Test saved successfully",
      testLoaded: "Test loaded successfully",
      testDeleted: "Test deleted",
      newTestCreated: "New test created",
      saveFirst: "Save the test first",
      editMode: "Edit mode: make changes and click Save",
      newTestConfirm: "Discard current changes and create a new test?",
      minQuestions: "You must have at least one question",
      back: "← Back"
    },
    ar: {
      sidebarTitle: "📖 منشئ اختبار الفهم القرائي",
      sidebarDesc: "أنشئ اختبارات فهم المقروء مع إجابات كتابية",
      tipTitle: "💡 طريقة الاستخدام",
      tipList: [
        "أدخل عنوان الاختبار والصف الدراسي",
        "حدد عدد الأسئلة والدرجة لكل سؤال والحد الأقصى للكلمات",
        "اكتب أو الصق النص",
        "أضف الأسئلة والإجابات المقبولة (مفصولة بفواصل)",
        "معاينة ← إنشاء ← تحميل"
      ],
      settingsTitle: "⚙️ إعدادات الاختبار",
      testTitleLabel: "عنوان الاختبار",
      gradeLabel: "الصف الدراسي",
      instructionsLabel: "التعليمات",
      questionsCountLabel: "عدد الأسئلة",
      pointsLabel: "الدرجة لكل سؤال",
      totalScoreLabel: "الدرجة الكلية",
      wordLimitLabel: "الحد الأقصى للكلمات لكل إجابة",
      bgColorLabel: "لون الخلفية",
      passageTitle: "📄 النص",
      passageLabel: "محتوى النص",
      questionsTitle: "❓ الأسئلة والإجابات المقبولة",
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
      syncQuestions: "🔄 مزامنة الأسئلة",
      refreshPreview: "🔄 تحديث",
      delete: "حذف",
      load: "تحميل",
      noSavedTests: "لا توجد اختبارات محفوظة",
      question: "سؤال",
      acceptableAnswers: "الإجابات المقبولة (مفصولة بفواصل)",
      deleteConfirm: "هل تريد حذف هذا الاختبار نهائياً؟",
      discardChanges: "هل تريد تجاهل التغييرات الحالية؟",
      completeFields: "الرجاء إكمال جميع الحقول أولاً",
      previewUpdated: "تم تحديث المعاينة",
      testDownloaded: "تم تحميل الاختبار بنجاح! 🎉",
      testSaved: "تم حفظ الاختبار بنجاح",
      testLoaded: "تم تحميل الاختبار بنجاح",
      testDeleted: "تم حذف الاختبار",
      newTestCreated: "تم إنشاء اختبار جديد",
      saveFirst: "احفظ الاختبار أولاً",
      editMode: "وضع التعديل: قم بالتغييرات ثم اضغط حفظ",
      newTestConfirm: "هل تريد تجاهل التغييرات الحالية وإنشاء اختبار جديد؟",
      minQuestions: "يجب أن يكون لديك سؤال واحد على الأقل",
      back: "← رجوع"
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
    document.getElementById('passageTitle').innerHTML = t.passageTitle;
    document.getElementById('questionsTitle').innerHTML = t.questionsTitle;
    document.getElementById('previewTitle').innerHTML = t.previewTitle;
    document.getElementById('modalTitle').innerText = t.modalTitle;
    
    newBtn.innerHTML = t.newBtn;
    saveBtn.innerHTML = t.saveBtn;
    loadBtn.innerHTML = t.loadBtn;
    editBtn.innerHTML = t.editBtn;
    const isPreviewVisible = previewSection.style.display !== 'none';
    previewBtn.innerHTML = isPreviewVisible ? t.hidePreview : t.showPreview;
    generateBtn.innerHTML = t.generateBtn;
    if (syncQuestionsBtn) syncQuestionsBtn.innerHTML = t.syncQuestions;
    if (refreshPreviewBtn) refreshPreviewBtn.innerHTML = t.refreshPreview;
    
    document.getElementById('testTitleLabel').childNodes[0].textContent = t.testTitleLabel + ' ';
    document.getElementById('gradeLabel').childNodes[0].textContent = t.gradeLabel + ' ';
    document.getElementById('instructionsLabel').childNodes[0].textContent = t.instructionsLabel + ' ';
    document.getElementById('questionsCountLabel').childNodes[0].textContent = t.questionsCountLabel + ' ';
    document.getElementById('pointsLabel').childNodes[0].textContent = t.pointsLabel + ' ';
    document.getElementById('totalScoreLabel').childNodes[0].textContent = t.totalScoreLabel + ' ';
    document.getElementById('wordLimitLabel').childNodes[0].textContent = t.wordLimitLabel + ' ';
    document.getElementById('bgColorLabel').childNodes[0].textContent = t.bgColorLabel + ' ';
    document.getElementById('passageLabel').childNodes[0].textContent = t.passageLabel + ' ';
    
    const htmlRoot = document.documentElement;
    const body = document.body;
    if (currentUILang === 'ar') {
      htmlRoot.setAttribute('dir', 'rtl');
      body.classList.add('rtl');
    } else {
      htmlRoot.setAttribute('dir', 'ltr');
      body.classList.remove('rtl');
    }
    localStorage.setItem('passageUILang', currentUILang);
    renderQuestions();
  }

  function toggleUILanguage() {
    currentUILang = currentUILang === 'en' ? 'ar' : 'en';
    updateUILanguage();
  }
  if (uiLangBtn) uiLangBtn.addEventListener('click', toggleUILanguage);

  // ============================================================
  // UTILITIES
  // ============================================================
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span><span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
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

  function updateTotalScore() {
    const count = parseInt(questionsCount.value) || 0;
    const points = parseFloat(pointsPerAnswer.value) || 0;
    const total = (count * points).toFixed(1);
    if (totalScore) totalScore.value = total;
    return total;
  }
  questionsCount.addEventListener('input', updateTotalScore);
  pointsPerAnswer.addEventListener('input', updateTotalScore);
  updateTotalScore();

  // ============================================================
  // RENDER QUESTIONS
  // ============================================================
  function renderQuestions() {
    if (!questionsContainer) return;
    const t = translations[currentUILang];
    const targetCount = parseInt(questionsCount.value) || 0;
    
    while (questionsData.length < targetCount) {
      questionsData.push({ text: '', acceptableAnswers: [] });
    }
    while (questionsData.length > targetCount) {
      questionsData.pop();
    }
    
    questionsContainer.innerHTML = '';
    for (let i = 0; i < questionsData.length; i++) {
      const q = questionsData[i];
      const card = document.createElement('div');
      card.className = 'question-card';
      card.dataset.qIndex = i;
      card.innerHTML = `
        <div class="question-header">
          <span class="question-number">${t.question} ${i+1}</span>
          <button type="button" class="delete-question" data-index="${i}">${t.delete}</button>
        </div>
        <label>${t.question} Text
          <input type="text" class="question-text" data-index="${i}" value="${escapeHtml(q.text)}" placeholder="e.g., When was he born?">
        </label>
        <label style="margin-top: 0.8rem;">${t.acceptableAnswers}
          <input type="text" class="acceptable-answers" data-index="${i}" value="${escapeHtml(q.acceptableAnswers.join(', '))}" placeholder="e.g., 1990, in 1990, he was born in 1990">
        </label>
        <div class="hint" style="font-size:0.75rem; color:#64748b; margin-top:4px;">💡 Separate multiple answers with commas</div>
      `;
      questionsContainer.appendChild(card);
      
      card.querySelector('.delete-question').addEventListener('click', () => {
        if (questionsData.length <= 1) {
          showToast(t.minQuestions, 'error');
          return;
        }
        questionsData.splice(i, 1);
        questionsCount.value = questionsData.length;
        updateTotalScore();
        renderQuestions();
        validateForm();
      });
      card.querySelector('.question-text').addEventListener('input', (e) => {
        questionsData[i].text = e.target.value;
        validateForm();
      });
      card.querySelector('.acceptable-answers').addEventListener('input', (e) => {
        const raw = e.target.value;
        const arr = raw.split(',').map(s => s.trim()).filter(s => s);
        questionsData[i].acceptableAnswers = arr;
        validateForm();
      });
    }
    validateForm();
  }

  function syncQuestions() {
    renderQuestions();
  }

  // ============================================================
  // VALIDATION
  // ============================================================
  function validateForm() {
    const title = testTitle.value.trim();
    const passage = passageText.value.trim();
    let valid = title && passage && questionsData.length > 0;
    for (let q of questionsData) {
      if (!q.text.trim() || q.acceptableAnswers.length === 0) valid = false;
    }
    generateBtn.disabled = !valid;
    previewBtn.disabled = !valid;
    saveBtn.disabled = !valid;
    return valid;
  }

  // ============================================================
  // COLLECT TEST DATA
  // ============================================================
  function collectTestData() {
    return {
      title: testTitle.value.trim(),
      grade: gradeSem.value.trim(),
      instructions: instructions.value.trim(),
      passage: passageText.value.trim(),
      pointsPerAnswer: parseFloat(pointsPerAnswer.value) || 1,
      wordLimit: parseInt(wordLimit.value) || 0,
      bgColor: bgColor.value,
      questions: questionsData.map(q => ({
        text: q.text,
        acceptableAnswers: q.acceptableAnswers
      }))
    };
  }

  function normalizeAnswer(str) {
    return str.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
  }

  // ============================================================
  // BUILD TEST FILE (FULL CSS + dynamic background)
  // ============================================================
  function buildTestFile(data) {
    const maxWords = data.wordLimit;
    const isUnlimited = (maxWords === 0);
    const bgGradient = data.bgColor; // selected by user
    const questionsWithPipe = data.questions.map(q => ({
      text: q.text,
      correct: q.acceptableAnswers.join('|'),
      answersList: q.acceptableAnswers
    }));
    
    let questionsHTML = '';
    questionsWithPipe.forEach((q, idx) => {
      questionsHTML += `
        <div class="question-item" data-id="${idx+1}" data-correct="${escapeHtml(q.correct)}">
          <div class="question-number">Question ${idx+1}</div>
          <div class="question-text">${escapeHtml(q.text)}</div>
          <div class="answer-hint"><i class="fas fa-search"></i> Look for the answer in the passage above.</div>
          <input type="text" class="answer-input" placeholder="Type your answer here (${isUnlimited ? 'no word limit' : 'max ' + maxWords + ' words'})" ${!isUnlimited ? `maxlength="${maxWords * 15}"` : ''}>
          <div class="word-count">Words: <span>0</span>${!isUnlimited ? ' / ' + maxWords : ''}</div>
          <div class="correct-answer">Correct answer: <span>${escapeHtml(q.correct.replace(/\|/g, ' / '))}</span></div>
        </div>
      `;
    });

    // Format passage into paragraphs
    let passageHTML = '';
    const paragraphs = data.passage.split(/\n\s*\n/);
    paragraphs.forEach((para, idx) => {
      if (para.trim()) {
        passageHTML += `<div class="text-paragraph"><span class="paragraph-number">${idx+1}</span>${para.replace(/\n/g, '<br>')}</div>`;
      }
    });
    if (paragraphs.length === 1 && !data.passage.includes('\n\n')) {
      passageHTML = `<div class="text-paragraph"><span class="paragraph-number">1</span>${data.passage.replace(/\n/g, '<br>')}</div>`;
    }

    const totalQuestions = data.questions.length;
    const points = data.pointsPerAnswer;
    const totalPoints = (totalQuestions * points).toFixed(1);

    // Full CSS including dynamic background
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.title)} - Reading Test</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background: ${bgGradient}; color: #f9aa33; line-height: 1.6; min-height: 100vh; padding: 20px; }
    .container { max-width: 1400px; margin: 0 auto; }
    header { background: rgba(255,255,255,0.95); border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(74,101,114,0.2); border: 1px solid rgba(255,255,255,0.3); position: relative; overflow: hidden; }
    .header-content { padding: 30px; text-align: center; }
    header::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: linear-gradient(90deg, #f9aa33, #ffb74d, #ffb74d, #4a6572); background-size: 400% 400%; animation: gradientShift 3s ease infinite; }
    @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    h1 { font-size: 2.5rem; margin-bottom: 10px; background: linear-gradient(90deg, #344955, #4a6572); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 15px; }
    h1 i { font-size: 2.8rem; color: #f9aa33; }
    .subtitle { font-size: 1.2rem; color: #4a6572; font-weight: 500; margin-bottom: 20px; }
    .header-info { display: flex; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
    .info-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; background: #f5f5f5; border-radius: 50px; font-weight: 500; color: #344955; font-size: 0.95rem; }
    .info-item i { color: #f9aa33; font-size: 1.1rem; }
    .instructions { background: rgba(255,255,255,0.95); border-radius: 15px; padding: 25px; margin-bottom: 25px; box-shadow: 0 8px 25px rgba(74,101,114,0.1); border: 1px solid rgba(255,255,255,0.3); }
    .instructions h2 { font-size: 1.5rem; margin-bottom: 20px; color: #344955; display: flex; align-items: center; gap: 10px; }
    .instruction-content p { margin-bottom: 15px; font-size: 1.05rem; display: flex; align-items: flex-start; gap: 12px; line-height: 1.7; color: #4a6572; }
    .instruction-content i { color: #f9aa33; margin-top: 3px; }
    .test-content { display: flex; gap: 30px; margin-bottom: 30px; }
    .left-column { flex: 1; order: 1; }
    .right-column { flex: 1; order: 2; }
    .reading-text-section { background: rgba(255,255,255,0.95); border-radius: 15px; padding: 25px; box-shadow: 0 8px 25px rgba(74,101,114,0.1); border: 1px solid rgba(255,255,255,0.3); height: fit-content; position: sticky; top: 20px; max-height: 85vh; overflow-y: auto; }
    .reading-text-section::-webkit-scrollbar { width: 8px; }
    .reading-text-section::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
    .reading-text-section::-webkit-scrollbar-thumb { background: #f9aa33; border-radius: 4px; }
    .reading-text-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0; position: sticky; top: 0; background: white; z-index: 10; padding: 15px; margin: -15px -15px 15px -15px; }
    .reading-text-header h2 { font-size: 1.8rem; color: #344955; display: flex; align-items: center; gap: 15px; }
    .word-limit { background: #f9aa33; color: white; padding: 8px 15px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }
    .reading-text-content { line-height: 1.8; font-size: 1.15rem; color: #344955; }
    .text-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0; }
    .letter-icon { font-size: 3rem; background: linear-gradient(135deg, #f9aa33, #ff8a00); width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
    .letter-info h3 { font-size: 1.6rem; color: #344955; margin-bottom: 5px; }
    .letter-meta { color: #4a6572; font-style: italic; }
    .text-paragraph { margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 12px; border-left: 5px solid #4a6572; position: relative; box-shadow: 0 3px 10px rgba(0,0,0,0.05); }
    .paragraph-number { position: absolute; top: -12px; left: -12px; width: 35px; height: 35px; background: #f9aa33; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; box-shadow: 0 3px 8px rgba(0,0,0,0.2); }
    .questions-section { background: rgba(255,255,255,0.95); border-radius: 15px; padding: 30px; box-shadow: 0 8px 25px rgba(74,101,114,0.1); border: 1px solid rgba(255,255,255,0.3); max-height: 85vh; overflow-y: auto; }
    .questions-header { margin-bottom: 30px; text-align: center; }
    .questions-header h2 { font-size: 1.8rem; color: #344955; display: flex; align-items: center; justify-content: center; gap: 15px; }
    .section-description { color: #4a6572; font-size: 1.1rem; margin-top: 10px; }
    .answer-tips { margin-top: 15px; padding: 12px 20px; background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 10px; color: #ef6c00; font-weight: 600; display: inline-flex; align-items: center; gap: 10px; border: 2px dashed #f9aa33; }
    .question-item { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 6px solid #344955; border: 1px solid #e0e0e0; transition: all 0.3s ease; position: relative; }
    .question-item:hover { transform: translateX(5px); box-shadow: 0 8px 25px rgba(52,73,85,0.1); border-left-color: #f9aa33; }
    .question-number { font-size: 1.3rem; font-weight: 700; color: #344955; margin-bottom: 15px; display: flex; align-items: center; }
    .question-number::before { content: attr(data-num); display: inline-block; width: 35px; height: 35px; background: #4a6572; border-radius: 50%; margin-right: 15px; color: white; text-align: center; line-height: 35px; font-size: 1.1rem; font-weight: bold; }
    .question-text { font-size: 1.25rem; font-weight: 700; margin-bottom: 20px; color: #1565c0; padding: 18px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px; border-left: 5px solid #2196f3; font-family: 'Merriweather', serif; }
    .answer-hint { margin-bottom: 15px; padding: 12px 15px; background: #f5f5f5; border-radius: 8px; color: #666; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; border-left: 4px solid #9e9e9e; }
    .answer-hint i { color: #f9aa33; }
    .answer-input { width: 100%; padding: 18px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1.1rem; font-family: 'Poppins', sans-serif; transition: all 0.3s ease; background: white; color: #344955; }
    .answer-input:focus { outline: none; border-color: #f9aa33; box-shadow: 0 0 0 3px rgba(249,170,51,0.3); background: #fffde7; }
    .word-count { text-align: right; margin-top: 10px; font-size: 0.95rem; color: #757575; font-weight: 500; display: flex; align-items: center; justify-content: flex-end; gap: 5px; }
    .word-count span { font-weight: 700; color: #344955; }
    .answer-input.correct { border-color: #4caf50; background-color: #e8f5e9; }
    .answer-input.incorrect { border-color: #f44336; background-color: #ffebee; }
    .answer-input.show-correct { border-color: #2196f3; background-color: #e3f2fd; }
    .correct-answer { margin-top: 15px; padding: 15px; background: #e8f5e9; border-radius: 10px; border-left: 5px solid #4caf50; color: #2e7d32; font-weight: 700; font-size: 1.1rem; display: none; }
    .correct-answer.show { display: block; animation: fadeIn 0.3s ease; }
    .actions { display: flex; justify-content: center; gap: 20px; margin: 40px 0 30px; flex-wrap: wrap; }
    .btn { padding: 16px 32px; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 5px 15px rgba(74,101,114,0.15); min-width: 200px; }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(74,101,114,0.25); }
    .btn-check { background: linear-gradient(135deg, #4a6572, #344955); color: white; }
    .btn-reset { background: linear-gradient(135deg, #f9aa33, #ff8a00); color: white; }
    .btn-show { background: linear-gradient(135deg, #90a4ae, #4a6572); color: white; }
    .btn-back { background: linear-gradient(135deg, #78909c, #546e7a); color: white; }
    .btn-swap { background: linear-gradient(135deg, #a1887f, #8d6e63); color: white; }
    .results { background: rgba(255,255,255,0.95); border-radius: 15px; padding: 30px; margin-top: 20px; box-shadow: 0 8px 25px rgba(74,101,114,0.1); border: 1px solid rgba(255,255,255,0.3); display: none; animation: fadeIn 0.5s ease; }
    .results.show { display: block; }
    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0; }
    .close-results { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .score-container { text-align: center; }
    .score-display { display: flex; align-items: center; justify-content: center; gap: 50px; margin-bottom: 30px; flex-wrap: wrap; }
    .score-circle svg { width: 120px; height: 120px; }
    .score-circle-bg { fill: none; stroke: #f0f0f0; stroke-width: 10; }
    .score-circle-progress { fill: none; stroke: #f9aa33; stroke-width: 10; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50% 50%; stroke-dasharray: 339; stroke-dashoffset: 339; transition: stroke-dashoffset 1s ease; }
    .score-text { font-size: 1.6rem; font-weight: 700; fill: #344955; }
    .score-total { font-size: 2.2rem; font-weight: 700; margin-bottom: 25px; color: #344955; }
    .score-label { display: block; font-size: 1.3rem; color: #4a6572; }
    .score-value { color: #f9aa33; font-size: 2.8rem; }
    .feedback { padding: 25px; background: #f9f9f9; border-radius: 12px; margin-bottom: 30px; font-size: 1.2rem; line-height: 1.7; color: #344955; font-weight: 600; }
    .results-actions { display: flex; justify-content: center; gap: 25px; flex-wrap: wrap; }
    footer { text-align: center; padding: 25px; color: white; margin-top: 30px; background: rgba(0,0,0,0.2); border-radius: 15px; }
    @media (max-width: 767px) { .test-content { flex-direction: column; } .left-column, .right-column { order: initial; width: 100%; } .reading-text-section { position: static; max-height: none; } .actions .btn { width: 100%; max-width: 320px; } }
    .layout-swapped .test-content { flex-direction: row; }
    .layout-swapped .left-column { order: 2; }
    .layout-swapped .right-column { order: 1; }
    .layout-swapped .questions-section { position: sticky; top: 20px; }
    .layout-swapped .reading-text-section { position: static; max-height: none; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
<div class="container">
  <header><div class="header-content"><h1><i class="fas fa-file-alt"></i> ${escapeHtml(data.title)}</h1><p class="subtitle">${escapeHtml(data.grade)}</p><div class="header-info"><div class="info-item"><i class="fas fa-question-circle"></i><span>Questions: ${totalQuestions}</span></div><div class="info-item"><i class="fas fa-star"></i><span>Total Score: ${totalPoints}</span></div><div class="info-item"><i class="fas fa-info-circle"></i><span>Read on Right - Answer on Left</span></div></div></div></header>
  <div class="instructions"><h2><i class="fas fa-info-circle"></i> Instructions</h2><div class="instruction-content"><p><i class="fas fa-book-reader"></i> <strong>Read the text on the RIGHT side</strong> carefully.</p><p><i class="fas fa-keyboard"></i> <strong>Answer the questions on the LEFT side</strong> (${isUnlimited ? 'no word limit' : 'not more than ' + maxWords + ' words'}).</p><p><i class="fas fa-lightbulb"></i> Pay attention to spelling and key information.</p><p><i class="fas fa-arrows-alt-h"></i> On mobile: Scroll down for text, then answer questions.</p></div></div>
  <main class="test-content">
    <div class="left-column"><section class="questions-section"><div class="questions-header"><h2><i class="fas fa-question-circle"></i> Questions (1 - ${totalQuestions})</h2><p class="section-description">Write your answers in the boxes below</p><div class="answer-tips"><i class="fas fa-lightbulb"></i> Read the text first on the right side →</div></div>${questionsHTML}</section></div>
    <div class="right-column"><section class="reading-text-section"><div class="reading-text-header"><h2><i class="fas fa-book-open"></i> Reading Text</h2><div class="word-limit"><i class="fas fa-text-height"></i> Read Carefully</div></div><div class="reading-text-content"><div class="text-header"><div class="letter-icon">📝</div><div class="letter-info"><h3>Reading Passage</h3><p class="letter-meta">Read the text and answer the questions</p></div></div>${passageHTML}</div></section></div>
  </main>
  <div class="actions"><button class="btn btn-back" id="back-btn"><i class="fas fa-arrow-left"></i> Back to Main Menu</button><button class="btn btn-check" id="check-btn"><i class="fas fa-check-circle"></i> Check Answers</button><button class="btn btn-reset" id="reset-btn"><i class="fas fa-redo"></i> Reset All</button><button class="btn btn-show" id="show-btn"><i class="fas fa-eye"></i> Show Answers</button><button class="btn btn-swap" id="swap-btn"><i class="fas fa-exchange-alt"></i> Swap Layout</button></div>
  <div class="results" id="results"><div class="results-header"><h2><i class="fas fa-chart-line"></i> Test Results</h2><button class="close-results" id="close-results"><i class="fas fa-times"></i></button></div><div class="score-container"><div class="score-display"><div class="score-circle"><svg width="120" height="120" viewBox="0 0 120 120"><circle class="score-circle-bg" cx="60" cy="60" r="54"></circle><circle class="score-circle-progress" cx="60" cy="60" r="54" id="score-circle"></circle><text x="60" y="65" text-anchor="middle" class="score-text" id="score-percent">0%</text></svg></div><div class="score-details"><div class="score-total"><span class="score-label">Your Score:</span><span class="score-value" id="score-value">0</span>/${totalQuestions}</div><div class="feedback" id="feedback"><p>Complete the test to see your results!</p></div></div></div><div class="results-actions"><button class="btn btn-review" id="review-btn"><i class="fas fa-search"></i> Review Answers</button><button class="btn btn-try-again" id="try-again-btn"><i class="fas fa-sync-alt"></i> Try Again</button></div></div></div>
  <footer><p>${escapeHtml(data.title)} &copy; 2025 | ${escapeHtml(data.grade)}</p><p class="footer-note">Reading Test - Short Answers | Text on Right - Questions on Left</p></footer>
</div>
<script>
  (function() {
    const totalQuestions = ${totalQuestions};
    const pointsPerQuestion = ${points};
    const maxWords = ${maxWords};
    const isUnlimited = ${isUnlimited};
    const correctAnswersList = ${JSON.stringify(data.questions.map(q => q.acceptableAnswers))};
    let userAnswers = new Array(totalQuestions).fill('');
    let showCorrectMode = false;
    function normalize(str) { return str.trim().toLowerCase().replace(/[^\\w\\s]/g, '').replace(/\\s+/g, ' '); }
    function updateWordCounts() {
      document.querySelectorAll('.question-item').forEach((item, idx) => {
        const input = item.querySelector('.answer-input');
        const wordSpan = item.querySelector('.word-count span');
        if (input && wordSpan) {
          const words = input.value.trim().split(/\\s+/).filter(w => w.length > 0);
          const count = words.length;
          if (!isUnlimited) {
            wordSpan.textContent = count + ' / ' + maxWords;
            if (count > maxWords) { wordSpan.style.color = '#f44336'; input.style.borderColor = '#f44336'; input.style.backgroundColor = '#ffebee'; }
            else { wordSpan.style.color = '#344955'; if (!showCorrectMode && !input.classList.contains('correct') && !input.classList.contains('incorrect')) { input.style.borderColor = '#e0e0e0'; input.style.backgroundColor = 'white'; } }
          } else { wordSpan.textContent = count; }
        }
      });
    }
    function isWordLimitValid() { if (isUnlimited) return true; let valid = true; document.querySelectorAll('.question-item').forEach((item, idx) => { const input = item.querySelector('.answer-input'); const words = input.value.trim().split(/\\s+/).filter(w => w.length > 0); if (words.length > maxWords) valid = false; }); return valid; }
    function checkAnswers() {
      if (!isUnlimited && !isWordLimitValid()) { alert('Some answers exceed the word limit (' + maxWords + ' words). Please shorten your answers.'); return; }
      let score = 0;
      document.querySelectorAll('.question-item').forEach((item, idx) => {
        const input = item.querySelector('.answer-input');
        const userAnswer = input.value;
        const normalizedUser = normalize(userAnswer);
        const acceptable = correctAnswersList[idx];
        let isCorrect = false;
        for (let ans of acceptable) { if (normalizedUser === normalize(ans)) { isCorrect = true; break; } }
        if (isCorrect) { score++; input.classList.add('correct'); input.classList.remove('incorrect'); }
        else { input.classList.add('incorrect'); input.classList.remove('correct'); }
      });
      const percent = Math.round((score / totalQuestions) * 100);
      const earnedPoints = (score * pointsPerQuestion).toFixed(1);
      document.getElementById('score-value').textContent = earnedPoints;
      document.getElementById('score-percent').textContent = percent + '%';
      const circumference = 2 * Math.PI * 54;
      const offset = circumference - (percent / 100) * circumference;
      const scoreCircle = document.getElementById('score-circle');
      scoreCircle.style.strokeDasharray = circumference;
      scoreCircle.style.strokeDashoffset = offset;
      let message = (percent >= 80) ? 'Excellent! 🌟 Great reading comprehension!' : (percent >= 60) ? 'Good job! 👏 Keep practicing!' : 'Keep practicing! 📚 Review the text and try again.';
      document.getElementById('feedback').innerHTML = '<p>' + message + '</p>';
      document.getElementById('results').classList.add('show');
      showCorrectMode = false;
    }
    function resetAll() {
      document.querySelectorAll('.question-item').forEach((item, idx) => {
        const input = item.querySelector('.answer-input');
        input.value = ''; input.classList.remove('correct', 'incorrect', 'show-correct'); input.style.borderColor = '#e0e0e0'; input.style.backgroundColor = 'white';
        userAnswers[idx] = '';
      });
      showCorrectMode = false; updateWordCounts();
      const resultsDiv = document.getElementById('results'); if (resultsDiv.classList.contains('show')) resultsDiv.classList.remove('show');
    }
    function showAnswers() {
      if (showCorrectMode) return;
      showCorrectMode = true;
      document.querySelectorAll('.question-item').forEach((item, idx) => {
        const input = item.querySelector('.answer-input');
        input.classList.add('show-correct'); input.classList.remove('correct', 'incorrect');
        const correctSpan = item.querySelector('.correct-answer'); if (correctSpan) correctSpan.classList.add('show');
      });
    }
    function collectUserAnswers() { document.querySelectorAll('.question-item').forEach((item, idx) => { userAnswers[idx] = item.querySelector('.answer-input').value; }); updateWordCounts(); }
    document.querySelectorAll('.answer-input').forEach((input, idx) => {
      input.addEventListener('input', () => { userAnswers[idx] = input.value; updateWordCounts(); input.classList.remove('correct', 'incorrect', 'show-correct'); const correctSpan = input.closest('.question-item').querySelector('.correct-answer'); if (correctSpan) correctSpan.classList.remove('show'); showCorrectMode = false; });
    });
    document.getElementById('check-btn').addEventListener('click', () => { collectUserAnswers(); checkAnswers(); });
    document.getElementById('reset-btn').addEventListener('click', () => { resetAll(); });
    document.getElementById('show-btn').addEventListener('click', () => { collectUserAnswers(); showAnswers(); });
    document.getElementById('back-btn').addEventListener('click', () => { window.location.href = 'passage_test_maker.html'; });
    let swapped = false;
    document.getElementById('swap-btn').addEventListener('click', () => { const tc = document.querySelector('.test-content'); if (swapped) { tc.classList.remove('layout-swapped'); swapped = false; } else { tc.classList.add('layout-swapped'); swapped = true; } });
    document.getElementById('close-results').addEventListener('click', () => { document.getElementById('results').classList.remove('show'); });
    document.getElementById('review-btn').addEventListener('click', () => { checkAnswers(); });
    document.getElementById('try-again-btn').addEventListener('click', () => { resetAll(); document.getElementById('results').classList.remove('show'); });
    updateWordCounts();
  })();
</script>
</body>
</html>`;
  }

  // ============================================================
  // PREVIEW, GENERATE, SAVE, LOAD, etc.
  // ============================================================
  function refreshPreview() {
    const t = translations[currentUILang];
    if (!validateForm()) { showToast(t.completeFields, 'info'); return; }
    const data = collectTestData();
    const html = buildTestFile(data);
    previewFrame.srcdoc = html;
    showToast(t.previewUpdated, 'success');
  }

  function togglePreview() {
    const t = translations[currentUILang];
    if (!validateForm()) { showToast(t.completeFields, 'info'); return; }
    if (previewSection.style.display === 'none') {
      refreshPreview();
      previewSection.style.display = 'block';
      previewBtn.innerHTML = t.hidePreview;
      previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      previewSection.style.display = 'none';
      previewBtn.innerHTML = t.showPreview;
    }
  }

  function generateAndDownload() {
    const t = translations[currentUILang];
    if (!validateForm()) { showToast(t.completeFields, 'info'); return; }
    const data = collectTestData();
    const html = buildTestFile(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t.testDownloaded, 'success');
  }

  function saveTest() {
    const t = translations[currentUILang];
    if (!validateForm()) { showToast(t.completeFields, 'error'); return; }
    const data = collectTestData();
    const testId = currentTestId || 'passage_test_' + Date.now();
    const saved = JSON.parse(localStorage.getItem('passageTests') || '{}');
    saved[testId] = { ...data, lastModified: new Date().toISOString() };
    localStorage.setItem('passageTests', JSON.stringify(saved));
    currentTestId = testId;
    updateWorkflowButtons();
    loadSavedTestsList();
    showToast(t.testSaved, 'success');
  }

  function loadSavedTestsList() {
    const t = translations[currentUILang];
    const saved = JSON.parse(localStorage.getItem('passageTests') || '{}');
    const ids = Object.keys(saved).sort((a,b) => new Date(saved[b].lastModified) - new Date(saved[a].lastModified));
    if (!savedTestsList) return;
    if (ids.length === 0) { savedTestsList.innerHTML = `<p style="text-align:center; color:#64748b;">${t.noSavedTests}</p>`; return; }
    savedTestsList.innerHTML = '';
    ids.forEach(id => {
      const test = saved[id];
      const date = new Date(test.lastModified).toLocaleString();
      const div = document.createElement('div');
      div.className = 'saved-item';
      div.innerHTML = `<h4>${escapeHtml(test.title)}</h4><p>${test.questions.length} questions • ${date}</p><div style="display:flex; gap:0.5rem; margin-top:0.5rem;"><button class="load-action" data-id="${id}" style="padding:4px 12px; background:#e2e8f0; border:none; border-radius:8px; cursor:pointer;">${t.load}</button><button class="delete-action" data-id="${id}" style="padding:4px 12px; background:#fee2e2; border:none; border-radius:8px; cursor:pointer; color:#dc2626;">${t.delete}</button></div>`;
      div.querySelector('.load-action').addEventListener('click', () => loadTest(id));
      div.querySelector('.delete-action').addEventListener('click', (e) => { e.stopPropagation(); deleteTest(id); });
      savedTestsList.appendChild(div);
    });
  }

  function loadTest(id) {
    const t = translations[currentUILang];
    const saved = JSON.parse(localStorage.getItem('passageTests') || '{}');
    const test = saved[id];
    if (!test) return;
    if (questionsData.length > 0 && !confirm(t.discardChanges)) return;
    testTitle.value = test.title;
    gradeSem.value = test.grade || '';
    instructions.value = test.instructions || '';
    passageText.value = test.passage;
    questionsCount.value = test.questions.length;
    pointsPerAnswer.value = test.pointsPerAnswer || 1;
    wordLimit.value = test.wordLimit || 0;
    bgColor.value = test.bgColor || 'linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)';
    updateTotalScore();
    questionsData = test.questions.map(q => ({ text: q.text, acceptableAnswers: q.acceptableAnswers || [] }));
    renderQuestions();
    currentTestId = id;
    isEditMode = false;
    previewSection.style.display = 'none';
    previewBtn.innerHTML = t.showPreview;
    validateForm();
    updateWorkflowButtons();
    loadModal.classList.remove('show');
    showToast(t.testLoaded, 'success');
  }

  function deleteTest(id) {
    const t = translations[currentUILang];
    if (!confirm(t.deleteConfirm)) return;
    const saved = JSON.parse(localStorage.getItem('passageTests') || '{}');
    delete saved[id];
    localStorage.setItem('passageTests', JSON.stringify(saved));
    if (currentTestId === id) { currentTestId = null; isEditMode = false; updateWorkflowButtons(); }
    loadSavedTestsList();
    showToast(t.testDeleted, 'success');
  }

  function newTest() {
    const t = translations[currentUILang];
    if (questionsData.length > 0 && !confirm(t.newTestConfirm)) return;
    testTitle.value = 'Reading Comprehension Test';
    gradeSem.value = 'Grade 1';
    instructions.value = 'Read the passage and answer the questions in your own words.';
    passageText.value = '';
    questionsCount.value = '3';
    pointsPerAnswer.value = '1';
    wordLimit.value = '4';
    bgColor.value = 'linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)';
    updateTotalScore();
    questionsData = [ { text: '', acceptableAnswers: [] }, { text: '', acceptableAnswers: [] }, { text: '', acceptableAnswers: [] } ];
    renderQuestions();
    currentTestId = null;
    isEditMode = false;
    previewSection.style.display = 'none';
    previewBtn.innerHTML = t.showPreview;
    validateForm();
    updateWorkflowButtons();
    showToast(t.newTestCreated, 'info');
  }

  function enableEditMode() {
    const t = translations[currentUILang];
    if (!currentTestId) { showToast(t.saveFirst, 'info'); return; }
    isEditMode = true;
    updateWorkflowButtons();
    showToast(t.editMode, 'info');
  }

  function showLoadModal() { loadSavedTestsList(); loadModal.classList.add('show'); }
  function updateWorkflowButtons() { editBtn.disabled = !currentTestId || isEditMode; }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================
  if (syncQuestionsBtn) syncQuestionsBtn.addEventListener('click', syncQuestions);
  questionsCount.addEventListener('change', () => renderQuestions());
  generateBtn.addEventListener('click', generateAndDownload);
  previewBtn.addEventListener('click', togglePreview);
  refreshPreviewBtn.addEventListener('click', refreshPreview);
  newBtn.addEventListener('click', newTest);
  saveBtn.addEventListener('click', saveTest);
  loadBtn.addEventListener('click', showLoadModal);
  editBtn.addEventListener('click', enableEditMode);
  closeLoadModal.addEventListener('click', () => loadModal.classList.remove('show'));
  loadModal.addEventListener('click', (e) => { if (e.target === loadModal) loadModal.classList.remove('show'); });
  passageText.addEventListener('input', validateForm);
  testTitle.addEventListener('input', validateForm);

  // ============================================================
  // INITIALIZE
  // ============================================================
  questionsData = [ { text: '', acceptableAnswers: [] }, { text: '', acceptableAnswers: [] }, { text: '', acceptableAnswers: [] } ];
  renderQuestions();
  updateUILanguage();
  validateForm();
  loadSavedTestsList();
});