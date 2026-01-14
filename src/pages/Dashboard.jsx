import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Wallet, 
  Building2, 
  Clock, 
  ArrowUpRight,
  ArrowRight,
  Loader2,
  PieChart,
  FileText,
  Bell,
  Settings,
  ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
    };
    getUser();
  }, []);

  const { data: investments = [], isLoading: investmentsLoading } = useQuery({
    queryKey: ['my-investments', user?.email],
    queryFn: () => base44.entities.Investment.filter({ created_by: user?.email }, '-created_date', 50),
    enabled: !!user?.email,
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.entities.Company.list('-created_date', 100),
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: () => base44.entities.Deal.list('-created_date', 100),
  });

  const getCompany = (companyId) => companies.find(c => c.id === companyId);
  const getDeal = (dealId) => deals.find(d => d.id === dealId);

  // Calculate portfolio stats
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.current_value || inv.amount || 0), 0);
  const portfolioGain = totalCurrentValue - totalInvested;
  const gainPercentage = totalInvested > 0 ? ((portfolioGain / totalInvested) * 100) : 0;

  const portfolioByCompany = investments.reduce((acc, inv) => {
    const company = getCompany(inv.company_id);
    if (company) {
      if (!acc[company.name]) {
        acc[company.name] = { amount: 0, company };
      }
      acc[company.name].amount += inv.current_value || inv.amount || 0;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="relative py-12 border-b border-zinc-800/50">
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-2 block">
                // INVESTOR_DASHBOARD
              </span>
              <h1 className="text-3xl font-bold">Welcome back, {user?.full_name?.split(' ')[0] || 'Investor'}</h1>
              <p className="text-zinc-400 mt-1">Manage your portfolio and explore new opportunities</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link to={createPageUrl('Deals')}>
                <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a]">
                  Browse Deals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#00ff88]" />
              </div>
              <span className="text-sm text-zinc-500">Total Invested</span>
            </div>
            <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-zinc-500">Current Value</span>
            </div>
            <div className="text-2xl font-bold">${totalCurrentValue.toLocaleString()}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${portfolioGain >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                <ArrowUpRight className={`w-5 h-5 ${portfolioGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
              <span className="text-sm text-zinc-500">Unrealized P&L</span>
            </div>
            <div className={`text-2xl font-bold ${portfolioGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {portfolioGain >= 0 ? '+' : ''}${portfolioGain.toLocaleString()}
              <span className="text-sm ml-1">({gainPercentage.toFixed(1)}%)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-zinc-500">Positions</span>
            </div>
            <div className="text-2xl font-bold">{Object.keys(portfolioByCompany).length}</div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6">
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-zinc-800">
              <PieChart className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-zinc-800">
              <FileText className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            {investmentsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
              </div>
            ) : investments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-12 text-center"
              >
                <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No investments yet</h3>
                <p className="text-zinc-500 mb-6">Start building your portfolio by exploring available deals</p>
                <Link to={createPageUrl('Deals')}>
                  <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a]">
                    Browse Deals
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Holdings */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Your Holdings</h3>
                  {Object.entries(portfolioByCompany).map(([name, data], i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card rounded-xl p-4 flex items-center gap-4"
                    >
                      {data.company.logo_url ? (
                        <img src={data.company.logo_url} alt={name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-zinc-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{name}</h4>
                        <p className="text-xs text-zinc-500">{data.company.sector}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${data.amount.toLocaleString()}</div>
                        <div className="text-xs text-zinc-500">
                          {((data.amount / totalCurrentValue) * 100).toFixed(1)}% of portfolio
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Allocation Chart Placeholder */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Allocation by Sector</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      investments.reduce((acc, inv) => {
                        const company = getCompany(inv.company_id);
                        if (company) {
                          acc[company.sector] = (acc[company.sector] || 0) + (inv.current_value || inv.amount || 0);
                        }
                        return acc;
                      }, {})
                    ).map(([sector, amount]) => (
                      <div key={sector}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-400">{sector}</span>
                          <span>{((amount / totalCurrentValue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-full"
                            style={{ width: `${(amount / totalCurrentValue) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions">
            {investmentsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
              </div>
            ) : investments.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                <p className="text-zinc-500">Your investment history will appear here</p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-800/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-zinc-400">Company</th>
                        <th className="text-left p-4 text-sm font-medium text-zinc-400">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-zinc-400">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-zinc-400">Shares</th>
                        <th className="text-left p-4 text-sm font-medium text-zinc-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((inv, i) => {
                        const company = getCompany(inv.company_id);
                        return (
                          <motion.tr
                            key={inv.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-t border-zinc-800/50 hover:bg-zinc-800/30"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {company?.logo_url ? (
                                  <img src={company.logo_url} alt={company?.name} className="w-8 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-zinc-500" />
                                  </div>
                                )}
                                <span className="font-medium">{company?.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="p-4 text-zinc-400">
                              {inv.investment_date ? new Date(inv.investment_date).toLocaleDateString() : '-'}
                            </td>
                            <td className="p-4 font-medium">${inv.amount?.toLocaleString()}</td>
                            <td className="p-4 text-zinc-400">{inv.shares?.toLocaleString() || '-'}</td>
                            <td className="p-4">
                              <Badge className={
                                inv.status === 'settled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                inv.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }>
                                {inv.status || 'Pending'}
                              </Badge>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}