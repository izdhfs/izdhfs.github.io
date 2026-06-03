// ==========================================
// 1. 전역 변수 및 기본 배경 화면 (메인 페이지용 별들)
// ==========================================
const starField = document.getElementById('starfield');
const starCount = 300; 
const stars = [];

// 인터랙티브 랩 제어용 전역 변수 (메모리 누수 및 하드웨어 다중 구동 차단)
let activeAnimationId = null;
let activeCamera = null;
let activeAudioStream = null;
let activeAudioContext = null;

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

// ==========================================
// 2. 전체 프로젝트 데이터 정의 (모달용)
// ==========================================
const modalData = {
    'luminol': {
        title: '루미놀 용액 반응 실험',
        content: `루미놀 용액과 과산화수소를 적정 비율로 섞어 제조한 후, 직접 채혈한 혈액 시료를 추출하여 실험을 진행했습니다. 어두운 환경에서 나타나는 청백색 발광 현상을 관찰하며, 혈액 내 헤모글로빈의 철 이온이 활성화 에너지를 낮추는 촉매 역할을 하여 화학 에너지가 빛 에너지로 전환되는 원리를 확인했습니다. 또한, 1만 배 희석된 혈흔에서도 감식이 가능한 국내 과학수사 기술인 '신루미놀'의 발전상을 조사하며 과학적 탐구의 실용적 가치를 고찰하였습니다.`,
        image: 'luminol_detail.jpg',
        isInteractive: false
    },
    'spectroscopy': { title: '기초 분광학 실험', content: '내용 준비 중입니다.', image: 'spectroscopy.jpg', isInteractive: false },
    'debate': { title: '과학토론대회', content: '내용 준비 중입니다.', image: 'debate.jpg', isInteractive: false },
    'saltfinger': { title: '솔트핑거현상 실험', content: '내용 준비 중입니다.', image: 'saltfinger.jpg', isInteractive: false },
    'hormone': { title: '호르몬 실험', content: '내용 준비 중입니다.', image: 'hormone.jpg', isInteractive: false },
    
    'interactive_galaxy': {
        title: 'Lab 01. 손가락 중력 은하수 시뮬레이터',
        content: '웹캠을 통해 사용자의 검지 손가락을 인식하고, 그 끝에 가상의 가속도(중력)를 부여하여 디지털 별 입자들을 조종하는 물리 연산 스크립트입니다.',
        isInteractive: true,
        labType: 'galaxy'
    },
    'interactive_voice': {
        title: 'Lab 02. 음성 주파수 실시간 시각화 장치',
        content: '마이크 입력을 받아 Web Audio API를 통해 소리의 고유 주파수 성분을 실시간으로 분석하고, 파동 그래픽으로 표현하는 장치입니다.',
        isInteractive: true,
        labType: 'voice'
    },
    'interactive_sand': {
        title: 'Lab 03. 물리 엔진 디지털 모래성 시뮬레이터',
        content: '웹캠을 통해 사용자님의 모습 위에 큼직한 첼시 블루 모래 폭포가 쏟아지고 빠르게 쌓이는 고체 물리 시뮬레이션입니다.',
        isInteractive: true,
        labType: 'sand'
    }
};

// ==========================================
// 3. 모달 UI 제어 (열기 / 닫기)
// ==========================================
function openModal(id) {
    const data = modalData[id];
    const modalBody = document.getElementById('modalBody');
    
    if (!data.isInteractive) {
        modalBody.innerHTML = `
            <h2 style="margin-bottom:20px; font-size:1.8rem; border-bottom:1px solid #333; padding-bottom:10px;">${data.title}</h2>
            <div style="width:100%; height:350px; background-color:#222; border-radius:8px; margin-bottom:25px; overflow:hidden;">
                <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=display:flex;justify-content:center;align-items:center;height:100%;color:#888;font-size:0.9rem;>관련 사진을 준비하고 있습니다.</div>'">
            </div>
            <p style="font-size:1rem; line-height:1.8; color:#ccc; word-break:keep-all; font-family:sans-serif;">${data.content}</p>
        `;
    } else {
        modalBody.innerHTML = `
            <h2 style="margin-bottom:5px; font-size:1.6rem; color:#fff;">${data.title}</h2>
            <p style="font-size:0.9rem; color:#666; margin-bottom:15px; font-family:sans-serif;">${data.content}</p>
            <div id="canvasContainer" style="width:100%; flex-grow:1; background-color:#020202; border:1px solid #1f1f1f; border-radius:8px; position:relative; overflow:hidden; display:flex; justify-content:center; align-items:center;">
                <button onclick="startLab('${data.labType}')" style="padding:15px 35px; background-color:#034694; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px; font-weight:bold; cursor:pointer; font-size:1rem; letter-spacing:1px; transition:0.2s; box-shadow:0 4px 15px rgba(3,70,148,0.4);">Launch Laboratory</button>
            </div>
        `;
    }
    
    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';

    if (activeAnimationId) {
        cancelAnimationFrame(activeAnimationId);
        activeAnimationId = null;
    }
    if (activeCamera) {
        const video = document.getElementById('labWebcam');
        if (video && video.srcObject) {
            const stream = video.srcObject;
            stream.getTracks().forEach(track => track.stop());
        }
        activeCamera = null;
    }
    if (activeAudioStream) {
        activeAudioStream.getTracks().forEach(track => track.stop());
        activeAudioStream = null;
    }
    if (activeAudioContext) {
        activeAudioContext.close();
        activeAudioContext = null;
    }
}

