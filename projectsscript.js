// ==========================================
// 1. 전역 변수 및 기본 배경 화면 (마우스 반응형 흰색 별빛)
// ==========================================
const starField = document.getElementById('starfield');
const starCount = 300; 
const stars = [];

let activeAnimationId = null;
let activeCamera = null;
let activeAudioStream = null;
let activeAudioContext = null;
let threeRenderer = null; 

function initStars() {
    starField.innerHTML = '';
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 1.8 + 0.6;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = '#ffffff'; 
        star.style.position = 'absolute';
        star.style.borderRadius = '50%';
        star.style.opacity = '0';
        star.style.transition = 'opacity 0.6s ease, transform 0.4s ease, box-shadow 0.4s ease';
        starField.appendChild(star);
        stars.push({ el: star, x: (x / 100) * window.innerWidth, y: (y / 100) * window.innerHeight });
    }
}

window.addEventListener('mousemove', (e) => {
    stars.forEach(star => {
        const dx = e.clientX - star.x;
        const dy = e.clientY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            star.el.style.opacity = '1';
            star.el.style.transform = 'scale(2.2)';
            star.el.style.boxShadow = '0 0 12px rgba(255, 255, 255, 1)';
        } else {
            star.el.style.opacity = '0';
            star.el.style.transform = 'scale(1)';
            star.el.style.boxShadow = 'none';
        }
    });
});

// ==========================================
// 2. 전체 프로젝트 데이터 정의
// ==========================================
const modalData = {
    'interactive_galaxy': { 
        title: 'Lab 01. 주먹 중력 은하수 연성소', 
        content: 'AI 손끝 추적 기술하고 천체 중력 연산 법칙을 융합한 인터랙티브 가상 우주 공간.', 
        isInteractive: true, 
        labType: 'galaxy',
        guide: `<span style="color:#ff0055; font-weight:bold; font-size:1.05rem;">[Lab 01 이용 방법]</span><br><br>• <span style="color:#fff; font-weight:bold;">주먹 꽉 쥐기</span>: 은하수가 중앙으로 흡수되며 게이지가 충전됩니다.<br>• <span style="color:#ff0055; font-weight:bold;">90% 돌파 시</span> 게이지가 핑크색으로 각성합니다.<br>• 그 상태에서 손을 쫙 펼치면 화면 전체가 핑크빛 충격파로 가득 차며 대폭발합니다.`
    },
    'interactive_voice': { 
        title: 'Lab 02. 실시간 3단 주파수 스펙트럼 분석기', 
        content: 'Web Audio API 아날라이저 기반 음성 성질 파동의 수학적 렌더링 디지털 장치.', 
        isInteractive: true, 
        labType: 'voice',
        guide: `<span style="color:#00d2ff; font-weight:bold; font-size:1.05rem;">[Lab 02 이용 방법]</span><br><br>• 마이크 볼륨에 맞추어 상단 오실로스코프 파형이 일렉트릭 블루 색상으로 춤을 춥니다.<br>• 하단 인터페이스 바를 통해 <span style="color:#fff; font-weight:bold;">저음역대, 중음역대, 고음역대(Hz)</span> 수치가 정밀 실시간 실감 매핑 분류됩니다.`
    },
    'interactive_sand': { 
        title: 'Lab 03. 물리 역학 오로라 모래성', 
        content: '내 모습 위에 떨어지는 무거운 모래 알갱이들의 마찰 및 각도 누적 물리 엔진실.', 
        isInteractive: true, 
        labType: 'sand',
        guide: `<span style="color:#00ffaa; font-weight:bold; font-size:1.05rem;">[Lab 03 이용 방법]</span><br><br>• 엄지와 검지를 붙잡는 핀치 모션을 취해보세요.<br>• 입체 글로우 효과와 오로라 그라데이션이 결합된 예술적인 물리 모래 알갱이들이 손가락 끝에서 실시간 합성 투하됩니다.`
    },
    'interactive_3d': {
        title: 'Lab 04. JARVIS 가상 홀로그램 입체 연성소',
        content: '한 손 제스처를 1초간 유지하여 도형을 고르고, 한 손으로 "탁, 탁!" 연속 두 번 핀치하여 그 자리에 입체를 생성하세요.',
        isInteractive: true,
        labType: 'three3d',
        guide: `<span style="color:#00d2ff; font-weight:bold; font-size:1.05rem;">[Lab 04 이용 방법]</span><br><br>• <span style="color:#38bdf8; font-weight:bold;">도형 선택</span>: 한 손인 상태로 ☝️큐브 | ✌️구 | 🤟도넛 모양 <span style="color:#00ffff; font-weight:bold;">1초 유지</span><br>• <span style="color:#00ffaa; font-weight:bold;">입체 생성</span>: 한 손으로 "탁, 탁!" 연속 두 번 핀치하여 그 자리에 입체 생성`
    },
    'interactive_dynamic_text': {
        title: 'Lab 05. 가상 제스처 공간 동적 텍스트 실험기',
        content: 'MediaPipe Hands 기술을 활용해 양손 제스처로 공중에 가변적인 직사각형 공간을 설계하고, 입력한 텍스트를 직사각형 형태에 맞게 왜곡하여 꽉 채우는 실시간 AI 실험실.',
        isInteractive: true,
        labType: 'dynamic_text',
        guide: `<span style="color:#00ffaa; font-weight:bold; font-size:1.05rem;">[Lab 05 이용 방법]</span><br><br>• <span style="color:#fff; font-weight:bold;">텍스트 직접 입력</span>: 우측 상단의 입력창을 통해 짧은 문구와 긴 문구를 자유롭게 설정하세요.<br>• <span style="color:#fff; font-weight:bold;">공간 드로잉</span>: 양손의 엄지 끝과 검지 끝 좌표를 인식시켜 실시간으로 변하는 가상의 직사각형을 만듭니다.<br>• <span style="color:#00ffaa; font-weight:bold;">가로폭 텍스트 스위칭</span>:<br>&nbsp;&nbsp;- 사각형 가로폭 <span style="color:#38bdf8; font-weight:bold;">280px 미만</span>: '짧은 문구' 표출<br>&nbsp;&nbsp;- 사각형 가로폭 <span style="color:#00ffff; font-weight:bold;">280px 이상</span>: '긴 문구' 표출<br>• <span style="color:#ffaa00; font-weight:bold;">도형 맞춤 텍스트 스케일링</span>: 직사각형의 가로/세로 비율에 맞게 텍스트가 찌그러지거나 늘어나며 공간을 100% 빈틈없이 채웁니다.`
    }
};

