import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Receipt,
  Sparkles,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  Download,
  Share2,
  ImagePlus,
  X,
  Copy,
  Check,
  Eye,
  Edit3,
  Trash2,
  Shirt,
  ChevronRight,
  MessageCircleHeart,
  RotateCcw,
} from 'lucide-react';
import { toPng } from 'html-to-image';

// ==========================================
// 1. ข้อมูลพื้นฐานภาษาไทย & สีเสื้อมงคลประจำวัน
// ==========================================
const THAI_MONTHS = [
  { val: '01', label: 'มกราคม', short: 'ม.ค.' },
  { val: '02', label: 'กุมภาพันธ์', short: 'ก.พ.' },
  { val: '03', label: 'มีนาคม', short: 'มี.ค.' },
  { val: '04', label: 'เมษายน', short: 'เม.ย.' },
  { val: '05', label: 'พฤษภาคม', short: 'พ.ค.' },
  { val: '06', label: 'มิถุนายน', short: 'มิ.ย.' },
  { val: '07', label: 'กรกฎาคม', short: 'ก.ค.' },
  { val: '08', label: 'สิงหาคม', short: 'ส.ค.' },
  { val: '09', label: 'กันยายน', short: 'ก.ย.' },
  { val: '10', label: 'ตุลาคม', short: 'ต.ค.' },
  { val: '11', label: 'พฤศจิกายน', short: 'พ.ย.' },
  { val: '12', label: 'ธันวาคม', short: 'ธ.ค.' },
];

const ZODIAC_DATA = [
  { name: 'ปีชวด', petName: 'น้องหนูนำโชค', bodyColor: '#E2E8F0', earInner: '#FBCFE8', earType: 'round' },
  { name: 'ปีฉลู', petName: 'น้องวัวใจดี', bodyColor: '#FEF3C7', earInner: '#FDE68A', earType: 'horn' },
  { name: 'ปีขาล', petName: 'น้องเสือมหาอำนาจ', bodyColor: '#FDBA74', earInner: '#FED7AA', earType: 'round' },
  { name: 'ปีเถาะ', petName: 'น้องกระต่ายจันทร์เจ้า', bodyColor: '#FCE7F3', earInner: '#F9A8D4', earType: 'long' },
  { name: 'ปีมะโรง', petName: 'น้องมังกรทองคำ', bodyColor: '#A7F3D0', earInner: '#6EE7B7', earType: 'horn' },
  { name: 'ปีมะเส็ง', petName: 'น้องงูน้อยเจ้าเสน่ห์', bodyColor: '#DDD6FE', earInner: '#C4B5FD', earType: 'crown' },
  { name: 'ปีมะเมีย', petName: 'น้องม้าพยศทรัพย์', bodyColor: '#FDE68A', earInner: '#FCD34D', earType: 'pointy' },
  { name: 'ปีมะแม', petName: 'น้องแกะปุยเมฆ', bodyColor: '#F3F4F6', earInner: '#FBCFE8', earType: 'floppy' },
  { name: 'ปีวอก', petName: 'น้องลิงไหวพริบไว', bodyColor: '#FED7AA', earInner: '#FDBA74', earType: 'round' },
  { name: 'ปีระกา', petName: 'น้องไก่ทองขยันทรัพย์', bodyColor: '#FEF08A', earInner: '#FCA5A5', earType: 'crown' },
  { name: 'ปีจอ', petName: 'น้องหมาซื่อสัตย์', bodyColor: '#FDE68A', earInner: '#FDBA74', earType: 'floppy' },
  { name: 'ปีกุน', petName: 'น้องหมูมูดีอุดมทรัพย์', bodyColor: '#FBCFE8', earInner: '#F472B6', earType: 'pig' },
];

const CURRENT_BE_YEAR = new Date().getFullYear() + 543;
const BE_YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_BE_YEAR - i);

const DAILY_SHIRT_COLORS = {
  0: { luck: '#38BDF8', power: '#F472B6', money: '#22C55E', support: '#A855F7', avoid: '#3B82F6' },
  1: { luck: '#A855F7', power: '#22C55E', money: '#F97316', support: '#38BDF8', avoid: '#EF4444' },
  2: { luck: '#F97316', power: '#A855F7', money: '#3F3F46', support: '#EF4444', avoid: '#FACC15' },
  3: { luck: '#3F3F46', power: '#FACC15', money: '#38BDF8', support: '#F8FAFC', avoid: '#F472B6' },
  4: { luck: '#EF4444', power: '#38BDF8', money: '#FACC15', support: '#22C55E', avoid: '#7E22CE' },
  5: { luck: '#F472B6', power: '#F8FAFC', money: '#22C55E', support: '#F97316', avoid: '#3F3F46' },
  6: { luck: '#38BDF8', power: '#3F3F46', money: '#EF4444', support: '#F472B6', avoid: '#166534' },
};

const FOCUS_MODES = [
  {
    id: 'wealth',
    label: 'การเงิน & โชคลาภ',
    baseIdx: 1,
    house: 'ช่องการเงิน (กดุมภะ)',
    themeGradient: 'from-[#3B0764] via-[#581C87] to-[#78350F]',
    quotes: [
      'วันนี้กระแสเงินเปิดกว้างมาก! กดออกใบกำกับดวงรับทรัพย์กันเถอะ 💰',
      'ก้อนทองในมือพร้อมส่งต่อให้คุณแล้ว ลุยปิดยอดวันนี้ได้เลย!',
      'ฐานการเงินกำลังเดินหน้า อย่าลืมใส่เสื้อสีมงคลเสริมพลังนะ ✨',
    ],
  },
  {
    id: 'career',
    label: 'การงาน & ธุรกิจ',
    baseIdx: 6,
    house: 'ช่องการงาน (กัมมะ)',
    themeGradient: 'from-[#1E1B4B] via-[#4C1D95] to-[#312E81]',
    quotes: [
      'คทาความสำเร็จพร้อมแล้ว! วันนี้เจรจาโปรเจกต์ไหนก็ผ่านฉลุย 🚀',
      'ผู้ใหญ่กำลังมองเห็นความตั้งใจของคุณ ลุยเต็มที่ได้เลย!',
      'จังหวะงานกำลังพุ่ง ตั้งวอลเปเปอร์เสริมบารมีไว้ข้างกายนะ',
    ],
  },
  {
    id: 'love',
    label: 'ความรัก & เสน่ห์',
    baseIdx: 5,
    house: 'ช่องคู่ครอง (ปัตนิ)',
    themeGradient: 'from-[#500724] via-[#701A75] to-[#4C1D95]',
    quotes: [
      'ออร่าเมตตามหานิยมจับสุด ๆ วันนี้ใครเห็นก็เอ็นดูอยากช่วยเหลือ 💖',
      'ยิ้มรับพลังงานดี ๆ คนที่ใช่และกัลยาณมิตรกำลังเดินทางเข้ามา',
      'ใจที่ผ่อนคลายจะดึงดูดเรื่องดี ๆ เข้ามาหาคุณเองเสมอ 🌸',
    ],
  },
  {
    id: 'shield',
    label: 'คุ้มครอง & แก้ชง',
    baseIdx: 3,
    house: 'ช่องฐานชีวิต (พันธุ)',
    themeGradient: 'from-[#064E3B] via-[#3B0764] to-[#1E293B]',
    quotes: [
      'กางโล่ทองคำให้เรียบร้อย! เรื่องติดขัดจะคลี่คลายกลายเป็นเรื่องเบา 🛡️',
      'ไม่ต้องกังวลนะ เราคำนวณเกราะสลายจุดปะทะให้คุณครบแล้ว',
      'ขอให้วันนี้เป็นวันที่ใจดีและปลอดภัยกับคุณในทุกก้าวเดิน ✨',
    ],
  },
];

