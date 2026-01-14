import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Target, 
  Lightbulb, 
  TrendingUp,
  Shield,
  Globe,
  Users,
  Hexagon
} from 'lucide-react';

const team = [
  {
    name: 'Luc Goble',
    role: 'Managing Partner',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'Former Goldman Sachs VP, Stanford MBA'
  },
  {
    name: 'Preston Silverman',
    role: 'Managing Partner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Ex-Sequoia, 15 years in VC'
  },
  {
    name: 'David Monroe Rashid',
    role: 'Strategic Advisor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'davidrashid.com'
  },
  {
    name: 'Rutvik Parikh',
    role: 'Technical Advisor',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Deep tech specialist, PhD MIT'
  },
];

const values = [
  {
    icon: Target,
    title: 'Rigorous Selection',
    description: 'We apply institutional-grade due diligence to every opportunity, focusing on companies with proven traction and clear paths to liquidity.'
  },
  {
    icon: Shield,
    title: 'Investor Protection',
    description: 'All transactions are SEC-compliant with full documentation. We prioritize transparency and legal protection for our investors.'
  },
  {
    icon: Lightbulb,
    title: 'Deep Expertise',
    description: 'Our team combines decades of venture capital, investment banking, and operating experience across technology sectors.'
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'We maintain relationships across major innovation hubs, accessing deals before they reach traditional secondary markets.'
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff88]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // MISSION_PROTOCOL
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Democratizing Access to
              <br />
              <span className="text-gradient">Private Market Returns</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              We're bridging the gap between qualified investors and the secondary market 
              opportunities that were once exclusive to institutions and ultra-high-net-worth individuals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  Nexus Ventures was founded on a simple premise: exceptional investment 
                  opportunities shouldn't be gatekept by arbitrary barriers to entry.
                </p>
                <p>
                  The secondary market for private company shares has historically been opaque, 
                  fragmented, and inaccessible to individual investors. We're changing that by 
                  building institutional-grade infrastructure that brings transparency, liquidity, 
                  and access to a broader investor base.
                </p>
                <p>
                  Our platform enables qualified investors to participate in vetted opportunities 
                  across the innovation economy—from AI and deep tech to fintech and healthcare—with 
                  the same level of diligence and protection afforded to major institutions.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '$2.4B', label: 'Transaction Volume' },
                { value: '47', label: 'Portfolio Companies' },
                { value: '500+', label: 'Investor Network' },
                { value: '94%', label: 'Success Rate' },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // CORE_VALUES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-[#00ff88]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // TEAM_NETWORK
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Our team combines deep expertise in venture capital, investment banking, 
              and technology operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass-card rounded-2xl p-6 text-center hover:border-[#00ff88]/30 transition-all"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-zinc-800 group-hover:ring-[#00ff88]/30 transition-all">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-[#00ff88] mb-2">{member.role}</p>
                <p className="text-xs text-zinc-500">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // PROCESS_FLOW
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Apply for Access',
                description: 'Submit your investor profile for review. We verify accreditation status and assess fit with our network.'
              },
              {
                step: '02',
                title: 'Browse Opportunities',
                description: 'Access our curated deal flow. Each opportunity includes detailed company information, valuation analysis, and transaction terms.'
              },
              {
                step: '03',
                title: 'Express Interest',
                description: 'Indicate your interest and desired allocation. Our team facilitates all documentation and legal requirements.'
              },
              {
                step: '04',
                title: 'Complete Transaction',
                description: 'Execute your investment through our SEC-compliant platform. Receive ownership confirmation and ongoing portfolio updates.'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#00ff88]">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 md:p-16 accent-glow"
          >
            <Hexagon className="w-16 h-16 text-[#00ff88] mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
              Join our network of sophisticated investors accessing pre-IPO opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Portfolio')}>
                <Button variant="outline" className="h-12 px-8 border-zinc-700 hover:bg-zinc-800">
                  View Portfolio
                </Button>
              </Link>
              <Link to={createPageUrl('RequestAccess')}>
                <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a] h-12 px-8 font-medium group">
                  Request Access
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}