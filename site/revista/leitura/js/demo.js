'use strict';

import { CONFIG, RS, dpr } from './config.js';
import { state } from './state.js';

export const DEMO = {
  pages: 8,
  headlines: [
    'A geometria invisível das tensões',
    'Quando o maciço guarda memória',
    'Medir o que não se vê',
    'Notas sobre parcimônia',
    'Do isotérmico ao adiabático',
    'Um método, três painéis',
    'O erro que ninguém comenta'
  ],
  kickers: ['ensaio', 'campo', 'método', 'coluna', 'física', 'prática', 'crítica']
};

function paperBg(ctx, w, h) {
  ctx.fillStyle = '#f6f4ee';
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, w * 0.12, 0);
  g.addColorStop(0, 'rgba(0,0,0,0.05)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fakeText(ctx, x, y, colW, lines, opts) {
  opts = opts || {};
  const lh = opts.lh || 9;
  const gap = opts.gap || 7;
  const color = opts.color || 'rgba(27,33,39,0.78)';
  ctx.fillStyle = color;
  let cy = y, count = 0;
  for (let i = 0; i < lines; i++) {
    const last = (count >= (opts.paraLen || 5) - 1);
    const w = last ? colW * (0.35 + Math.random() * 0.4) : colW * (0.86 + Math.random() * 0.14);
    const r = 1.4;
    roundRect(ctx, x, cy, w, 3.0, r);
    ctx.fill();
    cy += lh;
    if (last) { cy += gap; count = 0; } else count++;
    if (cy > y + (opts.maxH || 9999)) break;
  }
}

function wrapText(ctx, text, x, y, maxW, lh) {
  const words = String(text).split(' ');
  let line = '', cy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = words[i];
      cy += lh;
    } else line = test;
  }
  if (line) { ctx.fillText(line, x, cy); cy += lh; }
  return cy;
}

export function drawDemoCover(ctx, w, h) {
  ctx.fillStyle = '#1f5163';
  ctx.fillRect(0, 0, w, h);
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, 'rgba(255,255,255,0.06)');
  grd.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.strokeStyle = 'rgba(199,154,75,0.16)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 7; i++) {
    ctx.beginPath();
    ctx.arc(w * 0.86, h * 0.9, i * 22, Math.PI, Math.PI * 1.5);
    ctx.stroke();
  }
  ctx.restore();

  const m = w * 0.12;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 9px system-ui, sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.save();
  ctx.translate(m, h * 0.12);
  ctx.fillStyle = '#c79a4b';
  ctx.fillText('V O L .   I', 0, 0);
  ctx.textAlign = 'right';
  ctx.fillText('2 0 2 6', w - 2 * m, 0);
  ctx.restore();
  ctx.strokeStyle = '#c79a4b';
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.moveTo(m, h * 0.135);
  ctx.lineTo(w - m, h * 0.135);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#fbfbf9';
  ctx.textAlign = 'left';
  ctx.font = '600 ' + Math.round(w * 0.135) + 'px Georgia, "Palatino Linotype", serif';
  ctx.fillText(CONFIG.MAGAZINE.name, m, h * 0.30);

  ctx.strokeStyle = '#c79a4b';
  ctx.beginPath();
  ctx.moveTo(m, h * 0.335);
  ctx.lineTo(m + w * 0.22, h * 0.335);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.font = 'italic 13px Georgia, serif';
  ctx.fillText(CONFIG.MAGAZINE.tagline, m, h * 0.375);

  ctx.fillStyle = '#c79a4b';
  ctx.font = '600 9px system-ui, sans-serif';
  ctx.fillText(CONFIG.MAGAZINE.coverKicker.toUpperCase().split('').join('\u200a'), m, h * 0.70);
  ctx.fillStyle = '#fbfbf9';
  ctx.font = '600 ' + Math.round(w * 0.052) + 'px Georgia, serif';
  wrapText(ctx, CONFIG.MAGAZINE.coverLine, m, h * 0.74, w - 2 * m, w * 0.062);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '600 10px system-ui, sans-serif';
  ctx.fillText('Nº 01', m, h * 0.93);
}

