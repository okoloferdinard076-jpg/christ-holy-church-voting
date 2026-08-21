import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PaymentSettings } from '../types';

interface FaqSectionProps {
  paymentSettings: PaymentSettings;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ paymentSettings }) => {
  const price = paymentSettings?.votePrice || 50;

  const faqs = [
    {
      q: 'How much does it cost to vote?',
      a: `The official voting price is ₦${price} per vote. You can purchase any number of votes (e.g. 10 votes = ₦${10 * price}, 100 votes = ₦${100 * price}).`,
    },
    {
      q: 'What payment methods are supported?',
      a: `We currently use direct manual bank transfers to our official church designated account (${paymentSettings.bankName} - ${paymentSettings.accountNumber}, Account Name: ${paymentSettings.accountName}). Online gateways such as Paystack or Flutterwave are not used at this stage.`,
    },
    {
      q: 'When will my votes appear on the leaderboard?',
      a: 'Votes are officially counted after a church administrator verifies your bank transfer. Once approved, the votes are atomically allocated in the authoritative ledger and reflected immediately on the live leaderboard.',
    },
    {
      q: 'How do I check if my payment has been approved?',
      a: 'Visit the "Check Vote Status" page on this website and enter the unique Payment Reference (e.g. VOTE-XXXXXX) generated during your voting process.',
    },
    {
      q: 'Who is organizing this ambassadorship contest?',
      a: 'This official event is organized by Christ Holy Church International No. 2 Benin as part of our youth leadership, service excellence, and spiritual ambassadorship development.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-slate-50/60 border-b border-slate-200/80" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Everything you need to know about the Christ Holy Church International No. 2 Benin Ambassadorship voting process.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left font-bold text-sm text-blue-950 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-800 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
