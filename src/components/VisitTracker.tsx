"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default function VisitTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // Check if we've already tracked this session
      const sessionId = sessionStorage.getItem("site_session_id");
      
      if (!sessionId) {
        const newSessionId = uuidv4();
        sessionStorage.setItem("site_session_id", newSessionId);
        
        try {
          await supabase.from("site_visits").insert([
            { session_id: newSessionId }
          ]);
        } catch (error) {
          console.error("Error tracking visit:", error);
        }
      }
    };

    trackVisit();
  }, []);

  return null;
}
