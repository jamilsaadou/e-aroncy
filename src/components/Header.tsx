'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Shield, ChevronDown, BookOpen, Image as ImageIcon, FileText, Wrench } from "lucide-react";

export default function Header() {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const resourcesItems = [
    {
      title: "Guides pratiques",
      description: "Guides étape par étape",
      href: "/ressources/guides-pratiques",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Infographies",
      description: "Visuels percutants",
      href: "/ressources/infographies",
      icon: <ImageIcon className="h-5 w-5" />
    },
    {
      title: "Articles",
      description: "Analyses d'experts",
      href: "/ressources/articles",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Boîte à Outils",
      description: "Outils recommandés",
      href: "/ressources/boite-outils",
      icon: <Wrench className="h-5 w-5" />
    }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/assets/logos/Logo e-aroncy.png"
                alt="E-ARONCY Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 font-body">
            <Link href="/" className="text-slate-700 hover:text-aroncy-blue transition-colors">
              Accueil
            </Link>
            <Link href="/knowledge-base" className="text-slate-700 hover:text-aroncy-blue transition-colors">
              Formation
            </Link>
            <Link href="/diagnostic" className="text-slate-700 hover:text-aroncy-blue transition-colors">
              Diagnostic
            </Link>
            
            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button className="flex items-center text-slate-700 hover:text-aroncy-blue transition-colors">
                Ressources
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-4 transition-all duration-200 ${
                isResourcesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
              }`}>
                <div className="px-4 pb-3 border-b border-slate-100">
                  <Link href="/ressources" className="text-sm font-medium text-slate-900 hover:text-aroncy-blue transition-colors">
                    Toutes les ressources
                  </Link>
                </div>
                <div className="py-2">
                  {resourcesItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-start px-4 py-3 hover:bg-aroncy-light-gray transition-colors group"
                    >
                      <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg group-hover:bg-aroncy-blue group-hover:bg-opacity-10 transition-colors">
                        <div className="text-slate-600 group-hover:text-aroncy-blue transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900 group-hover:text-aroncy-blue transition-colors">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link href="/a-propos" className="text-slate-700 hover:text-aroncy-blue transition-colors">
              À propos
            </Link>
            <Link href="#" className="text-slate-700 hover:text-aroncy-blue transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4 font-body">
            <Link href="/login" className="text-slate-700 hover:text-aroncy-blue transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="bg-aroncy-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-medium">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
