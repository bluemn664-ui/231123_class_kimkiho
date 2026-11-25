// Header 메뉴와 "메뉴 보기 →" 링크를 누르면
// 해당 Section으로 부드럽게 이동합니다.

const links = document.querySelectorAll('a[href^="#"]');

links.forEach(function (link) {
  link.addEventListener('click', function (event) {
    const target = document.querySelector(link.getAttribute('href'));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
