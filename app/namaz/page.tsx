import namazSteps from "@/data/namazSteps.json";

export default function NamazPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Namaz — What to Recite</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">Every recitation in Salah, in order, from Takbeer to Salam.</p>

      <ol className="mt-8 space-y-5">
        {namazSteps.map((step: any) => (
          <li key={step.order} className="rounded-xl2 border border-primary-100 bg-white p-6 shadow-card dark:border-primary-900 dark:bg-night-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">Step {step.order} · {step.title}</p>
            <p dir="rtl" className="ayah-arabic mt-3 text-right text-2xl">{step.arabic}</p>
            <p className="mt-3 text-sm">{step.english}</p>
            <p dir="rtl" className="mt-1 text-right text-sm">{step.urdu}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
