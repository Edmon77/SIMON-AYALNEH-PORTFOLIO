document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER SCROLL BEHAVIOR ---
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('solid');
        } else {
            header.classList.remove('solid');
        }
    });

     // --- MOBILE MENU SCRIPT ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMobileMenu() {
        if (mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            // Use setTimeout to re-add 'hidden' after transition
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.classList.remove('text-accent-orange'); // Remove orange color
                mobileMenuButton.innerHTML = '&#9776;'; // Ensure it's the hamburger icon
            }, 300); // Must match the CSS transition duration (duration-300)
        }
    }

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        // Small delay to allow 'display' change before starting transition
        setTimeout(() => {
            mobileMenu.classList.add('is-open');
            mobileMenuButton.classList.add('text-accent-orange'); // Add orange color when open
            mobileMenuButton.innerHTML = '&#9776;'; // Keep it the hamburger icon
        }, 10);
    }
    
    // Function to handle the button click
    function toggleMobileMenu() {
        if (mobileMenu.classList.contains('is-open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // A function to be called by menu links to close the menu (and navigate)
    window.closeMobileMenu = function() {
        closeMobileMenu();
    }

    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click from immediately triggering the window listener
        toggleMobileMenu();
    });

    // NEW: Close the menu if a click occurs outside the menu box
    window.addEventListener('click', (e) => {
        // Check if the click target is NOT the menu, and NOT the menu button, AND the menu is open
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target) && mobileMenu.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });


    // --- VIDEO MODAL & LOADING SCRIPT ---
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        container.addEventListener('click', () => {
            const video = container.querySelector('video');
            const videoSrc = video.getAttribute('data-src');

            // If the video is already loaded, just play it in the modal
            if (video.src) {
                openVideoModal(video.src);
                return;
            }

            // If not loaded, start the loading process
            if (videoSrc) {
                loadVideo(container, videoSrc);
            }
        });
    });

    function loadVideo(container, videoSrc) {
        const loaderOverlay = container.querySelector('.loader-overlay');
        const progressCircle = container.querySelector('.progress-circle');
        const progressPercent = container.querySelector('.progress-percent');
        const videoElement = container.querySelector('video');

        // Show loader and mark container as 'loading'
        loaderOverlay.classList.add('visible');
        container.classList.add('loading');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', videoSrc, true);
        xhr.responseType = 'blob';

        // Track loading progress
        xhr.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressPercent.textContent = `${percentComplete}%`;
                progressCircle.style.background = `conic-gradient(#e88d6c ${percentComplete * 3.6}deg, #444 0deg)`;
            }
        };

        // When loading is complete
        xhr.onload = function() {
            if (this.status === 200) {
                const blob = this.response;
                const videoUrl = URL.createObjectURL(blob);
                
                // Set the video source to the loaded video
                videoElement.src = videoUrl;

                // Hide loader and open the modal
                loaderOverlay.classList.remove('visible');
                container.classList.remove('loading');
                openVideoModal(videoUrl);
            }
        };

        xhr.send();
    }
    
    // --- MODAL CONTROLS ---
    function openVideoModal(src) {
        modalVideo.src = src;
        videoModal.classList.remove('hidden');
        modalVideo.play();
    }

    function closeVideoModal() {
        modalVideo.pause();
        modalVideo.src = ''; // Clear the source to stop background loading
        videoModal.classList.add('hidden');
    }
    
    // Attach close functionality to the button
    const closeModalButton = document.querySelector('#videoModal button');
    closeModalButton.onclick = closeVideoModal;

    // Close modal if user clicks on the background overlay
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });


    // --- FOOTER YEAR SCRIPT ---
    document.getElementById('year').textContent = new Date().getFullYear();
});