function openModal(id) {
    const data = modalData[id];
    const modalBody = document.getElementById('modalBody');
    
    if (!data.isInteractive) {
        modalBody.innerHTML = `
            <h2 style="margin-bottom:20px; font-size:1.8rem; border-bottom:1px solid #222; padding-bottom:12px; color:#fff;">${data.title}</h2>
            <div style="width:100%; height:350px; background-color:#0d0d1a; border: 1px solid #1f1f38; border-radius:12px; margin-bottom:25px; overflow:hidden;">
                <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=display:flex;justify-content:center;align-items:center;height:100%;color:#555;>이미지 준비 중</div>'">
            </div>
            <p style="font-size:0.95rem; line-height:1.8; color:#b4b4c7;">${data.content}</p>
        `;
    } else {
        modalBody.innerHTML = `
            <div>
                <h2 style="font-size:1.5rem; color:#fff; font-weight:600; margin:0;">${data.title}</h2>
                <p style="font-size:0.85rem; color:#666680; margin:4px 0 15px 0;">${data.content}</p>
            </div>
            <div id="canvasContainer" style="width:100%; flex-grow:1; background-color:#010103; border:1px solid #131324; border-radius:16px; position:relative; overflow:hidden; display:flex; justify-content:center; align-items:center; box-shadow: inset 0 0 40px rgba(0,0,0,0.95);">
                <button onclick="startLab('${data.labType}')" style="padding:15px 40px; background: linear-gradient(135deg, #034694, #021226); color:#fff; border:1px solid rgba(56,189,248,0.2); border-radius:30px; font-weight:bold; cursor:pointer; font-size:0.95rem; letter-spacing:1px; transition:0.3s; box-shadow:0 0 20px rgba(3,70,148,0.4);">LAUNCH LABORATORY</button>
            </div>
        `;
    }
    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    if (activeAnimationId) { cancelAnimationFrame(activeAnimationId); activeAnimationId = null; }
    if (activeCamera) {
        const video = document.getElementById('labWebcam');
        if (video && video.srcObject) { video.srcObject.getTracks().forEach(track => track.stop()); }
        activeCamera = null;
    }
    if (activeAudioStream) { activeAudioStream.getTracks().forEach(track => track.stop()); activeAudioStream = null; }
    if (activeAudioContext) { activeAudioContext.close(); activeAudioContext = null; }
    if (threeRenderer) { threeRenderer.dispose(); threeRenderer = null; }
}

function injectHelpButton(container, guideHtml) {
    const helpBtn = document.createElement('button');
    helpBtn.innerHTML = 'ℹ️ HELP';
    helpBtn.style = `
        position: absolute; top: 20px; left: 20px; z-index: 100;
        background: rgba(10, 15, 30, 0.8); color: #00d2ff;
        border: 1px solid rgba(0, 210, 255, 0.3); padding: 8px 16px;
        border-radius: 20px; font-weight: bold; font-size: 0.8rem; cursor: pointer; backdrop-filter: blur(8px);
    `;
    const helpBox = document.createElement('div');
    helpBox.innerHTML = guideHtml;
    helpBox.style = `
        position: absolute; top: 65px; left: 20px; z-index: 99;
        width: 320px; background: rgba(4, 6, 16, 0.95); color: #e5e7eb;
        border: 1px solid rgba(56, 189, 248, 0.4); padding: 18px; border-radius: 12px;
        font-size: 0.85rem; line-height: 1.6; display: none; backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    `;
    helpBtn.onmouseenter = () => { helpBox.style.display = 'block'; helpBtn.style.background = '#00d2ff'; helpBtn.style.color = '#000'; };
    helpBtn.onmouseleave = () => { helpBox.style.display = 'none'; helpBtn.style.background = 'rgba(10,15,30,0.8)'; helpBtn.style.color = '#00d2ff'; };
    container.appendChild(helpBtn);
    container.appendChild(helpBox);
}

