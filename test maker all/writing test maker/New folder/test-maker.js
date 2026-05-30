// ------------------- الترجمة الثنائية -------------------
const translations = {
  ar: {
    maker_title: "منشئ اختبارات الكتابة",
    maker_sub: "أنشئ اختباراً متكاملاً بالذكاء الاصطناعي (يدعم Gemini مجاناً و OpenAI)",
    api_title: "مفتاح API (Gemini مجاني يبدأ بـ AI... أو OpenAI يبدأ بـ sk-)",
    basic_info: "معلومات الاختبار الأساسية",
    test_name: "اسم الاختبار",
    grade: "الصف / المستوى",
    semester: "الفصل الدراسي",
    timer: "المؤقت (بالدقائق)",
    timer_hint: "0 = بدون مؤقت",
    bg_color: "لون خلفية الاختبار",
    question_section: "سؤال الكتابة والشروط",
    essay_question: "السؤال الأساسي",
    min_words: "الحد الأدنى لعدد الكلمات",
    extra_conditions: "شروط إضافية (نص حر - تظهر للطالب)",
    rubric_section: "معايير التقييم (Rubric) - للذكاء الاصطناعي فقط",
    rubric_hint: "هذه المعايير ستُرسل إلى الذكاء الاصطناعي ولن تظهر في صفحة الاختبار.",
    generate_btn: "إنشاء الاختبار وتحميله (ملف HTML)",
    preview_btn: "معاينة الاختبار",
    save_btn: "حفظ الاختبار الحالي",
    load_btn: "تحميل اختبار محفوظ",
    new_btn: "جديد",
    edit_btn: "تعديل",
    load_select_label: "اختر اختباراً محفوظاً:",
    footer_note: "يمكنك حفظ عدة اختبارات بأسماء مختلفة وتحميلها لاحقاً."
  },
  en: {
    maker_title: "Writing Test Maker",
    maker_sub: "Create AI-powered writing test (supports free Gemini & OpenAI)",
    api_title: "API Key (Gemini starts with AI..., OpenAI starts with sk-)",
    basic_info: "Basic Test Information",
    test_name: "Test Name",
    grade: "Grade / Level",
    semester: "Semester",
    timer: "Timer (minutes)",
    timer_hint: "0 = no timer",
    bg_color: "Test Background Color",
    question_section: "Writing Prompt & Conditions",
    essay_question: "Essay Question",
    min_words: "Minimum Word Count",
    extra_conditions: "Extra Conditions (shown to student)",
    rubric_section: "Assessment Rubric (AI only - hidden from students)",
    rubric_hint: "These criteria will be sent to AI and won't appear on the test page.",
    generate_btn: "Generate & Download (HTML file)",
    preview_btn: "Preview Test",
    save_btn: "Save Current Test",
    load_btn: "Load Saved Test",
    new_btn: "New",
    edit_btn: "Edit",
    load_select_label: "Select a saved test:",
    footer_note: "You can save multiple tests and load them later."
  }
};

let currentLang = 'ar';

function updateUILanguage() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (translations[currentLang][key]) {
      if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
        el.placeholder = translations[currentLang][key];
      } else if (el.tagName === 'SELECT') {
        // لا نغير
      } else {
        el.innerText = translations[currentLang][key];
      }
    }
  });
  document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  const loadSelect = document.getElementById('loadTestSelect');
  if (loadSelect && loadSelect.options.length > 0 && loadSelect.options[0].value === '') {
    loadSelect.options[0].text = currentLang === 'ar' ? '-- اختبار محفوظ --' : '-- Saved test --';
  }
  const loadLabel = document.querySelector('.load-section label');
  if (loadLabel) {
    loadLabel.innerText = translations[currentLang]['load_select_label'] || (currentLang === 'ar' ? 'اختر اختباراً محفوظاً:' : 'Select a saved test:');
  }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLang = btn.getAttribute('data-lang');
    updateUILanguage();
  });
});
updateUILanguage();

