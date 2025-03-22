// User authentication data
const users = [
    { username: "shishir", password: "shirhir1234" },
    { username: "tamim", password: "tamim@2025" },
    { username: "zim", password: "zim@2025" },
    { username: "ahad", password: "ahad@2025" },
    { username: "test", password: "test@6969" }
];

// Authentication state
let currentUser = null;

// DOM Elements for authentication
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginErrorMessage = document.getElementById('login-error-message');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const mainContent = document.getElementById('main-content');
const usernameDisplay = document.getElementById('username-display');
const userAvatar = document.getElementById('user-avatar');
const logoutButton = document.getElementById('logout-button');

// Check if user is already logged in
function checkAuth() {
    const savedUser = localStorage.getItem('twu_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showMainContent();
        } catch (e) {
            // Invalid stored data, clear it
            localStorage.removeItem('twu_user');
            showLoginForm();
        }
    } else {
        showLoginForm();
    }
}

// Show login form
function showLoginForm() {
    loginOverlay.style.display = 'flex';
    mainContent.style.display = 'none';
    loginError.style.display = 'none';
    usernameInput.value = '';
    passwordInput.value = '';
}

// Show main content
function showMainContent() {
    loginOverlay.style.display = 'none';
    mainContent.style.display = 'block';
    
    // Update user display
    usernameDisplay.textContent = currentUser.username;
    userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
}

// Handle login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Login successful
        currentUser = { username: user.username };
        localStorage.setItem('twu_user', JSON.stringify(currentUser));
        showMainContent();
        showToast('Login Successful', `Welcome back, ${currentUser.username}!`);
    } else {
        // Login failed
        loginError.style.display = 'block';
        loginErrorMessage.textContent = 'Invalid username or password';
        passwordInput.value = '';
    }
});

// Handle logout
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('twu_user');
    currentUser = null;
    showLoginForm();
});

// Check authentication on page load
document.addEventListener('DOMContentLoaded', checkAuth);

// Signal Generator Code
const availableAssets = [
    "USD/MXN OTC", "USD/EGP OTC", "USD/ARS OTC", "USD/PHP OTC", "AUD/USD OTC",
    "USD/ZAR OTC", "EUR/SGD OTC", "EUR/AUD OTC", "EUR/CAD OTC", "EUR/CHF OTC",
    "EUR/GBP OTC", "EUR/USD OTC", "GBP/JPY OTC", "USD/IDR OTC", "NZD/CAD OTC", 
    "NZD/CHF OTC", "NZD/JPY OTC", "USD/BDT OTC", "USD/BRL OTC", "USD/CHF OTC",
    "USD/COP OTC", "USD/DZD OTC", "USD/INR OTC", "USD/JPY OTC", "USD/NGN OTC",
    "USD/PKR OTC", "USD/SGD OTC", "USD/TRY OTC", "USD/ZAR OTC",
    "Bitcoin OTC", "Gold OTC", "Silver OTC", "USCrude OTC", "UKBrent OTC",  
    "MSFT OTC", "INTC OTC", "FB OTC", "MCD OTC", "BA OTC",
    "EUR/GBP", "EUR/USD", "EUR/JPY", "EUR/AUD", "USD/JPY", "USD/CAD", "USD/CHF",
    "CAD/JPY", "GBP/JPY", "GBP/USD", "GBP/AUD"
];

let signals = [];
let existingSignals = new Set();

// DOM Elements
const assetSelect = document.getElementById('asset-select');
const signalCountInput = document.getElementById('signal-count');
const filterSelect = document.getElementById('filter-select');
const backtestFilter = document.getElementById('backtest-filter');
const generateButton = document.getElementById('generate-signals');
const resetButton = document.getElementById('reset-signals');
const copyButton = document.getElementById('copy-signals');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const animationMessage = document.getElementById('animation-message');
const signalList = document.getElementById('signal-list');
const emptyState = document.getElementById('empty-state');
const signalCountDisplay = document.getElementById('signal-count-display');
const toast = document.getElementById('toast');
const toastTitle = document.querySelector('.toast-title');
const toastMessage = document.querySelector('.toast-message');
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const currentYearElement = document.getElementById('current-year');

// Initialize
function init() {
    populateAssetDropdown();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    currentYearElement.textContent = new Date().getFullYear();
    
    // Event listeners
    generateButton.addEventListener('click', handleGenerateSignals);
    resetButton.addEventListener('click', handleResetSignals);
    copyButton.addEventListener('click', handleCopySignals);
    filterSelect.addEventListener('change', displaySignals);
}

function populateAssetDropdown() {
    availableAssets.forEach(asset => {
        const option = document.createElement('option');
        option.value = asset;
        option.textContent = asset;
        assetSelect.appendChild(option);
    });
}

