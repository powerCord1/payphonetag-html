const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatBadgeName(badgeId) {
  if (!badgeId) return '';
  return badgeId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function fetchIdentity(pin) {
  const response = await fetch('https://payphonetag.com/api/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: String(pin) })
  });

  if (!response.ok) {
    throw new Error(`Identity API error: ${response.status}`);
  }
  return await response.json();
}

async function fetchSnapshot(pin) {
  const response = await fetch('https://payphonetag.com/api/player-snapshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: String(pin) })
  });

  if (!response.ok) {
    throw new Error(`Snapshot API error: ${response.status}`);
  }
  return await response.json();
}

app.get('/', async (req, res) => {
  // If pin passed in query param, save to cookie
  let pin = req.query.pin || req.cookies.payphone_pin;

  if (req.query.pin) {
    res.cookie('payphone_pin', req.query.pin, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }

  if (!pin) {
    return res.render('login', { error: null });
  }

  try {
    const [identity, snapshot] = await Promise.all([
      fetchIdentity(pin),
      fetchSnapshot(pin)
    ]);

    const rawEvents = snapshot.events || [];
    const activeTab = ['alerts', 'stats', 'notifications'].includes(req.query.tab)
      ? req.query.tab
      : 'alerts';

    res.render('index', {
      identity,
      snapshot,
      events: rawEvents,
      activeTab,
      pin,
      formatDate,
      formatBadgeName
    });
  } catch (err) {
    console.error('Error fetching player data:', err.message);
    res.render('login', {
      error: 'Failed to fetch player data. Please check your PIN and try again.'
    });
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const pin = req.body.pin ? req.body.pin.trim() : '';
  if (!pin) {
    return res.render('login', { error: 'Please enter a valid PIN.' });
  }
  res.cookie('payphone_pin', pin, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.redirect('/?tab=alerts');
});

app.post('/logout', (req, res) => {
  res.clearCookie('payphone_pin');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Payphone Tag HTML app running on port ${PORT}`);
});
