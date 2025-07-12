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
    
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

// Play previous track
function playPrevious() {
    if (currentTrackIndex > 0) {
        loadTrack(currentTrackIndex - 1);
    } else {
        // Loop to last track in folder
        loadTrack(currentFolderFiles.length - 1);
    }
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Play next track
function playNext() {
    if (currentTrackIndex < currentFolderFiles.length - 1) {
        loadTrack(currentTrackIndex + 1);
    } else {
        // Loop to first track in folder
        loadTrack(0);
    }
    if (isPlaying) {
        audioPlayer.play();
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