// สำรับไพ่พลังใจประจำวัน (Daily Vibe Tarot Deck)
const DAILY_VIBE_DECK = [
  {
    title: 'THE EMPRESS OF WEALTH',
    thaiTitle: 'ไพ่จักรพรรดินีเรียกทรัพย์',
    symbol: '👑',
    message: 'หยิบจับอะไรก็เป็นเงินเป็นทอง มีเกณฑ์ได้รับข่าวดีเรื่องยอดขายหรือโชคลาภก้อนโต',
    action: 'แนะนำเปิดใบกำกับดวงสีทองเสริมกระแสรับทรัพย์',
  },
  {
    title: 'THE SUN OF SUCCESS',
    thaiTitle: 'ไพ่สุริยันเปิดทางรุ่ง',
    symbol: '☀️',
    message: 'พลังงานแสงสว่างกำลังส่องนำทาง อุปสรรคที่เคยติดขัดจะคลี่คลายอย่างรวดเร็ว',
    action: 'ลงมือทำโปรเจกต์สำคัญช่วงเช้าวันนี้ปังที่สุด',
  },
  {
    title: 'THE STAR OF CHARM',
    thaiTitle: 'ไพ่ดาราเมตตามหานิยม',
    symbol: '🌟',
    message: 'คำพูดและรอยยิ้มของคุณวันนี้มีเสน่ห์ดึงดูดใจ เจรจาขอความช่วยเหลือจากใครก็สำเร็จ',
    action: 'เน้นเสื้อผ้าโทนสว่างเสริมออร่าความน่าเชื่อถือ',
  },
  {
    title: 'THE CHARIOT VICTORY',
    thaiTitle: 'ไพ่ราชรถพิชิตเป้าหมาย',
    symbol: '🏆',
    message: 'ความมุ่งมั่นของคุณกำลังออกดอกผล ชนะคู่แข่งและก้าวข้ามขีดจำกัดเดิมได้สำเร็จ',
    action: 'ตั้งวอลเปเปอร์เสริมบารมีไว้หน้าจอล็อกเพื่อย้ำเป้าหมาย',
  },
  {
    title: 'THE WHEEL OF FORTUNE',
    thaiTitle: 'ไพ่กงล้อแห่งโชคชะตา',
    symbol: '🎡',
    message: 'จังหวะชีวิตกำลังหมุนเข้าสู่จุดที่ได้เปรียบ โอกาสดี ๆ จะเข้ามาแบบไม่ทันตั้งตัว',
    action: 'เปิดใจรับข้อเสนอใหม่ ๆ ที่เข้ามาในวันนี้',
  },
  {
    title: 'THE GUARDIAN SHIELD',
    thaiTitle: 'ไพ่เทพคุ้มครองแคล้วคลาด',
    symbol: '🛡️',
    message: 'สิ่งศักดิ์สิทธิ์ประจำตัวกำลังปกปักรักษา เรื่องร้ายจะกลายเป็นดี ปลอดภัยทุกเส้นทาง',
    action: 'สวดคาถากำกับดวง 3 จบก่อนออกจากบ้าน',
  },
  {
    title: 'THE ACE OF PENTACLES',
    thaiTitle: 'ไพ่หนึ่งเหรียญเปิดขุมทรัพย์',
    symbol: '🪙',
    message: 'จุดเริ่มต้นของรายรับก้อนใหม่หรือช่องทางทำเงินใหม่กำลังเปิดประตูต้อนรับคุณ',
    action: 'จดไอเดียที่แวบเข้ามาวันนี้แล้วลงมือทำทันที',
  },
];

const HOUSE_LABELS = ['ตัวตน', 'การเงิน', 'สังคม', 'ครอบครัว', 'โอกาส', 'คู่ครอง', 'การงาน'];

// ==========================================
// 2. คอมโพเนนต์มาสคอต Chibi ประจำปีนักษัตร
// ==========================================
function SpiritCompanion({ zodiacIndex, focusId, vibeNum, onTap }) {
  const zodiac = ZODIAC_DATA[zodiacIndex] || ZODIAC_DATA[11];
  const isHighVibe = vibeNum >= 88;

  return (
    <button
      type="button"
      onClick={onTap}
      className="relative group focus:outline-none cursor-pointer animate-companion select-none"
      title="แตะที่ตัวน้องเพื่อรับคำอวยพรเพิ่ม"
    >
      <div
        className={`absolute -inset-2 rounded-full blur-md transition-opacity duration-500 ${
          isHighVibe ? 'bg-amber-300/60 opacity-90' : 'bg-purple-300/50 opacity-75'
        }`}
      />

      <svg viewBox="0 0 120 120" className="w-24 h-24 relative z-10 drop-shadow-md">
        <defs>
          <radialGradient id="bodyGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor={zodiac.bodyColor} />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
          <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {zodiac.earType === 'long' ? (
          <>
            <ellipse cx="42" cy="24" rx="8" ry="20" fill="url(#bodyGrad)" transform="rotate(-10 42 24)" />
            <ellipse cx="42" cy="24" rx="4" ry="14" fill={zodiac.earInner} transform="rotate(-10 42 24)" />
            <ellipse cx="78" cy="24" rx="8" ry="20" fill="url(#bodyGrad)" transform="rotate(10 78 24)" />
            <ellipse cx="78" cy="24" rx="4" ry="14" fill={zodiac.earInner} transform="rotate(10 78 24)" />
          </>
        ) : zodiac.earType === 'horn' ? (
          <>
            <path d="M36 36 Q26 18 42 24 Z" fill="url(#goldGrad)" />
            <path d="M84 36 Q94 18 78 24 Z" fill="url(#goldGrad)" />
            <circle cx="37" cy="37" r="9" fill="url(#bodyGrad)" />
            <circle cx="83" cy="37" r="9" fill="url(#bodyGrad)" />
          </>
        ) : zodiac.earType === 'crown' ? (
          <>
            <path d="M48 24 L54 12 L60 22 L66 12 L72 24 Z" fill="url(#goldGrad)" />
            <circle cx="36" cy="38" r="10" fill="url(#bodyGrad)" />
            <circle cx="84" cy="38" r="10" fill="url(#bodyGrad)" />
          </>
        ) : (
          <>
            <circle cx="35" cy="35" r="12" fill="url(#bodyGrad)" />
            <circle cx="35" cy="35" r="7" fill={zodiac.earInner} />
            <circle cx="85" cy="35" r="12" fill="url(#bodyGrad)" />
            <circle cx="85" cy="35" r="7" fill={zodiac.earInner} />
          </>
        )}

        <path d="M36 78 C36 64 84 64 84 78 L88 104 C88 110 32 110 32 104 Z" fill="url(#robeGrad)" />
        <path d="M46 72 L60 86 L74 72" fill="none" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />

        <ellipse cx="60" cy="52" rx="30" ry="25" fill="url(#bodyGrad)" />

        <ellipse cx="42" cy="57" rx="5.5" ry="3.2" fill="#F472B6" opacity="0.55" />
        <ellipse cx="78" cy="57" rx="5.5" ry="3.2" fill="#F472B6" opacity="0.55" />

        {isHighVibe ? (
          <>
            <path d="M43 49 Q48 43 53 49" fill="none" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
            <path d="M67 49 Q72 43 77 49" fill="none" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="48" cy="49" r="4" fill="#1E1B4B" />
            <circle cx="46.8" cy="47.5" r="1.4" fill="#FFFFFF" />
            <circle cx="72" cy="49" r="4" fill="#1E1B4B" />
            <circle cx="70.8" cy="47.5" r="1.4" fill="#FFFFFF" />
          </>
        )}

        {zodiac.earType === 'pig' ? (
          <g>
            <ellipse cx="60" cy="56" rx="7" ry="4.8" fill="#F472B6" />
            <circle cx="57.8" cy="56" r="1.3" fill="#831843" />
            <circle cx="62.2" cy="56" r="1.3" fill="#831843" />
            <path d="M55 64 Q60 68 65 64" fill="none" stroke="#831843" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <circle cx="60" cy="55" r="2.3" fill="#4C1D95" />
            <path d="M54 60 Q60 66 66 60" fill="none" stroke="#4C1D95" strokeWidth="2.3" strokeLinecap="round" />
          </g>
        )}

        {focusId === 'wealth' && (
          <g transform="translate(42, 82)">
            <path d="M4 10 Q18 20 32 10 L28 18 Q18 24 8 18 Z" fill="url(#goldGrad)" />
            <ellipse cx="18" cy="10" rx="9" ry="4.5" fill="#FEF08A" />
          </g>
        )}
        {focusId === 'career' && (
          <g transform="translate(76, 66)">
            <line x1="8" y1="36" x2="8" y2="10" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="8" cy="8" r="6" fill="#F59E0B" />
            <circle cx="8" cy="8" r="2.5" fill="#FEF9C3" />
          </g>
        )}
        {focusId === 'love' && (
          <g transform="translate(48, 82)">
            <path
              d="M12 20 C12 20 2 13 2 7 C2 3.5 5 1.5 8 1.5 C10 1.5 11.5 2.8 12 4 C12.5 2.8 14 1.5 16 1.5 C19 1.5 22 3.5 22 7 C22 13 12 20 12 20 Z"
              fill="#FB7185"
            />
          </g>
        )}
        {focusId === 'shield' && (
          <g transform="translate(45, 79)">
            <path
              d="M15 2 L27 6 V14 C27 21 21 25 15 27 C9 25 3 21 3 14 V6 Z"
              fill="url(#goldGrad)"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <path d="M15 8 V20 M10 14 H20" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        <circle cx="37" cy="88" r="6" fill="url(#bodyGrad)" />
        <circle cx="83" cy="88" r="6" fill="url(#bodyGrad)" />

        <path d="M18 22 L20 27 L25 29 L20 31 L18 36 L16 31 L11 29 L16 27 Z" fill="#FBBF24" />
        <path d="M102 18 L103.5 21.5 L107 23 L103.5 24.5 L102 28 L100.5 24.5 L97 23 L100.5 21.5 Z" fill="#F472B6" />
      </svg>

      <span className="block text-[9px] font-bold text-purple-800 bg-white/90 px-2 py-0.5 rounded-full shadow-sm border border-purple-100 -mt-1 relative z-20">
        แตะคุยกับน้อง
      </span>
    </button>
  );
}

// ==========================================
// 3. ฐานข้อมูลคอลเลกชัน & องค์เทพ
// ==========================================
const ART_STYLES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'chinese', label: 'เทพจีน (Gongbi)' },
  { id: 'hindu', label: 'เทพฮินดู (Baby/Divine)' },
  { id: 'thai', label: 'สายมูไทย' },
  { id: 'minimal', label: 'ลายเส้นมินิมอล' },
];

