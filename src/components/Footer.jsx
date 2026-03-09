import { assets } from '../assets/assets';

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <footer className="flex flex-col items-center justify-around w-full py-16 text-sm bg-slate-50 text-gray-800/70">

        {/* Logo Image */}
        <img
          src={assets.logom}
          alt="SwiftAI Hub Logo"
          className="h-12 object-contain"
        />

        {/* Copyright */}
        <p className="mt-4 text-center">
          Copyright © 2026{" "}
          <span className="font-medium text-gray-800">
            SWIFT-AI HUB
          </span>
          . All rights reserved.
        </p>

        {/* Footer Links */}
        <div className="flex items-center gap-4 mt-6">
          <a
            href="#"
            className="font-medium text-gray-800 hover:text-black transition-all"
          >
            Brand Guidelines
          </a>

          <div className="h-4 w-px bg-black/20"></div>

          <a
            href="#"
            className="font-medium text-gray-800 hover:text-black transition-all"
          >
            Trademark Policy
          </a>
        </div>

      </footer>
    </>
  );
}