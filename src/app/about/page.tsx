"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Info, Shield, TreePine, GraduationCap, Leaf, Sun, Sprout, Users, FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';


function TeamMemberCard({ member, language, index }: { member: any, language: string, index: number }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const role = language === 'fr' ? member.role_fr : member.role_en;
  const bio = language === 'fr' ? member.bio_fr : member.bio_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-sage-800 rounded-3xl overflow-hidden border border-sage-100 dark:border-sage-700 shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden flex-shrink-0 relative">
        <Image
          src={member.photo_url || '/images/placeholder.jpg'}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-sage-800 dark:text-sage-100 mb-1 line-clamp-2">{member.name}</h3>
        <p className="text-terracotta-600 dark:text-terracotta-400 font-bold text-sm mb-4 min-h-[40px]">
          {role}
        </p>
        <div className="relative">
          <p className={`text-sage-700/70 dark:text-sage-300/80 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
            {bio}
          </p>
          {bio && bio.length > 150 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 text-terracotta-600 dark:text-terracotta-400 font-bold text-xs hover:text-terracotta-700 transition-colors uppercase tracking-wider text-left"
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
      {/* Carousel viewport */}
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="flex gap-8">
          {teamMembers.map((member, i) => (
            <div key={member.name} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
              <TeamMemberCard member={member} language={language} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
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
        <div className="flex justify-center gap-2 mt-6">
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

export default function AboutPage() {
  const { t, language } = useI18n();
  const [reports, setReports] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("reports")
      .select("*")
      .order("year", { ascending: false })
      .then(({ data }) => { if (data) setReports(data); });

    supabase
      .from("group_members")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => { if (data) setTeamMembers(data); });
  }, []);

  const presentation = {
    en: "Founded in 2004, Association Salamandra Nature is a non-profit association active in France and Madagascar. Its main objective is to promote knowledge, nature conservation, and sustainable development, with a particular focus on the preservation of endangered species, Madagascar's tortoise fauna, and natural ecosystems.",
    fr: "Créée en 2004, l'Association Salamandra Nature est une association à but non lucratif active en France et à Madagascar. Son objectif principal est de promouvoir la connaissance, la conservation de la nature et le développement durable, avec un accent particulier sur la préservation des espèces menacées, la faune chélonienne de Madagascar et des écosystèmes naturels."
  };

  const actions = [
    {
      icon: Shield,
      content: {
        en: "Protection of endemic and endangered land tortoises in Southwest Madagascar—Radiated tortoise (Astrochelys radiata, Sokake) and Spider tortoise (Pyxis arachnoides, Sokapila)—fighting against illegal trafficking and conserving populations.",
        fr: "Protection des tortues terrestres endémiques et menacées du Sud-ouest de Madagascar, tortue étoilée, Astrochelys radiata, Sokake et tortue araignée, Pyxis arachnoides, Sokapila— lutte contre leur trafic illégal et conservation des populations."
      }
    },
    {
      icon: TreePine,
      content: {
        en: "Combating deforestation and the degradation of natural habitats.",
        fr: "Lutte contre la déforestation et dégradation des habitats naturels."
      }
    },
    {
      icon: Leaf,
      content: {
        en: "Preservation and enhancement of local biodiversity within the framework of environmental education.",
        fr: "Préservation et valorisation de la biodiversité locale dans le cadre de l'éducation à l'environnement."
      }
    },
    {
      icon: GraduationCap,
      content: {
        en: "Public awareness of conservation and sustainable development in Madagascar and France.",
        fr: "Sensibilisation du public à la conservation et au développement durable à Madagascar et en France."
      }
    },
    {
      icon: Sun,
      content: {
        en: "Promotion of sustainable technologies, such as the popularization of solar cookers among local communities.",
        fr: "Promotion de technologies durables, comme la vulgarisation de cuiseurs solaires auprès de communautés locales."
      }
    },
    {
      icon: Sprout,
      content: {
        en: "Planting of local species in Southwest Madagascar to restore ecosystems.",
        fr: "Plantation d'essences locales dans le Sud-ouest de Madagascar pour restaurer les écosystèmes."
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-sage-950 pb-20 transition-colors duration-300">
      <div className="relative py-24 bg-sage-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('about.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div id="presentation" className="mb-24 scroll-mt-28">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-300">
              <Info className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-sage-800 dark:text-sage-100">{t('about.presentation')}</h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl text-sage-700/80 dark:text-sage-300/90 leading-relaxed max-w-5xl"
          >
            {presentation[language as 'en' | 'fr']}
          </motion.p>
        </div>

        <div id="actions" className="mb-32 scroll-mt-28">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-300">
              <Sprout className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-sage-800 dark:text-sage-100">{t('about.actions')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {actions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 p-8 bg-sage-50/50 dark:bg-sage-800/40 rounded-3xl border border-sage-100 dark:border-sage-700 hover:shadow-xl hover:shadow-sage-200/50 dark:hover:shadow-sage-900/50 transition-all group"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white dark:bg-sage-700 rounded-2xl flex items-center justify-center text-sage-600 dark:text-sage-300 shadow-sm border border-sage-100 dark:border-sage-600 group-hover:bg-terracotta-500 group-hover:text-white transition-colors">
                    <action.icon className="w-7 h-7" />
                  </div>
                </div>
                <p className="text-lg text-sage-700/80 dark:text-sage-300/90 leading-relaxed pt-2">
                  {action.content[language as 'en' | 'fr']}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reports Section */}
        <div id="documents" className="mb-32 scroll-mt-28">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-300">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-sage-800 dark:text-sage-100">{t('about.reports')}</h2>
          </div>

          {reports.length === 0 ? (
            <p className="text-sage-500 dark:text-sage-400 italic">{language === 'fr' ? 'Aucun rapport disponible pour le moment.' : 'No reports available yet.'}</p>
          ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report, i) => (
              <motion.div
                key={report.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5 p-6 bg-sage-50/50 dark:bg-sage-800/40 rounded-2xl border border-sage-100 dark:border-sage-700 hover:shadow-lg transition-all group"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-sage-700 rounded-xl flex items-center justify-center text-terracotta-500 shadow-sm border border-sage-100 dark:border-sage-600 group-hover:bg-terracotta-500 group-hover:text-white transition-colors">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-lg font-bold text-sage-800 dark:text-sage-100 leading-tight">
                      {language === 'fr' ? (report.title_fr || report.title_en) : report.title_en}
                    </h3>
                    {report.year && (
                      <span className="flex-shrink-0 text-xs font-semibold text-sage-500 dark:text-sage-400 bg-sage-100 dark:bg-sage-700 px-2 py-0.5 rounded-full">
                        {report.year}
                      </span>
                    )}
                  </div>
                  {(report.description_en || report.description_fr) && (
                    <p className="text-sm text-sage-700/70 dark:text-sage-300/80 leading-relaxed mb-4">
                      {language === 'fr' ? (report.description_fr || report.description_en) : report.description_en}
                    </p>
                  )}
                  {report.file_url && (
                    <a
                      href={report.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-2 text-sm font-bold text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t('about.reports.download')}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>

          {/* Team Section */}
          <div className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-300">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-bold text-sage-800 dark:text-sage-100">
                {language === 'fr' ? 'Notre Équipe' : 'Our Team'}
              </h2>
            </div>

            <TeamCarousel teamMembers={teamMembers} language={language} />
          </div>

      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-sage-900 text-white p-16 rounded-[4rem] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000')] bg-cover bg-center" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-8">
              {language === 'fr' ? 'Envie de nous rejoindre ?' : 'Want to Join Us?'}
            </h2>
            <p className="text-xl text-sage-100/80 mb-12 leading-relaxed">
              {language === 'fr'
                ? 'Nous sommes toujours à la recherche de bénévoles et de partenaires passionnés pour nous aider à accroître notre impact à Madagascar.'
                : 'We are always looking for passionate volunteers and partners to help us scale our impact across Madagascar.'}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/contact" className="bg-terracotta-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-terracotta-600 transition-all shadow-lg">
                {language === 'fr' ? 'Devenir Partenaire' : 'Partner With Us'}
              </a>
              <a href="/contact" className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-sage-900 transition-all">
                {language === 'fr' ? 'Bénévolat' : 'Volunteer'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
