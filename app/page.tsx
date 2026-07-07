import {
  BookOpenText, Layers, LandPlot, HandHeart, Sparkles, Star, CalendarDays,
  Clock, Compass, ListOrdered, Headphones, Search, Heart, NotebookPen, Moon,
} from "lucide-react";
import { HomeCard } from "@/components/home/HomeCard";

const sections = [
  { href: "/quran", icon: BookOpenText, title: "Read Quran", description: "All 114 Surahs with Arabic, Urdu & English translation." },
  { href: "/siparah", icon: Layers, title: "30 Siparah", description: "Browse the Quran by Juz, resume where you left off." },
  { href: "/namaz", icon: LandPlot, title: "Daily Prayers", description: "Every recitation of Salah, from Takbeer to Salam." },
  { href: "/duas", icon: HandHeart, title: "Daily Duas", description: "Morning, evening, travel, and 15+ daily supplications." },
  { href: "/tasbeeh", icon: Sparkles, title: "Tasbeeh Counter", description: "Digital zikr counter with saved history." },
  { href: "/quran#ayat-of-day", icon: Star, title: "Ayat of the Day", description: "A fresh verse and reflection, every day." },
  { href: "/islamic-calendar", icon: CalendarDays, title: "Islamic Calendar", description: "Hijri dates and upcoming Islamic events." },
  { href: "/prayer-times", icon: Clock, title: "Prayer Times", description: "Fajr to Isha, based on your location, with countdown." },
  { href: "/qibla", icon: Compass, title: "Qibla Direction", description: "Compass pointing to the Kaaba from wherever you are." },
  { href: "/quran", icon: ListOrdered, title: "Surah Index", description: "Jump straight to any Surah by name or number." },
  { href: "/quran", icon: Headphones, title: "Listen Quran Audio", description: "Multiple reciters, ayah-by-ayah playback." },
  { href: "/search", icon: Search, title: "Search Quran", description: "Search by Surah, Ayah, or keyword across translations." },
  { href: "/bookmarks", icon: Heart, title: "Bookmarks", description: "Every Ayah, Surah or Siparah you've saved." },
  { href: "/notes", icon: NotebookPen, title: "Notes", description: "Your personal reflections on any Ayah." },
  { href: "/ramadan", icon: Moon, title: "Ramadan Section", description: "Sehri/Iftar times, Ramadan duas, Zakat calculator." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 font-arabic text-3xl text-gold-light sm:text-4xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Noor-ul-Quran</h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-100/90">
            One peaceful place for the Holy Quran, daily prayers, duas, and everything a Muslim
            needs for worship — built for children, adults, and elders alike.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/quran" className="rounded-full bg-gold px-6 py-3 font-semibold text-primary-900 shadow-goldGlow transition hover:brightness-105">
              Start Reading
            </a>
            <a href="/prayer-times" className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Today's Prayer Times
            </a>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="mb-8 font-display text-2xl font-bold">Everything in one place</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <HomeCard key={s.title} {...s} />
          ))}
        </div>
      </section>
    </div>
  );
}
