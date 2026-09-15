const cards = document.querySelectorAll('.photo-card');
const overlay = document.getElementById('overlay');
const flipBtn = document.getElementById('flip-btn');

let scrollDepth = 0;
let activeCard = null;

// --- 1. NAVIGATION INFINIE À LA MOLETTE (ROULETTE) ---
window.addEventListener('wheel', (e) => {
    if (activeCard) return; // Bloqué si une photo est en grand
    e.preventDefault();
    
    // Vitesse de défilement de la molette
    scrollDepth += e.deltaY * 0.0007;

    cards.forEach((card) => {
        let baseDepth = parseFloat(card.style.getPropertyValue('--depth')) || 0.5;
        
        // Boucle infinie modulo 1 (quand ça sort d'un côté, ça revient de l'autre)
        let currentDepth = (baseDepth + scrollDepth) % 1;
        if (currentDepth < 0) currentDepth += 1;

        // Échelle (taille) et opacité selon la profondeur
        let scale = 0.4 + (currentDepth * 0.8);
        let opacity = Math.pow(currentDepth, 1.2); // Totalement opaque devant, transparent derrière
        let zIndex = Math.round(currentDepth * 100);

        card.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${card.style.getPropertyValue('--rot')})`;
        card.style.opacity = Math.max(0.08, opacity);
        card.style.zIndex = zIndex;
    });
}, { passive: false });

// Initialisation de la position de départ
cards.forEach(card => {
    let baseDepth = parseFloat(card.style.getPropertyValue('--depth')) || 0.5;
    let scale = 0.4 + (baseDepth * 0.8);
    let opacity = Math.pow(baseDepth, 1.2);
    card.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${card.style.getPropertyValue('--rot')})`;
    card.style.opacity = Math.max(0.08, opacity);
});


// --- 2. DÉPLACEMENT LIBRE (DRAG & DROP) ---
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
        card.style.left = (rect.left + rect.width / 2) + 'px';
        card.style.top = (rect.top + rect.height / 2) + 'px';
        
        initialX = rect.left + rect.width / 2;
        initialY = rect.top + rect.height / 2;
        
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

    // --- 3. OUVERTURE EN GRAND AU CLIC ---
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


// --- 4. RETOURNEMENT (FLIP) ---
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


// --- 5. FERMER LA PHOTO AGRANDIE ---
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
