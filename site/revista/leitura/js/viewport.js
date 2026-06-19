'use strict';

/**
 * Zoom/pan ancorado no centro do palco.
 * O transform é aplicado em bookEl (não em contentEl).
 */
export class BookViewport {
  constructor(stageEl, bookEl, contentEl) {
    this.stage = stageEl;
    this.book = bookEl;
    this.content = contentEl;
    this.scale = 1;
    this.minScale = 0.2;
    this.maxScale = 6;
    this.panX = 0;
    this.panY = 0;
    this.userZoom = false;
    this._fitScale = 1;
    this._dragging = false;
    this._moved = false;
    this._lastX = 0;
    this._lastY = 0;
    this._touchId = null;
    this._edgeTurn = false;
    this._panRaf = 0;

    this.book.style.transformOrigin = 'center center';
    this.book.style.position = 'absolute';
    this.book.style.left = '50%';
    this.book.style.top = '50%';
    this.content.style.transform = 'none';
    this.content.style.transformOrigin = '';
  }

  apply() {
    this.book.style.transform =
      'translate(calc(-50% + ' + this.panX + 'px), calc(-50% + ' + this.panY + 'px)) scale(' + this.scale + ')';
  }

  fit() {
    const cw = this.content.scrollWidth || this.content.offsetWidth;
    const ch = this.content.scrollHeight || this.content.offsetHeight;
    if (!cw || !ch) return;

    const availW = this.stage.clientWidth - 40;
    const availH = this.stage.clientHeight - 40;
    const s = Math.min(availW / cw, availH / ch);

    this._fitScale = s;
    this.scale = s;
    this.minScale = s * 0.8;
    this.panX = 0;
    this.panY = 0;
    this.userZoom = false;
    this.apply();
  }

  /** Após troca de spread: mantém zoom do usuário, zera pan. */
  onSpreadChange() {
    const prevScale = this.scale;
    const hadUserZoom = this.userZoom;

    const cw = this.content.scrollWidth || this.content.offsetWidth;
    const ch = this.content.scrollHeight || this.content.offsetHeight;
    if (cw && ch) {
      const availW = this.stage.clientWidth - 40;
      const availH = this.stage.clientHeight - 40;
      this._fitScale = Math.min(availW / cw, availH / ch);
      this.minScale = this._fitScale * 0.8;
    }

    if (hadUserZoom) {
      this.scale = prevScale;
      this.userZoom = true;
    } else {
      this.scale = this._fitScale;
      this.userZoom = false;
    }

    this.panX = 0;
    this.panY = 0;
    this.apply();
  }

  zoomBy(factor, cx, cy) {
    const rect = this.stage.getBoundingClientRect();
    const px = (cx == null ? rect.width / 2 : cx - rect.left);
    const py = (cy == null ? rect.height / 2 : cy - rect.top);

    const stageCx = rect.width / 2;
    const stageCy = rect.height / 2;
    const contentX = (px - stageCx - this.panX) / this.scale;
    const contentY = (py - stageCy - this.panY) / this.scale;

    const ns = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
    this.panX = px - stageCx - contentX * ns;
    this.panY = py - stageCy - contentY * ns;
    this.scale = ns;
    this.userZoom = this.scale > this._fitScale * 1.02;
    this.apply();
  }

  panTo(x, y) {
    this.panX = x;
    this.panY = y;
    if (this._panRaf) return;
    this._panRaf = requestAnimationFrame(() => {
      this._panRaf = 0;
      this.apply();
    });
  }

  clampPan() {
    const cw = this.content.scrollWidth || this.content.offsetWidth;
    const ch = this.content.scrollHeight || this.content.offsetHeight;
    const sw = this.stage.clientWidth;
    const sh = this.stage.clientHeight;
    const scaledW = cw * this.scale;
    const scaledH = ch * this.scale;
    const maxPanX = Math.max(0, (scaledW - sw) / 2 + 12);
    const maxPanY = Math.max(0, (scaledH - sh) / 2 + 12);
    this.panX = Math.max(-maxPanX, Math.min(maxPanX, this.panX));
    this.panY = Math.max(-maxPanY, Math.min(maxPanY, this.panY));
  }

  bindEvents(handlers) {
    const { onEdgeTap, onResize } = handlers;

    this.stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    }, { passive: false });

    this.stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' && e.isPrimary === false) return;
      this._moved = false;
      this._edgeTurn = false;
      const r = this.stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      if (nx < 0.14 || nx > 0.86) {
        this._edgeTurn = true;
        this._lastX = e.clientX;
        this._lastY = e.clientY;
        return;
      }
      this._dragging = true;
      this._lastX = e.clientX;
      this._lastY = e.clientY;
      this._touchId = e.pointerId;
      this.stage.classList.add('grabbing');
      try { this.stage.setPointerCapture(e.pointerId); } catch (err) {}
    });

    this.stage.addEventListener('pointermove', (e) => {
      if (this._edgeTurn) {
        if (Math.abs(e.clientX - this._lastX) + Math.abs(e.clientY - this._lastY) > 8) this._moved = true;
        return;
      }
      if (!this._dragging || e.pointerId !== this._touchId) return;
    this.panX += e.clientX - this._lastX;
    this.panY += e.clientY - this._lastY;
    this._lastX = e.clientX;
    this._lastY = e.clientY;
    this._moved = true;
    this.clampPan();
    this.panTo(this.panX, this.panY);
    });

    const endDrag = (e) => {
      if (this._edgeTurn) {
        if (!this._moved && e && e.clientX != null && onEdgeTap) {
          const r = this.stage.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          if (nx < 0.14) onEdgeTap(-1);
          else if (nx > 0.86) onEdgeTap(1);
        }
        this._edgeTurn = false;
        return;
      }
      if (e && e.pointerId != null && this._touchId != null && e.pointerId !== this._touchId) return;
      this._dragging = false;
      this._touchId = null;
      this.stage.classList.remove('grabbing');
      setTimeout(() => { this._moved = false; }, 80);
    };

    this.stage.addEventListener('pointerup', endDrag);
    this.stage.addEventListener('pointercancel', endDrag);
    this.stage.addEventListener('dblclick', (e) => {
      this.zoomBy(this.scale > this.minScale * 1.5 ? 0.4 : 2.2, e.clientX, e.clientY);
    });

    let swipeX = 0, swipeY = 0, swipeActive = false;
    this.stage.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      swipeActive = true;
      swipeX = e.touches[0].clientX;
      swipeY = e.touches[0].clientY;
    }, { passive: true });

    this.stage.addEventListener('touchend', (e) => {
      if (!swipeActive || this._dragging) return;
      swipeActive = false;
      const t = e.changedTouches[0];
      if (!t || !onEdgeTap) return;
      const dx = t.clientX - swipeX;
      const dy = t.clientY - swipeY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        onEdgeTap(dx < 0 ? 1 : -1);
      }
    }, { passive: true });

    if (onResize) {
      window.addEventListener('resize', () => {
        if (onResize()) this.fit();
      });
    }
  }

  get moved() { return this._moved; }
  get dragging() { return this._dragging; }
}
