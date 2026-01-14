import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, TrendingUp, Building2 } from 'lucide-react';
import PriceVsLastRound from '../deals/PriceVsLastRound';

export default function FeaturedDeals({ deals, companies }) {
  const getCompany = (companyId) => companies.find(c => c.id === companyId);

  const statusColors = {
    open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closing_soon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    fully_subscribed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  if (!deals || deals.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // ACTIVE_DEALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Current Opportunities
            </h2>
            <p className="text-zinc-400">
              Exclusive access to vetted secondary market deals.
            </p>
          </div>
          <Link to={createPageUrl('Deals')} className="mt-4 md:mt-0">
            <Button variant="ghost" className="text-[#00ff88] hover:bg-[#00ff88]/10">
              View All Deals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.slice(0, 3).map((deal, i) => {
            const company = getCompany(deal.company_id);
            if (!company) return null;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass-card rounded-2xl overflow-hidden hover:border-[#00ff88]/30 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-zinc-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{company.name}</h3>
                        <p className="text-xs text-zinc-500">{company.sector}</p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[deal.status]} border text-xs`}>
                      {deal.status === 'closing_soon' ? 'Closing Soon' : deal.status === 'fully_subscribed' ? 'Fully Subscribed' : 'Open'}
                    </Badge>
                  </div>

                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                    {deal.title}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Deal Type</span>
                      <span className="font-medium">{deal.deal_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Min. Investment</span>
                      <span className="font-medium">${deal.minimum_investment?.toLocaleString()}</span>
                    </div>
                    {deal.implied_valuation && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Valuation</span>
                        <span className="font-medium text-[#00ff88]">${deal.implied_valuation}M</span>
                      </div>
                    )}
                    {deal.share_price && deal.last_round_price && (
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-zinc-500">vs Last Round</span>
                        <PriceVsLastRound currentPrice={deal.share_price} lastRoundPrice={deal.last_round_price} />
                      </div>
                    )}
                  </div>

                  {deal.closing_date && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      <span>Closes {new Date(deal.closing_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800/50">
                  <Link to={createPageUrl(`DealDetail?id=${deal.id}`)}>
                    <Button className="w-full bg-zinc-800 hover:bg-[#00ff88] hover:text-black transition-colors group">
                      View Deal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}