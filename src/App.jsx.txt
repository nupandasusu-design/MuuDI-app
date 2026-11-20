import React, { useState, useRef } from 'react';
import {
  Receipt,
  Calendar,
  User,
  Clock,
  RefreshCw,
  ShieldCheck,
  Download,
  Share2,
  Smartphone,
  Sparkles,
  Target,
} from 'lucide-react';
import { toPng } from 'html-to-image';

// ==========================================
// ข้อมูลพื้นฐานภาษาไทย & โหมดโฟกัส
// ==========================================
const THAI_MONTHS = [
  { val: '01', label: 'มกราคม' },
  { val: '02', label: 'กุมภาพันธ์' },
  { val: '03', label: 'มีนาคม' },
  { val: '04', label: 'เมษายน' },
  { val: '05', label: 'พฤษภาคม' },
  { val: '06', label: 'มิถุนายน' },
  { val: '07', label: 'กรกฎาคม' },
  { val: '08', label: 'สิงหาคม' },
  { val: '09', label: 'กันยายน' },
  { val: '10', label: 'ตุลาคม' },
  { val: '11', label: 'พฤศจิกายน' },
  { val: '12', label: 'ธันวาคม' },
];

const CURRENT_BE_YEAR = new Date().getFullYear() + 543;
const BE_YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_BE_YEAR - i);

const FOCUS_MODES = [
  { id: 'wealth', label: 'การเงิน & โชคลาภ', baseIdx: 1, house: 'เรือนกดุมภะ (ทรัพย์)' },
  { id: 'career', label: 'การงาน & ธุรกิจ', baseIdx: 6, house: 'เรือนกัมมะ (งาน)' },
  { id: 'love', label: 'ความรัก & เสน่ห์', baseIdx: 5, house: 'เรือนปัตนิ (คู่ครอง)' },
  { id: 'shield', label: 'คุ้มครอง & แก้ชง', baseIdx: 3, house: 'เรือนพันธุ (ฐานชีวิต)' },
];

const HOUSE_LABELS = ['อัตตะ', 'กดุมภะ', 'สหัชชะ', 'พันธุ', 'ปุตตะ', 'อริ/คู่', 'กัมมะ'];

// ==========================================
// สมองกลคำนวณเลข ๗ ตัว ๙ ฐาน สัตตะนวดารา
// ==========================================
const PLANETS = {
  1: {
    name: 'พระอาทิตย์',
    dayName: 'วันอาทิตย์',
    color: 'สีแดงทับทิม / สีส้มทอง',
    wallpaperBg: 'from-rose-950 via-amber-950 to-zinc-950',
    accentBorder: 'border-amber-400/50',
    accentText: 'text-amber-300',
    luckyDigits: '1, 5, 6',
    mantra: 'อุ อา กะ สะ (หัวใจเศรษฐี)',
  },
  2: {
    name: 'พระจันทร์',
    dayName: 'วันจันทร์',
    color: 'สีขาวนวล / สีเหลืองครีม',
    wallpaperBg: 'from-amber-950 via-stone-900 to-zinc-950',
    accentBorder: 'border-amber-200/50',
    accentText: 'text-amber-200',
    luckyDigits: '2, 4, 6',
    mantra: 'นะ ชา ลี ติ (เมตตามหานิยม)',
  },
  3: {
    name: 'พระอังคาร',
    dayName: 'วันอังคาร',
    color: 'สีชมพูกลีบบัว / สีโอลด์โรส',
    wallpaperBg: 'from-pink-950 via-rose-950 to-zinc-950',
    accentBorder: 'border-pink-400/50',
    accentText: 'text-pink-300',
    luckyDigits: '3, 5, 8',
    mantra: 'อะ สัง วิ สุ โล ปุ สะ พุ ภะ',
  },
  4: {
    name: 'พระพุธ',
    dayName: 'วันพุธ',
    color: 'สีเขียวมรกต / สีเขียวใบไม้',
    wallpaperBg: 'from-emerald-950 via-teal-950 to-zinc-950',
    accentBorder: 'border-emerald-400/50',
    accentText: 'text-emerald-300',
    luckyDigits: '4, 2, 5',
    mantra: 'ปิ โย เท วะ มะ นุส สา นัง',
  },
  5: {
    name: 'พระพฤหัสบดี',
    dayName: 'วันพฤหัสบดี',
    color: 'สีแสด / สีทองแชมเปญ',
    wallpaperBg: 'from-orange-950 via-amber-950 to-zinc-950',
    accentBorder: 'border-orange-400/50',
    accentText: 'text-orange-300',
    luckyDigits: '5, 1, 9',
    mantra: 'ภะ สัม สัม วิ สะ เท ภะ',
  },
  6: {
    name: 'พระศุกร์',
    dayName: 'วันศุกร์',
    color: 'สีฟ้าคราม / สีน้ำเงินไพลิน',
    wallpaperBg: 'from-sky-950 via-indigo-950 to-zinc-950',
    accentBorder: 'border-sky-400/50',
    accentText: 'text-sky-300',
    luckyDigits: '6, 2, 3',
    mantra: 'วา โธ โน อะ มะ มะ วา',
  },
  7: {
    name: 'พระเสาร์',
    dayName: 'วันเสาร์',
    color: 'สีม่วงเม็ดมะปราง / สีดำนิล',
    wallpaperBg: 'from-purple-950 via-violet-950 to-zinc-950',
    accentBorder: 'border-purple-400/50',
    accentText: 'text-purple-300',
    luckyDigits: '7, 8, 9',
    mantra: 'โส มา ณะ กะ ริ ถา โธ',
  },
};