const DEITY_DATABASE = [
  {
    id: 'caishen',
    category: 'chinese',
    styleTag: 'Gongbi Grace',
    name: 'เทพเจ้าไฉ่ซิงเอี๊ย',
    focus: ['wealth', 'career'],
    specialty: 'โชคลาภ เงินทองไหลมาเทมา ปิดยอดขายปัง',
    bgGradient: 'from-[#2A0808] via-[#4A1212] to-[#120A06]',
    accentHex: '#FBBF24',
    mantra: 'โอม ชัมภาลา จาเลนไน เย สวาฮา (สวด 9 จบ)',
    tip: 'ตั้งภาพช่วงเช้า หันหน้าทิศตะวันออก ตั้งจิตขอเรื่องสภาพคล่องและโชคลาภก้อนใหญ่',
  },
  {
    id: 'mazu',
    category: 'chinese',
    styleTag: 'Gongbi Grace',
    name: 'เจ้าแม่ทับทิม (มาจู่)',
    focus: ['wealth', 'shield', 'career'],
    specialty: 'ค้าขายออนไลน์ ธุรกิจราบรื่น แคล้วคลาดปลอดภัย',
    bgGradient: 'from-[#08242B] via-[#103B42] to-[#091216]',
    accentHex: '#5EEAD4',
    mantra: 'นำ มอ เทียน โหว เซี้ย บ้อ (ขอพรค้าขายราบรื่น)',
    tip: 'ตั้งภาพช่วงเช้า 07:00 - 09:00 น. จะช่วยเปิดกระแสน้ำแห่งทรัพย์ได้ดีที่สุด',
  },
  {
    id: 'guanyu',
    category: 'chinese',
    styleTag: 'Divine Realism',
    name: 'เทพเจ้ากวนอู',
    focus: ['career', 'shield', 'wealth'],
    specialty: 'ผู้ใหญ่ซัพพอร์ต ชนะคู่แข่ง บริวารซื่อสัตย์',
    bgGradient: 'from-[#182218] via-[#273826] to-[#0D110D]',
    accentHex: '#F59E0B',
    mantra: 'นำ มอ ไต่ ซื้อ ไต่ ปุย กวน อิม ผ่อ สัก (ขอเดชะบารมีคุ้มครอง)',
    tip: 'เหมาะสำหรับเจ้าของกิจการหรือผู้ที่ต้องเจรจาต่อรองโปรเจกต์สำคัญ',
  },
  {
    id: 'guanyin',
    category: 'chinese',
    styleTag: 'Gongbi Grace',
    name: 'พระโพธิสัตว์กวนอิม',
    focus: ['love', 'shield', 'wealth'],
    specialty: 'เมตตามหานิยม คนรักใคร่เอ็นดู ปลดล็อกอุปสรรค',
    bgGradient: 'from-[#1F242D] via-[#2F3744] to-[#111318]',
    accentHex: '#E2E8F0',
    mantra: 'โอม มณี ปัทเม หุม (ภาวนา 9 จบ แผ่เมตตา)',
    tip: 'ทำใจให้สบายก่อนตั้งภาพ จะช่วยดึงดูดกัลยาณมิตรและคนอุปถัมภ์เข้ามา',
  },
  {
    id: 'ganesha',
    category: 'hindu',
    styleTag: 'Baby God / Divine',
    name: 'พระพิฆเนศ (ปางเสวยสุข)',
    focus: ['wealth', 'career', 'shield'],
    specialty: 'ความสำเร็จ ขจัดอุปสรรค งานครีเอทีฟ & ธุรกิจปัง',
    bgGradient: 'from-[#2C1408] via-[#4A220E] to-[#120905]',
    accentHex: '#FDBA74',
    mantra: 'โอม ศรี คเณศายะ นะมะฮา (สวด 9 จบ)',
    tip: 'ตั้งภาพวันอังคารหรือวันพฤหัสบดีช่วงเช้า ถวายน้ำเปล่าสะอาดบนโต๊ะทำงาน',
  },
  {
    id: 'lakshmi',
    category: 'hindu',
    styleTag: 'Divine Realism',
    name: 'พระแม่ลักษมี',
    focus: ['wealth', 'love'],
    specialty: 'ความมั่งคั่ง ร่ำรวยเงินทอง และเสน่ห์เมตตาสูงสุด',
    bgGradient: 'from-[#2E0E24] via-[#4D173C] to-[#130710]',
    accentHex: '#F9A8D4',
    mantra: 'โอม ชยะ ศรี ลักษมี มาตา (สวด 8 จบ)',
    tip: 'ตั้งภาพในวันศุกร์ จัดตำแหน่งภาพให้เห็นตัวเลขมงคลชัดเจนบริเวณขอบล่าง',
  },
  {
    id: 'kubera',
    category: 'hindu',
    styleTag: 'Baby God',
    name: 'ท้าวกุเวร (ธนบดี)',
    focus: ['wealth'],
    specialty: 'ราชาแห่งขุมทรัพย์ เก็บเงินอยู่ เพิ่มพูนทรัพย์สิน',
    bgGradient: 'from-[#1D1B09] via-[#363210] to-[#0E0D05]',
    accentHex: '#FDE047',
    mantra: 'โอม ยักษายะ กุเวรายะ ไวศรวณายะ ธนธานยาธิปตะเย นะมะฮา (9 จบ)',
    tip: 'เหมาะกับคนที่หาเงินเก่งแต่อยากเก็บเงินให้อยู่ ตั้งภาพแล้วหมั่นทำบุญน้ำดื่ม',
  },
  {
    id: 'wessuwan',
    category: 'thai',
    styleTag: 'Sacred Line',
    name: 'ท้าวเวสสุวรรณ',
    focus: ['wealth', 'shield'],
    specialty: 'กันภัย กันชง เรียกทรัพย์ก้อนโต ปลดหนี้สิน',
    bgGradient: 'from-[#0D1F18] via-[#16382B] to-[#07100C]',
    accentHex: '#6EE7B7',
    mantra: 'อิติปิ โส ภะคะวา ยมมะราชาโน ท้าวเวสสุวรรณโณ... นะโม พุทธายะ (9 จบ)',
    tip: 'ตั้งภาพในวันพฤหัสบดีหรือวันเสาร์ สวดบูชา 9 จบแล้วอธิษฐานเปิดทางทรัพย์',
  },
  {
    id: 'naga',
    category: 'thai',
    styleTag: 'Sacred Line',
    name: 'พญานาคราช (ปู่ศรีสุทโธ)',
    focus: ['wealth', 'career', 'love'],
    specialty: 'โชคลาภฉับพลัน เสน่ห์เมตตา งานออนไลน์รุ่งเรือง',
    bgGradient: 'from-[#07211E] via-[#0E3D37] to-[#051210]',
    accentHex: '#34D399',
    mantra: 'กายะ วาจะ จิตตัง อะหังวันทา นาคาธิบดี ศรีสุทโธ วิสุทธิเทวา ปูเชมิ (3 จบ)',
    tip: 'ตั้งภาพในวันขึ้น 15 ค่ำ จะช่วยเสริมพลังโชคลาภแบบทวีคูณ',
  },
  {
    id: 'cosmic_gold',
    category: 'minimal',
    styleTag: 'Sacred Line',
    name: 'คลื่นพลังงานทองคำ (Stealth Minimal)',
    focus: ['wealth', 'career', 'love', 'shield'],
    specialty: 'เรียบหรูดูแพง กลมกลืนเหมือนภาพอาร์ต ไม่ดูเป็นสายมู',
    bgGradient: 'from-[#18181B] via-[#27241D] to-[#09090B]',
    accentHex: '#D4AF37',
    mantra: 'ใช้คาถาประจำวันเกิด ภาวนา 3 หรือ 9 จบก่อนปลดล็อกหน้าจอครั้งแรกของวัน',
    tip: 'ปิดโหมด Perspective Zoom ตอนตั้งภาพเพื่อให้แถบตัวเลขมุมล่างคมชัดพอดีจอ',
  },
];

