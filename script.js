// Global variables
let currentFolderHandle = null;
let audioFiles = [];
let currentTrackIndex = 0;
let isPlaying = false;
let repeatMode = 'none'; // 'none', 'one', 'count', 'infinite'
let repeatCount = 1;
let currentRepeatCount = 0;
let isShuffled = false;
let originalPlaylist = [];
let currentPlaylist = [];
let currentFolderFiles = []; // Files in current folder only

// DOM elements
const audioPlayer = document.getElementById('audioPlayer');
const selectFolderBtn = document.getElementById('selectFolderBtn');
const folderTree = document.getElementById('folderTree');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const seekBackBtn = document.getElementById('seekBackBtn');
const seekForwardBtn = document.getElementById('seekForwardBtn');
const repeatBtn = document.getElementById('repeatBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const currentTrackElement = document.getElementById('currentTrack');
const currentTimeElement = document.getElementById('currentTime');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelp = document.getElementById('closeHelp');
const repeatModal = document.getElementById('repeatModal');
const setRepeatCount = document.getElementById('setRepeatCount');
const cancelRepeat = document.getElementById('cancelRepeat');
const repeatCountInput = document.getElementById('repeatCount');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupKeyboardShortcuts();
});

// Setup event listeners
function setupEventListeners() {
    // Folder selection
    selectFolderBtn.addEventListener('click', selectFolder);
    
    // Player controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    seekBackBtn.addEventListener('click', () => skipTime(-2));
    seekForwardBtn.addEventListener('click', () => skipTime(2));
    repeatBtn.addEventListener('click', toggleRepeat);
    shuffleBtn.addEventListener('click', toggleShuffle);
    
    // Audio events
    audioPlayer.addEventListener('loadedmetadata', updateTrackInfo);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    
    // Progress bar
    progressBar.addEventListener('click', seekToPosition);
    
    // Volume control
    volumeSlider.addEventListener('input', updateVolume);
    
    // Speed controls
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => setPlaybackSpeed(parseFloat(btn.dataset.speed)));
    });
    
    // Time skip controls
    document.querySelectorAll('.time-skip-btn').forEach(btn => {
        btn.addEventListener('click', () => skipTime(parseFloat(btn.dataset.skip)));
    });
    
    // Help modal
    helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
    closeHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.classList.add('hidden');
    });
    
    // Repeat modal
    setRepeatCount.addEventListener('click', () => {
        const selectedMode = document.querySelector('input[name="repeatMode"]:checked').value;
        if (selectedMode === 'infinite') {
            repeatMode = 'infinite';
        } else if (selectedMode === 'count') {
            repeatMode = 'count';
            repeatCount = parseInt(repeatCountInput.value) || 1;
        } else {
            repeatMode = 'none';
        }
        currentRepeatCount = 0;
        updateRepeatButton();
        repeatModal.classList.add('hidden');
    });
    
    cancelRepeat.addEventListener('click', () => {
        repeatModal.classList.add('hidden');
    });
    
    repeatModal.addEventListener('click', (e) => {
        if (e.target === repeatModal) repeatModal.classList.add('hidden');
    });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Prevent default if input is focused
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (e.shiftKey) {
                    playPrevious();
                } else {
                    skipTime(-2);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (e.shiftKey) {
                    playNext();
                } else {
                    skipTime(2);
                }
                break;
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                toggleRepeat();
                break;
            case 's':
            case 'S':
                e.preventDefault();
                toggleShuffle();
                break;
            case '+':
            case '=':
                e.preventDefault();
                adjustVolume(5);
                break;
            case '-':
                e.preventDefault();
                adjustVolume(-5);
                break;
            case '1':
                e.preventDefault();
                skipTime(-1);
                break;
            case '3':
                e.preventDefault();
                skipTime(-3);
                break;
            case '5':
                e.preventDefault();
                skipTime(-5);
                break;
            case '0':
                e.preventDefault();
                skipTime(10);
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                helpModal.classList.remove('hidden');
                break;
        }
    });
}

// Select folder using File System Access API
async function selectFolder() {
    try {
        if ('showDirectoryPicker' in window) {
            const dirHandle = await window.showDirectoryPicker();
            currentFolderHandle = dirHandle;
            await loadFolder(dirHandle);
        } else {
            alert('Trình duyệt của bạn chưa hỗ trợ File System Access API. Vui lòng sử dụng Chrome hoặc Edge phiên bản mới.');
        }
    } catch (error) {
        console.error('Error selecting folder:', error);
        if (error.name !== 'AbortError') {
            alert('Có lỗi xảy ra khi chọn thư mục.');
        }
    }
}

