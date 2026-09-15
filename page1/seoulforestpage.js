const cards = document.querySelectorAll('.photo-card');
const overlay = document.getElementById('overlay');
const flipBtn = document.getElementById('flip-btn');

let scrollDepth = 0;
let activeCard = null;

// --- 1. NAVIGATION À LA ROULETTE (SCROLL) ---
window.addEventListener('wheel', (e) => {
    if (activeCard) return; // Bloqué si une photo est en grand
    e.preventDefault();
    
    scrollDepth += e.deltaY * 0.0008;

    cards.forEach((card) => {
        let baseDepth = parseFloat(card.style.getPropertyValue('--depth')) || 0.5;
        let currentDepth = (baseDepth + scrollDepth) % 1;
        if (currentDepth < 0) currentDepth += 1;

        // Calcul de l'échelle, de l'opacité et de la profondeur 3D
        let scale = 0.5 + (currentDepth * 0.7);
        let opacity = Math.pow(currentDepth, 1.5); // Celles au fond sont estompées, celles devant sont opaques
        let zIndex = Math.round(currentDepth * 100);

        card.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${card.style.getPropertyValue('--rot')})`;
        card.style.opacity = Math.max(0.15, opacity);
        card.style.zIndex = zIndex;
    });
}, { passive: false });

// Initialisation de la disposition de base
cards.forEach(card => {
    let baseDepth = parseFloat(card.style.getPropertyValue('--depth')) || 0.5;
    card.style.transform = `translate(-50%, -50%) scale(${0.5 + baseDepth * 0.7}) rotate(${card.style.getPropertyValue('--rot')})`;
    card.style.opacity = 0.2 + baseDepth * 0.8;
});


// --- 2. GLISSER-DÉPOSER (DRAG & DROP) DES PHOTOS ---
cards.forEach(card => {
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;

    card.addEventListener('mousedown', (e) => {
        if (card.classList.contains('active')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        let rect = card.getBoundingClientRect();
        // On convertit la position en pixels pour le déplacement libre
        card.style.left = rect.left + 'px';
        card.style.top = rect.top + 'px';
        card.style.transform = `rotate(${card.style.getPropertyValue('--rot')})`;
        
        initialX = rect.left;
        initialY = rect.top;
        
        e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        card.style.left = (initialX + dx) + 'px';
        card.style.top = (initialY + dy) + 'px';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // --- 3. AGRANDISSEMENT AU CLIC ---
    card.addEventListener('click', (e) => {
        if (activeCard) return;
        
        activeCard = card;
        card.classList.add('active');
        card.style.opacity = '1';
        card.style.zIndex = '10000';
        overlay.classList.add('visible');
        e.stopPropagation();
    });
});


// --- 4. RETOURNEMENT (FLIP) VIA LE BOUTON À CÔTÉ OU CLAVIER ---
function toggleFlip() {
    if (activeCard) {
        activeCard.classList.toggle('flipped');
    }
}

flipBtn.addEventListener('click', toggleFlip);

window.addEventListener('keydown', (e) => {
    if (!activeCard) return;

    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
    } else if (e.key === 'Escape') {
        closeActiveCard();
    }
});


// --- 5. FERMER L'IMAGE EN CLIQUANT SUR LE FOND ---
function closeActiveCard() {
    if (!activeCard) return;
    activeCard.classList.remove('active', 'flipped');
    overlay.classList.remove('visible');
    activeCard = null;
}

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        closeActiveCard();
    }
});