window.onclick = function(event) {
    if (event.target == document.getElementById('projectModal')) closeModal();
}

// ==========================================
// 4. 인터랙티브 웹 랩스 코어 구동 엔진
// ==========================================
function startLab(type) {
    const container = document.getElementById('canvasContainer');
    
    // ------------------------------------------
    // [Lab 01] 은하수 제스처 시뮬레이터 구동
    // ------------------------------------------
    if (type === 'galaxy') {
        container.innerHTML = `
            <div id="loadingText" style="position:absolute; color:#034694; font-family:sans-serif; font-size:1rem; font-weight:bold; letter-spacing:1px; z-index:10;">INITIALIZING EMBEDDED AI SYSTEM...</div>
            <div id="gestureGuide" style="position:absolute; top:20px; left:20px; color:rgba(255,255,255,0.4); font-family:sans-serif; font-size:0.85rem; z-index:10; line-height:1.5; pointer-events:none;">
                [제스처 가이드]<br>
                - 주먹을 오므리면: 은하수가 흡수되며 게이지 충전!<br>
                - <span style="color:#ff0055; font-weight:bold;">CHARGE 90% 이상</span>에서 펼쳐야만 사방으로 대폭발! (90% 미만은 불발)
            </div>
            <div id="gaugeUI" style="position:absolute; top:20px; right:30px; width:180px; height:24px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; overflow:hidden; z-index:10; display:flex; align-items:center;">
                <div id="gaugeBar" style="width:0%; height:100%; background:linear-gradient(90deg, #034694, #38bdf8); transition: width 0.1s ease;"></div>
                <span id="gaugeText" style="position:absolute; width:100%; text-align:center; font-size:0.75rem; font-family:sans-serif; color:#fff; font-weight:bold;">CHARGE: 0%</span>
            </div>
            <video id="labWebcam" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.15; transform: scaleX(-1); z-index:2; pointer-events:none;"></video>
            <canvas id="labCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; background: transparent;"></canvas>
        `;

        const canvas = document.getElementById('labCanvas');
        const ctx = canvas.getContext('2d');
        const video = document.getElementById('labWebcam');
        const loadingText = document.getElementById('loadingText');
        const gaugeBar = document.getElementById('gaugeBar');
        const gaugeText = document.getElementById('gaugeText');

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const pCount = 650; 
        const particles = [];
        let targetX = canvas.width / 2;
        let targetY = canvas.height / 2;
        let isHandFound = false;
        
        let isPinched = false; 
        let lastPinchedState = false;
        let isExploding = false;
        let explosionStartTime = 0;
        let currentCharge = 0; 

        for (let i = 0; i < pCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2.5 + 0.5,
                color: `hsl(${Math.random() * 40 + 200}, 90%, ${Math.random() * 30 + 60}%)`,
                baseColor: `hsl(${Math.random() * 40 + 200}, 90%, ${Math.random() * 30 + 60}%)`,
                friction: 0.98,
                ease: Math.random() * 0.04 + 0.01
            });
        }

        function explode(cx, cy, chargePower) {
            isExploding = true;
            explosionStartTime = Date.now();
            particles.forEach((p, index) => {
                const baseAngle = (index / pCount) * Math.PI * 2;
                const randomSpread = (Math.random() - 0.5) * 0.5; 
                const angle = baseAngle + randomSpread;
                const force = (Math.random() * 15 + 10) * (chargePower / 100 + 0.3);
                p.vx = Math.cos(angle) * force;
                p.vy = Math.sin(angle) * force;
                p.color = `hsl(${Math.random() * 50 + 240}, 100%, 80%)`; 
            });
        }

        function drawFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(2, 2, 2, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let timeElapsed = Date.now() - explosionStartTime;
            if (isExploding && timeElapsed > 1000) {
                isExploding = false;
                particles.forEach(p => p.color = p.baseColor);
            }

            if (isHandFound && isPinched && !isExploding) {
                if (currentCharge < 100) currentCharge += 1.3; 
                if (currentCharge > 100) currentCharge = 100;
            } else if (!isExploding) {
                if (currentCharge > 0) currentCharge -= 2.5; 
                if (currentCharge < 0) currentCharge = 0;
            }

            gaugeBar.style.width = `${currentCharge}%`;
            gaugeText.innerText = `CHARGE: ${Math.floor(currentCharge)}%`;
            
            if (currentCharge >= 90) gaugeBar.style.background = '#ff0055'; 
            else gaugeBar.style.background = 'linear-gradient(90deg, #034694, #38bdf8)';

            particles.forEach(p => {
                if (isExploding) {
                    p.friction = 0.94; 
                } else if (isHandFound) {
                    if (isPinched) {
                        const dx = targetX - p.x;
                        const dy = targetY - p.y;
                        const pullForce = 2.8 + (currentCharge / 40);
                        p.vx += dx * (p.ease * pullForce);
                        p.vy += dy * (p.ease * pullForce);
                        p.friction = 0.82; 
                    } else {
                        const dx = targetX - p.x;
                        const dy = targetY - p.y;
                        p.vx += dx * (p.ease * 0.3);
                        p.vy += dy * (p.ease * 0.3);
                        p.friction = 0.98;
                    }
                } else {
                    p.friction = 0.98;
                }

                p.vx *= p.friction;
                p.vy *= p.friction;
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = (isPinched || isExploding) ? p.size * 4 : p.size * 1;
                ctx.shadowColor = p.color;
                ctx.fill();
            });

            if (isHandFound && !isExploding) {
                ctx.beginPath();
                ctx.arc(targetX, targetY, isPinched ? 14 + (currentCharge * 0.2) : 7, 0, Math.PI * 2);
                ctx.lineWidth = 2;
                ctx.strokeStyle = isPinched ? (currentCharge >= 90 ? '#ff0055' : 'rgba(3, 70, 148, 0.8)') : 'rgba(3, 70, 148, 0.4)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(targetX, targetY, isPinched ? 10 : 7, 0, Math.PI * 2);
                ctx.fillStyle = isPinched ? (currentCharge >= 90 ? '#ff0055' : '#ffffff') : 'rgba(255, 255, 255, 0.8)'; 
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#034694';
                ctx.fill();
            }

            activeAnimationId = requestAnimationFrame(drawFrame);
        }

        const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        hands.onResults((results) => {
            if (loadingText) loadingText.style.display = 'none';
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                isHandFound = true;
                const landmarks = results.multiHandLandmarks[0];
                targetX = (1 - landmarks[8].x) * canvas.width;
                targetY = landmarks[8].y * canvas.height;
                const tX = (1 - landmarks[4].x) * canvas.width;
                const tY = landmarks[4].y * canvas.height;
                const distance = Math.sqrt(Math.pow(targetX - tX, 2) + Math.pow(targetY - tY, 2));
                isPinched = distance < 45;

                if (lastPinchedState === true && isPinched === false && !isExploding) {
                    if (currentCharge >= 90) explode(targetX, targetY, currentCharge);
                }
                lastPinchedState = isPinched;
            } else {
                isHandFound = false; isPinched = false; lastPinchedState = false;
            }
        });

        activeCamera = new Camera(video, {
            onFrame: async () => { await hands.send({ image: video }); }, width: 640, height: 480
        });
        activeCamera.start();
        drawFrame();
    } 
    
    // ------------------------------------------
    // [Lab 02] 음성 주파수 실시간 시각화 장치 구동
    // ------------------------------------------
    else if (type === 'voice') {
        container.innerHTML = `
            <div id="audioLoading" style="position:absolute; color:#034694; font-family:sans-serif; font-size:1rem; font-weight:bold; letter-spacing:1px; z-index:10;">REQUESTING MICROPHONE PERMISSION...</div>
            <div style="position:absolute; top:20px; left:20px; color:rgba(255,255,255,0.4); font-family:sans-serif; font-size:0.85rem; z-index:10; pointer-events:none; line-height:1.5;">
                [파동 분석 실험실]<br>
                - 마이크 권한 승인 후 말을 하거나 휘파람을 불어보세요.<br>
                - 오디오 주파수(Hz) 성분을 실시간 추출하여 시각적 파형으로 렌더링합니다.
            </div>
            <canvas id="audioCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; background:#020202;"></canvas>
        `;

        const canvas = document.getElementById('audioCanvas');
        const ctx = canvas.getContext('2d');
        const loadingText = document.getElementById('audioLoading');

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(function(stream) {
                if (loadingText) loadingText.style.display = 'none';
                activeAudioStream = stream;

                activeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = activeAudioContext.createMediaStreamSource(stream);
                const analyzer = activeAudioContext.createAnalyser();
                
                analyzer.fftSize = 1024; 
                const bufferLength = analyzer.frequencyBinCount;
                const timeDataArray = new Uint8Array(bufferLength);      
                const frequencyDataArray = new Uint8Array(bufferLength); 

                source.connect(analyzer);

                function drawAudioFrame() {
                    activeAnimationId = requestAnimationFrame(drawAudioFrame);
                    
                    analyzer.getByteTimeDomainData(timeDataArray);
                    analyzer.getByteFrequencyData(frequencyDataArray);

                    ctx.fillStyle = 'rgba(2, 2, 2, 0.2)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                    ctx.beginPath();
                    ctx.moveTo(0, canvas.height / 2);
                    ctx.lineTo(canvas.width, canvas.height / 2);
                    ctx.stroke();

                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#034694';
                    ctx.shadowBlur = 18;
                    ctx.shadowColor = '#38bdf8';
                    ctx.beginPath();

                    const sliceWidth = canvas.width / bufferLength;
                    let x = 0;

                    for (let i = 0; i < bufferLength; i++) {
                        const v = timeDataArray[i] / 128.0; 
                        const y = (v * canvas.height) / 2;

                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);

                        x += sliceWidth;
                    }
                    ctx.lineTo(canvas.width, canvas.height / 2);
                    ctx.stroke();

                    ctx.shadowBlur = 0; 
                    const barWidth = (canvas.width / bufferLength) * 2.5;
                    let barX = 0;

                    for (let i = 0; i < bufferLength; i++) {
                        const fraction = frequencyDataArray[i] / 255;
                        const barHeight = fraction * canvas.height * 0.45; 

                        ctx.fillStyle = `hsla(${210 + fraction * 60}, 95%, 50%, 0.15)`;
                        ctx.fillRect(barX, canvas.height - barHeight, barWidth - 1, barHeight);
                        ctx.fillRect(barX, 0, barWidth - 1, barHeight * 0.4);

                        barX += barWidth + 1;
                        if (barX > canvas.width) break; 
                    }
                }

                drawAudioFrame();
            })
            .catch(function(err) {
                if (loadingText) {
                    loadingText.style.color = '#ff0055';
                    loadingText.innerText = 'MICROPHONE ACCESS DENIED OR NOT FOUND.';
                }
                console.log('Audio lab error: ' + err);
            });
    } 
    
    // ------------------------------------------
    // [Lab 03] AI 손가락 제스처 모래성 시뮬레이션 (모래 크기 대폭 상향 튜닝 버전)
    // ------------------------------------------
    else if (type === 'sand') {
        container.innerHTML = `
            <div id="loadingText" style="position:absolute; color:#034694; font-family:sans-serif; font-size:1rem; font-weight:bold; letter-spacing:1px; z-index:10;">INITIALIZING HEAVY SAND ENGINE...</div>
            <div style="position:absolute; top:20px; left:20px; color:rgba(255,255,255,0.4); font-family:sans-serif; font-size:0.85rem; z-index:10; pointer-events:none; line-height:1.5;">
                [제스처 가이드]<br>
                - 손가락을 움직이면 커서가 따라 이동합니다.<br>
                - 엄지와 검지를 <span style="color:#38bdf8; font-weight:bold;">오므려 핀치(Pinch)</span>하면 손끝에서 큼직한 모래 폭포가 우르르 쏟아집니다!<br>
                - 중력 가속도가 강화되어 모래성이 훨씬 박진감 있게 쌓입니다.
            </div>
            <video id="labWebcam" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:1; transform: scaleX(-1); z-index:2; pointer-events:none;"></video>
            <canvas id="sandCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; background:transparent;"></canvas>
        `;

        const canvas = document.getElementById('sandCanvas');
        const ctx = canvas.getContext('2d');
        const video = document.getElementById('labWebcam');
        const loadingText = document.getElementById('loadingText');

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // ★★★ 모래 크기 튜닝: 스케일을 2에서 4로 대폭 확장 ★★★
        const scale = 4; 
        const cols = Math.floor(canvas.width / scale);
        const rows = Math.floor(canvas.height / scale);
        
        let grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
        let gridColor = new Array(cols).fill(null).map(() => new Array(rows).fill(''));

        let targetX = canvas.width / 2;
        let targetY = canvas.height / 2;
        let isHandFound = false;
        let isPinched = false;

        function updateSandEngine() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. 핀치 중일 때 모래 대량 살포 (한 번에 6개 -> 18개로 스폰량 3배 상향)
            if (isHandFound && isPinched) {
                const pX = Math.floor(targetX / scale);
                const pY = Math.floor(targetY / scale);
                
                for(let k = 0; k < 18; k++) { 
                    const rX = pX + Math.floor((Math.random() - 0.5) * 10);
                    const rY = pY + Math.floor((Math.random() - 0.5) * 10);
                    
                    if (rX >= 0 && rX < cols && rY >= 0 && rY < rows) {
                        if (grid[rX][rY] === 0) {
                            grid[rX][rY] = 1;
                            gridColor[rX][rY] = `hsl(${Math.random() * 20 + 205}, 95%, ${Math.random() * 25 + 45}%)`;
                        }
                    }
                }
            }

            // 2. 고속 중력 적치 연산 파트 (역방향 루프)
            let nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
            let nextColor = new Array(cols).fill(null).map(() => new Array(rows).fill(''));

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (grid[x][y] === 1) {
                        let currentC = gridColor[x][y];
                        
                        if (y === rows - 1) {
                            nextGrid[x][y] = 1;
                            nextColor[x][y] = currentC;
                            continue;
                        }

                        // ★★★ 중력 가속 속도 인자 강화 연산 ★★★
                        // 직하강 라인을 더 묵직하게 우선 연산
                        let below = y + 1;
                        let dir = Math.random() < 0.5 ? 1 : -1; 

                        if (grid[x][below] === 0) {
                            nextGrid[x][below] = 1;
                            nextColor[x][below] = currentC;
                        } else if (x + dir >= 0 && x + dir < cols && grid[x + dir][below] === 0) {
                            nextGrid[x + dir][below] = 1;
                            nextColor[x + dir][below] = currentC;
                        } else if (x - dir >= 0 && x - dir < cols && grid[x - dir][below] === 0) {
                            nextGrid[x - dir][below] = 1;
                            nextColor[x - dir][below] = currentC;
                        } else {
                            nextGrid[x][y] = 1;
                            nextColor[x][y] = currentC;
                        }
                    }
                }
            }
            grid = nextGrid;
            gridColor = nextColor;

            // 3. 커진 그리드 화면 렌더링
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (grid[x][y] === 1) {
                        ctx.fillStyle = gridColor[x][y];
                        // 스케일 변화에 맞춰 입자 크기를 맞춰 꽉 채움
                        ctx.fillRect(x * scale, y * scale, scale - 0.5, scale - 0.5); 
                    }
                }
            }

            // 4. 가이드 조준선 UI 동적 변화
            if (isHandFound) {
                ctx.beginPath();
                ctx.arc(targetX, targetY, isPinched ? 24 : 14, 0, Math.PI * 2);
                ctx.lineWidth = 2;
                ctx.strokeStyle = isPinched ? '#38bdf8' : 'rgba(255,255,255,0.5)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(targetX, targetY, 5, 0, Math.PI * 2);
                ctx.fillStyle = isPinched ? '#38bdf8' : '#ffffff';
                ctx.fill();
            }

            activeAnimationId = requestAnimationFrame(updateSandEngine);
        }

        const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        
        hands.onResults((results) => {
            if (loadingText) loadingText.style.display = 'none';
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                isHandFound = true;
                const landmarks = results.multiHandLandmarks[0];
                
                targetX = (1 - landmarks[8].x) * canvas.width;
                targetY = landmarks[8].y * canvas.height;
                
                const thumbX = (1 - landmarks[4].x) * canvas.width;
                const thumbY = landmarks[4].y * canvas.height;
                
                const distance = Math.sqrt(Math.pow(targetX - thumbX, 2) + Math.pow(targetY - thumbY, 2));
                isPinched = distance < 50; // 커진 입자 크기에 맞춰 판정 영역도 소폭 확대
            } else {
                isHandFound = false; isPinched = false;
            }
        });

        activeCamera = new Camera(video, {
            onFrame: async () => { await hands.send({ image: video }); }, width: 640, height: 480
        });
        activeCamera.start();
        updateSandEngine();
    }
}

// ==========================================
// 5. 창 해상도 변화 리사이즈 감지
// ==========================================
window.addEventListener('resize', () => {
    stars.forEach(star => {
        star.x = (parseFloat(star.el.style.left) / 100) * window.innerWidth;
        star.y = (parseFloat(star.el.style.top) / 100) * window.innerHeight;
    });
});

initStars();
