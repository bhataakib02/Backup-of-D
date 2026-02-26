import React from 'react';

// Professional Text Components with Industrial Styling
export const createProfessionalText = (text) => {
  return <span className="text-gray-900 dark:text-white font-medium">{text}</span>;
};

// Secondary text with professional styling
export const createSecondaryText = (text) => {
  return <span className="text-gray-700 dark:text-gray-300">{text}</span>;
};

// Muted text with professional styling
export const createMutedText = (text) => {
  return <span className="text-gray-600 dark:text-gray-400">{text}</span>;
};

// Accent colors for professional industrial look
export const createAccentText = (text, accent = 'blue') => {
  const colorClass = {
    blue: 'text-blue-600 dark:text-blue-400',
    red: 'text-red-600 dark:text-red-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400'
  }[accent] || 'text-blue-600 dark:text-blue-400';
  
  return <span className={`${colorClass} font-semibold`}>{text}</span>;
};

// Professional heading text
export const createHeadingText = (text, level = 1) => {
  const HeadingTag = `h${level}`;
  const sizeClass = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm'
  }[level] || 'text-xl';
  
  return React.createElement(HeadingTag, {
    className: `${sizeClass} font-bold text-gray-900 dark:text-white`
  }, text);
};

// Legacy functions for backward compatibility - now use RGBA Blue/Green colors
export const createRGBText = createProfessionalText;
export const createRGBWords = createProfessionalText;
export const createRainbowText = createProfessionalText;
export const createRainbowWords = createProfessionalText;
export const getRGBColorByIndex = () => 'rgba(0, 100, 200, 1)';
export const getColorByIndex = () => 'rgba(0, 100, 200, 1)';
