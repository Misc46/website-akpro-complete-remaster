import RequestForm from "@/app/components/RequestForm";

export default function RequestPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Request Asistensi Aktor</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Isi form di bawah untuk memesan sesi asistensi dengan pengasisten kami.
        </p>
      </div>

      <RequestForm />
    </div>
  );
}
