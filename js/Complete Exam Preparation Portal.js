// Student Info Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get student info from localStorage
    const studentName = localStorage.getItem('studentName');
    const studentGrade = localStorage.getItem('studentGrade');

    // Display student info if available
    if (studentName && studentGrade) {
        const studentInfo = document.getElementById('studentInfo');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        // Update student info
        document.getElementById('studentName').textContent = studentName;
        document.getElementById('studentGrade').textContent = `Grade ${studentGrade}`;
        document.getElementById('welcomeName').textContent = studentName;
        
        // Show elements
        studentInfo.style.display = 'block';
        welcomeMessage.style.display = 'block';
        
        console.log(`Welcome ${studentName} (Grade ${studentGrade})!`);
    } else {
        // Redirect to login if no student info
        console.log('No student info found, redirecting to login...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // إضافة تأثيرات التفاعل للبطاقات والأزرار
    const sectionCards = document.querySelectorAll('.section-card');
    
    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // النقر على البطاقة (بديل للنقر على الزر)
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                const link = this.querySelector('.btn');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
    });

    // تأثيرات الأزرار
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // تأثير النقر
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });

    // إضافة رسالة ترحيب
    console.log('مرحباً بك في منصة التحضير للاختبارات!');
    
    // تتبع النقر على البطاقات (لأغراض التحليل)
    sectionCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h2').textContent;
            console.log(`تم النقر على: ${cardTitle}`);
        });
    });
});

// دالة للمساعدة في التنقل
function navigateToSection(sectionUrl) {
    window.location.href = sectionUrl;
}

// دالة لإظهار رسالة تحميل
function showLoading(message = 'جاري التحميل...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000;
    `;
    loadingDiv.textContent = message;
    document.body.appendChild(loadingDiv);
}

// دالة لإخفاء رسالة التحميل
function hideLoading() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}// إضافة تأثيرات التفاعل للبطاقات والأزرار
document.addEventListener('DOMContentLoaded', function() {
    // تأثيرات البطاقات
    const sectionCards = document.querySelectorAll('.section-card');
    
    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // النقر على البطاقة (بديل للنقر على الزر)
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                const link = this.querySelector('.btn');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
    });

    // تأثيرات الأزرار
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // تأثير النقر
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });

    // إضافة رسالة ترحيب
    console.log('مرحباً بك في منصة التحضير للاختبارات!');
    
    // تتبع النقر على البطاقات (لأغراض التحليل)
    sectionCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h2').textContent;
            console.log(`تم النقر على: ${cardTitle}`);
        });
    });
});

// دالة للمساعدة في التنقل
function navigateToSection(sectionUrl) {
    window.location.href = sectionUrl;
}

// دالة لإظهار رسالة تحميل
function showLoading(message = 'جاري التحميل...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000;
    `;
    loadingDiv.textContent = message;
    document.body.appendChild(loadingDiv);
}

// دالة لإخفاء رسالة التحميل
function hideLoading() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}