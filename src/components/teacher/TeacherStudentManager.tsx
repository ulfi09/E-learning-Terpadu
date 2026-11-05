import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  X,
  Upload,
  BookOpen,
  Award,
  CalendarCheck,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';

export const TeacherStudentManager: React.FC = () => {
  const { students, addStudent, deleteStudent, attendanceRecords, modules, studentGradeSummaries, login } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formNis, setFormNis] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formClass, setFormClass] = useState('XII MIPA 1 - Sains Komputasi');
  const [formPhone, setFormPhone] = useState('0812-');
  const [formAvatar, setFormAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );

  const avatarPresets = [
    { label: 'Siswa 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { label: 'Siswa 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
    { label: 'Siswa 3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    { label: 'Siswa 4', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80' },
    { label: 'Siswa 5', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
    { label: 'Siswa 6', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80' },
  ];

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formNis.trim()) return;

    addStudent({
      name: formName.trim(),
      nis: formNis.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@lentera.edu`,
      className: formClass,
      phone: formPhone.trim(),
      avatar: formAvatar,
    });

    // Reset & close
    setShowAddModal(false);
    setFormName('');
    setFormNis('');
    setFormEmail('');
    setFormPhone('0812-');
  };

  const filteredStudents = students.filter((s) => {
    if (selectedClassFilter !== 'all' && s.className !== selectedClassFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.nis.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Manajemen Data Siswa & Rombel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftarkan murid baru, kelola nomor induk (NIS), pantau aktivitas presensi dan capaian akademik siswa
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Murid Baru</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Siswa Terdaftar</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {students.length} <span className="text-xs font-normal text-slate-400">Murid Aktif</span>
          </div>
          <div className="text-xs text-slate-500">Tersebar di rombongan belajar 2026/2027</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rombel Utama</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            XII MIPA 1
          </div>
          <div className="text-xs text-slate-500">Peminatan Sains Komputasi & Teknologi</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Konektivitas Sistem</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            100%
          </div>
          <div className="text-xs text-slate-500">Semua data siswa terintegrasi ke Absensi & Nilai</div>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Filter Rombel:
          </span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500"
          >
            <option value="all">Semua Rombel ({students.length})</option>
            <option value="XII MIPA 1 - Sains Komputasi">XII MIPA 1 - Sains Komputasi</option>
            <option value="XII MIPA 2 - Sains Rekayasa">XII MIPA 2 - Sains Rekayasa</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau NIS siswa..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3.5 px-4">Nama Siswa & NIS</th>
                <th className="py-3.5 px-4">Kelas / Rombel</th>
                <th className="py-3.5 px-4">Kontak & Email</th>
                <th className="py-3.5 px-4 text-center">Status Presensi</th>
                <th className="py-3.5 px-4 text-center">Materi Terbaca</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((student) => {
                const studentAtt = attendanceRecords.filter((r) => r.studentId === student.id);
                const presentCount = studentAtt.filter((r) => r.status === 'hadir').length;
                const attRate = studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 100;

                const readModulesCount = modules.filter((m) => m.readByStudentIds.includes(student.id)).length;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                          <div className="text-xs text-indigo-600 font-mono font-semibold">
                            NIS: {student.nis}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {student.className}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Terdaftar: {student.enrolledDate || '15 Juli 2024'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{student.phone || '0812-3456-7890'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {attRate}% Hadir
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700">
                        <BookOpen className="w-3.5 h-3.5" />
                        {readModulesCount} / {modules.length} Modul
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            login({
                              id: student.id,
                              name: student.name,
                              role: 'siswa',
                              email: student.email,
                              avatarUrl: student.avatar,
                              identifier: student.nis,
                              className: student.className,
                            });
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          title="Simulasi Masuk sebagai Siswa Ini"
                        >
                          Masuk Siswa
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus Siswa dari Kelas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Tambah Murid Baru ke Kelas
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  required
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Bella Maharani Putri"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    NIS (Nomor Induk Siswa) *
                  </label>
                  <input
                    required
                    type="text"
                    value={formNis}
                    onChange={(e) => setFormNis(e.target.value)}
                    placeholder="Contoh: 2024.12.125"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Rombel / Kelas
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="XII MIPA 1 - Sains Komputasi">XII MIPA 1 - Sains Komputasi</option>
                    <option value="XII MIPA 2 - Sains Rekayasa">XII MIPA 2 - Sains Rekayasa</option>
                    <option value="XI MIPA 1 - Dasar Komputasi">XI MIPA 1 - Dasar Komputasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Siswa (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="bella.maharani@lentera.edu"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor WhatsApp / Telp
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Foto Profil Siswa
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={formAvatar}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-xs shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">Pilih dari preset atau unggah foto:</div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah File Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatar(preset.url)}
                      className={`relative rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                        formAvatar === preset.url ? 'border-indigo-600 scale-105 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-9 h-9 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Simpan & Daftarkan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
