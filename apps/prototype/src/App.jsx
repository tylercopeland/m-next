import React, { useState, useRef, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import AppInvoiceMOne from './AppInvoiceMOne';
import AppMNext from './AppMNext';
import { kitStore } from './_stubs/store';

// Global CSS reset injected at render time — independent of index.html so
// Vite HMR can't miss it. Matches what Storybook gets via styles.min.css.
// Without this, browser-default <p>/<h*> margins (~16px each, non-collapsing
// in flex layout) inflate every m-next component that uses styled.p / styled.h*.
if (typeof document !== 'undefined' && !document.getElementById('m-next-prototype-reset')) {
  const style = document.createElement('style');
  style.id = 'm-next-prototype-reset';
  style.textContent = `
    /* Universal border-box — matches styles.min.css which Storybook gets.
       Without this, components with explicit padding (InsightCard, Container,
       etc.) render 32–40px taller than their min-height because padding +
       border are added on top in the default content-box model. */
    *, *::before, *::after { box-sizing: border-box; }
    p, h1, h2, h3, h4, h5, h6 { margin: 0; }
    ul, ol { margin: 0; padding: 0; }
  `;
  document.head.appendChild(style);
}

const TOGGLE_HEIGHT = 52;

const VIEWS = [
  { id: 'invoice-m-one', label: 'Invoice', sublabel: 'm-one', group: 'm-one' },
  { id: 'm-next-foundation', label: 'Foundation', sublabel: 'm-next', group: 'm-next' },
];

const GROUP_COLORS = {
  'm-one': { accent: '#8A1F1F', activeBg: '#FFF5F5', inactiveBadge: '#F2DADA' },
  'm-next': { accent: '#137E58', activeBg: '#ECFDF5', inactiveBadge: '#D1FAE5' },
};

const ToggleHeader = ({ mode, onChange, inspectOn, setInspectOn, showInspect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentView = VIEWS.find((v) => v.id === mode) || VIEWS[0];
  const currentGroup = GROUP_COLORS[currentView.group] || GROUP_COLORS['m-next'];

  // Close dropdown on outside click or Escape.
  useEffect(() => {
    if (!dropdownOpen) return undefined;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [dropdownOpen]);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: TOGGLE_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: '#0F1B31',
        borderBottom: '1px solid #1F2D44',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        color: '#E5E7EB',
      }}
    >
      {/* Left: "View" label + view dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#9CA3AF',
          }}
        >
          View
        </span>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            style={{
              appearance: 'none',
              border: '1px solid #2A3E58',
              background: '#1A2840',
              padding: '6px 10px 6px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 600,
              color: '#F3F4F6',
              letterSpacing: 0.1,
              lineHeight: 1.1,
              minWidth: 200,
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span>{currentView.label}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  padding: '2px 6px',
                  borderRadius: 999,
                  background: currentGroup.accent,
                  color: '#FFF',
                }}
              >
                {currentView.sublabel}
              </span>
            </span>
            <span aria-hidden style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
          </button>

          {dropdownOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                minWidth: '100%',
                background: '#1A2840',
                border: '1px solid #2A3E58',
                borderRadius: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                padding: 4,
                zIndex: 1001,
              }}
            >
              {VIEWS.map((view) => {
                const isActive = mode === view.id;
                const grp = GROUP_COLORS[view.group] || GROUP_COLORS['m-next'];
                return (
                  <button
                    key={view.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onChange(view.id);
                      setDropdownOpen(false);
                    }}
                    style={{
                      appearance: 'none',
                      width: '100%',
                      border: 'none',
                      background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                      padding: '8px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'inherit',
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#FFF' : '#D1D5DB',
                      letterSpacing: 0.1,
                      lineHeight: 1.2,
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ flex: 1 }}>{view.label}</span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.6,
                        padding: '2px 6px',
                        borderRadius: 999,
                        background: grp.accent,
                        color: '#FFF',
                      }}
                    >
                      {view.sublabel}
                    </span>
                    {isActive && (
                      <span aria-hidden style={{ color: '#FFF', fontSize: 12 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Inspect toggle — dev/audit tool, far-right of the View chrome. */}
      {showInspect && (
        <button
          type="button"
          onClick={() => setInspectOn((v) => !v)}
          aria-label={`Inspect mode ${inspectOn ? 'on' : 'off'}`}
          aria-pressed={inspectOn}
          style={{
            appearance: 'none',
            border: '1.5px solid',
            borderColor: inspectOn ? '#F59E0B' : '#2A3E58',
            background: inspectOn ? '#F59E0B' : 'transparent',
            color: inspectOn ? '#0F1B31' : '#E5E7EB',
            padding: '6px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            letterSpacing: 0.1,
            lineHeight: 1.1,
          }}
        >
          🔍 Inspect: {inspectOn ? 'ON' : 'OFF'}
        </button>
      )}
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#C00',
            background: '#FFF5F5',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Render error</h2>
          <strong>{String(this.state.error?.message || this.state.error)}</strong>
          {'\n\n'}
          <span style={{ color: '#888' }}>Stack:</span>
          {'\n'}
          {String(this.state.error?.stack || '').slice(0, 2000)}
          {'\n\n'}
          <span style={{ color: '#888' }}>Component stack:</span>
          {String(this.state.info?.componentStack || '').slice(0, 1500)}
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [mode, setMode] = useState('m-next-foundation');
  const [inspectOn, setInspectOn] = useState(false);
  return (
    <ReduxProvider store={kitStore}>
      <div>
        <ToggleHeader
          mode={mode}
          onChange={setMode}
          inspectOn={inspectOn}
          setInspectOn={setInspectOn}
          showInspect={mode === 'm-next-foundation'}
        />
        <ErrorBoundary key={mode}>
          {mode === 'invoice-m-one' && <AppInvoiceMOne />}
          {mode === 'm-next-foundation' && (
            <AppMNext inspectOn={inspectOn} setInspectOn={setInspectOn} />
          )}
        </ErrorBoundary>
      </div>
    </ReduxProvider>
  );
};

export default App;
