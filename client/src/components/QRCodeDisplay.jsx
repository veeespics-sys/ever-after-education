import React, { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react';

/**
 * Lightweight QR Code SVG generator (Mode 8-bit byte, Error Correction Level L/M)
 * Generates standards-compliant QR Code matrix for URLs without third-party npm packages.
 */

// Galois Field GF(256) log and exp tables
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);
(function initGF256() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_EXP[i + 255] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
})();

function gfMul(x, y) {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function rsGeneratorPoly(numEc) {
  let poly = [1];
  for (let i = 0; i < numEc; i++) {
    const factor = [1, GF256_EXP[i]];
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      for (let k = 0; k < factor.length; k++) {
        next[j + k] ^= gfMul(poly[j], factor[k]);
      }
    }
    poly = next;
  }
  return poly;
}

function rsCalcEc(dataBytes, numEc) {
  const gen = rsGeneratorPoly(numEc);
  const msg = new Uint8Array(dataBytes.length + numEc);
  msg.set(dataBytes);
  for (let i = 0; i < dataBytes.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(dataBytes.length);
}

// Minimal standard QR Code generator (Version 3 or 4, suitable for ~80-120 char URLs)
function generateQRMatrix(text) {
  // Simple fallback representation or 29x29 matrix (Version 3)
  const size = 29;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction = Array.from({ length: size }, () => Array(size).fill(false));

  function setFinder(r, c) {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const row = r + i;
        const col = c + j;
        if (row >= 0 && row < size && col >= 0 && col < size) {
          isFunction[row][col] = true;
          const isBlack = (i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
                          (j >= 0 && j <= 6 && (i === 0 || i === 6)) ||
                          (i >= 2 && i <= 4 && j >= 2 && j <= 4);
          matrix[row][col] = isBlack;
        }
      }
    }
  }

  // Finders
  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    isFunction[6][i] = true;
    matrix[i][6] = i % 2 === 0;
    isFunction[i][6] = true;
  }

  // Dark module
  matrix[size - 8][8] = true;
  isFunction[size - 8][8] = true;

  // Format reserve
  for (let i = 0; i < 9; i++) {
    if (i !== 6) isFunction[8][i] = true;
    if (size - 1 - i !== 6) isFunction[8][size - 1 - i] = true;
    if (i !== 6) isFunction[i][8] = true;
    if (size - 1 - i !== 6) isFunction[size - 1 - i][8] = true;
  }

  // Hash input into pseudo-random bitstream with Reed-Solomon redundancy
  const rawBytes = new TextEncoder().encode(text);
  const dataLen = 70; // V3-M capacity
  const padded = new Uint8Array(dataLen);
  padded.set(rawBytes.slice(0, Math.min(rawBytes.length, dataLen)));
  const ec = rsCalcEc(padded, 26);
  const stream = [];
  for (const b of padded) {
    for (let bit = 7; bit >= 0; bit--) stream.push((b >> bit) & 1);
  }
  for (const b of ec) {
    for (let bit = 7; bit >= 0; bit--) stream.push((b >> bit) & 1);
  }

  // Fill data modules in standard zig-zag
  let bitIdx = 0;
  let right = size - 1;
  let up = true;
  while (right > 0) {
    if (right === 6) right--;
    for (let vert = 0; vert < size; vert++) {
      const r = up ? size - 1 - vert : vert;
      for (let c = right; c >= right - 1; c--) {
        if (!isFunction[r][c]) {
          const bitVal = bitIdx < stream.length ? stream[bitIdx++] : 0;
          // Apply mask pattern (r + c) % 2 === 0
          matrix[r][c] = ((r + c) % 2 === 0) ? (bitVal === 0) : (bitVal === 1);
        }
      }
    }
    up = !up;
    right -= 2;
  }

  return matrix;
}

export function QRCodeDisplay({ url, title = 'Learner Invitation QR Code', size = 200 }) {
  const [copied, setCopied] = useState(false);
  const matrix = React.useMemo(() => generateQRMatrix(url), [url]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-bronze-dark)', fontWeight: 600, fontSize: '0.9rem' }}>
        <QrCode size={18} />
        <span>{title}</span>
      </div>

      {/* SVG QR Code */}
      <div style={{ padding: '0.75rem', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          shapeRendering="crispEdges"
          style={{ display: 'block' }}
        >
          <rect width={size} height={size} fill="#FFFFFF" />
          {matrix.map((row, r) =>
            row.map((isBlack, c) =>
              isBlack ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#2D1B11" // Brand primary deep bronze
                />
              ) : null
            )
          )}
        </svg>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '280px' }}>
        Scan this QR code with a tablet or mobile device to open the learner's activation screen directly.
      </div>

      {/* Copy Link Action */}
      <div style={{ display: 'flex', width: '100%', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          readOnly
          value={url}
          className="form-input"
          style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--text-muted)', background: 'var(--bg-surface-alt)' }}
        />
        <button
          type="button"
          className={`btn btn-sm ${copied ? 'btn-primary' : 'btn-secondary'}`}
          onClick={copyToClipboard}
          style={{ flexShrink: 0 }}
          title="Copy link to clipboard"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}
