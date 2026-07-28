"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitRequest } from "@/app/lib/actions/request";
import { Calendar, CheckCircle } from "lucide-react";

type Step = 1 | 2 | 3;

const DAY_NAME_MAP: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

const MONTH_NAMES_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

interface DateSlot {
  iso: string;
  dayName: string;
  dayNum: number;
  monthName: string;
  year: number;
  formatted: string;
}

function getUpcomingDateSlots(availableDayNames: string[]): DateSlot[] {
  if (!availableDayNames || availableDayNames.length === 0) return [];
  const targetDays = new Set(availableDayNames.map((d) => d.trim().toLowerCase()));

  const slots: DateSlot[] = [];
  const today = new Date();

  // Check next 28 days
  for (let i = 1; i <= 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dayNameIndo = DAY_NAME_MAP[d.getDay()];
    if (targetDays.has(dayNameIndo.toLowerCase())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const iso = `${year}-${month}-${day}`;

      slots.push({
        iso,
        dayName: dayNameIndo,
        dayNum: d.getDate(),
        monthName: MONTH_NAMES_ID[d.getMonth()],
        year,
        formatted: `${dayNameIndo}, ${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${year}`,
      });
    }
  }

  return slots;
}

export default function RequestForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Form state
  const [formData, setFormData] = useState({
    namaLengkap: "",
    angkatan: "",
    jurusan: "Elektro",
    kontak: "",
    matkul: "",
    tanggal: "",
    jam: "17:00",
    sudahHubungiJoy: false,
    sudahBayar: false,
    buktiBayarUrl: "",
  });

  // Dynamic options
  const [matkulOptions, setMatkulOptions] = useState<string[]>([]);
  const [jadwalOptions, setJadwalOptions] = useState<{ hari: string, jamMulai: string, jamSelesai: string }[]>([]);

  // Infer semester and fetch matkuls
  useEffect(() => {
    if (formData.angkatan.length === 4) {
      const year = parseInt(formData.angkatan);
      const currentYear = new Date().getFullYear();
      // Heuristic: 2023+ = semester 2, else semester 4
      const semester = year >= currentYear - 1 ? "2" : "4";

      fetch(`/api/matkul?semester=${semester}`)
        .then(res => res.json())
        .then(data => {
          setMatkulOptions(data);
          if (data.length > 0 && !data.includes(formData.matkul)) {
            setFormData(prev => ({ ...prev, matkul: data[0] }));
          }
        });
    }
  }, [formData.angkatan, formData.matkul]);

  // Fetch jadwal when matkul or jurusan changes
  useEffect(() => {
    if (formData.matkul) {
      fetch(`/api/jadwal?matkul=${encodeURIComponent(formData.matkul)}&jurusan=${formData.jurusan}`)
        .then(res => res.json())
        .then(data => {
          setJadwalOptions(data);
          if (data.length > 0) {
            const availableDays = Array.from(new Set(data.map((j: any) => j.hari))) as string[];
            const upcoming = getUpcomingDateSlots(availableDays);
            if (upcoming.length > 0) {
              setFormData((prev) => {
                const isCurrentValid = upcoming.some((u) => u.iso === prev.tanggal);
                return {
                  ...prev,
                  tanggal: isCurrentValid ? prev.tanggal : upcoming[0].iso,
                };
              });
            }
          }
        });
    }
  }, [formData.matkul, formData.jurusan]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const nextStep = () => setStep(prev => (prev < 3 ? (prev + 1) as Step : prev));
  const prevStep = () => setStep(prev => (prev > 1 ? (prev - 1) as Step : prev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    const result = await submitRequest(data);

    if (result.success) {
      router.push(`/request/success?id=${result.id}`);
    } else {
      setErrors(result.errors);
      setLoading(false);
      // If there are errors, might need to jump back to the step with errors
      if (result.errors.namaLengkap || result.errors.angkatan || result.errors.kontak) setStep(1);
      else if (result.errors.matkul || result.errors.tanggal || result.errors.jam) setStep(2);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      {/* Progress Bar */}
      <div className="flex mb-8 justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step === s ? "bg-blue-600 text-white" : step > s ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}>
              {step > s ? "✓" : s}
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {s === 1 ? "Data Diri" : s === 2 ? "Detail Sesi" : "Pembayaran"}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Data Diri */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Nama Lengkap</label>
              <input
                type="text"
                name="namaLengkap"
                required
                value={formData.namaLengkap}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama sesuai SIAKAD"
              />
              {errors.namaLengkap && <p className="text-red-500 text-xs mt-1">{errors.namaLengkap[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">LINE ID / No. WhatsApp</label>
              <input
                type="text"
                name="kontak"
                required
                value={formData.kontak}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: @username / 08123456789"
              />
              {errors.kontak && <p className="text-red-500 text-xs mt-1">{errors.kontak[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Angkatan</label>
              <input
                type="number"
                name="angkatan"
                required
                value={formData.angkatan}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 2024"
              />
              {errors.angkatan && <p className="text-red-500 text-xs mt-1">{errors.angkatan[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Jurusan</label>
              <select
                name="jurusan"
                value={formData.jurusan}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Elektro" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Teknik Elektro</option>
                <option value="Biomedik" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Teknik Biomedik</option>
                <option value="Tekkom" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Teknik Komputer</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Detail Sesi */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Mata Kuliah</label>
              <select
                name="matkul"
                required
                value={formData.matkul}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Pilih Matkul</option>
                {matkulOptions.map(m => (
                  <option key={m} value={m} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    {m}
                  </option>
                ))}
              </select>
              {errors.matkul && <p className="text-red-500 text-xs mt-1">{errors.matkul[0]}</p>}
            </div>

            {jadwalOptions.length > 0 ? (
              <>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      <Calendar size={16} className="text-blue-500" />
                      Pilih Tanggal Sesi
                    </label>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full font-medium self-start sm:self-auto">
                      Hari Tersedia: {Array.from(new Set(jadwalOptions.map(j => j.hari))).join(", ")}
                    </span>
                  </div>

                  {/* Interactive Date Card Grid */}
                  {(() => {
                    const availableDays = Array.from(new Set(jadwalOptions.map(j => j.hari)));
                    const upcomingSlots = getUpcomingDateSlots(availableDays);

                    if (upcomingSlots.length === 0) return null;

                    return (
                      <div className="mb-3">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                          {upcomingSlots.slice(0, 8).map((slot) => {
                            const isSelected = formData.tanggal === slot.iso;
                            return (
                              <button
                                key={slot.iso}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, tanggal: slot.iso }))}
                                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400 shadow-md scale-[1.02]"
                                    : "bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-700"
                                }`}
                              >
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                                  {slot.dayName}
                                </span>
                                <span className="text-lg font-black my-0.5">
                                  {slot.dayNum}
                                </span>
                                <span className={`text-[10px] font-medium ${isSelected ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                                  {slot.monthName}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Date Summary */}
                        {formData.tanggal && (
                          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 font-medium">
                            <CheckCircle size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                            <span>
                              Tanggal terpilih: <strong>{
                                upcomingSlots.find(s => s.iso === formData.tanggal)?.formatted || formData.tanggal
                              }</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Optional manual date fallback */}
                  <details className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <summary className="cursor-pointer hover:underline font-medium inline-block">
                      Pilih tanggal manual di kalender...
                    </summary>
                    <input
                      type="date"
                      name="tanggal"
                      required
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 color-scheme-auto dark:[color-scheme:dark] mt-1.5"
                    />
                  </details>

                  {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Jam Mulai</label>
                  <select
                    name="jam"
                    value={formData.jam}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {/* Simplified slot generation */}
                    {Array.from({ length: 13 }).map((_, i) => {
                      const h = Math.floor(i / 2) + 17;
                      const m = i % 2 === 0 ? "00" : "30";
                      const time = `${h}:${m}`;
                      return (
                        <option key={time} value={time} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          {time}
                        </option>
                      );
                    })}
                  </select>
                  {errors.jam && <p className="text-red-500 text-xs mt-1">{errors.jam[0]}</p>}
                </div>
              </>
            ) : formData.matkul && (
              <p className="text-yellow-600 dark:text-yellow-400 text-sm bg-yellow-50 dark:bg-yellow-950/40 p-3 rounded-lg">
                Maaf, belum ada jadwal tersedia untuk matkul ini. Hubungi Joy untuk request manual.
              </p>
            )}
          </div>
        )}

        {/* Step 3: Konfirmasi & Bayar */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300 mb-4">
              <p className="font-bold mb-1">Instruksi Pembayaran:</p>
              <p>1. Hubungi Joy (WA: 08123456789) untuk konfirmasi slot.</p>
              <p>2. Transfer Rp 50.000 ke GoPay/Dana 08123456789.</p>
              <p>3. Upload bukti bayar ke Google Drive (Pastikan link &quot;Anyone with link can view&quot;).</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  name="sudahHubungiJoy"
                  checked={formData.sudahHubungiJoy}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm">Saya sudah menghubungi Joy dan konfirmasi slot ini.</span>
              </label>
              {errors.sudahHubungiJoy && <p className="text-red-500 text-xs">{errors.sudahHubungiJoy[0]}</p>}

              <label className="flex items-start gap-3 cursor-pointer text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  name="sudahBayar"
                  checked={formData.sudahBayar}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <span className="text-sm">Saya sudah melakukan pembayaran.</span>
              </label>
              {errors.sudahBayar && <p className="text-red-500 text-xs">{errors.sudahBayar[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Link Bukti Bayar (G-Drive)</label>
              <input
                type="url"
                name="buktiBayarUrl"
                required
                value={formData.buktiBayarUrl}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://drive.google.com/..."
              />
              {errors.buktiBayarUrl && <p className="text-red-500 text-xs mt-1">{errors.buktiBayarUrl[0]}</p>}
            </div>

            {errors.form && <p className="text-red-500 text-sm font-bold">{errors.form[0]}</p>}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold transition-all shadow-xs"
            >
              Kembali
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={step === 1 && (!formData.namaLengkap || !formData.angkatan || !formData.kontak)}
              className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !formData.sudahHubungiJoy || !formData.sudahBayar || !formData.buktiBayarUrl}
              className="flex-1 py-3 px-6 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Memproses..." : "Submit Request"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
