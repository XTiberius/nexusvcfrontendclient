import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 md:p-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-[#00ff88]">Limited Access</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Apply to Join the
            <br />
            <span className="text-gradient">Investment Network</span>
          </h2>

          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Access exclusive deal flow and co-investment opportunities in the most 
            promising pre-IPO companies. Our rigorous vetting process ensures quality 
            for both investors and companies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Portfolio')}>
              <Button variant="outline" className="h-12 px-8 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600">
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
  );
}