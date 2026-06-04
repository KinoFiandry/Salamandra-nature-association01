"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Shield, BookOpen, Search, ArrowRight, Heart, Users, ChevronLeft, ChevronRight, Target, Leaf, GraduationCap, TreePine, Globe, Sprout } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

function TeamMemberCard({ member, language, index }: { member: any, language: string, index: number }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const role = language === 'fr' ? member.role_fr : member.role_en;
  const bio = language === 'fr' ? member.bio_fr : member.bio_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-sage-800 rounded-[2rem] overflow-hidden border border-terracotta-100 dark:border-sage-700 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
    >
      <div className="h-64 overflow-hidden relative flex-shrink-0">
        <Image
          src={member.photo_url || '/images/placeholder.jpg'}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1280px) 45vw, 22vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-sage-800 dark:text-sage-100 mb-1 line-clamp-2">{member.name}</h3>
        <p className="text-terracotta-600 dark:text-terracotta-400 font-bold text-sm mb-4 min-h-[40px]">{role}</p>
        <div className="relative">
          <p className={`text-sage-700/60 dark:text-sage-300/80 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
            {bio}
          </p>
          {bio && bio.length > 150 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 text-terracotta-600 dark:text-terracotta-400 font-bold text-xs hover:text-terracotta-700 transition-colors uppercase tracking-wider"
            >
              {isExpanded
                ? (language === 'fr' ? 'Voir moins' : 'See less')
                : (language === 'fr' ? 'Voir plus' : 'See more')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TeamCarousel({ teamMembers, language }: { teamMembers: any[], language: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', containScroll: 'trimSnaps', loop: true },
    [Autoplay({ delay: 3500, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  // Pause/resume autoplay on hover
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;
    if (isHovering) {
      autoplay.stop();
    } else {
      autoplay.play();
    }
  }, [isHovering, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-16 text-sage-400">
        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">{language === 'fr' ? 'Aucun membre pour le moment.' : 'No team members yet.'}</p>
      </div>
    );
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-8">
          {teamMembers.map((member, i) => (
            <div key={member.name} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_22%] min-w-0 h-full">
              <TeamMemberCard member={member} language={language} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows (hover-visible) */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-sage-800 shadow-lg border border-sage-100 dark:border-sage-700 flex items-center justify-center text-sage-700 dark:text-sage-200 opacity-0 group-hover:opacity-100 hover:bg-terracotta-500 hover:text-white hover:border-terracotta-500 transition-all duration-300 z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-sage-800 shadow-lg border border-sage-100 dark:border-sage-700 flex items-center justify-center text-sage-700 dark:text-sage-200 opacity-0 group-hover:opacity-100 hover:bg-terracotta-500 hover:text-white hover:border-terracotta-500 transition-all duration-300 z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? 'bg-terracotta-500 w-7'
                  : 'bg-sage-300 dark:bg-sage-600 hover:bg-sage-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { t, language } = useI18n();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("group_members").select("*").order("display_order", { ascending: true })
      .then(({ data }) => { if (data) setTeamMembers(data); });
    supabase.from("news").select("*").order("created_at", { ascending: false }).limit(2)
      .then(({ data }) => { if (data) setNewsItems(data); });
    supabase.from("missions").select("*").order("display_order", { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setMissions(data); });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-sage-950 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/baobab.jpg"
              alt="Baobab trees Avenue of the Baobabs Madagascar"
              fill
              priority
              sizes="100vw"
              className="object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-terracotta-950/60 via-sage-900/30 to-transparent" />

          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              {t('hero.title')}{" "}
              <span className="text-terracotta-400">{t('hero.titleAccent')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-sage-100/90 mb-10 leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/donate"
                className="group bg-terracotta-500 hover:bg-terracotta-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-terracotta-900/20 flex items-center justify-center gap-2"
              >
                {t('hero.cta')}
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {t('hero.learnMore')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-sage-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {[
              { val: "20+", label: 'impact.years' },
              { val: "3,000+", label: 'impact.turtles' },
              { val: "50+", label: 'impact.communities' },
              { val: "10+", label: 'impact.hectares' }
            ].map((stat, i) => (
              <motion.div key={i} variants={item} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-terracotta-400 mb-2">{stat.val}</div>
                <div className="text-sm md:text-base text-sage-200 font-medium uppercase tracking-widest">
                  {t(stat.label)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Missions Section */}
      <section className="py-32 bg-white dark:bg-sage-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-sage-800 dark:text-sage-100 mb-6">
              {t('missions.title')}
            </h2>
            <div className="w-24 h-2 bg-terracotta-500 mx-auto rounded-full" />
          </div>

          {(() => {
            const iconMap: Record<string, React.ElementType> = {
              shield: Shield, book: BookOpen, search: Search, target: Target,
              leaf: Leaf, education: GraduationCap, tree: TreePine, globe: Globe, sprout: Sprout,
            };
            const fallback = [
              { id: 'f1', icon: 'shield', title_en: 'Habitat Protection', title_fr: 'Protection de l\'Habitat', description_en: 'Preserving critical dry forests and scrublands essential for land turtle survival in southern Madagascar.', description_fr: 'Préservation des forêts sèches critiques pour la survie des tortues terrestres.' },
              { id: 'f2', icon: 'book', title_en: 'Community Education', title_fr: 'Éducation Communautaire', description_en: 'Engaging local communities through awareness programs and sustainable livelihood alternatives.', description_fr: 'Impliquer les communautés locales par des programmes de sensibilisation.' },
              { id: 'f3', icon: 'search', title_en: 'Research & Monitoring', title_fr: 'Recherche & Suivi', description_en: 'Conducting scientific research to better understand and protect endangered land turtle populations.', description_fr: 'Mener des recherches scientifiques pour mieux comprendre et protéger les tortues menacées.' },
            ];
            const items = missions.length > 0 ? missions : fallback;
            return (
              <div className={`grid gap-10 ${items.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {items.map((m, i) => {
                  const IconComp = iconMap[m.icon] || Shield;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="bg-sage-50 dark:bg-sage-800/50 p-10 rounded-[3rem] border border-sage-100 dark:border-sage-700 hover:shadow-2xl hover:shadow-sage-900/5 transition-all group"
                    >
                      <div className="w-16 h-16 bg-white dark:bg-sage-700 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                        <IconComp className="w-8 h-8 text-sage-600 dark:text-sage-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-sage-800 dark:text-sage-100 mb-4">
                        {language === 'fr' ? m.title_fr : m.title_en}
                      </h3>
                      <p className="text-sage-700/70 dark:text-sage-300/80 leading-relaxed text-lg">
                        {language === 'fr' ? m.description_fr : m.description_en}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Featured News Preview */}
      <section className="py-24 bg-sage-50/50 dark:bg-sage-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-sage-800 dark:text-sage-100 mb-2">{t('news.title')}</h2>
              <div className="w-12 h-1.5 bg-terracotta-500 rounded-full" />
            </div>
            <Link href="/news" className="text-terracotta-600 dark:text-terracotta-400 font-bold hover:underline flex items-center gap-1">
              {t('nav.news')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {newsItems.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {newsItems.map((item) => (
                <div key={item.id} className="group bg-white dark:bg-sage-800 rounded-[2rem] overflow-hidden border border-sage-100 dark:border-sage-700 shadow-sm hover:shadow-xl transition-all">
                  <div className="h-64 overflow-hidden relative">
                    <Image
                      src={item.image_url || 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={language === 'fr' ? item.title_fr : item.title_en}
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-sage-800 dark:text-sage-100 mb-4">
                      {language === 'fr' ? item.title_fr : item.title_en}
                    </h3>
                    <p className="text-sage-700/60 dark:text-sage-300/70 mb-6 line-clamp-2">
                      {language === 'fr' ? item.content_fr : item.content_en}
                    </p>
                    <Link href="/news" className="inline-flex items-center gap-2 text-terracotta-600 dark:text-terracotta-400 font-bold group/link">
                      {t('news.readMore')} <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sage-700/60 dark:text-sage-400 text-center py-12">{t('news.noNews')}</p>
          )}
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-32 bg-terracotta-50/30 dark:bg-sage-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-terracotta-100 dark:bg-terracotta-900/30 px-6 py-2 rounded-full mb-6">
              <Users className="w-5 h-5 text-terracotta-700 dark:text-terracotta-400" />
              <span className="text-terracotta-800 dark:text-terracotta-300 font-bold text-sm uppercase tracking-widest">
                {language === 'fr' ? 'Notre Équipe' : 'Our Team'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-sage-800 dark:text-sage-100 mb-6">
              {language === 'fr' ? 'Les Membres de l\'Association' : 'Meet the Team'}
            </h2>
            <p className="text-xl text-sage-700/60 dark:text-sage-300/70 max-w-2xl mx-auto">
              {language === 'fr'
                ? 'Des passionnés dédiés à la protection des tortues terrestres de Madagascar.'
                : 'Passionate individuals dedicated to protecting Madagascar\'s land tortoises.'}
            </p>
          </div>

          <TeamCarousel teamMembers={teamMembers} language={language} />
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-sage-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-sage-900/20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">{t('cta.title')}</h2>
            <p className="text-xl text-sage-50 mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed font-light">
              {t('cta.desc')}
            </p>
            <Link
              href="/donate"
              className="inline-block bg-terracotta-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-terracotta-400 transition-all shadow-xl hover:-translate-y-1 relative z-10"
            >
              {t('cta.button')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-950 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <Image
                  src="/images/logo.png"
                  alt="Salamandra Nature"
                  width={200}
                  height={80}
                  style={{ height: '5rem', width: 'auto' }}
                />
              </div>
              <p className="text-sage-200/60 text-lg max-w-md leading-relaxed">
                {t('footer.desc')}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">{t('footer.links')}</h4>
              <ul className="space-y-4">
                {['home', 'about', 'projects', 'news', 'contact', 'admin'].map((link) => (
                  <li key={link}>
                    <Link href={link === 'home' ? '/' : `/${link}`} className="text-sage-200/60 hover:text-terracotta-400 transition-colors">
                      {t(`nav.${link}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">{t('footer.contact')}</h4>
              <div className="text-sage-200/60 space-y-4 leading-relaxed">
                <p>Résidence les Villas de Saint Florent, 20232 OLETTA, France</p>
                <p>salamandra.nature2@gmail.com</p>
                <p>+33 6 65 44 29 47</p>
              </div>
            </div>
          </div>
          <div className="border-t border-sage-900 mt-20 pt-10 text-center text-sage-200/40 text-sm">
            &copy; {new Date().getFullYear()} Salamandra Nature - Madagascar.
          </div>
        </div>
      </footer>
    </div>
  );
}
