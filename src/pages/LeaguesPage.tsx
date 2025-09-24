import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader, Trophy } from 'lucide-react';
import { api } from '@/lib/api-client';
import { LeaderboardEntry } from '@shared/types';
import { toast } from 'sonner';
const MOCK_USER_ID = 'user_mock_id';
export const LeaguesPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await api<LeaderboardEntry[]>('/api/leagues/leaderboard');
        setLeaderboard(data);
      } catch (error) {
        toast.error('Failed to load leaderboard.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <header className="text-center space-y-2">
        <h1 className="font-pixel text-4xl md:text-6xl text-glow-green text-neon-green">LEAGUES</h1>
        <p className="text-lg text-muted-foreground">See how you stack up against the competition.</p>
      </header>
      <div className="retro-card p-0">
        <div className="p-4 border-b-2 border-neon-cyan flex justify-between items-center">
          <h2 className="font-pixel text-2xl text-neon-magenta">Global Leaderboard</h2>
          <Trophy className="w-8 h-8 text-neon-cyan" />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-4 p-20">
            <Loader className="w-12 h-12 animate-spin text-neon-cyan" />
            <span className="font-pixel text-xl text-muted-foreground">Loading Ranks...</span>
          </div>
        ) : (
          <div className="divide-y-2 divide-neon-cyan/20">
            <div className="grid grid-cols-12 p-4 font-pixel text-sm uppercase text-muted-foreground">
              <div className="col-span-2">Rank</div>
              <div className="col-span-7">Player</div>
              <div className="col-span-3 text-right">Points</div>
            </div>
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "grid grid-cols-12 p-4 items-center text-lg",
                  player.userId === MOCK_USER_ID ? 'bg-neon-magenta/20 text-neon-magenta font-bold' : 'hover:bg-neon-cyan/10'
                )}
              >
                <div className="col-span-2 font-pixel text-2xl">{player.rank}</div>
                <div className="col-span-7">{player.userName}</div>
                <div className="col-span-3 text-right font-pixel">{player.points}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};