export function drawDemoInterior(ctx, w, h, pageIndex) {
  paperBg(ctx, w, h);
  const m = w * 0.12;
  const isLeft = (pageIndex % 2) === 1;
  const idx = pageIndex - 1;

  ctx.fillStyle = '#79808a';
  ctx.font = '600 8px system-ui, sans-serif';
  ctx.textBaseline = 'alphabetic';
  const head = CONFIG.MAGAZINE.name + '  ·  ' + CONFIG.MAGAZINE.kicker;
  if (isLeft) {
    ctx.textAlign = 'left';
    ctx.fillText(String(pageIndex + 1), m, h * 0.07);
    ctx.textAlign = 'right';
    ctx.fillText(head, w - m, h * 0.07);
  } else {
    ctx.textAlign = 'left';
    ctx.fillText(head, m, h * 0.07);
    ctx.textAlign = 'right';
    ctx.fillText(String(pageIndex + 1), w - m, h * 0.07);
  }
  ctx.strokeStyle = '#d8d3c6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(m, h * 0.085);
  ctx.lineTo(w - m, h * 0.085);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#1f5163';
  ctx.font = '600 9px system-ui, sans-serif';
  ctx.fillText((DEMO.kickers[idx % DEMO.kickers.length] || 'ensaio').toUpperCase().split('').join('\u200a'), m, h * 0.15);

  ctx.fillStyle = '#1b2127';
  ctx.font = '600 ' + Math.round(w * 0.060) + 'px Georgia, serif';
  const yEnd = wrapText(ctx, DEMO.headlines[idx % DEMO.headlines.length] || 'Título', m, h * 0.205, w - 2 * m, w * 0.07);

  const withFigure = (pageIndex % 4 === 3);
  const colGap = w * 0.05;
  const colW = (w - 2 * m - colGap) / 2;
  const bodyTop = yEnd + h * 0.03;

  if (withFigure) {
    const figH = h * 0.26, figW = w - 2 * m;
    ctx.fillStyle = '#eee9dc';
    roundRect(ctx, m, bodyTop, figW, figH, 4);
    ctx.fill();
    ctx.strokeStyle = '#cfc9ba';
    ctx.stroke();
    ctx.save();
    ctx.translate(m + figW * 0.5, bodyTop + figH * 0.5);
    ctx.strokeStyle = '#1f5163';
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, figH * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-figW * 0.3, 0);
    ctx.lineTo(figW * 0.3, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -figH * 0.32);
    ctx.lineTo(0, figH * 0.32);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.fillStyle = '#79808a';
    ctx.font = 'italic 9px system-ui, sans-serif';
    ctx.fillText('Figura ' + Math.ceil(pageIndex / 4) + ' — esquema ilustrativo.', m, bodyTop + figH + 12);
    const tcol = bodyTop + figH + 22;
    fakeText(ctx, m, tcol, colW, 40, { maxH: h - tcol - h * 0.06 });
    fakeText(ctx, m + colW + colGap, tcol, colW, 40, { maxH: h - tcol - h * 0.06 });
  } else {
    fakeText(ctx, m, bodyTop, colW, 80, { maxH: h - bodyTop - h * 0.06, paraLen: 6 });
    fakeText(ctx, m + colW + colGap, bodyTop, colW, 80, { maxH: h - bodyTop - h * 0.06, paraLen: 6 });
  }
}

export function drawDemoIndex(ctx, w, h) {
  paperBg(ctx, w, h);
  const m = w * 0.12;
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#79808a';
  ctx.font = '600 8px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(CONFIG.MAGAZINE.name + '  ·  ' + CONFIG.MAGAZINE.kicker, m, h * 0.07);
  ctx.textAlign = 'right';
  ctx.fillText('2', w - m, h * 0.07);
  ctx.strokeStyle = '#d8d3c6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(m, h * 0.085);
  ctx.lineTo(w - m, h * 0.085);
  ctx.stroke();
  ctx.textAlign = 'left';

  ctx.fillStyle = '#1f5163';
  ctx.font = '600 9px system-ui, sans-serif';
  ctx.fillText('NESTA EDIÇÃO'.split('').join('\u200a'), m, h * 0.15);
  ctx.fillStyle = '#1b2127';
  ctx.font = '600 ' + Math.round(w * 0.085) + 'px Georgia, serif';
  ctx.fillText('Índice', m, h * 0.225);
  ctx.strokeStyle = '#c79a4b';
  ctx.beginPath();
  ctx.moveTo(m, h * 0.25);
  ctx.lineTo(m + w * 0.2, h * 0.25);
  ctx.stroke();

  const entries = DEMO.headlines;
  const lh = h * 0.072;
  let y = h * 0.33;
  for (let i = 0; i < entries.length; i++) {
    ctx.fillStyle = '#1f5163';
    ctx.font = '600 8px system-ui, sans-serif';
    ctx.fillText((DEMO.kickers[i % DEMO.kickers.length] || '').toUpperCase().split('').join('\u200a'), m, y - lh * 0.34);

    ctx.fillStyle = '#1b2127';
    ctx.font = '500 ' + Math.round(w * 0.044) + 'px Georgia, serif';
    const title = entries[i];
    ctx.fillText(title, m, y);
    const tw = ctx.measureText(title).width;

    ctx.fillStyle = '#79808a';
    ctx.font = '600 ' + Math.round(w * 0.04) + 'px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(i + 3), w - m, y);
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#d8d3c6';
    ctx.setLineDash([1, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(m + tw + 8, y - 3);
    ctx.lineTo(w - m - 16, y - 3);
    ctx.stroke();
    ctx.setLineDash([]);

    y += lh;
    if (y > h * 0.92) break;
  }
}

export function renderDemoPage(canvas, pageIndex, scale) {
  scale = scale || RS;
  const { Book } = state;
  const w = Book.pw, h = Book.ph;
  canvas.width = Math.round(w * scale * dpr);
  canvas.height = Math.round(h * scale * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale * dpr, scale * dpr);
  if (pageIndex === 0) drawDemoCover(ctx, w, h);
  else if (pageIndex === 1) drawDemoIndex(ctx, w, h);
  else drawDemoInterior(ctx, w, h, pageIndex);
}
