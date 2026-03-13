// SMOOTH SCROLL TO HOME
function scrollToHome(event) {
  event.preventDefault();
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// THEME MANAGEMENT
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    const isDark = savedTheme === 'dark';
    applyTheme(isDark);
  } else {
    applyTheme(prefersDark);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches);
    }
  });
}

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    document.getElementById('themeToggle').textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    document.getElementById('themeToggle').textContent = '🌙';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark-theme');
  applyTheme(!isDark);
}

// Initialize theme on page load
initializeTheme();

// SEARCH FUNCTIONALITY
const searchData = [
  { id: 1, title: "Morning Gratitude", desc: "Write 3 things you're grateful for every morning", type: "habit" },
  { id: 2, title: "Move Your Body", desc: "Even a 20-minute walk boosts mood significantly", type: "habit" },
  { id: 3, title: "Mindful Breathing", desc: "5 minutes of deep breathing activates your parasympathetic nervous system", type: "habit" },
  { id: 4, title: "Acts of Kindness", desc: "Doing something kind for others boosts your own happiness", type: "habit" },
  { id: 5, title: "Digital Sunset", desc: "Avoid screens 1 hour before bed for better sleep", type: "habit" },
  { id: 6, title: "Connect Deeply", desc: "Have one real, meaningful conversation daily", type: "habit" },
  { id: 7, title: "Learn Something New", desc: "Curiosity and learning triggers dopamine release", type: "habit" },
  { id: 8, title: "Spend Time in Nature", desc: "Just 20 minutes outdoors reduces stress hormones", type: "habit" },
  { id: 9, title: "Practice Forgiveness", desc: "Holding grudges hurts you more than them", type: "habit" },
  { id: 10, title: "Celebrate Small Wins", desc: "Don't wait for big achievements to feel good", type: "habit" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama", type: "quote" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", type: "quote" },
  { text: "Joy is not in things; it is in us.", author: "Richard Wagner", type: "quote" }
];

function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const resultsContainer = document.getElementById('searchResults');
  
  if (!query) {
    resultsContainer.classList.remove('show');
    return;
  }

  const results = searchData.filter(item => {
    const searchText = item.type === 'quote' 
      ? `${item.text} ${item.author}`.toLowerCase()
      : `${item.title} ${item.desc}`.toLowerCase();
    return searchText.includes(query);
  });

  if (results.length > 0) {
    resultsContainer.innerHTML = results.map(result => {
      if (result.type === 'quote') {
        return `
          <div class="search-result-item">
            <div class="search-result-title">💬 Quote</div>
            <div class="search-result-desc">"${result.text}" — ${result.author}</div>
          </div>
        `;
      } else {
        return `
          <div class="search-result-item" onclick="searchResultClick(${result.id})">
            <div class="search-result-title">🌱 ${result.title}</div>
            <div class="search-result-desc">${result.desc}</div>
          </div>
        `;
      }
    }).join('');
    resultsContainer.classList.add('show');
  } else {
    resultsContainer.innerHTML = '<div class="search-result-item" style="padding: 2rem; text-align: center; color: var(--text-secondary);">No results found for "' + query + '"</div>';
    resultsContainer.classList.add('show');
  }
}

function searchResultClick(habitNum) {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').classList.remove('show');
  openHabitModal(habitNum);
  
  // Scroll to habits section
  const habitsSection = document.getElementById('habits');
  if (habitsSection) {
    habitsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  
  // Show search section on scroll
  let searchSectionTriggered = false;
  window.addEventListener('scroll', function() {
    const searchSection = document.getElementById('searchSection');
    if (window.scrollY > 200 && !searchSectionTriggered) {
      searchSection.style.display = 'block';
      searchSectionTriggered = true;
    }
  });
});

