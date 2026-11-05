import React from 'react';
import { APP_CONFIG } from '../config/appConfig';

/**
 * Reusable BrandLogo Component
 * 
 * Preserves the original 3D metallic bronze infinity emblem artwork, proportions, and colors.
 * Supports:
 *  - 'full': Emblem + Wordmark + Descriptor
 *  - 'emblem': Compact emblem-only for mobile/narrow layouts
 *  - 'stacked': Centered emblem with stacked typography below
 *  - 'publisher': Publisher brand (EverAfter Media)
 */
export function BrandLogo({
  variant = 'full',
  size = 'md',
  showDescriptor = true,
  className = '',
  style = {}
}) {
  // Height sizing for the emblem to keep crisp proportions (aspect ratio ~2:1)
  const emblemHeights = {
    sm: 26,
    md: 36,
    lg: 52,
    xl: 72
  };

  const emblemHeight = emblemHeights[size] || emblemHeights.md;
  // Natural width based on 461x232 ratio
  const emblemWidth = Math.round(emblemHeight * (461 / 232));

  if (variant === 'emblem') {
    return (
      <div
        className={`brand-logo-emblem-wrap ${className}`}
        style={{ display: 'inline-flex', alignItems: 'center', ...style }}
      >
        <img
          src={APP_CONFIG.emblemPath}
          alt={APP_CONFIG.brandName}
          width={emblemWidth}
          height={emblemHeight}
          style={{
            height: `${emblemHeight}px`,
            width: `${emblemWidth}px`,
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        className={`brand-logo-stacked ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.65rem',
          ...style
        }}
      >
        <img
          src={APP_CONFIG.emblemPath}
          alt={`${APP_CONFIG.brandName} Emblem`}
          width={emblemWidth}
          height={emblemHeight}
          style={{
            height: `${emblemHeight}px`,
            width: `${emblemWidth}px`,
            objectFit: 'contain',
            display: 'block'
          }}
        />
        <div>
          <div
            className="brand-font-serif"
            style={{
              fontSize: size === 'lg' ? '1.75rem' : size === 'sm' ? '1.15rem' : '1.4rem',
              fontWeight: 700,
              color: 'var(--color-bronze-dark)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em'
            }}
          >
            {APP_CONFIG.brandName}
          </div>
          {showDescriptor && (
            <div
              style={{
                fontSize: size === 'sm' ? '0.65rem' : '0.725rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
                color: 'var(--color-bronze-medium)',
                marginTop: '0.2rem'
              }}
            >
              {APP_CONFIG.descriptor}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'publisher') {
    return (
      <div
        className={`brand-logo-publisher ${className}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', ...style }}
      >
        <img
          src={APP_CONFIG.emblemPath}
          alt="EverAfter Media"
          width={Math.round(emblemHeight * 0.7 * (461 / 232))}
          height={Math.round(emblemHeight * 0.7)}
          style={{
            height: `${Math.round(emblemHeight * 0.7)}px`,
            width: 'auto',
            objectFit: 'contain'
          }}
        />
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Published by <strong style={{ color: 'var(--color-bronze-dark)' }}>{APP_CONFIG.publisherBrand}</strong>
        </div>
      </div>
    );
  }

  // Default 'full' variant: horizontal logo with emblem on left, typography on right
  return (
    <div
      className={`brand-logo-full ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.65rem' : '0.85rem',
        textDecoration: 'none',
        ...style
      }}
    >
      <img
        src={APP_CONFIG.emblemPath}
        alt={`${APP_CONFIG.brandName} Infinity Emblem`}
        width={emblemWidth}
        height={emblemHeight}
        style={{
          height: `${emblemHeight}px`,
          width: `${emblemWidth}px`,
          objectFit: 'contain',
          flexShrink: 0,
          display: 'block'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          className="brand-font-serif brand-title"
          style={{
            fontSize: size === 'lg' ? '1.5rem' : size === 'sm' ? '1.05rem' : '1.28rem',
            fontWeight: 700,
            color: 'var(--color-bronze-dark)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em'
          }}
        >
          {APP_CONFIG.brandName}
        </span>
        {showDescriptor && (
          <span
            className="brand-descriptor"
            style={{
              fontSize: size === 'sm' ? '0.625rem' : '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              color: 'var(--color-bronze-medium)',
              marginTop: '0.15rem'
            }}
          >
            {APP_CONFIG.descriptor}
          </span>
        )}
      </div>
    </div>
  );
}
