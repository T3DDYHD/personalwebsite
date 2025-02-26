const volumeIcon = document.getElementById('volume-icon');
const iconElement = volumeIcon.querySelector('i');

let isMuted = false;
let lastVolume = 1;

volumeIcon.addEventListener('click', () => {
    if (isMuted) {
        iconElement.className = 'fas fa-volume-up';
        document.getElementById('background').muted = false;
    } else {
        iconElement.className = 'fas fa-volume-mute';
        document.getElementById('background').muted = true;
    }
    isMuted = !isMuted;
});

function updateSong(playlist) {
    if (playlist.length > 0) {
        // Vælg en tilfældig sang
        const randomIndex = Math.floor(Math.random() * playlist.length);
        const currentSong = playlist[randomIndex];

        // Sæt sangdetaljerne
        document.getElementById('song-name').textContent = currentSong.songTitle;
        document.getElementById('artist-name').textContent = currentSong.artistName;
        document.getElementById('album-image').src = currentSong.albumCover;

        // Vis sektionen 'currently playing'
        document.getElementById('currently-playing').style.display = 'flex';

        // Sæt video-kilden
        const backgroundVideo = document.getElementById('background');
        document.getElementById('background').src = currentSong.videoSource;

        // Skift til en ny tilfældig sang, når den nuværende slutter
        backgroundVideo.onended = () => {
            updateSong(playlist); // Opdater sanginfo og afspil næste tilfældige sang
        };

        // Afspil den nye video
        backgroundVideo.load(); // Load den nye video
        backgroundVideo.play().catch(error => {
            console.error('Fejl ved afspilning af video:', error);
        });
    }
}


window.addEventListener("load", function () {
    document.getElementById('profile-container').style.display = 'none';
});

// Call this function after loading the config to start the first song
async function loadConfig() {
    const response = await fetch('config.json');
    const config = await response.json();

    // Set background video, header, and profile picture
    document.getElementById('background').src = config.backgroundVideo;
    document.getElementById('profile-header').style.backgroundImage = `url('${config.headerImage}')`;
    document.getElementById('profile-pic').src = config.logo;
    document.getElementById('username').textContent = config.username;

    // Update social links
    const socialIconsContainer = document.getElementById('social-icons');
    config.socialLinks.forEach(link => {
        const iconElement = document.createElement('a');
        iconElement.href = link.url;
        iconElement.target = '_blank';
        iconElement.innerHTML = `<i class="${link.icon}" style="color: ${link.color};"></i>`;

        socialIconsContainer.appendChild(iconElement);
    });

    // Handle the song playlist
    updateSong(config.currentlyPlaying); // Start playing the first song

    // Update viewer count and other config-related data
    updateViewerCount();
    updateDiscordStatus(config.discordId);
}

async function updateViewerCount() {
    try {
        const ip = await getIP();

        // Send IP'en til serveren for at opdatere database
        await fetch('/update-viewer-count', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip }),
        });

        // Hent den opdaterede viewer count
        const response = await fetch('/get-viewer-count');
        const data = await response.json();
        animateViewerCount(0, data.viewCount);
    } catch (error) {
        console.error('Failed to update viewer count:', error);
    }
}

