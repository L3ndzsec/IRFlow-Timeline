import { useState, useCallback } from "react";
import useUIStore from "../../store/useUIStore.js";
import useTheme from "../../hooks/useTheme.js";

// Pills stack upward from the bottom-right corner.
// Each slot is 50px taller than the previous so they never overlap.
const PILL_BASE_BOTTOM = 80;
const PILL_SLOT_HEIGHT = 50;

function usePillDrag(defaultBottom) {
  const [pos, setPos] = useState({ x: null, y: null });
  const onDragStart = useCallback((e) => {
    if (e.button !== 0) return;
    const ox = e.clientX - (pos.x ?? window.innerWidth - 220);
    const oy = e.clientY - (pos.y ?? (window.innerHeight - defaultBottom));
    const onMove = (ev) => setPos({ x: ev.clientX - ox, y: ev.clientY - oy });
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [pos, defaultBottom]);
  return { pos, onDragStart };
}

function PillShell({ defaultBottom, onDragStart, pos, border, children }) {
  const { th } = useTheme();
  return (
    <div style={{
      position: "fixed", zIndex: 220, WebkitAppRegion: "no-drag",
      ...(pos.x != null ? { left: pos.x, top: pos.y } : { right: 20, bottom: defaultBottom }),
    }}>
      <div onMouseDown={onDragStart} onClick={(e) => e.stopPropagation()} style={{
        WebkitAppRegion: "no-drag", background: th.modalBg,
        border: `1px solid ${border || th.border}`, borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)", display: "flex", alignItems: "center",
        gap: 8, padding: "9px 14px", cursor: "move", userSelect: "none", whiteSpace: "nowrap",
        minWidth: 340,
      }}>
        {children}
      </div>
    </div>
  );
}

export function LateralMovementPill() {
  const { th } = useTheme();
  const minimizedModals = useUIStore((s) => s.minimizedModals);
  const restoreMinimizedModal = useUIStore((s) => s.restoreMinimizedModal);
  const removeMinimizedModal = useUIStore((s) => s.removeMinimizedModal);

  const myIndex = minimizedModals.findIndex((m) => m.type === "lateralMovement");
  const defaultBottom = PILL_BASE_BOTTOM + Math.max(0, myIndex) * PILL_SLOT_HEIGHT;
  const { pos, onDragStart } = usePillDrag(defaultBottom);

  return (
    <PillShell defaultBottom={defaultBottom} onDragStart={onDragStart} pos={pos} border={th.modalBorder || th.border}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.danger} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="19" cy="19" r="2.5"/>
        <line x1="7.5" y1="11" x2="16.5" y2="6"/><line x1="7.5" y1="13" x2="16.5" y2="18"/>
      </svg>
      <span style={{ color: th.text, fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>Lateral Movement</span>
      <span style={{ color: th.textMuted, fontSize: 11, fontFamily: "-apple-system, sans-serif" }}>· tracker active</span>
      <button onClick={() => restoreMinimizedModal("lateralMovement")} aria-label="Restore Lateral Movement Tracker" title="Restore"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 13, padding: "2px 4px", marginLeft: 4, lineHeight: 1 }}>⊞</button>
      <button onClick={() => removeMinimizedModal("lateralMovement")} aria-label="Close"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>&times;</button>
    </PillShell>
  );
}

