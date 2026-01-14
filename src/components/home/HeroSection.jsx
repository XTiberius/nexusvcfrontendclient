import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/3 rounded-full blur-3xl" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute right-0 top-20 w-[600px] h-[600px] opacity-20" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00cc6a" />
            </linearGradient>
          </defs>
          {/* Network nodes */}
          {[
            { cx: 200, cy: 80, r: 8 },
            { cx: 320, cy: 140, r: 6 },
            { cx: 100, cy: 160, r: 5 },
            { cx: 280, cy: 220, r: 10 },
            { cx: 140, cy: 260, r: 7 },
            { cx: 340, cy: 280, r: 5 },
            { cx: 200, cy: 320, r: 8 },
            { cx: 80, cy: 340, r: 6 },
            { cx: 300, cy: 360, r: 5 },
          ].map((node, i) => (
            <motion.circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="url(#nodeGradient)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}
          {/* Connections */}
          {[
            { x1: 200, y1: 80, x2: 320, y2: 140 },
            { x1: 200, y1: 80, x2: 100, y2: 160 },
            { x1: 320, y1: 140, x2: 280, y2: 220 },
            { x1: 100, y1: 160, x2: 140, y2: 260 },
            { x1: 280, y1: 220, x2: 200, y2: 320 },
            { x1: 140, y1: 260, x2: 200, y2: 320 },
            { x1: 280, y1: 220, x2: 340, y2: 280 },
            { x1: 200, y1: 320, x2: 80, y2: 340 },
            { x1: 200, y1: 320, x2: 300, y2: 360 },
          ].map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#00ff88"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest">
              // INITIALIZING_INVESTMENT_PROTOCOL...
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Private Markets,
            <br />
            <span className="text-gradient">Democratized</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 max-w-2xl"
          >
            Access pre-IPO shares in the world's most innovative companies. 
            Our platform connects qualified investors with vetted secondary market 
            opportunities previously reserved for institutions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link to={createPageUrl('Portfolio')}>
              <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a] h-12 px-8 text-base font-medium group">
                Explore Portfolio
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl('RequestAccess')}>
              <Button variant="outline" className="h-12 px-8 text-base border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600">
                <Play className="w-4 h-4 mr-2" />
                Request Access
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-8"
          >
            {[
              { icon: Shield, label: 'SEC Compliant', sublabel: 'Regulated Marketplace' },
              { icon: TrendingUp, label: '$2B+', sublabel: 'Transaction Volume' },
              { icon: Users, label: '500+', sublabel: 'Qualified Investors' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <div className="font-semibold">{stat.label}</div>
                  <div className="text-xs text-zinc-500">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}