// Media files data
const mediaFiles = [
    {
        id: 1,
        title: "Kytka Final MV",
        type: "video",
        path: "public/videos/kytka final MV.mov",
        description: "Music Video",
        icon: "🎬"
    },
    // Add more audio files here
    {
        id: 2,
        title: "Sample Audio 1",
        type: "audio",
        path: "public/audio/sample1.mp3",
        description: "Audio Track",
        icon: "🎵"
    },
    {
        id: 3,
        title: "Sample Audio 2",
        type: "audio",
        path: "public/audio/sample2.mp3",
        description: "Audio Track",
        icon: "🎵"
    }
];

// Modal state
let isFullscreen = false;
let isMinimized = false;

// Render media cards
function renderMusicCards() {
    const musicGrid = document.getElementById('musicGrid');
    
    mediaFiles.forEach(media => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.style.position = 'relative';
        
        card.innerHTML = `
            <div class="music-card-image">${media.icon}</div>
            <span class="media-type-badge ${media.type}-badge">${media.type}</span>
            <div class="music-card-content">
                <div class="music-card-title">${media.title}</div>
                <div class="music-card-artist">${media.description}</div>
            </div>
        `;
        
        // Add click event to open modal
        card.addEventListener('click', () => openModal(media));
        
        musicGrid.appendChild(card);
    });
}

// Open modal with media
function openModal(media) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalPlayer = document.getElementById('modalPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    // Reset modal state
    modalPlayer.classList.remove('fullscreen', 'minimized');
    isFullscreen = false;
    isMinimized = false;
    
    // Set title
    modalTitle.textContent = media.title;
    
    // Create media element
    let mediaElement;
    if (media.type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.controls = true;
        mediaElement.autoplay = true;
    } else {
        mediaElement = document.createElement('audio');
        mediaElement.controls = true;
        mediaElement.autoplay = true;
    }
    
    mediaElement.src = media.path;
    
    // Clear and add media to modal
    modalContent.innerHTML = '';
    modalContent.appendChild(mediaElement);
    
    // Show modal
    modalOverlay.classList.add('active');
}

// Close modal
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    // Stop and remove media
    const mediaElement = modalContent.querySelector('video, audio');
    if (mediaElement) {
        mediaElement.pause();
        mediaElement.src = '';
    }
    
    modalOverlay.classList.remove('active');
}

// Toggle fullscreen
function toggleFullscreen() {
    const modalPlayer = document.getElementById('modalPlayer');
    
    if (isFullscreen) {
        modalPlayer.classList.remove('fullscreen');
        isFullscreen = false;
    } else {
        modalPlayer.classList.add('fullscreen');
        modalPlayer.classList.remove('minimized');
        isFullscreen = true;
        isMinimized = false;
    }
}

// Toggle minimize
function toggleMinimize() {
    const modalPlayer = document.getElementById('modalPlayer');
    
    if (isMinimized) {
        modalPlayer.classList.remove('minimized');
        isMinimized = false;
    } else {
        modalPlayer.classList.add('minimized');
        modalPlayer.classList.remove('fullscreen');
        isMinimized = true;
        isFullscreen = false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get background colors from global scope
    const bgColor = window.bgColor;
    const txtColor = window.txtColor;
    
    console.log('Media Gallery - Background Color:', bgColor, 'Text Color:', txtColor);
    
    // Set container background
    const musicContainer = document.querySelector('.music-container');
    if (musicContainer) {
        musicContainer.style.backgroundColor = bgColor;
    }
    
    // Update all text colors
    document.querySelectorAll('.music-header h1, .music-header p, .music-card-title, .music-card-artist, .music-card-year').forEach(el => {
        el.style.color = txtColor;
    });
    
    // Render media cards
    renderMusicCards();
    
    // Modal control event listeners
    document.getElementById('closeBtn').addEventListener('click', closeModal);
    document.getElementById('expandBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('minimizeBtn').addEventListener('click', toggleMinimize);
    
    // Close on overlay click
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') {
            closeModal();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
