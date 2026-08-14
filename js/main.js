/* ==========================================================================
   HOPE & HANDS NGO WEBSITE - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-xmark');
                    }
                }
            }
        });
    });

    // --- 2. Animated Stats Counter ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function startCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target') || '0', 10);
            const duration = 2000; // 2 seconds
            const step = Math.ceil(target / (duration / 20));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target.toLocaleString() + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = current.toLocaleString() + '+';
                }
            }, 20);
        });
    }

    // Scroll trigger for counters
    const statsSection = document.querySelector('.stats-counter-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                startCounters();
                animated = true;
            }
        }, { threshold: 0.4 });

        observer.observe(statsSection);
    }

    // --- 3. Modals Management System ---
    const donateModal = document.getElementById('donateModal');
    const videoModal = document.getElementById('videoModal');
    const volunteerModal = document.getElementById('volunteerModal');

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Stop video if closing video modal
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = src;
            }
        }
    };

    // Close modal on background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Preset Amount Selection for Donation
    const presetBtns = document.querySelectorAll('.preset-btn');
    const customAmountInput = document.getElementById('customAmountInput');
    const donationAmountDisplay = document.getElementById('donationAmountDisplay');

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-val');
            if (customAmountInput) customAmountInput.value = '';
            if (donationAmountDisplay) donationAmountDisplay.textContent = '₹' + parseInt(val, 10).toLocaleString('en-IN');
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('input', (e) => {
            presetBtns.forEach(b => b.classList.remove('active'));
            const val = e.target.value || '0';
            if (donationAmountDisplay) donationAmountDisplay.textContent = '₹' + (val ? parseInt(val, 10).toLocaleString('en-IN') : '0');
        });
    }

    // Donation Form Submit
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = donationAmountDisplay ? donationAmountDisplay.textContent : '₹1,000';
            closeModal('donateModal');
            showToast(`❤️ Thank you! Your donation of ${amount} was processed successfully.`);
            donationForm.reset();
        });
    }

    // Volunteer Form Submit
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal('volunteerModal');
            showToast('🌟 Thank you for registering as a volunteer! Our team will contact you shortly.');
            volunteerForm.reset();
        });
    }

    // --- 4. Newsletter Form Submit ---
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            showToast(`✉️ Thank you! ${email} has been subscribed to our newsletter.`);
            newsletterForm.reset();
        });
    }

    // --- 5. Toast Notification System ---
    window.showToast = function(message) {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fa-solid fa-circle-check toast-icon"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Animate out & remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    // Smooth active navigation highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });
});
