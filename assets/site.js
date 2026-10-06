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
  const gradeVal = grade ? grade.value : '';
  const subjectVal = subject ? subject.value : '';
  const messageVal = message && message.value.trim() ? message.value.trim() : '(없음)';
  const summary =
    '[탄탄과외 무료 진단 신청]\n' +
    '학생 이름: ' + name.value.trim() + '\n' +
    '연락처: ' + phone.value.trim() + '\n' +
    (grade ? '학년: ' + gradeVal + '\n' : '') +
    (subject ? '희망 과목: ' + subjectVal + '\n' : '') +
    '남기신 말씀: ' + messageVal;

  if(window.emailjs){
    emailjs.send('service_ldp43b2', 'template_wnwb8ba', {
      student_name: name.value.trim(),
      phone: phone.value.trim(),
      grade: gradeVal,
      subject: subjectVal,
      message: messageVal
    }).catch(function(err){ console.error('EmailJS send failed:', err); });
  }

  fetch('https://script.google.com/macros/s/AKfycbwOqTTLkqZ_frFyT6N0QcjYZT3jsG0puhq9wRmrQSPxhFgn0fXET3AoGVj4PiHMNHcg/exec', {
    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ site: '탄탄과외', name: name.value.trim(), phone: phone.value.trim(), grade: gradeVal, subject: subjectVal, message: messageVal })
  }).catch(function(err){ console.error('구글시트 전송 실패:', err); });

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

let helpSelectedSubject = '';
let helpSelectedGrade = '';

function openHelpModal(){
  const overlay = document.getElementById('helpModalOverlay');
  if(!overlay) return;
  overlay.classList.add('open');
  backToHelpStep1();
}

if(document.getElementById('helpModalOverlay')){
  openHelpModal();
}

function closeHelpModal(){
  const overlay = document.getElementById('helpModalOverlay');
  if(overlay) overlay.classList.remove('open');
}

function backToHelpStep1(){
  const step1 = document.getElementById('helpStep1');
  const step2 = document.getElementById('helpStep2');
  const step3 = document.getElementById('helpStep3');
  if(step1) step1.style.display = '';
  if(step2) step2.style.display = 'none';
  if(step3) step3.style.display = 'none';
  helpSelectedGrade = '';
  document.querySelectorAll('.help-pill').forEach(function(p){ p.classList.remove('selected'); });
}

function pickHelpSubject(subjectVal, subjectLabel, tagline){
  helpSelectedSubject = subjectVal;
  const step1 = document.getElementById('helpStep1');
  const step2 = document.getElementById('helpStep2');
  const step3 = document.getElementById('helpStep3');
  if(step1) step1.style.display = 'none';
  if(step2) step2.style.display = '';
  if(step3) step3.style.display = 'none';
  const title = document.getElementById('helpStep2Title');
  const taglineEl = document.getElementById('helpStep2Tagline');
  if(title) title.textContent = subjectLabel;
  if(taglineEl) taglineEl.textContent = tagline;
}

document.querySelectorAll('.help-pill').forEach(function(pill){
  pill.addEventListener('click', function(){
    document.querySelectorAll('.help-pill').forEach(function(p){ p.classList.remove('selected'); });
    pill.classList.add('selected');
    helpSelectedGrade = pill.getAttribute('data-grade');
  });
});

function submitHelpForm(){
  const name = document.getElementById('hName');
  const phone = document.getElementById('hPhone');
  const school = document.getElementById('hSchool');
  const address = document.getElementById('hAddress');
  const message = document.getElementById('hMessage');
  if(!name.value.trim() || !phone.value.trim() || !school.value.trim() || !address.value.trim()){
    alert('이름, 연락처, 학교, 주소를 입력해주세요.');
    return;
  }
  if(!helpSelectedGrade){
    alert('학년을 선택해주세요.');
    return;
  }
  const messageVal = (message.value.trim() ? message.value.trim() + '\n' : '') +
    '학교: ' + school.value.trim() + '\n' +
    '주소: ' + address.value.trim();

  if(window.emailjs){
    emailjs.send('service_ldp43b2', 'template_wnwb8ba', {
      student_name: name.value.trim(),
      phone: phone.value.trim(),
      grade: helpSelectedGrade,
      subject: helpSelectedSubject,
      message: '[탄탄과외] ' + messageVal
    }).catch(function(err){ console.error('EmailJS send failed:', err); });
  }

  fetch('https://script.google.com/macros/s/AKfycbwOqTTLkqZ_frFyT6N0QcjYZT3jsG0puhq9wRmrQSPxhFgn0fXET3AoGVj4PiHMNHcg/exec', {
    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ site: '탄탄과외', name: name.value.trim(), phone: phone.value.trim(), grade: helpSelectedGrade, subject: helpSelectedSubject, message: messageVal })
  }).catch(function(err){ console.error('구글시트 전송 실패:', err); });

  const step2 = document.getElementById('helpStep2');
  const step3 = document.getElementById('helpStep3');
  if(step2) step2.style.display = 'none';
  if(step3) step3.style.display = '';
}