// ==========================================
// 4. สมองกลคำนวณเลข ๗ ตัว ๙ ฐาน สัตตะนวดารา
// ==========================================
const PLANETS = {
  1: { name: 'พระอาทิตย์', dayName: 'วันอาทิตย์', color: 'สีแดงทับทิม / สีส้มทอง', luckyDigits: '1, 5, 6', mantra: 'อุ อา กะ สะ (หัวใจเศรษฐี)' },
  2: { name: 'พระจันทร์', dayName: 'วันจันทร์', color: 'สีขาวนวล / สีเหลืองครีม', luckyDigits: '2, 4, 6', mantra: 'นะ ชา ลี ติ (เมตตามหานิยม)' },
  3: { name: 'พระอังคาร', dayName: 'วันอังคาร', color: 'สีชมพูกลีบบัว / สีโอลด์โรส', luckyDigits: '3, 5, 8', mantra: 'อะ สัง วิ สุ โล ปุ สะ พุ ภะ' },
  4: { name: 'พระพุธ', dayName: 'วันพุธ', color: 'สีเขียวมรกต / สีเขียวใบไม้', luckyDigits: '4, 2, 5', mantra: 'ปิ โย เท วะ มะ นุส สา นัง' },
  5: { name: 'พระพฤหัสบดี', dayName: 'วันพฤหัสบดี', color: 'สีแสด / สีทองแชมเปญ', luckyDigits: '5, 1, 9', mantra: 'ภะ สัม สัม วิ สะ เท ภะ' },
  6: { name: 'พระศุกร์', dayName: 'วันศุกร์', color: 'สีฟ้าคราม / สีน้ำเงินไพลิน', luckyDigits: '6, 2, 3', mantra: 'วา โธ โน อะ มะ มะ วา' },
  7: { name: 'พระเสาร์', dayName: 'วันเสาร์', color: 'สีม่วงเม็ดมะปราง / สีดำนิล', luckyDigits: '7, 8, 9', mantra: 'โส มา ณะ กะ ริ ถา โธ' },
};

const BASE4_POWERS = {
  6: 'กำลังพระอาทิตย์ (6) — เด่นความเป็นผู้นำ & ออร่า',
  7: 'กำลังพระจันทร์ (7) — เด่นเสน่ห์เมตตา คนเอ็นดู',
  8: 'กำลังพระอังคาร (8) — เด่นความกล้า ลุยแล้วปัง',
  9: 'กำลังพระเกตุ (9) — เซนส์แรง สิ่งศักดิ์สิทธิ์คุ้มครอง',
  10: 'กำลังพระเสาร์ (10) — อึดถึกทน สร้างฐานะมั่นคง',
  11: 'กำลังราชาโชค (11) — มีผู้ใหญ่ซัพพอร์ต โชคเข้าข้าง',
  12: 'กำลังพระราหู (12) — ไหวพริบดี ได้โชคลาภแบบฟลุก ๆ',
  13: 'กำลังมหาอุจจ์ (13) — ยกระดับชีวิต พุ่งสู่จุดสูงสุด',
  14: 'กำลังจักรพรรดิ (14) — มั่งคั่งสมบูรณ์พร้อมรอบด้าน',
  15: 'กำลังพระจันทร์เต็มดวง (15) — สมองไว หาเงินเก่ง',
  16: 'กำลังโสฬสมงคล (16) — มงคลสูงสุด แคล้วคลาดปลอดภัย',
  17: 'กำลังพระพุธ (17) — ปิดการขายเก่ง เจรจาเป็นเงิน',
  18: 'กำลังมหาจักร (18) — ยิ่งลุยยิ่งรวย สำเร็จแบบยิ่งใหญ่',
  19: 'กำลังพระพฤหัสบดี (19) — ปัญญาดี มีคนนับถือ',
  20: 'กำลังพระเสาร์ใหญ่ (20) — ทรัพย์สินชิ้นใหญ่ บ้าน/รถ/ที่ดิน',
  21: 'กำลังพระศุกร์ (21) — การเงินคล่องตัว ชีวิตแฮปปี้',
};

const ENEMY_PAIRS = [
  { pair: [1, 3], desc: 'สลายคู่ปะทะ 1-3 ลดอารมณ์ร้อนและเรื่องกดดัน' },
  { pair: [1, 6], desc: 'สลายคู่ปะทะ 1-6 อุดรอยรั่วเรื่องเงินและความรัก' },
  { pair: [2, 3], desc: 'สลายคู่ปะทะ 2-3 ลดความขัดแย้งกับคนรอบข้าง' },
  { pair: [2, 5], desc: 'สลายคู่ปะทะ 2-5 เพิ่มความมั่นใจ ผู้ใหญ่เมตตา' },
  { pair: [3, 7], desc: 'สลายคู่ปะทะ 3-7 ผ่อนหนักเป็นเบา ลดงานชนกัน' },
  { pair: [4, 7], desc: 'สลายคู่ปะทะ 4-7 เซฟเรื่องเอกสาร สัญญา และคำพูด' },
  { pair: [5, 7], desc: 'สลายคู่ปะทะ 5-7 ปรับตัวไว รับมือทุกการเปลี่ยนแปลง' },
  { pair: [6, 7], desc: 'สลายคู่ปะทะ 6-7 คลายความเครียด เปิดทางรับทรัพย์' },
];

const HARMONY_PAIRS = [
  { pair: [1, 5], desc: 'คู่มิตร 1-5 ผู้ใหญ่ซัพพอร์ต บารมีหนุนความสำเร็จ' },
  { pair: [1, 6], desc: 'คู่สมพล 1-6 ดึงดูดเงินทองและเสน่ห์เมตตา' },
  { pair: [2, 4], desc: 'คู่มิตร 2-4 พูดจาเป็นเงินเป็นทอง ปิดดีลไว' },
  { pair: [2, 6], desc: 'คู่ธาตุน้ำ 2-6 เสน่ห์แรง โชคลาภไหลมาเทมา' },
  { pair: [3, 5], desc: 'คู่ธาตุ 3-5 ไอเดียบรรเจิด ลุยงานสำเร็จตามเป้า' },
  { pair: [3, 6], desc: 'คู่มิตร 3-6 ความขยันเปลี่ยนเป็นเงินก้อนโต' },
  { pair: [4, 5], desc: 'คู่ธาตุดิน 4-5 ความรู้และคำพูดสร้างความมั่งคั่ง' },
  { pair: [5, 6], desc: 'คู่ทรัพย์คู่โชค 5-6 การเงินหมุนคล่องตัวสุด ๆ' },
];

function getThaiAstroDay(dateStr, timeStr) {
  const date = new Date(`${dateStr}T${timeStr || '12:00'}:00`);
  if (date.getHours() < 6) {
    date.setDate(date.getDate() - 1);
  }
  return date.getDay() + 1;
}

function getLunarMonthAndYearDigits(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  let thaiMonth = month + 1;
  if (day < 15) thaiMonth -= 1;
  if (thaiMonth <= 0) thaiMonth += 12;
  if (thaiMonth > 12) thaiMonth -= 12;
  const monthDigit = ((thaiMonth - 1) % 7) + 1;

  let astroYear = year;
  if (month < 4 || (month === 4 && day < 13)) {
    astroYear -= 1;
  }
  const zodiacIndex = (((astroYear - 1984) % 12) + 12) % 12;
  const yearDigit = (zodiacIndex % 7) + 1;

  return { monthDigit, yearDigit, zodiacIndex, zodiacName: ZODIAC_DATA[zodiacIndex].name };
}