export function SigmaPill() {
  const { th } = useTheme();
  const minimizedModals = useUIStore((s) => s.minimizedModals);
  const restoreMinimizedModal = useUIStore((s) => s.restoreMinimizedModal);
  const removeMinimizedModal = useUIStore((s) => s.removeMinimizedModal);

  const myIndex = minimizedModals.findIndex((m) => m.type === "sigma");
  const defaultBottom = PILL_BASE_BOTTOM + Math.max(0, myIndex) * PILL_SLOT_HEIGHT;
  const { pos, onDragStart } = usePillDrag(defaultBottom);

  return (
    <PillShell defaultBottom={defaultBottom} onDragStart={onDragStart} pos={pos} border={th.modalBorder}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
      </svg>
      <span style={{ color: th.text, fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>Sigma Scan</span>
      <span style={{ color: th.textMuted, fontSize: 11, fontFamily: "-apple-system, sans-serif" }}>· results ready</span>
      <button onClick={() => restoreMinimizedModal("sigma")} aria-label="Restore Sigma Scan" title="Restore"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 13, padding: "2px 4px", marginLeft: 4, lineHeight: 1 }}>⊞</button>
      <button onClick={() => removeMinimizedModal("sigma")} aria-label="Close"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>&times;</button>
    </PillShell>
  );
}

export function ProcessInspectorPill() {
  const { th } = useTheme();
  const minimizedModals = useUIStore((s) => s.minimizedModals);
  const restoreMinimizedModal = useUIStore((s) => s.restoreMinimizedModal);
  const removeMinimizedModal = useUIStore((s) => s.removeMinimizedModal);
  const myIndex = minimizedModals.findIndex((m) => m.type === "processTree");
  const defaultBottom = PILL_BASE_BOTTOM + Math.max(0, myIndex) * PILL_SLOT_HEIGHT;
  const { pos, onDragStart } = usePillDrag(defaultBottom);
  return (
    <PillShell defaultBottom={defaultBottom} onDragStart={onDragStart} pos={pos} border={th.modalBorder || th.border}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M17.5 17.5h.01"/><path d="M14 17.5h3.5v-3.5"/>
      </svg>
      <span style={{ color: th.text, fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>Process Inspector</span>
      <span style={{ color: th.textMuted, fontSize: 11, fontFamily: "-apple-system, sans-serif" }}>· analysis active</span>
      <button onClick={() => restoreMinimizedModal("processTree")} aria-label="Restore Process Inspector" title="Restore"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 13, padding: "2px 4px", marginLeft: 4, lineHeight: 1 }}>⊞</button>
      <button onClick={() => removeMinimizedModal("processTree")} aria-label="Close"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>&times;</button>
    </PillShell>
  );
}

export function PersistenceAnalyzerPill() {
  const { th } = useTheme();
  const minimizedModals = useUIStore((s) => s.minimizedModals);
  const restoreMinimizedModal = useUIStore((s) => s.restoreMinimizedModal);
  const removeMinimizedModal = useUIStore((s) => s.removeMinimizedModal);
  const myIndex = minimizedModals.findIndex((m) => m.type === "persistence");
  const defaultBottom = PILL_BASE_BOTTOM + Math.max(0, myIndex) * PILL_SLOT_HEIGHT;
  const { pos, onDragStart } = usePillDrag(defaultBottom);
  return (
    <PillShell defaultBottom={defaultBottom} onDragStart={onDragStart} pos={pos} border={th.modalBorder || th.border}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.warning || "#f59e0b"} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <span style={{ color: th.text, fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>Persistence Analyzer</span>
      <span style={{ color: th.textMuted, fontSize: 11, fontFamily: "-apple-system, sans-serif" }}>· results ready</span>
      <button onClick={() => restoreMinimizedModal("persistence")} aria-label="Restore Persistence Analyzer" title="Restore"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 13, padding: "2px 4px", marginLeft: 4, lineHeight: 1 }}>⊞</button>
      <button onClick={() => removeMinimizedModal("persistence")} aria-label="Close"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>&times;</button>
    </PillShell>
  );
}

