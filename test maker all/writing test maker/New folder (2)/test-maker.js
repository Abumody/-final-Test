// ------------------- الترجمة الثنائية -------------------
const translations = {
    ar: {
        maker_title: "منشئ اختبارات الكتابة", maker_sub: "أنشئ اختباراً مع نموذج إجابة وتصحيح تفاعلي",
        basic_info: "معلومات الاختبار الأساسية", test_name: "اسم الاختبار", grade: "الصف", semester: "الفصل",
        timer: "المؤقت (دقائق)", bg_color: "لون الخلفية", question_section: "السؤال والشروط",
        essay_question: "السؤال الأساسي", min_words: "الحد الأدنى للكلمات", extra_conditions: "شروط إضافية",
        model_section: "نموذج الإجابة", model_hint: "سيظهر هذا النموذج في صفحة الاختبار للمقارنة.",
        preview_btn: "معاينة الاختبار", generate_btn: "إنشاء ملف الاختبار وتحميله",
        save_btn: "حفظ الاختبار", load_btn: "تحميل اختبار", new_btn: "جديد", edit_btn: "تعديل",
        load_select_label: "اختر اختباراً محفوظاً:", footer_note: "حفظ وتحميل اختبارات متعددة."
    },
    en: {
        maker_title: "Writing Test Maker", maker_sub: "Create a test with model answer and interactive correction",
        basic_info: "Basic Test Information", test_name: "Test Name", grade: "Grade", semester: "Semester",
        timer: "Timer (minutes)", bg_color: "Background Color", question_section: "Question & Conditions",
        essay_question: "Essay Question", min_words: "Minimum Words", extra_conditions: "Extra Conditions",
        model_section: "Model Answer", model_hint: "This model answer will appear for comparison.",
        preview_btn: "Preview Test", generate_btn: "Generate & Download Test File",
        save_btn: "Save Test", load_btn: "Load Test", new_btn: "New", edit_btn: "Edit",
        load_select_label: "Select a saved test:", footer_note: "Save and load multiple tests."
    }
};
let currentLang = 'ar';

function updateUILanguage() {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && el.placeholder !== undefined) el.placeholder = translations[currentLang][key];
            else if (el.tagName === 'TEXTAREA') el.placeholder = translations[currentLang][key];
            else el.innerText = translations[currentLang][key];
        }
    });
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const loadLabel = document.querySelector('.load-section label');
    if (loadLabel) loadLabel.innerText = translations[currentLang].load_select_label;
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

// ------------------- إدارة الاختبارات -------------------
function getAllSavedTests() { return JSON.parse(localStorage.getItem('saved_tests_list') || '[]'); }
function saveTestsList(tests) { localStorage.setItem('saved_tests_list', JSON.stringify(tests)); }
function refreshLoadSelect() {
    const select = document.getElementById('loadTestSelect');
    if (!select) return;
    const tests = getAllSavedTests();
    select.innerHTML = `<option value="">${currentLang === 'ar' ? '-- اختبار محفوظ --' : '-- Saved test --'}</option>`;
    tests.forEach(t => { let opt = document.createElement('option'); opt.value = t.name; opt.textContent = `${t.name} (${t.data.testName || t.name})`; select.appendChild(opt); });
}
function getCurrentTestData() {
    return {
        testName: document.getElementById('testName')?.value || "Writing Test",
        grade: document.getElementById('grade')?.value || "Grade 7",
        semester: document.getElementById('semester')?.value || "Semester 1",
        timerMinutes: parseInt(document.getElementById('timerMinutes')?.value) || 0,
        bgColor: document.getElementById('bgColor')?.value || "#fef3c7",
        question: document.getElementById('question')?.value || "Write an essay...",
        minWords: parseInt(document.getElementById('minWords')?.value) || 80,
        extraConditions: document.getElementById('extraConditions')?.value || "",
        modelAnswer: document.getElementById('modelAnswer')?.value || ""
    };
}
function setCurrentTestData(data) {
    document.getElementById('testName').value = data.testName || "";
    document.getElementById('grade').value = data.grade || "";
    document.getElementById('semester').value = data.semester || "";
    document.getElementById('timerMinutes').value = data.timerMinutes || 0;
    document.getElementById('bgColor').value = data.bgColor || "#fef3c7";
    document.getElementById('question').value = data.question || "";
    document.getElementById('minWords').value = data.minWords || 80;
    document.getElementById('extraConditions').value = data.extraConditions || "";
    document.getElementById('modelAnswer').value = data.modelAnswer || "";
}
function saveTest() {
    let name = prompt(currentLang === 'ar' ? 'اسم الاختبار:' : 'Test name:', getCurrentTestData().testName);
    if (!name) return;
    let tests = getAllSavedTests();
    let idx = tests.findIndex(t => t.name === name);
    let newData = getCurrentTestData();
    if (idx !== -1) { if (confirm(currentLang === 'ar' ? 'استبدال؟' : 'Overwrite?')) tests[idx].data = newData; else return; }
    else tests.push({ name, data: newData });
    saveTestsList(tests);
    refreshLoadSelect();
    alert(currentLang === 'ar' ? `تم حفظ "${name}"` : `Saved "${name}"`);
}
function loadTest() {
    let select = document.getElementById('loadTestSelect');
    let name = select.value;
    if (!name) { alert(currentLang === 'ar' ? 'اختر اختباراً' : 'Select a test'); return; }
    let tests = getAllSavedTests();
    let found = tests.find(t => t.name === name);
    if (found) setCurrentTestData(found.data);
    else alert('Not found');
}
function newTest() { if (confirm(currentLang === 'ar' ? 'مسح البيانات؟' : 'Clear data?')) setCurrentTestData({}); }
function editTest() { alert(currentLang === 'ar' ? 'عدل ثم احفظ' : 'Edit then save'); }