const BASE4_POWERS = {
  6: 'กำลังพระอาทิตย์ (6) — เด่นอำนาจบารมี',
  7: 'กำลังพระจันทร์ (7) — เด่นเสน่ห์เมตตา',
  8: 'กำลังพระอังคาร (8) — เด่นความกล้าและลงมือทำ',
  9: 'กำลังพระเกตุ (9) — เด่นลางสังหรณ์และสิ่งศักดิ์สิทธิ์',
  10: 'กำลังพระเสาร์ (10) — เด่นความอดทนและรากฐานมั่นคง',
  11: 'กำลังราชาโชค (11) — มีผู้ใหญ่เกื้อหนุน',
  12: 'กำลังพระราหู (12) — เด่นไหวพริบและโชคลาภฉับพลัน',
  13: 'กำลังมหาอุจจ์ (13) — ยกระดับฐานะสู่จุดสูงสุด',
  14: 'กำลังจักรพรรดิ (14) — มั่งคั่งสมบูรณ์พร้อม',
  15: 'กำลังพระจันทร์เต็มดวง (15) — ปัญญาและทรัพย์สิน',
  16: 'กำลังโสฬสมงคล (16) — มงคลสูงสุด คุ้มครองรอบด้าน',
  17: 'กำลังพระพุธ (17) — เด่นการเจรจาและค้าขาย',
  18: 'กำลังมหาจักร (18) — ต้องฝ่าฟันแล้วจะยิ่งใหญ่',
  19: 'กำลังพระพฤหัสบดี (19) — ปัญญาบารมีและความสำเร็จ',
  20: 'กำลังพระเสาร์ใหญ่ (20) — ทรัพย์สินและอสังหาริมทรัพย์',
  21: 'กำลังพระศุกร์ (21) — โภคทรัพย์และความสุขสมบูรณ์',
};

const ENEMY_PAIRS = [
  { pair: [1, 3], desc: 'สลายคู่ปะทะ 1-3 ลดแรงกดดันและอารมณ์ร้อน' },
  { pair: [1, 6], desc: 'สลายคู่ปะทะ 1-6 อุดรอยรั่วการเงินและความรัก' },
  { pair: [2, 3], desc: 'สลายคู่ปะทะ 2-3 เสริมความราบรื่นในครอบครัว/หุ้นส่วน' },
  { pair: [2, 5], desc: 'สลายคู่ปะทะ 2-5 เสริมความเด็ดขาดและผู้ใหญ่เมตตา' },
  { pair: [3, 7], desc: 'สลายคู่ปะทะ 3-7 ผ่อนหนักเป็นเบา ลดอุปสรรคงาน' },
  { pair: [4, 7], desc: 'สลายคู่ปะทะ 4-7 คุ้มครองเอกสารสัญญาและคำพูด' },
  { pair: [5, 7], desc: 'สลายคู่ปะทะ 5-7 รับมือการเปลี่ยนแปลงอย่างมั่นคง' },
  { pair: [6, 7], desc: 'สลายคู่ปะทะ 6-7 คลายความตึงเครียด เปิดทางทรัพย์' },
];