// MOOD CHECKER
const moodPrompts = {
  awful: [
    "💙 It's okay to not be okay. Start with just one deep breath.",
    "💙 You don't have to fix everything today — just this moment.",
    "💙 Consider calling someone you trust right now.",
    "💙 You've survived 100% of your worst days. This one will pass too.",
    "💙 What's one tiny thing that brought you comfort before? Start there."
  ],
  sad: [
    "🌧️ Sadness is valid and temporary. Try stepping outside for 5 minutes.",
    "🌧️ Write down what's on your mind. Sometimes naming it helps lighten the load.",
    "🌧️ Small acts of care for yourself matter most right now.",
    "🌧️ You're allowed to rest. You don't need to be productive right now.",
    "🌧️ Do something that made you smile before — revisit that moment."
  ],
  okay: [
    "😌 'Okay' is underrated! You're stable, and that's a foundation.",
    "😌 Try doing one small thing that makes you smile today — music, a snack, a short walk.",
    "😌 Notice what's working today. Sometimes contentment is the foundation for happiness.",
    "😌 Try one small act of kindness — it might shift your mood upward.",
    "😌 Build on this stable feeling with something gentle."
  ],
  good: [
    "🌟 Great to hear! Amplify it — share your good energy with someone else today.",
    "🌟 Spreading happiness literally increases your own happiness score!",
    "🌟 You're in a good place. Protect this feeling by doing more of what works.",
    "🌟 Tell someone else about something good that happened today.",
    "🌟 Channel this good mood into something you've been putting off."
  ],
  great: [
    "☀️ You're glowing! Use this energy to do something meaningful — help someone.",
    "☀️ Start something creative, or simply soak in the gratitude of feeling great.",
    "☀️ Write down this feeling so you can remember it and recreate it.",
    "☀️ Share this joy with someone who might need it.",
    "☀️ This is the feeling to aim for regularly. What's working right now?"
  ],
  amazing: [
    "🚀 YOU ARE ON FIRE! This is your peak state — use it!",
    "🚀 Write down what's making you feel this way so you can recreate it.",
    "🚀 Go and make someone's day with this amazing energy!",
    "🚀 This momentum is gold. Start that big project, have that conversation.",
    "🚀 Your energy is contagious. Spread it! Help someone, inspire someone!"
  ]
};

function selectMood(el, mood) {
  document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  const resp = document.getElementById('moodResponse');
  const randomPrompt = moodPrompts[mood][Math.floor(Math.random() * moodPrompts[mood].length)];
  resp.textContent = randomPrompt;
  resp.classList.add('show');
}

// QUOTES
const quotes = [
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Joy is not in things; it is in us.", author: "Richard Wagner" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Count your age by friends, not years. Count your life by smiles, not tears.", author: "John Lennon" },
  { text: "The most important thing is to enjoy your life — to be happy — it's all that matters.", author: "Audrey Hepburn" },
  { text: "Folks are usually about as happy as they make their minds up to be.", author: "Abraham Lincoln" },
  { text: "Happiness is a warm puppy.", author: "Charles M. Schulz" },
  { text: "Be happy for this moment. This moment is your life.", author: "Omar Khayyam" },
  { text: "The secret of happiness is freedom. The secret of freedom is courage.", author: "Thucydides" },
  { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You don't need a time machine to visit the past. It's inside you.", author: "Caitlin Doughty" },
  { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Happiness is not a destination, it is a way of life.", author: "Walt Disney" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { text: "The way out is through.", author: "Robert Frost" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The only real voyage of discovery is not seeking new landscapes, but seeing with new eyes.", author: "Marcel Proust" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
  { text: "Happiness is not having what you want. It's wanting what you have.", author: "Unknown" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your energy is priceless. Spend it wisely.", author: "Unknown" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" }
];
let qIdx = 0;
function showQuote() {
  document.getElementById('quoteText').textContent = `"${quotes[qIdx].text}"`;
  document.getElementById('quoteAuthor').textContent = `— ${quotes[qIdx].author}`;
}
function nextQuote() { qIdx = (qIdx + 1) % quotes.length; showQuote(); }
function prevQuote() { qIdx = (qIdx - 1 + quotes.length) % quotes.length; showQuote(); }

// SEARCH BAR TOGGLE
let searchOpen = false;

function toggleSearchBar() {
  searchOpen = !searchOpen;
  const searchSection = document.getElementById('searchSection');
  searchSection.classList.toggle('open', searchOpen);
  if (searchOpen) {
    document.getElementById('searchInput').focus();
  }
}

// Close search bar when clicking outside
document.addEventListener('click', function(e) {
  const searchSection = document.getElementById('searchSection');
  const searchIcon = document.querySelector('.search-icon');
  if (searchOpen && !searchSection.contains(e.target) && !searchIcon.contains(e.target)) {
    searchOpen = false;
    searchSection.classList.remove('open');
  }
});

// CHATBOT
let chatOpen = false;
let chatHistory = [];
let botGreeted = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  const fab = document.getElementById('chatFab');
  win.classList.toggle('open', chatOpen);
  fab.textContent = chatOpen ? '✕' : '💬';
  if (chatOpen && !botGreeted) {
    botGreeted = true;
    setTimeout(() => addBotMessage("Hi there! 😊 I'm Joy, your happiness companion. I'm here to share science-backed happiness tips, listen to how you're feeling, and help you find more joy in your day. What's on your mind?"), 500);
  }
}

function addBotMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg user';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'typing'; div.id = 'typing';
  div.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function showLoad() {
  const lb = document.getElementById('loadBar');
  lb.className = 'loading-bar active';
  setTimeout(() => lb.className = 'loading-bar', 2500);
}

async function callJoyBot(userMsg) {
  chatHistory.push({ role: "user", content: userMsg });

  const systemPrompt = `You are Joy, a warm, knowledgeable, and uplifting happiness chatbot built for a student happiness project. You specialize in the science and psychology of happiness.

Your personality: warm, empathetic, encouraging, a little playful. Use emojis occasionally but not excessively.

You can talk about:
- The science and psychology of happiness (positive psychology, Harvard studies, etc.)
- Practical daily happiness habits and tips
- Emotional support and validation
- Gratitude, mindfulness, meditation, exercise
- Social connections and relationships
- Meaning and purpose (Ikigai, flow state)
- Famous happiness researchers like Martin Seligman, Mihaly Csikszentmihalyi
- Indian context of happiness (yoga, Ayurveda, community values)

Keep responses concise — 2-4 sentences max. Be genuinely helpful and warm. If someone seems distressed, acknowledge their feelings first before offering tips.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: chatHistory
    })
  });

  const data = await response.json();
  const reply = data.content[0].text;
  chatHistory.push({ role: "assistant", content: reply });
  return reply;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('quickReplies').style.display = 'none';

  addUserMessage(text);
  const typing = showTyping();
  showLoad();

  try {
    const reply = await callJoyBot(text);
    removeTyping();
    addBotMessage(reply);
  } catch (e) {
    removeTyping();
    addBotMessage("Oops! I had a little hiccup. Please try again 😊");
  }
}

function sendQuick(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

// SURPRISE BUTTON & HAPPINESS CALENDAR
function handleSurprise() {
  const popup = document.getElementById('popupOverlay');
  popup.classList.add('show');
}

function closePopup() {
  const popup = document.getElementById('popupOverlay');
  popup.classList.remove('show');
}

function downloadHappinessCalendar() {
  // Create a simple HTML-based calendar PDF
  const content = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
/F2 6 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 2500
>>
stream
BT
/F1 24 Tf
50 750 Td
(JOY LAB - HAPPINESS CALENDAR) Tj
0 -40 Td
/F2 12 Tf
(Your Daily Happiness Tracker) Tj
0 -60 Td
/F2 11 Tf
(Track your mood and happiness each day to build a happier life!) Tj
0 -40 Td
(Instructions:) Tj
0 -20 Td
(1. Rate your happiness from 1-10 each day) Tj
0 -15 Td
(2. Note one thing that made you smile) Tj
0 -15 Td
(3. Practice one happiness habit) Tj
0 -15 Td
(4. Share gratitude with someone) Tj
0 -40 Td
/F1 14 Tf
(MONTH: ____________________) Tj
0 -40 Td
/F2 10 Tf
(Week 1) Tj
0 -20 Td
(Monday: Energy 1-10 ___  Notes: ____________________) Tj
0 -15 Td
(Tuesday: Energy 1-10 ___  Notes: ____________________) Tj
0 -15 Td
(Wednesday: Energy 1-10 ___  Notes: ____________________) Tj
0 -15 Td
(Thursday: Energy 1-10 ___  Notes: ____________________) Tj
0 -15 Td
(Friday: Energy 1-10 ___  Notes: ____________________) Tj
0 -15 Td
(Saturday: Energy 1-10 ___  Notes: ____________________) Tj
0 -15 Td
(Sunday: Energy 1-10 ___  Notes: ____________________) Tj
0 -40 Td
/F1 12 Tf
(Weekly Reflection) Tj
0 -20 Td
/F2 10 Tf
(Best moment this week: ___________________________) Tj
0 -15 Td
(What made me happiest: ___________________________) Tj
0 -15 Td
(Gratitude: ___________________________) Tj
0 -40 Td
(Remember: Happiness is a journey, not a destination!) Tj
0 -20 Td
(Keep tracking, keep smiling! 😊) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj
6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000002833 00000 n
0000002918 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
3004
%%EOF
  `;

  // Create blob and download
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JoyLab_Happiness_Calendar.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  closePopup();
}

