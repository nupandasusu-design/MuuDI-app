import React, { useState } from 'react';
import { Receipt, Calendar, User, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { calculateSattaReceipt } from './utils/sattaEngine';

export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    birthTime: '12:00',
  });

  const [receiptData, setReceiptData] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.birthDate) return;

    // คำนวณเลข ๗ ตัว ๙ ฐาน จริงจาก Satta-Navadara Engine
    const result = calculateSattaReceipt(formData);
    setReceiptData(result);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-zinc-100 py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* แสงฟุ้งพื้นหลังสไตล์ Mystical */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header ตรงกลาง: MuuDI-ใบกำกับดวง พร้อมใช้ */}
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
          ระบบออกใบเสร็จเสริมดวง & ปรับสมดุลฐานชะตา ๗ ตัว ๙ ฐาน
        </p>

        {/* แถบแสดง 4 สี 4 สถานะ (4 Pillars) */}
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
        {/* ส่วนฟอร์มกรอกข้อมูล */}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> วัน/เดือน/ปีเกิด
              </label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> เวลาเกิด (ตัด 06:00 น.)
              </label>
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition"
              />
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

        {/* ส่วนแสดงผล "ใบกำกับดวง" (Receipt Card) */}
        {receiptData && (
          <div className="animate-fade-in drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]">
            <div className="h-2.5 w-full receipt-edge-top" />

            <div className="bg-[#FAF8F5] text-zinc-900 px-6 py-5 space-y-4">
              <div className="text-center border-b border-dashed border-zinc-300 pb-4">
                <div className="flex items-center justify-center gap-1.5 text-zinc-900 font-bold text-xl tracking-wider">
                  <span>MUUDI RECEIPT</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  ใบกำกับดวงและรายการเสริมพลังงานชะตา
                </p>
                <div className="mt-3 flex justify-between text-[11px] font-mono-receipt text-zinc-600">
                  <span>NO: {receiptData.docId}</span>
                  <span>{receiptData.timestamp}</span>
                </div>
              </div>

              {/* ข้อมูลเจ้าชะตา & รหัสฐาน */}
              <div className="space-y-1.5 text-xs border-b border-dashed border-zinc-300 pb-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">เจ้าชะตา:</span>
                  <span className="font-semibold text-zinc-900">{receiptData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">รหัสฐานชะตา (วัน-เดือน-ปี):</span>
                  <span className="font-mono-receipt font-bold text-amber-700">{receiptData.lifeCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ฐาน ๔ กำลังพระเคราะห์:</span>
                  <span className="font-medium text-zinc-800 text-right">{receiptData.basePower}</span>
                </div>

                {/* แถบตัวเลขฐาน 4 ทั้ง 7 หลัก */}
                <div className="pt-1.5">
                  <p className="text-[10px] text-zinc-400 mb-1">ผังกำลังฐาน ๔ (๗ เรือนชะตา):</p>
                  <div className="grid grid-cols-7 gap-1 text-center font-mono-receipt text-[11px]">
                    {receiptData.base4Array.map((num, i) => (
                      <div
                        key={i}
                        className="bg-zinc-200/80 border border-zinc-300 rounded py-1 font-bold text-zinc-800"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* รายการเสริมดวง */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-[10px] font-mono-receipt uppercase tracking-wider text-zinc-400">
                  <span>รายการปรับสมดุล</span>
                  <span>สถานะ</span>
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

              {/* สรุปคะแนน Vibe & คาถากำกับ */}
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

              {/* บาร์โค้ด */}
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

            <button
              onClick={() => setReceiptData(null)}
              className="mt-4 w-full py-2 text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
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