// ------------------- إدارة مفتاح API -------------------
function updateApiStatus() {
  const key = localStorage.getItem('writing_api_key');
  const statusDiv = document.getElementById('apiStatus');
  if (key && key.length > 10) {
    const isGemini = key.startsWith('AI') || key.includes('AIza');
    const type = isGemini ? 'Gemini (مجاني)' : (key.startsWith('sk-') ? 'OpenAI' : 'مخصص');
    statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ✅ مفتاح ${type} محفوظ وجاهز للاستخدام`;
    statusDiv.className = 'api-status success';
    const apiInput = document.getElementById('apiKeyInput');
    if (apiInput) apiInput.value = key;
  } else {
    statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ⚠️ لم يتم حفظ مفتاح API بعد. أدخل مفتاحاً صالحاً ثم احفظه.';
    statusDiv.className = 'api-status error';
  }
}

const saveApiBtn = document.getElementById('saveApiBtn');
if (saveApiBtn) {
  saveApiBtn.addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput')?.value.trim();
    if (key && key.length > 10) {
      localStorage.setItem('writing_api_key', key);
      updateApiStatus();
      alert(currentLang === 'ar' ? '✅ تم حفظ مفتاح API بنجاح.' : '✅ API key saved successfully.');
    } else {
      alert(currentLang === 'ar' ? '❌ المفتاح غير صالح. يجب أن يكون أطول من 10 أحرف.' : '❌ Invalid key. Must be longer than 10 characters.');
    }
  });
}
updateApiStatus();

// ------------------- معاينة لون الخلفية -------------------
const bgColorInput = document.getElementById('bgColor');
const previewColor = document.querySelector('.color-preview');
if (bgColorInput && previewColor) {
  bgColorInput.addEventListener('input', () => {
    previewColor.style.backgroundColor = bgColorInput.value;
  });
}

// ------------------- إدارة الاختبارات المتعددة -------------------
function getAllSavedTests() {
  const saved = localStorage.getItem('saved_tests_list');
  return saved ? JSON.parse(saved) : [];
}

function saveTestsList(tests) {
  localStorage.setItem('saved_tests_list', JSON.stringify(tests));
}

function refreshLoadSelect() {
  const select = document.getElementById('loadTestSelect');
  if (!select) return;
  const tests = getAllSavedTests();
  select.innerHTML = `<option value="">${currentLang === 'ar' ? '-- اختبار محفوظ --' : '-- Saved test --'}</option>`;
  tests.forEach(test => {
    const option = document.createElement('option');
    option.value = test.name;
    option.textContent = `${test.name} (${test.data.testName || test.name})`;
    select.appendChild(option);
  });
}

function getCurrentTestData() {
  return {
    testName: document.getElementById('testName')?.value || "Writing Test",
    grade: document.getElementById('grade')?.value || "Grade 7",
    semester: document.getElementById('semester')?.value || "Semester 1",
    timerMinutes: parseInt(document.getElementById('timerMinutes')?.value) || 0,
    bgColor: document.getElementById('bgColor')?.value || "#fef3c7",
    question: document.getElementById('question')?.value || "Write an essay about the importance of reading.",
    minWords: parseInt(document.getElementById('minWords')?.value) || 80,
    extraConditions: document.getElementById('extraConditions')?.value || "",
    rubric: document.getElementById('rubric')?.value || "General quality, grammar, clarity, organization."
  };
}

function setCurrentTestData(data) {
  const fields = ['testName', 'grade', 'semester', 'timerMinutes', 'bgColor', 'question', 'minWords', 'extraConditions', 'rubric'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = data[id] ?? (id === 'timerMinutes' ? 0 : id === 'bgColor' ? '#fef3c7' : id === 'minWords' ? 80 : '');
  });
  if (previewColor) previewColor.style.backgroundColor = data.bgColor || "#fef3c7";
}

function saveTest() {
  const testName = prompt(currentLang === 'ar' ? 'أدخل اسماً لهذا الاختبار:' : 'Enter a name for this test:', getCurrentTestData().testName);
  if (!testName) return;
  const tests = getAllSavedTests();
  const existingIndex = tests.findIndex(t => t.name === testName);
  const newData = getCurrentTestData();
  if (existingIndex !== -1) {
    if (confirm(currentLang === 'ar' ? `اختبار باسم "${testName}" موجود. هل تريد استبداله؟` : `Test "${testName}" exists. Overwrite?`)) {
      tests[existingIndex].data = newData;
    } else return;
  } else {
    tests.push({ name: testName, data: newData });
  }
  saveTestsList(tests);
  refreshLoadSelect();
  alert(currentLang === 'ar' ? `✅ تم حفظ "${testName}".` : `✅ Saved "${testName}".`);
}

function loadTest() {
  const select = document.getElementById('loadTestSelect');
  const selectedName = select.value;
  if (!selectedName) {
    alert(currentLang === 'ar' ? 'اختر اختباراً من القائمة أولاً.' : 'Select a test from the list first.');
    return;
  }
  const tests = getAllSavedTests();
  const found = tests.find(t => t.name === selectedName);
  if (found) {
    setCurrentTestData(found.data);
    alert(currentLang === 'ar' ? `✅ تم تحميل "${selectedName}".` : `✅ Loaded "${selectedName}".`);
  } else {
    alert(currentLang === 'ar' ? '⚠️ لم نجد الاختبار.' : '⚠️ Test not found.');
    refreshLoadSelect();
  }
}

function newTest() {
  if (confirm(currentLang === 'ar' ? 'مسح البيانات الحالية وإنشاء اختبار جديد؟' : 'Clear current data and create new test?')) {
    setCurrentTestData({ timerMinutes: 30, bgColor: '#fef3c7', minWords: 80, testName: '', grade: '', semester: '', question: '', extraConditions: '', rubric: '' });
  }
}

function editTest() {
  alert(currentLang === 'ar' ? 'عدّل الحقول ثم استخدم "حفظ الاختبار الحالي".' : 'Edit fields then use "Save Current Test".');
}

// ------------------- دوال الاتصال بـ API المُعدلة لـ Gemini -------------------
async function callGeminiAPI(key, prompt) {
  const models = ['gemini-1.5-pro', 'gemini-pro'];
  let lastError = null;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
        })
      });
      if (!response.ok) {
        console.warn(`Model ${model} returned ${response.status}`);
        lastError = new Error(`Gemini ${model} error: ${response.status}`);
        continue;
      }
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('All Gemini models failed');
}

async function callOpenAIAPI(key, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'Respond with JSON only.' }, { role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800
    })
  });
  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ------------------- توليد صفحة الاختبار مع تحميل الملف -------------------
async function downloadTestPage() {
  const apiKey = localStorage.getItem('writing_api_key');
  if (!apiKey || apiKey.length < 10) {
    alert(currentLang === 'ar' ? '⚠️ الرجاء حفظ مفتاح API أولاً.' : '⚠️ Please save API key first.');
    return;
  }
  const data = getCurrentTestData();
  const isGemini = apiKey.startsWith('AI') || apiKey.includes('AIza');
  const escape = str => str ? str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])) : '';

  // نستخدم دوال معرّفة داخل القالب ولكن نمرر الدوال الصحيحة
  const testHTML = `<!DOCTYPE html><html lang="${currentLang === 'ar' ? 'ar' : 'en'}" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>${escape(data.testName)}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif}
    body{background:${data.bgColor};padding:20px}
    .container{max-width:1300px;margin:0 auto}
    header{background:rgba(255,255,255,0.95);border-radius:20px;margin-bottom:30px;padding:20px;text-align:center;position:relative;overflow:hidden}
    header::before{content:'';position:absolute;top:0;left:0;width:100%;height:5px;background:linear-gradient(90deg,#f9aa33,#ffb74d,#4a6572)}
    h1{font-size:2rem;background:linear-gradient(90deg,#344955,#4a6572);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .test-info{display:flex;justify-content:center;gap:20px;margin:15px 0;flex-wrap:wrap}
    .badge{background:#f9aa33;color:#fff;padding:5px 15px;border-radius:40px;font-size:0.9rem;display:inline-flex;align-items:center;gap:8px}
    .timer-box{background:#4a6572;color:#fff;padding:5px 15px;border-radius:40px}
    .card{background:rgba(255,255,255,0.95);border-radius:20px;padding:25px;margin-bottom:25px;box-shadow:0 8px 25px rgba(0,0,0,0.05)}
    .question-box{text-align:center;background:#fef9ef;border-radius:20px;padding:30px;margin-bottom:20px;border:2px solid #f9aa33}
    .question-box h2{color:#344955;margin-bottom:15px;font-size:1.8rem}
    .question-text{font-size:1.8rem;font-weight:600;line-height:1.5;color:#1a3b4e;background:#fff;padding:25px;border-radius:18px;box-shadow:0 4px 12px rgba(0,0,0,0.05);margin-top:10px}
    .conditions{background:#fff8e7;padding:15px;border-radius:16px;margin:15px 0;border-right:4px solid #f9aa33}
    .conditions strong{color:#344955}
    textarea{width:100%;padding:20px;border-radius:20px;border:2px solid #e0e0e0;min-height:250px;font-size:1rem;resize:vertical}
    button{background:#f9aa33;border:none;padding:12px 28px;border-radius:40px;font-weight:bold;cursor:pointer;margin:10px 5px 0 0;transition:0.2s}
    button:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(0,0,0,0.1)}
    .word-count{text-align:left;margin-top:8px;font-weight:500}
    .result-area{background:#fef9ef;border-radius:20px;padding:20px;margin-top:20px;display:none}
    footer{text-align:center;margin-top:20px;color:#4a6572}
    .hidden-rubric{display:none}
  </style></head><body><div class="container">
  <header><h1>${escape(data.testName)}</h1><div class="test-info">
  <span class="badge"><i class="fas fa-graduation-cap"></i> ${escape(data.grade)}</span>
  <span class="badge"><i class="fas fa-calendar-alt"></i> ${escape(data.semester)}</span>
  <span class="timer-box" id="timerDisplay"></span></div></header>
  <div class="card">
    <div class="question-box">
      <h2><i class="fas fa-question-circle"></i> ${currentLang === 'ar' ? 'سؤال المقالة' : 'Essay Question'}</h2>
      <div class="question-text">${escape(data.question)}</div>
    </div>
    <div class="conditions">
      <strong>${currentLang === 'ar' ? 'الشروط:' : 'Conditions:'}</strong> ${escape(data.extraConditions || (currentLang === 'ar' ? 'لا توجد شروط إضافية' : 'No extra conditions'))}<br>
      <strong>${currentLang === 'ar' ? 'الحد الأدنى للكلمات:' : 'Minimum words:'}</strong> ${data.minWords}
    </div>
    <div class="hidden-rubric" id="rubricData" data-rubric="${escape(data.rubric.replace(/"/g, '&quot;'))}"></div>
    <label><i class="fas fa-pencil-alt"></i> ${currentLang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</label>
    <textarea id="answerText" placeholder="${currentLang === 'ar' ? 'اكتب مقالك هنا...' : 'Write your essay here...'}"></textarea>
    <div class="word-count">${currentLang === 'ar' ? 'عدد الكلمات:' : 'Word count:'} <span id="wordCount">0</span> | ${currentLang === 'ar' ? 'الحد الأدنى:' : 'Minimum:'} ${data.minWords}</div>
    <button id="evaluateBtn"><i class="fas fa-robot"></i> ${currentLang === 'ar' ? 'تقييم بالذكاء الاصطناعي' : 'AI Evaluation'}</button>
    <button id="resetBtn"><i class="fas fa-undo-alt"></i> ${currentLang === 'ar' ? 'إعادة تعيين' : 'Reset'}</button>
    <div id="resultDiv" class="result-area"></div>
  </div>
  <footer><small>${currentLang === 'ar' ? 'تم إنشاء هذا الاختبار بواسطة Test Maker' : 'Generated by Test Maker'}</small></footer></div>
  <script>
    const testData = ${JSON.stringify(data)};
    let timerInterval = null;
    const currentLang = '${currentLang}';
    const apiKey = '${apiKey}';
    const isGemini = ${isGemini};
    const hiddenRubric = document.getElementById('rubricData')?.getAttribute('data-rubric') || '';
    const escapeHtml = str => str ? str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])) : '';
    
    // دالة Gemini متعددة النماذج
    async function callGeminiAPI(prompt) {
      const models = ['gemini-1.5-pro', 'gemini-pro'];
      let lastError = null;
      for (const model of models) {
        try {
          const url = \`https://generativelanguage.googleapis.com/v1/models/\${model}:generateContent?key=\${apiKey}\`;
          const response = await fetch(url, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
            })
          });
          if (!response.ok) {
            console.warn(\`Model \${model} returned \${response.status}\`);
            lastError = new Error(\`Gemini \${model} error: \${response.status}\`);
            continue;
          }
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (e) { lastError = e; }
      }
      throw lastError || new Error('All Gemini models failed');
    }
    
    async function callOpenAIAPI(prompt) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: 'Respond with JSON only.' }, { role: 'user', content: prompt }],
          temperature: 0.3
        })
      });
      if (!response.ok) throw new Error('OpenAI API error');
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }
    
    async function callAIAPI(prompt) {
      if (isGemini) {
        return await callGeminiAPI(prompt);
      } else {
        return await callOpenAIAPI(prompt);
      }
    }
    
    function startTimer(seconds) {
      const el = document.getElementById('timerDisplay');
      let rem = seconds;
      function tick() {
        const m = Math.floor(rem / 60), s = rem % 60;
        el.innerHTML = \`<i class="fas fa-hourglass-half"></i> \${m}:\${s < 10 ? '0' + s : s}\`;
        if (rem <= 0) { clearInterval(timerInterval); alert('${currentLang === 'ar' ? 'انتهى الوقت! سيتم إرسال إجابتك تلقائياً.' : 'Time is up! Your answer will be submitted.'}'); document.getElementById('evaluateBtn').click(); return; }
        rem--;
      }
      tick(); timerInterval = setInterval(tick, 1000);
    }
    
    function updateWordCount() {
      const txt = document.getElementById('answerText').value;
      const cnt = txt.trim().split(/\\s+/).filter(w => w.length > 0).length;
      document.getElementById('wordCount').innerText = cnt;
      return cnt;
    }
    
    async function evaluateWriting() {
      const ans = document.getElementById('answerText').value.trim();
      if (!ans) { alert('${currentLang === 'ar' ? 'الرجاء كتابة إجابتك أولاً.' : 'Please write your answer first.'}'); return; }
      const currentWordCount = ans.split(/\\s+/).filter(w => w.length > 0).length;
      if (currentWordCount < testData.minWords) {
        alert(\`⚠️ \${currentLang === 'ar' ? 'عدد الكلمات (' + currentWordCount + ') أقل من الحد الأدنى (' + testData.minWords + ')' : 'Word count (' + currentWordCount + ') is less than minimum (' + testData.minWords + ')'}\`);
        return;
      }
      const resDiv = document.getElementById('resultDiv');
      resDiv.style.display = 'block';
      resDiv.innerHTML = '<div style="text-align:center"><i class="fas fa-spinner fa-pulse"></i> ' + (currentLang === 'ar' ? 'جاري التقييم بالذكاء الاصطناعي...' : 'AI is evaluating...') + '</div>';
      const rubricToUse = hiddenRubric || testData.rubric;
      const prompt = \`أنت مقيّم كتابة. السؤال: "\${testData.question}". الشروط: \${testData.extraConditions || 'لا توجد'}. معايير التقييم (Rubric): "\${rubricToUse}". النص: "\${ans}". أخرج JSON فقط: {"score":0-100,"feedback":"...","errorReview":"...","rubricBreakdown":"..."}\`;
      try {
        const ai = await callAIAPI(prompt);
        const json = ai.match(/\\{[\\s\\S]*\\}/);
        if (!json) throw new Error('Invalid JSON');
        const result = JSON.parse(json[0]);
        resDiv.innerHTML = \`
          <h3><i class="fas fa-star"></i> \${currentLang === 'ar' ? 'نتيجة التقييم' : 'Evaluation Result'}</h3>
          <p><strong>\${currentLang === 'ar' ? 'الدرجة:' : 'Score:'}</strong> \${result.score} / 100</p>
          <p><strong>\${currentLang === 'ar' ? 'التعليق:' : 'Feedback:'}</strong> \${escapeHtml(result.feedback)}</p>
          <p><strong>\${currentLang === 'ar' ? 'مراجعة الأخطاء:' : 'Error Review:'}</strong> \${escapeHtml(result.errorReview)}</p>
          <p><strong>\${currentLang === 'ar' ? 'تفصيل المعايير:' : 'Rubric Breakdown:'}</strong> \${escapeHtml(result.rubricBreakdown)}</p>
        \`;
      } catch (e) { resDiv.innerHTML = \`<div style="color:red">❌ \${e.message}</div>\`; }
    }
    
    document.getElementById('evaluateBtn').addEventListener('click', evaluateWriting);
    document.getElementById('resetBtn').addEventListener('click', () => {
      document.getElementById('answerText').value = '';
      updateWordCount();
      document.getElementById('resultDiv').style.display = 'none';
    });
    document.getElementById('answerText').addEventListener('input', updateWordCount);
    updateWordCount();
    if (testData.timerMinutes > 0) startTimer(testData.timerMinutes * 60);
    else document.getElementById('timerDisplay').innerHTML = '<i class="fas fa-hourglass"></i> ' + (currentLang === 'ar' ? 'لا مؤقت' : 'No timer');
  <\/script></body></html>`;

  const blob = new Blob([testHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.testName.replace(/[^a-z0-9]/gi, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ------------------- معاينة (Preview) -------------------
async function previewTestPage() {
  const apiKey = localStorage.getItem('writing_api_key');
  if (!apiKey || apiKey.length < 10) {
    alert(currentLang === 'ar' ? '⚠️ الرجاء حفظ مفتاح API أولاً.' : '⚠️ Please save API key first.');
    return;
  }
  const data = getCurrentTestData();
  const isGemini = apiKey.startsWith('AI') || apiKey.includes('AIza');
  const escape = str => str ? str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])) : '';

  const testHTML = `<!DOCTYPE html><html lang="${currentLang === 'ar' ? 'ar' : 'en'}" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><title>${escape(data.testName)}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif}
    body{background:${data.bgColor};padding:20px}
    .container{max-width:1300px;margin:0 auto}
    header{background:rgba(255,255,255,0.95);border-radius:20px;margin-bottom:30px;padding:20px;text-align:center;position:relative;overflow:hidden}
    header::before{content:'';position:absolute;top:0;left:0;width:100%;height:5px;background:linear-gradient(90deg,#f9aa33,#ffb74d,#4a6572)}
    h1{font-size:2rem;background:linear-gradient(90deg,#344955,#4a6572);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .test-info{display:flex;justify-content:center;gap:20px;margin:15px 0;flex-wrap:wrap}
    .badge{background:#f9aa33;color:#fff;padding:5px 15px;border-radius:40px;font-size:0.9rem;display:inline-flex;align-items:center;gap:8px}
    .timer-box{background:#4a6572;color:#fff;padding:5px 15px;border-radius:40px}
    .card{background:rgba(255,255,255,0.95);border-radius:20px;padding:25px;margin-bottom:25px;box-shadow:0 8px 25px rgba(0,0,0,0.05)}
    .question-box{text-align:center;background:#fef9ef;border-radius:20px;padding:30px;margin-bottom:20px;border:2px solid #f9aa33}
    .question-box h2{color:#344955;margin-bottom:15px;font-size:1.8rem}
    .question-text{font-size:1.8rem;font-weight:600;line-height:1.5;color:#1a3b4e;background:#fff;padding:25px;border-radius:18px;box-shadow:0 4px 12px rgba(0,0,0,0.05);margin-top:10px}
    .conditions{background:#fff8e7;padding:15px;border-radius:16px;margin:15px 0;border-right:4px solid #f9aa33}
    .conditions strong{color:#344955}
    textarea{width:100%;padding:20px;border-radius:20px;border:2px solid #e0e0e0;min-height:250px;font-size:1rem;resize:vertical}
    button{background:#f9aa33;border:none;padding:12px 28px;border-radius:40px;font-weight:bold;cursor:pointer;margin:10px 5px 0 0;transition:0.2s}
    button:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(0,0,0,0.1)}
    .word-count{text-align:left;margin-top:8px;font-weight:500}
    .result-area{background:#fef9ef;border-radius:20px;padding:20px;margin-top:20px;display:none}
    footer{text-align:center;margin-top:20px;color:#4a6572}
    .hidden-rubric{display:none}
  </style></head><body><div class="container">
  <header><h1>${escape(data.testName)}</h1><div class="test-info">
  <span class="badge"><i class="fas fa-graduation-cap"></i> ${escape(data.grade)}</span>
  <span class="badge"><i class="fas fa-calendar-alt"></i> ${escape(data.semester)}</span>
  <span class="timer-box" id="timerDisplay"></span></div></header>
  <div class="card">
    <div class="question-box">
      <h2><i class="fas fa-question-circle"></i> ${currentLang === 'ar' ? 'سؤال المقالة' : 'Essay Question'}</h2>
      <div class="question-text">${escape(data.question)}</div>
    </div>
    <div class="conditions">
      <strong>${currentLang === 'ar' ? 'الشروط:' : 'Conditions:'}</strong> ${escape(data.extraConditions || (currentLang === 'ar' ? 'لا توجد شروط إضافية' : 'No extra conditions'))}<br>
      <strong>${currentLang === 'ar' ? 'الحد الأدنى للكلمات:' : 'Minimum words:'}</strong> ${data.minWords}
    </div>
    <div class="hidden-rubric" id="rubricData" data-rubric="${escape(data.rubric.replace(/"/g, '&quot;'))}"></div>
    <label><i class="fas fa-pencil-alt"></i> ${currentLang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</label>
    <textarea id="answerText" placeholder="${currentLang === 'ar' ? 'اكتب مقالك هنا...' : 'Write your essay here...'}"></textarea>
    <div class="word-count">${currentLang === 'ar' ? 'عدد الكلمات:' : 'Word count:'} <span id="wordCount">0</span> | ${currentLang === 'ar' ? 'الحد الأدنى:' : 'Minimum:'} ${data.minWords}</div>
    <button id="evaluateBtn"><i class="fas fa-robot"></i> ${currentLang === 'ar' ? 'تقييم بالذكاء الاصطناعي' : 'AI Evaluation'}</button>
    <button id="resetBtn"><i class="fas fa-undo-alt"></i> ${currentLang === 'ar' ? 'إعادة تعيين' : 'Reset'}</button>
    <div id="resultDiv" class="result-area"></div>
  </div>
  <footer><small>${currentLang === 'ar' ? 'تم إنشاء هذا الاختبار بواسطة Test Maker' : 'Generated by Test Maker'}</small></footer></div>
  <script>
    const testData = ${JSON.stringify(data)};
    let timerInterval = null;
    const currentLang = '${currentLang}';
    const apiKey = '${apiKey}';
    const isGemini = ${isGemini};
    const hiddenRubric = document.getElementById('rubricData')?.getAttribute('data-rubric') || '';
    const escapeHtml = str => str ? str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])) : '';
    
    async function callGeminiAPI(prompt) {
      const models = ['gemini-1.5-pro', 'gemini-pro'];
      let lastError = null;
      for (const model of models) {
        try {
          const url = \`https://generativelanguage.googleapis.com/v1/models/\${model}:generateContent?key=\${apiKey}\`;
          const response = await fetch(url, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
            })
          });
          if (!response.ok) {
            console.warn(\`Model \${model} returned \${response.status}\`);
            lastError = new Error(\`Gemini \${model} error: \${response.status}\`);
            continue;
          }
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (e) { lastError = e; }
      }
      throw lastError || new Error('All Gemini models failed');
    }
    
    async function callOpenAIAPI(prompt) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: 'Respond with JSON only.' }, { role: 'user', content: prompt }],
          temperature: 0.3
        })
      });
      if (!response.ok) throw new Error('OpenAI API error');
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }
    
    async function callAIAPI(prompt) {
      if (isGemini) {
        return await callGeminiAPI(prompt);
      } else {
        return await callOpenAIAPI(prompt);
      }
    }
    
    function startTimer(seconds) { /* نفس السابق */ }
    function updateWordCount() { /* نفس السابق */ }
    async function evaluateWriting() { /* نفس السابق */ }
    // ... باقي الكود كما في الملف أعلاه
  <\/script></body></html>`;

  const win = window.open();
  if (win) {
    win.document.write(testHTML);
    win.document.close();
  } else {
    alert(currentLang === 'ar' ? '⚠️ يرجى السماح للنوافذ المنبثقة (Popup) في المتصفح.' : '⚠️ Please allow popups for this site.');
  }
}

// ------------------- ربط الأزرار -------------------
document.addEventListener('DOMContentLoaded', () => {
  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  bind('saveTestBtn', saveTest);
  bind('loadTestBtn', loadTest);
  bind('newTestBtn', newTest);
  bind('editTestBtn', editTest);
  bind('previewTestBtn', previewTestPage);
  bind('generateTestBtn', downloadTestPage);
  refreshLoadSelect();
});