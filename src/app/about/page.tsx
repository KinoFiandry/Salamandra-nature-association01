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
        en: "Founded in 2009 by a group of passionate conservationists, our NGO started with a mission to protect the Radiated and Spider tortoises in southern Madagascar. Over the years, we have expanded our reach to cover the entire southern spiny forest region, becoming a key player in Madagascar's terrestrial biodiversity preservation.",
        fr: "Fondée en 2009 par un groupe de défenseurs passionnés de la nature, notre ONG a débuté par une mission de protection des tortues radiées et des tortues araignées dans le sud de Madagascar. Au fil des ans, nous avons étendu notre action à l'ensemble de la région de la forêt épineuse du sud, devenant un acteur clé de la préservation de la biodiversité terrestre à Madagascar."
      }
    },
    {
      icon: Target,
      title: 'about.mission',
      content: {
        en: "Our mission is to ensure the long-term survival of Madagascar's land turtles and their habitats through scientific research, community-led protection, and educational outreach in the arid regions of the south.",
        fr: "Notre mission est d'assurer la survie à long terme des tortues terrestres de Madagascar et de leurs habitats grâce à la recherche scientifique, la protection menée par les communautés et la sensibilisation éducative dans les régions arides du sud."
      }
    },
    {
      icon: Eye,
      title: 'about.vision',
      content: {
        en: "We envision a future where Madagascar's unique spiny forest ecosystems thrive, with healthy tortoise populations coexisting peacefully with prosperous local communities.",
        fr: "Nous envisageons un avenir où les écosystèmes uniques de la forêt épineuse de Madagascar prospèrent, avec des populations de tortues en bonne santé coexistant paisiblement avec des communautés locales prospères."
      }
    },
    {
      icon: ShieldCheck,
      title: 'about.values',
      content: {
        en: "Integrity, Community Empowerment, Scientific Rigor, and Sustainable Innovation guide everything we do in the dry forests and in the office.",
        fr: "L'intégrité, l'autonomisation des communautés, la rigueur scientifique et l'innovation durable guident tout ce que nous faisons dans les forêts sèches et au bureau."
      }
    }
  ];

  const { language } = useI18n();

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-sage-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('nav.about')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
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
                <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center text-sage-600 shadow-sm border border-sage-100">
                  <section.icon className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-sage-800 mb-6">{t(section.title)}</h2>
                <p className="text-sage-700/70 text-lg leading-relaxed">
                  {section.content[language]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team / Call to Action */}
      <div className="max-w-4xl mx-auto px-4 mt-32 text-center">
        <div className="bg-sage-50 p-16 rounded-[4rem] border border-sage-100">
          <h2 className="text-4xl font-black text-sage-800 mb-8">Want to Join Us?</h2>
          <p className="text-xl text-sage-700/70 mb-12 leading-relaxed">
            We are always looking for passionate volunteers and partners to help us scale our impact across Madagascar's coasts.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/contact" className="bg-terracotta-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-terracotta-600 transition-all shadow-lg">
              Partner With Us
            </a>
            <a href="/contact" className="border-2 border-terracotta-500 text-terracotta-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-terracotta-50 transition-all">
              Volunteer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