function generate7Row(startDigit) {
  const row = [];
  for (let i = 0; i < 7; i++) {
    row.push(((startDigit - 1 + i) % 7) + 1);
  }
  return row;
}

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}.${parts[1].charAt(0)}.`;
  }
  return fullName.trim().slice(0, 3).toUpperCase();
}

function calculateSattaReceipt({ fullName, birthDay, birthMonth, birthYearBE, birthTime, focusId }) {
  const adYear = Number(birthYearBE) - 543;
  const paddedDay = String(birthDay).padStart(2, '0');
  const birthDateAD = `${adYear}-${birthMonth}-${paddedDay}`;

  const monthObj = THAI_MONTHS.find((m) => m.val === birthMonth);
  const thaiBirthDisplay = `${Number(birthDay)} ${monthObj ? monthObj.label : ''} พ.ศ. ${birthYearBE}`;
  const thaiBirthShort = `${Number(birthDay)} ${monthObj ? monthObj.short : ''} ${birthYearBE}`;

  const dayDigit = getThaiAstroDay(birthDateAD, birthTime);
  const { monthDigit, yearDigit, zodiacIndex, zodiacName } = getLunarMonthAndYearDigits(birthDateAD);

  const base1 = generate7Row(dayDigit);
  const base2 = generate7Row(monthDigit);
  const base3 = generate7Row(yearDigit);
  const base4 = base1.map((val, idx) => val + base2[idx] + base3[idx]);

  const focusObj = FOCUS_MODES.find((f) => f.id === focusId) || FOCUS_MODES[0];
  const focusPowerVal = base4[focusObj.baseIdx];
  const attaPowerVal = base4[0];

  const basePowerText = BASE4_POWERS[attaPowerVal] || `กำลังพระเคราะห์ (${attaPowerVal})`;
  const focusPowerText = BASE4_POWERS[focusPowerVal] || `กำลัง (${focusPowerVal})`;

  let foundHarmony = HARMONY_PAIRS.find(
    (h) =>
      (h.pair.includes(dayDigit) && h.pair.includes(monthDigit)) ||
      (h.pair.includes(monthDigit) && h.pair.includes(yearDigit)) ||
      (h.pair.includes(dayDigit) && h.pair.includes(yearDigit))
  );
  if (!foundHarmony) {
    foundHarmony = {
      pair: [dayDigit, yearDigit],
      desc: `หนุนฐาน ${dayDigit}-${yearDigit} เปิดรับโอกาสและพลังงานบวก`,
    };
  }

  let foundEnemy = ENEMY_PAIRS.find(
    (e) =>
      (e.pair.includes(dayDigit) && e.pair.includes(monthDigit)) ||
      (e.pair.includes(monthDigit) && e.pair.includes(yearDigit)) ||
      (e.pair.includes(dayDigit) && e.pair.includes(yearDigit))
  );
  if (!foundEnemy) {
    foundEnemy = {
      pair: [base1[2], base3[2]],
      desc: `ปรับสมดุลจุดปะทะ (${base1[2]}-${base3[2]}) ลดเรื่องติดขัด`,
    };
  }

  const calcScore = (val) => Math.min(100, Math.max(76, Math.round(70 + (val / 21) * 30)));
  const dailyScores = {
    career: calcScore(base4[6]),
    wealth: calcScore(base4[1]),
    love: calcScore(base4[5]),
    health: calcScore(base4[3]),
  };

  const totalBase4 = base4.reduce((sum, n) => sum + n, 0);
  const vibeNum = Math.min(99, Math.max(82, Math.round((totalBase4 / 105) * 100)));

  // เลือกไพ่พลังใจประจำวันจากฐาน ๔ + วันปัจจุบัน
  const todaySeed = new Date().getDate() + focusPowerVal;
  const dailyTarotCard = DAILY_VIBE_DECK[todaySeed % DAILY_VIBE_DECK.length];

  const primaryPlanet = PLANETS[dayDigit];
  const luckyCode4 = `${dayDigit}${monthDigit}${yearDigit}${focusPowerVal % 10}`;
  const docId = `MD-${dayDigit}${monthDigit}${yearDigit}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    docId,
    timestamp: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }),
    customerName: fullName || 'คุณลูกค้า MuuDI',
    initials: getInitials(fullName || 'MD'),
    thaiBirthDisplay,
    thaiBirthShort,
    zodiacIndex,
    zodiacName,
    birthTime: birthTime || '12:00',
    focusId,
    focusLabel: focusObj.label,
    focusHouse: focusObj.house,
    lifeCode: `${dayDigit} - ${monthDigit} - ${yearDigit}`,
    tableRows: { base1, base2, base3, base4 },
    basePower: basePowerText,
    luckyCode4,
    primaryPlanet,
    dailyScores,
    dailyTarotCard,
    items: [
      {
        code: `FC-0${focusPowerVal}`,
        name: `ปลุกพลัง${focusObj.label}`,
        detail: `${focusObj.house}: ${focusPowerText}`,
        qty: 'MAX',
      },
      {
        code: `ST-${dayDigit}${monthDigit}`,
        name: 'หนุนคู่ธาตุ & คู่สมพล',
        detail: foundHarmony.desc,
        qty: '100%',
      },
      {
        code: `DF-${foundEnemy.pair.join('')}`,
        name: 'เกราะสลายจุดปะทะ (แก้เคล็ด)',
        detail: foundEnemy.desc,
        qty: 'ACTIVE',
      },
      {
        code: `CL-0${dayDigit}`,
        name: 'สีมงคล & เลขนำโชคประจำตัว',
        detail: `${primaryPlanet.color} (เลขเด่น: ${primaryPlanet.luckyDigits})`,
        qty: luckyCode4,
      },
    ],
    vibeNum,
    vibeScore: `${vibeNum} / 100`,
    mantra: primaryPlanet.mantra,
  };
}

function ShirtIcon({ color }) {
  return (
    <svg viewBox="0 0 36 36" className="w-8 h-8 mx-auto drop-shadow-sm">
      <path
        d="M11 6 L6 10 L9 15 L12 13 L12 30 L24 30 L24 13 L27 15 L30 10 L25 6 C23 8 20.5 9 18 9 C15.5 9 13 8 11 6 Z"
        fill={color}
        stroke="#E4E4E7"
        strokeWidth="1"
      />
    </svg>
  );
}

