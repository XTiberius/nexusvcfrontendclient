import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Lock, ChevronDown, ChevronUp } from 'lucide-react';

export default function NDASection({ nda, company }) {
  const [expanded, setExpanded] = useState(false);

  const ndaTerms = `NON-DISCLOSURE AGREEMENT

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

By clicking "I Agree," you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement.`;

  if (!nda) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 text-zinc-500">
          <Lock className="w-5 h-5" />
          <div>
            <h3 className="font-medium text-white">NDA Status</h3>
            <p className="text-sm">Not signed - Required to view investment materials</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00ff88]/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">NDA Signed</h3>
            <p className="text-sm text-zinc-500">
              Agreed on {new Date(nda.agreed_at).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-zinc-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        )}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t border-zinc-800"
        >
          <div className="bg-zinc-900/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[#00ff88]" />
              <span className="text-sm font-medium">Agreement Details</span>
            </div>
            <div className="space-y-2 text-xs text-zinc-500">
              <div className="flex justify-between">
                <span>Signed by:</span>
                <span className="text-zinc-400">{nda.user_email}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="text-zinc-400">
                  {new Date(nda.agreed_at).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Terms Version:</span>
                <span className="text-zinc-400">{nda.terms_version}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-medium mb-3">NDA Terms</h4>
            <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">
              {ndaTerms}
            </pre>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}