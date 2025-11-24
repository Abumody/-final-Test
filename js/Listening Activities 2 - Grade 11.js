// Function to go back to main page
        function goBack() {
            // Navigate back to main page
            window.location.href = "Complete Exam Preparation Portal.html";
        }
        
        // Function to reset progress
        function resetProgress() {
            if (confirm("Are you sure you want to reset all your progress?")) {
                alert("Progress has been reset!");
                // In a real implementation, this would clear stored progress data
                localStorage.removeItem('listeningProgress');
            }
        }
        
        // Add some interactive effects
        document.querySelectorAll('.activity-btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });