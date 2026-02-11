// ملف JavaScript العام لجميع اختبارات القراءة
// يحتوي على الدوال المشتركة بين جميع الاختبارات

// دالة العودة إلى الصفحة الرئيسية
function goBackToMain() {
    // الصفحة الرئيسية الحالية
    const mainPage = '../Reading 1- Grade 7.html';
    
    // محاولة الذهاب إلى الصفحة الرئيسية
    window.location.href = mainPage;
    
    // بديل: إذا لم تكن الصفحة موجودة، العودة للصفحة السابقة
    setTimeout(() => {
        // إذا لم نتحول للصفحة الرئيسية بعد 500 مللي ثانية
        if (window.location.href.includes('Reading 00') || 
            window.location.href.includes('Reading 01') ||
            window.location.href.includes('Reading 02')) {
            window.history.back();
        }
    }, 500);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // متغيرات عامة
    const matchItems = document.querySelectorAll('.match-item');
    const answerSelects = document.querySelectorAll('.answer-select');
    const optionItems = document.querySelectorAll('.option-item');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    const showBtn = document.getElementById('show-btn');
    const explanationBtn = document.getElementById('explanation-btn');
    const results = document.getElementById('results');
    const closeResults = document.getElementById('close-results');
    const reviewBtn = document.getElementById('review-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const backBtn = document.getElementById('back-btn'); // زر العودة الجديد
    const scoreCircle = document.getElementById('score-circle');
    const scorePercent = document.getElementById('score-percent');
    const scoreValue = document.getElementById('score-value');
    const reading01Score = document.getElementById('reading-01-score');
    const reading02Score = document.getElementById('reading-02-score');
    const feedback = document.getElementById('feedback');
    
    // تخزين إجابات المستخدم
    let userAnswers = {};
    
    // تحميل الأجابات الصحيحة
    let correctAnswers = {};
    let answerExplanations = {};
    
    // تهيئة إجابات المستخدم
    function initializeUserAnswers() {
        userAnswers = {};
        matchItems.forEach(item => {
            const id = item.getAttribute('data-id');
            userAnswers[id] = '';
        });
    }
    
    // تحميل الأجابات من الملف الخارجي
    function loadAnswers() {
        // التحقق من وجود كائن testAnswers (يتم تحميله من الملف الخارجي)
        if (typeof testAnswers !== 'undefined') {
            correctAnswers = testAnswers;
            console.log('Answers loaded successfully from external file');
        } else {
            console.warn('No external answers file found, using empty answers');
            correctAnswers = {};
        }
        
        // تحميل الشروحات إن وجدت
        if (typeof answerExplanationsObj !== 'undefined') {
            answerExplanations = answerExplanationsObj;
        }
    }
    
    // تحديث حالة العناصر المختارة
    function updateOptionItems() {
        // إعادة تعيين جميع العناصر
        optionItems.forEach(item => {
            item.classList.remove('used', 'correct', 'extra');
        });
        
        // تتبع الخيارات المستخدمة
        const usedOptions = [];
        
        // وضع علامة على الخيارات المختارة
        Object.values(userAnswers).forEach(answer => {
            if (answer && answer !== '') {
                usedOptions.push(answer);
                
                // البحث عن العنصر ووضع علامة عليه
                const optionItem = document.querySelector(`.option-item[data-id="${answer}"]`);
                if (optionItem) {
                    optionItem.classList.add('used');
                }
            }
        });
        
        // التحقق من الإجابات الصحيحة/الخاطئة إذا تم التحقق
        if (checkBtn.classList.contains('checked')) {
            checkAnswers(false); // التحقق بدون عرض النتائج
        }
    }
    
    // التحقق من الإجابات
    function checkAnswers(showResults = true) {
        // تحميل الأجابات أولاً
        loadAnswers();
        
        let correctCount = 0;
        let reading01Correct = 0;
        let reading02Correct = 0;
        
        // التحقق من كل عنصر مطابقة
        matchItems.forEach(item => {
            const id = item.getAttribute('data-id');
            const correctAnswer = correctAnswers[id] || ''; // من الملف الخارجي
            const userAnswer = userAnswers[id] || '';
            
            // إزالة الحالة السابقة
            item.classList.remove('correct', 'incorrect');
            
            // التحقق إذا كانت الإجابة صحيحة
            if (userAnswer === correctAnswer && correctAnswer !== '') {
                item.classList.add('correct');
                correctCount++;
                
                // تحديث درجات الأقسام
                if (id <= 4) {
                    reading01Correct++;
                } else {
                    reading02Correct++;
                }
                
                // وضع علامة على الخيار كصحيح
                const optionItem = document.querySelector(`.option-item[data-id="${userAnswer}"]`);
                if (optionItem) {
                    optionItem.classList.add('correct');
                }
            } else if (userAnswer !== '') {
                item.classList.add('incorrect');
                
                // وضع علامة على الخيار كمستخدم ولكن غير صحيح
                const optionItem = document.querySelector(`.option-item[data-id="${userAnswer}"]`);
                if (optionItem) {
                    optionItem.classList.add('used');
                }
            }
        });
        
        // وضع علامة على الخيارات الصحيحة التي لم يتم اختيارها
        optionItems.forEach(item => {
            const optionId = item.getAttribute('data-id');
            let isCorrectOption = false;
            
            // التحقق إذا كان هذا الخيار إجابة صحيحة لأي سؤال
            matchItems.forEach(matchItem => {
                const id = matchItem.getAttribute('data-id');
                const correctAnswer = correctAnswers[id] || '';
                if (correctAnswer === optionId) {
                    isCorrectOption = true;
                }
            });
            
            // وضع علامة كصحيح إذا كانت إجابة صحيحة ولكن لم يتم اختيارها
            if (isCorrectOption && !item.classList.contains('used')) {
                item.classList.add('correct');
            }
            
            // وضع علامة على الخيارات الزائدة (غير مستخدمة في أي إجابة صحيحة)
            if (!isCorrectOption) {
                item.classList.add('extra');
            }
        });
        
        // وضع علامة على زر التحقق كمفحوص
        checkBtn.classList.add('checked');
        
        // عرض النتائج إذا طُلب
        if (showResults) {
            showResultsPanel(correctCount, reading01Correct, reading02Correct);
        }
        
        return { correctCount, reading01Correct, reading02Correct };
    }
    
    // عرض لوحة النتائج مع الدرجة
    function showResultsPanel(correctCount, reading01Correct, reading02Correct) {
        const totalQuestions = matchItems.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        
        // تحديث عرض الدرجة
        scoreValue.textContent = `${correctCount}`;
        reading01Score.textContent = `${reading01Correct}/4`;
        reading02Score.textContent = `${reading02Correct}/4`;
        
        // تحديث دائرة التقدم
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        scoreCircle.style.strokeDasharray = `${circumference}`;
        scoreCircle.style.strokeDashoffset = offset;
        scorePercent.textContent = `${percentage}%`;
        
        // تحديث التعليقات بناءً على الدرجة
        let feedbackText = '';
        let feedbackClass = '';
        
        if (percentage === 100) {
            feedbackText = "🎉 Excellent! Perfect score! You've mastered this reading exercise!";
            feedbackClass = "excellent";
        } else if (percentage >= 75) {
            feedbackText = "👍 Very good! You have a strong understanding of reading comprehension.";
            feedbackClass = "good";
        } else if (percentage >= 50) {
            feedbackText = "📚 Good effort! Review the answers to improve your score next time.";
            feedbackClass = "average";
        } else {
            feedbackText = "💡 Keep practicing! Pay attention to keywords and context clues in the texts.";
            feedbackClass = "needs-improvement";
        }
        
        feedback.innerHTML = `<p class="${feedbackClass}">${feedbackText}</p>`;
        
        // عرض لوحة النتائج
        results.classList.add('show');
        
        // التمرير إلى النتائج
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // عرض جميع الإجابات الصحيحة
    function showAnswers() {
        // تحميل الأجابات أولاً
        loadAnswers();
        
        matchItems.forEach(item => {
            const id = item.getAttribute('data-id');
            const correctAnswer = correctAnswers[id] || '';
            const select = item.querySelector('.answer-select');
            
            // تعيين الاختيار للإجابة الصحيحة
            select.value = correctAnswer;
            
            // تحديث إجابة المستخدم
            userAnswers[id] = correctAnswer;
            
            // وضع علامة كصحيح
            item.classList.add('correct');
        });
        
        // تحديث عناصر الخيارات
        updateOptionItems();
        
        // وضع علامة على جميع الخيارات الصحيحة
        optionItems.forEach(item => {
            const optionId = item.getAttribute('data-id');
            let isCorrectOption = false;
            
            // التحقق إذا كان هذا الخيار إجابة صحيحة لأي سؤال
            matchItems.forEach(matchItem => {
                const id = matchItem.getAttribute('data-id');
                const correctAnswer = correctAnswers[id] || '';
                if (correctAnswer === optionId) {
                    isCorrectOption = true;
                }
            });
            
            // وضع علامة كصحيح
            if (isCorrectOption) {
                item.classList.add('correct');
            } else {
                item.classList.add('extra');
            }
        });
        
        // وضع علامة على زر التحقق كمفحوص
        checkBtn.classList.add('checked');
    }
    
    // إعادة تعيين جميع الإجابات
    function resetAnswers() {
        // إعادة تعيين جميع الاختيارات
        answerSelects.forEach(select => {
            select.value = '';
        });
        
        // إعادة تعيين جميع عناصر المطابقة
        matchItems.forEach(item => {
            item.classList.remove('correct', 'incorrect');
            
            // إزالة أي مربعات شرح
            const existingExplanation = item.querySelector('.explanation-box');
            if (existingExplanation) {
                existingExplanation.remove();
            }
            
            // إعادة تعيين إجابة المستخدم
            const id = item.getAttribute('data-id');
            userAnswers[id] = '';
        });
        
        // إعادة تعيين جميع عناصر الخيارات
        optionItems.forEach(item => {
            item.classList.remove('used', 'correct', 'extra');
        });
        
        // إزالة الحالة المفحوصة من زر التحقق
        checkBtn.classList.remove('checked');
        
        // إخفاء النتائج
        results.classList.remove('show');
    }
    
    // عرض الشروحات
    function showExplanations() {
        // تحميل الشروحات أولاً
        loadAnswers();
        
        matchItems.forEach(item => {
            const id = item.getAttribute('data-id');
            const explanation = answerExplanations[id];
            
            // إزالة أي شرح موجود مسبقاً
            const existingExplanation = item.querySelector('.explanation-box');
            if (existingExplanation) {
                existingExplanation.remove();
            }
            
            // إضافة الشرح إذا كان موجوداً
            if (explanation) {
                const explanationBox = document.createElement('div');
                explanationBox.className = 'explanation-box show';
                explanationBox.innerHTML = `
                    <div class="explanation-header">
                        <i class="fas fa-lightbulb"></i>
                        <span>Explanation:</span>
                    </div>
                    <div class="explanation-text">${explanation}</div>
                `;
                
                // إضافة الشرخ بعد عنصر الإجابة
                const answerDiv = item.querySelector('.match-answer');
                answerDiv.parentNode.insertBefore(explanationBox, answerDiv.nextSibling);
            }
        });
    }
    
    // مراجعة الإجابات - تسليط الضوء على الصحيحة/الخاطئة
    function reviewAnswers() {
        checkAnswers(false);
        
        // التمرير إلى السؤال الأول
        document.querySelector('.reading-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // إضافة مستمعي الأحداث للاختيارات
    answerSelects.forEach(select => {
        select.addEventListener('change', function() {
            const matchItem = this.closest('.match-item');
            const id = matchItem.getAttribute('data-id');
            const value = this.value;
            
            // تحديث إجابة المستخدم
            userAnswers[id] = value;
            
            // إزالة أي فئات حالة سابقة
            matchItem.classList.remove('correct', 'incorrect');
            
            // تحديث مظهر عناصر الخيارات
            updateOptionItems();
        });
    });
    
    // مستمعي الأحداث للأزرار
    checkBtn.addEventListener('click', function() {
        checkAnswers(true);
    });
    
    resetBtn.addEventListener('click', resetAnswers);
    
    showBtn.addEventListener('click', showAnswers);
    
    explanationBtn.addEventListener('click', showExplanations);
    
    closeResults.addEventListener('click', function() {
        results.classList.remove('show');
    });
    
    reviewBtn.addEventListener('click', reviewAnswers);
    
    tryAgainBtn.addEventListener('click', function() {
        resetAnswers();
        results.classList.remove('show');
        
        // التمرير إلى الأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // إضافة مستمع حدث لزر العودة إذا كان موجوداً
    if (backBtn) {
        backBtn.addEventListener('click', goBackToMain);
    }
    
    // التهيئة الأولية
    initializeUserAnswers();
    loadAnswers();
    updateOptionItems();
    
    // تسجيل جاهزية النظام
    console.log('Reading Test System Initialized Successfully');
});