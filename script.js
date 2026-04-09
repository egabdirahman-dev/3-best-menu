/**
 * Restaurant Website - Dynamic Menu from Google Sheets with Category Tabs
 * 
 * To use this with your own Google Sheet:
 * 1. Create a Google Sheet with columns: Name, Price, Description, Image, Category
 * 2. Go to File > Share > Publish to web
 * 3. Select the sheet and publish as CSV
 * 4. Copy the published URL and replace SHEET_URL below
 */

// ============================================
// CONFIGURATION - Update this with your sheet
// ============================================
const CONFIG = {
    // Google Sheets CSV Export URL
    // Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={SHEET_GID}
    sheetUrl: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv',
    
    // WhatsApp Number for Orders (include country code, no + or spaces)
    // Example: "15551234567" for +1 (555) 123-4567
    whatsappNumber: '15551234567',
    
    // Fallback: Use sample data if no sheet configured
    useSampleData: true
};

// ============================================
// SAMPLE DATA - For demonstration
// ============================================
const SAMPLE_MENU_DATA = [
    // Breakfast
    {
        name: "Classic Pancakes",
        price: "$8.99",
        description: "Fluffy pancakes served with maple syrup and butter.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
        category: "Breakfast"
    },
    {
        name: "Eggs Benedict",
        price: "$12.99",
        description: "Poached eggs on English muffins with hollandaise sauce.",
        image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop",
        category: "Breakfast"
    },
    // Chicken
    {
        name: "Grilled Chicken",
        price: "$14.99",
        description: "Marinated chicken breast grilled to perfection with herbs.",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop",
        category: "Chicken"
    },
    {
        name: "Crispy Chicken Wings",
        price: "$10.99",
        description: "Golden fried wings with your choice of sauce.",
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
        category: "Chicken"
    },
    // Meat
    {
        name: "Beef Steak",
        price: "$24.99",
        description: "Premium cut beef steak cooked to your preference.",
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop",
        category: "Meat"
    },
    {
        name: "Lamb Chops",
        price: "$26.99",
        description: "Tender lamb chops with rosemary and garlic.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
        category: "Meat"
    },
    // Pizza
    {
        name: "Margherita Pizza",
        price: "$14.99",
        description: "Classic tomato sauce, fresh mozzarella, and basil.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
        category: "Pizza"
    },
    {
        name: "Pepperoni Pizza",
        price: "$16.99",
        description: "Tomato sauce, mozzarella, and spicy pepperoni.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
        category: "Pizza"
    },
    // Pasta
    {
        name: "Pasta Carbonara",
        price: "$15.99",
        description: "Creamy pasta with pancetta, egg, and parmesan.",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
        category: "Pasta"
    },
    {
        name: "Seafood Pasta",
        price: "$18.99",
        description: "Fresh pasta with shrimp, mussels, and calamari.",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
        category: "Pasta"
    },
    // Seafood
    {
        name: "Grilled Salmon",
        price: "$22.99",
        description: "Fresh Atlantic salmon with lemon butter sauce.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
        category: "Seafood"
    },
    {
        name: "Fish & Chips",
        price: "$16.99",
        description: "Crispy battered fish with golden fries.",
        image: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=400&h=300&fit=crop",
        category: "Seafood"
    },
    // Salads
    {
        name: "Caesar Salad",
        price: "$10.99",
        description: "Crisp romaine, parmesan, croutons, Caesar dressing.",
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop",
        category: "Salads"
    },
    {
        name: "Greek Salad",
        price: "$11.99",
        description: "Fresh vegetables, feta cheese, olives, and oregano.",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
        category: "Salads"
    },
    // Hot Drinks
    {
        name: "Cappuccino",
        price: "$4.99",
        description: "Espresso with steamed milk and foam.",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        category: "Hot Drinks"
    },
    {
        name: "Hot Chocolate",
        price: "$5.49",
        description: "Rich creamy chocolate topped with whipped cream.",
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop",
        category: "Hot Drinks"
    },
    // Cold Drinks
    {
        name: "Fresh Orange Juice",
        price: "$4.99",
        description: "100% freshly squeezed oranges.",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop",
        category: "Cold Drinks"
    },
    {
        name: "Iced Latte",
        price: "$5.49",
        description: "Espresso with cold milk and ice.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        category: "Cold Drinks"
    },
    // Desserts
    {
        name: "Chocolate Cake",
        price: "$7.99",
        description: "Rich chocolate layer cake with ganache.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        category: "Desserts"
    },
    {
        name: "Cheesecake",
        price: "$6.99",
        description: "Creamy New York style cheesecake.",
        image: "https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=400&h=300&fit=crop",
        category: "Desserts"
    }
];

