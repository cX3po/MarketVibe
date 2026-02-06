'use client';

// Tooltip component for learning mode explanations

import { ReactNode, useState } from 'react';
import { useMarketStore } from '@/store/market-store';

interface TooltipProps {
  children: ReactNode;
  content: string;
  title?: string;
  learnOnly?: boolean; // Only show in learning mode
  position?: 'top' | 'bottom'; // Position of tooltip
  learnMoreUrl?: string; // Optional external link for more information
}

export function Tooltip({ children, content, title, learnOnly = true, position = 'top', learnMoreUrl }: TooltipProps) {
  const { appMode } = useMarketStore();
  const [isVisible, setIsVisible] = useState(false);

  // If learnOnly is true, only show tooltips in learning mode
  const shouldShow = !learnOnly || appMode === 'learning';

  if (!shouldShow) {
    return <>{children}</>;
  }

  const tooltipClasses = position === 'bottom'
    ? "absolute z-50 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 top-full left-1/2 transform -translate-x-1/2 mt-2"
    : "absolute z-50 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 bottom-full left-1/2 transform -translate-x-1/2 mb-2";

  const arrowClasses = position === 'bottom'
    ? "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[-5px]"
    : "absolute top-full left-1/2 transform -translate-x-1/2 -mt-1";

  const arrowRotation = position === 'bottom' ? "-rotate-45" : "rotate-45";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className={appMode === 'learning' ? 'cursor-help' : ''}>
        {children}
      </div>

      {isVisible && (
        <div className={tooltipClasses}>
          {title && (
            <div className="font-bold text-blue-300 mb-2 flex items-center gap-2">
              <span>💡</span>
              {title}
            </div>
          )}
          <div className="text-gray-200 leading-relaxed">{content}</div>
          {learnMoreUrl && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors"
              >
                📚 Learn More
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
          {/* Arrow */}
          <div className={arrowClasses}>
            <div className={`w-3 h-3 bg-gray-900 border-r border-b border-gray-700 ${arrowRotation}`}></div>
          </div>
        </div>
      )}
    </div>
  );
}
