import React, { useState } from 'react';
import { Mail, Github, Linkedin, Copy, Check, Send, MapPin, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { MapleLeafIcon, MushroomCapIcon } from './MapleIcons';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <section id="contact" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 border-t border-amber-900/10">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Adventurer Whisper & Messenger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Send a Whisper or Reach Out</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Whether you're discussing high-throughput engineering roles, distributed architecture, or just want to connect over a warm campfire brew.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Direct Details */}
          <div className="md:col-span-5 space-y-4">
            {/* Email card */}
            <div className="p-5 rounded-2xl border-2 border-amber-900/15 bg-white shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-stone-500 font-medium font-mono">Electronic Mail</div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                    {PERSONAL_INFO.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer active:scale-98 shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-200" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
                >
                  Send Direct
                </a>
              </div>
            </div>

            {/* Phone card */}
            <div className="p-5 rounded-2xl border-2 border-amber-900/15 bg-white shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-stone-500 font-medium font-mono">Phone / Signal</div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                    {PERSONAL_INFO.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                <button
                  onClick={handleCopyPhone}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all cursor-pointer"
                >
                  {phoneCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="inline-flex items-center justify-center py-1.5 px-3 rounded-xl text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 transition-colors"
                >
                  Call
                </a>
              </div>
            </div>

            {/* Location & Status */}
            <div className="p-4 rounded-xl border border-amber-900/15 bg-amber-50/60 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-semibold text-stone-800">{PERSONAL_INFO.location}</span>
                <span className="text-stone-400 font-mono">({PERSONAL_INFO.realm})</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Available for high-impact Senior Engineering roles</span>
              </div>
            </div>

            {/* Social profiles */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-amber-900/15 hover:border-amber-400 text-stone-700 text-xs font-semibold transition-all shadow-2xs"
              >
                <Linkedin className="w-4 h-4 text-sky-700" />
                <span>LinkedIn</span>
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-amber-900/15 hover:border-amber-400 text-stone-700 text-xs font-semibold transition-all shadow-2xs"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Clean Message Box */}
          <div className="md:col-span-7">
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-amber-900/15 bg-white shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center justify-between">
                <span>Direct Adventurer Whisper</span>
                <span className="text-xs font-mono font-normal text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Fast Response
                </span>
              </h3>

              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Whisper delivered!</span>
                  </div>
                  <p className="text-emerald-800">
                    Thanks for reaching out! Hung will review your message and reply promptly to your email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-700">Adventurer Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#faf7f2]/50 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-700">Reply Email</label>
                      <input
                        type="email"
                        required
                        placeholder="recruiter@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#faf7f2]/50 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Message / Opportunity Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Hi Hung, we saw your credit risk & distributed systems work at RBC and would love to chat..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-[#faf7f2]/50 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                  >
                    {isSubmitting ? (
                      <span>Sending Whisper...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
