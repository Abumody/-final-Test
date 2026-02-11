// ملف JavaScript العام لاختبارات القراءة من النوع 2 (إجابات قصيرة)
// يحتوي على الدوال المشتركة بين جميع اختبارات Reading 2

// دالة العودة إلى الصفحة الرئيسية لـ Reading 2
function goBackToMainReading2() {
    // الصفحة الرئيسية لـ Reading 2
    const mainPage = '../Reading 2- Grade 7.html';
    
    // محاولة الذهاب إلى الصفحة الرئيسية
    window.location.href = mainPage;
    
    // بديل: إذا لم تكن الصفحة موجودة، العودة للصفحة السابقة
    setTimeout(() => {
        if (window.location.href.includes('Reading2')) {
            window.history.back();
        }
    }, 500);
}

// دالة التوافق مع onclick القديم
function goBack() {
    goBackToMainReading2();
}

// جعل الدوال متاحة عالمياً
window.goBack = goBack;
window.goBackToMainReading2 = goBackToMainReading2;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // متغيرات عامة
    const questionItems = document.querySelectorAll('.question-item');
    const answerInputs = document.querySelectorAll('.answer-input');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    const showBtn = document.getElementById('show-btn');
    const backBtn = document.getElementById('back-btn');
    const results = document.getElementById('results');
    const closeResults = document.getElementById('close-results');
    const reviewBtn = document.getElementById('review-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const scoreCircle = document.getElementById('score-circle');
    const scorePercent = document.getElementById('score-percent');
    const scoreValue = document.getElementById('score-value');
    const feedback = document.getElementById('feedback');
    
    // تخزين إجابات المستخدم
    let userAnswers = {};
    
    // تحميل الأجابات الصحيحة
    let correctAnswers = {};
    
    // تهيئة إجابات المستخدم
    function initializeUserAnswers() {
        userAnswers = {};
        questionItems.forEach(item => {
            const id = item.getAttribute('data-id');
            userAnswers[id] = '';
        });
    }
    
    // تحميل الأجابات من الملف الخارجي
    function loadAnswers() {
        // التحقق من وجود كائن testAnswers2 (يتم تحميله من الملف الخارجي)
        if (typeof testAnswers2 !== 'undefined') {
            correctAnswers = testAnswers2;
            console.log('Reading 2 Answers loaded successfully from external file');
        } else {
            // استخدام الأجابات من data-correct attribute
            console.log('Using answers from data-correct attributes');
            questionItems.forEach(item => {
                const id = item.getAttribute('data-id');
                const correctAnswer = item.getAttribute('data-correct');
                correctAnswers[id] = correctAnswer;
            });
        }
    }
    
    // تحقق من عدد الكلمات في الإجابة
    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
    
    // تطبيع النص للمقارنة
    function normalizeText(text) {
        return text.toLowerCase().trim().replace(/\s+/g, ' ');
    }
    
    // التحقق من الإجابات
    function checkAnswers(showResults = true) {
        // تحميل الأجابات أولاً
        loadAnswers();
        
        let correctCount = 0;
        
        // التحقق من كل سؤال
        questionItems.forEach(item => {
            const id = item.getAttribute('data-id');
            const correctAnswer = correctAnswers[id] || '';
            const input = item.querySelector('.answer-input');
            const userAnswer = normalizeText(input.value);
            const correctAnswerBox = item.querySelector('.correct-answer');
            
            // إزالة الحالة السابقة
            input.classList.remove('correct', 'incorrect', 'show-correct');
            
            // إخفاء إجابة الصحيحة
            if (correctAnswerBox) {
                correctAnswerBox.classList.remove('show');
            }
            
            // التحقق إذا كانت الإجابة صحيحة
            if (userAnswer !== '') {
                // تقسيم الإجابات الصحيحة المحتملة (مفصولة ب|)
                const possibleCorrectAnswers = correctAnswer.split('|').map(ans => normalizeText(ans));
                
                // التحقق من عدد الكلمات
                const wordCount = countWords(input.value);
                
                if (wordCount > 4) {
                    // إذا كانت أكثر من 4 كلمات
                    input.classList.add('incorrect');
                    input.title = 'Answer has more than 4 words!';
                } else if (possibleCorrectAnswers.includes(userAnswer)) {
                    // إذا كانت الإجابة صحيحة
                    input.classList.add('correct');
                    correctCount++;
                } else {
                    // إذا كانت الإجابة خاطئة
                    input.classList.add('incorrect');
                }
            }
        });
        
        // وضع علامة على زر التحقق كمفحوص
        checkBtn.classList.add('checked');
        
        // عرض النتائج إذا طُلب
        if (showResults) {
            showResultsPanel(correctCount);
        }
        
        return correctCount;
    }
    
    // عرض لوحة النتائج مع الدرجة
    function showResultsPanel(correctCount) {
        const totalQuestions = questionItems.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        
        // تحديث عرض الدرجة
        scoreValue.textContent = `${correctCount}`;
        
        // تحديث دائرة التقدم
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        scoreCircle.style.strokeDasharray = `${circumference}`;
        scoreCircle.style.strokeDashoffset = offset;
        scorePercent.textContent = `${percentage}%`;
        
        // تحديث التعليقات بناءً على الدرجة
        let feedbackText = '';
        
        if (percentage === 100) {
            feedbackText = "🎉 Perfect score! Excellent reading comprehension!";
            feedback.style.color = '#2e7d32';
            feedback.style.background = '#e8f5e9';
        } else if (percentage >= 80) {
            feedbackText = "👍 Very good! You understood the text very well.";
            feedback.style.color = '#1565c0';
            feedback.style.background = '#e3f2fd';
        } else if (percentage >= 60) {
            feedbackText = "📚 Good effort! Review the text and try again.";
            feedback.style.color = '#ef6c00';
            feedback.style.background = '#fff3e0';
        } else {
            feedbackText = "💡 Practice more! Read carefully and look for key words.";
            feedback.style.color = '#c62828';
            feedback.style.background = '#ffebee';
        }
        
        feedback.innerHTML = `<p>${feedbackText}</p>`;
        
        // عرض لوحة النتائج
        results.classList.add('show');
        
        // التمرير إلى النتائج
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // عرض جميع الإجابات الصحيحة
    function showAnswers() {
        // تحميل الأجابات أولاً
        loadAnswers();
        
        questionItems.forEach(item => {
            const id = item.getAttribute('data-id');
            const correctAnswer = correctAnswers[id] || '';
            const input = item.querySelector('.answer-input');
            const correctAnswerBox = item.querySelector('.correct-answer');
            
            // إزالة الحالة السابقة
            input.classList.remove('correct', 'incorrect');
            
            // تعيين الإجابة الصحيحة في حقل الإدخال
            const firstCorrectAnswer = correctAnswer.split('|')[0];
            input.value = firstCorrectAnswer.trim();
            
            // تحديث إجابة المستخدم
            userAnswers[id] = normalizeText(input.value);
            
            // وضع علامة كإجابة معروضة
            input.classList.add('show-correct');
            
            // عرض الإجابة الصحيحة
            if (correctAnswerBox) {
                correctAnswerBox.classList.add('show');
            }
        });
        
        // وضع علامة على زر التحقق كمفحوص
        checkBtn.classList.add('checked');
    }
    
    // إعادة تعيين جميع الإجابات
    function resetAnswers() {
        // إعادة تعيين جميع حقول الإدخال
        answerInputs.forEach(input => {
            input.value = '';
            input.classList.remove('correct', 'incorrect', 'show-correct');
            input.title = '';
        });
        
        // إعادة تعيين جميع الإجابات الصحيحة المعروضة
        const correctAnswerBoxes = document.querySelectorAll('.correct-answer');
        correctAnswerBoxes.forEach(box => {
            box.classList.remove('show');
        });
        
        // إعادة تعيين إجابات المستخدم
        initializeUserAnswers();
        
        // إزالة الحالة المفحوصة من زر التحقق
        checkBtn.classList.remove('checked');
        
        // إخفاء النتائج
        results.classList.remove('show');
    }
    
    // مراجعة الإجابات
    function reviewAnswers() {
        checkAnswers(false);
        
        // التمرير إلى السؤال الأول
        document.querySelector('.questions-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // إضافة مستمعي الأحداث لحقول الإدخال
    answerInputs.forEach(input => {
        input.addEventListener('input', function() {
            const questionItem = this.closest('.question-item');
            const id = questionItem.getAttribute('data-id');
            
            // تحديث إجابة المستخدم
            userAnswers[id] = normalizeText(this.value);
            
            // إزالة أي فئات حالة سابقة
            this.classList.remove('correct', 'incorrect');
            
            // التحقق من عدد الكلمات
            const wordCount = countWords(this.value);
            const wordCountDisplay = this.parentElement.querySelector('.word-count');
            
            if (wordCountDisplay) {
                if (wordCount > 4) {
                    wordCountDisplay.style.color = '#f44336';
                    wordCountDisplay.innerHTML = `⚠️ Too many words: ${wordCount}/4`;
                } else {
                    wordCountDisplay.style.color = '#757575';
                    wordCountDisplay.textContent = `Words: ${wordCount}/4`;
                }
            }
        });
        
        // إضافة focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 0 0 2px rgba(249, 170, 51, 0.3)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = '';
        });
    });
    
    // مستمعي الأحداث للأزرار
    if (checkBtn) {
        checkBtn.addEventListener('click', function() {
            checkAnswers(true);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAnswers);
    }
    
    if (showBtn) {
        showBtn.addEventListener('click', showAnswers);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', goBackToMainReading2);
    }
    
    if (closeResults) {
        closeResults.addEventListener('click', function() {
            results.classList.remove('show');
        });
    }
    
    if (reviewBtn) {
        reviewBtn.addEventListener('click', reviewAnswers);
    }
    
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            resetAnswers();
            results.classList.remove('show');
            
            // التمرير إلى الأعلى
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // التهيئة الأولية
    initializeUserAnswers();
    loadAnswers();
    
    // تسجيل جاهزية النظام
    console.log('Reading 2 Test System Initialized Successfully');
});