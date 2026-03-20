/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';

const steps = [
  { num: '01', title: 'Reserve', desc: 'Pick a time slot at a partner venue. No cover to pay.' },
  { num: '02', title: 'Invite friends', desc: 'Share a link with your group. Everyone gets their own pass.' },
  { num: '03', title: 'Walk in', desc: 'Show your pass at the door. Skip the line.' },
];

function ProcessSteps() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % 3), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[#0a0a0a] border-t border-white/5">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 40, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white/[0.015] blur-3xl"
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-16">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="group flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{
                  width: active === i ? 32 : 8,
                  backgroundColor: active === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="h-2 rounded-full"
              />
              <span className={`text-xs font-medium transition-colors ${active === i ? 'text-white' : 'text-white/40'}`}>
                {steps[i].num}
              </span>
            </button>
          ))}
        </div>

        {/* Main card - cycles through steps with slide animation */}
        <div className="relative min-h-[280px] md:min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            >
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold text-white/10 mb-4"
              >
                {steps[active].num}
              </motion.span>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-3xl md:text-4xl font-medium text-white mb-4"
              >
                {steps[active].title}
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-lg md:text-xl text-white/60 max-w-md leading-relaxed"
              >
                {steps[active].desc}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Connecting line with animated progress */}
        <div className="flex justify-center mt-12 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              animate={{
                opacity: active >= i ? 1 : 0.3,
                scale: active === i ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="text-white/50 text-sm">{step.title}</span>
              {i < 2 && <span className="text-white/20">→</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [ownerSubmitted, setOwnerSubmitted] = useState(false);

  useEffect(() => {
    const handler = () => setShowOwnerModal(true);
    window.addEventListener('open-bar-modal', handler);
    return () => window.removeEventListener('open-bar-modal', handler);
  }, []);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setEmail('');
    }
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerSubmitted(true);
    setTimeout(() => {
      setShowOwnerModal(false);
      setOwnerSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-accent selection:text-white">
      <Header onVenueOwnerClick={() => setShowOwnerModal(true)} />

      {/* Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/blur.png" 
            alt="" 
            className="w-full h-full object-cover grayscale opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        </div>
        
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10 w-full px-6 pt-24 pb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-white mb-6">
            <span className="whitespace-nowrap">Skip the line with your friends.</span>
            <br />
            <span className="font-semibold">For FREE.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/75 mb-12 max-w-xl leading-relaxed">
            Reserve your spot at the best bars. Invite your friends. Show up and walk in together.
          </p>
          
          <div className="w-full max-w-md">
            {joined ? (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <span className="font-medium">You're on the list.</span>
                  <span className="text-white/70 text-sm ml-1">We'll notify you when we launch.</span>
                </div>
              </motion.div>
            ) : (
              <form 
                onSubmit={handleJoinWaitlist} 
                className="flex flex-col sm:flex-row gap-2"
              >
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="flex-1 bg-white/[0.02] backdrop-blur-sm border border-white/20 px-5 py-3.5 rounded-full text-white placeholder:text-white/60 text-base outline-none focus:border-white/35 transition-colors"
                />
                <button 
                  type="submit"
                  className="bg-white text-black font-medium px-6 py-3.5 rounded-full hover:bg-white/95 transition-colors flex items-center justify-center gap-2"
                >
                  Join waitlist <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Process */}
      <ProcessSteps />

      <footer className="bg-[#0a0a0a] border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-white/50 text-sm font-light">Backdoor</span>
          <span className="text-white/30 text-xs">&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Bar Owner Modal - rendered at app level so it works from any route */}
      <AnimatePresence>
        {showOwnerModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-surface-sec rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-surface-sec">
                <h3 className="text-2xl font-medium tracking-tight">Partner with Backdoor</h3>
                <button 
                  onClick={() => setShowOwnerModal(false)}
                  className="w-10 h-10 rounded-full bg-surface-sec flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {ownerSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-medium mb-2">Request Received!</h4>
                    <p className="text-text-secondary font-light">Thanks for your interest. Our team will be in touch shortly to schedule a demo.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-text-secondary mb-6 font-light">
                      Fill out the form below to learn more about how Backdoor can help you manage lines, guarantee revenue with no-show fees, and attract large groups.
                    </p>
                    <form onSubmit={handleOwnerSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Bar Name</label>
                        <input required type="text" className="w-full bg-bg border border-surface-sec rounded-xl px-4 py-3 text-text-primary focus:border-white/50 focus:ring-1 focus:ring-white/50 outline-none transition-all font-light" placeholder="e.g. Kollege Klub" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">First Name</label>
                          <input required type="text" className="w-full bg-bg border border-surface-sec rounded-xl px-4 py-3 text-text-primary focus:border-white/50 focus:ring-1 focus:ring-white/50 outline-none transition-all font-light" placeholder="Jane" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1.5">Last Name</label>
                          <input required type="text" className="w-full bg-bg border border-surface-sec rounded-xl px-4 py-3 text-text-primary focus:border-white/50 focus:ring-1 focus:ring-white/50 outline-none transition-all font-light" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Work Email</label>
                        <input required type="email" className="w-full bg-bg border border-surface-sec rounded-xl px-4 py-3 text-text-primary focus:border-white/50 focus:ring-1 focus:ring-white/50 outline-none transition-all font-light" placeholder="jane@kollegeklub.com" />
                      </div>
                      <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-medium text-lg px-6 py-4 rounded-xl shadow-lg transition-all mt-4">
                        Request Demo
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
