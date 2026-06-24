/* แบบทดสอบความรู้กฎหมายการศึกษา — โต้ตอบ */
(function () {
  'use strict';

  const app = document.getElementById('quizApp');
  if (!app || typeof QUIZ_SETS === 'undefined') return;

  const lawsUrl = app.dataset.lawsUrl || '/laws/';
  let currentSetKey = 'mixed';

  let quiz = { questions: [], idx: 0, score: 0, answered: [], setTitle: '' };

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function buildCatGrid() {
    const grid = document.getElementById('quizCatGrid');
    const sets = [
      ...QUIZ_SETS,
      {
        key: 'mixed',
        title: 'แบบทดสอบรวมทุกหมวด',
        level: 'สุ่ม 20 ข้อ',
        desc: 'สุ่มคำถามจากทุกหมวดมารวมกัน เหมาะสำหรับประเมินความเข้าใจโดยรวม',
        questions: Array(20),
      },
    ];

    const colorClass = {
      constitution: 'quiz-cat-card--constitution',
      national: 'quiz-cat-card--national',
      personnel: 'quiz-cat-card--personnel',
      'admin-higher': 'quiz-cat-card--admin',
      'child-institution': 'quiz-cat-card--child',
      mixed: 'quiz-cat-card--mixed',
    };

    grid.innerHTML = sets.map((s) => `
      <button type="button" class="quiz-cat-card ${colorClass[s.key] || ''}" data-key="${s.key}">
        <span class="level">${s.level}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <span class="qmeta">${s.questions.length} ข้อ</span>
      </button>`).join('');

    grid.querySelectorAll('.quiz-cat-card').forEach((btn) => {
      btn.addEventListener('click', () => startQuiz(btn.dataset.key));
    });
  }

  function startQuiz(key) {
    currentSetKey = key;
    let qs;
    let title;

    if (key === 'mixed') {
      qs = shuffle(getAllQuestions()).slice(0, 20);
      title = 'แบบทดสอบรวมทุกหมวด';
    } else {
      const set = getQuizSet(key);
      if (!set) return;
      qs = set.questions.map((q) => ({ ...q, setTitle: set.title }));
      title = set.title;
    }

    quiz = { questions: qs, idx: 0, score: 0, answered: [], setTitle: title };
    showStage('stageQuiz');
    renderQuestion();
  }

  function showStage(id) {
    document.querySelectorAll('.quiz-stage').forEach((s) => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const hero = document.querySelector('.page-hero');
    if (hero) {
      window.scrollTo({ top: hero.offsetHeight, behavior: 'smooth' });
    }
  }

  function renderQuestion() {
    const q = quiz.questions[quiz.idx];
    document.getElementById('qProgressText').textContent =
      `ข้อ ${quiz.idx + 1} / ${quiz.questions.length} · ${quiz.setTitle}`;
    document.getElementById('progressFill').style.width =
      `${(quiz.idx / quiz.questions.length) * 100}%`;
    document.getElementById('scorePill').textContent =
      `คะแนน ${quiz.score}/${quiz.questions.length}`;
    document.getElementById('qText').textContent = q.q;

    const letters = ['ก', 'ข', 'ค', 'ง'];
    document.getElementById('qOptions').innerHTML = q.options.map((opt, i) => `
      <button type="button" class="q-option" data-i="${i}">
        <span class="opt-letter">${letters[i]}</span><span>${opt}</span>
      </button>`).join('');

    const explain = document.getElementById('qExplain');
    explain.classList.remove('show');
    explain.textContent = '';

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = true;
    nextBtn.textContent =
      quiz.idx === quiz.questions.length - 1 ? 'ดูผลคะแนน' : 'ข้อต่อไป';

    document.querySelectorAll('.q-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const chosen = parseInt(btn.dataset.i, 10);
        const correct = q.correct;

        document.querySelectorAll('.q-option').forEach((b) => { b.disabled = true; });

        if (chosen === correct) {
          btn.classList.add('correct');
          quiz.score++;
        } else {
          btn.classList.add('incorrect');
          document.querySelector(`.q-option[data-i="${correct}"]`).classList.add('correct');
        }

        quiz.answered[quiz.idx] = chosen;
        explain.innerHTML = `<strong>${chosen === correct ? 'ถูกต้อง! ' : 'ยังไม่ถูกต้อง — '}</strong>${q.explain}`;
        explain.classList.add('show');
        document.getElementById('scorePill').textContent =
          `คะแนน ${quiz.score}/${quiz.questions.length}`;
        nextBtn.disabled = false;
      });
    });
  }

  function nextQuestion() {
    if (quiz.idx < quiz.questions.length - 1) {
      quiz.idx++;
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    showStage('stageResult');
    const total = quiz.questions.length;
    const pct = Math.round((quiz.score / total) * 100);
    let grade = 'ควรทบทวนเพิ่มเติม';
    if (pct >= 90) grade = 'ดีเยี่ยม — รอบรู้กฎหมายการศึกษา!';
    else if (pct >= 75) grade = 'ดีมาก';
    else if (pct >= 60) grade = 'ดี';
    else if (pct >= 40) grade = 'พอใช้';

    document.getElementById('gradeBadge').textContent = grade;
    document.getElementById('scoreBig').textContent = `${quiz.score} / ${total}`;
    document.getElementById('scoreLabel').textContent =
      `คุณตอบถูก ${pct}% ในหมวด “${quiz.setTitle}”`;

    document.getElementById('reviewList').innerHTML = quiz.questions.map((q, i) => {
      const right = quiz.answered[i] === q.correct;
      return `<div class="review-item ${right ? 'right' : 'wrong'}">
        <strong>ข้อ ${i + 1}:</strong> ${q.q}<br>
        <span style="color:var(--ink-soft);">เฉลย: ${q.options[q.correct]}</span>
        ${!right ? `<br><span style="color:var(--danger);">คำตอบของคุณ: ${q.options[quiz.answered[i]] ?? '— ไม่ได้ตอบ —'}</span>` : ''}
      </div>`;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildCatGrid();
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('retryBtn').addEventListener('click', () => startQuiz(currentSetKey));
    document.getElementById('backCatBtn').addEventListener('click', () => showStage('stageSelect'));
    const reviewLawsBtn = document.getElementById('reviewLawsBtn');
    if (reviewLawsBtn) reviewLawsBtn.href = lawsUrl;
  });
})();
