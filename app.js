const topicInput = document.getElementById('topicInput');
const flashcardText = document.getElementById('flashcardText');
const addFlashcardBtn = document.getElementById('addFlashcardBtn');
const flashcardsContainer = document.getElementById('flashcardsContainer');
const currentTopic = document.getElementById('currentTopic');
const generateLinkBtn = document.getElementById('generateLinkBtn');
const shareLink = document.getElementById('shareLink');

let flashcards = [];
let topic = '';

function renderFlashcards() {
  flashcardsContainer.innerHTML = '';
  flashcards.forEach(({ question, answer }, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'flashcard';
    cardDiv.innerHTML = `
      <div class="flashcard-question">${index + 1}. Q: ${question}</div>
      <div class="flashcard-answer">A: ${answer}</div>
    `;
    flashcardsContainer.appendChild(cardDiv);
  });
}

function parseFlashcardText(text) {
  const parts = text.split(' - ');
  if (parts.length === 2) {
    return { question: parts[0].trim(), answer: parts[1].trim() };
  }
  return null;
}

addFlashcardBtn.onclick = () => {
  if (!topicInput.value.trim()) {
    alert('Please enter a topic name.');
    return;
  }
  const flashcard = parseFlashcardText(flashcardText.value);
  if (!flashcard) {
    alert('Please enter flashcard text in "Question - Answer" format.');
    return;
  }
  topic = topicInput.value.trim();
  currentTopic.textContent = topic;

  flashcards.push(flashcard);
  renderFlashcards();

  flashcardText.value = '';
};

generateLinkBtn.onclick = () => {
  if (!topic) {
    alert('Add at least one flashcard and enter a topic first.');
    return;
  }
  // Prepare data to encode in URL
  const data = { topic, flashcards };
  const encoded = encodeURIComponent(JSON.stringify(data));
  const url = `${window.location.origin}${window.location.pathname}#data=${encoded}`;
  shareLink.value = url;
};

// On page load, check if URL has data to load flashcards
window.onload = () => {
  const hash = window.location.hash;
  if (hash.startsWith('#data=')) {
    try {
      const encoded = hash.slice(6);
      const data = JSON.parse(decodeURIComponent(encoded));
      topic = data.topic;
      flashcards = data.flashcards || [];
      topicInput.value = topic;
      currentTopic.textContent = topic;
      renderFlashcards();
    } catch (e) {
      console.error('Failed to load flashcards from URL', e);
    }
  }
};
