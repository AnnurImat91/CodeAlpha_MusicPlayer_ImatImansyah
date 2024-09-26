// ... (Previous JavaScript code remains the same) ...

// Add this at the end of your script
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside of it
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

const playlist = [
    { title: "The Show", artist: "Lenka", cover: "../assets/imageCover/lenka_cover.jpg", src: "../assets/music/Lenka - The Show.mp3" },
    { title: "Fuck You", artist: "Lily Allen", cover: "../assets/imageCover/lily_cover.jpg", src: "../assets/music/Lily Allen - Fuck You.mp3" },
    { title: "You Belong With Me", artist: "Taylor Swift", cover: "../assets/imageCover/taylor swift_you belong with me_cover.jpg", src: "../assets/music/Taylor Swift - You Belong With Me.mp3" },
    { title: "Holiday", artist: "Green Day", cover: "../assets/imageCover/greenday-holiday_cover.jpg", src: "../assets/music/Green Day - Holiday.mp3" },
    { title: "Stop When the Red Lights Flash", artist: "Green Day", cover: "../assets/imageCover/mostwanted2_cover.jpg", src: "../assets/music/Stop When the Red Lights Flash.mp3" },
    { title: "Welcome To The Black Parade", artist: "My Chemical Romance", cover: "../assets/imageCover/mcr-wtmbp.jpg", src: "../assets/music/My Chemical Romance - Welcome To The Black Parade.mp3" },
    { title: "Heathens", artist: "twenty one pilots", cover: "../assets/imageCover/top-heathens.jpg", src: "../assets/music/twenty one pilots - Heathen.mp3" },
    { title: "Californication", artist: "Red Hot Chili Peppers", cover: "../assets/imageCover/hrcp-callifornication.jpg", src: "../assets/music/Red Hot Chili Peppers - Californication.mp3" },
];

let currentSongIndex = 0;
const audio = new Audio();
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;

const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentCover = document.getElementById('currentCover');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const playlistElement = document.getElementById('playlist');
const nowPlayingElement = document.getElementById('nowPlaying');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function loadSong(index) {
    const song = playlist[index];
    audio.src = song.src;
    currentCover.src = song.cover;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    updateNowPlaying();
}

function updateNowPlaying() {
    const song = playlist[currentSongIndex];
    nowPlayingElement.innerHTML = `
        <img src="${song.cover}" alt="Cover">
        <div class="now-playing-info">
            <div class="now-playing-title">${song.title}</div>
            <div class="now-playing-artist">${song.artist}</div>
        </div>
    `;
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

function nextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.innerHTML = audio.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#1db954' : '#b3b3b3';
});

repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatBtn.style.color = isRepeating ? '#1db954' : '#b3b3b3';
});

// Placeholder functions for additional buttons
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// Populate playlist
playlist.forEach((song, index) => {
    const li = document.createElement('li');
    li.className = 'song-item';
    li.innerHTML = `
        <img src="${song.cover}" alt="Cover">
        <div>
            <strong>${song.title}</strong><br>
            ${song.artist}
        </div>
    `;
    li.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        isPlaying = true;
        audio.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    });
    playlistElement.appendChild(li);
});

loadSong(currentSongIndex);