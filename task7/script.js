// Constants
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const TIMEOUT_DURATION = 10000; // 10 seconds

// DOM Elements
const userContainer = document.getElementById('user-container');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const reloadBtn = document.getElementById('reload-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.loader');

// State management
let isLoading = false;

/**
 * Creates a timeout promise for fetch requests
 * @param {number} ms - Timeout duration in milliseconds
 * @returns {Promise} - Promise that rejects after specified time
 */
function createTimeout(ms) {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms)
    );
}

/**
 * Fetches user data from the API with timeout handling
 * @returns {Promise<Array>} - Promise resolving to user data array
 */
async function fetchUserData() {
    try {
        const fetchPromise = fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Race between fetch and timeout
        const response = await Promise.race([
            fetchPromise,
            createTimeout(TIMEOUT_DURATION)
        ]);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format received from API');
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Please check your internet connection');
        }
        throw error;
    }
}

/**
 * Gets the initials from a full name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

/**
 * Formats a phone number for better readability
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
function formatPhone(phone) {
    // Remove extensions and clean up the phone number
    return phone.split(' ')[0].replace(/[^\d-().]/g, '');
}

/**
 * Creates HTML for a single user card
 * @param {Object} user - User data object
 * @returns {string} - HTML string for user card
 */
function createUserCard(user) {
    const initials = getInitials(user.name);
    const formattedPhone = formatPhone(user.phone);
    
    return `
        <div class="user-card fade-in">
            <div class="user-header">
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <div class="username">@${user.username}</div>
                </div>
            </div>
            
            <div class="user-details">
                <div class="detail-group">
                    <span class="detail-label">Email</span>
                    <div class="detail-value">
                        <a href="mailto:${user.email}">${user.email}</a>
                    </div>
                </div>
                
                <div class="detail-group">
                    <span class="detail-label">Phone</span>
                    <div class="detail-value">
                        <a href="tel:${formattedPhone}">${formattedPhone}</a>
                    </div>
                </div>
                
                <div class="detail-group">
                    <span class="detail-label">Website</span>
                    <div class="detail-value">
                        <a href="https://${user.website}" target="_blank">${user.website}</a>
                    </div>
                </div>
                
                <div class="detail-group">
                    <span class="detail-label">Address</span>
                    <div class="address-details">
                        <div class="address-line">${user.address.street} ${user.address.suite}</div>
                        <div class="address-line">${user.address.city}, ${user.address.zipcode}</div>
                        <div class="address-line">Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}</div>
                    </div>
                </div>
                
                <div class="detail-group">
                    <span class="detail-label">Company</span>
                    <div class="company-info">
                        <div class="detail-group">
                            <span class="detail-label">Name</span>
                            <div class="detail-value">${user.company.name}</div>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Catchphrase</span>
                            <div class="detail-value">"${user.company.catchPhrase}"</div>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Business</span>
                            <div class="detail-value">${user.company.bs}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Displays users data in the container
 * @param {Array} users - Array of user objects
 */
function displayUsers(users) {
    const userCards = users.map(createUserCard).join('');
    userContainer.innerHTML = userCards;
    
    // Add staggered animation effect
    const cards = document.querySelectorAll('.user-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Shows error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    console.error('User Data Fetcher Error:', message);
}

/**
 * Hides error message
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * Sets loading state
 * @param {boolean} loading - Whether to show loading state
 */
function setLoadingState(loading) {
    isLoading = loading;
    
    if (loading) {
        loadingElement.style.display = 'block';
        userContainer.innerHTML = '';
        reloadBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        hideError();
    } else {
        loadingElement.style.display = 'none';
        reloadBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

/**
 * Main function to load and display user data
 */
async function loadUserData() {
    if (isLoading) return;
    
    setLoadingState(true);
    
    try {
        console.log('Fetching user data from API...');
        const users = await fetchUserData();
        console.log(`Successfully fetched ${users.length} users`);
        
        displayUsers(users);
        console.log('User data displayed successfully');
        
    } catch (error) {
        console.error('Failed to load user data:', error);
        let errorMsg = 'Failed to load user data. ';
        
        if (error.message.includes('Network error')) {
            errorMsg += 'Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
            errorMsg += 'The request took too long. Please try again.';
        } else if (error.message.includes('HTTP Error')) {
            errorMsg += `Server error: ${error.message}`;
        } else {
            errorMsg += error.message || 'An unexpected error occurred.';
        }
        
        showError(errorMsg);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Initializes the application
 */
function initializeApp() {
    console.log('User Data Fetcher initialized');
    
    // Add event listener to reload button
    reloadBtn.addEventListener('click', loadUserData);
    
    // Add keyboard support for reload button
    reloadBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadUserData();
        }
    });
    
    // Load user data on initial page load
    loadUserData();
    
    // Add connection status monitoring
    window.addEventListener('online', () => {
        console.log('Connection restored');
        if (errorMessage.style.display === 'block') {
            loadUserData();
        }
    });
    
    window.addEventListener('offline', () => {
        console.log('Connection lost');
        showError('You are offline. Please check your internet connection.');
    });
}

// Error handling for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}