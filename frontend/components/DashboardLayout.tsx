import Navbar from "@/components/Navbar"; // Assumes you already have a Navbar component

export function DashboardLayout({ title, children }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#e0e9f7] via-[#f2faff] to-[#f0eeff]">
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center pt-24">
        <section className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl border border-slate-200 bg-white/70 backdrop-blur-lg p-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow-lg mb-8 text-center">
            {title}
          </h1>
          {children}
        </section>
      </main>
    </div>
  );
}
