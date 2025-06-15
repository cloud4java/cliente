// YouTube Player API will call this function when ready.
function onYouTubeIframeAPIReady() {
  console.log("YouTube API Ready");
  // Initialize the first video
  loadVideo(videoPlaylist[currentVideoIndex], false); // Don't autoplay the first video
}

// Video IDs for the playlist (Updated with actual YouTube video IDs)
const videoPlaylist = [
  'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
  'QH2-TGUlwu4', // Never Gonna Give You Up (Pianoforte)
  'uKxyLmbOc0Q', // Windows XP Startup Sound
  'Vhh_GeBPOhs'  // Windows XP Shutdown Sound
  // Add more video IDs as needed
];

let currentPlayer; // This will hold the YT.Player object
let currentVideoIndex = 0;

// Function to load and play a video
// `autoplay` is a boolean to control if the video plays immediately
function loadVideo(videoId, autoplay = true) {
  console.log(`Attempting to load video: ${videoId}`);
  const placeholder = document.getElementById('youtube-video-placeholder');

  if (!videoId) {
    console.error("Invalid videoId provided to loadVideo.");
    placeholder.textContent = "Error: Invalid Video ID.";
    return;
  }

  // Update placeholder text
  placeholder.textContent = `Loading video: ${videoId}...`;
  placeholder.style.color = '#ccc'; // Lighter color for loading message

  if (currentPlayer && typeof currentPlayer.loadVideoById === 'function') {
    // If a player exists, load the new video
    currentPlayer.loadVideoById({ videoId: videoId });
    if (autoplay) {
      // YT.Player.playVideo() should be called after the video is cued or loaded.
      // This is often handled in onPlayerStateChange or onPlayerReady.
      // For now, direct call for simplicity if player is already there.
      // currentPlayer.playVideo(); // This might be too soon.
    }
    console.log(`Video ${videoId} loaded into existing player.`);
  } else {
    // If no player exists, create a new one
    // This will be called by onYouTubeIframeAPIReady for the first video
    // or if the player was somehow destroyed.
    try {
      currentPlayer = new YT.Player('youtube-video-placeholder', {
        height: '675', // Should match placeholder CSS
        width: '380',  // Should match placeholder CSS
        videoId: videoId,
        playerVars: {
          'playsinline': 1, // Plays inline on mobile
          'autoplay': autoplay ? 1 : 0,
          'controls': 0, // Hide YouTube's default controls
          'modestbranding': 1,
          'rel': 0 // Do not show related videos
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
      console.log(`New player created for video ${videoId}. Autoplay: ${autoplay}`);
    } catch (error) {
      console.error("Error creating YouTube player:", error);
      placeholder.textContent = "Error creating player. Check console.";
    }
  }
}

// Called when the player is ready
function onPlayerReady(event) {
  console.log("Player ready. Video ID:", event.target.getVideoData().video_id);
  // If autoplay was intended for the first video loaded via new YT.Player,
  // and it was set to 0 in playerVars to avoid race conditions, call playVideo here.
  // For example, if playerVars.autoplay was 0 for the initial load in loadVideo.
  // event.target.playVideo(); // Autoplay if needed and configured
  const placeholder = document.getElementById('youtube-video-placeholder');
  // Clear the "Loading..." text or style it as a background
  placeholder.textContent = ''; // Clear placeholder text once player is ready
}

// Called when the player's state changes
function onPlayerStateChange(event) {
  console.log("Player state changed:", event.data);
  // event.data states:
  // -1 (unstarted)
  //  0 (ended)
  //  1 (playing)
  //  2 (paused)
  //  3 (buffering)
  //  5 (video cued)
  if (event.data === YT.PlayerState.ENDED) {
    console.log("Video ended, playing next.");
    playNextVideo();
  }
  if (event.data === YT.PlayerState.PLAYING) {
    const placeholder = document.getElementById('youtube-video-placeholder');
    // Ensure placeholder content is cleared when video actually starts playing
    if (placeholder.textContent !== "") {
        placeholder.textContent = '';
    }
  }
}

// Called if an error occurs in the player
function onPlayerError(event) {
  console.error("YouTube Player Error:", event.data);
  const placeholder = document.getElementById('youtube-video-placeholder');
  placeholder.textContent = `Player Error: ${event.data}. Check console.`;
  // Potentially try to load next video or show a more user-friendly error
}

// Control button event listeners
document.getElementById('play-button').addEventListener('click', () => {
  console.log('Play button clicked');
  if (currentPlayer && typeof currentPlayer.playVideo === 'function') {
    currentPlayer.playVideo();
  } else {
    console.log("Player not available or playVideo not a function.");
    // Attempt to load/reload the current video if player isn't there
    loadVideo(videoPlaylist[currentVideoIndex], true);
  }
});

document.getElementById('pause-button').addEventListener('click', () => {
  console.log('Pause button clicked');
  if (currentPlayer && typeof currentPlayer.pauseVideo === 'function') {
    currentPlayer.pauseVideo();
  } else {
    console.log("Player not available or pauseVideo not a function.");
  }
});

document.getElementById('next-button').addEventListener('click', playNextVideo);

document.getElementById('prev-button').addEventListener('click', playPreviousVideo);

function playNextVideo() {
  console.log('Next button clicked / video ended');
  currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
  console.log(`New index: ${currentVideoIndex}`);
  loadVideo(videoPlaylist[currentVideoIndex], true); // Autoplay next video
}

function playPreviousVideo() {
  console.log('Previous button clicked');
  currentVideoIndex = (currentVideoIndex - 1 + videoPlaylist.length) % videoPlaylist.length;
  console.log(`New index: ${currentVideoIndex}`);
  loadVideo(videoPlaylist[currentVideoIndex], true); // Autoplay previous video
}

// Note: The YouTube Iframe API script is already included in index.html
// which will trigger `onYouTubeIframeAPIReady` when it's loaded.
// The first video load is initiated from there.
console.log("script.js loaded. Waiting for YouTube API to be ready...");
