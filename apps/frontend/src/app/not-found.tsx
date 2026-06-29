export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070c18]">
      <div className="text-center">
        <p className="text-8xl font-black text-white mb-4">404</p>
        <p className="text-slate-400 text-lg mb-8">Trang không tồn tại</p>
        <a href="/" className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors">
          Về trang chủ
        </a>
      </div>
    </div>
  );
}
