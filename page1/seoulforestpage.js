const wall = document.getElementById('wall');
const container = document.getElementById('photo-container');
const overlay = document.getElementById('overlay');
const cards = document.querySelectorAll('.photo-card');

let isDragging = false;
let startX, startY;
let posX = 0, posY = 0;

wall.addEventListener('mousedown', (e) => {
    if (e.target.closest('.photo-card.active')) return;
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    container.style.transform = `translate(${posX}px, ${posY}px)`;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('wheel', (e) => {
    if (document.querySelector('.photo-card.active')) return;
    posX -= e.deltaX * 0.5;
    posY -= e.deltaY * 0.5;
    container.style.transform = `translate(${posX}px, ${posY}px)`;
}, { passive: true });

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (card.classList.contains('active')) {
            card.classList.toggle('flipped');
            return;
        }

        cards.forEach(c => {
            c.classList.remove('active', 'flipped');
            c.style.zIndex = 1;
        });

        card.classList.add('active');
        overlay.classList.add('visible');
        e.stopPropagation();
    });
});

overlay.addEventListener('click', () => {
    cards.forEach(card => {
        card.card?.classList.remove('active', 'flipped');
        card.classList.remove('active', 'flipped');
    });
    overlay.classList.remove('visible');
});