const HARMONY_PAIRS = [
  { pair: [1, 5], desc: 'คู่มิตร 1-5 ผู้ใหญ่และบารมีหนุนนำความสำเร็จ' },
  { pair: [1, 6], desc: 'คู่สมพล 1-6 เสริมพลังการเงินและเสน่ห์ดึงดูด' },
  { pair: [2, 4], desc: 'คู่มิตร 2-4 เจรจาพารวย ปิดการขายคล่องตัว' },
  { pair: [2, 6], desc: 'คู่ธาตุน้ำ 2-6 เสน่ห์เมตตา โชคลาภไหลมาเทมา' },
  { pair: [3, 5], desc: 'คู่ธาตุ 3-5 ปัญญาและพลังขับเคลื่อนสู่เป้าหมาย' },
  { pair: [3, 6], desc: 'คู่มิตร 3-6 ความขยันก่อเกิดโภคทรัพย์มั่นคง' },
  { pair: [4, 5], desc: 'คู่ธาตุดิน 4-5 ปัญญาและวาจาสร้างความมั่งคั่ง' },
  { pair: [5, 6], desc: 'คู่ทรัพย์คู่โชค 5-6 การเงินคล่องตัวสมบูรณ์พูนสุข' },
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

  return { monthDigit, yearDigit };
}

function generate7Row(startDigit) {
  const row = [];
  for (let i = 0; i < 7; i++) {
    row.push(((startDigit - 1 + i) % 7) + 1);
  }
  return row;
}

