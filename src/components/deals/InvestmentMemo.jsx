import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { FileText, Download, Lock, ChevronDown, ChevronUp } from 'lucide-react';

export default function InvestmentMemo({ company, deal, ndaSigned, onSignNDA }) {
  const [expandedSection, setExpandedSection] = useState('executive');

  const sections = [
    {
      id: 'executive',
      title: 'Executive Summary',
      content: `${company?.name} is a ${company?.stage} stage company in the ${company?.sector} sector. This secondary opportunity provides qualified investors access to shares at a ${deal.last_round_price && deal.share_price < deal.last_round_price ? ((1 - deal.share_price / deal.last_round_price) * 100).toFixed(0) + '% discount' : 'compelling valuation'} to the last primary round.`
    },
    {
      id: 'investment',
      title: 'Investment Thesis',
      content: `Strong market position in ${company?.sector} with proven revenue model. ${company?.team_size ? `Team of ${company.team_size} professionals` : 'Experienced team'} executing against clear growth milestones. ${company?.key_investors?.length > 0 ? `Backed by tier-1 investors including ${company.key_investors.slice(0, 2).join(', ')}.` : ''}`
    },
    {
      id: 'terms',
      title: 'Transaction Terms',
      content: `Share Price: $${deal.share_price?.toFixed(2)} | Minimum Investment: $${deal.minimum_investment?.toLocaleString()} | Transaction Type: ${deal.deal_type} | Closing Date: ${deal.closing_date ? new Date(deal.closing_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}`
    },
    {
      id: 'risks',
      title: 'Risk Factors',
      content: 'Private company investments are illiquid and high-risk. No guarantee of returns. Market conditions, competition, regulatory changes, and company-specific factors may impact valuation. Limited voting rights typical in secondary transactions. Exit timeline uncertain.'
    },
    {
      id: 'legal',
      title: 'Legal & Compliance',
      content: 'This opportunity is available only to accredited investors as defined under Regulation D. All transactions are conducted in compliance with SEC regulations. Investors must complete KYC/AML verification. Transfer restrictions apply per company charter and securities laws.'
    }
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  if (!ndaSigned) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">NDA Required</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-md">
            To view the confidential investment memorandum, you must first review and agree to the Non-Disclosure Agreement.
          </p>
          <Button 
            onClick={onSignNDA}
            className="bg-[#00ff88] text-black hover:bg-[#00cc6a]"
          >
            Review & Sign NDA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Investment Memorandum</h2>
          <p className="text-sm text-zinc-500">Confidential - For Qualified Investors Only</p>
        </div>
        <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="space-y-3">
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-zinc-800 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#00ff88]" />
                <span className="font-medium">{section.title}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-4 h-4 text-zinc-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              )}
            </button>
            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4"
              >
                <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 rounded-lg p-4">
                  {section.content}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <span>Document Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          5 pages
        </span>
      </div>
    </div>
  );
}