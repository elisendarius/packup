// ── Van illustrations and card visual styles

function mkV(roof,body,wheel,xtra=''){
  return `<svg viewBox="0 0 240 155" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="120" cy="148" rx="100" ry="7" fill="rgba(0,0,0,.06)"/>
  <rect x="14" y="72" width="205" height="52" rx="11" fill="${body}"/>
  <path d="M28,72 L28,36 Q30,26 42,24 L178,24 Q190,26 196,38 L214,72 Z" fill="${roof}"/>
  <rect x="17" y="38" width="24" height="18" rx="5" fill="rgba(200,230,255,.85)"/>
  <circle cx="88" cy="49" r="16" fill="rgba(200,230,255,.85)"/>
  <circle cx="88" cy="49" r="16" stroke="${body}" stroke-width="2.5" fill="none"/>
  <circle cx="135" cy="49" r="16" fill="rgba(200,230,255,.85)"/>
  <circle cx="135" cy="49" r="16" stroke="${body}" stroke-width="2.5" fill="none"/>
  <path d="M198,38 L198,70 L214,70 L208,38 Z" fill="rgba(200,230,255,.85)"/>
  <line x1="198" y1="56" x2="214" y2="56" stroke="${roof}" stroke-width="2.5"/>
  <line x1="163" y1="74" x2="163" y2="120" stroke="rgba(0,0,0,.10)" stroke-width="1.5"/>
  <rect x="14" y="82" width="205" height="5" rx="2.5" fill="${roof}" opacity=".5"/>
  <circle cx="210" cy="82" r="7" fill="#fffde4" stroke="#ccc" stroke-width="1"/>
  <circle cx="210" cy="82" r="4" fill="#fff9c0"/>
  <rect x="14" y="80" width="10" height="14" rx="2" fill="#ff6b4a"/>
  <circle cx="188" cy="56" r="8" fill="${roof}" stroke="${body}" stroke-width="2"/>
  <rect x="16" y="96" width="16" height="9" rx="3" fill="#aaa"/>
  <rect x="210" y="96" width="16" height="9" rx="3" fill="#aaa"/>
  <circle cx="57" cy="125" r="19" fill="#2a2828"/>
  <circle cx="57" cy="125" r="11" fill="${wheel}"/>
  <circle cx="57" cy="125" r="4.5" fill="#1a1818"/>
  <line x1="57" y1="114" x2="57" y2="136" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
  <line x1="46" y1="125" x2="68" y2="125" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
  <circle cx="183" cy="125" r="19" fill="#2a2828"/>
  <circle cx="183" cy="125" r="11" fill="${wheel}"/>
  <circle cx="183" cy="125" r="4.5" fill="#1a1818"/>
  <line x1="183" y1="114" x2="183" y2="136" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
  <line x1="172" y1="125" x2="194" y2="125" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>
  ${xtra}</svg>`;
}
const SVGS={
  ski:mkV('#5a9ad8','#1a5fbb','#5a9fef',`
    <rect x="42" y="16" width="130" height="5" rx="2" fill="#666"/>
    <rect x="50" y="8" width="110" height="3.5" rx="1.5" fill="rgba(200,230,255,.5)"/>
    <rect x="55" y="12" width="100" height="3.5" rx="1.5" fill="#ff88bb"/>
    <ellipse cx="22" cy="55" rx="4" ry="12" fill="rgba(200,230,255,.4)" transform="rotate(-15 22 55)"/>
    <ellipse cx="218" cy="55" rx="4" ry="12" fill="rgba(200,230,255,.4)" transform="rotate(15 218 55)"/>`),
  summer:mkV('#e8800a','#e8650a','#d4640a',`
    <circle cx="216" cy="15" r="13" fill="#fcd030" opacity=".9"/>
    <line x1="216" y1="0" x2="216" y2="5" stroke="#fcd030" stroke-width="2" opacity=".6"/>
    <line x1="216" y1="25" x2="216" y2="30" stroke="#fcd030" stroke-width="2" opacity=".6"/>
    <line x1="200" y1="15" x2="205" y2="15" stroke="#fcd030" stroke-width="2" opacity=".6"/>
    <circle cx="170" cy="90" r="8" fill="#fcd030"/>
    <circle cx="170" cy="79" r="6" fill="#e8650a"/>
    <circle cx="178" cy="85" r="6" fill="#e8650a"/>
    <circle cx="178" cy="96" r="6" fill="#e8650a"/>
    <circle cx="162" cy="96" r="6" fill="#e8650a"/>
    <circle cx="162" cy="85" r="6" fill="#e8650a"/>`),
  winter:mkV('#c8820a','#8b5e00','#c8860a',`
    <path d="M22,24 Q26,13 31,18 Q29,7 35,12 Q37,3 41,8 Q39,18 35,21 Q39,25 33,25 Z" fill="#f0c060" opacity=".7"/>
    <path d="M50,19 Q53,9 57,13 Q55,5 60,8 Q61,2 65,5 Q63,13 59,16 Q62,20 56,20 Z" fill="#f0c060" opacity=".6"/>
    <circle cx="210" cy="14" r="9" fill="#fff8dc" opacity=".5"/>
    <line x1="205" y1="9" x2="215" y2="19" stroke="#d49020" stroke-width="2" opacity=".6"/>
    <line x1="215" y1="9" x2="205" y2="19" stroke="#d49020" stroke-width="2" opacity=".6"/>`),
  weekend:mkV('#4a9060','#4a7c59','#3a6644',`
    <circle cx="36" cy="14" r="7" fill="#70c080" opacity=".4"/>
    <path d="M33,14 A3,3 0 1,1 39,14" fill="none" stroke="#70c080" stroke-width="1.5" opacity=".5"/>
    <circle cx="210" cy="13" r="5" fill="#e8a030" opacity=".6"/>
    <path d="M207,10 L210,6 L213,10" fill="none" stroke="#e8a030" stroke-width="1.5" opacity=".6"/>`),
  spring:mkV('#5aaa60','#3a8a48','#5ab060',`
    <circle cx="30" cy="18" r="5" fill="#90d870" opacity=".5"/>
    <circle cx="42" cy="12" r="4" fill="#f0d040" opacity=".6"/>
    <circle cx="52" cy="18" r="3" fill="#f0a0b0" opacity=".6"/>
    <circle cx="60" cy="12" r="5" fill="#90d870" opacity=".5"/>
    <circle cx="72" cy="16" r="3" fill="#f0d040" opacity=".5"/>
    <circle cx="200" cy="10" r="6" fill="#f0d040" opacity=".5"/>
    <circle cx="212" cy="16" r="4" fill="#f0a0b0" opacity=".6"/>
    <circle cx="220" cy="10" r="5" fill="#90d870" opacity=".5"/>`),
  autumn:mkV('#c87820','#a05c10','#c87020',`
    <path d="M28,22 Q32,10 38,16 Q34,6 40,12 Q38,4 44,8 Q42,18 38,20 Q42,24 36,24 Z" fill="#d46010" opacity=".6"/>
    <path d="M46,18 Q49,9 53,13 Q51,5 56,8 Q57,2 61,5 Q59,13 55,16 Q58,20 52,20 Z" fill="#c85010" opacity=".5"/>
    <path d="M200,22 Q204,10 210,16 Q206,6 212,12 Q210,4 216,8 Q214,18 210,20 Q214,24 208,24 Z" fill="#e07020" opacity=".5"/>
    <circle cx="218" cy="14" r="4" fill="#d49020" opacity=".4"/>`),
};
const CARD_TOPS={
  ski:'linear-gradient(160deg,#dceeff 0%,#b8d4f4 100%)',
  summer:'linear-gradient(160deg,#fff0e0 0%,#ffd4a0 100%)',
  winter:'linear-gradient(160deg,#fff8e8 0%,#fde8b0 100%)',
  weekend:'linear-gradient(160deg,#e4f4e8 0%,#b8dcc0 100%)',
  spring:'linear-gradient(160deg,#e8f8e0 0%,#c0eca0 100%)',
  autumn:'linear-gradient(160deg,#fff0d8 0%,#f4c878 100%)',
};
const CARD_ACCENTS={ski:'#3a80c0',summer:'#d46010',winter:'#c87808',weekend:'#3a7048',spring:'#3a8a3a',autumn:'#b85810'};