// Load folder contents
async function loadFolder(dirHandle) {
    try {
        audioFiles = [];
        await scanDirectory(dirHandle, '');
        
        if (audioFiles.length === 0) {
            folderTree.innerHTML = '<div class="text-gray-500 text-center py-8"><i class="fas fa-exclamation-triangle text-4xl mb-4"></i><p>Không tìm thấy file âm thanh</p></div>';
            return;
        }
        
        // Sort files by name using natural sort
        audioFiles.sort((a, b) => naturalSort(a.name, b.name));
        
        // Update playlists
        originalPlaylist = [...audioFiles];
        currentPlaylist = [...audioFiles];
        
        // Render folder tree
        renderFolderTree();
        
        // Auto play first file
        if (audioFiles.length > 0) {
            // Initialize current folder files with first file's folder
            const firstFile = audioFiles[0];
            currentFolderFiles = [firstFile];
            updateCurrentFolderFiles(firstFile);
            loadTrack(0);
        }
    } catch (error) {
        console.error('Error loading folder:', error);
        alert('Có lỗi xảy ra khi tải thư mục.');
    }
}

// Scan directory recursively
async function scanDirectory(dirHandle, path) {
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
            const file = await entry.getFile();
            if (isAudioFile(file.name)) {
                audioFiles.push({
                    name: file.name,
                    path: path ? `${path}/${file.name}` : file.name,
                    file: file,
                    handle: entry
                });
            }
        } else if (entry.kind === 'directory') {
            await scanDirectory(entry, path ? `${path}/${entry.name}` : entry.name);
        }
    }
}

// Check if file is audio
function isAudioFile(filename) {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma'];
    return audioExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

// Render folder tree
function renderFolderTree() {
    const tree = buildTree(audioFiles);
    folderTree.innerHTML = renderTree(tree);
    
    // Add click listeners to audio files
    document.querySelectorAll('.audio-file').forEach(element => {
        element.addEventListener('click', () => {
            const index = parseInt(element.dataset.index);
            const selectedFile = audioFiles[index];
            
            // Add selection animation
            animateFileSelection(element);
            
            // Update current folder files and load track
            updateCurrentFolderFiles(selectedFile);
            const folderIndex = currentFolderFiles.findIndex(file => file.path === selectedFile.path);
            loadTrack(folderIndex);
        });
    });
}

// Build tree structure
function buildTree(files) {
    const tree = {};
    
    files.forEach((file, index) => {
        const parts = file.path.split('/');
        let current = tree;
        
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        }
        
        const filename = parts[parts.length - 1];
        current[filename] = { isFile: true, index: index };
    });
    
    return tree;
}

// Render tree HTML
function renderTree(tree, level = 0) {
    let html = '';
    
    Object.entries(tree).forEach(([name, node]) => {
        if (node.isFile) {
            html += `
                <div class="audio-file tree-item pl-${level * 4} py-1 px-2 text-sm hover:bg-blue-50 rounded cursor-pointer" data-index="${node.index}">
                    <i class="fas fa-music text-blue-500 mr-2"></i>
                    ${name}
                </div>
            `;
        } else {
            html += `
                <div class="tree-item pl-${level * 4} py-1">
                    <div class="flex items-center cursor-pointer" onclick="toggleFolder(this)">
                        <i class="fas fa-chevron-right folder-icon text-gray-400 mr-2"></i>
                        <i class="fas fa-folder text-yellow-500 mr-2"></i>
                        <span class="text-sm font-medium">${name}</span>
                    </div>
                    <div class="folder-contents hidden">
                        ${renderTree(node, level + 1)}
                    </div>
                </div>
            `;
        }
    });
    
    return html;
}

// Toggle folder expand/collapse
function toggleFolder(element) {
    const icon = element.querySelector('.folder-icon');
    const contents = element.parentElement.querySelector('.folder-contents');
    
    if (contents.classList.contains('hidden')) {
        contents.classList.remove('hidden');
        icon.classList.add('expanded');
    } else {
        contents.classList.add('hidden');
        icon.classList.remove('expanded');
    }
}

