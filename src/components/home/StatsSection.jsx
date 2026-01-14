import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '$2.4B', label: 'Total Transaction Volume', suffix: '' },
  { value: '47', label: 'Portfolio Companies', suffix: '' },
  { value: '3.2x', label: 'Average MOIC', suffix: '' },
  { value: '94', label: 'Successful Exits', suffix: '%' },
];

export default function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#00ff88]/5" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 md:p-12 accent-glow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-zinc-500 tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}