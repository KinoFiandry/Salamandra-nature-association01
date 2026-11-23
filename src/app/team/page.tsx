"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function TeamPage() {
  const { language } = useI18n();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("group_members")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) setTeamMembers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-sage-950 pb-20 transition-colors duration-300">
      {/* En-tête */}
      <div className="relative py-24 bg-sage-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {language === "fr" ? "Notre Équipe" : "Our Team"}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-sage-100 dark:bg-sage-800 rounded-xl flex items-center justify-center text-sage-600 dark:text-sage-300">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-4xl font-bold text-sage-800 dark:text-sage-100">
            {language === "fr" ? "Les membres de l'association" : "Association Members"}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sage-500">
            {language === "fr" ? "Chargement de l'équipe..." : "Loading team..."}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-16 text-sage-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">
              {language === "fr" ? "Aucun membre pour le moment." : "No team members yet."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => {
              const role = language === "fr" ? member.role_fr : member.role_en;
              const bio = language === "fr" ? member.bio_fr : member.bio_en;

              return (
                <motion.div
                  key={member.id || member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-sage-50/50 dark:bg-sage-800/40 rounded-3xl overflow-hidden border border-sage-100 dark:border-sage-700 shadow-sm hover:shadow-xl transition-all flex flex-col"
                >
                  {/* Photo */}
                  <div className="h-72 w-full overflow-hidden flex-shrink-0 relative bg-sage-200 dark:bg-sage-700">
                    <Image
                      src={member.photo_url || "/images/placeholder.jpg"}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Nom, Rôle et Bio complète */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-sage-800 dark:text-sage-100 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-terracotta-500 dark:text-terracotta-400 font-bold text-sm uppercase tracking-wider mb-4">
                      {role}
                    </p>
                    <p className="whitespace-pre-line text-sage-700/80 dark:text-sage-300/90 text-base leading-relaxed">
                      {bio}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