function calculateSattaReceipt({ fullName, birthDay, birthMonth, birthYearBE, birthTime, focusId }) {
  const adYear = Number(birthYearBE) - 543;
  const paddedDay = String(birthDay).padStart(2, '0');
  const birthDateAD = `${adYear}-${birthMonth}-${paddedDay}`;

  const monthObj = THAI_MONTHS.find((m) => m.val === birthMonth);
  const thaiBirthDisplay = `${Number(birthDay)} ${monthObj ? monthObj.label : ''} พ.ศ. ${birthYearBE}`;

  const dayDigit = getThaiAstroDay(birthDateAD, birthTime);
  const { monthDigit, yearDigit } = getLunarMonthAndYearDigits(birthDateAD);

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
      desc: `ปรับสมดุลเสาปะทะ (${base1[2]}-${base3[2]}) ลดอุปสรรคติดขัด`,
    };
  }

  const totalBase4 = base4.reduce((sum, n) => sum + n, 0);
  const vibeScore = Math.min(99, Math.max(82, Math.round((totalBase4 / 105) * 100)));

  const primaryPlanet = PLANETS[dayDigit];
  const luckyCode4 = `${dayDigit}${monthDigit}${yearDigit}${focusPowerVal % 10}`;
  const docId = `MD-${dayDigit}${monthDigit}${yearDigit}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    docId,
    timestamp: new Date().toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    customerName: fullName,
    thaiBirthDisplay,
    birthTime: birthTime || '12:00',
    focusLabel: focusObj.label,
    focusHouse: focusObj.house,
    lifeCode: `${dayDigit} - ${monthDigit} - ${yearDigit}`,
    tableRows: { base1, base2, base3, base4 },
    basePower: basePowerText,
    luckyCode4,
    primaryPlanet,
    items: [
      {
        code: `FC-0${focusPowerVal}`,
        name: `ปลุกพลัง${focusObj.label}`,
        detail: `${focusObj.house}: ${focusPowerText}`,
        qty: 'MAX',
      },
      {
        code: `ST-${dayDigit}${monthDigit}`,
        name: 'หนุนคู่สมพล & คู่ธาตุ',
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
    vibeScore: `${vibeScore} / 100`,
    mantra: primaryPlanet.mantra,
  };
}

// ==========================================
// หน้าจอหลัก MuuDI (Receipt + Wallpaper Mode)
// ==========================================
export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDay: '26',
    birthMonth: '03',
    birthYearBE: '2526',
    birthTime: '12:00',
    focusId: 'wealth',
  });

  const [receiptData, setReceiptData] = useState(null);
  const [viewMode, setViewMode] = useState('receipt');
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.fullName) return;
    const result = calculateSattaReceipt(formData);
    setReceiptData(result);
  };

  const handleDownloadImage = async () => {
    if (!exportRef.current || !receiptData) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#0B0B0F',
      });
      const link = document.createElement('a');
      const prefix = viewMode === 'wallpaper' ? 'MuuDI-Wallpaper' : 'MuuDI-Receipt';
      link.download = `${prefix}-${receiptData.customerName}-${receiptData.docId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareImage = async () => {
    if (!exportRef.current || !receiptData) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#0B0B0F',
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `MuuDI-${receiptData.docId}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `ใบกำกับดวง MuuDI - คุณ${receiptData.customerName}`,
          text: `ใบกำกับดวงและรายการเสริมพลังงานชะตา (${receiptData.docId})`,
          files: [file],
        });
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-zinc-100 py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="text-center mb-6 relative z-10 w-full max-w-md">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM ONLINE • SATTA-NAVADARA</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Muu<span className="text-amber-400">DI</span>-ใบกำกับดวง{' '}
          <span className="text-emerald-400">พร้อมใช้</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          ระบบออกใบเสร็จเสริมดวง & วอลเปเปอร์มงคล ๗ ตัว ๙ ฐาน
        </p>

        <div className="grid grid-cols-4 gap-2 mt-5 text-left">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 mb-1.5" />
            <p className="text-[11px] font-semibold text-amber-300 leading-tight">1. ฐานชะตา</p>
            <p className="text-[9px] text-amber-200/70 mt-0.5">๗ ตัว ๙ ฐาน</p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-2.5">
            <div className="w-2 h-2 rounded-full bg-purple-400 mb-1.5" />
            <p className="text-[11px] font-semibold text-purple-300 leading-tight">2. คู่ธาตุ</p>
            <p className="text-[9px] text-purple-200/70 mt-0.5">หนุนคู่สมพล</p>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5">
            <div className="w-2 h-2 rounded-full bg-rose-400 mb-1.5" />
            <p className="text-[11px] font-semibold text-rose-300 leading-tight">3. จุดปะทะ</p>
            <p className="text-[9px] text-rose-200/70 mt-0.5">สลายคู่ศัตรู</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mb-1.5" />
            <p className="text-[11px] font-semibold text-emerald-300 leading-tight">4. สีมงคล</p>
            <p className="text-[9px] text-emerald-200/70 mt-0.5">เสริมพลังงาน</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md relative z-10 space-y-6">
        <form
          onSubmit={handleGenerate}
          className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" /> ชื่อ - นามสกุล (หรือชื่อเล่น)
            </label>
            <input
              type="text"
              required
              placeholder="เช่น กัมพล เจนจุลพร"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> วัน / เดือน / ปีเกิด (พ.ศ.)
            </label>
            <div className="grid grid-cols-12 gap-2">
              <select
                value={formData.birthDay}
                onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                className="col-span-3 bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
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
                className="col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
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
                className="col-span-4 bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
              >
                {BE_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    พ.ศ. {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> เวลาเกิด (ตัดเปลี่ยนวันเวลา 06:00 น.)
            </label>
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" /> เรื่องที่ต้องการเน้นเสริมเป็นพิเศษ
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FOCUS_MODES.map((mode) => {
                const active = formData.focusId === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, focusId: mode.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>คำนวณและออกใบกำกับดวง</span>
          </button>
        </form>

        {receiptData && (
          <div className="animate-fade-in space-y-4">
            <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setViewMode('receipt')}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'receipt'
                    ? 'bg-amber-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>โหมดใบเสร็จ</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('wallpaper')}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'wallpaper'
                    ? 'bg-amber-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>โหมดวอลเปเปอร์ 9:16</span>
              </button>
            </div>

            {viewMode === 'receipt' ? (
              <div ref={exportRef} className="p-4 bg-[#0B0B0F] drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]">
                <div className="h-2.5 w-full receipt-edge-top" />

                <div className="bg-[#FAF8F5] text-zinc-900 px-6 py-5 space-y-4">
                  <div className="text-center border-b border-dashed border-zinc-300 pb-4">
                    <div className="flex items-center justify-center gap-1.5 text-zinc-900 font-bold text-xl tracking-wider">
                      <span>MUUDI RECEIPT</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      ใบกำกับดวงและรายการเสริมพลังงานชะตา ({receiptData.focusLabel})
                    </p>
                    <div className="mt-3 flex justify-between text-[11px] font-mono-receipt text-zinc-600">
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
                      <span className="text-zinc-500">รหัสฐานชะตา (วัน-เดือน-ปี):</span>
                      <span className="font-mono-receipt font-bold text-amber-700">
                        {receiptData.lifeCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ฐาน ๔ กำลังพระเคราะห์:</span>
                      <span className="font-medium text-zinc-800 text-right">{receiptData.basePower}</span>
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] text-zinc-500 mb-1.5 font-medium">
                        ตารางเลข ๗ ตัว ๔ ฐาน (สัตตะนวดารา):
                      </p>
                      <div className="border border-zinc-300 rounded-lg overflow-hidden text-center font-mono-receipt text-[10px]">
                        <div className="grid grid-cols-7 bg-zinc-200/80 text-zinc-600 py-1 font-sans text-[9px] font-semibold">
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
                        <div className="grid grid-cols-7 border-t border-zinc-300 bg-amber-500/15 py-1.5 font-bold text-amber-900 text-[11px]">
                          {receiptData.tableRows.base4.map((n, i) => (
                            <div key={i}>{n}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[10px] font-mono-receipt uppercase tracking-wider text-zinc-400">
                      <span>รายการปรับสมดุล</span>
                      <span>รหัส/สถานะ</span>
                    </div>

                    {receiptData.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between text-xs gap-2">
                        <div>
                          <p className="font-medium text-zinc-900">
                            <span className="font-mono-receipt text-[10px] text-zinc-400 mr-1.5">
                              [{item.code}]
                            </span>
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 pl-6">{item.detail}</p>
                        </div>
                        <span className="font-mono-receipt text-[11px] font-semibold bg-zinc-200/70 px-2 py-0.5 rounded text-zinc-800 shrink-0">
                          {item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-zinc-300 pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-zinc-600">ดัชนีพลังงานรวม (VIBE)</span>
                      <span className="font-mono-receipt text-lg font-bold text-zinc-900">
                        {receiptData.vibeScore}
                      </span>
                    </div>
                    <div className="bg-zinc-900 text-amber-300 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">คาถากำกับใบเสร็จ</p>
                      <p className="text-sm font-medium mt-0.5">"{receiptData.mantra}"</p>
                    </div>
                  </div>

                  <div className="pt-2 text-center space-y-1.5">
                    <div className="h-8 w-4/5 mx-auto bg-[repeating-linear-gradient(90deg,#18181b,#18181b_2px,transparent_2px,transparent_5px,#18181b_5px,#18181b_6px,transparent_6px,transparent_9px)] opacity-80" />
                    <p className="font-mono-receipt text-[10px] text-zinc-400 tracking-widest">
                      *{receiptData.docId}*
                    </p>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 pt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified by MuuDI Satta-Navadara Engine</span>
                    </div>
                  </div>
                </div>

                <div className="h-2.5 w-full receipt-edge-bottom" />
              </div>
            ) : (
              <div
                ref={exportRef}
                className={`aspect-[9/16] w-full rounded-3xl bg-gradient-to-b ${receiptData.primaryPlanet.wallpaperBg} p-6 flex flex-col justify-between border ${receiptData.primaryPlanet.accentBorder} shadow-2xl relative overflow-hidden`}
              >
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/15 blur-[80px] rounded-full pointer-events-none" />

                <div className="text-center pt-10 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-zinc-300">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>MUUDI TALISMAN • {receiptData.primaryPlanet.dayName}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-3">{receiptData.customerName}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{receiptData.thaiBirthDisplay}</p>
                </div>

                <div className="my-auto text-center space-y-4 relative z-10">
                  <div className="inline-block px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">
                      รหัสเลขมงคลประจำดวง ({receiptData.focusLabel})
                    </p>
                    <p className={`font-mono-receipt text-4xl font-bold tracking-[0.25em] ${receiptData.primaryPlanet.accentText}`}>
                      {receiptData.luckyCode4}
                    </p>
                    <p className="text-[11px] text-zinc-300 mt-2">
                      เลขเด่นหนุนชะตา: <span className="font-bold text-white">{receiptData.primaryPlanet.luckyDigits}</span>
                    </p>
                  </div>

                  <div className="px-2">
                    <div className="grid grid-cols-7 gap-1.5 font-mono-receipt text-xs">
                      {receiptData.tableRows.base4.map((n, i) => (
                        <div
                          key={i}
                          className="bg-white/10 border border-white/15 rounded-lg py-1.5 font-bold text-white"
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2.5 pb-4 relative z-10">
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-400">คาถาปลุกพลังงานประจำตัว</p>
                    <p className={`text-sm font-semibold mt-0.5 ${receiptData.primaryPlanet.accentText}`}>
                      "{receiptData.mantra}"
                    </p>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    สีเสริมบารมี: {receiptData.primaryPlanet.color}
                  </p>
                  <p className="font-mono-receipt text-[9px] text-zinc-500 tracking-widest">
                    {receiptData.docId} • SATTA-NAVADARA
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isExporting
                    ? 'กำลังสร้างรูป...'
                    : viewMode === 'wallpaper'
                    ? 'โหลดวอลเปเปอร์'
                    : 'บันทึกรูป (PNG)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShareImage}
                disabled={isExporting}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white border border-zinc-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>แชร์รูปภาพ</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setReceiptData(null)}
              className="w-full py-2 text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ล้างข้อมูล / ออกใบใหม่</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}