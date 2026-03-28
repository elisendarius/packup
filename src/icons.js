// ── SVG Icon Library ─────────────────────────────────────────
// All icons: 18×18, stroke-only, no fill, no colour.
const _s = d => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const SVGI = {
  clothing:    _s('<path d="M5 1L2 4l2 1v10h8V5l2-1-3-3Q9.5 3 8 3Q6.5 3 5 1z"/>'),
  equipment:   _s('<path d="M11 2l3 3-1.5 1.5-3-3zm-1 2L3 11l-.5 2.5 2.5-.5L12 6zm-2 2l2 2"/>'),
  accessories: _s('<circle cx="8" cy="8" r="5.5"/><path d="M8 5v6M5 8h6"/>'),
  toiletries:  _s('<path d="M6.5 2h3v2h-3zM5 4h6l.8 10H4.2L5 4z"/><path d="M7.5 7v3.5"/>'),
  documents:   _s('<path d="M4 2h6l2 2v10H4V2z"/><path d="M10 2v2h2"/><path d="M6.5 7h3M6.5 10h3"/>'),
  other:       _s('<circle cx="5" cy="5" r="1.2"/><circle cx="11" cy="5" r="1.2"/><circle cx="5" cy="11" r="1.2"/><circle cx="11" cy="11" r="1.2"/>'),
  beach:       _s('<path d="M2 11 Q5 6 8 5.5 Q11 5 14 8"/><circle cx="11" cy="4.5" r="2"/><path d="M2 13h12"/>'),
  cloud:       _s('<path d="M4 11a3 3 0 1 1 1-5.8A4 4 0 1 1 13 9H4"/>'),
  pin:         _s('<path d="M8 14S3 9.5 3 6a5 5 0 0 1 10 0c0 3.5-5 8-5 8z"/><circle cx="8" cy="6" r="1.5"/>'),
  fork:        _s('<path d="M5 2v3.5A1.5 1.5 0 0 0 6.5 7v7M11 2v3c0 1.1-.9 2-2 2v7M9.5 2v3"/>'),
  mountain:    _s('<path d="M2 13L7 5l2.5 4L11 7l3 6H2z"/>'),
  compass:     _s('<circle cx="8" cy="8" r="6"/><path d="M10.5 5.5L9 9 5.5 10.5 7 7z"/>'),
  train:       _s('<rect x="4" y="2" width="8" height="9" rx="2"/><path d="M4 7.5h8"/><circle cx="6" cy="13" r="1"/><circle cx="10" cy="13" r="1"/><path d="M6 11v2M10 11v2"/>'),
  sun:         _s('<circle cx="8" cy="8" r="2.5"/><path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M4.2 4.2l1 1M10.8 10.8l1 1M4.2 11.8l1-1M10.8 5.2l1-1"/>'),
  building:    _s('<path d="M2 14V7l6-5 6 5v7H2z"/><rect x="6" y="9" width="4" height="5"/><path d="M5 7h.01M11 7h.01"/>'),
  wave:        _s('<path d="M2 10 Q4.5 7 7 10 Q9.5 13 12 10 Q13.5 8 14 9"/>'),
  circle:      _s('<circle cx="8" cy="8" r="5.5"/>'),
  plane:       _s('<path d="M9.5 3.5L6 8l-3 1 1.5 1.5L5.5 12 7 10.5 8.5 12l1.5-1.5L8.5 8l5-3L9.5 3.5z"/>'),
  arrows:      _s('<path d="M2 6h9M8 3l3 3-3 3"/><path d="M14 10H5M8 7l-3 3 3 3"/>'),
  speech:      _s('<path d="M2.5 3h11v7H8L5 13v-3H2.5V3z"/>'),
  cross:       _s('<path d="M8 3v10M3 8h10"/>'),
  signal:      _s('<circle cx="8" cy="8" r="1.2"/><path d="M5.5 5.5a3.5 3.5 0 0 0 0 5M10.5 5.5a3.5 3.5 0 0 1 0 5M3 3a7 7 0 0 0 0 10M13 3a7 7 0 0 1 0 10"/>'),
  thermometer: _s('<path d="M8 2v7.2"/><circle cx="8" cy="12" r="2.2"/><path d="M6 9.5A2.2 2.2 0 0 0 8 14"/>'),
  globe:       _s('<circle cx="8" cy="8" r="6"/><path d="M2 8h12"/><path d="M8 2Q5 5 5 8Q5 11 8 14M8 2Q11 5 11 8Q11 11 8 14"/>'),
  tent:        _s('<path d="M8 2L2 13h12L8 2z"/><path d="M8 7v6"/>'),
  stethoscope: _s('<path d="M4 3h2a1 1 0 0 1 1 1v4a3 3 0 0 0 6 0v-1"/><circle cx="13" cy="7" r="1"/><path d="M4 3H3a1 1 0 0 0-1 1v2.5a3 3 0 0 0 6 0V4a1 1 0 0 0-1-1"/>'),
  paw:         _s('<circle cx="5.5" cy="4.5" r="1.2"/><circle cx="8" cy="3" r="1.2"/><circle cx="10.5" cy="4.5" r="1.2"/><path d="M4 9Q8 7 12 9Q13 12 8 14.5Q3 12 4 9z"/>'),
  search:      _s('<circle cx="7" cy="7" r="4"/><path d="M10.5 10.5L14 14"/>'),
  bag:         _s('<path d="M5 5V3.5A3 3 0 0 1 11 3.5V5"/><rect x="2" y="5" width="12" height="9" rx="1.5"/><path d="M5 5h6"/>'),
  clipboard:   _s('<rect x="4" y="3" width="8" height="11" rx="1"/><path d="M6.5 3V2h3v1"/><path d="M6 7.5h4M6 10.5h2.5"/>'),
  car:         _s('<path d="M2 9l1.5-4h9L14 9"/><rect x="1" y="9" width="14" height="4" rx="1.5"/><circle cx="4.5" cy="13" r="1.5"/><circle cx="11.5" cy="13" r="1.5"/>'),
  dog:         _s('<circle cx="5.5" cy="4.5" r="1.2"/><circle cx="8" cy="3" r="1.2"/><circle cx="10.5" cy="4.5" r="1.2"/><path d="M4 9Q8 7 12 9Q13 12 8 14.5Q3 12 4 9z"/>'),
  suitcase:    _s('<rect x="2" y="6" width="12" height="8" rx="1.5"/><path d="M5 6V4.5A1.5 1.5 0 0 1 6.5 3h3A1.5 1.5 0 0 1 11 4.5V6"/><line x1="2" y1="10" x2="14" y2="10"/>'),
  grid:        _s('<circle cx="4.5" cy="4.5" r="1.5"/><circle cx="11.5" cy="4.5" r="1.5"/><circle cx="4.5" cy="11.5" r="1.5"/><circle cx="11.5" cy="11.5" r="1.5"/>'),
};
function si(key, sz = 18) {
  const s = SVGI[key];
  if (!s) return '';
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${sz}px;height:${sz}px;flex-shrink:0;opacity:.7">${s.replace('<svg ', `<svg width="${sz}" height="${sz}" `)}</span>`;
}
