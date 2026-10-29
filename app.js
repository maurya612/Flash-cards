const $ = id => document.getElementById(id);
let deck = [];
try { deck = JSON.parse(localStorage.getItem('deck') || '[]'); } catch (e) {}

function save() {
  try { localStorage.setItem('deck', JSON.stringify(deck)); } catch (e) {}
  render();
}

function parse(text) {
  const cards = [];
  let q = null, m;
  const lines = text.replace(/\*\*/g, '').split('\n').map(l => l.trim()).filter(Boolean);
  for (const l of lines) {
    if ((m = l.match(/^Q\s*[:.)-]\s*(.+)/i))) { q = m[1]; continue; }
    if (q && (m = l.match(/^A\s*[:.)-]\s*(.+)/i))) { cards.push({ front: q, back: m[1] }); q = null; continue; }
    const sep = l.includes('::') ? '::' : (l.includes('|') ? '|' : null);
    if (sep) {
      const [a, ...b] = l.split(sep);
      const front = a.trim().replace(/^(?:[-*•]|\d+[.)])\s+/, '');
      const back = b.join(sep).trim();
      if (front && back) cards.push({ front, back });
    }
  }
  return cards;
}

function render() {
  $('n').textContent = deck.length;
  $('list').innerHTML = '';
  deck.forEach((c, i) => {
    const d = document.createElement('div');
    d.className = 'item';
    const t = document.createElement('span');
    t.textContent = c.front + ' → ' + c.back;
    const b = document.createElement('button');
    b.textContent = '✕';
    b.onclick = () => { deck.splice(i, 1); save(); };
    d.append(t, b);
    $('list').append(d);
  });
}

$('gen').onclick = () => {
  const cards = parse($('input').value);
  if (!cards.length) { alert('No cards found. Use "Question :: Answer" per line.'); return; }
  deck = deck.concat(cards);
  $('input').value = '';
  save();
};

$('clear').onclick = () => { if (confirm('Clear the whole deck?')) { deck = []; save(); } };

$('dl').onclick = () => {
  const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cards.json';
  a.click();
};

if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
render();