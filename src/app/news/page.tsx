"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, Calendar, ArrowRight, Search, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface NewsItem {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  image_url: string;
  created_at: string;
  published_at: string | null;
}

interface Event {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  date: string;
  location_en: string;
  location_fr: string;
}

type Tab = "news" | "events";

export default function NewsEventsPage() {
  const { t, language } = useI18n();
  const [tab, setTab] = useState<Tab>("news");

  // News state
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventsLoading, setEventsLoading] = useState(true);

  const dateLocale = language === "fr" ? fr : enUS;

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .then(({ data }) => {
        if (data) setNews(data);
        setNewsLoading(false);
      });

    supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data);
        setEventsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = events;
    if (selectedDate) {
      const sel = format(selectedDate, "yyyy-MM-dd");
      filtered = filtered.filter((e) => e.date === sel);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e[`title_${language}` as keyof Event]?.toString().toLowerCase().includes(q) ||
          e[`description_${language}` as keyof Event]?.toString().toLowerCase().includes(q) ||
          e[`location_${language}` as keyof Event]?.toString().toLowerCase().includes(q)
      );
    }
    setFilteredEvents(filtered);
  }, [events, selectedDate, searchQuery, language]);

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen bg-white dark:bg-sage-950 pb-20 transition-colors duration-300">
      {/* Hero */}
      <div className="relative py-24 bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t("nav.news_events")}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex gap-2 mt-10 mb-12 border-b border-sage-100 dark:border-sage-800">
          {(["news", "events"] as Tab[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-8 py-4 font-bold text-lg rounded-t-xl transition-all ${
                tab === key
                  ? "bg-terracotta-500 text-white"
                  : "text-sage-600 dark:text-sage-400 hover:text-sage-800 dark:hover:text-sage-100"
              }`}
            >
              {key === "news"
                ? language === "fr" ? "Actualités" : "News"
                : language === "fr" ? "Événements" : "Events"}
            </button>
          ))}
        </div>

        {/* NEWS TAB */}
        {tab === "news" && (
          <>
            {newsLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-terracotta-500">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-bold text-lg">{language === "fr" ? "Chargement..." : "Loading..."}</p>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-32 text-sage-500 dark:text-sage-400">
                <p className="text-xl font-bold">
                  {language === "fr" ? "Aucune actualité pour le moment." : "No news yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {news.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group grid md:grid-cols-2 gap-12 items-center"
                  >
                    <div
                      className={`overflow-hidden rounded-[3rem] h-[400px] relative border border-sage-100 dark:border-sage-800 ${
                        i % 2 === 1 ? "md:order-last" : ""
                      }`}
                    >
                      <Image
                        src={item.image_url || "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000"}
                        alt={language === "en" ? item.title_en : item.title_fr}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 text-terracotta-500 mb-6 font-bold">
                        <Calendar className="w-5 h-5" />
                        <span>
                          {format(new Date(item.published_at || item.created_at), "PPP", {
                            locale: dateLocale,
                          })}
                        </span>
                      </div>
                      <h2 className="text-4xl font-bold text-sage-800 dark:text-sage-100 mb-6 group-hover:text-terracotta-500 transition-colors">
                        {language === "en" ? item.title_en : item.title_fr}
                      </h2>
                      <p className="text-sage-700/70 dark:text-sage-300/80 text-xl leading-relaxed mb-10">
                        {(() => {
                          const content = language === "en" ? item.content_en : item.content_fr;
                          if (expandedIds.has(item.id) || content.length <= 200) return content;
                          return content.slice(0, 200) + "...";
                        })()}
                      </p>
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="flex items-center gap-3 text-terracotta-500 font-black text-lg hover:translate-x-2 transition-transform"
                      >
                        {expandedIds.has(item.id)
                          ? language === "en" ? "Show Less" : "Voir moins"
                          : language === "en" ? "Read Full Story" : "Lire la suite"}
                        <ArrowRight
                          className={`w-6 h-6 transition-transform ${
                            expandedIds.has(item.id) ? "-rotate-90" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* EVENTS TAB */}
        {tab === "events" && (
          <div className="grid lg:grid-cols-[380px_1fr] gap-12">
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-sage-50 dark:bg-sage-900 p-6 rounded-[2rem] border border-sage-100 dark:border-sage-800">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terracotta-400" />
                  <Input
                    placeholder={language === "fr" ? "Rechercher un événement..." : "Search events..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-sage-200 dark:border-sage-700 focus:ring-terracotta-400"
                  />
                </div>
                <UiCalendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl border-0"
                  locale={dateLocale}
                />
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="w-full mt-4 text-sm text-terracotta-500 font-medium hover:underline"
                >
                  {language === "fr" ? "Effacer la date" : "Clear date"}
                </button>
              </div>
            </div>

            {/* Event list */}
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-sage-800 dark:text-sage-100">
                  {selectedDate
                    ? format(selectedDate, "PPPP", { locale: dateLocale })
                    : language === "fr" ? "Tous les événements" : "All Events"}
                </h2>
                <span className="text-terracotta-500 font-medium">
                  {filteredEvents.length}{" "}
                  {language === "fr" ? "événement(s) trouvé(s)" : "event(s) found"}
                </span>
              </div>

              {eventsLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-12 h-12 border-4 border-sage-200 border-t-terracotta-500 rounded-full animate-spin" />
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="grid gap-6">
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-sage-900 p-8 rounded-[2rem] shadow-sm border border-sage-100 dark:border-sage-800 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-20 h-20 bg-sage-50 dark:bg-sage-800 rounded-2xl flex flex-col items-center justify-center text-terracotta-500 border border-sage-100 dark:border-sage-700 shrink-0">
                          <span className="text-2xl font-black">
                            {format(new Date(event.date), "dd")}
                          </span>
                          <span className="text-xs font-bold uppercase">
                            {format(new Date(event.date), "MMM")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-terracotta-500 text-sm font-bold mb-2">
                            <MapPin className="w-4 h-4" />
                            {event[`location_${language}` as keyof Event]}
                          </div>
                          <h3 className="text-2xl font-bold text-sage-800 dark:text-sage-100 mb-2">
                            {event[`title_${language}` as keyof Event]}
                          </h3>
                          <p className="text-sage-700/60 dark:text-sage-300/70 leading-relaxed">
                            {event[`description_${language}` as keyof Event]}
                          </p>
                        </div>
                        <button className="bg-sage-50 dark:bg-sage-800 text-terracotta-500 px-6 py-3 rounded-xl font-bold group-hover:bg-terracotta-500 group-hover:text-white transition-all self-start md:self-center">
                          {language === "fr" ? "Détails" : "Details"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-sage-900 p-20 rounded-[2rem] border border-sage-100 dark:border-sage-800 text-center">
                  <CalendarIcon className="w-16 h-16 text-sage-200 dark:text-sage-700 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-sage-800 dark:text-sage-100 mb-2">
                    {language === "fr" ? "Aucun événement trouvé" : "No events found"}
                  </h3>
                  <p className="text-sage-700/60 dark:text-sage-400">
                    {language === "fr"
                      ? "Essayez de changer la date ou la recherche."
                      : "Try changing the date or your search query."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
