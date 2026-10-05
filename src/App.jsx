import React, { useEffect, useState } from 'react';
import {
  AlignLeft, ArrowDownToLine, ArrowLeft, ArrowRight, BookOpenText, Check,
  ChevronDown, Clapperboard, Clock3, Command, Copy, Hash, Home, Image, LayoutGrid,
  Lightbulb, Menu, MoreHorizontal, Sparkles, Type, WandSparkles, X,
} from 'lucide-react';
import { tools } from './generators.js';

const icons = { Clapperboard, Image, Type, AlignLeft, Hash, BookOpenText };
const initialForm = (tool) => Object.fromEntries(tool.fields.map((field) => [field.name, field.options?.[0] ?? '']));
const RECENT_STORAGE_KEY = 'creator-studio-recent';

function loadRecent() {
  try {
    const saved = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!saved) return [];

    const entries = JSON.parse(saved);
    if (!Array.isArray(entries)) throw new TypeError('Saved recent creations must be a list.');

    return entries.flatMap((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        console.error('Skipping an invalid saved recent creation.', entry);
        return [];
      }
      const tool = tools.find((item) => item.id === entry.toolId);
      if (!tool || typeof entry.id !== 'string' || typeof entry.label !== 'string'
        || !entry.form || typeof entry.form !== 'object' || Array.isArray(entry.form)
        || !(typeof entry.output === 'string' || (Array.isArray(entry.output) && entry.output.every((item) => typeof item === 'string')))) {
        console.error('Skipping an invalid saved recent creation.', entry);
        return [];
      }
      return [{ id: entry.id, tool, output: entry.output, form: entry.form, label: entry.label }];
    }).slice(0, 4);
  } catch (error) {
    console.error('Unable to load recent creations from localStorage.', error);
    return [];
  }
}

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState(loadRecent);
  const [copied, setCopied] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    try {
      const entries = recent.map(({ id, tool, output, form: savedForm, label }) => ({
        id, toolId: tool.id, output, form: savedForm, label,
      }));
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Unable to save recent creations to localStorage.', error);
    }
  }, [recent]);

  const openTool = (tool) => {
    setActiveTool(tool);
    setForm(initialForm(tool));
    setResult(null);
    setCopied(false);
    setMobileMenu(false);
  };

  const generate = (event) => {
    event.preventDefault();
    const output = activeTool.generate(form);
    setResult(output);
    const entry = { id: `${Date.now()}`, tool: activeTool, output, form: { ...form }, label: form.topic || form.subject || form.title || form.idea };
    setRecent((items) => [entry, ...items].slice(0, 4));
  };

  const showHome = () => {
    setActiveTool(null);
    setMobileMenu(false);
  };

  const copyResult = async (value = result) => {
    try {
      await navigator.clipboard.writeText(Array.isArray(value) ? value.join('\n') : value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const Icon = activeTool ? icons[activeTool.icon] : LayoutGrid;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <a className="brand" href="#home" onClick={() => setActiveTool(null)} aria-label="Creator Studio home">
            <span className="brand-mark"><WandSparkles size={18} strokeWidth={2.2} /></span>
            <span>creator<span className="brand-light">studio</span></span>
          </a>
          <button className="icon-button sidebar-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <button className={`home-link ${!activeTool ? 'selected' : ''}`} onClick={showHome}>
          <LayoutGrid size={17} /><span>Overview</span><span className="home-shortcut"><Command size={11} /> 1</span>
        </button>

        <div className="sidebar-label">YOUR TOOLKIT <span>06</span></div>
        <nav className="tool-nav" aria-label="Creator tools">
          {tools.map((tool) => {
            const ToolIcon = icons[tool.icon];
            return <button key={tool.id} className={`nav-item ${activeTool?.id === tool.id ? 'nav-active' : ''}`} onClick={() => openTool(tool)}>
              <ToolIcon size={17} strokeWidth={1.8} /><span>{tool.name}</span><ArrowRight className="nav-arrow" size={14} />
            </button>;
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="plan-card"><div className="plan-icon"><Sparkles size={15} /></div><div><strong>Your creative space</strong><span>Made for the next idea.</span></div><ArrowRight size={14} /></div>
          <button className="profile-row"><span className="avatar">C</span><span className="profile-copy"><strong>Creator</strong><small>Personal workspace</small></span><ChevronDown size={15} /></button>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-backdrop" onClick={() => setMobileMenu(false)} aria-label="Close menu" />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={19} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeTool?.name ?? 'Overview'}</strong></div>
          <div className="topbar-right"><div className="status-chip"><span />All systems ready</div><button className="help-button" onClick={() => openTool(tools[0])}><Lightbulb size={15} /> Get inspired</button></div>
        </header>

        <div className="page-content">
          {activeTool ? <>
            <div className="tool-heading">
              <button className="back-link" onClick={() => setActiveTool(null)}><ArrowLeft size={15} /> All tools</button>
              <div className="heading-row"><div><div className="eyebrow"><span className={`tool-glyph ${activeTool.tint}`}><Icon size={16} /></span> CREATOR TOOL <span className="eyebrow-dot">·</span> {activeTool.time.toUpperCase()}</div><h1>{activeTool.title}</h1><p>{activeTool.description}</p></div></div>
            </div>
            <section className="generator-layout">
              <form className="form-panel" onSubmit={generate}>
                <div className="panel-title"><div><span className="section-kicker">YOUR INPUT</span><h2>Set the direction</h2></div><span className="step-badge">01</span></div>
                <div className="form-fields">{activeTool.fields.map((field) => <label className="field" key={field.name}>
                  <span>{field.label}{field.required && <i>Required</i>}</span>
                  {field.type === 'select' ? <div className="select-wrap"><select value={form[field.name]} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}>{field.options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></div>
                    : field.type === 'textarea' ? <textarea required={field.required} value={form[field.name]} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} placeholder={field.placeholder} rows="3" />
                      : <input required={field.required} value={form[field.name]} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} placeholder={field.placeholder} />}
                </label>)}</div>
                <div className="form-footer"><span><Sparkles size={14} />Thoughtfully crafted, every time</span><button className="generate-button" type="submit"><WandSparkles size={16} />Generate <ArrowRight size={15} /></button></div>
              </form>

              <section className={`result-panel ${result ? 'result-ready' : ''}`} aria-live="polite">
                <div className="panel-title"><div><span className="section-kicker">YOUR CREATION</span><h2>{result ? 'Made for you' : 'Your result lives here'}</h2></div><span className="step-badge">02</span></div>
                {result ? <>
                  <div className="result-meta"><span className="result-indicator"><span /> READY TO USE</span><button className="copy-button" onClick={() => copyResult()}><Copy size={14} />{copied ? 'Copied!' : 'Copy'}</button></div>
                  <div className={`result-content ${Array.isArray(result) ? 'result-list' : ''}`}>{Array.isArray(result) ? result.map((item, index) => <div className="result-option" key={item}><span className="option-number">{String(index + 1).padStart(2, '0')}</span><p>{item}</p><button className="icon-button option-copy" aria-label={`Copy option ${index + 1}`} onClick={() => copyResult(item)}><Copy size={14} /></button></div>) : <p>{result}</p>}</div>
                  <div className="result-footer"><span><Check size={14} /> Your next idea, a little closer.</span><button onClick={generate}><WandSparkles size={14} />Try another</button></div>
                </> : <div className="empty-result"><span className="empty-orbit orbit-one" /><span className="empty-orbit orbit-two" /><span className="empty-mark"><Icon size={22} /></span><h3>A fresh start</h3><p>Fill in a few details and your first draft will appear here.</p><span className="empty-hint"><ArrowLeft size={13} /> Start with your idea</span></div>}
              </section>
            </section>
            <div className="privacy-note"><span className="privacy-dot" /> Your ideas stay in this browser. Nothing is saved to a server.</div>
          </> : <>
            <section className="welcome-band">
              <div className="welcome-copy"><div className="date-label"><span className="date-dot" /> YOUR CREATIVE WORKSPACE</div><h1>Good ideas deserve<br />a <span>great beginning.</span></h1><p>All the little tools that help you make something wonderful.</p><div className="welcome-note"><Sparkles size={15} /><span>Six ways to take an idea further</span></div></div>
              <div className="welcome-image"><div className="image-tag"><span className="image-tag-dot" /> STUDIO NOTES <span className="tag-divider">·</span> 001</div><span className="image-caption">Make room for the idea.</span></div>
              <div className="welcome-index">01 <span>/</span> 06</div>
            </section>

            <section className="tools-section">
              <div className="section-heading"><div><div className="section-kicker">A LITTLE CREATIVE MOMENTUM</div><h2>What are we making today?</h2></div><div className="tool-count">01 — 06 <span>TOOLS</span></div></div>
              <div className="tool-grid">{tools.map((tool, index) => {
                const ToolIcon = icons[tool.icon];
                return <button className="tool-card" key={tool.id} onClick={() => openTool(tool)} style={{ '--card-index': index }}>
                  <div className="card-top"><span className={`tool-glyph ${tool.tint}`}><ToolIcon size={17} strokeWidth={1.8} /></span><span className="card-time"><Clock3 size={12} />{tool.time}</span></div>
                  <div className="card-copy"><h3>{tool.name}</h3><p>{tool.shortDescription}</p></div>
                  <div className="card-bottom"><span>OPEN TOOL</span><span className="card-arrow"><ArrowRight size={15} /></span></div>
                </button>;
              })}</div>
            </section>

            <section className="bottom-row">
              <div className="recent-section"><div className="recent-heading"><div><div className="section-kicker">PICK UP WHERE YOU LEFT OFF</div><h2>Recent creations</h2></div><span className="recent-count">{String(recent.length).padStart(2, '0')}</span></div>
                {recent.length ? <div className="recent-list">{recent.map((item) => { const RecentIcon = icons[item.tool.icon]; return <button key={item.id} className="recent-item" onClick={() => { setActiveTool(item.tool); setResult(item.output); setForm(item.form); }}><span className={`recent-glyph ${item.tool.tint}`}><RecentIcon size={15} /></span><span className="recent-copy"><strong>{item.label}</strong><small>{item.tool.name}</small></span><span className="recent-time">Just now</span><ArrowRight size={15} /></button>; })}</div> : <div className="recent-empty"><span className="recent-empty-icon"><Clock3 size={17} /></span><span><strong>A little space for your latest ideas.</strong><small>Your recent creations will show up here.</small></span></div>}
              </div>
              <aside className="studio-note"><div className="note-topline"><span>FIELD NOTE <b>NO. 01</b></span><ArrowDownToLine size={15} /></div><div className="note-quote-mark">“</div><p>Start with the feeling you want someone to leave with. The words come easier after.</p><div className="note-author"><span /> A small note from the studio</div></aside>
            </section>
          </>}

          <footer className="page-footer"><span>MADE FOR THE MAKING.</span><span>CREATOR STUDIO <span className="footer-separator">·</span> 2025</span></footer>
        </div>
      </main>

      <nav className="mobile-bottom-nav" aria-label="Main navigation">
        <button className={!activeTool ? 'mobile-nav-active' : ''} aria-current={!activeTool ? 'page' : undefined} onClick={showHome}>
          <Home size={19} /><span>Home</span>
        </button>
        {tools.slice(0, 3).map((tool) => {
          const ToolIcon = icons[tool.icon];
          const selected = activeTool?.id === tool.id;
          return <button key={tool.id} className={selected ? 'mobile-nav-active' : ''} aria-current={selected ? 'page' : undefined} onClick={() => openTool(tool)}>
            <ToolIcon size={19} /><span>{tool.id === 'video' ? 'Video' : tool.id === 'image' ? 'Image' : 'Titles'}</span>
          </button>;
        })}
        <button className={mobileMenu || (activeTool && !tools.slice(0, 3).some((tool) => tool.id === activeTool.id)) ? 'mobile-nav-active' : ''} aria-expanded={mobileMenu} onClick={() => setMobileMenu((open) => !open)}>
          <MoreHorizontal size={20} /><span>More</span>
        </button>
      </nav>
    </div>
  );
}

export default App;