// Load track
function loadTrack(index) {
    if (index < 0 || index >= currentFolderFiles.length) return;
    
    currentTrackIndex = index;
    const track = currentFolderFiles[index];
    
    // Update UI
    currentTrackElement.textContent = track.name;
    document.querySelectorAll('.audio-file').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-index="${originalPlaylist.indexOf(track)}"]`)?.classList.add('active');
    
    // Load audio
    const url = URL.createObjectURL(track.file);
    audioPlayer.src = url;
    audioPlayer.load();
    
    // Update current folder files based on selected track's folder
    updateCurrentFolderFiles(track);
}

// Update current folder files based on selected track
function updateCurrentFolderFiles(selectedTrack) {
    const folderPath = selectedTrack.path.substring(0, selectedTrack.path.lastIndexOf('/'));
    
    // Filter files from the same folder
    currentFolderFiles = audioFiles.filter(file => {
        const fileFolderPath = file.path.substring(0, file.path.lastIndexOf('/'));
        return fileFolderPath === folderPath;
    });
    
    // Sort files in current folder using natural sort
    currentFolderFiles.sort((a, b) => naturalSort(a.name, b.name));
    
    // Update current index in folder files
    currentTrackIndex = currentFolderFiles.findIndex(file => file.path === selectedTrack.path);
}

// Play/Pause toggle
function togglePlayPause() {
    if (audioFiles.length === 0) return;
    
    const playerContainer = document.querySelector('.player-container');
    
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Remove playing effects
        playPauseBtn.classList.remove('playing');
        document.querySelector('.album-art').classList.remove('playing');
        document.querySelector('.progress-bar').classList.remove('playing');
        playerContainer.classList.remove('playing');
        
    } else {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Add playing effects
        playPauseBtn.classList.add('playing');
        document.querySelector('.album-art').classList.add('playing');
        document.querySelector('.progress-bar').classList.add('playing');
        playerContainer.classList.add('playing');
        
        // Add particles to album art
        addMusicParticles();
    }
}

// Play previous track
function playPrevious() {
    const wasPlaying = isPlaying;
    
    if (currentTrackIndex > 0) {
        loadTrack(currentTrackIndex - 1);
    } else {
        // Loop to last track in folder
        loadTrack(currentFolderFiles.length - 1);
    }
    
    if (wasPlaying) {
        audioPlayer.play();
        // Maintain playing effects
        setTimeout(() => {
            if (isPlaying) {
                playPauseBtn.classList.add('playing');
                document.querySelector('.album-art').classList.add('playing');
                document.querySelector('.progress-bar').classList.add('playing');
                document.querySelector('.player-container').classList.add('playing');
                addMusicParticles();
            }
        }, 100);
    }
}

// Play next track
function playNext() {
    const wasPlaying = isPlaying;
    
    if (currentTrackIndex < currentFolderFiles.length - 1) {
        loadTrack(currentTrackIndex + 1);
    } else {
        // Loop to first track in folder
        loadTrack(0);
    }
    
    if (wasPlaying) {
        audioPlayer.play();
        // Maintain playing effects
        setTimeout(() => {
            if (isPlaying) {
                playPauseBtn.classList.add('playing');
                document.querySelector('.album-art').classList.add('playing');
                document.querySelector('.progress-bar').classList.add('playing');
                document.querySelector('.player-container').classList.add('playing');
                addMusicParticles();
            }
        }, 100);
    }
}

// Handle track end
function handleTrackEnd() {
    if (repeatMode === 'one' || repeatMode === 'infinite') {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else if (repeatMode === 'count') {
        currentRepeatCount++;
        if (currentRepeatCount < repeatCount) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            currentRepeatCount = 0;
            playNext();
        }
    } else {
        playNext();
    }
}

// Toggle repeat mode
function toggleRepeat() {
    if (repeatMode === 'none') {
        repeatMode = 'one';
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    } else if (repeatMode === 'one') {
        repeatModal.classList.remove('hidden');
        // Set current mode in modal
        document.querySelector('input[name="repeatMode"][value="count"]').checked = true;
        repeatCountInput.focus();
    } else {
        repeatMode = 'none';
        repeatBtn.classList.remove('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    }
}

// Update repeat button
function updateRepeatButton() {
    if (repeatMode === 'none') {
        repeatBtn.classList.remove('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    } else if (repeatMode === 'one') {
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    } else if (repeatMode === 'count') {
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = `<i class="fas fa-redo"></i> ${repeatCount}`;
    } else if (repeatMode === 'infinite') {
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i> ∞';
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    
    if (isShuffled) {
        shuffleBtn.classList.add('active');
        // Shuffle playlist
        const currentTrack = currentPlaylist[currentTrackIndex];
        currentPlaylist = [...originalPlaylist].sort(() => Math.random() - 0.5);
        currentTrackIndex = currentPlaylist.indexOf(currentTrack);
    } else {
        shuffleBtn.classList.remove('active');
        // Restore original order
        const currentTrack = currentPlaylist[currentTrackIndex];
        currentPlaylist = [...originalPlaylist];
        currentTrackIndex = currentPlaylist.indexOf(currentTrack);
    }
}

// Set playback speed
function setPlaybackSpeed(speed) {
    audioPlayer.playbackRate = speed;
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-speed="${speed}"]`).classList.add('active');
}

// Skip time
function skipTime(seconds) {
    if (audioPlayer.src) {
        audioPlayer.currentTime = Math.max(0, Math.min(audioPlayer.duration, audioPlayer.currentTime + seconds));
    }
}

// Update track info
function updateTrackInfo() {
    const duration = formatTime(audioPlayer.duration);
    currentTimeElement.textContent = `00:00 / ${duration}`;
}

