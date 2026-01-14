import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers, Lock, Zap, LineChart, Users, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Liquidity Solutions",
    description: "Access secondary market opportunities that turn illiquid private assets into tradable positions. Time exits strategically and optimize your portfolio.",
  },
  {
    icon: Lock,
    title: "Vetted Deal Flow",
    description: "Every opportunity undergoes rigorous due diligence. We source from proprietary networks and deep tech ecosystems typically inaccessible to individual investors.",
  },
  {
    icon: Layers,
    title: "Direct Participation",
    description: "Invest directly on a deal-by-deal basis with full transparency. No blind pools, no 10-year fund lockups. You choose where your capital goes.",
  },
  {
    icon: LineChart,
    title: "Cross-Vertical Intelligence",
    description: "While deep tech is our core, we also surface later-stage opportunities across sectors with asymmetric risk-return profiles.",
  },
  {
    icon: Users,
    title: "Collaborative Network",
    description: "Join a community of founders, operators, and subject-matter experts who collaborate to build conviction on exclusive opportunities.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Participate in deals from leading innovation hubs worldwide. From Silicon Valley unicorns to emerging deep tech in Europe and Asia.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
            // CORE_FUNCTIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Institutional-Grade Infrastructure
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Our neural architecture operates across multiple dimensions to optimize 
            venture capital deployment and maximize investor outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass-card rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[#00ff88]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                {feature.title}
                <ArrowUpRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-[#00ff88] transition-all" />
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}