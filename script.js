const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
let currentIndex = 0; 

// Détecte si on est sur mobile
const isMobile = () => window.innerWidth <= 768;

function updateCarousel() {
    const mobile = isMobile();
    // Espacement horizontal sur PC (250px), vertical sur téléphone (220px)
    const spacing = mobile ? 220 : 250; 

    items.forEach((item, index) => {
        let offset = (index - currentIndex) % totalItems;
        if (offset > totalItems / 2) offset -= totalItems;
        if (offset < -totalItems / 2) offset += totalItems;

        const distance = offset * spacing;
        const absOffset = Math.abs(offset);
        
        const scale = Math.max(0.3, 1 - absOffset * 0.25);
        const opacity = Math.max(0, 1 - absOffset * 0.4);
        const zIndex = 10 - Math.round(absOffset);

        // Mouvement horizontal (translateX) sur PC, vertical (translateY) sur téléphone
        if (mobile) {
            item.style.transform = `translateY(${distance}px) scale(${scale})`;
        } else {
            item.style.transform = `translateX(${distance}px) scale(${scale})`;
        }

        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        
        item.style.pointerEvents = absOffset > 1.5 ? 'none' : 'auto';
    });
}

// 1. Gestion de la roulette de la souris (Ordinateur uniquement)
window.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    e.preventDefault();
    if (e.deltaY > 0) {
        currentIndex += 0.15;
    } else {
        currentIndex -= 0.15;
    }
    updateCarousel();
}, { passive: false });

// 2. Gestion des flèches du clavier (Ordinateur uniquement)
window.addEventListener('keydown', (e) => {
    if (isMobile()) return;
    if (e.key === 'ArrowRight') {
        currentIndex = Math.floor(currentIndex) + 1;
        updateCarousel();
    } else if (e.key === 'ArrowLeft') {
        currentIndex = Math.ceil(currentIndex) - 1;
        updateCarousel();
    }
});

// 3. Gestion du Swipe Tactile (Téléphone uniquement - Vertical avec le doigt)
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
    if (!isMobile()) return;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isMobile()) return;
    let touchEndY = e.touches[0].clientY;
    let diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 15) {
        if (diff > 0) {
            currentIndex += 0.12; // Glisser vers le haut fait défiler
        } else {
            currentIndex -= 0.12; // Glisser vers le bas fait défiler
        }
        touchStartY = touchEndY;
        updateCarousel();
    }
}, { passive: true });

window.addEventListener('click', () => {
    if (!isMobile()) window.focus();
});

if (!isMobile()) window.focus();
updateCarousel();
