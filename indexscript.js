const starField = document.getElementById('starfield');
const starCount = 400; 
const stars = [];

function initStars() {
    starField.innerHTML = '';
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 1.8 + 0.5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        starField.appendChild(star);
        stars.push({
            el: star,
            x: (x / 100) * window.innerWidth,
            y: (y / 100) * window.innerHeight
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

const contactBtn = document.getElementById('contactBtn');
const contactBox = document.getElementById('contactBox');

// Contact 버튼 클릭 이벤트
contactBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    contactBox.classList.toggle('show');
});

// 바깥쪽 클릭 시 닫기
window.addEventListener('click', () => {
    contactBox.classList.remove('show');
});

contactBox.addEventListener('click', (e) => e.stopPropagation());

window.addEventListener('resize', () => {
    // 별 좌표 업데이트
    stars.forEach(star => {
        star.x = (parseFloat(star.el.style.left) / 100) * window.innerWidth;
        star.y = (parseFloat(star.el.style.top) / 100) * window.innerHeight;
    });
});

initStars();