export function RdpBitmapCachePill() {
  const { th } = useTheme();
  const minimizedModals = useUIStore((s) => s.minimizedModals);
  const restoreMinimizedModal = useUIStore((s) => s.restoreMinimizedModal);
  const removeMinimizedModal = useUIStore((s) => s.removeMinimizedModal);
  const myIndex = minimizedModals.findIndex((m) => m.type === "rdpBitmapCache");
  const defaultBottom = PILL_BASE_BOTTOM + Math.max(0, myIndex) * PILL_SLOT_HEIGHT;
  const { pos, onDragStart } = usePillDrag(defaultBottom);
  return (
    <PillShell defaultBottom={defaultBottom} onDragStart={onDragStart} pos={pos} border={th.modalBorder || th.border}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        <circle cx="8" cy="9" r="1.5"/><path d="M21 15l-5-5-4 4-2-2-4 4"/>
      </svg>
      <span style={{ color: th.text, fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>RDP Bitmap Cache</span>
      <span style={{ color: th.textMuted, fontSize: 11, fontFamily: "-apple-system, sans-serif" }}>· extractor active</span>
      <button onClick={() => restoreMinimizedModal("rdpBitmapCache")} aria-label="Restore RDP Bitmap Cache" title="Restore"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 13, padding: "2px 4px", marginLeft: 4, lineHeight: 1 }}>⊞</button>
      <button onClick={() => removeMinimizedModal("rdpBitmapCache")} aria-label="Close"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>&times;</button>
    </PillShell>
  );
}

export function AdsPill() {
  const { th } = useTheme();
  const minimizedModals = useUIStore((s) => s.minimizedModals);
  const restoreMinimizedModal = useUIStore((s) => s.restoreMinimizedModal);
  const removeMinimizedModal = useUIStore((s) => s.removeMinimizedModal);
  const myIndex = minimizedModals.findIndex((m) => m.type === "ads");
  const defaultBottom = PILL_BASE_BOTTOM + Math.max(0, myIndex) * PILL_SLOT_HEIGHT;
  const { pos, onDragStart } = usePillDrag(defaultBottom);
  return (
    <PillShell defaultBottom={defaultBottom} onDragStart={onDragStart} pos={pos} border={th.modalBorder || th.border}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
      <span style={{ color: th.text, fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>ADS Analyzer</span>
      <span style={{ color: th.textMuted, fontSize: 11, fontFamily: "-apple-system, sans-serif" }}>· results ready</span>
      <button onClick={() => restoreMinimizedModal("ads")} aria-label="Restore ADS Analyzer" title="Restore"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 13, padding: "2px 4px", marginLeft: 4, lineHeight: 1 }}>⊞</button>
      <button onClick={() => removeMinimizedModal("ads")} aria-label="Close"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>&times;</button>
    </PillShell>
  );
}

export function UsnAnalysisPill() {
  const { th } = useTheme();
  const minimizedModals = useUIStore((s) => s.minimizedModals);
  const restoreMinimizedModal = useUIStore((s) => s.restoreMinimizedModal);
  const removeMinimizedModal = useUIStore((s) => s.removeMinimizedModal);
  const myIndex = minimizedModals.findIndex((m) => m.type === "usnAnalysis");
  const defaultBottom = PILL_BASE_BOTTOM + Math.max(0, myIndex) * PILL_SLOT_HEIGHT;
  const { pos, onDragStart } = usePillDrag(defaultBottom);
  return (
    <PillShell defaultBottom={defaultBottom} onDragStart={onDragStart} pos={pos} border={th.modalBorder || th.border}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
      <span style={{ color: th.text, fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>USN Journal</span>
      <span style={{ color: th.textMuted, fontSize: 11, fontFamily: "-apple-system, sans-serif" }}>· analysis active</span>
      <button onClick={() => restoreMinimizedModal("usnAnalysis")} aria-label="Restore USN Journal Analysis" title="Restore"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 13, padding: "2px 4px", marginLeft: 4, lineHeight: 1 }}>⊞</button>
      <button onClick={() => removeMinimizedModal("usnAnalysis")} aria-label="Close"
        style={{ background: "none", border: "none", color: th.textDim, cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>&times;</button>
    </PillShell>
  );
}
