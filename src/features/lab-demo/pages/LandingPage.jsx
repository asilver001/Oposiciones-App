import React from 'react';
import { ArrowRight, Shield, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';

/**
 * Picto Dent Landing Page
 * Professional dental lab portal with branding and CTAs
 */

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Picto Dent</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Dental Laboratory</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => onNavigate('client')}
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              My Orders
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              Track Order
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              Lab Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-slate-50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100 mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-slate-600">Online Ordering Now Available</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
                German Precision.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
                  London Service.
                </span>
              </h2>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Premium CAD/CAM dental restorations milled in Germany and the UK.
                Experience the quality and reliability that London's leading dental practices trust.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('order')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Place New Order
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('track')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  Track Existing Order
                </button>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-green-500/10 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    </div>
                    <div className="h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div className="h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-4/5"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Why Choose Picto Dent?
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Combining traditional craftsmanship with cutting-edge CAD/CAM technology
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors duration-300">
                <svg className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">CAD/CAM Precision</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                State-of-the-art digital workflow with milling centers in Germany and the UK for consistent, precise results.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors duration-300">
                <Shield className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Quality Guarantee</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every restoration undergoes rigorous quality control. Full remake guarantee if you're not completely satisfied.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors duration-300">
                <Clock className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Fast Turnaround</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Single crowns in 5 working days, bridges in 7. Rush service available for urgent cases.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors duration-300">
                <Award className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Premium Materials</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Only CE-marked, biocompatible materials from leading manufacturers like Ivoclar and 3M.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-500 transition-colors duration-300">
                <svg className="w-6 h-6 text-rose-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Digital Workflow</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Accept all major intraoral scanner formats. Simply upload your STL files through our secure portal.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Personal Service</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct access to our technicians. We're always happy to discuss complex cases before you submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Our Services
            </h3>
            <p className="text-slate-600">
              Full range of fixed prosthetics for every clinical situation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Zirconia Crowns', from: '85', icon: '👑' },
              { name: 'E-max Veneers', from: '110', icon: '✨' },
              { name: 'Implant Crowns', from: '120', icon: '🔩' },
              { name: 'Bridges', from: '85/unit', icon: '🌉' }
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
              >
                <span className="text-2xl mb-3 block">{service.icon}</span>
                <h4 className="font-semibold text-slate-800 mb-1">{service.name}</h4>
                <p className="text-slate-500 text-sm">From £{service.from}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('order')}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View full service catalogue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to experience the difference?
              </h3>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Join London's leading dental practices who trust Picto Dent for their crown and bridge work.
              </p>
              <button
                onClick={() => onNavigate('order')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-50 transition-colors duration-200"
              >
                Place Your First Order
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h4 className="text-white font-bold">Pictodent Dental Laboratory Ltd.</h4>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                German precision craftsmanship with London service. Serving dental practices across the UK since 2008.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-white font-semibold mb-4">Contact</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  12 Deer Park Road, London SW19 3TL
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  020 8812 3978
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  info@pictodent.co.uk
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h5 className="text-white font-semibold mb-4">Opening Hours</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Mon - Fri: 8:00 - 17:30</li>
                <li>Saturday: 9:00 - 13:00</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Pictodent Dental Laboratory Ltd. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              Demo built with Claude Code
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
