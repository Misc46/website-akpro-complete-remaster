import Link from "next/link";
import { Suspense } from "react";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  // Use a client component if you need to read searchParams, 
  // or just keep it simple since it's a success page.
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
        ✓
      </div>
      <h1 className="text-3xl font-bold mb-4">Request Berhasil!</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Terima kasih! Request kamu sudah kami terima dan sedang dalam proses verifikasi oleh admin. 
        Kami akan segera menghubungi kamu setelah pengasisten di-assign.
      </p>
      <div className="space-y-4">
        <Link
          href="/"
          className="block w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
        >
          Kembali ke Home
        </Link>
        <p className="text-sm text-gray-500">
          Jika ada kendala, hubungi Joy melalui WhatsApp.
        </p>
      </div>
    </div>
  );
}
