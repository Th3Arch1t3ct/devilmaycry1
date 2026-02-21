// Music Videos JavaScript - Non-draggable clickable icons with modal video player

// Video data
const videos = [
    {
        title: "Kytka",
        icon: "🎬",
        thumbnail: "../public/icons/kytka.JPEG",
        videoPath: "../public/videos/kytka final MV.mov"
    }
    // Add more videos here in the future
];

// Calculate icon positions
function calculateIconPositions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Use container dimensions, not viewport
    const containerWidth = viewportWidth;
    const containerHeight = viewportHeight - 130; // Account for header
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    const positions = [];
    
    if (viewportWidth <= 768) {
        // Mobile: 2 column grid
        const iconWidth = 100;
        const iconSpacing = 40;
        const totalWidth = (iconWidth * 2) + iconSpacing;
        const startX = centerX - totalWidth / 2;
        const startY = Math.max(50, centerY - (Math.ceil(videos.length / 2) * 90));
        
        videos.forEach((video, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            positions.push({
                x: startX + (col * (iconWidth + iconSpacing)),
                y: startY + (row * 160)
            });
        });
    } else {
        // Desktop: grid layout with spacing
        const cols = Math.min(3, videos.length);
        const rows = Math.ceil(videos.length / cols);
        const iconSpacing = 200;
        const totalWidth = (cols - 1) * iconSpacing;
        const startX = centerX - totalWidth / 2;
        const startY = Math.max(50, centerY - ((rows - 1) * 100));
        
        videos.forEach((video, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            positions.push({
                x: startX + (col * iconSpacing),
                y: startY + (row * 200)
            });
        });
    }
    
    return positions;
}

// Initialize icon grid
function initializeMediaGrid() {
    const iconsWrapper = document.getElementById('iconsWrapper');
    if (!iconsWrapper) return;
    
    // Clear existing content to prevent duplicates
    iconsWrapper.innerHTML = '';
    
    const positions = calculateIconPositions();
    const textColor = window.txtColor || '#ffffff';
    
    videos.forEach((video, index) => {
        const icon = document.createElement('div');
        icon.className = 'draggable-icon';
        icon.id = `icon-${index}`;
        icon.setAttribute('data-video-index', index);
        icon.style.left = `${positions[index].x}px`;
        icon.style.top = `${positions[index].y}px`;
        
        icon.innerHTML = `
            <div class="icon-content">
                <div class="icon-image-wrapper">
                    <img 
                        src="${video.thumbnail}" 
                        alt="${video.title}"
                        class="icon-image"
                        draggable="false"
                    />
                </div>
                <span class="icon-title" style="color: ${textColor}">
                    ${video.title}
                </span>
            </div>
        `;
        
        // Add mouse down event for dragging
        icon.addEventListener('mousedown', function(e) {
            handleMouseDown(index, e);
        });
        
        // Add touch start event for mobile
        icon.addEventListener('touchstart', function(e) {
            handleTouchStart(index, e);
        }, { passive: false });
        
        iconsWrapper.appendChild(icon);
    });
}

// Drag state
let activeIcon = null;
let startPos = { x: 0, y: 0 };
let isDragging = false;
let hasMoved = false;
let touchStartTime = 0;
let totalMovement = 0;

// Handle mouse down to start dragging
function handleMouseDown(index, e) {
    e.preventDefault();
    activeIcon = index;
    startPos = { x: e.clientX, y: e.clientY };
    isDragging = true;
    hasMoved = false;

    const iconElement = document.getElementById(`icon-${index}`);
    if (iconElement) {
        iconElement.classList.add('dragging');
    }
}

// Handle touch start for mobile
function handleTouchStart(index, e) {
    activeIcon = index;
    startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isDragging = false;
    hasMoved = false;
    touchStartTime = Date.now();
    totalMovement = 0;

    const iconElement = document.getElementById(`icon-${index}`);
    if (iconElement) {
        iconElement.classList.add('dragging');
    }
}

// Handle mouse move to update position
function handleMouseMove(e) {
    if (activeIcon !== null && isDragging) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasMoved = true;
        }

        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            const currentLeft = parseInt(iconElement.style.left) || 0;
            const currentTop = parseInt(iconElement.style.top) || 0;
            iconElement.style.left = `${currentLeft + deltaX}px`;
            iconElement.style.top = `${currentTop + deltaY}px`;
        }

        startPos = { x: e.clientX, y: e.clientY };
    }
}

