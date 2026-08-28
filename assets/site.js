(function(){
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if(!burgerBtn || !mobileNav) return;
  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    burgerBtn.classList.toggle('active', isOpen);
    burgerBtn.setAttribute('aria-expanded', isOpen);
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
})();

document.querySelectorAll('.faq-q').forEach(q => {
  if(!q.parentElement.classList.contains('faq-item')) return;
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

function submitApplyForm(){
  const name = document.getElementById('fName');
  const phone = document.getElementById('fPhone');
  if(!name || !phone) return;
  if(!name.value.trim() || !phone.value.trim()){
    alert('학생 이름과 연락처를 입력해주세요.');
    return;
  }
  const grade = document.getElementById('fGrade');
  const subject = document.getElementById('fSubject');
  const message = document.getElementById('fMessage');
  const summary =
    '[초등탄탄 무료 진단 신청]\n' +
    '학생 이름: ' + name.value.trim() + '\n' +
    '연락처: ' + phone.value.trim() + '\n' +
    (grade ? '학년: ' + grade.value + '\n' : '') +
    (subject ? '희망 과목: ' + subject.value + '\n' : '') +
    '남기신 말씀: ' + (message && message.value.trim() ? message.value.trim() : '(없음)');

  window.open('https://open.kakao.com/o/sOXeVnpi', '_blank', 'noopener');

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(summary).then(function(){
      alert('신청 내용이 복사되었습니다.\n곧 열리는(또는 열린) 카카오톡 채팅창에 붙여넣기(꾹 눌러서 붙여넣기) 해주세요!');
    }).catch(function(){
      alert('아래 오픈채팅에서 다음 내용으로 신청해주세요:\n\n' + summary);
    });
  } else {
    alert('아래 오픈채팅에서 다음 내용으로 신청해주세요:\n\n' + summary);
  }
}
