
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  ShieldCheck,
  Lock,
  Network,
  Twitter,
  Github,
  Linkedin,
  Cpu,
  Database,
  LineChart,
  Settings,
  ExternalLink
} from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative border-t border-white/10 mt-12">
      {/* Neural line animation along the top border */}
      <div className="absolute top-0 left-0 right-0 h-px w-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-nova to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        />
      </div>

      <div className="container px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and info column */}
          <div className="col-span-1 md:col-span-3 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/lovable-uploads/5e426b4d-ccda-486b-8980-761ff3c70294.png"
                alt="NODO AI Logo"
                className="h-8 w-auto"
              />
              <div className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full">
                <div className="flex items-center gap-1">
                  <Brain size={10} className="text-nova" />
                  <span>AI Powered</span>
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4 max-w-xs">
              NODO AI optimizes yield farming through advanced neural networks, machine learning, and blockchain technology.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Twitter size={16} />
              </Link>
              <Link
                to="/"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Github size={16} />
              </Link>
              <Link
                to="/"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Linkedin size={16} />
              </Link>
            </div>
          </div>

          {/* Links column */}
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Brain size={14} className="text-nova" />
                  <span>AI Vaults</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <LineChart size={14} className="text-nova" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Cpu size={14} className="text-nova" />
                  <span>AI Assistant</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Database size={14} className="text-nova" />
                  <span>Token Economy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <ShieldCheck size={14} className="text-white/60" />
                  <span>Security</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Settings size={14} className="text-white/60" />
                  <span>Developer Docs</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Network size={14} className="text-white/60" />
                  <span>API</span>
                </Link>
              </li>
              <li>
                <a href="/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <ExternalLink size={14} className="text-white/60" />
                  <span>Blog</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Lock size={14} className="text-white/60" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Lock size={14} className="text-white/60" />
                  <span>Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Lock size={14} className="text-white/60" />
                  <span>Risk Disclosures</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Lock size={14} className="text-white/60" />
                  <span>Cookie Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Tech stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-white/5">
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xs text-white/40 mb-1">AI Algorithm</div>
            <div className="text-sm text-white flex items-center gap-1.5">
              <Cpu size={14} className="text-nova" />
              <span>NeuralNet v2.4</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xs text-white/40 mb-1">Data Points</div>
            <div className="text-sm text-white flex items-center gap-1.5">
              <Database size={14} className="text-orion" />
              <span>32.4M Daily</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xs text-white/40 mb-1">Security Audits</div>
            <div className="text-sm text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>5 Complete</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xs text-white/40 mb-1">Optimization Rate</div>
            <div className="text-sm text-white flex items-center gap-1.5">
              <LineChart size={14} className="text-violet-500" />
              <span>98.7% Success</span>
            </div>
          </div>
        </div>

        {/* Copyright footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/5 text-white/40 text-xs">
          <div>
            © {currentYear} NODO AI. All rights reserved.
          </div>
          <div className="mt-2 md:mt-0">
            <div className="flex items-center gap-1">
              <Brain size={10} />
              <span>Built with advanced AI optimization technology</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
