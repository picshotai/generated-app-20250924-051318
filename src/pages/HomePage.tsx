import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import { F1Driver, F1Constructor, FantasyTeam, LeaderboardEntry } from '@shared/types';
import { Rocket, Trophy, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
const MOCK_USER_ID = 'user_mock_id';
const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = React.useState({ days: 7, hours: 12, minutes: 45, seconds: 33 });
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex space-x-4 md:space-x-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="font-pixel text-3xl md:text-5xl text-neon-cyan">{String(value).padStart(2, '0')}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{unit}</div>
        </div>
      ))}
    </div>
  );
};
const TeamMemberCard: React.FC<{ member: F1Driver | F1Constructor | undefined }> = ({ member }) => {
  if (!member) return null;
  const isDriver = 'team' in member;
  return (
    <div className="retro-card p-4 flex flex-col justify-between h-full">
      <div>
        <p className="text-lg font-bold text-neon-green">{member.name}</p>
        {isDriver && <p className="text-sm text-muted-foreground">{member.team}</p>}
      </div>
      <p className="text-2xl font-pixel text-right text-neon-magenta">${member.price}M</p>
    </div>
  );
};
const TeamMemberSkeleton: React.FC = () => (
  <div className="retro-card p-4 space-y-3">
    <Skeleton className="h-6 w-3/4 bg-muted" />
    <Skeleton className="h-4 w-1/2 bg-muted" />
    <Skeleton className="h-8 w-1/3 bg-muted ml-auto" />
  </div>
);
export const HomePage: React.FC = () => {
  const [team, setTeam] = useState<FantasyTeam | null>(null);
  const [allDrivers, setAllDrivers] = useState<F1Driver[]>([]);
  const [allConstructors, setAllConstructors] = useState<F1Constructor[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [driversData, constructorsData, teamData, leaderboardData] = await Promise.all([
          api<F1Driver[]>('/api/drivers'),
          api<F1Constructor[]>('/api/constructors'),
          api<FantasyTeam>(`/api/users/${MOCK_USER_ID}/team`),
          api<LeaderboardEntry[]>('/api/leagues/leaderboard'),
        ]);
        setAllDrivers(driversData);
        setAllConstructors(constructorsData);
        setTeam(teamData);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const hasTeam = !isLoading && team && (team.driverIds.length > 0 || team.constructorId);
  const teamDrivers = allDrivers.filter(d => team?.driverIds.includes(d.id));
  const teamConstructor = allConstructors.find(c => c.id === team?.constructorId);
  const currentUserEntry = leaderboard.find(entry => entry.userId === MOCK_USER_ID);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      <section className="text-center space-y-4">
        <h1 className="font-pixel text-4xl md:text-6xl text-glow-green text-neon-green">DASHBOARD</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome back, racer. Here's your status before the next Grand Prix.
        </p>
      </section>
      <section className="retro-card text-center py-12 space-y-6">
        <h2 className="font-pixel text-2xl text-neon-magenta uppercase">Next Race Countdown</h2>
        <Countdown />
      </section>
      {isLoading ? (
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-40 retro-card" />
            <Skeleton className="h-40 retro-card" />
            <Skeleton className="h-40 retro-card" />
          </div>
          <div>
            <h2 className="font-pixel text-2xl text-neon-magenta mb-6">Your Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <TeamMemberSkeleton key={i} />)}
            </div>
          </div>
        </section>
      ) : hasTeam ? (
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="retro-card flex flex-col items-center justify-center text-center p-8 space-y-2">
              <Trophy className="w-12 h-12 text-neon-cyan" />
              <p className="font-pixel text-4xl">{currentUserEntry?.points ?? 0}</p>
              <p className="text-sm uppercase text-muted-foreground">Total Points</p>
            </div>
            <div className="retro-card flex flex-col items-center justify-center text-center p-8 space-y-2">
              <Users className="w-12 h-12 text-neon-cyan" />
              <p className="font-pixel text-4xl">#{currentUserEntry?.rank ?? '-'}</p>
              <p className="text-sm uppercase text-muted-foreground">Global Rank</p>
            </div>
            <div className="retro-card flex flex-col items-center justify-center text-center p-8 space-y-2">
              <Rocket className="w-12 h-12 text-neon-cyan" />
              <p className="font-pixel text-4xl">+{currentUserEntry?.points ?? 0}</p>
              <p className="text-sm uppercase text-muted-foreground">Last Race</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="font-pixel text-2xl text-neon-magenta">Your Team</h2>
              <Link to="/team" className="text-neon-cyan hover:underline">Edit Team</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamDrivers.map(driver => <TeamMemberCard key={driver.id} member={driver} />)}
              {teamConstructor && <TeamMemberCard member={teamConstructor} />}
            </div>
          </div>
        </section>
      ) : (
        <section className="retro-card text-center py-16 space-y-6">
          <h2 className="font-pixel text-3xl text-neon-magenta">No Team Selected</h2>
          <p className="text-lg text-muted-foreground">You haven't built your fantasy team yet. Head to the team selection page to get started!</p>
          <Link to="/team">
            <button className="retro-btn retro-btn-green mt-4">Create Your Team</button>
          </Link>
        </section>
      )}
    </motion.div>
  );
};