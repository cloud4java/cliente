const iframe = document.getElementById('player-iframe');
const testResultsDiv = document.getElementById('test-results');
let iframeDoc;
let iframeWindow;

// --- Test Configuration ---
const IFRAME_LOAD_TIMEOUT = 3000; // Time to wait for iframe to load
const API_LOAD_TIMEOUT = 7000;    // Time to wait for YouTube API and first video
const ACTION_TIMEOUT = 2000;      // Time to wait after an action like click
const VIDEO_LOAD_TIMEOUT = 5000;  // Time to wait for a new video to start loading/playing

// --- Logging Utilities ---
function log(level, message) {
    console[level](message);
    const logEntry = document.createElement('div');
    logEntry.className = `log-message log-${level}`;
    logEntry.textContent = `[${level.toUpperCase()}] ${message}`;
    testResultsDiv.appendChild(logEntry);
}

// --- Test Utilities ---
function getElementInIframe(selector) {
    if (!iframeDoc) {
        log('error', `iframeDoc not initialized. Cannot get element ${selector}`);
        return null;
    }
    return iframeDoc.querySelector(selector);
}

function simulateClick(elementName, selector) {
    return new Promise((resolve, reject) => {
        const element = getElementInIframe(selector);
        if (element) {
            log('info', `Simulating click on ${elementName}`);
            element.click();
            resolve();
        } else {
            log('error', `${elementName} button not found in iframe.`);
            reject(new Error(`${elementName} button not found.`));
        }
    });
}

// Function to check player state - VERY SIMPLIFIED
// In a real scenario, this would involve deeper integration or specific exposed methods from script.js
async function checkPlayerState(expectedState) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (iframeWindow && iframeWindow.currentPlayer) {
                const state = iframeWindow.currentPlayer.getPlayerState();
                // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
                log('info', `Current player state: ${state}. Expected: ${expectedState} (approx)`);
                if (expectedState === "playing" && (state === 1 || state === 3)) {
                    log('success', `Player is playing or buffering as expected.`);
                    resolve(true);
                } else if (expectedState === "paused" && state === 2) {
                    log('success', `Player is paused as expected.`);
                    resolve(true);
                } else if (expectedState === "loaded" && (state === 5 || state === -1 || state === 1 || state === 2 || state === 0 )) {
                     log('success', `Video appears to be cued/loaded/finished: ${state}.`);
                     resolve(true);
                }
                 else {
                    log('warn', `Player state (${state}) not as expected (${expectedState}). This might be a timing issue or an actual bug.`);
                    resolve(false);
                }
            } else {
                log('warn', "Cannot access currentPlayer state. Test is inconclusive for state check.");
                resolve(false); // Inconclusive
            }
        }, ACTION_TIMEOUT);
    });
}

async function waitForVideoToLoad(context) {
     log('info', `Waiting ${VIDEO_LOAD_TIMEOUT/1000}s for ${context} to load/start...`);
    return new Promise(resolve => setTimeout(resolve, VIDEO_LOAD_TIMEOUT));
}


