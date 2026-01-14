import React, { useState } from 'react';
import { Company } from '@/api/localApi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Grid3X3, List, Building2, Loader2 } from 'lucide-react';
import CompanyCard from '../components/portfolio/CompanyCard';

const sectors = ['All', 'AI/ML', 'Deep Tech', 'Fintech', 'Healthcare', 'Climate Tech', 'Enterprise SaaS', 'Cybersecurity', 'Robotics', 'Space Tech', 'Biotech'];
const stages = ['All', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Pre-IPO', 'Secondary'];

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => Company.filter({ status: 'active' }, '-created_date', 100),
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'All' || company.sector === selectedSector;
    const matchesStage = selectedStage === 'All' || company.stage === selectedStage;
    return matchesSearch && matchesSector && matchesStage;
  });

  const featuredCompanies = filteredCompanies.filter(c => c.is_featured);
  const regularCompanies = filteredCompanies.filter(c => !c.is_featured);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // PORTFOLIO_DATABASE
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Portfolio
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              We've partnered with world-class founders building transformative companies 
              across deep tech, AI, and beyond.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-900 border-zinc-700 focus:border-[#00ff88] h-11"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-11 w-11"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-11 w-11"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sector Filter */}
            <div className="mt-4 flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <Button
                  key={sector}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSector(sector)}
                  className={`rounded-full ${
                    selectedSector === sector 
                      ? 'bg-[#00ff88] text-black hover:bg-[#00cc6a]' 
                      : 'bg-zinc-800/50 hover:bg-zinc-700'
                  }`}
                >
                  {sector}
                </Button>
              ))}
            </div>

            {/* Stage Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {stages.map((stage) => (
                <Badge
                  key={stage}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${
                    selectedStage === stage 
                      ? 'border-[#00ff88] text-[#00ff88]' 
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                  onClick={() => setSelectedStage(stage)}
                >
                  {stage}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-zinc-500 mb-8">
            <Building2 className="w-4 h-4" />
            <span>{filteredCompanies.length} companies</span>
            {selectedSector !== 'All' && (
              <Badge variant="outline" className="border-zinc-700">
                {selectedSector}
              </Badge>
            )}
            {selectedStage !== 'All' && (
              <Badge variant="outline" className="border-zinc-700">
                {selectedStage}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-400 mb-2">No companies found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            {/* Featured Companies */}
            {featuredCompanies.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00ff88] rounded-full" />
                  Featured
                </h2>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {featuredCompanies.map((company, i) => (
                    <CompanyCard key={company.id} company={company} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* All Companies */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {regularCompanies.map((company, i) => (
                <CompanyCard key={company.id} company={company} index={i + featuredCompanies.length} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}