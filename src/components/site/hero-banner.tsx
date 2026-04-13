'use client';

import Link from 'next/link';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  compact?: boolean;
}

export function HeroBanner({ title, subtitle, backgroundImage, compact = false }: HeroBannerProps) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${
        compact ? 'py-24 md:py-32' : 'py-32 md:py-44 lg:py-52'
      }`}
    >
      {/* Background */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/85" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in-up">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/85 sm:text-xl animate-fade-in-up delay-200">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