// ============================================
// STATE
// ============================================
let allMenuItems = [];
let currentCategory = 'all';

// ============================================
// MOBILE NAVIGATION
// ============================================
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// ============================================
// WHATSAPP BUTTON
// ============================================
function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn && CONFIG.whatsappNumber) {
        const message = encodeURIComponent("Hello! I'd like to place an order.");
        whatsappBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
    }
}

// ============================================
// CATEGORY TABS
// ============================================
function getUniqueCategories(items) {
    const categories = items.map(item => item.category || 'Uncategorized');
    return ['all', ...new Set(categories)];
}

function createCategoryTabs(categories) {
    const tabsContainer = document.getElementById('category-tabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${category === 'all' ? 'active' : ''}`;
        btn.dataset.category = category;
        btn.textContent = category === 'all' ? 'All' : category;
        
        btn.addEventListener('click', () => {
            // Update active state
            tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter and render
            currentCategory = category;
            renderFilteredItems();
        });
        
        tabsContainer.appendChild(btn);
    });
}

// ============================================
// CSV PARSER
// ============================================
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        // Handle quoted values with commas
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim().replace(/^"|"$/g, ''));
        
        const row = {};
        headers.forEach((header, index) => {
            const key = header.toLowerCase();
            if (key.includes('name')) row.name = values[index];
            else if (key.includes('price')) row.price = values[index];
            else if (key.includes('desc')) row.description = values[index];
            else if (key.includes('image') || key.includes('url') || key.includes('photo')) row.image = values[index];
            else if (key.includes('category') || key.includes('type')) row.category = values[index];
            else row[header] = values[index];
        });
        
        // Default category if not provided
        if (!row.category) row.category = 'Other';
        
        data.push(row);
    }
    return data;
}

// ============================================
// MENU RENDERING
// ============================================
function createMenuCard(item, index) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Handle image
    let imageHtml;
    if (item.image && item.image.trim() !== '') {
        imageHtml = `<img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.parentElement.classList.add('placeholder'); this.parentElement.innerHTML='No Image'">`;
    } else {
        imageHtml = '';
    }
    
    card.innerHTML = `
        <div class="menu-card-image ${!item.image ? 'placeholder' : ''}">
            ${imageHtml || 'No Image'}
        </div>
        <div class="menu-card-content">
            <div class="menu-card-header">
                <h3 class="menu-card-title">${item.name || 'Unnamed Item'}</h3>
                <span class="menu-card-price">${item.price || ''}</span>
            </div>
            <p class="menu-card-description">${item.description || ''}</p>
            <span class="menu-card-category">${item.category || 'Other'}</span>
        </div>
    `;
    
    return card;
}

function renderFilteredItems() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;
    
    // Filter items
    const filteredItems = currentCategory === 'all' 
        ? allMenuItems 
        : allMenuItems.filter(item => item.category === currentCategory);
    
    // Clear grid
    menuGrid.innerHTML = '';
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = `
            <div class="error-message">
                <p>No items found in this category.</p>
            </div>
        `;
        return;
    }
    
    // Render items
    filteredItems.forEach((item, index) => {
        const card = createMenuCard(item, index);
        menuGrid.appendChild(card);
    });
}

function renderMenu(data) {
    allMenuItems = data;
    
    // Create category tabs
    const categories = getUniqueCategories(data);
    createCategoryTabs(categories);
    
    // Render items
    renderFilteredItems();
}

function showError(message) {
    const menuGrid = document.getElementById('menu-grid');
    if (menuGrid) {
        menuGrid.innerHTML = `
            <div class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <p>${message}</p>
                <p style="font-size: 0.85rem; margin-top: 10px;">Showing sample menu instead.</p>
            </div>
        `;
    }
}

// ============================================
// DATA FETCHING
// ============================================
async function fetchMenuFromGoogleSheets() {
    // If using sample data, return it immediately
    if (CONFIG.useSampleData && CONFIG.sheetUrl.includes('YOUR_SHEET_ID')) {
        console.log('Using sample data. To use your own sheet, update CONFIG.sheetUrl in script.js');
        return SAMPLE_MENU_DATA;
    }
    
    try {
        const response = await fetch(CONFIG.sheetUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch menu data');
        }
        
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        return data;
    } catch (error) {
        console.error('Error fetching menu:', error);
        showError('Unable to load menu from Google Sheets.');
        return SAMPLE_MENU_DATA;
    }
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    // Initialize mobile navigation
    initNavigation();
    
    // Initialize WhatsApp button
    initWhatsAppButton();
    
    // Fetch and render menu
    const menuData = await fetchMenuFromGoogleSheets();
    renderMenu(menuData);
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
