const starField = document.getElementById('starfield');
const starCount = 400; 
const stars = [];

function initStars() {
    starField.innerHTML = '';
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const xPercent = Math.random() * 100;
        const yPercent = Math.random() * 100;
        const size = Math.random() * 1.8 + 0.5;

        star.style.left = `${xPercent}%`;
        star.style.top = `${yPercent}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        starField.appendChild(star);
        stars.push({
            el: star,
            x: (xPercent / 100) * window.innerWidth,
            y: (yPercent / 100) * window.innerHeight
        });
    }
}

window.addEventListener('mousemove', (e) => {
    stars.forEach(star => {
        const dx = e.clientX - star.x;
        const dy = e.clientY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) star.el.classList.add('bright');
        else star.el.classList.remove('bright');
    });
});

window.addEventListener('resize', () => {
    stars.forEach(star => {
        star.x = (parseFloat(star.el.style.left) / 100) * window.innerWidth;
        star.y = (parseFloat(star.el.style.top) / 100) * window.innerHeight;
    });
});

initStars();