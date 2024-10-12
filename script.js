// 파티클 설정
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// 파티클 생성자
function Particle(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.angle = Math.random() * 360; 
}

Particle.prototype.update = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size *= 0.97;
};

Particle.prototype.draw = function() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size / 10;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(this.angle) * 10, this.y + Math.sin(this.angle) * 10);
    ctx.stroke();
};

// 파티클 생성 함수
function createParticles(x, y) {
    const numberOfParticles = 50;
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 5 + 1;
        const color = `rgba(255, 255, 255, 0.8)`;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = -Math.random() * 3 - 1;
        particles.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

// 파티클 업데이트 및 그리기
function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size < 0.5) {
            particles.splice(i, 1);
            i--;
        }
    }
}

// 애니메이션 루프
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();  // 애니메이션 시작

// 공유 기능 구현 (웹과 안드로이드 네이티브 앱)
const shareButton = document.getElementById('shareButton');

// 공유 데이터 설정
const shareData = {
    title: 'Can-Do 리스트',
    text: '캔두 리스트를 공유해보세요!',
    url: window.location.href  // 현재 페이지의 URL
};

// 공유 버튼 클릭 시 동작
shareButton.addEventListener('click', () => {
    // 네이티브 공유 기능이 있는 경우 (iOS 및 Android 모바일 브라우저)
    if (navigator.share) {
        navigator.share(shareData).catch((error) => console.log('Error sharing:', error));
    } 
    // 안드로이드 네이티브 환경에서 Intent 사용
    else if (window.Android) {
        window.Android.shareContent(shareData.text, shareData.url);
    } 
    // 공유 기능을 지원하지 않는 경우 (링크 복사 기능 제공)
    else {
        copyToClipboard();
        alert('공유 기능을 사용할 수 없습니다. 링크가 클립보드에 복사되었습니다.');
    }
});

// 링크 복사 기능
function copyToClipboard() {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;  // 현재 웹페이지의 URL을 복사
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}

// 캔 클릭 시 발생하는 동작
function openCan() {
    const canSound = document.getElementById('canSound');
    canSound.play();

    const quotes = [
        "하루 긍정 일기 쓰기",
        "새로운 기술 학습",
        "1일 1책 읽기",
        "감사 노트 작성",
        "릴스 금지(캔두 제외!)",
        "새로운 장소에서 혼자 식사하기",
        "하루 계획 세우고 실천하기",
        "새로운 운동 도전하기",
        "영어뉴스 번역해보기",
        "10명에게 미소와 인사 건네기"
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteText = quotes[randomIndex];

    const quoteDiv = document.getElementById('quote');
    quoteDiv.innerText = quoteText;

    quoteDiv.classList.remove('quote');
    void quoteDiv.offsetWidth;
    quoteDiv.classList.add('quote');

    const quoteRect = quoteDiv.getBoundingClientRect();
    const centerX = quoteRect.left + quoteRect.width / 2;
    const belowQuoteY = quoteRect.bottom;
    createParticles(centerX, belowQuoteY);
}
