import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../services/i18n';
import { UserRole } from '../../types';
import { PlayCircle, Globe, UserCheck, Menu, X, RotateCcw, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenWalkthrough: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onOpenNewBatchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWalkthrough,
  onToggleMobileMenu,
  isMobileMenuOpen,
  onOpenNewBatchModal,
}) => {
  const { language, setLanguage, currentRole, setCurrentRole, activeTab, setActiveTab, resetDemoData } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'apiaries', label: 'Apiaries' },
    { id: 'monitoring', label: 'Hive IoT' },
    { id: 'batches', label: 'Honey Batches' },
    { id: 'traceability', label: 'Ledger Audit' },
    { id: 'verification', label: 'QR Verify' },
  ];

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  const roles: { id: UserRole; label: string }[] = [
    { id: 'beekeeper', label: 'Rural Beekeeper' },
    { id: 'processor', label: 'Honey Processor' },
    { id: 'buyer', label: 'Retail Buyer' },
    { id: 'admin', label: 'Field Admin' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-4 lg:px-8 py-3.5 bg-[#FFFFFF] border-b border-[#E8E0D0] shadow-xs">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-[#234638] hover:bg-[#FFF8E9] rounded-lg focus-visible:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className="text-left group cursor-pointer focus-visible:outline-hidden"
        >
          <div className="text-xl font-bold tracking-tight text-[#234638] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5A323] inline-block"></span>
            Madhumitra
          </div>
        </button>
      </div>

      {/* Zone 2: 4-5 concise single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#6C756D]">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === link.id
                ? 'text-[#234638] font-semibold border-b-2 border-[#E5A323]'
                : 'hover:text-[#234638]'
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: 1 primary action + role/lang dropdowns */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowRoleMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#29332D] bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg hover:border-[#E5A323] transition-colors whitespace-nowrap cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#E5A323]" />
            <span className="uppercase font-semibold">{language}</span>
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E8E0D0] rounded-lg shadow-lg py-1 z-40 text-xs">
              <div className="px-3 py-1.5 font-semibold text-[#6C756D] border-b border-[#E8E0D0]">
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-[#FFF8E9] flex items-center justify-between cursor-pointer ${
                    language === lang.code ? 'font-bold text-[#234638] bg-[#E5EEE5]' : 'text-[#29332D]'
                  }`}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D50]"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowLangMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#29332D] bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg hover:border-[#E5A323] transition-colors whitespace-nowrap cursor-pointer"
            title="Switch Role Preview"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#234638]" />
            <span className="capitalize">{currentRole}</span>
          </button>
          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-52 bg-white border border-[#E8E0D0] rounded-lg shadow-lg py-1 z-40 text-xs">
              <div className="px-3 py-1.5 font-semibold text-[#6C756D] border-b border-[#E8E0D0]">
                Simulate Portal Role
              </div>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-[#FFF8E9] flex items-center justify-between cursor-pointer ${
                    currentRole === r.id ? 'font-bold text-[#234638] bg-[#E5EEE5]' : 'text-[#29332D]'
                  }`}
                >
                  <span>{r.label}</span>
                  {currentRole === r.id && <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D50]"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3-Minute Demo Tour walkthrough */}
        <button
          onClick={onOpenWalkthrough}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#234638] bg-[#E5EEE5] border border-[#234638]/20 rounded-lg hover:bg-[#234638] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          title="Guided 3-minute Hackathon Jury Walkthrough"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">3-Min Demo Tour</span>
        </button>

        {/* Primary Action Button: + New Batch */}
        <button
          onClick={onOpenNewBatchModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#234638] rounded-lg hover:bg-[#1a352a] active:scale-98 transition-all shadow-xs whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E5A323]" />
          <span>New Honey Batch</span>
        </button>
      </div>
    </header>
  );
};
