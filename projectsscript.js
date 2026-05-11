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
        stars.push({ el: star, x: (x / 100) * window.innerWidth, y: (y / 100) * window.innerHeight });
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

const modalData = {
    'luminol': {
        title: '루미놀 용액 반응 실험',
        content: `루미놀 용액과 과산화수소를 적정 비율로 섞어 제조한 후, 직접 채혈한 혈액 시료를 추출하여 실험을 진행했습니다. 어두운 환경에서 나타나는 청백색 발광 현상을 관찰하며, 혈액 내 헤모글로빈의 철 이온이 활성화 에너지를 낮추는 촉매 역할을 하여 화학 에너지가 빛 에너지로 전환되는 원리를 확인했습니다. 또한, 1만 배 희석된 혈흔에서도 감식이 가능한 국내 과학수사 기술인 '신루미놀'의 발전상을 조사하며 과학적 탐구의 실용적 가치를 고찰하였습니다.`,
        image: 'projectsthumbnail.jpg'
    },
    'spectroscopy': { title: '기초 분광학 실험', content: '내용 준비 중입니다.', image: 'spectroscopy.jpg' },
    'debate': { title: '과학토론대회', content: '내용 준비 중입니다.', image: 'debate.jpg' },
    'saltfinger': { title: '솔트핑거현상 실험', content: '내용 준비 중입니다.', image: 'saltfinger.jpg' },
    'hormone': { title: '호르몬 실험', content: '내용 준비 중입니다.', image: 'hormone.jpg' }
};

function openModal(id) {
    const data = modalData[id];
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom:20px; font-size:1.8rem; border-bottom:1px solid #333; padding-bottom:10px;">${data.title}</h2>
        <div style="width:100%; height:350px; background-color:#222; border-radius:8px; margin-bottom:25px; overflow:hidden;">
            <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;" 
            onerror="this.parentElement.innerHTML='<div style=display:flex;justify-content:center;align-items:center;height:100%;color:#888;font-family:sans-serif;font-size:0.9rem;>관련 사진을 준비하고 있습니다.</div>'">
        </div>
        <p style="font-size:1rem; line-height:1.8; color:#ccc; word-break:keep-all; font-family:sans-serif;">${data.content}</p>
    `;
    
    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('projectModal')) closeModal();
}

window.addEventListener('resize', () => {
    stars.forEach(star => {
        star.x = (parseFloat(star.el.style.left) / 100) * window.innerWidth;
        star.y = (parseFloat(star.el.style.top) / 100) * window.innerHeight;
    });
});

initStars();