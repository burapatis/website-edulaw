/**
 * แบบทดสอบความรู้กฎหมายการศึกษา — Learning Quiz (static, no tracking)
 * ข้อมูลจาก data/quizzes.yaml ผ่าน #quizData ในเทมเพลต Hugo
 */
(function () {
  'use strict';

  const app = document.getElementById('quizApp');
  const dataEl = document.getElementById('quizData');
  if (!app || !dataEl) return;

  let catalog;
  try {
    let raw = JSON.parse(dataEl.textContent.trim());
    while (typeof raw === 'string') raw = JSON.parse(raw);
    catalog = raw;
  } catch (e) {
    console.error('quiz: invalid quizData JSON', e);
    return;
  }

  const categories = catalog.categories || [];
  const allQuestions = catalog.questions || [];
  const lawsBase = (app.dataset.lawsBase || '/laws/').replace(/\/?$/, '/');

  const LABELS = {
    correct: 'ถูกต้อง',
    incorrect: 'ยังไม่ถูกต้อง',
    yourAnswer: 'คำตอบของคุณ',
    readMore: 'อ่านต่อ',
    totalScore: 'คะแนนรวม',
    question: 'ข้อที่',
    noMatch: 'ไม่พบข้อสอบที่ตรงกับตัวกรอง',
    mixedTitle: 'แบบทดสอบรวมทุกหมวด',
    mixedDesc: 'สุ่มคำถามจากทุกหมวดมารวมกัน เหมาะสำหรับประเมินความเข้าใจโดยรวม',
  };

  const colorClass = {
    constitution: 'quiz-cat-card--constitution',
    national: 'quiz-cat-card--national',
    personnel: 'quiz-cat-card--personnel',
    'admin-higher': 'quiz-cat-card--admin',
    'child-institution': 'quiz-cat-card--child',
    mixed: 'quiz-cat-card--mixed',
  };

  let selectedKey = '';
  let currentSetKey = 'mixed';

  const filters = { category: '', audience: '', difficulty: '' };

  let quiz = { questions: [], idx: 0, score: 0, answered: [], setTitle: '' };

  const els = {
    filterCategory: document.getElementById('filterCategory'),
    filterAudience: document.getElementById('filterAudience'),
    filterDifficulty: document.getElementById('filterDifficulty'),
    filterSummary: document.getElementById('filterSummary'),
    filterEmpty: document.getElementById('filterEmpty'),
    catGrid: document.getElementById('quizCatGrid'),
    startBtn: document.getElementById('startQuizBtn'),
    progressText: document.getElementById('qProgressText'),
    progressFill: document.getElementById('progressFill'),
    progressBar: document.getElementById('progressBar'),
    scorePill: document.getElementById('scorePill'),
    qText: document.getElementById('qText'),
    qOptions: document.getElementById('qOptions'),
    qFeedback: document.getElementById('qFeedback'),
    qExplain: document.getElementById('qExplain'),
    qExplainBody: document.getElementById('qExplainBody'),
    qRelated: document.getElementById('qRelated'),
    qRelatedLinks: document.getElementById('qRelatedLinks'),
    nextBtn: document.getElementById('nextBtn'),
    quitQuizBtn: document.getElementById('quitQuizBtn'),
    retryBtn: document.getElementById('retryBtn'),
    backCatBtn: document.getElementById('backCatBtn'),
  };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'th'));
  }

  function catByKey(key) {
    return categories.find((c) => c.key === key);
  }

  function lawUrl(id) {
    return id ? `${lawsBase}${id}/` : lawsBase;
  }

  function enrichQuestion(q) {
    const cat = catByKey(q.category) || {};
    return {
      ...q,
      categoryTitle: cat.title || q.category,
      related_law_url: q.related_law_id ? lawUrl(q.related_law_id) : lawsBase,
      related_law_title: q.related_law_title || cat.related_law_title || '',
    };
  }

  function filterPool(opts) {
    const ignoreCategory = opts && opts.ignoreCategory;
    return allQuestions.filter((q) => {
      const catOk =
        ignoreCategory ||
        !filters.category ||
        filters.category === 'mixed' ||
        q.category === filters.category;
      const audOk = !filters.audience || q.audience === filters.audience;
      const diffOk = !filters.difficulty || q.difficulty === filters.difficulty;
      return catOk && audOk && diffOk;
    });
  }

  function visibleSets() {
    const pool = filterPool();
    const keys = uniqueSorted(pool.map((q) => q.category));
    const sets = categories
      .filter((c) => keys.includes(c.key))
      .map((c) => ({
        ...c,
        questionCount: pool.filter((q) => q.category === c.key).length,
      }));

    if (!filters.category || filters.category === 'mixed') {
      const mixedCount = Math.min(20, pool.length);
      if (mixedCount > 0) {
        sets.push({
          key: 'mixed',
          title: LABELS.mixedTitle,
          description: LABELS.mixedDesc,
          default_difficulty: 'สุ่ม 20 ข้อ',
          questionCount: mixedCount,
        });
      }
    }
    return sets;
  }

  function updateFilterSummary() {
    const pool = filterPool();
    const sets = visibleSets();
    if (els.filterSummary) {
      els.filterSummary.textContent = `พบ ${pool.length} ข้อที่ตรงกับตัวกรอง · เลือกได้ ${sets.length} ชุด`;
    }
    if (els.filterEmpty) {
      const empty = pool.length === 0;
      els.filterEmpty.hidden = !empty;
      if (els.startBtn) els.startBtn.disabled = empty;
    }
  }

  function populateFilters() {
    const audiences = uniqueSorted(allQuestions.map((q) => q.audience));
    const difficulties = uniqueSorted(allQuestions.map((q) => q.difficulty));

    if (els.filterAudience) {
      audiences.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        els.filterAudience.appendChild(opt);
      });
    }
    if (els.filterDifficulty) {
      difficulties.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        els.filterDifficulty.appendChild(opt);
      });
    }
  }

  function buildCatGrid() {
    if (!els.catGrid) return;
    const sets = visibleSets();
    els.catGrid.innerHTML = sets
      .map(
        (s) => `
      <button type="button" class="quiz-cat-card ${colorClass[s.key] || ''}${selectedKey === s.key ? ' is-selected' : ''}"
        data-key="${s.key}" role="listitem" aria-pressed="${selectedKey === s.key}">
        <span class="level">${s.default_difficulty || s.level || ''}</span>
        <h3>${s.title}</h3>
        <p>${s.description || s.desc || ''}</p>
        <span class="qmeta">${s.questionCount} ข้อ</span>
      </button>`
      )
      .join('');

    els.catGrid.querySelectorAll('.quiz-cat-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedKey = btn.dataset.key || '';
        if (els.filterCategory && selectedKey !== 'mixed') {
          els.filterCategory.value = selectedKey;
          filters.category = selectedKey;
        } else if (selectedKey === 'mixed' && els.filterCategory) {
          els.filterCategory.value = 'mixed';
          filters.category = 'mixed';
        }
        buildCatGrid();
        updateFilterSummary();
        if (els.filterEmpty) els.filterEmpty.hidden = true;
        startQuiz(selectedKey);
      });
    });

    if (!selectedKey && sets.length) {
      selectedKey = sets[0].key;
      buildCatGrid();
    }
  }

  function showStartError(msg) {
    if (els.filterEmpty) {
      els.filterEmpty.textContent = msg;
      els.filterEmpty.hidden = false;
    }
  }

  function questionsForSet(key) {
    if (key === 'mixed') {
      const pool = filterPool().map(enrichQuestion);
      return shuffle(pool).slice(0, Math.min(20, pool.length));
    }
    // ชุดหมวดเฉพาะ: ใช้หมวดจากการ์ดที่เลือก แล้วกรองเฉพาะ audience/difficulty
    return filterPool({ ignoreCategory: true })
      .filter((q) => q.category === key)
      .map(enrichQuestion);
  }

  function resolveSelectedKey() {
    const fromFilter = els.filterCategory?.value || '';
    if (fromFilter === 'mixed') return 'mixed';
    if (fromFilter) return fromFilter;
    return selectedKey;
  }

  function startQuiz(key) {
    const useKey = key || resolveSelectedKey();
    if (!useKey) {
      showStartError('กรุณาเลือกชุดแบบทดสอบก่อนเริ่ม');
      return;
    }

    const qs = questionsForSet(useKey);
    if (!qs.length) {
      showStartError('ไม่พบข้อสอบที่ตรงกับตัวกรอง — ลองเปลี่ยนหมวด กลุ่มผู้ใช้ หรือระดับความยาก');
      return;
    }

    if (els.filterEmpty) els.filterEmpty.hidden = true;

    currentSetKey = useKey;
    const cat = catByKey(useKey);
    const title = useKey === 'mixed' ? LABELS.mixedTitle : cat?.title || useKey;

    quiz = {
      questions: qs,
      idx: 0,
      score: 0,
      answered: [],
      setTitle: title,
    };

    showStage('stageQuiz');
    renderQuestion();
  }

  function showStage(id) {
    document.querySelectorAll('.quiz-stage').forEach((s) => s.classList.remove('active'));
    const stage = document.getElementById(id);
    if (stage) stage.classList.add('active');
    const hero = document.querySelector('.page-hero');
    const top = hero ? hero.offsetHeight + 20 : 0;
    window.scrollTo({ top, behavior: 'smooth' });
    if (id === 'stageQuiz') {
      const paper = stage.querySelector('.quiz-paper');
      if (paper) paper.setAttribute('tabindex', '-1');
      paper?.focus({ preventScroll: true });
    }
  }

  function renderQuestion() {
    const q = quiz.questions[quiz.idx];
    const total = quiz.questions.length;
    const pct = Math.round((quiz.idx / total) * 100);

    els.progressText.textContent = `${LABELS.question} ${quiz.idx + 1} / ${total} · ${quiz.setTitle}`;
    els.progressFill.style.width = `${pct}%`;
    if (els.progressBar) {
      els.progressBar.setAttribute('aria-valuenow', String(pct));
    }
    els.scorePill.textContent = `${LABELS.totalScore} ${quiz.score}/${total}`;
    els.qText.textContent = q.question;

    const letters = ['ก', 'ข', 'ค', 'ง'];
    els.qOptions.innerHTML = q.choices
      .map(
        (opt, i) => `
      <button type="button" class="q-option" data-i="${i}">
        <span class="opt-letter" aria-hidden="true">${letters[i]}</span>
        <span>${opt}</span>
      </button>`
      )
      .join('');

    els.qFeedback.textContent = '';
    els.qFeedback.className = 'q-feedback';
    els.qExplain.classList.remove('show');
    els.qExplainBody.textContent = '';
    els.qRelated.hidden = true;
    els.qRelatedLinks.innerHTML = '';

    els.nextBtn.disabled = true;
    els.nextBtn.textContent = quiz.idx === total - 1 ? 'ดูผลคะแนน' : 'ข้อต่อไป';

    els.qOptions.querySelectorAll('.q-option').forEach((btn) => {
      btn.addEventListener('click', () => onAnswer(btn, q));
    });
  }

  function onAnswer(btn, q) {
    if (btn.disabled) return;
    const chosen = parseInt(btn.dataset.i, 10);
    const correct = q.answer;

    els.qOptions.querySelectorAll('.q-option').forEach((b) => {
      b.disabled = true;
    });

    const isRight = chosen === correct;
    if (isRight) {
      btn.classList.add('correct');
      quiz.score += 1;
      els.qFeedback.textContent = `✓ ${LABELS.correct}`;
      els.qFeedback.classList.add('is-correct');
    } else {
      btn.classList.add('incorrect');
      const correctBtn = els.qOptions.querySelector(`.q-option[data-i="${correct}"]`);
      if (correctBtn) correctBtn.classList.add('correct');
      els.qFeedback.textContent = `✗ ${LABELS.incorrect} — ${LABELS.yourAnswer}: ${q.choices[chosen] || '—'}`;
      els.qFeedback.classList.add('is-incorrect');
    }

    quiz.answered[quiz.idx] = chosen;
    els.qExplainBody.textContent = q.explanation || 'ควรตรวจสอบรายละเอียดเพิ่มเติมจากกฎหมายหรือแหล่งข้อมูลทางการที่เกี่ยวข้อง';
    els.qExplain.classList.add('show');

    const links = [];
    if (q.related_law_title && q.related_law_url) {
      links.push(`<a href="${q.related_law_url}">${LABELS.readMore}: ${q.related_law_title}</a>`);
    }
    links.push(`<a href="${lawsBase}">${LABELS.readMore}: คลังกฎหมาย</a>`);
    if (links.length) {
      els.qRelatedLinks.innerHTML = links.join(' · ');
      els.qRelated.hidden = false;
    }

    els.scorePill.textContent = `${LABELS.totalScore} ${quiz.score}/${quiz.questions.length}`;
    els.nextBtn.disabled = false;
  }

  function nextQuestion() {
    if (quiz.idx < quiz.questions.length - 1) {
      quiz.idx += 1;
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

    document.getElementById('reviewList').innerHTML = quiz.questions
      .map((q, i) => {
        const right = quiz.answered[i] === q.answer;
        const lawLink = q.related_law_id
          ? `<a href="${lawUrl(q.related_law_id)}">${LABELS.readMore}</a>`
          : '';
        return `<div class="review-item ${right ? 'right' : 'wrong'}">
        <strong>ข้อ ${i + 1}:</strong> ${q.question}<br>
        <span class="review-answer">เฉลย: ${q.choices[q.answer]}</span>
        ${!right ? `<br><span class="review-wrong">${LABELS.yourAnswer}: ${q.choices[quiz.answered[i]] ?? '— ไม่ได้ตอบ —'}</span>` : ''}
        ${lawLink ? `<br>${lawLink}` : ''}
      </div>`;
      })
      .join('');
  }

  function onFilterChange() {
    filters.category = els.filterCategory?.value || '';
    filters.audience = els.filterAudience?.value || '';
    filters.difficulty = els.filterDifficulty?.value || '';
    selectedKey = filters.category === 'mixed' ? 'mixed' : filters.category || selectedKey;
    buildCatGrid();
    updateFilterSummary();
    if (els.filterEmpty) els.filterEmpty.hidden = true;
  }

  function init() {
    populateFilters();
    buildCatGrid();
    updateFilterSummary();

    els.filterCategory?.addEventListener('change', onFilterChange);
    els.filterAudience?.addEventListener('change', onFilterChange);
    els.filterDifficulty?.addEventListener('change', onFilterChange);
    els.startBtn?.addEventListener('click', () => startQuiz(resolveSelectedKey()));
    els.nextBtn?.addEventListener('click', nextQuestion);
    els.quitQuizBtn?.addEventListener('click', () => showStage('stageSelect'));
    els.retryBtn?.addEventListener('click', () => startQuiz(currentSetKey));
    els.backCatBtn?.addEventListener('click', () => showStage('stageSelect'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
