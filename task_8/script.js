// TechBlog Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSmoothScrolling();
    initLoadMorePosts();
    initScrollToTop();
    initNewsletterForm();
    initNavbarScrollEffect();
    initAnimateOnScroll();
    initThemeToggle();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load More Posts functionality
function initLoadMorePosts() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const postsContainer = document.querySelector('.row.g-4');
    let currentPage = 1;
    
    // Sample additional posts data
    const additionalPosts = [
        {
            category: 'Blockchain',
            categoryClass: 'bg-secondary',
            date: 'Dec 28, 2023',
            title: 'Decentralized Applications with Web3',
            description: 'Build modern dApps using Ethereum, Solidity, and Web3.js for the next generation of internet applications...',
            readTime: '8 min read',
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop&crop=center'
        },
        {
            category: 'Mobile Dev',
            categoryClass: 'bg-info',
            date: 'Dec 25, 2023',
            title: 'Cross-Platform Development with Flutter',
            description: 'Create beautiful, native mobile applications for both iOS and Android using Google\'s Flutter framework...',
            readTime: '9 min read',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&crop=center'
        },
        {
            category: 'Database',
            categoryClass: 'bg-dark',
            date: 'Dec 22, 2023',
            title: 'NoSQL vs SQL: Choosing the Right Database',
            description: 'Compare different database paradigms and learn when to use MongoDB, PostgreSQL, or other solutions...',
            readTime: '7 min read',
            image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop&crop=center'
        }
    ];
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<div class="loading me-2"></div>Loading...';
            this.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                loadMorePosts(additionalPosts, postsContainer);
                this.innerHTML = originalText;
                this.disabled = false;
                currentPage++;
                
                // Hide button after loading all posts
                if (currentPage > 2) {
                    this.style.display = 'none';
                }
            }, 1500);
        });
    }
}

function loadMorePosts(posts, container) {
    posts.forEach(post => {
        const postHTML = `
            <div class="col-lg-4 col-md-6 new-post" style="opacity: 0; transform: translateY(30px);">
                <div class="card h-100 border-0 shadow-sm card-hover">
                    <img src="${post.image}" class="card-img-top" alt="${post.title}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge ${post.categoryClass}">${post.category}</span>
                            <small class="text-muted">${post.date}</small>
                        </div>
                        <h5 class="card-title fw-bold">${post.title}</h5>
                        <p class="card-text text-muted flex-grow-1">${post.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>${post.readTime}
                            </small>
                            <a href="#" class="btn btn-outline-primary btn-sm">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', postHTML);
    });
    
    // Animate new posts
    setTimeout(() => {
        document.querySelectorAll('.new-post').forEach((post, index) => {
            setTimeout(() => {
                post.style.transition = 'all 0.6s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
                post.classList.remove('new-post');
            }, index * 150);
        });
    }, 100);
}

// Scroll to top button
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    // Scroll to top functionality
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Newsletter form handling
function initNewsletterForm() {
    const newsletterForm = document.querySelector('section .row form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading me-2"></div>Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.btn-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
        
        // Hide navbar when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Animate elements on scroll
function initAnimateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Theme toggle functionality (bonus feature)
function initThemeToggle() {
    // Create theme toggle button (optional enhancement)
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn-outline-light btn-sm ms-3';
    themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        const themeContainer = document.createElement('li');
        themeContainer.className = 'nav-item';
        themeContainer.appendChild(themeToggle);
        navbarNav.appendChild(themeContainer);
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme === 'dark');
    });
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('.navbar-nav button i');
    if (icon) {
        icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon';
    }
}

// Search functionality (bonus feature)
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.toLowerCase().trim();
                filterPosts(query);
            }, 300);
        });
    }
}

function filterPosts(query) {
    const posts = document.querySelectorAll('.card');
    
    posts.forEach(post => {
        const title = post.querySelector('.card-title').textContent.toLowerCase();
        const description = post.querySelector('.card-text').textContent.toLowerCase();
        const category = post.querySelector('.badge').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query) || category.includes(query)) {
            post.closest('.col-lg-4, .col-md-6, .col-lg-12').style.display = 'block';
        } else {
            post.closest('.col-lg-4, .col-md-6, .col-lg-12').style.display = 'none';
        }
    });
}

// Reading time calculator
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance monitoring
function logPerformance() {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });
}