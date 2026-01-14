import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Shield, 
  Lock, 
  Users,
  Loader2,
  Sparkles
} from 'lucide-react';

const investorTypes = [
  'Individual',
  'Family Office',
  'Institution',
  'Fund Manager',
  'Corporate',
  'Other'
];

const accreditationStatuses = [
  'Accredited',
  'Qualified Purchaser',
  'Institutional',
  'Non-Accredited'
];

const investmentCapacities = [
  '$25K - $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M+'
];

const sectors = [
  'AI/ML',
  'Deep Tech',
  'Fintech',
  'Healthcare',
  'Climate Tech',
  'Enterprise SaaS',
  'Cybersecurity',
  'Robotics',
  'Space Tech',
  'Biotech'
];

export default function RequestAccess() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    investor_type: '',
    accreditation_status: '',
    investment_capacity: '',
    areas_of_interest: [],
    linkedin_url: '',
    company_name: '',
    message: '',
  });

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.AccessRequest.create(data),
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const toggleSector = (sector) => {
    setFormData(prev => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(sector)
        ? prev.areas_of_interest.filter(s => s !== sector)
        : [...prev.areas_of_interest, sector]
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-10 text-center max-w-lg"
        >
          <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#00ff88]" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Application Received</h2>
          <p className="text-zinc-400 mb-8">
            Thank you for your interest in Nexus Ventures. Our team will review your 
            application and reach out within 2-3 business days.
          </p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a]">
              Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-xs font-mono text-[#00ff88] tracking-widest mb-4 block">
              // ACCESS_REQUEST
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join the
              <br />
              <span className="text-gradient">Investment Network</span>
            </h1>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Apply to access exclusive deal flow and co-investment opportunities in 
              the most promising pre-IPO companies. Our vetting process ensures quality 
              for both investors and portfolio companies.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Shield,
                  title: 'Vetted Opportunities',
                  description: 'Every deal undergoes rigorous due diligence before reaching our network.'
                },
                {
                  icon: Lock,
                  title: 'Exclusive Access',
                  description: 'Members get priority access to secondary market deals typically reserved for institutions.'
                },
                {
                  icon: Users,
                  title: 'Network Benefits',
                  description: 'Connect with fellow investors, founders, and industry experts.'
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#00ff88]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-zinc-500">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#00ff88]" />
              <span className="font-medium">Investor Application</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                    className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Investor Type *</Label>
                  <Select
                    value={formData.investor_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, investor_type: value }))}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {investorTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Accreditation Status *</Label>
                  <Select
                    value={formData.accreditation_status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, accreditation_status: value }))}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {accreditationStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Investment Capacity</Label>
                  <Select
                    value={formData.investment_capacity}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, investment_capacity: value }))}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {investmentCapacities.map((cap) => (
                        <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company / Fund Name</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88]"
                />
              </div>

              <div className="space-y-2">
                <Label>Areas of Interest</Label>
                <div className="flex flex-wrap gap-2">
                  {sectors.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => toggleSector(sector)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        formData.areas_of_interest.includes(sector)
                          ? 'bg-[#00ff88] text-black'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your investment experience and interests..."
                  className="bg-zinc-900 border-zinc-700 focus:border-[#00ff88] min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={!formData.full_name || !formData.email || !formData.investor_type || !formData.accreditation_status || submitMutation.isLoading}
                className="w-full bg-[#00ff88] text-black hover:bg-[#00cc6a] h-12 font-medium"
              >
                {submitMutation.isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Submit Application'
                )}
              </Button>

              <p className="text-xs text-zinc-500 text-center">
                By submitting, you agree to our terms of service and privacy policy.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}