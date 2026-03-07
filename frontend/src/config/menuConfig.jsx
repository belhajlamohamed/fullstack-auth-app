import React from "react"; // INDISPENSABLE
import { 
  LayoutDashboard, Users, ShieldCheck, Settings, 
  PlusCircle, Brain, BarChart3, PlayCircle, 
  GraduationCap, BookOpen 
} from "lucide-react";

export const MENU_CONFIG = {
  ADMIN: [
    { icon: <LayoutDashboard size={20} />, label: "Vue d'ensemble", id: "home" },
    { icon: <Users size={20} />, label: "Gestion Utilisateurs", id: "us" },
    { icon: <ShieldCheck size={20} />, label: "Sécurité & Logs", id: "sec" },
    { icon: <Settings size={20} />, label: "Configuration", id: "conf" },
  ],
  TEACHER: [
    { icon: <LayoutDashboard size={20} />, label: "Mes Quiz", id: "home" },
    { icon: <PlusCircle size={20} />, label: "Créer un Quiz", id: "cq" },
    { icon: <Brain size={20} />, label: "IA Generator", id: "ia" },
    { icon: <BarChart3 size={20} />, label: "Statistiques", id: "stat" },
  ],
  STUDENT: [
    { icon: <LayoutDashboard size={20} />, label: "Accueil", id: "home" },
    { icon: <PlayCircle size={20} />, label: "Passer un Quiz", id: "pq" },
    { icon: <GraduationCap size={20} />, label: "Mes Résultats", id: "res" },
    { icon: <BookOpen size={20} />, label: "Bibliothèque", id: "bib" },
  ]
};