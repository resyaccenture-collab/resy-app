require('dotenv').config();
const express  = require('express');
const nodemailer = require('nodemailer');
const cors     = require('cors');
const path     = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ── email transporter ── */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

/* ── HTML email builder ── */
function buildEmail({ name, restaurant, cuisine, hood, date, time, guests, occasion, note, amexLinked, code }) {
  const occasionRow = occasion
    ? `<tr><td colspan="3" style="padding-top:14px;">
         <p style="margin:0;font-size:13px;color:#1A1A1A;"><strong>Occasion:</strong> ${occasion}</p>
       </td></tr>`
    : '';

  const noteBlock = note
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
         <tr><td style="background:#F7F5F0;border-radius:10px;padding:14px 16px;">
           <p style="color:#767676;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin:0 0 6px;">Note to restaurant</p>
           <p style="color:#1A1A1A;font-size:13px;margin:0;line-height:1.6;">${note}</p>
         </td></tr>
       </table>`
    : '';

  const amexBanner = amexLinked
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
         <tr><td style="background:#FFF5F4;border:1px solid #FFD0CC;border-radius:10px;padding:12px 16px;">
           <p style="margin:0;font-size:13px;font-weight:700;color:#FF4438;">★ Amex Platinum · $100 Resy Credit Applied Automatically</p>
         </td></tr>
       </table>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Reservation Confirmed — ${restaurant}</title>
</head>
<body style="margin:0;padding:0;background:#F7F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- Header -->
  <tr><td style="background:#FF4438;border-radius:14px 14px 0 0;padding:26px 36px;text-align:center;">
    <span style="color:#FFFFFF;font-size:30px;font-weight:900;letter-spacing:-1.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">resy</span>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#FFFFFF;padding:36px;border-radius:0 0 14px 14px;">

    <!-- Status -->
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#22C55E;">✓ Reservation Confirmed</p>
    <h1 style="margin:0 0 4px;font-size:30px;font-weight:800;color:#1A1A1A;letter-spacing:-1px;">${restaurant}</h1>
    <p style="margin:0 0 26px;font-size:14px;color:#767676;">${cuisine} · ${hood}</p>

    ${amexBanner}

    <!-- Booking grid -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background:#F7F5F0;border-radius:10px;padding:16px;text-align:center;width:32%;">
          <p style="margin:0 0 5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#767676;">Date</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:#1A1A1A;">${date}</p>
        </td>
        <td width="8" style="min-width:8px;"></td>
        <td style="background:#F7F5F0;border-radius:10px;padding:16px;text-align:center;width:32%;">
          <p style="margin:0 0 5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#767676;">Time</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:#1A1A1A;">${time}</p>
        </td>
        <td width="8" style="min-width:8px;"></td>
        <td style="background:#F7F5F0;border-radius:10px;padding:16px;text-align:center;width:32%;">
          <p style="margin:0 0 5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#767676;">Guests</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:#1A1A1A;">${guests} ${guests === 1 ? 'guest' : 'guests'}</p>
        </td>
      </tr>
      ${occasionRow}
    </table>

    ${noteBlock}

    <!-- Confirmation code -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="border:1.5px solid #E8E8E8;border-radius:10px;padding:18px;text-align:center;">
        <p style="margin:0 0 5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#767676;">Confirmation Code</p>
        <p style="margin:0;font-size:26px;font-weight:900;color:#FF4438;letter-spacing:4px;">${code}</p>
      </td></tr>
    </table>

    <!-- CTAs -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td align="center">
          <a href="https://resy.com" style="display:inline-block;padding:14px 24px;background:#FF4438;color:#FFFFFF;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;margin:0 5px;">Manage Reservation</a>
          <a href="https://resy.com" style="display:inline-block;padding:14px 24px;background:#FFFFFF;color:#1A1A1A;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;border:1.5px solid #E8E8E8;margin:0 5px;">Add to Calendar</a>
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #E8E8E8;margin:0 0 22px;"/>

    <p style="margin:0;font-size:12px;color:#767676;line-height:1.7;text-align:center;">
      Hi ${name}, please arrive on time — ${restaurant} holds tables for 15 minutes past the reservation time.
      A reminder will be sent 24 hours before your reservation.
    </p>

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:22px 0;text-align:center;">
    <p style="margin:0 0 4px;font-size:10px;color:#AAAAAA;">Powered by <strong style="color:#767676;">resy</strong> × American Express Global Dining Access</p>
    <p style="margin:0;font-size:10px;color:#C0C0C0;">© ${new Date().getFullYear()} American Express. All rights reserved.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── API: send reservation confirmation ── */
app.post('/api/send-reservation', async (req, res) => {
  try {
    const {
      name, email,
      restaurant, cuisine, hood,
      date, time, guests,
      occasion, note,
      amexLinked,
    } = req.body;

    if (!email || !restaurant || !time) {
      return res.status(400).json({ error: 'Missing required fields: email, restaurant, time' });
    }

    const code = 'RSY' + Math.floor(100000 + Math.random() * 900000);

    const html = buildEmail({
      name: name || 'Guest',
      restaurant, cuisine, hood,
      date: date || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time,
      guests: parseInt(guests) || 2,
      occasion: occasion || null,
      note: note || null,
      amexLinked: !!amexLinked,
      code,
    });

    await transporter.sendMail({
      from: `"Resy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your reservation at ${restaurant} is confirmed — ${time}`,
      html,
    });

    console.log(`[resy] Confirmation sent → ${email} for ${restaurant} at ${time}`);
    res.json({ success: true, code });

  } catch (err) {
    console.error('[resy] Email error:', err.message);
    res.status(500).json({ error: 'Failed to send email', detail: err.message });
  }
});