// Handle touch move for mobile
function handleTouchMove(e) {
    if (activeIcon !== null) {
        const deltaX = e.touches[0].clientX - startPos.x;
        const deltaY = e.touches[0].clientY - startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        totalMovement += distance;

        if (totalMovement > 10) {
            isDragging = true;
            hasMoved = true;
            e.preventDefault();
        }

        if (isDragging) {
            const iconElement = document.getElementById(`icon-${activeIcon}`);
            if (iconElement) {
                const currentLeft = parseInt(iconElement.style.left) || 0;
                const currentTop = parseInt(iconElement.style.top) || 0;
                iconElement.style.left = `${currentLeft + deltaX}px`;
                iconElement.style.top = `${currentTop + deltaY}px`;
            }

            startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }
}

// Handle mouse up to stop dragging
function handleMouseUp(e) {
    if (activeIcon !== null) {
        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            iconElement.classList.remove('dragging');
        }

        // If not dragged, open player
        if (!hasMoved) {
            openVideoPlayer(activeIcon);
        }

        activeIcon = null;
        isDragging = false;
        hasMoved = false;
    }
}

// Handle touch end for mobile
function handleTouchEnd(e) {
    if (activeIcon !== null) {
        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            iconElement.classList.remove('dragging');
        }

        const touchDuration = Date.now() - touchStartTime;

        // If tap (not drag), open player
        if (!hasMoved && touchDuration < 300) {
            e.preventDefault();
            openVideoPlayer(activeIcon);
        }

        activeIcon = null;
        isDragging = false;
        hasMoved = false;
        totalMovement = 0;
    }
}

// Attach global event listeners
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd);

// Recalculate positions on window resize
window.addEventListener('resize', function() {
    initializeMediaGrid();
});

// Modal player state
let currentVideoIndex = null;
let isFullscreen = false;
let isMinimized = false;

// Get modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const minimizeBtn = document.getElementById('minimizeBtn');
const expandBtn = document.getElementById('expandBtn');
const closeBtn = document.getElementById('closeBtn');

// Open video player
function openVideoPlayer(videoIndex) {
    currentVideoIndex = videoIndex;
    const video = videos[videoIndex];
    
    // Update title
    modalTitle.textContent = video.title;
    
    // Create video element
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.src = video.videoPath;
    
    // Clear previous content and add video
    modalContent.innerHTML = '';
    modalContent.appendChild(videoElement);
    
    // Show modal
    modalOverlay.classList.add('active');
    
    // Reset state
    isFullscreen = false;
    isMinimized = false;
    modalPlayer.classList.remove('fullscreen', 'minimized');
}

// Close video player
function closeVideoPlayer() {
    modalOverlay.classList.remove('active');
    
    // Stop and remove video
    const video = modalContent.querySelector('video');
    if (video) {
        video.pause();
        video.src = '';
    }
    modalContent.innerHTML = '';
    
    currentVideoIndex = null;
    isFullscreen = false;
    isMinimized = false;
    modalPlayer.classList.remove('fullscreen', 'minimized');
}

// Toggle fullscreen
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        isMinimized = false;
        modalPlayer.classList.add('fullscreen');
        modalPlayer.classList.remove('minimized');
        expandBtn.textContent = '❐'; // Restore/normal icon
    } else {
        modalPlayer.classList.remove('fullscreen');
        expandBtn.textContent = '⛶'; // Expand icon
    }
}

// Toggle minimize
function toggleMinimize() {
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        isFullscreen = false;
        modalPlayer.classList.add('minimized');
        modalPlayer.classList.remove('fullscreen');
    } else {
        modalPlayer.classList.remove('minimized');
    }
}

// Event listeners for modal controls
minimizeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize();
});

expandBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleFullscreen();
});

closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeVideoPlayer();
});

// Close modal when clicking overlay (but not the player itself)
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeVideoPlayer();
    }
});

// Touch event handlers for mobile
minimizeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMinimize();
});

expandBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFullscreen();
});

closeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeVideoPlayer();
});

// Handle escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeVideoPlayer();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeMediaGrid();
});
