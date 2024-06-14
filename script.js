let startTime; // Stores the time when the stopwatch starts
let elapsedTime = 0; // Stores the elapsed time in milliseconds
let timerInterval; // Stores the interval ID of the timer
let laps = []; // Array to store lap times

// Function to start or pause the stopwatch
function startStop() {
    if (!timerInterval) {
        // Start the stopwatch
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10); // Update time every 10 milliseconds
        document.getElementById('startStop').textContent = 'Pause';
        document.getElementById('startStop').classList.remove('start');
        document.getElementById('startStop').classList.add('pause');
    } else {
        // Pause the stopwatch
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('startStop').textContent = 'Resume';
        document.getElementById('startStop').classList.remove('pause');
        document.getElementById('startStop').classList.add('start');
    }
}

// Function to reset the stopwatch and laps
function resetLap() {
    clearInterval(timerInterval); // Stop the timer interval
    timerInterval = null;
    elapsedTime = 0; // Reset elapsed time
    laps = []; // Clear laps array
    document.getElementById('display').textContent = '00:00:00.000'; // Reset display
    document.getElementById('startStop').textContent = 'Start';
    document.getElementById('startStop').classList.remove('pause');
    document.getElementById('startStop').classList.add('start');
    document.getElementById('laps').innerHTML = ''; // Clear lap list in the HTML
    localStorage.removeItem('stopwatchState'); // Remove saved stopwatch state from localStorage
}

// Function to clear all laps
function clearLaps() {
    laps = []; // Clear laps array
    document.getElementById('laps').innerHTML = ''; // Clear lap list in the HTML
    saveState(); // Save the updated state
}

// Function to record a lap
function lap() {
    if (timerInterval) {
        let lapTime = formatTime(elapsedTime); // Format the current elapsed time
        let lapItem = document.createElement('li'); // Create a new <li> element for the lap
        // Calculate lap difference compared to the previous lap
        let lapDifference = laps.length > 0 ? formatTime(elapsedTime - laps[laps.length - 1].time) : lapTime;
        lapItem.innerHTML = `<span>${laps.length + 1} - ${lapTime}</span><span>${lapDifference}</span>`; // HTML content for the lap item
        document.getElementById('laps').appendChild(lapItem); // Append the lap item to the lap list
        laps.push({ time: elapsedTime, display: lapTime }); // Add lap data to the laps array
        saveState(); // Save the updated state
    }
}

// Function to update the elapsed time display
function updateTime() {
    elapsedTime = Date.now() - startTime; // Calculate elapsed time
    document.getElementById('display').textContent = formatTime(elapsedTime); // Update display with formatted time
}

// Function to format time in hours, minutes, seconds, and milliseconds
function formatTime(milliseconds) {
    let hours = Math.floor(milliseconds / 3600000); // Calculate hours
    milliseconds %= 3600000;
    let minutes = Math.floor(milliseconds / 60000); // Calculate minutes
    milliseconds %= 60000;
    let seconds = Math.floor(milliseconds / 1000); // Calculate seconds
    milliseconds %= 1000; // Calculate remaining milliseconds

    // Return formatted time string
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`;
}

// Function to pad numbers with leading zeros
function pad(number, length) {
    let str = String(number);
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

// Function to save current stopwatch state to localStorage
function saveState() {
    const state = {
        elapsedTime,
        laps
    };
    localStorage.setItem('stopwatchState', JSON.stringify(state));
}

// Function to load previously saved stopwatch state from localStorage
function loadState() {
    const state = JSON.parse(localStorage.getItem('stopwatchState'));
    if (state) {
        elapsedTime = state.elapsedTime; // Restore elapsed time
        laps = state.laps; // Restore laps array
        document.getElementById('display').textContent = formatTime(elapsedTime); // Update display with formatted time
        laps.forEach((lap, index) => {
            let lapItem = document.createElement('li'); // Create <li> for each lap
            // Calculate lap difference compared to the previous lap
            let lapDifference = index > 0 ? formatTime(lap.time - laps[index - 1].time) : lap.display;
            lapItem.innerHTML = `<span>${index + 1} - ${lap.display}</span><span>${lapDifference}</span>`; // HTML content for the lap item
            document.getElementById('laps').appendChild(lapItem); // Append lap item to the lap list
        });
    }
}

// Function to handle keyboard shortcuts
function handleKeyDown(event) {
    switch (event.key) {
        case 's':
            startStop();
            break;
        case 'l':
            lap();
            break;
        case 'r':
            resetLap();
            break;
        case 'c':
            clearLaps();
            break;
    }
}

// Event listeners for buttons and window load
document.getElementById('startStop').addEventListener('click', startStop);
document.getElementById('lapReset').addEventListener('click', resetLap);
document.getElementById('clearLaps').addEventListener('click', clearLaps);
document.getElementById('lap').addEventListener('click', lap);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('load', loadState);
