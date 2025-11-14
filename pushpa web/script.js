document.addEventListener('DOMContentLoaded', () => {
    // Search functionality
    const searchButton = document.getElementById('searchButton');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestions = Array.from(document.querySelectorAll('.suggestion'));
    let selectedSuggestion = -1;
    
    // Toggle search box visibility
    if (searchButton && searchBox) {
        // Show search box
        searchButton.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBox.classList.toggle('visible');
            searchSuggestions.classList.toggle('hidden', false);
            
            if (searchBox.classList.contains('visible')) {
                searchInput.focus();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchBox.classList.remove('visible');
            }
        });
        
        // Handle search input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                filterSuggestions(query);
            });
            
            searchInput.addEventListener('keydown', (e) => {
                // Handle arrow keys for navigation
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const direction = e.key === 'ArrowDown' ? 1 : -1;
                    navigateSuggestions(direction);
                } 
                // Handle Enter key
                else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedSuggestion >= 0) {
                        const selectedText = suggestions[selectedSuggestion].textContent;
                        searchInput.value = selectedText;
                        performSearch(selectedText);
                    } else {
                        performSearch(searchInput.value);
                    }
                    searchBox.classList.remove('visible');
                } 
                // Handle Escape key
                else if (e.key === 'Escape') {
                    searchBox.classList.remove('visible');
                }
            });
        }
        
        // Handle suggestion clicks
        suggestions.forEach((suggestion, index) => {
            suggestion.addEventListener('click', () => {
                searchInput.value = suggestion.textContent;
                performSearch(suggestion.textContent);
                searchBox.classList.remove('visible');
            });
            
            suggestion.addEventListener('mouseover', () => {
                selectedSuggestion = index;
                updateSelectedSuggestion();
            });
        });
    }
    
    // Filter suggestions based on input
    function filterSuggestions(query) {
        let hasMatches = false;
        suggestions.forEach(suggestion => {
            const text = suggestion.textContent.toLowerCase();
            const isVisible = text.includes(query);
            suggestion.style.display = isVisible ? 'block' : 'none';
            if (isVisible) hasMatches = true;
        });
        searchSuggestions.classList.toggle('hidden', !hasMatches || !query);
        selectedSuggestion = -1;
        updateSelectedSuggestion();
    }
    
    // Navigate suggestions with keyboard
    function navigateSuggestions(direction) {
        const visibleSuggestions = suggestions.filter(s => 
            window.getComputedStyle(s).display !== 'none'
        );
        
        if (visibleSuggestions.length === 0) return;
        
        selectedSuggestion += direction;
        
        if (selectedSuggestion < 0) {
            selectedSuggestion = visibleSuggestions.length - 1;
        } else if (selectedSuggestion >= visibleSuggestions.length) {
            selectedSuggestion = 0;
        }
        
        updateSelectedSuggestion();
        
        // Scroll into view if needed
        const selectedElement = visibleSuggestions[selectedSuggestion];
        selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
    
    // Update selected suggestion styling
    function updateSelectedSuggestion() {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('selected', index === selectedSuggestion);
        });
    }
    
    // Function to perform search
    function performSearch(query) {
        if (query.trim() !== '') {
            // Here you can implement your search logic
            console.log('Searching for:', query);
            // For now, we'll just show an alert
            alert('Search for: ' + query);
            
            // In a real implementation, you would redirect to a search results page or filter products
            // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }

    // Sort functionality
    const sortButton = document.getElementById('sortButton');
    let currentSort = 'default';

    // Sort products function
    function sortProducts(sortType) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        const products = Array.from(productsGrid.querySelectorAll('.product-card'));
        
        // Remove all products from grid
        productsGrid.innerHTML = '';
        
        // Sort products based on sort type
        switch(sortType) {
            case 'name-asc':
                products.sort((a, b) => {
                    const nameA = a.querySelector('h3').textContent.trim();
                    const nameB = b.querySelector('h3').textContent.trim();
                    return nameA.localeCompare(nameB);
                });
                break;
                
            case 'name-desc':
                products.sort((a, b) => {
                    const nameA = a.querySelector('h3').textContent.trim();
                    const nameB = b.querySelector('h3').textContent.trim();
                    return nameB.localeCompare(nameA);
                });
                break;
                
            case 'price-asc':
                products.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
                    return priceA - priceB;
                });
                break;
                
            case 'price-desc':
                products.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
                    return priceB - priceA;
                });
                break;
                
            default:
                // Default sort (original order)
                break;
        }
        
        // Add sorted products back to grid
        products.forEach(product => {
            productsGrid.appendChild(product);
        });
    }

    // Toggle sort order when sort button is clicked
    if (sortButton) {
        sortButton.addEventListener('click', () => {
            const sortOptions = ['default', 'name-asc', 'name-desc', 'price-asc', 'price-desc'];
            const currentIndex = sortOptions.indexOf(currentSort);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            currentSort = sortOptions[nextIndex];
            
            // Update button icon based on sort type
            const icon = sortButton.querySelector('i');
            switch(currentSort) {
                case 'name-asc':
                    icon.className = 'fas fa-sort-alpha-down';
                    break;
                case 'name-desc':
                    icon.className = 'fas fa-sort-alpha-down-alt';
                    break;
                case 'price-asc':
                    icon.className = 'fas fa-sort-amount-down';
                    break;
                case 'price-desc':
                    icon.className = 'fas fa-sort-amount-down-alt';
                    break;
                default:
                    icon.className = 'fas fa-sort-amount-down';
            }
            
            // Toggle active class
            sortButton.classList.toggle('active', currentSort !== 'default');
            
            // Apply sort
            sortProducts(currentSort);
        });
    }

    // Load products when products page is opened
    if (window.location.pathname.endsWith('products.html')) {
        const productsGrid = document.querySelector('.products-grid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        let allProductsLoaded = false;
        
        // Sample product data
        const allProducts = [
            {
                name: 'Madhubani Paintings',
                description: 'Traditional folk art from Bihar',
                price: '$64.99',
                imageClass: 'product-1'
            },
            {
                name: 'Dhokra Art',
                description: 'Ancient metal casting craft',
                price: '$74.99',
                imageClass: 'product-2'
            },
            {
                name: 'Pattachitra',
                description: 'Cloth-based scroll painting',
                price: '$54.99',
                imageClass: 'product-3'
            },
            {
                name: 'Blue Pottery',
                description: 'Turquoise blue ceramic art',
                price: '$44.99',
                imageClass: 'product-1'
            },
            {
                name: 'Bamboo Craft',
                description: 'Eco-friendly bamboo products',
                price: '$34.99',
                imageClass: 'product-2'
            },
            {
                name: 'Warli Art',
                description: 'Traditional tribal paintings',
                price: '$49.99',
                imageClass: 'product-3'
            }
        ];

        // Function to create a product card
        function createProductCard(product) {
            const productCard = document.createElement('a');
            productCard.href = 'product-details.html';
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image ${product.imageClass}"></div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">${product.price}</span>
                </div>
            `;
            return productCard;
        }

        // Function to load more products
        function loadMoreProducts() {
            if (allProductsLoaded) return;
            
            // Add loading state
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Add all remaining products
                allProducts.forEach(product => {
                    productsGrid.appendChild(createProductCard(product));
                });
                
                // Update button state
                allProductsLoaded = true;
                loadMoreBtn.textContent = 'All Products Loaded';
                loadMoreBtn.style.opacity = '0.7';
                loadMoreBtn.style.cursor = 'default';
                
                // Remove button after a delay
                setTimeout(() => {
                    loadMoreBtn.style.display = 'none';
                }, 3000);
                
            }, 800); // Simulated network delay
        }

        // Add click event to load more button
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreProducts);
        }
    }
    // New elements for splash screen logic
    const splashScreen = document.getElementById('splashScreen');
    const mainScreen = document.getElementById('mainScreen');

    // --- 1. Splash Screen Logic (Auto-hide after 3 seconds) ---
    if (splashScreen && mainScreen) {
        // 1a. Ensure main screen is initially hidden (using the CSS class)
        mainScreen.classList.add('hidden');
        
        // 1b. Set a timer to hide the splash screen and show the main screen
        setTimeout(() => {
            splashScreen.classList.add('hidden'); // Start fade out animation
            
            // After the fade out animation completes
            setTimeout(() => {
                splashScreen.style.display = 'none'; // Remove from document flow
                mainScreen.classList.remove('hidden'); // Show main content
                
                // Trigger reflow to ensure CSS transitions work
                void mainScreen.offsetWidth;
                
                // Add visible class to trigger fade-in animation
                mainScreen.classList.add('visible');
            }, 800); // Match this with the CSS transition duration (0.8s)
        }, 3000); // 3000 milliseconds = 3 seconds
    }

    // --- 2. List View Toggle Functionality (Unchanged) ---
    const openListButton = document.getElementById('openListButton');
    const closeListButton = document.getElementById('closeListButton');
    const listView = document.getElementById('listView');
    
    // Initialize list view to be hidden
    if (listView) {
        listView.style.display = 'none';
    }

    if (openListButton && listView) {
        openListButton.addEventListener('click', () => {
            listView.style.display = 'block'; 
        });
    }

    if (closeListButton && listView) {
        closeListButton.addEventListener('click', () => {
            listView.style.display = 'none';
        });
    }

    // --- 3. Navigation Highlighting Functionality (Unchanged) ---
    const navItems = document.querySelectorAll('#navbar .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Only prevent default for navigation items that don't have a valid href or have '#' as href
            if (!item.getAttribute('href') || item.getAttribute('href') === '#') {
                event.preventDefault();
            }

            // Update active state for navigation items
            if (item.getAttribute('href') === '#' || !item.getAttribute('href')) {
                navItems.forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');
            }
        });
    });
});