import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Building2, 
  Lock,
  Loader2,
  ChevronDown
} from 'lucide-react';
import PriceVsLastRound from '../components/deals/PriceVsLastRound';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  open: { label: 'Open', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  closing_soon: { label: 'Closing Soon', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  closed: { label: 'Closed', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  fully_subscribed: { label: 'Fully Subscribed', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
};

const dealTypes = ['All', 'Primary', 'Secondary', 'SPV', 'Direct'];

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authed = await base44.auth.isAuthenticated();
      setIsAuthenticated(authed);
    };
    checkAuth();
  }, []);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.Deal.list('-created_date', 50),
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.entities.Company.list('-created_date', 100),
  });

  const getCompany = (companyId) => companies.find(c => c.id === companyId);

  const filteredDeals = deals.filter(deal => {
    const company = getCompany(deal.company_id);
    const matchesSearch = deal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || deal.deal_type === selectedType;
    return matchesSearch && matchesType;
  });

  const openDeals = filteredDeals.filter(d => d.status === 'open' || d.status === 'closing_soon');
  const closedDeals = filteredDeals.filter(d => d.status === 'closed' || d.status === 'fully_subscribed');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#00ff88]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // DEAL_FLOW
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Active Opportunities
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl">
              Browse our curated selection of secondary market deals. Each opportunity 
              has been thoroughly vetted by our investment team.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-700 focus:border-[#00ff88] h-11"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 border-zinc-700 hover:bg-zinc-800">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedType}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                {dealTypes.map((type) => (
                  <DropdownMenuItem 
                    key={type} 
                    onClick={() => setSelectedType(type)}
                    className="cursor-pointer"
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-400 mb-2">No deals found</h3>
            <p className="text-zinc-500">Check back soon for new opportunities.</p>
          </div>
        ) : (
          <>
            {/* Open Deals */}
            {openDeals.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Open Deals ({openDeals.length})
                </h2>
                <div className="space-y-4">
                  {openDeals.map((deal, i) => {
                    const company = getCompany(deal.company_id);
                    const status = statusConfig[deal.status];
                    const isLocked = deal.access_level !== 'public' && !isAuthenticated;

                    return (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group glass-card rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                          {/* Company Info */}
                          <div className="flex items-center gap-4 flex-1">
                            {company?.logo_url ? (
                              <img 
                                src={company.logo_url} 
                                alt={company?.name} 
                                className="w-16 h-16 rounded-xl object-cover bg-zinc-800"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-zinc-500" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{company?.name || 'Company'}</h3>
                                <Badge className={`${status.color} border text-xs`}>
                                  {status.label}
                                </Badge>
                                {isLocked && (
                                  <Lock className="w-4 h-4 text-zinc-500" />
                                )}
                              </div>
                              <p className="text-sm text-zinc-400 line-clamp-1">{deal.title}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                                <span>{deal.deal_type}</span>
                                <span>•</span>
                                <span>{company?.sector}</span>
                                {deal.closing_date && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Closes {new Date(deal.closing_date).toLocaleDateString()}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Deal Stats */}
                          <div className="grid grid-cols-3 gap-6 lg:w-auto">
                            <div>
                              <div className="text-xs text-zinc-500 mb-1">Min. Investment</div>
                              <div className="font-semibold">${deal.minimum_investment?.toLocaleString()}</div>
                            </div>
                            {deal.implied_valuation && (
                              <div>
                                <div className="text-xs text-zinc-500 mb-1">Valuation</div>
                                <div className="font-semibold text-[#00ff88]">${deal.implied_valuation}M</div>
                              </div>
                            )}
                            {deal.share_price && (
                              <div>
                                <div className="text-xs text-zinc-500 mb-1">
                                  {deal.last_round_price ? 'vs Last Round' : 'Share Price'}
                                </div>
                                {deal.last_round_price ? (
                                  <PriceVsLastRound currentPrice={deal.share_price} lastRoundPrice={deal.last_round_price} size="md" />
                                ) : (
                                  <div className="font-semibold">${deal.share_price}</div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* CTA */}
                          <div className="lg:w-48">
                            <Link to={isLocked ? createPageUrl('RequestAccess') : createPageUrl(`DealDetail?id=${deal.id}`)}>
                              <Button className="w-full bg-zinc-800 hover:bg-[#00ff88] hover:text-black transition-colors group">
                                {isLocked ? 'Request Access' : 'View Deal'}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Closed Deals */}
            {closedDeals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-zinc-500">
                  Past Deals ({closedDeals.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {closedDeals.map((deal, i) => {
                    const company = getCompany(deal.company_id);
                    return (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card rounded-xl p-4 opacity-60 hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {company?.logo_url ? (
                            <img src={company.logo_url} alt={company?.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-zinc-600" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-sm">{company?.name}</h4>
                            <p className="text-xs text-zinc-500">{deal.deal_type}</p>
                          </div>
                        </div>
                        <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                          {statusConfig[deal.status]?.label || 'Closed'}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}