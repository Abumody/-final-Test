  // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            updateProgressCircle(0);
            initializeButtonEffects();
        });

        // Function to start a grammar/vocabulary activity
        function startActivity(activityType, activityNumber) {
            // Show loading message
            const button = event.currentTarget;
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                // Navigate to the specific activity
                const paddedNumber = activityNumber.toString().padStart(2, '0');
                window.location.href = `${activityType}/${activityType} Activity ${paddedNumber}.html`;
            }, 800);
        }

        // Update progress circle
        function updateProgressCircle(percentage) {
            const circle = document.getElementById('progressCircle');
            const text = document.getElementById('progressText');
            if (!circle || !text) return;

            const radius = 36;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
            text.textContent = `${percentage}%`;
        }

        // Initialize button hover effects
        function initializeButtonEffects() {
            document.querySelectorAll('.activity-btn').forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.05)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        }

        // Simulate progress update (in real app, this would come from user data)
        function simulateProgress() {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                updateProgressCircle(progress);
                
                if (progress >= 15) { // Simulate 15% completion
                    clearInterval(interval);
                }
            }, 200);
        }

        // Start progress simulation after page loads
        setTimeout(simulateProgress, 1000);

        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key >= '1' && e.key <= '9') {
                const activityNumber = parseInt(e.key);
                const button = document.querySelectorAll('.activity-btn')[activityNumber - 1];
                if (button) {
                    button.click();
                }
            }