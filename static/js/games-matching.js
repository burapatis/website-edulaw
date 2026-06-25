/* เกมจับคู่คำศัพท์กฎหมายการศึกษา — plain JS, ไม่มี dependency ภายนอก
   ไม่เก็บข้อมูลส่วนบุคคล ไม่ส่ง analytics ไม่ใช้ localStorage */
(function () {
  'use strict';

  var root = document.getElementById('matchingGame');
  var dataEl = document.getElementById('matchingData');
  if (!root || !dataEl) return;

  var items;
  try {
    items = JSON.parse(dataEl.textContent || '[]');
  } catch (err) {
    return;
  }
  if (!Array.isArray(items) || !items.length) return;

  var board = document.getElementById('gameBoard');
  var progressEl = document.getElementById('gameProgress');
  var feedbackEl = document.getElementById('gameFeedback');
  var completeEl = document.getElementById('gameComplete');
  var noscriptEl = document.getElementById('gameNoscript');
  var restartBtn = document.getElementById('gameRestart');
  var restartBtn2 = document.getElementById('gameRestart2');

  var totalPairs = items.length;
  var flipDelay = parseInt(root.getAttribute('data-flip-delay'), 10);
  if (isNaN(flipDelay)) flipDelay = 1000;

  var firstCard = null;
  var locked = false;
  var matchedCount = 0;

  if (noscriptEl) noscriptEl.hidden = true;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function buildDeck() {
    var deck = [];
    items.forEach(function (it) {
      deck.push({ pairId: it.id, role: 'term', text: it.term, item: it });
      deck.push({ pairId: it.id, role: 'match', text: it.match, item: it });
    });
    return shuffle(deck);
  }

  function setProgress() {
    if (progressEl) {
      progressEl.textContent = 'จับคู่แล้ว ' + matchedCount + ' จาก ' + totalPairs + ' คู่';
    }
  }

  function clearFeedback() {
    if (feedbackEl) feedbackEl.textContent = '';
  }

  function roleLabel(role) {
    return role === 'term' ? 'คำสำคัญ' : 'ความหมาย';
  }

  function showMatchFeedback(item) {
    if (!feedbackEl) return;
    feedbackEl.textContent = '';
    var wrap = document.createElement('div');
    wrap.className = 'game-feedback__ok';

    var head = document.createElement('p');
    head.className = 'game-feedback__title';
    head.textContent = '\u2713 จับคู่ถูก: ' + item.term;
    wrap.appendChild(head);

    if (item.explanation) {
      var exp = document.createElement('p');
      exp.className = 'game-feedback__body';
      exp.textContent = item.explanation;
      wrap.appendChild(exp);
    }

    if (item.relatedUrl && item.relatedLabel) {
      var link = document.createElement('a');
      link.className = 'game-feedback__link';
      link.href = item.relatedUrl;
      link.textContent = item.relatedLabel + ' \u2192';
      wrap.appendChild(link);
    }

    feedbackEl.appendChild(wrap);
  }

  function showMismatchFeedback() {
    if (!feedbackEl) return;
    feedbackEl.textContent = 'ยังไม่ตรงกัน ลองใหม่อีกครั้ง';
  }

  function showComplete() {
    if (completeEl) completeEl.hidden = false;
    if (feedbackEl) feedbackEl.textContent = 'ยอดเยี่ยม! คุณจับคู่ครบทุกคู่แล้ว';
  }

  function makeCard(card) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'game-card';
    btn.setAttribute('data-pair', card.pairId);
    btn.setAttribute('data-role', card.role);
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'การ์ดที่ยังไม่เปิด');

    var inner = document.createElement('span');
    inner.className = 'game-card__face';
    inner.setAttribute('aria-hidden', 'true');
    inner.textContent = '?';
    btn.appendChild(inner);

    btn.addEventListener('click', function () {
      onCardClick(btn, card, inner);
    });

    return btn;
  }

  function revealCard(btn, card, inner) {
    btn.classList.add('is-flipped');
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', roleLabel(card.role) + ': ' + card.text);
    inner.textContent = card.text;
    btn.classList.toggle('game-card--term', card.role === 'term');
    btn.classList.toggle('game-card--match', card.role === 'match');
  }

  function hideCard(btn, card, inner) {
    btn.classList.remove('is-flipped', 'game-card--term', 'game-card--match');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'การ์ดที่ยังไม่เปิด');
    inner.textContent = '?';
  }

  function lockMatched(btn) {
    btn.classList.add('is-matched');
    btn.disabled = true;
    var current = btn.getAttribute('aria-label');
    btn.setAttribute('aria-label', current + ' (จับคู่แล้ว)');
  }

  function onCardClick(btn, card, inner) {
    if (locked) return;
    if (btn.classList.contains('is-flipped') || btn.classList.contains('is-matched')) return;

    clearFeedback();
    revealCard(btn, card, inner);

    if (!firstCard) {
      firstCard = { btn: btn, card: card, inner: inner };
      return;
    }

    if (firstCard.btn === btn) return;

    var isMatch =
      firstCard.card.pairId === card.pairId && firstCard.card.role !== card.role;

    if (isMatch) {
      lockMatched(firstCard.btn);
      lockMatched(btn);
      matchedCount += 1;
      setProgress();
      showMatchFeedback(card.item);
      firstCard = null;
      if (matchedCount === totalPairs) showComplete();
    } else {
      locked = true;
      showMismatchFeedback();
      var prev = firstCard;
      firstCard = null;
      window.setTimeout(function () {
        hideCard(prev.btn, prev.card, prev.inner);
        hideCard(btn, card, inner);
        locked = false;
      }, flipDelay);
    }
  }

  function render() {
    firstCard = null;
    locked = false;
    matchedCount = 0;
    if (completeEl) completeEl.hidden = true;
    clearFeedback();
    setProgress();

    board.innerHTML = '';
    var deck = buildDeck();
    deck.forEach(function (card) {
      board.appendChild(makeCard(card));
    });
  }

  if (restartBtn) restartBtn.addEventListener('click', render);
  if (restartBtn2) {
    restartBtn2.addEventListener('click', function () {
      render();
      if (board.firstChild && typeof board.firstChild.focus === 'function') {
        board.firstChild.focus();
      }
    });
  }

  render();
})();