/* ── Google Places proxy ── */
const GPLACES_KEY = process.env.GOOGLE_PLACES_KEY;
const placeCache = new Map(); // restaurant name → detail object

app.get('/api/place-details', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'name required' });
  if (!GPLACES_KEY) return res.status(503).json({ error: 'Google Places not configured' });

  const cacheKey = name.toLowerCase();
  if (placeCache.has(cacheKey)) return res.json(placeCache.get(cacheKey));

  try {
    // 1 — text search to get place ID
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GPLACES_KEY,
        'X-Goog-FieldMask': 'places.id',
      },
      body: JSON.stringify({ textQuery: `${name} St Charles IL restaurant` }),
    });
    const searchData = await searchRes.json();
    const placeId = searchData.places?.[0]?.id;
    if (!placeId) return res.status(404).json({ error: 'Place not found' });

    // 2 — fetch full details
    const detailRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': GPLACES_KEY,
        'X-Goog-FieldMask': [
          'displayName','rating','userRatingCount','priceLevel',
          'formattedAddress','nationalPhoneNumber','websiteUri',
          'regularOpeningHours','currentOpeningHours',
          'photos','reviews','editorialSummary',
        ].join(','),
      },
    });
    const d = await detailRes.json();

    const result = {
      name: d.displayName?.text || name,
      rating: d.rating || null,
      reviewCount: d.userRatingCount || 0,
      address: d.formattedAddress || null,
      phone: d.nationalPhoneNumber || null,
      website: d.websiteUri || null,
      summary: d.editorialSummary?.text || null,
      isOpen: d.currentOpeningHours?.openNow ?? null,
      hours: d.regularOpeningHours?.weekdayDescriptions || [],
      photos: (d.photos || []).slice(0, 8).map(p => ({ ref: p.name })),
      reviews: (d.reviews || []).map(r => ({
        author: r.authorAttribution?.displayName || 'Anonymous',
        rating: r.rating || 0,
        text: r.text?.text || '',
        time: r.relativePublishTimeDescription || '',
      })),
    };

    placeCache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('[places]', err.message);
    res.status(500).json({ error: 'Places API error', detail: err.message });
  }
});

app.get('/api/place-photo', async (req, res) => {
  const { ref } = req.query;
  if (!ref || !GPLACES_KEY) return res.status(400).send('missing ref or key');
  try {
    const photoRes = await fetch(
      `https://places.googleapis.com/v1/${ref}/media?maxWidthPx=900&key=${GPLACES_KEY}`
    );
    if (!photoRes.ok) return res.status(photoRes.status).send('photo error');
    res.set('Content-Type', photoRes.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    const { Readable } = require('stream');
    Readable.fromWeb(photoRes.body).pipe(res);
  } catch (err) {
    res.status(500).send('photo proxy error');
  }
});

/* ── health check ── */
app.get('/api/health', (_, res) => res.json({ ok: true }));

/* ── serve React app for all other routes ── */
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  resy app  →  http://localhost:${PORT}\n`);
});
