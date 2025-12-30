"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { History, Target, Eye, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const { t } = useI18n();

  const sections = [
    {
      icon: History,
      title: 'about.history',
      content: {
        en: "Founded in 2009 by a group of passionate conservationists, our NGO started with a small mission to protect hawksbill turtle nests in northern Madagascar. Over the years, we have expanded our reach to cover both the eastern and western coasts, becoming a key player in Madagascar's marine biodiversity preservation.",
        fr: "Fondée en 2009 par un groupe de défenseurs passionnés de la nature, notre ONG a débuté par une petite mission de protection des nids de tortues imbriquées dans le nord de Madagascar. Au fil des ans, nous avons étendu notre action aux côtes est et ouest, devenant un acteur clé de la préservation de la biodiversité marine à Madagascar."
      }
    },
    {
      icon: Target,
      title: 'about.mission',
      content: {
        en: "Our mission is to ensure the long-term survival of Madagascar's sea turtles and their habitats through scientific research, community-led protection, and educational outreach.",
        fr: "Notre mission est d'assurer la survie à long terme des tortues marines de Madagascar et de leurs habitats grâce à la recherche scientifique, la protection menée par les communautés et la sensibilisation éducative."
      }
    },
    {
      icon: Eye,
      title: 'about.vision',
      content: {
        en: "We envision a future where Madagascar's coastal ecosystems thrive, with healthy turtle populations coexisting peacefully with prosperous local communities.",
        fr: "Nous envisageons un avenir où les écosystèmes côtiers de Madagascar prospèrent, avec des populations de tortues en bonne santé coexistant pacifiquement avec des communautés locales prospères."
      }
    },
    {
      icon: ShieldCheck,
      title: 'about.values',
      content: {
        en: "Integrity, Community Empowerment, Scientific Rigor, and Sustainable Innovation guide everything we do in the field and in the office.",
        fr: "L'intégrité, l'autonomisation des communautés, la rigueur scientifique et l'innovation durable guident tout ce que nous faisons sur le terrain et au bureau."
      }
    }
  ];

  const { language } = useI18n();

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('nav.about')}
          </motion.h1>
          <div className="w-24 h-2 bg-emerald-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid md:grid-cols-2 gap-16">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-8"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <section.icon className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-emerald-900 mb-6">{t(section.title)}</h2>
                <p className="text-emerald-800/70 text-lg leading-relaxed">
                  {section.content[language]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team / Call to Action */}
      <div className="max-w-4xl mx-auto px-4 mt-32 text-center">
        <div className="bg-emerald-50 p-16 rounded-[4rem] border border-emerald-100">
          <h2 className="text-4xl font-black text-emerald-900 mb-8">Want to Join Us?</h2>
          <p className="text-xl text-emerald-800/70 mb-12 leading-relaxed">
            We are always looking for passionate volunteers and partners to help us scale our impact across Madagascar's coasts.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/contact" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg">
              Partner With Us
            </a>
            <a href="/contact" className="border-2 border-emerald-600 text-emerald-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-100 transition-all">
              Volunteer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
