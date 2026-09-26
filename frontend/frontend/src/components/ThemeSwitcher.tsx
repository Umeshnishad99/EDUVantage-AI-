import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
  const { mode, themeColor, toggleMode, setThemeColor } = useTheme();

  const colors: { name: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber'; hex: string }[] = [
    { name: 'blue', hex: 'bg-blue-500' },
    { name: 'purple', hex: 'bg-purple-500' },
    { name: 'emerald', hex: 'bg-emerald-500' },
    { name: 'rose', hex: 'bg-rose-500' },
    { name: 'amber', hex: 'bg-amber-500' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Appearance</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => mode !== 'light' && toggleMode()}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'light' 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
          <button
            onClick={() => mode !== 'dark' && toggleMode()}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'dark' 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Accent Color</p>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setThemeColor(color.name)}
              className={`relative w-8 h-8 rounded-full ${color.hex} flex items-center justify-center transition-transform hover:scale-110 active:scale-95`}
            >
              {themeColor === color.name && (
                <motion.div
                  layoutId="activeColor"
                  className="absolute inset-0 rounded-full border-2 border-white dark:border-slate-900"
                  initial={false}
                />
              )}
              {themeColor === color.name && <Check className="w-4 h-4 text-white z-10" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
