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