// Update progress
function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.setProperty('--progress', `${progress}%`);
        
        const current = formatTime(audioPlayer.currentTime);
        const duration = formatTime(audioPlayer.duration);
        currentTimeElement.textContent = `${current} / ${duration}`;
        
        // Add visual feedback to progress
        if (isPlaying && progress > 0) {
            progressBar.classList.add('playing');
        }
    }
}

// Seek to position
function seekToPosition(e) {
    if (audioPlayer.duration) {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;
        audioPlayer.currentTime = percentage * audioPlayer.duration;
    }
}

// Update volume
function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
    volumeSlider.style.setProperty('--volume', `${volumeSlider.value}%`);
    
    // Add visual feedback
    volumeSlider.classList.add('active');
    setTimeout(() => {
        volumeSlider.classList.remove('active');
    }, 500);
}

// Adjust volume
function adjustVolume(delta) {
    const newVolume = Math.max(0, Math.min(100, parseInt(volumeSlider.value) + delta));
    volumeSlider.value = newVolume;
    updateVolume();
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Natural sort function for proper file ordering
function naturalSort(a, b) {
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
    });
    return collator.compare(a, b);
}

// Initialize volume
updateVolume();

// ===== EFFECTS FUNCTIONS =====

// Add music particles to album art
function addMusicParticles() {
    const albumArt = document.querySelector('.album-art');
    
    // Remove existing particles
    albumArt.querySelectorAll('.particle').forEach(p => p.remove());
    
    // Add new particles
    for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        albumArt.appendChild(particle);
    }
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.player-control, .time-skip-btn, .speed-btn');
    
    buttons.forEach(button => {
        button.classList.add('ripple');
        
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Enhanced track loading with animations
function loadTrackWithEffects(index) {
    // Add loading state
    const albumArt = document.querySelector('.album-art');
    albumArt.classList.add('loading-audio');
    
    // Original load track logic here
    loadTrack(index);
    
    // Remove loading state after a delay
    setTimeout(() => {
        albumArt.classList.remove('loading-audio');
    }, 1000);
}

// Enhance button interactions
function enhanceButtonInteractions() {
    // Time skip buttons
    document.querySelectorAll('.time-skip-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(1.15)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Speed buttons
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all speed buttons
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Volume slider
    volumeSlider.addEventListener('input', function() {
        this.classList.add('active');
        clearTimeout(this.volumeTimeout);
        this.volumeTimeout = setTimeout(() => {
            this.classList.remove('active');
        }, 500);
    });
}

// Enhanced file selection animation
function animateFileSelection(element) {
    // Remove active class from all audio files
    document.querySelectorAll('.audio-file').forEach(file => {
        file.classList.remove('active');
    });
    
    // Add active class to selected file
    element.classList.add('active');
    
    // Scroll to selected file if needed
    element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Background pulse effect based on audio
function addAudioVisualization() {
    if (!audioPlayer.src) return;
    
    const albumArt = document.querySelector('.album-art');
    const playerContainer = document.querySelector('.player-container');
    
    // Simple visualization based on current time
    const updateVisualization = () => {
        if (isPlaying && audioPlayer.currentTime) {
            const intensity = Math.sin(audioPlayer.currentTime * 2) * 0.1 + 0.9;
            albumArt.style.transform = `scale(${intensity})`;
            
            // Update background opacity based on audio
            const opacity = Math.sin(audioPlayer.currentTime) * 0.1 + 0.9;
            playerContainer.style.setProperty('--audio-intensity', opacity);
        }
    };
    
    // Update visualization every frame when playing
    if (isPlaying) {
        requestAnimationFrame(updateVisualization);
    }
}

// Initialize all effects
function initializeEffects() {
    addRippleEffect();
    enhanceButtonInteractions();
    
    // Add audio visualization update to the timeupdate event
    audioPlayer.addEventListener('timeupdate', addAudioVisualization);
    
    // Add effect when track loads
    audioPlayer.addEventListener('loadstart', () => {
        document.querySelector('.album-art').classList.add('loading-audio');
    });
    
    audioPlayer.addEventListener('canplay', () => {
        document.querySelector('.album-art').classList.remove('loading-audio');
    });
    
    // Enhance modal animations
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.animation = 'modalFadeOut 0.3s ease forwards';
                setTimeout(() => {
                    this.classList.add('hidden');
                    this.style.animation = '';
                }, 300);
            }
        });
    });
}

// Call initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeEffects, 100);
});

// CSS for ripple effect (injected dynamically)
const rippleStyles = `
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes modalFadeOut {
    from {
        opacity: 1;
        backdrop-filter: blur(10px);
    }
    to {
        opacity: 0;
        backdrop-filter: blur(0px);
    }
}
`;

// Inject ripple styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);