function updateDateTime() {
    const now = new Date();
    currentDateElement.textContent = now.toLocaleDateString();
    currentTimeElement.textContent = now.toLocaleTimeString('en-GB');
}

function formatTime(date) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function generateSignal(asset, time) {
    const direction = Math.random() < 0.5 ? 'CALL' : 'PUT';
    return { 
        asset, 
        time, 
        direction,
        id: Date.now() + Math.random().toString(36).substring(2, 9)
    };
}

function generateUniqueTimes(count) {
    const times = [];
    let nextTime = new Date();
    for (let i = 0; i < count; i++) {
        nextTime = new Date(nextTime.getTime() + 3 * 60000); // Add 3 minutes
        times.push(formatTime(nextTime));
    }
    return times;
}

function formatSignalsForCopy(signals) {
    return signals.map(signal => `${signal.asset} ; ${signal.time} ; ${signal.direction}`).join('\n');
}

function showToast(title, message, duration = 3000) {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
}

function handleCopySignals() {
    const filteredSignals = getFilteredSignals();
    
    if (filteredSignals.length === 0) {
        showToast('No Signals', 'Generate signals first before copying.');
        return;
    }
    
    const formattedSignals = formatSignalsForCopy(filteredSignals);
    navigator.clipboard.writeText(formattedSignals)
        .then(() => {
            showToast('Signals Copied', `${filteredSignals.length} signals copied to clipboard.`);
        })
        .catch((error) => {
            console.error('Failed to copy signals:', error);
            showToast('Copy Failed', 'Could not copy signals to clipboard.');
        });
}

function handleGenerateSignals() {
    const selectedAsset = assetSelect.value;
    const signalCount = parseInt(signalCountInput.value) || 1;
    
    if (!selectedAsset) {
        errorText.textContent = 'Please select an asset before generating signals!';
        errorMessage.style.display = 'flex';
        return;
    }

    errorMessage.style.display = 'none';
    const uniqueTimes = generateUniqueTimes(signalCount);
    const newSignals = [];

    uniqueTimes.forEach((time) => {
        const signalKey = `${selectedAsset} ; ${time}`;
        if (!existingSignals.has(signalKey)) {
            const newSignal = generateSignal(selectedAsset, time);
            newSignals.push(newSignal);
            existingSignals.add(signalKey);
        }
    });

    signals.push(...newSignals);
    displaySignals();
    showAnimation();
    showToast('Signals Generated', `${newSignals.length} new trading signals have been created.`);
}

function getFilteredSignals() {
    const filterType = filterSelect.value;
    return signals.filter(signal => {
        if (filterType === "CALL" && signal.direction !== "CALL") return false;
        if (filterType === "PUT" && signal.direction !== "PUT") return false;
        return true;
    });
}

function displaySignals() {
    const filteredSignals = getFilteredSignals();
    signalList.innerHTML = '';
    signalCountDisplay.textContent = filteredSignals.length;
    
    if (filteredSignals.length > 0) {
        emptyState.style.display = 'none';
        signalList.style.display = 'block';
        
        filteredSignals.forEach(signal => {
            const listItem = document.createElement('li');
            listItem.className = 'signal-item';
            
            const signalInfo = document.createElement('div');
            const assetElement = document.createElement('p');
            assetElement.className = 'signal-asset';
            assetElement.textContent = signal.asset;
            
            const timeElement = document.createElement('div');
            timeElement.className = 'signal-time';
            timeElement.innerHTML = `<i class="fas fa-clock"></i> <span>${signal.time}</span>`;
            
            signalInfo.appendChild(assetElement);
            signalInfo.appendChild(timeElement);
            
            const badgeElement = document.createElement('span');
            badgeElement.className = `badge ${signal.direction === 'CALL' ? 'badge-call' : 'badge-put'}`;
            
            const icon = document.createElement('i');
            icon.className = signal.direction === 'CALL' 
                ? 'fas fa-arrow-up' 
                : 'fas fa-arrow-down';
            
            badgeElement.appendChild(icon);
            badgeElement.appendChild(document.createTextNode(` ${signal.direction}`));
            
            listItem.appendChild(signalInfo);
            listItem.appendChild(badgeElement);
            signalList.appendChild(listItem);
        });
    } else {
        emptyState.style.display = 'block';
        signalList.style.display = 'none';
    }
}

function showAnimation() {
    animationMessage.style.display = 'block';
    animationMessage.classList.add('pulse');
    
    setTimeout(() => {
        animationMessage.style.display = 'none';
        animationMessage.classList.remove('pulse');
    }, 2000);
}

function handleResetSignals() {
    signals = [];
    existingSignals = new Set();
    displaySignals();
    showToast('Signals Reset', 'All signals have been cleared.');
}

// Initialize the app
init();