function animateViewerCount(oldCount, newCount) {
    const viewerCountElement = document.getElementById('viewer-count');
    let currentCount = oldCount;
    const duration = 2500; // Totaltid for animationen (ms)
    const startTime = performance.now(); // Starttidspunkt for animationen

    function updateCounter(timestamp) {
        let elapsed = timestamp - startTime;
        let progress = Math.min(elapsed / duration, 1); // Holder progress mellem 0 og 1
        currentCount = oldCount + (newCount - oldCount) * progress;

        viewerCountElement.innerHTML = `${Math.round(currentCount)} <i class='fas fa-eye'></i>`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

async function getIP() {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

// Kald updateViewerCount, når siden indlæses
document.addEventListener('DOMContentLoaded', () => {
    updateViewerCount();

    // Opdater viewer count periodisk, f.eks. hver 30. sekund
    setInterval(updateViewerCount, 30000);
});

async function updateDiscordStatus(discordId) {
    try {
        const response = await fetch(`/get-discord-profile`);
        if (!response.ok) throw new Error('Failed to fetch Discord status');

        const data = await response.json();
        const status = data.discord_status;
        const lastSeenOffline = data.lastSeenOffline;

        const statusIndicator = document.getElementById('status-indicator');
        const lastSeenElement = document.getElementById('last-seen'); // New element for "Last seen"
        statusIndicator.className = 'status-indicator';
        statusIndicator.innerHTML = ''; // Clear previous icon

        switch (status) {
            case 'online':
                statusIndicator.classList.add('status-online');
                lastSeenElement.textContent = ''; // Clear "Last seen" when online
                break;
            case 'idle':
                statusIndicator.classList.add('status-idle');
                statusIndicator.innerHTML = '<i class="fa-solid fa-moon" font-size: 20px; color: #F0B232;"></i>';
                break;
            case 'dnd':
                statusIndicator.classList.add('status-dnd');
                statusIndicator.innerHTML = '<i class="fa-solid fa-circle-minus" font-size: 20px; color: #ed4245;"></i>';
                break;
            default:
                statusIndicator.classList.add('status-offline');
                break;
        }

        if (lastSeenOffline) {
            const lastSeenDate = new Date(lastSeenOffline);
            const now = new Date();
            const diffInMinutes = Math.floor((now - lastSeenDate) / 60000);

            let timeString = '';

            if (diffInMinutes < 1) {
                timeString = 'Now';
            } else if (diffInMinutes < 60) {
                timeString = `${diffInMinutes} minut${diffInMinutes === 1 ? '' : 'ter'} siden`;
            } else {
                const diffInHours = Math.floor(diffInMinutes / 60);
                if (diffInHours < 24) {
                    timeString = `${diffInHours} time${diffInHours === 1 ? '' : 'r'} siden`;
                } else {
                    const diffInDays = Math.floor(diffInHours / 24);
                    if (diffInDays < 7) {
                        timeString = `${diffInDays} dag${diffInDays === 1 ? '' : 'e'} siden`;
                    } else {
                        const diffInWeeks = Math.floor(diffInDays / 7);
                        if (diffInWeeks < 4) {
                            timeString = `${diffInWeeks} uge${diffInWeeks === 1 ? '' : 'r'} siden`;
                        } else {
                            const diffInMonths = Math.floor(diffInDays / 30);
                            if (diffInMonths < 12) {
                                timeString = `${diffInMonths} måned${diffInMonths === 1 ? '' : 'er'} siden`;
                            } else {
                                const diffInYears = Math.floor(diffInMonths / 12);
                                timeString = `${diffInYears} år ${diffInYears === 1 ? '' : ''} siden`;
                            }
                        }
                    }
                }
            }

            lastSeenElement.textContent = `Sidst set: ${timeString}`;
        } else {
            lastSeenElement.textContent = ''; // Clear when online
        }
    } catch (error) {
        console.error('Error updating Discord status:', error);
    }
}

function startStatusUpdates(discordId) {
    const volumeContainer = document.querySelector('.volume-container');

    if (volumeContainer) {
        volumeContainer.style.display = 'flex'; // Skift til flex for at vise elementet
    }
    // Start the status updates when overlay is clicked
    const overlay = document.getElementById('overlay');
    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        document.getElementById('profile-container').style.display = 'flex';
        document.getElementById('volume-icon').style.display = 'flex';
        document.getElementById('volume-icon').style.display = 'flex';
        loadConfig();

        document.getElementById('background').muted = false;
        document.getElementById('background').play().catch(error => {
            console.error('Error playing video after click:', error);
        });

        document.getElementById('background').pause();
        document.getElementById('background').currentTime = 0;
        document.getElementById('background').play();
        document.getElementById('background').volume = 0.5;

        overlay.removeEventListener('click', arguments.callee);
    });

    // Fetch the status periodically
    setInterval(() => {
        updateDiscordStatus(discordId);
    }, 1000); // Update every 1 seconds
}

startStatusUpdates('513639579715371009'); // Pass Discord ID here

let titleText = "@T3DDYUHD";
    let currentText = "";
    let forward = true;
    let i = 0;

    function animateTitle() {
        if (forward) {
            currentText += titleText[i];
            i++;
            if (i === titleText.length) {
                forward = false;
            }
        } else {
            currentText = currentText.slice(0, -1);
            i--;
            if (i === 0) {
                forward = true;
            }
        }
        document.title = currentText;
    }

setInterval(animateTitle, 1200);  // Adjust the speed of animation (200ms here)