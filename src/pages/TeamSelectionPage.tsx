import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFantasyStore } from '@/store/fantasy-store';
import { api } from '@/lib/api-client';
import { F1Driver, F1Constructor, FantasyTeam } from '@shared/types';
import { FANTASY_BUDGET, REQUIRED_DRIVERS, REQUIRED_CONSTRUCTORS } from '@/lib/f1-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, Users, Car, Wallet, Loader } from 'lucide-react';
const MOCK_USER_ID = 'user_mock_id';
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className={cn("retro-card p-4 flex items-center space-x-4", color)}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm uppercase text-muted-foreground">{label}</p>
      <p className="font-pixel text-2xl">{value}</p>
    </div>
  </div>
);
export const TeamSelectionPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const {
    drivers,
    constructors,
    selectedDrivers,
    selectedConstructor,
    remainingBudget,
    setInitialData,
    toggleDriver,
    selectConstructor,
    setTeam,
  } = useFantasyStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [driversData, constructorsData, userTeam] = await Promise.all([
          api<F1Driver[]>('/api/drivers'),
          api<F1Constructor[]>('/api/constructors'),
          api<FantasyTeam>(`/api/users/${MOCK_USER_ID}/team`),
        ]);
        setInitialData(driversData, constructorsData);
        const teamDrivers = driversData.filter(d => userTeam.driverIds.includes(d.id));
        const teamConstructor = constructorsData.find(c => c.id === userTeam.constructorId) || null;
        setTeam({ drivers: teamDrivers, constructor: teamConstructor });
      } catch (error) {
        toast.error('Failed to load F1 data.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setInitialData, setTeam]);
  const driversFulfilled = selectedDrivers.size === REQUIRED_DRIVERS;
  const constructorFulfilled = !!selectedConstructor;
  const budgetFulfilled = remainingBudget >= 0;
  const teamComplete = driversFulfilled && constructorFulfilled && budgetFulfilled;
  const handleSaveTeam = async () => {
    if (!teamComplete || isSaving) return;
    setIsSaving(true);
    try {
      const teamToSave = {
        driverIds: Array.from(selectedDrivers.keys()),
        constructorId: selectedConstructor?.id || null,
      };
      await api(`/api/users/${MOCK_USER_ID}/team`, {
        method: 'POST',
        body: JSON.stringify(teamToSave),
      });
      toast.success('Team Saved!', { description: 'Your lineup is locked in for the next race.' });
    } catch (error) {
      toast.error('Save Failed', { description: 'Could not save your team. Please try again.' });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <header className="text-center space-y-2">
        <h1 className="font-pixel text-4xl md:text-6xl text-glow-green text-neon-green">Team Selection</h1>
        <p className="text-lg text-muted-foreground">Build your dream team within the ${FANTASY_BUDGET}M budget.</p>
      </header>
      <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-sm py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={<Users />} label="Drivers" value={`${selectedDrivers.size} / ${REQUIRED_DRIVERS}`} color={driversFulfilled ? 'border-neon-green' : 'border-neon-cyan'} />
          <StatCard icon={<Car />} label="Constructor" value={`${constructorFulfilled ? 1 : 0} / ${REQUIRED_CONSTRUCTORS}`} color={constructorFulfilled ? 'border-neon-green' : 'border-neon-cyan'} />
          <StatCard icon={<Wallet />} label="Budget Left" value={`${remainingBudget.toFixed(1)}M`} color={budgetFulfilled ? 'border-neon-green' : 'border-destructive'} />
        </div>
      </div>
      {isLoading ? (
        <div className="text-center font-pixel text-neon-cyan text-2xl flex items-center justify-center space-x-4 py-20">
          <Loader className="animate-spin" />
          <span>Loading Data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="space-y-6">
            <h2 className="font-pixel text-2xl text-neon-magenta">Drivers</h2>
            <div className="space-y-2">
              {drivers.map(driver => {
                const isSelected = selectedDrivers.has(driver.id);
                const isDisabled = !isSelected && selectedDrivers.size >= REQUIRED_DRIVERS;
                return (
                  <button
                    key={driver.id}
                    onClick={() => toggleDriver(driver)}
                    disabled={isDisabled}
                    className={cn(
                      'w-full flex justify-between items-center p-3 border-2 transition-all duration-200',
                      isSelected ? 'border-neon-green bg-neon-green/10' : 'border-muted hover:border-neon-cyan',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div>
                      <p className="text-lg font-bold text-left">{driver.name}</p>
                      <p className="text-sm text-muted-foreground text-left">{driver.team}</p>
                    </div>
                    <p className="font-pixel text-xl">${driver.price.toFixed(1)}M</p>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="space-y-6">
            <h2 className="font-pixel text-2xl text-neon-magenta">Constructors</h2>
            <div className="space-y-2">
              {constructors.map(c => {
                const isSelected = selectedConstructor?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectConstructor(c)}
                    className={cn(
                      'w-full flex justify-between items-center p-3 border-2 transition-all duration-200',
                      isSelected ? 'border-neon-green bg-neon-green/10' : 'border-muted hover:border-neon-cyan'
                    )}
                  >
                    <p className="text-lg font-bold">{c.name}</p>
                    <p className="font-pixel text-xl">${c.price.toFixed(1)}M</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
      <div className="text-center pt-8">
        <button onClick={handleSaveTeam} disabled={!teamComplete || isSaving} className="retro-btn retro-btn-magenta text-2xl px-12 py-4">
          {isSaving ? (
            <Loader className="inline-block mr-2 animate-spin" />
          ) : teamComplete ? (
            <CheckCircle className="inline-block mr-2" />
          ) : (
            <AlertTriangle className="inline-block mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save Team'}
        </button>
      </div>
    </motion.div>
  );
};