"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  BarChart3,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
  User,
  Heart,
  Briefcase,
  Building,
  GraduationCap,
  Menu,
  X
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(
    pathname?.startsWith('/admin/articles') || false
  );
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(
    pathname?.startsWith('/admin/users') || false
  );
  const [formationsDropdownOpen, setFormationsDropdownOpen] = useState(
    pathname?.startsWith('/admin/formations') || false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path) || false;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">E-ARONCY</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Dashboard */}
        <Link
          href="/admin"
          className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Tableau de Bord</span>
        </Link>

        {/* Users with Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin/users')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5" />
              <span>Utilisateurs</span>
            </div>
            {usersDropdownOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {usersDropdownOpen && (
            <div className="ml-4 space-y-1">
              <Link
                href="/admin/users"
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/admin/users'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Liste des utilisateurs</span>
              </Link>
              <div className="ml-4 space-y-1">
                <Link
                  href="/admin/users/new?type=individual"
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-600" />
                  <span>Utilisateur individuel</span>
                </Link>
                <Link
                  href="/admin/users/new?type=ong"
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Heart className="h-4 w-4 text-red-600" />
                  <span>Membre d'ONG</span>
                </Link>
                <Link
                  href="/admin/users/new?type=company"
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span>Employé d'entreprise</span>
                </Link>
                <Link
                  href="/admin/users/new?type=government"
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Building className="h-4 w-4 text-green-600" />
                  <span>Agent gouvernemental</span>
                </Link>
                <Link
                  href="/admin/users/new?type=education"
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span>Personnel éducatif</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Articles with Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => setArticlesDropdownOpen(!articlesDropdownOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin/articles')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>Articles</span>
            </div>
            {articlesDropdownOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {articlesDropdownOpen && (
            <div className="ml-4 space-y-1">
              <Link
                href="/admin/articles"
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/admin/articles'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Liste des articles</span>
              </Link>
              <Link
                href="/admin/articles/new"
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/admin/articles/new'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Nouvel article</span>
              </Link>
            </div>
          )}
        </div>

        {/* Formations with Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => setFormationsDropdownOpen(!formationsDropdownOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin/formations')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-5 w-5" />
              <span>Formations</span>
            </div>
            {formationsDropdownOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {formationsDropdownOpen && (
            <div className="ml-4 space-y-1">
              <Link
                href="/admin/formations"
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/admin/formations'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Liste des formations</span>
              </Link>
              <Link
                href="/admin/formations/new"
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/admin/formations/new'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Ajout de formation</span>
              </Link>
            </div>
          )}
        </div>

        {/* Content */}
        <Link
          href="/admin/content"
          className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive('/admin/content')
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span>Contenu</span>
        </Link>

        {/* Statistiques */}
        <Link
          href="/admin/statistiques"
          className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive('/admin/statistiques')
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Statistiques</span>
        </Link>

        {/* Security */}
        <Link
          href="/admin/security"
          className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive('/admin/security')
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Shield className="h-5 w-5" />
          <span>Sécurité</span>
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive('/admin/settings')
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </Link>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Administrateur</p>
            <p className="text-xs text-gray-500">admin@e-aroncy.com</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