// Close popup when clicking outside
document.addEventListener('click', function(e) {
  const popup = document.getElementById('popupOverlay');
  if (e.target === popup) {
    closePopup();
  }
});

// Auto-rotate quotes every 8s
setInterval(nextQuote, 40000);

// HABIT MODAL
const habitData = {
  1: {
    title: "Morning Gratitude",
    description: "Start your day by writing down 3 things you're grateful for, no matter how small. This simple practice rewires your brain to focus on the positive, increasing dopamine and serotonin levels naturally.",
    tips: [
      "Write them down — don't just think them",
      "Be specific (not just 'family', but 'my sister's laugh')",
      "Include at least one tiny thing (morning coffee, sunshine)",
      "Spend 2-3 minutes on this practice"
    ],
    science: "<strong>Neuroplasticity:</strong> Gratitude literally changes your brain structure. Regular practice increases gray matter in areas associated with social bonding and empathy."
  },
  2: {
    title: "Move Your Body",
    description: "Physical movement is one of the most powerful happiness boosters. Even 20 minutes of any activity you enjoy — walking, dancing, cycling — releases endorphins and reduces stress hormones like cortisol.",
    tips: [
      "Choose something you enjoy (not punishment!)",
      "20-30 minutes is the sweet spot",
      "Morning exercise has extra mood benefits",
      "Consistency matters more than intensity"
    ],
    science: "<strong>Endorphin Release:</strong> Exercise triggers the brain to produce endorphins, natural chemicals that reduce pain perception and trigger positive feelings for up to 12 hours."
  },
  3: {
    title: "Mindful Breathing",
    description: "Deep breathing activates your parasympathetic nervous system — your body's natural 'calm mode' — lowering cortisol and blood pressure while promoting mental clarity and emotional balance.",
    tips: [
      "Try the 4-7-8 technique: inhale (4), hold (7), exhale (8)",
      "Or simply focus on slow, deep belly breaths",
      "5-10 minutes is ideal but even 1 minute helps",
      "Practice when stressed or before important moments"
    ],
    science: "<strong>Vagal Activation:</strong> Deep breathing stimulates the vagus nerve, which directly calms your nervous system. This is used in therapy and meditation practices worldwide."
  },
  4: {
    title: "Acts of Kindness",
    description: "Helping others creates a 'helper's high' — a burst of positive emotions and satisfaction. Research shows doing something kind for others boosts your own happiness more than self-centered acts.",
    tips: [
      "Start small: hold a door, compliment someone, text a friend",
      "Aim for at least one intentional act daily",
      "Notice how it makes you feel",
      "Mix unexpected and planned acts of kindness"
    ],
    science: "<strong>Helper's High:</strong> Acts of kindness trigger dopamine release and activate reward centers in the brain. Givers experience more life satisfaction and lower stress levels."
  },
  5: {
    title: "Digital Sunset",
    description: "Avoiding screens 1 hour before bed improves sleep quality dramatically. Blue light from devices suppresses melatonin production, disrupting your circadian rhythm and affecting mood the next day.",
    tips: [
      "Set a phone-free zone 1 hour before sleep",
      "Use this time for reading, journaling, or stretching",
      "Enable night mode on devices if you must use them",
      "Keep phones out of the bedroom if possible"
    ],
    science: "<strong>Sleep Architecture:</strong> Quality sleep is foundational to emotional wellbeing. During sleep, your brain consolidates memories and regulates emotions, making sleep deprivation a major mood killer."
  },
  6: {
    title: "Connect Deeply",
    description: "Real human connection is the #1 predictor of happiness (Harvard Study of Adult Development, 80 years!). One meaningful conversation daily — where you're truly present — strengthens relationships and mental health.",
    tips: [
      "Put phones away during conversations",
      "Ask real questions, listen actively",
      "Share something vulnerable or meaningful",
      "Quality beats quantity — 15 minutes of real talk > 2 hours of small talk"
    ],
    science: "<strong>Social Connection:</strong> When we feel truly seen and heard, our brain releases oxytocin ('the bonding hormone'), reducing anxiety and increasing feelings of safety and belonging."
  },
  7: {
    title: "Learn Something New",
    description: "Curiosity and learning trigger dopamine release in the brain, making you feel more motivated and joyful. It also creates neuroplasticity — your brain stays young, flexible, and energized when you're learning.",
    tips: [
      "Learn something fun, not just productive",
      "Pick any skill or topic that intrigues you",
      "Even 15 minutes of learning counts",
      "Share what you learned with someone else"
    ],
    science: "<strong>Neuroplasticity & Dopamine:</strong> Learning new information triggers dopamine, the 'motivation molecule.' It also strengthens neural pathways, keeping your brain resilient and youthful."
  },
  8: {
    title: "Spend Time in Nature",
    description: "Just 20 minutes in nature reduces stress hormones, lowers blood pressure, and elevates mood. Trees release compounds called phytoncides that have been shown to boost immune function and reduce anxiety.",
    tips: [
      "Any nature counts: park, garden, or window view",
      "Engage your senses: notice sounds, smells, textures",
      "Leave devices behind or on silent mode",
      "Morning or evening are ideal times"
    ],
    science: "<strong>Biophilia:</strong> Humans are naturally drawn to nature. Time in green spaces reduces cortisol, increases serotonin, and activates the parasympathetic nervous system (relaxation mode)."
  },
  9: {
    title: "Practice Forgiveness",
    description: "Holding onto grudges hurts you more than the other person. Forgiveness releases emotional baggage, lowers chronic stress, and paradoxically makes you stronger and more at peace.",
    tips: [
      "Start with smaller grievances first",
      "Forgiveness doesn't mean forgetting or reconciling",
      "Write a letter (don't send it) to process emotions",
      "Remember: forgiving is for your peace, not theirs"
    ],
    science: "<strong>Stress & Health:</strong> Chronic resentment keeps your nervous system in 'fight-or-flight' mode. Forgiveness activates the parasympathetic system, lowering inflammation and improving health."
  },
  10: {
    title: "Celebrate Small Wins",
    description: "Don't wait for big achievements to feel good. Your brain's reward system loves celebrating progress. Acknowledging small steps trains your brain to notice and appreciate daily victories.",
    tips: [
      "Write down 1-2 small wins each day",
      "Actually pause to feel proud (don't skip this!)",
      "Share wins with someone supportive",
      "Examples: finished a task, went to bed on time, tried something new"
    ],
    science: "<strong>Reward Circuitry:</strong> Celebrating wins, no matter how small, activates the brain's reward centers, releasing dopamine. This trains your brain to notice positive progress and build momentum."
  }
};

