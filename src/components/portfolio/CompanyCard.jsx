import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, TrendingUp, ExternalLink } from 'lucide-react';

const sectorColors = {
  'AI/ML': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Deep Tech': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Fintech': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Healthcare': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Climate Tech': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Enterprise SaaS': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Cybersecurity': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Robotics': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Space Tech': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Biotech': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

const stageColors = {
  'Seed': 'bg-zinc-700',
  'Series A': 'bg-zinc-600',
  'Series B': 'bg-zinc-500',
  'Series C': 'bg-zinc-400',
  'Series D+': 'bg-[#00ff88]',
  'Pre-IPO': 'bg-[#00ff88]',
  'Secondary': 'bg-amber-500',
};

export default function CompanyCard({ company, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group glass-card rounded-2xl overflow-hidden hover:border-[#00ff88]/30 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {company.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={company.name} 
                className="w-14 h-14 rounded-xl object-cover bg-zinc-800"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-zinc-500" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg group-hover:text-[#00ff88] transition-colors">
                {company.name}
              </h3>
              <Badge className={`${sectorColors[company.sector] || 'bg-zinc-700 text-zinc-300'} border text-xs mt-1`}>
                {company.sector}
              </Badge>
            </div>
          </div>
          {company.website && (
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-[#00ff88] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
          {company.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {company.valuation && (
            <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-xs text-zinc-500 mb-0.5">
                <TrendingUp className="w-3 h-3" />
                Valuation
              </div>
              <div className="font-semibold text-[#00ff88]">
                ${company.valuation >= 1000 ? `${(company.valuation / 1000).toFixed(1)}B` : `${company.valuation}M`}
              </div>
            </div>
          )}
          {company.total_raised && (
            <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
              <div className="text-xs text-zinc-500 mb-0.5">
                Total Raised
              </div>
              <div className="font-semibold">
                ${company.total_raised}M
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            {company.headquarters && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {company.headquarters}
              </span>
            )}
            {company.team_size && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {company.team_size}
              </span>
            )}
          </div>
          <div className={`px-2 py-0.5 rounded text-xs font-medium ${stageColors[company.stage] || 'bg-zinc-700'} ${company.stage === 'Pre-IPO' || company.stage === 'Series D+' ? 'text-black' : 'text-white'}`}>
            {company.stage}
          </div>
        </div>
      </div>
    </motion.div>
  );
}