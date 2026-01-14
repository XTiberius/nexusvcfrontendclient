import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  TrendingUp, 
  Users, 
  MapPin,
  ExternalLink,
  CheckCircle2,
  Shield,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import PriceVsLastRound from '../components/deals/PriceVsLastRound';
import InvestmentMemo from '../components/deals/InvestmentMemo';
import NDASection from '../components/deals/NDASection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function DealDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const dealId = urlParams.get('id');
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [showNDADialog, setShowNDADialog] = useState(false);
  const [ndaAgreed, setNdaAgreed] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const authed = await base44.auth.isAuthenticated();
      setIsAuthenticated(authed);
      if (authed) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const { data: deal, isLoading: dealLoading } = useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => {
      const deals = await base44.entities.Deal.filter({ id: dealId });
      return deals[0];
    },
    enabled: !!dealId,
  });

  const { data: company } = useQuery({
    queryKey: ['company', deal?.company_id],
    queryFn: async () => {
      const companies = await base44.entities.Company.filter({ id: deal.company_id });
      return companies[0];
    },
    enabled: !!deal?.company_id,
  });

  const { data: nda, refetch: refetchNDA } = useQuery({
    queryKey: ['nda', dealId, user?.email],
    queryFn: async () => {
      const ndas = await base44.entities.NDA.filter({ 
        deal_id: dealId, 
        user_email: user.email 
      });
      return ndas[0];
    },
    enabled: !!dealId && !!user?.email,
  });

  const investMutation = useMutation({
    mutationFn: async (amount) => {
      return base44.entities.Investment.create({
        deal_id: dealId,
        company_id: deal.company_id,
        amount: parseFloat(amount),
        shares: deal.share_price ? Math.floor(parseFloat(amount) / deal.share_price) : 0,
        share_price: deal.share_price,
        investment_date: new Date().toISOString().split('T')[0],
        status: 'pending',
      });
    },
    onSuccess: () => {
      setShowInvestDialog(false);
      setInvestmentAmount('');
      queryClient.invalidateQueries(['deal', dealId]);
    },
  });

  const signNDAMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.NDA.create({
        deal_id: dealId,
        user_email: user.email,
        agreed_at: new Date().toISOString(),
        terms_version: 'v1.0',
      });
    },
    onSuccess: () => {
      setShowNDADialog(false);
      setNdaAgreed(false);
      refetchNDA();
    },
  });

  if (dealLoading || !deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  const statusColors = {
    open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closing_soon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    closed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    fully_subscribed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="relative py-12 overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <Link to={createPageUrl('Deals')} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Deals
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Company Info */}
            <div className="flex items-start gap-4 flex-1">
              {company?.logo_url ? (
                <img src={company.logo_url} alt={company?.name} className="w-20 h-20 rounded-2xl object-cover bg-zinc-800" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-zinc-500" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{company?.name || 'Company'}</h1>
                  <Badge className={`${statusColors[deal.status]} border`}>
                    {deal.status === 'closing_soon' ? 'Closing Soon' : deal.status === 'fully_subscribed' ? 'Fully Subscribed' : deal.status === 'open' ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <p className="text-lg text-zinc-400 mb-3">{deal.title}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                  <Badge variant="outline" className="border-zinc-700">{deal.deal_type}</Badge>
                  <Badge variant="outline" className="border-zinc-700">{company?.sector}</Badge>
                  {company?.headquarters && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {company.headquarters}
                    </span>
                  )}
                  {company?.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#00ff88] hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:w-72">
              <div className="glass-card rounded-xl p-4">
                <div className="text-xs text-zinc-500 mb-1">Min. Investment</div>
                <div className="text-xl font-bold">${deal.minimum_investment?.toLocaleString()}</div>
              </div>
              {deal.implied_valuation && (
                <div className="glass-card rounded-xl p-4">
                  <div className="text-xs text-zinc-500 mb-1">Valuation</div>
                  <div className="text-xl font-bold text-[#00ff88]">${deal.implied_valuation}M</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4">About {company?.name}</h2>
              <p className="text-zinc-400 leading-relaxed">
                {company?.long_description || company?.description || 'No description available.'}
              </p>
            </motion.div>

            {/* Deal Highlights */}
            {deal.highlights && deal.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Deal Highlights</h2>
                <ul className="space-y-3">
                  {deal.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#00ff88] mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-400">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Key Investors */}
            {company?.key_investors && company.key_investors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Notable Investors</h2>
                <div className="flex flex-wrap gap-2">
                  {company.key_investors.map((investor, i) => (
                    <Badge key={i} variant="outline" className="border-zinc-700 text-zinc-300 py-1.5 px-3">
                      {investor}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Company Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Company Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {company?.founded_year && (
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1">Founded</div>
                    <div className="font-semibold">{company.founded_year}</div>
                  </div>
                )}
                {company?.team_size && (
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Team Size
                    </div>
                    <div className="font-semibold">{company.team_size}</div>
                  </div>
                )}
                {company?.total_raised && (
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Total Raised
                    </div>
                    <div className="font-semibold">${company.total_raised}M</div>
                  </div>
                )}
                {company?.stage && (
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1">Stage</div>
                    <div className="font-semibold">{company.stage}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* NDA Status Section */}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <NDASection nda={nda} company={company} />
              </motion.div>
            )}

            {/* Investment Memorandum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <InvestmentMemo 
                company={company} 
                deal={deal} 
                ndaSigned={!!nda}
                onSignNDA={() => setShowNDADialog(true)}
              />
            </motion.div>
          </div>

          {/* Right Column - Investment Card */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 sticky top-24"
            >
              <h3 className="text-lg font-semibold mb-6">Investment Details</h3>
              
              <div className="space-y-4 mb-6">
                {deal.share_price && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Share Price</span>
                    <span className="font-semibold">${deal.share_price.toFixed(2)}</span>
                  </div>
                )}
                {deal.share_price && deal.last_round_price && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">vs Last Round</span>
                    <PriceVsLastRound currentPrice={deal.share_price} lastRoundPrice={deal.last_round_price} size="md" />
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Minimum</span>
                  <span className="font-semibold">${deal.minimum_investment?.toLocaleString()}</span>
                </div>
                {deal.allocation_remaining && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Allocation Left</span>
                    <span className="font-semibold">${deal.allocation_remaining.toLocaleString()}</span>
                  </div>
                )}
                {deal.closing_date && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Closes
                    </span>
                    <span className="font-semibold">{new Date(deal.closing_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                deal.status === 'open' || deal.status === 'closing_soon' ? (
                  <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#00ff88] text-black hover:bg-[#00cc6a] h-12 font-medium">
                        Express Interest
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800">
                      <DialogHeader>
                        <DialogTitle>Investment Interest</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                          Enter your desired investment amount for {company?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm text-zinc-500 mb-2 block">Investment Amount (USD)</label>
                          <Input
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            placeholder={`Min. $${deal.minimum_investment?.toLocaleString()}`}
                            className="bg-zinc-800 border-zinc-700"
                          />
                        </div>
                        {investmentAmount && parseFloat(investmentAmount) < deal.minimum_investment && (
                          <p className="text-sm text-amber-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Minimum investment is ${deal.minimum_investment?.toLocaleString()}
                          </p>
                        )}
                        <Button
                          onClick={() => investMutation.mutate(investmentAmount)}
                          disabled={!investmentAmount || parseFloat(investmentAmount) < deal.minimum_investment || investMutation.isLoading}
                          className="w-full bg-[#00ff88] text-black hover:bg-[#00cc6a]"
                        >
                          {investMutation.isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Submit Interest'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button disabled className="w-full h-12">
                    Deal Closed
                  </Button>
                )
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={() => base44.auth.redirectToLogin()} 
                    className="w-full bg-[#00ff88] text-black hover:bg-[#00cc6a] h-12 font-medium"
                  >
                    Sign In to Invest
                  </Button>
                  <Link to={createPageUrl('RequestAccess')}>
                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
                      Request Access
                    </Button>
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Shield className="w-4 h-4 text-[#00ff88]" />
                  SEC-compliant transactions
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <FileText className="w-4 h-4 text-[#00ff88]" />
                  Full documentation provided
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NDA Dialog */}
      <Dialog open={showNDADialog} onOpenChange={setShowNDADialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Non-Disclosure Agreement</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Please review and agree to the NDA to access confidential investment materials
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-zinc-800/50 rounded-lg p-4 max-h-96 overflow-y-auto mb-6">
              <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
{`NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of the date of electronic acceptance by the undersigned ("Recipient") for the purpose of preventing the unauthorized disclosure of confidential information regarding ${company?.name || 'the Company'}.

1. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public information disclosed by or on behalf of ${company?.name || 'the Company'}, including but not limited to: financial statements, business plans, customer lists, trade secrets, proprietary technology, investment terms, and any materials marked "Confidential."

2. OBLIGATIONS
Recipient agrees to:
- Hold all Confidential Information in strict confidence
- Not disclose Confidential Information to any third party without prior written consent
- Use Confidential Information solely for evaluating the investment opportunity
- Protect Confidential Information with the same degree of care used for own confidential information

3. TERM
This Agreement shall remain in effect for a period of five (5) years from the date of acceptance.

4. NO LICENSE
Nothing in this Agreement grants any license or right to the Recipient under any intellectual property rights.

5. RETURN OF MATERIALS
Upon request, Recipient agrees to return or destroy all materials containing Confidential Information.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware.

By clicking "I Agree," you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement.`}
              </pre>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <Checkbox 
                id="nda-agree" 
                checked={ndaAgreed}
                onCheckedChange={setNdaAgreed}
              />
              <label htmlFor="nda-agree" className="text-sm text-zinc-300 leading-relaxed cursor-pointer">
                I have read and agree to the terms of this Non-Disclosure Agreement. I understand that this creates a legally binding obligation.
              </label>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowNDADialog(false)}
                className="flex-1 border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => signNDAMutation.mutate()}
                disabled={!ndaAgreed || signNDAMutation.isLoading}
                className="flex-1 bg-[#00ff88] text-black hover:bg-[#00cc6a]"
              >
                {signNDAMutation.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'I Agree - Sign NDA'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}