function openHabitModal(habitNum) {
  const habit = habitData[habitNum];
  document.getElementById('modalNum').textContent = habitNum;
  document.getElementById('modalTitle').textContent = habit.title;
  document.getElementById('modalDesc').textContent = habit.description;
  
  const tipsList = document.getElementById('modalTips');
  tipsList.innerHTML = '';
  habit.tips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });
  
  document.getElementById('modalScience').innerHTML = habit.science;
  document.getElementById('habitModal').classList.add('open');
}

function closeHabitModal() {
  document.getElementById('habitModal').classList.remove('open');
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('habitModal');
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeHabitModal();
    }
  });
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeHabitModal();
    closeScienceModal();
  }
});

// SCIENCE CARD MODAL DATA
const scienceCardData = {
  1: {
    title: "The 50/10/40 Rule",
    icon: "🧬",
    description: "Harvard research shows 50% of happiness is genetic, 10% is circumstances — but 40% is fully in your control through daily choices.",
    research: "Research from Harvard's Positive Psychology Lab revealed that happiness levels can be broken down into three components. Genetic predisposition (set point) accounts for about 50%, life circumstances (income, marital status, health) account for 10%, and intentional activities and mindset account for 40%.",
    findings: [
      "40% of happiness is within our direct control",
      "Daily choices compound over time to boost wellbeing",
      "Genetics set a baseline, but it's not your destiny",
      "Environmental factors have surprisingly little impact",
      "Intentional practices can permanently raise happiness levels"
    ],
    application: "Focus on controllable factors: gratitude practices, relationships, exercise, and meaningful activities. Don't blame circumstances for unhappiness—you have more power than you think. Small daily choices accumulate into lasting happiness gains."
  },
  2: {
    title: "Relationships #1",
    icon: "🤝",
    description: "The Harvard Study of Adult Development (80 years!) found that the quality of our relationships is the single biggest predictor of happiness.",
    research: "The Harvard Study of Adult Development tracked 700+ people over 80+ years, making it one of the longest studies on wellbeing. The findings consistently showed that strong, meaningful relationships are the strongest predictor of happiness, health, and longevity.",
    findings: [
      "Strong relationships are the #1 predictor of happiness",
      "Quality matters far more than quantity of relationships",
      "Loneliness is as harmful as smoking or obesity",
      "Conflict-ridden relationships harm health more than no relationships",
      "Investing in relationships pays lifelong dividends"
    ],
    application: "Prioritize meaningful connections. Invest time in people who matter, resolve conflicts, and be present. One genuine conversation daily is more valuable than hundreds of surface-level interactions."
  },
  3: {
    title: "Gratitude Rewires You",
    icon: "🙏",
    description: "Writing 3 things you're grateful for daily increases dopamine and serotonin — the same effect as antidepressants, naturally.",
    research: "Neuroscience research shows that practicing gratitude activates brain regions associated with reward (dopamine) and mood (serotonin). Brain imaging scans reveal that gratitude practices literally change neural pathways, increasing gray matter in areas linked to social bonding and empathy.",
    findings: [
      "Gratitude increases dopamine and serotonin naturally",
      "Regular practice changes brain structure (neuroplasticity)",
      "Effects are comparable to some antidepressant medications",
      "Specificity matters—name exactly what you're grateful for",
      "Writing is more powerful than just thinking"
    ],
    application: "Start a daily gratitude practice: write 3 specific things you're grateful for each morning. Be detailed (e.g., 'my sister's laugh' not just 'family'). This trains your brain to notice positivity and rewires it for long-term happiness."
  },
  4: {
    title: "Movement = Mood",
    icon: "🏃",
    description: "Just 20 minutes of exercise releases endorphins that reduce stress and anxiety and boosts mood for up to 12 hours.",
    research: "Exercise triggers the release of endorphins, the body's natural opioids. These neurochemicals reduce pain perception, increase pleasure, and create a sense of wellbeing. The mood-boosting effects last for hours after exercise ends.",
    findings: [
      "20 minutes of any activity is the sweet spot",
      "Effects last up to 12 hours post-exercise",
      "Walking, dancing, and sports all work equally well",
      "Morning exercise has amplified mood benefits for the day",
      "Consistency beats intensity for long-term happiness"
    ],
    application: "Move for 20 minutes daily—not for weight loss, but for happiness. Walk, dance, cycle, or play—anything you enjoy. Exercise is nature's antidepressant. Morning workouts set a positive tone for the entire day."
  },
  5: {
    title: "Flow State",
    icon: "🎯",
    description: "Mihaly Csikszentmihalyi found that happiness peaks when we're fully absorbed in a meaningful challenge — called 'flow.'",
    research: "Positive psychologist Mihaly Csikszentmihalyi's decades of research identified 'flow'—a mental state of complete immersion in a challenging activity. During flow, people experience peak happiness and time seems to disappear.",
    findings: [
      "Flow requires the right balance of challenge and skill",
      "People in flow states report highest happiness levels",
      "Time perception changes—hours feel like minutes",
      "Flow builds confidence and competence",
      "Any activity can induce flow if difficulty is right"
    ],
    application: "Find activities where your skill level matches the challenge level. Whether work, hobbies, or sports, pursue things that absorb your full attention. Flow is where peak happiness lives. Build a life with regular flow moments."
  },
  6: {
    title: "Money & Happiness",
    icon: "💸",
    description: "Studies show happiness increases with income up to ~₹6 LPA for daily wellbeing — beyond that, experiences and meaning matter more.",
    research: "Economics research shows a positive correlation between income and happiness, but it plateaus. Beyond a certain income threshold where basic needs and comfort are met, additional money has diminishing returns on happiness. Experiences and meaning become more valuable.",
    findings: [
      "Money matters—but only up to a point (~₹6 LPA)",
      "Beyond that, experiences matter more than possessions",
      "Generous giving activates reward centers in the brain",
      "Materialism and happiness are inversely correlated",
      "Purpose and meaning create more lasting happiness than wealth"
    ],
    application: "Earn enough for security and comfort, then shift focus to experiences, relationships, and meaning. Spend money on experiences, not stuff. Give generously—it activates happiness centers more than buying for yourself."
  }
};

function openScienceModal(cardNum) {
  const card = scienceCardData[cardNum];
  document.getElementById('scienceIcon').textContent = card.icon;
  document.getElementById('scienceTitle').textContent = card.title;
  document.getElementById('scienceDesc').textContent = card.description;
  document.getElementById('scienceResearch').textContent = card.research;
  
  const findingsList = document.getElementById('scienceFindings');
  findingsList.innerHTML = '';
  card.findings.forEach(finding => {
    const li = document.createElement('li');
    li.textContent = finding;
    findingsList.appendChild(li);
  });
  
  document.getElementById('scienceApplication').textContent = card.application;
  document.getElementById('scienceModal').classList.add('open');
}

function closeScienceModal() {
  document.getElementById('scienceModal').classList.remove('open');
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const scienceModal = document.getElementById('scienceModal');
  if (scienceModal) {
    scienceModal.addEventListener('click', function(e) {
      if (e.target === scienceModal) {
        closeScienceModal();
      }
    });
  }
});
