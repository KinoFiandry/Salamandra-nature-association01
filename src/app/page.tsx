"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Shield, BookOpen, Search, ArrowRight, Heart, Users } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Riana Andriamanalina",
    role: { en: "Founder & Executive Director", fr: "Fondatrice & Directrice Exécutive" },
    bio: { 
      en: "A passionate herpetologist with 20+ years dedicated to Madagascar's endemic tortoises. Dr. Riana founded Salamandra Association to combat the alarming decline of radiated and spider tortoises.",
      fr: "Herpétologue passionnée avec plus de 20 ans dédiés aux tortues endémiques de Madagascar. Dr. Riana a fondé l'Association Salamandra pour lutter contre le déclin alarmant des tortues radiées et araignées."
    },
    image: "/images/leon.jpg"
  },
  {
    name: "Jean-Baptiste Rakoto",
    role: { en: "Field Operations Manager", fr: "Responsable des Opérations Terrain" },
    bio: {
      en: "Born in Toliara, Jean-Baptiste leads our ranger teams across the spiny forests. His deep knowledge of local ecosystems and community ties makes him invaluable to our conservation efforts.",
      fr: "Né à Toliara, Jean-Baptiste dirige nos équipes de rangers dans les forêts épineuses. Sa connaissance approfondie des écosystèmes locaux et ses liens communautaires sont inestimables."
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
  },
  {
    name: "Dr. Fanja Razafindrakoto",
    role: { en: "Head of Research", fr: "Responsable de la Recherche" },
    bio: {
      en: "Leading our scientific programs, Dr. Fanja specializes in tortoise population dynamics and habitat mapping using cutting-edge satellite technology.",
      fr: "Dirigeant nos programmes scientifiques, Dr. Fanja se spécialise dans la dynamique des populations de tortues et la cartographie des habitats par satellite."
    },
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400"
  },
  {
    name: "Hery Andrianarisoa",
    role: { en: "Community Outreach Coordinator", fr: "Coordinateur Communautaire" },
    bio: {
      en: "Hery bridges the gap between conservation science and local communities. He develops education programs that empower villages to become guardians of their natural heritage.",
      fr: "Hery fait le lien entre la science de la conservation et les communautés locales. Il développe des programmes éducatifs qui permettent aux villages de devenir gardiens de leur patrimoine naturel."
    },
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400"
  }
];

export default function Home() {
  const { t, language } = useI18n();

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
    <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2000"
              alt="Baobab trees Avenue of the Baobabs Madagascar"
              className="w-full h-full object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-emerald-900/30 to-transparent" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1597165826543-be016fe99b9e?q=80&w=1000"
                alt="Radiated tortoise Madagascar"
                className="w-full h-full object-contain object-right-bottom mix-blend-luminosity"
              />
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              {t('hero.title')}{" "}
              <span className="text-emerald-400">{t('hero.titleAccent')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-50/90 mb-10 leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/donate"
                className="group bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
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
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {[
              { val: "15+", label: 'impact.years' },
              { val: "5,000+", label: 'impact.turtles' },
              { val: "50+", label: 'impact.communities' },
              { val: "1,000+", label: 'impact.hectares' }
            ].map((stat, i) => (
              <motion.div key={i} variants={item} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">{stat.val}</div>
                <div className="text-sm md:text-base text-emerald-200 font-medium uppercase tracking-widest">
                  {t(stat.label)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-emerald-900 mb-6">
              {t('programs.title')}
            </h2>
            <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Shield,
                title: 'programs.habitat.title',
                desc: 'programs.habitat.desc'
              },
              {
                icon: BookOpen,
                title: 'programs.edu.title',
                desc: 'programs.edu.desc'
              },
              {
                icon: Search,
                title: 'programs.research.title',
                desc: 'programs.research.desc'
              }
            ].map((prog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <prog.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">{t(prog.title)}</h3>
                <p className="text-emerald-800/70 leading-relaxed text-lg">{t(prog.desc)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News Preview (Static for now, but uses i18n keys) */}
      <section className="py-24 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-emerald-900 mb-2">{t('news.title')}</h2>
              <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            <Link href="/news" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
              {t('nav.news')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
            <div className="grid md:grid-cols-2 gap-8">
              {/* Placeholder News Cards */}
              <div className="group bg-white rounded-[2rem] overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all">
                <div className="h-64 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-emerald-900 mb-4">Protecting Radiated Tortoise Habitats</h3>
                  <p className="text-emerald-800/60 mb-6 line-clamp-2">We have launched a new initiative to protect critical dry forest habitats in the Androy region, ensuring safe zones for endangered tortoise species.</p>
                  <Link href="/news" className="inline-flex items-center gap-2 text-emerald-600 font-bold group/link">
                    Read More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="group bg-white rounded-[2rem] overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all">
                <div className="h-64 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1518467166778-b88f373ffec7?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-emerald-900 mb-4">Community Workshop in Toliara</h3>
                  <p className="text-emerald-800/60 mb-6 line-clamp-2">Local leaders gathered in Toliara to discuss sustainable conservation practices and land management for turtle protection.</p>
                  <Link href="/news" className="inline-flex items-center gap-2 text-emerald-600 font-bold group/link">
                    Read More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-32 bg-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-amber-100 px-6 py-2 rounded-full mb-6">
              <Users className="w-5 h-5 text-amber-700" />
              <span className="text-amber-800 font-bold text-sm uppercase tracking-widest">
                {language === 'fr' ? 'Notre Équipe' : 'Our Team'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-emerald-900 mb-6">
              {language === 'fr' ? 'Les Membres de l\'Association' : 'Meet the Team'}
            </h2>
            <p className="text-xl text-emerald-800/60 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Des passionnés dédiés à la protection des tortues terrestres de Madagascar.'
                : 'Passionate individuals dedicated to protecting Madagascar\'s land tortoises.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-emerald-900 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-bold text-sm mb-4">{member.role[language as 'en' | 'fr']}</p>
                  <p className="text-emerald-800/60 text-sm leading-relaxed line-clamp-4">
                    {member.bio[language as 'en' | 'fr']}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">{t('cta.title')}</h2>
            <p className="text-xl text-emerald-50 mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed font-light">
              {t('cta.desc')}
            </p>
            <Link
              href="/donate"
              className="inline-block bg-white text-emerald-700 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-1 relative z-10"
            >
              {t('cta.button')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🦎</span>
                </div>
                <span className="text-2xl font-black tracking-tight">Salamandra Association</span>
              </div>
              <p className="text-emerald-200/60 text-lg max-w-md leading-relaxed">
                {t('footer.desc')}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">{t('footer.links')}</h4>
              <ul className="space-y-4">
                {['home', 'about', 'projects', 'news', 'contact', 'admin'].map((link) => (
                  <li key={link}>
                    <Link href={link === 'home' ? '/' : `/${link}`} className="text-emerald-200/60 hover:text-emerald-400 transition-colors">
                      {t(`nav.${link}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">{t('footer.contact')}</h4>
              <div className="text-emerald-200/60 space-y-4 leading-relaxed">
                <p>Toliara, Madagascar</p>
                <p>contact@salamandra.mg</p>
                <p>+261 20 22 123 45</p>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-900 mt-20 pt-10 text-center text-emerald-200/40 text-sm">
            &copy; {new Date().getFullYear()} Salamandra Association - Madagascar.
          </div>
        </div>
      </footer>
    </div>
  );
}