// ==========================================
// 5. หน้าจอหลัก MuuDI Mobile App UI
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // State สำหรับฟีเจอร์ที่ 2 (การ์ดไพ่พลิก 3D) & ฟีเจอร์ที่ 3 (Micro Animations หลอดพลัง)
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'กัมพล เจนจุลพร',
    birthDay: '26',
    birthMonth: '03',
    birthYearBE: '2526',
    birthTime: '12:00',
    focusId: 'wealth',
  });

  const [receiptData, setReceiptData] = useState(() => calculateSattaReceipt(formData));

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDeityId, setSelectedDeityId] = useState('caishen');
  const [wallpaperImage, setWallpaperImage] = useState(null);
  const [bgDimmer, setBgDimmer] = useState(25);
  const [wpOptions, setWpOptions] = useState({
    showName: true,
    useInitialsOnly: true,
    showLuckyCode: true,
    showBase4Bar: true,
  });

  const [savedVault, setSavedVault] = useState(() => {
    try {
      const saved = localStorage.getItem('muudi_vault');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [copiedGuide, setCopiedGuide] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportRef = useRef(null);
  const fileInputRef = useRef(null);

  // Trigger Micro Animation ให้หลอดพลังวิ่งเติมเต็มเมื่อเปิดหน้าแรกหรือเปลี่ยนโฟกัส
  useEffect(() => {
    if (activeTab === 'home') {
      setAnimateBars(false);
      const timer = setTimeout(() => setAnimateBars(true), 120);
      return () => clearTimeout(timer);
    }
  }, [activeTab, formData.focusId, receiptData.docId]);

  useEffect(() => {
    try {
      localStorage.setItem('muudi_vault', JSON.stringify(savedVault));
    } catch {
      // ignore
    }
  }, [savedVault]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = calculateSattaReceipt(formData);
    setReceiptData(updated);
    setIsEditingProfile(false);
    setIsCardFlipped(false);
  };

  const handleChangeFocus = (focusId) => {
    const nextForm = { ...formData, focusId };
    setFormData(nextForm);
    setReceiptData(calculateSattaReceipt(nextForm));
    setQuoteIdx(0);
    setIsCardFlipped(false);
  };

  const currentFocusObj = FOCUS_MODES.find((f) => f.id === formData.focusId) || FOCUS_MODES[0];
  const currentZodiacObj = ZODIAC_DATA[receiptData.zodiacIndex] || ZODIAC_DATA[11];
  const companionMessage = currentFocusObj.quotes[quoteIdx % currentFocusObj.quotes.length];

  const availableDeities = DEITY_DATABASE.filter(
    (d) => selectedCategory === 'all' || d.category === selectedCategory
  ).sort((a, b) => {
    const aMatch = a.focus.includes(formData.focusId) ? 1 : 0;
    const bMatch = b.focus.includes(formData.focusId) ? 1 : 0;
    return bMatch - aMatch;
  });

  const activeDeity =
    DEITY_DATABASE.find((d) => d.id === selectedDeityId) || availableDeities[0] || DEITY_DATABASE[0];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setWallpaperImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const saveToVault = (typeLabel) => {
    const newItem = {
      id: Date.now(),
      type: typeLabel,
      docId: receiptData.docId,
      customerName: receiptData.customerName,
      focusLabel: receiptData.focusLabel,
      luckyCode4: receiptData.luckyCode4,
      deityName: activeDeity.name,
      createdAt: new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }),
      snapshotData: receiptData,
    };
    setSavedVault((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  const handleDownloadImage = async (modeType) => {
    if (!exportRef.current || !receiptData) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: modeType === 'wallpaper' ? '#09090B' : '#F6F3FA',
      });
      const link = document.createElement('a');
      const prefix = modeType === 'wallpaper' ? 'MuuDI-Wallpaper-1080x2400' : 'MuuDI-Receipt';
      link.download = `${prefix}-${receiptData.customerName}-${receiptData.docId}.png`;
      link.href = dataUrl;
      link.click();

      saveToVault(modeType === 'wallpaper' ? 'วอลเปเปอร์มงคล' : 'ใบกำกับดวง');
    } catch (err) {
      console.error('Export failed:', err);
      alert('ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareImage = async (modeType) => {
    if (!exportRef.current || !receiptData) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: modeType === 'wallpaper' ? '#09090B' : '#F6F3FA',
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `MuuDI-${receiptData.docId}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `MuuDI - คุณ${receiptData.customerName}`,
          text: `ใบกำกับดวงและวอลเปเปอร์มงคล (${receiptData.docId})`,
          files: [file],
        });
      } else {
        handleDownloadImage(modeType);
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const guideMessage = `✨ คู่มือเปิดพลังงานวอลเปเปอร์มงคล MuuDI ✨
คุณ${receiptData.customerName} (${receiptData.focusLabel})
รหัสพลังงานประจำตัว: ${receiptData.luckyCode4} | พลังฐาน ๔: ${receiptData.tableRows.base4.join('-')}

🙏 1. บทสวดบูชาองค์เทพ (${activeDeity.name}):
"${activeDeity.mantra}"

📿 2. คาถากำกับดวงประจำวันเกิด (${receiptData.primaryPlanet.dayName}):
"${receiptData.mantra}"

📱 3. เทคนิคการตั้งวอลเปเปอร์ให้รับทรัพย์เต็มกำลัง:
• ภาพขนาดหน้าจอมือถือเต็มจอ (1080x2400 px) เว้นพื้นที่ด้านบนให้นาฬิกาเรียบร้อยแล้ว
• ตอนกดตั้งเป็นหน้าจอล็อก (Lock Screen) ให้ใช้ 2 นิ้ว "บีบย่อภาพให้สุดขอบ" และปิดโหมดขยายตามการเคลื่อนไหว (Perspective Zoom) เพื่อไม่ให้เลขมงคลมุมล่างตกขอบ
• เคล็ดลับเสริมดวง: ${activeDeity.tip}`;

  const handleCopyGuide = () => {
    navigator.clipboard.writeText(guideMessage);
    setCopiedGuide(true);
    setTimeout(() => setCopiedGuide(false), 2500);
  };

  const todayColors = DAILY_SHIRT_COLORS[new Date().getDay()];
  const todayThaiDate = new Date().toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#E9E4F2] flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-[#F6F3FA] text-zinc-900 shadow-2xl relative pb-28 overflow-x-hidden">
        {/* ================= Header โลโก้ MuuDI ================= */}
        <header className="px-5 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#9333EA] to-[#EC4899] flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-purple-500/25">
              M<span className="text-amber-300 text-xs">✦</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-zinc-900">MuuDI</span>
              <span className="ml-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                มูดีพร้อมใช้
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-xs font-medium text-purple-700 bg-white border border-purple-200 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 hover:bg-purple-50 transition cursor-pointer active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingProfile ? 'ปิดฟอร์ม' : 'แก้ข้อมูลเกิด'}</span>
          </button>
        </header>

        {/* ================= ฟอร์มแก้ไขวันเกิด พ.ศ. ================= */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="mx-5 mb-4 bg-white rounded-3xl p-4 shadow-lg border border-purple-100 space-y-3 animate-fade-in"
          >
            <p className="text-xs font-bold text-purple-900">ตั้งค่าข้อมูลเจ้าชะตา (พ.ศ.)</p>
            <input
              type="text"
              required
              placeholder="ชื่อ - นามสกุล"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-[#F6F3FA] border border-purple-200 rounded-xl px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:border-purple-500"
            />
            <div className="grid grid-cols-12 gap-1.5">
              <select
                value={formData.birthDay}
                onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                className="col-span-3 bg-[#F6F3FA] border border-purple-200 rounded-xl px-2 py-2 text-xs text-zinc-900"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d).padStart(2, '0')}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={formData.birthMonth}
                onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                className="col-span-5 bg-[#F6F3FA] border border-purple-200 rounded-xl px-2 py-2 text-xs text-zinc-900"
              >
                {THAI_MONTHS.map((m) => (
                  <option key={m.val} value={m.val}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={formData.birthYearBE}
                onChange={(e) => setFormData({ ...formData, birthYearBE: e.target.value })}
                className="col-span-4 bg-[#F6F3FA] border border-purple-200 rounded-xl px-2 py-2 text-xs text-zinc-900"
              >
                {BE_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    พ.ศ. {yr}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 bg-[#F6F3FA] border border-purple-200 rounded-xl px-3 py-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                  className="bg-transparent text-xs text-zinc-900 w-full focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow cursor-pointer active:scale-95 transition"
              >
                อัปเดตดวง
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 1: หน้าแรก (HOME DASHBOARD + COMPANION + 3D TAROT FLIP)    */}
        {/* ============================================================== */}
        {activeTab === 'home' && (
          <div className="px-5 space-y-4 animate-fade-in">
            {/* ส่วนหัว: ข้อมูลวันเกิด + มาสคอต Chibi ประจำปีนักษัตร */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-[#4C1D95] leading-snug">
                  เกิด{receiptData.primaryPlanet.dayName} • {receiptData.zodiacName}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1 hover:text-purple-700 cursor-pointer"
                >
                  <span>
                    คุณ{receiptData.customerName} ({receiptData.thaiBirthShort})
                  </span>
                  <Edit3 className="w-3 h-3 text-purple-600" />
                </button>

                <div
                  onClick={() => setQuoteIdx((prev) => prev + 1)}
                  className="mt-2.5 bg-white/95 border border-purple-200/80 rounded-2xl rounded-tr-sm p-2.5 shadow-sm cursor-pointer hover:border-purple-400 active:scale-[0.99] transition relative"
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700 mb-0.5">
                    <MessageCircleHeart className="w-3 h-3 text-pink-500" />
                    <span>{currentZodiacObj.petName}</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 leading-relaxed">{companionMessage}</p>
                </div>
              </div>

              <div className="shrink-0 text-center">
                <SpiritCompanion
                  zodiacIndex={receiptData.zodiacIndex}
                  focusId={formData.focusId}
                  vibeNum={receiptData.vibeNum}
                  onTap={() => setQuoteIdx((prev) => prev + 1)}
                />
              </div>
            </div>

            {/* แถบเลือกเรื่องที่อยากโฟกัส */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-zinc-500">โฟกัสช่วงนี้ (เลือกเรื่องที่อยากเสริม)</p>
              <div className="grid grid-cols-2 gap-2">
                {FOCUS_MODES.map((m) => {
                  const active = formData.focusId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleChangeFocus(m.id)}
                      className={`py-2 px-3 rounded-2xl text-xs font-semibold border text-left transition cursor-pointer active:scale-95 ${
                        active
                          ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-md shadow-purple-500/20'
                          : 'bg-white text-zinc-600 border-purple-100 hover:border-purple-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* การ์ดหลัก "วันนี้ของฉัน + สีเสื้อมงคล + ไพ่พลิก 3D + หลอดพลังฐาน ๔" */}
            <div
              className={`bg-gradient-to-b ${currentFocusObj.themeGradient} rounded-3xl p-4 text-white shadow-xl shadow-purple-900/15 space-y-3.5 transition-all duration-500`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base">วันนี้ของฉัน</span>
                <span className="text-xs text-purple-200">{todayThaiDate}</span>
              </div>

              {/* กล่องสีเสื้อมงคล 5 ช่อง */}
              <div className="bg-white text-zinc-900 rounded-2xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-zinc-800 flex items-center gap-1">
                    <Shirt className="w-3.5 h-3.5 text-purple-600" /> สีเสื้อมงคลประจำวัน
                  </span>
                  <span className="text-[10px] text-purple-600 font-medium">
                    รหัสฐาน {receiptData.lifeCode}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1 text-center">
                  <div>
                    <ShirtIcon color={todayColors.luck} />
                    <span className="text-[11px] font-medium text-zinc-700 mt-1 block">โชค</span>
                  </div>
                  <div>
                    <ShirtIcon color={todayColors.power} />
                    <span className="text-[11px] font-medium text-zinc-700 mt-1 block">อำนาจ</span>
                  </div>
                  <div>
                    <ShirtIcon color={todayColors.money} />
                    <span className="text-[11px] font-medium text-zinc-700 mt-1 block">เงิน</span>
                  </div>
                  <div>
                    <ShirtIcon color={todayColors.support} />
                    <span className="text-[11px] font-medium text-zinc-700 mt-1 block">อุปถัมภ์</span>
                  </div>
                  <div>
                    <ShirtIcon color={todayColors.avoid} />
                    <span className="text-[11px] font-bold text-rose-600 mt-1 block">สีพักผ่อน</span>
                  </div>
                </div>
              </div>

              {/* การ์ดคู่ล่าง: ไพ่ทาโรต์พลังใจ 3D Flip & หลอดพลังฐาน ๔ */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* ฝั่งซ้าย: การ์ดเปิดไพ่พลังใจ 3D พลิกหมุนได้แบบ MUToday */}
                <div
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="perspective-1000 h-[196px] cursor-pointer select-none group"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                      isCardFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* ด้านหน้าไพ่ (คว่ำไพ่รอแตะเปิด) */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#4C1D95] rounded-2xl p-3 flex flex-col items-center justify-between border border-white/25 shadow-md">
                      <p className="text-[11px] font-bold text-white tracking-wide">
                        ไพ่พลังใจประจำวัน
                      </p>

                      {/* กราฟิกสำรับไพ่ 3 ใบซ้อนสไตล์ MUToday */}
                      <div className="relative w-24 h-20 flex items-center justify-center my-1">
                        <div className="w-12 h-16 rounded-lg bg-purple-400/30 border border-amber-200/40 -rotate-12 -translate-x-3 flex items-center justify-center">
                          <span className="text-amber-200/70 text-xs">☾</span>
                        </div>
                        <div className="w-12 h-16 rounded-lg bg-purple-400/30 border border-amber-200/40 rotate-12 translate-x-3 flex items-center justify-center">
                          <span className="text-amber-200/70 text-xs">☽</span>
                        </div>
                        <div className="w-14 h-20 rounded-xl bg-gradient-to-b from-[#5B21B6] to-[#2E1065] border-2 border-amber-300 shadow-lg absolute flex flex-col items-center justify-center group-hover:scale-105 transition">
                          <span className="text-amber-300 text-base">✦</span>
                          <span className="text-[8px] font-bold text-amber-200 tracking-widest mt-0.5">
                            MUUDI
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-gradient-to-r from-amber-300 to-amber-400 text-zinc-950 font-bold text-[11px] py-1.5 rounded-full text-center shadow">
                        แตะเพื่อเปิดไพ่
                      </div>
                    </div>

                    {/* ด้านหลังไพ่ (หงายไพ่เผยคำทำนายพลังใจ) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-b from-[#FAF5FF] to-[#EDE9FE] text-zinc-900 rounded-2xl p-3 flex flex-col justify-between border-2 border-amber-300 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{receiptData.dailyTarotCard.symbol}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900 flex items-center gap-0.5">
                          <RotateCcw className="w-2.5 h-2.5" /> พลิกกลับ
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-purple-950 leading-tight">
                          {receiptData.dailyTarotCard.thaiTitle}
                        </p>
                        <p className="text-[9.5px] text-zinc-600 mt-1 leading-snug line-clamp-3">
                          {receiptData.dailyTarotCard.message}
                        </p>
                      </div>

                      <div className="bg-purple-900 text-amber-300 rounded-lg px-2 py-1 text-[9px] font-medium text-center">
                        เลขนำโชค: <span className="font-bold">{receiptData.luckyCode4}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ฝั่งขวา: หลอดเปอร์เซ็นต์ดวงวันนี้จากฐาน ๔ (วิ่งเติมอัตโนมัติ) */}
                <div className="bg-white text-zinc-900 rounded-2xl p-3.5 flex flex-col justify-between h-[196px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800">ดวงวันนี้</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('receipt')}
                      className="text-[10px] text-purple-600 font-semibold flex items-center cursor-pointer hover:underline"
                    >
                      อ่านเพิ่ม <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5 my-auto">
                    {[
                      { label: 'การงาน', val: receiptData.dailyScores.career },
                      { label: 'การเงิน', val: receiptData.dailyScores.wealth },
                      { label: 'ความรัก', val: receiptData.dailyScores.love },
                      { label: 'สุขภาพ', val: receiptData.dailyScores.health },
                    ].map((bar) => (
                      <div key={bar.label} className="space-y-0.5">
                        <div className="flex justify-between text-[10px] font-medium text-zinc-600">
                          <span>{bar.label}</span>
                          <span className="font-bold text-purple-700">{bar.val} %</span>
                        </div>
                        <div className="h-1.5 w-full bg-purple-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6D28D9] to-[#A855F7] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: animateBars ? `${bar.val}%` : '0%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* เมนูลัด 4 ปุ่มกลม */}
            <div>
              <p className="text-sm font-bold text-zinc-800 mb-2.5">ดูดวงของคุณ</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
                >
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-700">เปิดไพ่</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('receipt')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
                >
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-purple-100 flex items-center justify-center text-amber-500 group-hover:scale-105 transition">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-700">ใบกำกับดวง</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('wallpaper')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
                >
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-purple-100 flex items-center justify-center text-pink-600 group-hover:scale-105 transition">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-700">วอลเปเปอร์</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition"
                >
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-purple-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-700">เช็กดวงใหม่</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: หน้าใบกำกับดวง (RECEIPT VIEW + PRINT ANIMATION)         */}
        {/* ============================================================== */}
        {activeTab === 'receipt' && (
          <div className="px-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#4C1D95]">ใบกำกับดวง & ตาราง ๗ ตัว ๔ ฐาน</h2>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                {receiptData.focusLabel}
              </span>
            </div>

            {/* พื้นที่ใบเสร็จพร้อมแอนิเมชันปรินต์กระดาษลงมา */}
            <div
              ref={exportRef}
              className="p-3 bg-[#F6F3FA] drop-shadow-[0_12px_25px_rgba(76,29,149,0.12)] animate-print-receipt"
            >
              <div className="h-2.5 w-full receipt-edge-top" />

              <div className="bg-[#FAF8F5] text-zinc-900 px-5 py-5 space-y-4">
                <div className="text-center border-b border-dashed border-zinc-300 pb-3.5">
                  <p className="font-bold text-xl tracking-wider text-zinc-900">MUUDI RECEIPT</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    ใบกำกับดวงและรายการเสริมพลังงานชะตา ({receiptData.focusLabel})
                  </p>
                  <div className="mt-2.5 flex justify-between text-[10px] font-mono-receipt text-zinc-500">
                    <span>NO: {receiptData.docId}</span>
                    <span>{receiptData.timestamp}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs border-b border-dashed border-zinc-300 pb-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">เจ้าชะตา:</span>
                    <span className="font-semibold text-zinc-900">{receiptData.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">ชาตะ:</span>
                    <span className="font-medium text-zinc-800">
                      {receiptData.thaiBirthDisplay} ({receiptData.birthTime} น.)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">รหัสฐานชะตา:</span>
                    <span className="font-mono-receipt font-bold text-purple-700">
                      {receiptData.lifeCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">ฐาน ๔ กำลังพระเคราะห์:</span>
                    <span className="font-medium text-zinc-800 text-right">{receiptData.basePower}</span>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] text-zinc-500 mb-1.5 font-medium">
                      ผังพลังชีวิต ๗ ด้าน (สัตตะนวดารา):
                    </p>
                    <div className="border border-zinc-300 rounded-lg overflow-hidden text-center font-mono-receipt text-[10px]">
                      <div className="grid grid-cols-7 bg-purple-100/80 text-purple-950 py-1 font-sans text-[9px] font-bold">
                        {HOUSE_LABELS.map((h, i) => (
                          <div key={i}>{h}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 border-t border-zinc-200 py-1 text-zinc-700">
                        {receiptData.tableRows.base1.map((n, i) => (
                          <div key={i}>{n}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 border-t border-zinc-200 py-1 text-zinc-700">
                        {receiptData.tableRows.base2.map((n, i) => (
                          <div key={i}>{n}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 border-t border-zinc-200 py-1 text-zinc-700">
                        {receiptData.tableRows.base3.map((n, i) => (
                          <div key={i}>{n}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 border-t border-zinc-300 bg-purple-600/15 py-1.5 font-bold text-purple-950 text-[11px]">
                        {receiptData.tableRows.base4.map((n, i) => (
                          <div key={i}>{n}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {receiptData.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs gap-2">
                      <div>
                        <p className="font-semibold text-zinc-900">
                          <span className="font-mono-receipt text-[10px] text-zinc-400 mr-1.5">
                            [{item.code}]
                          </span>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 pl-6">{item.detail}</p>
                      </div>
                      <span className="font-mono-receipt text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded shrink-0">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-zinc-300 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-zinc-600">ดัชนีพลังงานรวม (VIBE)</span>
                    <span className="font-mono-receipt text-lg font-bold text-purple-900">
                      {receiptData.vibeScore}
                    </span>
                  </div>
                  <div className="bg-[#2E1065] text-amber-300 rounded-xl p-2.5 text-center">
                    <p className="text-[9px] text-purple-200 uppercase tracking-widest">คาถากำกับใบเสร็จ</p>
                    <p className="text-xs font-semibold mt-0.5">"{receiptData.mantra}"</p>
                  </div>
                </div>

                <div className="pt-1 text-center space-y-1">
                  <div className="h-7 w-4/5 mx-auto bg-[repeating-linear-gradient(90deg,#18181b,#18181b_2px,transparent_2px,transparent_5px,#18181b_5px,#18181b_6px,transparent_6px,transparent_9px)] opacity-80" />
                  <p className="font-mono-receipt text-[10px] text-zinc-400 tracking-widest">
                    *{receiptData.docId}*
                  </p>
                </div>
              </div>

              <div className="h-2.5 w-full receipt-edge-bottom" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDownloadImage('receipt')}
                disabled={isExporting}
                className="bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'กำลังสร้างรูป...' : 'บันทึกใบกำกับดวง'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShareImage('receipt')}
                disabled={isExporting}
                className="bg-white text-purple-900 border border-purple-200 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-95 transition"
              >
                <Share2 className="w-4 h-4 text-purple-600" />
                <span>แชร์ส่งเพื่อน/ลูกค้า</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: วอลเปเปอร์ (WALLPAPER STUDIO)                           */}
        {/* ============================================================== */}
        {activeTab === 'wallpaper' && (
          <div className="px-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#4C1D95]">คอลเลกชันวอลเปเปอร์มงคล</h2>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                1080×2400 เต็มจอ
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {ART_STYLES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#5B21B6] text-white shadow-sm'
                      : 'bg-white text-zinc-600 border border-purple-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {availableDeities.map((deity) => {
                const isSelected = activeDeity.id === deity.id;
                const isMatch = deity.focus.includes(formData.focusId);
                return (
                  <button
                    key={deity.id}
                    type="button"
                    onClick={() => setSelectedDeityId(deity.id)}
                    className={`rounded-2xl p-3 text-left transition cursor-pointer border relative overflow-hidden active:scale-95 ${
                      isSelected
                        ? 'bg-white border-[#7C3AED] ring-2 ring-purple-400/40 shadow-md'
                        : 'bg-white/80 border-purple-100 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {deity.styleTag}
                      </span>
                      {isMatch && (
                        <span className="text-[9px] font-bold text-emerald-600">★ ตรงดวง</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-zinc-900 line-clamp-1">{deity.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{deity.specialty}</p>
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4 text-purple-600" />
                  <span>{wallpaperImage ? 'เปลี่ยนรูปภาพวอลเปเปอร์' : 'ใส่รูปภาพองค์เทพของคุณ'}</span>
                </button>

                {wallpaperImage && (
                  <button
                    type="button"
                    onClick={() => setWallpaperImage(null)}
                    className="bg-rose-50 text-rose-600 border border-rose-200 py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {wallpaperImage && (
                <div className="flex items-center gap-3 text-xs text-zinc-600">
                  <span className="shrink-0 text-[11px]">เงาขอบล่าง:</span>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    value={bgDimmer}
                    onChange={(e) => setBgDimmer(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <span className="font-mono-receipt text-[11px] w-8 text-right">{bgDimmer}%</span>
                </div>
              )}

              <div className="pt-2 border-t border-purple-100 space-y-2">
                <p className="text-[11px] font-bold text-zinc-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-purple-600" /> เลือกสิ่งที่โชว์บนภาพ (วางเนียนขอบล่าง)
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <label className="flex items-center gap-2 bg-[#F6F3FA] px-2.5 py-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wpOptions.showName}
                      onChange={(e) => setWpOptions({ ...wpOptions, showName: e.target.checked })}
                      className="accent-purple-600"
                    />
                    <span>แสดงชื่อเจ้าของ</span>
                  </label>

                  <label className="flex items-center gap-2 bg-[#F6F3FA] px-2.5 py-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wpOptions.useInitialsOnly}
                      disabled={!wpOptions.showName}
                      onChange={(e) =>
                        setWpOptions({ ...wpOptions, useInitialsOnly: e.target.checked })
                      }
                      className="accent-purple-600"
                    />
                    <span>ชื่อย่อ ({receiptData.initials})</span>
                  </label>

                  <label className="flex items-center gap-2 bg-[#F6F3FA] px-2.5 py-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wpOptions.showLuckyCode}
                      onChange={(e) =>
                        setWpOptions({ ...wpOptions, showLuckyCode: e.target.checked })
                      }
                      className="accent-purple-600"
                    />
                    <span>เลขมงคล ({receiptData.luckyCode4})</span>
                  </label>

                  <label className="flex items-center gap-2 bg-[#F6F3FA] px-2.5 py-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wpOptions.showBase4Bar}
                      onChange={(e) =>
                        setWpOptions({ ...wpOptions, showBase4Bar: e.target.checked })
                      }
                      className="accent-purple-600"
                    />
                    <span>แถบเลขกำลัง 7 ตัว</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                ref={exportRef}
                style={{ width: '340px', height: '755px' }}
                className={`rounded-[32px] bg-gradient-to-b ${activeDeity.bgGradient} flex flex-col justify-between relative overflow-hidden select-none shadow-2xl border-4 border-white`}
              >
                {wallpaperImage ? (
                  <>
                    <img
                      src={wallpaperImage}
                      alt="Wallpaper"
                      className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none"
                      style={{ opacity: Math.max(0.35, bgDimmer / 100) }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-8 text-center">
                    <div
                      className="w-52 h-52 rounded-full blur-[65px] opacity-40"
                      style={{ backgroundColor: activeDeity.accentHex }}
                    />
                    <div className="relative z-10 border border-white/15 rounded-full w-44 h-44 flex flex-col items-center justify-center p-4">
                      <span
                        className="text-[9px] tracking-[0.25em] uppercase opacity-80"
                        style={{ color: activeDeity.accentHex }}
                      >
                        {activeDeity.styleTag}
                      </span>
                      <p className="text-sm font-semibold text-white/95 mt-1.5">{activeDeity.name}</p>
                      <p className="text-[10px] text-white/60 mt-1">{receiptData.focusLabel}</p>
                    </div>
                  </div>
                )}

                <div className="h-[30%] w-full pointer-events-none" />
                <div className="flex-1 w-full pointer-events-none" />

                <div className="relative z-10 px-6 pb-14 pt-4">
                  {(wpOptions.showName || wpOptions.showLuckyCode || wpOptions.showBase4Bar) && (
                    <div className="border-t border-white/15 pt-3 flex items-end justify-between gap-2">
                      <div className="space-y-1">
                        {wpOptions.showName && (
                          <p className="text-[11px] font-medium tracking-[0.2em] text-white/85 uppercase">
                            {wpOptions.useInitialsOnly
                              ? receiptData.initials
                              : receiptData.customerName}
                          </p>
                        )}
                        {wpOptions.showBase4Bar && (
                          <div className="flex items-center gap-1.5 font-mono-receipt text-[10px] text-white/65 tracking-wider">
                            {receiptData.tableRows.base4.map((n, idx) => (
                              <span key={idx}>{String(n).padStart(2, '0')}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {wpOptions.showLuckyCode && (
                        <div className="text-right">
                          <p className="text-[8px] tracking-[0.25em] text-white/50 uppercase">NO.</p>
                          <p
                            className="font-mono-receipt text-base font-bold tracking-[0.2em]"
                            style={{ color: activeDeity.accentHex }}
                          >
                            {receiptData.luckyCode4}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDownloadImage('wallpaper')}
                disabled={isExporting}
                className="bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'กำลังสร้างไฟล์...' : 'โหลดวอลเปเปอร์เต็มจอ'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShareImage('wallpaper')}
                disabled={isExporting}
                className="bg-white text-purple-900 border border-purple-200 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-95 transition"
              >
                <Share2 className="w-4 h-4 text-purple-600" />
                <span>แชร์รูปภาพ</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-950">
                  📜 บทสวด & เคล็ดลับตั้งภาพส่งลูกค้า
                </span>
                <button
                  type="button"
                  onClick={handleCopyGuide}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedGuide ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGuide ? 'คัดลอกแล้ว!' : 'คัดลอกส่ง LINE'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-[11px] text-zinc-600 bg-[#F6F3FA] rounded-2xl p-3 leading-relaxed">
                {guideMessage}
              </pre>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: คลังของฉัน & โปรไฟล์ (MY VAULT)                        */}
        {/* ============================================================== */}
        {activeTab === 'vault' && (
          <div className="px-5 space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-bold text-lg flex items-center justify-center shadow">
                  {receiptData.initials}
                </div>
                <div>
                  <h2 className="font-bold text-base text-zinc-900">{receiptData.customerName}</h2>
                  <p className="text-xs text-zinc-500">
                    {receiptData.thaiBirthShort} • {receiptData.zodiacName} ({currentZodiacObj.petName})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="p-2 rounded-full bg-purple-50 text-purple-700 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <span>ของที่บันทึกไว้</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {savedVault.length}
                </span>
              </h3>
              {savedVault.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSavedVault([])}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                >
                  ล้างประวัติทั้งหมด
                </button>
              )}
            </div>

            {savedVault.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-purple-100 space-y-2">
                <p className="text-sm font-semibold text-zinc-700">ยังไม่มีรายการที่บันทึกไว้</p>
                <p className="text-xs text-zinc-400">
                  เมื่อคุณกดบันทึกใบกำกับดวงหรือโหลดวอลเปเปอร์ ระบบจะเก็บประวัติไว้ให้ที่นี่อัตโนมัติ
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('wallpaper')}
                  className="mt-2 bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                >
                  ไปสร้างวอลเปเปอร์มงคล
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedVault.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3.5 border border-purple-100 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-zinc-400">{item.createdAt}</span>
                      </div>
                      <p className="text-xs font-bold text-zinc-900 mt-1">
                        คุณ{item.customerName} ({item.focusLabel})
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        รหัสเลข: <span className="font-bold text-purple-700">{item.luckyCode4}</span> •{' '}
                        {item.deityName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptData(item.snapshotData);
                          setActiveTab(item.type.includes('วอลเปเปอร์') ? 'wallpaper' : 'receipt');
                        }}
                        className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer"
                        title="เปิดดูและโหลดซ้ำ"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSavedVault((prev) => prev.filter((v) => v.id !== item.id))
                        }
                        className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* FLOATING BOTTOM NAVIGATION BAR                                 */}
        {/* ============================================================== */}
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[408px] bg-white/90 backdrop-blur-xl border border-purple-200/70 rounded-full px-3 py-2 shadow-[0_10px_30px_rgba(76,29,149,0.18)] z-50">
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'home', label: 'หน้าแรก', icon: Home },
              { id: 'receipt', label: 'ใบกำกับดวง', icon: Receipt },
              { id: 'wallpaper', label: 'วอลเปเปอร์', icon: Sparkles },
              { id: 'vault', label: 'คลัง/โปรไฟล์', icon: User },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => setActiveTab(nav.id)}
                  className={`py-2 px-1 rounded-full flex flex-col items-center justify-center gap-0.5 transition cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#EDE9FE] text-[#5B21B6] font-bold'
                      : 'text-zinc-500 hover:text-purple-700 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px]">{nav.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}