const cards = document.querySelectorAll('.photo-card');
const overlay = document.getElementById('overlay');

// Clic pour agrandir ou retourner
cards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (card.classList.contains('active')) {
            // Si déjà grand, on retourne la carte
            card.classList.toggle('flipped');
            e.stopPropagation();
            return;
        }

        // Sinon on l'ouvre en grand
        cards.forEach(c => c.classList.remove('active', 'flipped'));
        card.classList.add('active');
        overlay.classList.add('visible');
        e.stopPropagation();
    });
});

// Retourner avec la barre d'espace ou Entrée au clavier
window.addEventListener('keydown', (e) => {
    const activeCard = document.querySelector('.photo-card.active');
    if (!activeCard) return;

    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        activeCard.classList.toggle('flipped');
    } else if (e.key === 'Escape') {
        activeCard.classList.remove('active', 'flipped');
        overlay.classList.remove('visible');
    }
});

// Fermer en cliquant sur le fond sombre
overlay.addEventListener('click', () => {
    cards.forEach(card => card.classList.remove('active', 'flipped'));
    overlay.classList.remove('visible');
});
