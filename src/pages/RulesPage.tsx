import React from 'react';
import { motion } from 'framer-motion';
const RuleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="retro-card p-6">
    <h2 className="font-pixel text-2xl text-neon-magenta mb-4">{title}</h2>
    <div className="space-y-2 text-muted-foreground leading-relaxed">{children}</div>
  </div>
);
const PointTable: React.FC<{ data: { position: string; points: string }[] }> = ({ data }) => (
  <div className="border-2 border-neon-cyan/50 mt-4">
    <div className="grid grid-cols-2 p-2 bg-neon-cyan/10 font-bold">
      <div>Position</div>
      <div className="text-right">Points</div>
    </div>
    {data.map((row, index) => (
      <div key={index} className="grid grid-cols-2 p-2 border-t-2 border-neon-cyan/50">
        <div>{row.position}</div>
        <div className="text-right">{row.points}</div>
      </div>
    ))}
  </div>
);
const racePoints = [
  { position: '1st', points: '25' },
  { position: '2nd', points: '18' },
  { position: '3rd', points: '15' },
  { position: '4th', points: '12' },
  { position: '5th', points: '10' },
  { position: '6th', points: '8' },
  { position: '7th', points: '6' },
  { position: '8th', points: '4' },
  { position: '9th', points: '2' },
  { position: '10th', points: '1' },
];
export const RulesPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <header className="text-center space-y-2">
        <h1 className="font-pixel text-4xl md:text-6xl text-glow-green text-neon-green">GAME RULES</h1>
        <p className="text-lg text-muted-foreground">Master the rules to dominate the podium.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RuleSection title="Team Composition">
          <p>Your fantasy team must consist of 5 Drivers and 1 Constructor.</p>
          <p>The total value of your team must not exceed the $100M budget.</p>
          <p>You can make changes to your team at any time between race weekends. Team selections lock 1 hour before the first practice session of a Grand Prix weekend.</p>
        </RuleSection>
        <RuleSection title="Scoring Basics">
          <p>Points are awarded based on the real-world performance of your selected drivers and constructor in both the main Grand Prix and Sprint races (if applicable).</p>
          <p>Your total score for a race weekend is the sum of points from all 6 of your selections.</p>
        </RuleSection>
        <RuleSection title="Grand Prix Scoring">
          <p>Drivers score points based on their final race classification, following the official F1 points system.</p>
          <PointTable data={racePoints} />
        </RuleSection>
        <RuleSection title="Bonus Points">
          <p>Additional points can be earned for various achievements:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><span className="text-neon-green">+5 pts</span> for Fastest Lap (driver only).</li>
            <li><span className="text-neon-green">+3 pts</span> for Driver of the Day.</li>
            <li><span className="text-neon-green">+2 pts</span> for each position gained from starting grid.</li>
            <li><span className="text-neon-red">-2 pts</span> for each position lost from starting grid.</li>
            <li><span className="text-neon-red">-10 pts</span> for a disqualification (DSQ).</li>
          </ul>
        </RuleSection>
      </div>
    </motion.div>
  );
};