// ==========================================
// 4. 인터랙티브 웹 랩스 코어 구동 엔진
// ==========================================
function startLab(type) {
    const container = document.getElementById('canvasContainer');
    const spec = Object.values(modalData).find(m => m.labType === type);
    
    // 🌌 [Lab 01] 은하수 시뮬레이터
    if (type === 'galaxy') {
        container.innerHTML = `
            <div id="loadingText" style="position:absolute; color:#ff0055; font-family:sans-serif; font-size:0.9rem; font-weight:bold; z-index:10;">CALIBRATING NEURAL GESTURE...</div>
            <div id="gaugeUI" style="position:absolute; top:20px; right:20px; width:180px; height:24px; background:rgba(5,5,10,0.8); border:1px solid rgba(56,189,248,0.2); border-radius:12px; overflow:hidden; z-index:10; display:flex; align-items:center;">
                <div id="gaugeBar" style="width:0%; height:100%; background:gradient(90deg, #034694, #38bdf8); transition: background 0.2s;"></div>
                <span id="gaugeText" style="position:absolute; width:100%; text-align:center; font-size:0.7rem; font-family:sans-serif; color:#fff; font-weight:bold;">CHARGE: 0%</span>
            </div>
            <video id="labWebcam" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.12; transform: scaleX(-1); z-index:2; pointer-events:none;"></video>
            <canvas id="labCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; background: transparent;"></canvas>
        `;
        injectHelpButton(container, spec.guide);
        
        const canvas = document.getElementById('labCanvas'); const ctx = canvas.getContext('2d'); const video = document.getElementById('labWebcam');
        const loadingText = document.getElementById('loadingText'); const gaugeBar = document.getElementById('gaugeBar'); const gaugeText = document.getElementById('gaugeText');
        canvas.width = container.clientWidth; canvas.height = container.clientHeight;
        
        const pCount = 650; const particles = [];
        let targetX = canvas.width / 2; let targetY = canvas.height / 2;
        let isHandFound = false; let isFist = false; let lastFistState = false;
        let isExploding = false; let explosionStartTime = 0; let currentCharge = 0;
        let pinkFlashOpacity = 0; 

        for (let i = 0; i < pCount; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2.5 + 0.5,
                color: `hsl(${Math.random() * 40 + 200}, 90%, ${Math.random() * 30 + 60}%)`,
                baseColor: `hsl(${Math.random() * 40 + 200}, 90%, ${Math.random() * 30 + 60}%)`,
                friction: 0.98, ease: Math.random() * 0.04 + 0.01
            });
        }

        function explode(cx, cy, chargePower) {
            isExploding = true;
            explosionStartTime = Date.now();
            pinkFlashOpacity = 0.75; 
            particles.forEach((p, index) => {
                const angle = (index / pCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
                const force = (Math.random() * 18 + 12) * (chargePower / 100 + 0.4);
                p.vx = Math.cos(angle) * force; p.vy = Math.sin(angle) * force;
                p.color = `hsl(${Math.random() * 40 + 320}, 100%, 75%)`; 
            });
        }

        function drawFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(2, 2, 5, 0.2)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (isExploding && Date.now() - explosionStartTime > 1200) { isExploding = false; particles.forEach(p => p.color = p.baseColor); }
            
            if (isHandFound && isFist && !isExploding) { currentCharge = Math.min(100, currentCharge + 1.6); } 
            else if (!isExploding) { currentCharge = Math.max(0, currentCharge - 3.0); }
            
            if (currentCharge >= 90) {
                gaugeBar.style.background = 'linear-gradient(90deg, #ff0055, #ff77aa)';
                gaugeBar.style.boxShadow = '0 0 10px rgba(255, 0, 85, 0.8)';
            } else {
                gaugeBar.style.background = 'linear-gradient(90deg, #034694, #38bdf8)';
                gaugeBar.style.boxShadow = 'none';
            }
            gaugeBar.style.width = `${currentCharge}%`;
            gaugeText.innerText = `CHARGE: ${Math.floor(currentCharge)}%`;
            
            particles.forEach(p => {
                if (isExploding) p.friction = 0.93;
                else if (isHandFound) {
                    const dx = targetX - p.x; const dy = targetY - p.y;
                    const pull = isFist ? 0.3 + (currentCharge / 300) : 0.05;
                    p.vx += dx * (p.ease * pull); p.vy += dy * (p.ease * pull);
                    p.friction = isFist ? 0.91 : 0.98;
                } else p.friction = 0.98;
                p.vx *= p.friction; p.vy *= p.friction; p.x += p.vx; p.y += p.vy;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
            });
            if (isHandFound && !isExploding) {
                ctx.beginPath();
                ctx.arc(targetX, targetY, isFist ? 15 + (currentCharge * 0.25) : 8, 0, Math.PI * 2);
                ctx.lineWidth = 2;
                ctx.strokeStyle = isFist ? '#ff0055' : '#38bdf8'; ctx.stroke();
            }

            if (pinkFlashOpacity > 0) {
                ctx.fillStyle = `rgba(255, 180, 210, ${pinkFlashOpacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                pinkFlashOpacity -= 0.025; 
            }

            activeAnimationId = requestAnimationFrame(drawFrame);
        }

        const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.55, minTrackingConfidence: 0.55 });
        hands.onResults((results) => {
            if (loadingText) loadingText.style.display = 'none';
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                isHandFound = true; const landmarks = results.multiHandLandmarks[0];
                targetX = (1 - landmarks[9].x) * canvas.width; targetY = landmarks[9].y * canvas.height;
                const isIndexFolded = landmarks[8].y > landmarks[6].y;
                const isMiddleFolded = landmarks[12].y > landmarks[10].y;
                const isRingFolded = landmarks[16].y > landmarks[14].y;
                const isPinkyFolded = landmarks[20].y > landmarks[18].y;
                isFist = isIndexFolded && isMiddleFolded && isRingFolded && isPinkyFolded;

                if (lastFistState && !isFist && !isExploding && currentCharge >= 90) explode(targetX, targetY, currentCharge);
                lastFistState = isFist;
            } else { isHandFound = false; isFist = false; }
        });
        activeCamera = new Camera(video, { onFrame: async () => { await hands.send({ image: video }); }, width: 640, height: 480 });
        activeCamera.start(); drawFrame();
    }
    
    // 🎵 [Lab 02] 음성 시각화
    else if (type === 'voice') {
        container.innerHTML = `
            <div id="audioLoading" style="position:absolute; color:#00d2ff; font-family:sans-serif; font-size:0.9rem; font-weight:bold; z-index:10;">OPENING SOUND FREQUENCY INTERFACE...</div>
            <canvas id="audioCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; background:#020207;"></canvas>
            <div id="freqMonitor" style="position:absolute; bottom:20px; left:5%; width:90%; height:55px; z-index:10; display:flex; justify-content:space-around; align-items:center; background:rgba(5,9,24,0.85); border:1px solid rgba(0,210,255,0.25); border-radius:12px; backdrop-filter:blur(6px); font-family:monospace; font-size:0.75rem; color:#00d2ff; padding: 0 10px;">
                <div style="width:30%; text-align:center;">
                    <div style="color:rgba(255,255,255,0.4); margin-bottom:3px;">BASS (저음역)</div>
                    <div id="barBass" style="width:0%; height:5px; background:#0055ff; border-radius:3px; margin:2px auto; transition: width 0.05s;"></div>
                    <span id="txtBass">0 Hz</span>
                </div>
                <div style="width:1px; height:30px; background:rgba(0,210,255,0.2);"></div>
                <div style="width:30%; text-align:center;">
                    <div style="color:rgba(255,255,255,0.4); margin-bottom:3px;">MID (중음역)</div>
                    <div id="barMid" style="width:0%; height:5px; background:#0099ff; border-radius:3px; margin:2px auto; transition: width 0.05s;"></div>
                    <span id="txtMid">0 Hz</span>
                </div>
                <div style="width:1px; height:30px; background:rgba(0,210,255,0.2);"></div>
                <div style="width:30%; text-align:center;">
                    <div style="color:rgba(255,255,255,0.4); margin-bottom:3px;">TREBLE (고음역)</div>
                    <div id="barTreble" style="width:0%; height:5px; background:#00e5ff; border-radius:3px; margin:2px auto; transition: width 0.05s;"></div>
                    <span id="txtTreble">0 Hz</span>
                </div>
            </div>
        `;
        injectHelpButton(container, spec.guide);
        
        const canvas = document.getElementById('audioCanvas'); const ctx = canvas.getContext('2d');
        const bBass = document.getElementById('barBass'); const tBass = document.getElementById('txtBass');
        const bMid = document.getElementById('barMid'); const tMid = document.getElementById('txtMid');
        const bTreble = document.getElementById('barTreble'); const tTreble = document.getElementById('txtTreble');
        
        canvas.width = container.clientWidth; canvas.height = container.clientHeight;
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(stream) {
            document.getElementById('audioLoading').style.display = 'none'; 
            activeAudioStream = stream;
            activeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = activeAudioContext.createMediaStreamSource(stream);
            
            const analyzer = activeAudioContext.createAnalyser(); 
            analyzer.fftSize = 1024;
            const bufferLength = analyzer.frequencyBinCount; 
            const timeData = new Uint8Array(bufferLength);
            const freqData = new Uint8Array(bufferLength); 
            source.connect(analyzer);
            
            function drawAudio() {
                activeAnimationId = requestAnimationFrame(drawAudio);
                analyzer.getByteTimeDomainData(timeData);
                analyzer.getByteFrequencyData(freqData);
                
                ctx.fillStyle = 'rgba(2, 2, 7, 0.28)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.lineWidth = 3; ctx.strokeStyle = '#0066ff';
                ctx.shadowColor = '#00a3ff'; ctx.shadowBlur = 6;
                ctx.beginPath();
                let slice = canvas.width / bufferLength; let x = 0;
                for(let i=0; i<bufferLength; i++) {
                    let y = (timeData[i]/128.0)*(canvas.height / 2.3);
                    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); x+=slice;
                }
                ctx.lineTo(canvas.width, canvas.height/2.3);
                ctx.stroke(); ctx.shadowBlur = 0;

                let bassSum = 0, midSum = 0, trebleSum = 0;
                let bassCount = 0, midCount = 0, trebleCount = 0;
                for (let i = 0; i < bufferLength; i++) {
                    if (i < 40) { bassSum += freqData[i]; bassCount++; }
                    else if (i >= 40 && i < 280) { midSum += freqData[i]; midCount++; }
                    else { trebleSum += freqData[i]; trebleCount++; }
                }
                
                let avgBass = bassSum / bassCount;
                let avgMid = midSum / midCount;
                let avgTreble = trebleSum / trebleCount;

                bBass.style.width = `${Math.min(100, (avgBass/255)*100)}%`;
                tBass.innerText = `${Math.floor(avgBass * 3.5)} Hz`;
                bMid.style.width = `${Math.min(100, (avgMid/255)*100)}%`; tMid.innerText = `${Math.floor(avgMid * 12 + 250)} Hz`;
                bTreble.style.width = `${Math.min(100, (avgTreble/255)*100)}%`; tTreble.innerText = `${Math.floor(avgTreble * 40 + 2000)} Hz`;
            }
            drawAudio();
        }).catch(err => console.log(err));
    }
    
    // ⏳ [Lab 03] 모래성 시뮬레이터
    else if (type === 'sand') {
        container.innerHTML = `
            <div id="loadingText" style="position:absolute; color:#00ffaa; font-family:sans-serif; font-size:0.9rem; font-weight:bold; z-index:10;">ENGAGING AURORA GRAVITY ENGINE...</div>
            <video id="labWebcam" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.12; transform: scaleX(-1); z-index:2; pointer-events:none;"></video>
            <canvas id="sandCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; background:transparent;"></canvas>
        `;
        injectHelpButton(container, spec.guide);
        
        const canvas = document.getElementById('sandCanvas'); const ctx = canvas.getContext('2d');
        const video = document.getElementById('labWebcam');
        canvas.width = container.clientWidth; canvas.height = container.clientHeight;
        const scale = 5; 
        const cols = Math.floor(canvas.width / scale);
        const rows = Math.floor(canvas.height / scale);
        let grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
        let gridColor = new Array(cols).fill(null).map(() => new Array(rows).fill(''));
        let targetX = canvas.width / 2; let targetY = canvas.height / 2;
        let isHandFound = false; let isPinched = false;

        function updateSand() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (isHandFound && isPinched) {
                const pX = Math.floor(targetX / scale);
                const pY = Math.floor(targetY / scale);
                for(let k = 0; k < 12; k++) {
                    const rX = pX + Math.floor((Math.random() - 0.5) * 8);
                    const rY = pY + Math.floor((Math.random() - 0.5) * 8);
                    if (rX >= 0 && rX < cols && rY >= 0 && rY < rows && grid[rX][rY] === 0) {
                        grid[rX][rY] = 1;
                        const hue = Math.random() < 0.4 ? Math.random() * 40 + 180 : (Math.random() * 50 + 260);
                        gridColor[rX][rY] = `hsla(${hue}, 100%, 65%, 0.95)`;
                    }
                }
            }
            let nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
            let nextColor = new Array(cols).fill(null).map(() => new Array(rows).fill(''));
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (grid[x][y] === 1) {
                        let currentC = gridColor[x][y];
                        if (y === rows - 1) { nextGrid[x][y] = 1; nextColor[x][y] = currentC; continue; }
                        let below = y + 1;
                        let dir = Math.random() < 0.5 ? 1 : -1;
                        if (grid[x][below] === 0) { nextGrid[x][below] = 1; nextColor[x][below] = currentC; } 
                        else if (x + dir >= 0 && x + dir < cols && grid[x + dir][below] === 0) { nextGrid[x + dir][below] = 1; nextColor[x + dir][below] = currentC; } 
                        else if (x - dir >= 0 && x - dir < cols && grid[x - dir][below] === 0) { nextGrid[x - dir][below] = 1; nextColor[x - dir][below] = currentC; } 
                        else { nextGrid[x][y] = 1; nextColor[x][y] = currentC; }
                    }
                }
            }
            grid = nextGrid;
            gridColor = nextColor;
            
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (grid[x][y] === 1) { 
                        ctx.beginPath();
                        const cx = x * scale + scale / 2;
                        const cy = y * scale + scale / 2;
                        ctx.arc(cx, cy, (scale / 2) - 0.2, 0, Math.PI * 2);
                        ctx.fillStyle = gridColor[x][y]; 
                        ctx.fill();
                    }
                }
            }
            if (isHandFound) { 
                ctx.beginPath();
                ctx.arc(targetX, targetY, isPinched ? 18 : 12, 0, Math.PI * 2); 
                ctx.lineWidth = 2; ctx.strokeStyle = '#00ffaa'; ctx.stroke();
            }
            activeAnimationId = requestAnimationFrame(updateSand);
        }
        const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        hands.onResults((results) => {
            document.getElementById('loadingText').style.display = 'none';
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                isHandFound = true; const landmarks = results.multiHandLandmarks[0];
                targetX = (1 - landmarks[8].x) * canvas.width; targetY = landmarks[8].y * canvas.height;
                const distance = Math.sqrt(Math.pow(targetX - (1 - landmarks[4].x) * canvas.width, 2) + Math.pow(targetY - landmarks[4].y * canvas.height, 2));
                isPinched = distance < 45;
            } else { isHandFound = false; isPinched = false; }
        });
        activeCamera = new Camera(video, { onFrame: async () => { await hands.send({ image: video }); }, width: 640, height: 480 });
        activeCamera.start(); updateSand();
    }

    // 🤖 [Lab 04] JARVIS 가상 홀로그램 입체 연성소
    else if (type === 'three3d') {
        container.innerHTML = `
            <div id="loadingText" style="position:absolute; color:#00d2ff; font-family:sans-serif; font-size:0.9rem; font-weight:bold; z-index:10; pointer-events:none; text-shadow:0 0 10px #00d2ff;">JARVIS NEURAL CORE ONLINE...</div>
            <div id="shapeMenu" style="position:absolute; top:20px; right:20px; background:rgba(6,12,28,0.85); padding:14px 20px; border-radius:12px; border:1px solid rgba(0,210,255,0.4); color:#fff; font-family:sans-serif; font-size:0.85rem; z-index:10; box-shadow:0 0 20px rgba(0,210,255,0.25); backdrop-filter:blur(8px);">
                <span style="color:rgba(255,255,255,0.5); font-weight:bold; font-size:0.75rem;">GEOMETRY CORE:</span> <span id="currentShapeText" style="color:#00d2ff; font-weight:bold; letter-spacing:1px;">CUBE</span><br>
                <div id="selectGauge" style="width:100%; height:4px; background:rgba(255,255,255,0.1); margin:6px 0 8px 0; border-radius:2px; overflow:hidden;"><div id="selectBar" style="width:0%; height:100%; background:linear-gradient(90deg, #00d2ff, #00ffaa); transition: width 0.08s;"></div></div>
                <span id="jarvisScaleText" style="color:#ffaa00; font-size:0.75rem; display:block; font-weight:bold;">Object Count: 0</span>
                <div id="wipeGauge" style="width:100%; height:5px; background:rgba(255,255,255,0.1); margin-top:8px; display:none; border-radius:2px; overflow:hidden;"><div id="wipeBar" style="width:0%; height:100%; background:linear-gradient(90deg, #ef4444, #ff0055);"></div></div>
            </div>
            <video id="labWebcam" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.22; transform: scaleX(-1); z-index:2; pointer-events:none;"></video>
            <div id="threeCanvasContainer" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5;"></div>
            <canvas id="jarvisOverlayCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:6; background:transparent; pointer-events:none;"></canvas>
        `;
        injectHelpButton(container, spec.guide);

        const video = document.getElementById('labWebcam');
        const threeContainer = document.getElementById('threeCanvasContainer');
        const overlayCanvas = document.getElementById('jarvisOverlayCanvas');
        const ctxOverlay = overlayCanvas.getContext('2d');
        const shapeText = document.getElementById('currentShapeText');
        const scaleText = document.getElementById('jarvisScaleText');
        const loadingText = document.getElementById('loadingText');
        const wipeGauge = document.getElementById('wipeGauge');
        const wipeBar = document.getElementById('wipeBar');
        const selectBar = document.getElementById('selectBar');

        const width = container.clientWidth;
        const height = container.clientHeight;
        overlayCanvas.width = width;
        overlayCanvas.height = height;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 40);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        threeContainer.appendChild(renderer.domElement);
        threeRenderer = renderer;

        scene.add(new THREE.AmbientLight(0x223344));
        const pLight = new THREE.PointLight(0x00d2ff, 3, 300);
        pLight.position.set(0, 30, 50);
        scene.add(pLight);
        let createdObjects = [];
        let currentShapeMode = 'CUBE';
        let latestMesh = null; 

        let baseSingleHandX = null;
        let baseMeshScale = 1.0;
        let openHandStartTime = null;
        let shapeSelectStartTime = null;
        let pendingShapeMode = null;

        let lastPinchState = false;
        let lastPinchTime = 0;
        function loopJARVIS() {
            activeAnimationId = requestAnimationFrame(loopJARVIS);
            createdObjects.forEach(mesh => {
                mesh.rotation.x += 0.003;
                mesh.rotation.y += 0.005;
            });
            renderer.render(scene, camera);
        }

        function createCentralHologram(sX, sY) {
            const vec = new THREE.Vector3((sX / width) * 2 - 1, -(sY / height) * 2 + 1, 0.5);
            vec.unproject(camera);
            const dir = vec.sub(camera.position).normalize();
            const dist = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(dist));

            let geo;
            if (currentShapeMode === 'CUBE') geo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
            else if (currentShapeMode === 'SPHERE') geo = new THREE.SphereGeometry(2.5, 24, 24);
            else if (currentShapeMode === 'TORUS') geo = new THREE.TorusGeometry(2.0, 0.6, 12, 32);
            const mat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(currentShapeMode === 'CUBE' ? 0x00d2ff : (currentShapeMode === 'SPHERE' ? 0xa855f7 : 0x00ffaa)),
                wireframe: true,
                transparent: true,
                opacity: 0.85
            });
            const newMesh = new THREE.Mesh(geo, mat);
            newMesh.position.set(pos.x, pos.y, 0);
            scene.add(newMesh);
            
            createdObjects.push(newMesh);
            latestMesh = newMesh; 
            scaleText.innerText = `Object Count: ${createdObjects.length}`;
        }

        const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        hands.onResults((results) => {
            if (loadingText) loadingText.style.display = 'none';
            ctxOverlay.clearRect(0, 0, width, height);

            let detectedHands = [];
            let totalOpenHands = 0;
            let currentDetectedFingers = null;

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                    const marks = results.multiHandLandmarks[i];
                    const idxX = (1 - marks[8].x) * width;
                    const idxY = marks[8].y * height;
                    const thmX = (1 - marks[4].x) * width;
                    const thmY = marks[4].y * height;
                    const selfPinchDist = Math.sqrt(Math.pow(idxX - thmX, 2) + Math.pow(idxY - thmY, 2));
                    const isSelfPinch = selfPinchDist < 45;

                    const isIndexOpen = marks[8].y < marks[6].y;
                    const isMiddleOpen = marks[12].y < marks[10].y;
                    const isRingOpen = marks[16].y < marks[14].y;
                    const isPinkyOpen = marks[20].y < marks[18].y;
                    let fingerCount = 0;
                    if (isIndexOpen) fingerCount++;
                    if (isMiddleOpen) fingerCount++;
                    if (isRingOpen) fingerCount++;
                    if (isPinkyOpen) fingerCount++;
                    if (fingerCount >= 3 && !isSelfPinch) { totalOpenHands++; }

                    detectedHands.push({ idxX, idxY, isSelfPinch, fingerCount });
                    ctxOverlay.beginPath();
                    ctxOverlay.arc(idxX, idxY, isSelfPinch ? 22 : 12, 0, Math.PI * 2);
                    ctxOverlay.lineWidth = 2;
                    ctxOverlay.strokeStyle = isSelfPinch ? '#ffaa00' : '#00d2ff';
                    ctxOverlay.stroke();
                    
                    if (!isSelfPinch && fingerCount >= 1 && fingerCount <= 3) { currentDetectedFingers = fingerCount; }
                }

                const anyHandPinching = detectedHands.some(h => h.isSelfPinch);
                if (totalOpenHands > 0 && !anyHandPinching) {
                    if (openHandStartTime === null) {
                        openHandStartTime = Date.now();
                        wipeGauge.style.display = 'block';
                    } else {
                        const elapsed = Date.now() - openHandStartTime;
                        const progress = Math.min(100, (elapsed / 3000) * 100);
                        wipeBar.style.width = `${progress}%`;
                        if (elapsed >= 3000) { 
                            createdObjects.forEach(obj => scene.remove(obj));
                            createdObjects = [];
                            latestMesh = null;
                            scaleText.innerText = `Object Count: 0`;
                            openHandStartTime = null;
                            wipeGauge.style.display = 'none';
                            ctxOverlay.fillStyle = 'rgba(239, 68, 68, 0.25)';
                            ctxOverlay.fillRect(0, 0, width, height);
                        }
                    }
                } else {
                    openHandStartTime = null;
                    wipeGauge.style.display = 'none';
                    wipeBar.style.width = '0%';
                }

                if (detectedHands.length === 1) {
                    const primaryHand = detectedHands[0];
                    const now = Date.now();

                    if (primaryHand.isSelfPinch && !lastPinchState) {
                        if (now - lastPinchTime < 350) { 
                            createCentralHologram(primaryHand.idxX, primaryHand.idxY);
                            ctxOverlay.beginPath();
                            ctxOverlay.arc(primaryHand.idxX, primaryHand.idxY, 50, 0, Math.PI * 2);
                            ctxOverlay.lineWidth = 4;
                            ctxOverlay.strokeStyle = '#00ffff';
                            ctxOverlay.stroke();
                            lastPinchTime = 0;
                        } else { lastPinchTime = now; }
                    }
                    lastPinchState = primaryHand.isSelfPinch;
                    if (primaryHand.isSelfPinch) {
                        pendingShapeMode = null;
                        shapeSelectStartTime = null;
                        selectBar.style.width = '0%';
                        if (latestMesh) {
                            const currentX = primaryHand.idxX;
                            if (baseSingleHandX === null) {
                                baseSingleHandX = currentX;
                                baseMeshScale = latestMesh.scale.x;
                            } else {
                                const deltaX = currentX - baseSingleHandX;
                                const computedScale = baseMeshScale + (deltaX * 0.008);
                                const finalScale = Math.max(0.2, Math.min(5.0, computedScale));
                                latestMesh.scale.set(finalScale, finalScale, finalScale);
                            }
                        }
                    } 
                    else {
                        baseSingleHandX = null;
                        if (currentDetectedFingers !== null) {
                            let targetMode = 'CUBE';
                            if (currentDetectedFingers === 1) targetMode = 'CUBE';
                            else if (currentDetectedFingers === 2) targetMode = 'SPHERE';
                            else if (currentDetectedFingers === 3) targetMode = 'TORUS';

                            if (pendingShapeMode !== targetMode) {
                                pendingShapeMode = targetMode;
                                shapeSelectStartTime = now;
                            } else {
                                const selectElapsed = now - shapeSelectStartTime;
                                const selectProgress = Math.min(100, (selectElapsed / 1000) * 100);
                                selectBar.style.width = `${selectProgress}%`;
                                if (selectElapsed >= 1000) { 
                                    currentShapeMode = pendingShapeMode;
                                    if (currentShapeMode === 'CUBE') { shapeText.innerText = 'CUBE'; shapeText.style.color = '#00d2ff'; }
                                    else if (currentShapeMode === 'SPHERE') { shapeText.innerText = 'SPHERE'; shapeText.style.color = '#a855f7'; }
                                    else if (currentShapeMode === 'TORUS') { shapeText.innerText = 'TORUS (DONUT)'; shapeText.style.color = '#00ffaa'; }
                                    shapeSelectStartTime = null;
                                    selectBar.style.width = '0%';
                                }
                            }
                        } else {
                            pendingShapeMode = null;
                            shapeSelectStartTime = null;
                            selectBar.style.width = '0%';
                        }
                    }
                } 
                else if (detectedHands.length === 2) {
                    lastPinchState = false;
                    baseSingleHandX = null;
                    pendingShapeMode = null;
                    shapeSelectStartTime = null;
                    selectBar.style.width = '0%';
                }
            } else {
                lastPinchState = false;
                openHandStartTime = null;
                shapeSelectStartTime = null;
                wipeGauge.style.display = 'none';
                selectBar.style.width = '0%';
            }
        });

        activeCamera = new Camera(video, { onFrame: async () => { await hands.send({ image: video }); }, width: 640, height: 480 });
        activeCamera.start(); loopJARVIS();
    }

    // ✋ [Lab 05] 사용자 입력 동적 텍스트 공간 (Vector Stretch 방식)
    else if (type === 'dynamic_text') {
        container.innerHTML = `
            <div id="loadingText" style="position:absolute; color:#00ffaa; font-family:sans-serif; font-size:0.9rem; font-weight:bold; z-index:10; text-shadow:0 0 10px #00ffaa;">INITIALIZING DYNAMIC TEXT SPACE...</div>
            
            <div style="position:absolute; top:20px; right:20px; z-index:20; display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; padding:10px;">
                <input type="text" id="shortTextInput" value="짧은문구" placeholder="짧은 문구 (280px 미만)" style="background:rgba(6,12,28,0.85); border:1px solid rgba(0,255,170,0.4); color:#fff; padding:10px 15px; border-radius:8px; font-weight:bold; outline:none; width:160px; font-family:sans-serif;">
                <input type="text" id="longTextInput" value="가로로 길게 늘어나는 긴 문구" placeholder="긴 문구 (280px 이상)" style="background:rgba(6,12,28,0.85); border:1px solid rgba(0,210,255,0.4); color:#fff; padding:10px 15px; border-radius:8px; font-weight:bold; outline:none; width:260px; font-family:sans-serif;">
            </div>

            <video id="labWebcam" autoplay playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:1 !important; transform: scaleX(-1); z-index:2; pointer-events:none;"></video>
            <canvas id="dynamicTextCanvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:5; background:transparent;"></canvas>
        `;
        injectHelpButton(container, spec.guide);

        const canvas = document.getElementById('dynamicTextCanvas'); 
        const ctx = canvas.getContext('2d');
        const video = document.getElementById('labWebcam');
        const loadingText = document.getElementById('loadingText');
        const shortInput = document.getElementById('shortTextInput');
        const longInput = document.getElementById('longTextInput');

        canvas.width = container.clientWidth; canvas.height = container.clientHeight;

        let currentPoints = [];

        function drawFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(2, 2, 5, 0.5)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (currentPoints.length === 4) {
                const minX = Math.min(...currentPoints.map(p => p.x));
                const maxX = Math.max(...currentPoints.map(p => p.x));
                const minY = Math.min(...currentPoints.map(p => p.y));
                const maxY = Math.max(...currentPoints.map(p => p.y));

                const rectWidth = Math.max(1, maxX - minX);
                const rectHeight = Math.max(1, maxY - minY);

                // 직사각형 가이드 박스 렌더링
                ctx.strokeStyle = '#00ffaa';
                ctx.lineWidth = 3;
                ctx.strokeRect(minX, minY, rectWidth, rectHeight);
                ctx.fillStyle = 'rgba(0, 255, 170, 0.05)';
                ctx.fillRect(minX, minY, rectWidth, rectHeight);

                // 가로폭 280px 기준 텍스트 분기
                let text = rectWidth < 280 ? (shortInput.value || "SHORT") : (longInput.value || "LONG TEXT");
                
                // Vector Stretch 방식의 텍스트 렌더링 (공간에 100% 꽉 차도록 비율 왜곡)
                ctx.save();
                
                // 1. 기준점이 될 직사각형의 한가운데로 이동
                const centerX = minX + rectWidth / 2;
                const centerY = minY + rectHeight / 2;
                ctx.translate(centerX, centerY);
                
                // 2. 가상의 아주 큰 폰트 사이즈 기준으로 텍스트 측정
                const baseFontSize = 100;
                ctx.font = `900 ${baseFontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const metrics = ctx.measureText(text);
                const textWidth = metrics.width || 1;
                // 브라우저에 따라 actualBoundingBox 값을 지원하지 않을 수 있으므로 Fallback 로직 추가
                const actualHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
                const textHeight = actualHeight && actualHeight > 0 ? actualHeight : (baseFontSize * 0.8);
                
                // 3. 직사각형의 가로/세로 길이에 맞추어 x축과 y축의 확대/축소(스케일) 비율을 개별 계산
                const scaleX = rectWidth / textWidth;
                const scaleY = rectHeight / textHeight;
                
                // 4. 컨텍스트 자체를 왜곡하여 글씨를 렌더링
                ctx.scale(scaleX, scaleY);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(text, 0, 0); 
                
                ctx.restore();

                // 양손 4개 좌표 시각화 포인트 렌더링
                currentPoints.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                    ctx.fillStyle = '#00ffaa';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                });
            }

            activeAnimationId = requestAnimationFrame(drawFrame);
        }

        const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        hands.onResults((results) => {
            if (loadingText) loadingText.style.display = 'none';
            
            let points = [];

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                    const landmarks = results.multiHandLandmarks[i];
                    
                    const tX = (1 - landmarks[4].x) * canvas.width;
                    const tY = landmarks[4].y * canvas.height;
                    const iX = (1 - landmarks[8].x) * canvas.width;
                    const iY = landmarks[8].y * canvas.height;

                    points.push({ x: tX, y: tY });
                    points.push({ x: iX, y: iY });
                }
            }

            currentPoints = points;
        });

        activeCamera = new Camera(video, { onFrame: async () => { await hands.send({ image: video }); }, width: 640, height: 480 });
        activeCamera.start();
        drawFrame();
    }
}

window.addEventListener('resize', () => {
    stars.forEach(star => {
        star.x = (parseFloat(star.el.style.left) / 100) * window.innerWidth;
        star.y = (parseFloat(star.el.style.top) / 100) * window.innerHeight;
    });
});
initStars();
