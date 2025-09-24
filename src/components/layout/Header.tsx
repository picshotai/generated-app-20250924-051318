import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
const navLinks = [
  { to: '/', text: 'Dashboard' },
  { to: '/team', text: 'Team' },
  { to: '/leagues', text: 'Leagues' },
  { to: '/rules', text: 'Rules' },
];
const NavLinks: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => (
  <>
    {navLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        onClick={onLinkClick}
        className={({ isActive }) =>
          cn(
            'font-pixel uppercase text-sm tracking-widest transition-colors duration-300',
            isActive
              ? 'text-neon-magenta text-glow-magenta'
              : 'text-muted-foreground hover:text-neon-cyan'
          )
        }
      >
        {link.text}
      </NavLink>
    ))}
  </>
);
export const Header: React.FC = () => {
  const [glitch, setGlitch] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  return (
    <header className="border-b-2 border-neon-magenta shadow-[0_0_15px_theme(colors.neon.magenta)] sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            onHoverStart={() => setGlitch(true)}
            onHoverEnd={() => setGlitch(false)}
          >
            <NavLink to="/" className="font-pixel text-2xl md:text-3xl text-neon-green text-glow-green">
              <span className={cn(glitch && 'animate-glitch')}>EDGE</span>
              <span className="text-neon-cyan text-glow-cyan">PODIUM</span>
            </NavLink>
          </motion.div>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-8 w-8 text-neon-cyan" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l-2 border-neon-magenta w-[250px] sm:w-[300px]">
                <nav className="flex flex-col items-center justify-center h-full space-y-8">
                  <NavLinks onLinkClick={() => setIsSheetOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};