// ------------------- توليد صفحة الاختبار -------------------
function generateTestPage(isPreview) {
    const data = getCurrentTestData();
    const lang = currentLang;
    const escape = str => str ? str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])) : '';

    const texts = {
        ar: {
            title: "اختبار الكتابة", essay_q: "سؤال المقالة", conditions: "الشروط:",
            min_words: "الحد الأدنى للكلمات:", model_title: "نموذج الإجابة (ظهر بعد تسليم الإجابة):",
            your_answer: "إجابتك:", correction_btn: "🔧 تصحيح الأخطاء (نقر على الكلمة)",
            save_corr_btn: "💾 حفظ التصحيح (تسليم الإجابة)", retry_btn: "🔄 إعادة المحاولة",
            word_count: "عدد الكلمات:", attempts_title: "المحاولات السابقة",
            no_attempts: "لا توجد محاولات", correction_mode_on: "وضع التصحيح مفعّل",
            correction_off: "تم إلغاء التصحيح", saved: "تم الحفظ", time_up: "انتهى الوقت!"
        },
        en: {
            title: "Writing Test", essay_q: "Essay Question", conditions: "Conditions:",
            min_words: "Minimum words:", model_title: "Model Answer (shown after submission):",
            your_answer: "Your Answer:", correction_btn: "🔧 Correct errors (click on word)",
            save_corr_btn: "💾 Save Correction (Submit Answer)", retry_btn: "🔄 Retry",
            word_count: "Word count:", attempts_title: "Previous attempts",
            no_attempts: "No attempts yet", correction_mode_on: "Correction mode active",
            correction_off: "Correction off", saved: "Saved", time_up: "Time is up!"
        }
    };
    const t = texts[lang];

    const testHTML = `<!DOCTYPE html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head><meta charset="UTF-8"><title>${escape(data.testName)}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}
body{background:${data.bgColor};padding:20px}
.container{max-width:1300px;margin:0 auto}
header{background:white;border-radius:20px;padding:20px;text-align:center;margin-bottom:25px}
h1{color:#344955}
.test-info{display:flex;justify-content:center;gap:20px;margin:10px 0}
.badge{background:#f9aa33;padding:5px 15px;border-radius:40px;color:white}
.card{background:white;border-radius:20px;padding:25px;margin-bottom:25px}
.question-box{background:#fef9ef;border:2px solid #f9aa33;border-radius:20px;padding:20px;text-align:center}
.question-text{font-size:1.8rem;font-weight:bold;margin:15px 0}
.conditions{background:#fff8e7;padding:15px;border-radius:15px;margin:15px 0}
.answer-container{border:2px solid #ccc;border-radius:20px;padding:20px;min-height:200px;background:#fff;margin-top:10px;white-space:pre-wrap;overflow-y:auto;font-size:1rem;line-height:1.6}
button{margin:10px 5px 0 0;padding:10px 20px;border-radius:40px;background:#f9aa33;border:none;cursor:pointer}
.corrected-word{background:#fff3cd;border-bottom:2px solid #ffc107}
.attempt-history{max-height:300px;overflow-y:auto;margin-top:20px;padding-top:15px}
.attempt-item{padding:10px;border-bottom:1px solid #ddd;cursor:pointer}
.attempt-item:hover{background:#f5f5f5}
.model-answer{background:#e8f0fe;padding:15px;border-radius:15px;margin:15px 0;display:none}
.status{font-size:0.9rem;margin-top:8px;color:#2e7d32}
</style></head>
<body><div class="container">
<header><h1>${escape(data.testName)}</h1><div class="test-info">
<span class="badge">📖 ${escape(data.grade)}</span>
<span class="badge">📅 ${escape(data.semester)}</span>
<span class="badge">⏱️ ${data.timerMinutes} ${lang === 'ar' ? 'دقيقة' : 'min'}</span></div></header>
<div class="card">
<div class="question-box"><h2>${t.essay_q}</h2><div class="question-text">${escape(data.question)}</div></div>
<div class="conditions"><strong>${t.conditions}</strong> ${escape(data.extraConditions || '-')}<br>
<strong>${t.min_words}</strong> ${data.minWords}</div>
<div class="model-answer" id="modelAnswerDiv"><strong>${t.model_title}</strong><br>${escape(data.modelAnswer) || '-'}</div>
<label>${t.your_answer}</label>
<div class="answer-container" id="answerContainer" contenteditable="true"></div>
<div><button id="correctionBtn"><i class="fas fa-edit"></i> ${t.correction_btn}</button>
<button id="saveCorrBtn"><i class="fas fa-save"></i> ${t.save_corr_btn}</button>
<button id="retryBtn"><i class="fas fa-redo"></i> ${t.retry_btn}</button></div>
<div>${t.word_count} <span id="wordCount">0</span></div>
<div id="statusMsg" class="status"></div>
</div>
<div class="card"><h3>${t.attempts_title}</h3><div id="attemptsList"></div></div>
</div>
<script>
const testData = ${JSON.stringify(data)};
const lang = '${lang}';
const t = ${JSON.stringify(t)};
let attempts = [], currentIdx = -1, correctionMode = false;
let modelAnswerShown = false;
const stored = localStorage.getItem(\`attempts_\${testData.testName}\`);
if(stored) attempts = JSON.parse(stored);
function updateWordCount(){
    const text = document.getElementById('answerContainer').innerText;
    const words = text.trim().split(/\\s+/).filter(w=>w.length>0).length;
    document.getElementById('wordCount').innerText = words;
}
function renderText(text){
    const container = document.getElementById('answerContainer');
    container.innerText = text;
    updateWordCount();
}
function saveCorrections(){
    if(attempts.length===0){ alert(lang==='ar'?'لا توجد محاولة':'No attempt'); return; }
    const currentText = document.getElementById('answerContainer').innerText;
    attempts[currentIdx].text = currentText;
    attempts[currentIdx].lastEdited = new Date().toLocaleString();
    localStorage.setItem(\`attempts_\${testData.testName}\`, JSON.stringify(attempts));
    renderAttemptsList();
    document.getElementById('statusMsg').innerHTML='✅ '+t.saved;
    setTimeout(()=>document.getElementById('statusMsg').innerHTML='',2000);
    if (!modelAnswerShown) {
        const modelDiv = document.getElementById('modelAnswerDiv');
        if (modelDiv) {
            modelDiv.style.display = 'block';
            modelAnswerShown = true;
            document.getElementById('statusMsg').innerHTML = lang === 'ar' ? '📚 ظهر نموذج الإجابة الآن' : '📚 Model answer is now visible';
            setTimeout(()=>document.getElementById('statusMsg').innerHTML='',3000);
        }
    }
}
function newAttempt(){
    const newObj = { id: Date.now(), text: "", timestamp: new Date().toLocaleString(), lastEdited: null };
    attempts.push(newObj); currentIdx = attempts.length-1;
    renderText("");
    localStorage.setItem(\`attempts_\${testData.testName}\`, JSON.stringify(attempts));
    renderAttemptsList();
    document.getElementById('statusMsg').innerHTML = lang==='ar'?'محاولة جديدة':'New attempt';
}
function renderAttemptsList(){
    const container = document.getElementById('attemptsList');
    if(attempts.length===0){ container.innerHTML='<p>'+t.no_attempts+'</p>'; return; }
    let html='';
    attempts.forEach((att,i)=>{
        let preview = att.text.substring(0,60)+(att.text.length>60?'...':'');
        html+=\`<div class="attempt-item" data-idx="\${i}"><strong>${lang==='ar'?'محاولة':'Attempt'} \${i+1}</strong> - \${att.timestamp}\${att.lastEdited? \` <span style="color:#2e7d32">(✏️ \${att.lastEdited})</span>\`:''}<br><small>\${preview}</small></div>\`;
    });
    container.innerHTML = html;
    document.querySelectorAll('.attempt-item').forEach(el=>{
        el.addEventListener('click',()=>{
            let idx = parseInt(el.dataset.idx);
            if(!isNaN(idx) && attempts[idx]){ currentIdx=idx; renderText(attempts[idx].text); correctionMode=false; document.getElementById('correctionBtn').style.background='#f9aa33'; document.getElementById('correctionBtn').innerHTML='<i class="fas fa-edit"></i> '+t.correction_btn; document.getElementById('statusMsg').innerHTML=lang==='ar'?'عرض محاولة سابقة':'Viewing previous attempt'; }
        });
    });
}
function toggleCorrection(){
    correctionMode = !correctionMode;
    const btn = document.getElementById('correctionBtn');
    const container = document.getElementById('answerContainer');
    if(correctionMode){
        btn.style.background='#ff9800';
        btn.innerHTML='<i class="fas fa-times"></i> '+ (lang==='ar'?'إلغاء التصحيح':'Exit correction');
        document.getElementById('statusMsg').innerHTML=t.correction_mode_on;
        // تحويل المحتوى الحالي إلى كلمات قابلة للتصحيح
        const text = container.innerText;
        if(text.trim().length>0){
            const words = text.split(/(\\s+)/);
            container.innerHTML = '';
            words.forEach(word=>{
                if(word.trim().length===0) container.appendChild(document.createTextNode(word));
                else{
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.style.display='inline-block'; span.style.margin='0 2px'; span.style.cursor='pointer';
                    span.addEventListener('click',(e)=>{
                        e.stopPropagation();
                        if(!correctionMode) return;
                        let newWord = prompt(lang==='ar'?'تصحيح الكلمة:':'Correct word:', span.textContent);
                        if(newWord && newWord!==span.textContent){ span.textContent=newWord; span.classList.add('corrected-word'); updateWordCount(); document.getElementById('statusMsg').innerHTML='✅ '+t.saved; setTimeout(()=>document.getElementById('statusMsg').innerHTML='',2000); }
                    });
                    container.appendChild(span);
                }
            });
        }
    } else {
        btn.style.background='#f9aa33';
        btn.innerHTML='<i class="fas fa-edit"></i> '+t.correction_btn;
        document.getElementById('statusMsg').innerHTML=t.correction_off;
        // جمع النص من الأقسام وإعادة وضعه كنص عادي
        let plainText = '';
        container.childNodes.forEach(node=>{
            if(node.nodeType===Node.TEXT_NODE) plainText += node.textContent;
            else if(node.tagName==='SPAN') plainText += node.textContent;
        });
        container.innerText = plainText;
        updateWordCount();
    }
}
if(attempts.length===0){ attempts.push({ id:Date.now(), text:"", timestamp:new Date().toLocaleString(), lastEdited:null }); localStorage.setItem(\`attempts_\${testData.testName}\`,JSON.stringify(attempts)); }
currentIdx = attempts.length-1;
renderText(attempts[currentIdx].text);
renderAttemptsList();
document.getElementById('correctionBtn').addEventListener('click', toggleCorrection);
document.getElementById('saveCorrBtn').addEventListener('click', saveCorrections);
document.getElementById('retryBtn').addEventListener('click', newAttempt);
document.getElementById('answerContainer').addEventListener('input', updateWordCount);
if(testData.timerMinutes>0){
    let remaining = testData.timerMinutes*60;
    const timerEl = document.createElement('span'); timerEl.className='badge'; timerEl.id='timerDisplay'; document.querySelector('.test-info').appendChild(timerEl);
    const interval = setInterval(()=>{ let m=Math.floor(remaining/60), s=remaining%60; timerEl.innerHTML=\`⏱️ \${m}:\${s<10?'0'+s:s}\`; if(remaining<=0){ clearInterval(interval); alert(t.time_up); } remaining--; },1000);
}
<\/script></body></html>`;

    if (isPreview) {
        const win = window.open();
        if (win) { win.document.write(testHTML); win.document.close(); }
        else alert(lang === 'ar' ? 'السماح بالنوافذ المنبثقة' : 'Allow popups');
    } else {
        const blob = new Blob([testHTML], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${data.testName.replace(/[^a-z0-9]/gi, '_')}.html`;
        a.click();
        URL.revokeObjectURL(blob);
    }
}

function previewTestPage() { generateTestPage(true); }
function downloadTestPage() { generateTestPage(false); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveTestBtn').addEventListener('click', saveTest);
    document.getElementById('loadTestBtn').addEventListener('click', loadTest);
    document.getElementById('newTestBtn').addEventListener('click', newTest);
    document.getElementById('editTestBtn').addEventListener('click', editTest);
    document.getElementById('previewTestBtn').addEventListener('click', previewTestPage);
    document.getElementById('generateTestBtn').addEventListener('click', downloadTestPage);
    refreshLoadSelect();
});