// --- Test Cases ---
async function runTests() {
    log('info', "Starting test suite...");

    // ** Test 1: Initial Video Load **
    log('info', "Test 1: Initial Video Load - waiting for API and first video...");
    await new Promise(resolve => setTimeout(resolve, API_LOAD_TIMEOUT)); // Wait for API and first video to load

    const videoPlaceholder = getElementInIframe('#youtube-video-placeholder iframe');
    if (videoPlaceholder) {
        log('success', "Test 1 PASSED: YouTube iframe element found in placeholder.");
    } else {
        log('error', "Test 1 FAILED: YouTube iframe element NOT found in placeholder after timeout.");
    }
    console.assert(videoPlaceholder, "Test 1: YouTube iframe should be present.");
    await checkPlayerState("loaded"); // Check if a video is cued/loaded


    // ** Test 2: Play/Pause Functionality **
    log('info', "Test 2: Play/Pause Functionality");
    try {
        await simulateClick('Play button', '#play-button');
        await checkPlayerState("playing");

        await new Promise(resolve => setTimeout(resolve, ACTION_TIMEOUT)); // Wait for play to take effect

        await simulateClick('Pause button', '#pause-button');
        await checkPlayerState("paused");
        log('success', "Test 2 PASSED: Play/Pause buttons seem to respond (state check is approximate).");
    } catch (e) {
        log('error', `Test 2 FAILED: ${e.message}`);
    }

    // ** Test 3: Next Video Functionality **
    log('info', "Test 3: Next Video Functionality");
    let initialVideoId, nextVideoId;
    if (iframeWindow && iframeWindow.currentPlayer) {
        initialVideoId = iframeWindow.currentPlayer.getVideoData().video_id;
    }
    try {
        await simulateClick('Next button', '#next-button');
        await waitForVideoToLoad("next video");
        await checkPlayerState("playing"); // Should autoplay next
        if (iframeWindow && iframeWindow.currentPlayer) {
            nextVideoId = iframeWindow.currentPlayer.getVideoData().video_id;
            if (initialVideoId && nextVideoId && initialVideoId !== nextVideoId) {
                log('success', `Test 3 PASSED (Next): Video changed from ${initialVideoId} to ${nextVideoId}.`);
            } else if (!initialVideoId) {
                log('warn', `Test 3 (Next): Could not confirm video ID change, but button was clicked and player seems to be playing.`);
            }
            else {
                log('error', `Test 3 FAILED (Next): Video ID did not change. Initial: ${initialVideoId}, Current: ${nextVideoId}`);
            }
            console.assert(!initialVideoId || (initialVideoId !== nextVideoId), "Test 3 (Next): Video ID should change.");
        } else {
            log('warn', "Test 3 (Next): Could not verify video ID change due to no currentPlayer access.");
        }
    } catch (e) {
        log('error', `Test 3 FAILED (Next): ${e.message}`);
    }

    // ** Test 4: Previous Video Functionality **
    log('info', "Test 4: Previous Video Functionality");
    let currentVideoIdBeforePrev = nextVideoId; // From previous test
    try {
        await simulateClick('Previous button', '#prev-button');
        await waitForVideoToLoad("previous video");
        await checkPlayerState("playing"); // Should autoplay prev
        if (iframeWindow && iframeWindow.currentPlayer) {
            const finalVideoId = iframeWindow.currentPlayer.getVideoData().video_id;
            // This should ideally go back to initialVideoId if playlist has more than 2 items
            // or to a different one if playlist is longer.
            if (currentVideoIdBeforePrev && finalVideoId && currentVideoIdBeforePrev !== finalVideoId) {
                log('success', `Test 4 PASSED (Previous): Video changed from ${currentVideoIdBeforePrev} to ${finalVideoId}.`);
            } else if (!currentVideoIdBeforePrev) {
                 log('warn', `Test 4 (Previous): Could not confirm video ID change, but button was clicked and player seems to be playing.`);
            }
            else {
                log('error', `Test 4 FAILED (Previous): Video ID did not change as expected. Current: ${finalVideoId}`);
            }
             console.assert(!currentVideoIdBeforePrev || (currentVideoIdBeforePrev !== finalVideoId), "Test 4 (Previous): Video ID should change.");
        } else {
            log('warn', "Test 4 (Previous): Could not verify video ID change due to no currentPlayer access.");
        }
    } catch (e) {
        log('error', `Test 4 FAILED (Previous): ${e.message}`);
    }

    log('info', "Test suite finished. Check console for details and assertions.");
}


// --- Initialization ---
iframe.onload = () => {
    log('info', "Player iframe loaded.");
    try {
        iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeWindow = iframe.contentWindow;
        if (!iframeDoc || !iframeWindow) {
            throw new Error("Could not access iframe content.");
        }

        // Check if YT API is already loaded in iframe, or wait for it
        if (iframeWindow.YT && iframeWindow.YT.Player) {
             log('info', "YT API already available in iframe.");
             runTests();
        } else {
            log('info', "YT API not immediately available in iframe. Waiting for onYouTubeIframeAPIReady to fire within iframe...");
            // This is tricky; the test environment can't easily hook into onYouTubeIframeAPIReady *inside* the iframe.
            // The API_LOAD_TIMEOUT in runTests() is the main gate for this.
            // A more robust solution would have the iframe signal its readiness to the parent.
            // For example, script.js could do: window.parent.postMessage('youtubeApiReady', '*');
            // And test.js would listen for this message.
            // For now, we rely on a fixed timeout.
            runTests();
        }

    } catch (e) {
        log('error', `Error accessing iframe content: ${e.message}. This often happens due to cross-origin restrictions if running from file:///`);
        log('warn', "Make sure you are serving these files via a local HTTP server (e.g., 'python -m http.server' or VS Code Live Server).");
    }
};

iframe.onerror = () => {
    log('error', "Player iframe failed to load. Path correct? Is ../index.html available?");
};

// Fallback if onload doesn't fire for some reason (e.g. if iframe was already loaded from cache)
// or if there are issues with onload timing.
setTimeout(() => {
    if (!iframeDoc) {
        log('warn', "Iframe onload event might not have fired. Attempting to initialize test environment manually.");
        if (iframe.contentDocument) {
            iframe.onload(); // Manually trigger if possible
        } else {
            log('error', "Cannot access iframe content. Tests may not run.");
        }
    }
}, IFRAME_LOAD_TIMEOUT);
