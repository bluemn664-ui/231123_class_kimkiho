// ===== 결혼식 날짜 설정 =====
const WEDDING_DATE = new Date(2027, 3, 17, 12, 30); // 월은 0부터 시작 (3 = 4월)

// ===== 달력 생성 =====
function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const year = WEDDING_DATE.getFullYear();
  const month = WEDDING_DATE.getMonth();
  const weddingDay = WEDDING_DATE.getDate();

  const firstDow = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const dows = ['일', '월', '화', '수', '목', '금', '토'];

  let html = dows
    .map((d, i) => `<div class="dow ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</div>`)
    .join('');

  for (let i = 0; i < firstDow; i++) html += '<div></div>';

  for (let date = 1; date <= lastDate; date++) {
    const dow = (firstDow + date - 1) % 7;
    const classes = ['day'];
    if (dow === 0) classes.push('sun');
    if (dow === 6) classes.push('sat');
    if (date === weddingDay) classes.push('wedding');
    html += `<div><div class="${classes.join(' ')}">${date}</div></div>`;
  }

  calendar.innerHTML = html;
}

// ===== 카운트다운 =====
function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  const text = document.getElementById('dday-text');

  if (diff <= 0) {
    ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(id => {
      document.getElementById(id).textContent = 0;
    });
    text.innerHTML = '기호 ♥ 미옥의 결혼식이 <em>진행되었습니다</em>';
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = hours;
  document.getElementById('cd-mins').textContent = mins;
  document.getElementById('cd-secs').textContent = secs;
  text.innerHTML = `기호 ♥ 미옥의 결혼식이 <em>${days + 1}일</em> 남았습니다`;
}

// ===== 토스트 메시지 =====
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== 클립보드 복사 =====
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 구형 브라우저 / file:// 환경 대비
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
  showToast('복사되었습니다');
}

document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => copyText(btn.dataset.copy));
});

// ===== 계좌번호 아코디언 =====
document.querySelectorAll('.account-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.parentElement;
    const isOpen = group.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
});

// ===== 갤러리 라이트박스 =====
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let currentIndex = 0;

function showImage(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  // 실제 사진을 쓸 경우 여기서 background-image 를 지정하면 됩니다
  lightboxImg.style.background = getComputedStyle(item).backgroundImage;
  lightboxImg.textContent = currentIndex + 1;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    showImage(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.prev').addEventListener('click', () => showImage(currentIndex - 1));
lightbox.querySelector('.next').addEventListener('click', () => showImage(currentIndex + 1));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  if (e.key === 'ArrowRight') showImage(currentIndex + 1);
});

// ===== 링크 공유 =====
document.getElementById('share-btn').addEventListener('click', async () => {
  const shareData = {
    title: document.title,
    text: '저희 두 사람의 결혼식에 초대합니다.',
    url: location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      /* 사용자가 공유를 취소한 경우 */
    }
  } else {
    copyText(location.href);
  }
});

// ===== 스크롤 등장 애니메이션 =====
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.fade').forEach(el => observer.observe(el));

// ===== 초기 실행 =====
renderCalendar();
updateCountdown();
setInterval(updateCountdown, 1000);
