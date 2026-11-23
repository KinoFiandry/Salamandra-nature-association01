"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Info, Shield, TreePine, GraduationCap, Leaf, Sun, Sprout, Users, FileText, Download} from "lucide-react";


export default function AboutPage() {
  const { t, language } = useI18n();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("reports")
      .select("*")
      .order("year", { ascending: false })
      .then(({ data }) => { if (data) setReports(data); });

  }, []);

  const presentation = {
    en: "Established in 2004, Salamandra Nature is a non-profit organization active in France and Madagascar, dedicated to the study and preservation of nature, as well as to sustainable development.\n\nIts work focuses primarily on the conservation of threatened species—specifically the land tortoises of Madagascar—as well as the protection of their natural habitats and the ecosystems upon which they depend.\n\nThrough its conservation initiatives, educational programs, and efforts to engage local communities, Salamandra Nature strives to strengthen individual participation in the preservation of natural heritage and to promote sustainable practices that support biodiversity.",
    fr: "Créée en 2004, Salamandra Nature est une association à but non lucratif engagée en France et à Madagascar pour la connaissance, la préservation de la nature et le développement durable. \n\nSon action se concentre notamment sur la conservation des espèces menacées, en particulier les tortues terrestres de Madagascar, ainsi que sur la protection de leurs habitats naturels et des écosystèmes dont elles dépendent.\n\nÀ travers ses actions de conservation, d'éducation à la conservation de mobilisation des communautés locales, Salamandra Nature œuvre à renforcer la participation de chacun à la préservation du patrimoine naturel et à encourager des pratiques durables au service de la biodiversité."
  };

  const actions = [
    {
      icon: Shield,
      title: {
        en: "Protection of Madagascar’s endemic land tortoises",
        fr: "Protection des tortues terrestres endémiques de Madagascar"
      },
      content: {
        en: "Salamandra Nature is committed to the protection of endemic and threatened land tortoises in southwestern Madagascar, specifically the radiated tortoise (*Astrochelys radiata*), known locally as \"Sokake,\" and the spider tortoise (*Pyxis arachnoides*), known as \"Sokapila\".\n\nOur efforts are aimed at combating the illegal trafficking of these species, preserving their populations in their natural habitat, and contributing to their long-term conservation.",
        fr: "Salamandra Nature s’engage pour la protection des tortues terrestres endémiques et menacées du sud-ouest de Madagascar, notamment la tortue étoilée (Astrochelys radiata), appelée Sokake, et la tortue araignée (Pyxis arachnoides), appelée Sokapila.\n\nNos actions visent à lutter contre le trafic illégal de ces espèces, à préserver leurs populations dans leur milieu naturel et à contribuer durablement à leur conservation."
      }
    },
    {
      icon: TreePine,
      title: {
        en: "Preservation and enhancement of local biodiversity",
        fr: "Préservation et valorisation de la biodiversité locale"
      },
      content: {
        en: "Salamandra Nature conducts environmental education initiatives designed to raise public awareness about the richness of local biodiversity, its importance, and the challenges involved in its preservation.\n\nBy exploring various species and ecosystems, the association fosters a deeper understanding of our natural heritage and encourages individuals to get involved in its protection.",
        fr: "Salamandra Nature mène des actions d’éducation à l’environnement pour sensibiliser les publics à la richesse de la biodiversité locale, à son importance et aux enjeux de sa préservation.\n\nÀ travers la découverte des espèces et des écosystèmes, l’association encourage une meilleure connaissance du patrimoine naturel et favorise l’engagement de chacun en faveur de sa protection"
      }
    },
    {
      icon: Leaf,
      title: {
        en: "Preservation of natural habitats and promotion of sustainable technologies",
        fr: "Préservation des habitats naturels et promotion de technologies durables"
      },
      content: {
        en: "Salamandra Nature works to limit deforestation and the degradation of natural habitats, while encouraging the adoption of sustainable solutions that are accessible to local communities. By promoting technologies such as solar cookers, the organization fosters eco-friendly practices that help reduce pressure on forest resources and preserve ecosystems essential to biodiversity.",
        fr: "Salamandra Nature agit pour limiter la déforestation et la dégradation des habitats naturels, tout en encourageant l’adoption de solutions durables et accessibles aux communautés locales. À travers la vulgarisation de technologies telles que les cuiseurs solaires, l’association promeut des pratiques écoresponsables qui contribuent à réduire la pression sur les ressources forestières et à préserver les écosystèmes essentiels à la biodiversité."
      }
    },
    {
      icon: GraduationCap,
      title: {
        en: "Environmental mediation in France and Madagascar",
        fr: "Médiation environnementale en France et à Madagascar"
      },
      content: {
        en: "Salamandra Nature carries out initiatives to raise awareness about and protect Madagascar’s endemic and threatened land tortoises, most notably the radiated tortoise (*Sokake*) and the spider tortoise (*Sokapila*). Through exhibitions, screenings, events, and meetings, the organization addresses the challenges surrounding their conservation, the fight against their illegal trafficking, and the preservation of their natural habitats. In both France and Madagascar, these efforts foster dialogue and encourage public engagement in their protection.",
        fr: "Salamandra Nature mène des actions pour faire connaître et protéger les tortues terrestres endémiques et menacées de Madagascar, notamment la tortue étoilée (Sokake) et la tortue araignée (Sokapila). À travers des expositions, des projections, des événements et des rencontres, l’association partage les enjeux liés à leur conservation, à la lutte contre leur trafic illégal et à la préservation de leurs habitats naturels. En France comme à Madagascar, ces actions favorisent les échanges et encouragent l’engagement du public pour leur protection."
      }
    },
    {
      icon: Sun,
      title: {
        en: "Ecosystem restoration",
        fr: "Restauration des écosystèmes "
      },
      content: {
        en: "Salamandra Nature contributes to the restoration of ecosystems in southwestern Madagascar by planting native tree species adapted to the local natural environment. These initiatives aim to foster vegetation regeneration, restore natural habitats, and preserve the species that depend on them.",
        fr: "Salamandra Nature contribue à la restauration des écosystèmes du sud-ouest de Madagascar par la plantation d’essences locales adaptées aux milieux naturels. Ces actions visent à favoriser la régénération de la végétation, à restaurer les habitats naturels et à préserver les espèces qui en dépendent."
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
            className="whitespace-pre-line text-2xl text-sage-700/80 dark:text-sage-300/90 leading-relaxed max-w-5xl"
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
                <div>
                  <h3 className="text-xl font-bold text-terracotta-500 dark:text-terracotta-400 mb-2">
                    {action.title[language as 'en' | 'fr']}
                  </h3>
                  <p className="whitespace-pre-line text-lg text-sage-700/80 dark:text-sage-300/90 leading-relaxed">
                    {action.content[language as 'en' | 'fr']}
                  </p>
                </div>
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
