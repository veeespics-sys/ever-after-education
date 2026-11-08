import React, { useState, useEffect } from 'react';
import { 
  Printer, Download, FileText, CheckCircle2, AlertTriangle, 
  BookOpen, Sparkles, HelpCircle, ArrowLeft 
} from 'lucide-react';

export function PrintableResourceHub({ grade = 'Grade 8', token, onBack }) {
  const [activeSubTab, setActiveSubTab] = useState('worksheet'); // 'worksheet' | 'memo' | 'formula'
  const [resourceData, setResourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResources(grade);
  }, [grade]);

  const fetchResources = async (g) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/lessons/resources/${encodeURIComponent(g)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load printable resources');
      const data = await res.json();
      setResourceData(data.resources);
    } catch (err) {
      console.error('Printable resource error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = (type) => {
    if (!resourceData) return;

    let contentHtml = '';
    let docTitle = '';

    if (type === 'worksheet') {
      docTitle = `${grade}_Math_Practice_Worksheet`;
      contentHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${resourceData.worksheet.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1c1917; padding: 2rem; max-width: 800px; margin: auto; }
            h1 { color: #6B3E21; border-bottom: 2px solid #B87D4B; padding-bottom: 0.5rem; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 1rem; }
            .problem-box { border: 1px solid #d6d3d1; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; page-break-inside: avoid; }
            .badge { background: #F6ECE2; color: #6B3E21; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
            .working-space { height: 140px; border: 1px dashed #d6d3d1; margin-top: 1rem; border-radius: 6px; background: #fafaf9; }
            .formula-box { background: #fafaf9; border-left: 4px solid #B87D4B; padding: 1rem; margin-bottom: 2rem; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>${resourceData.worksheet.title}</h1>
          <div class="header-info">
            <div>
              <strong>Learner Name:</strong> ___________________________<br>
              <strong>Date:</strong> ___________________________
            </div>
            <div>
              <strong>Grade:</strong> ${grade}<br>
              <strong>Curriculum:</strong> DBE CAPS Verified
            </div>
          </div>
          ${resourceData.worksheet.problems.map(p => `
            <div class="problem-box">
              <div style="display: flex; justify-content: space-between;">
                <h3>Question ${p.index}: ${p.title}</h3>
                <span class="badge">${p.subtopic}</span>
              </div>
              <p><strong>Problem:</strong> ${p.question}</p>
              ${p.latex ? `<div style="font-family: monospace; font-size: 1.2rem; background: #eee; padding: 0.5rem; display: inline-block;">${p.latex}</div>` : ''}
              <div style="margin-top: 1rem;">
                <strong>Steps to Show:</strong>
                <ol>
                  ${p.steps.map(s => `<li>${s}</li>`).join('')}
                </ol>
              </div>
              <div class="working-space"><span style="color: #999; font-size: 0.8rem; margin: 8px; display: block;">Show step-by-step working here...</span></div>
            </div>
          `).join('')}
        </body>
        </html>
      `;
    } else if (type === 'memo') {
      docTitle = `${grade}_Math_Teacher_Memo`;
      contentHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${resourceData.memo.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1c1917; padding: 2rem; max-width: 800px; margin: auto; }
            h1 { color: #234938; border-bottom: 2px solid #234938; padding-bottom: 0.5rem; }
            .memo-box { border: 1px solid #d6d3d1; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; background: #fdfcfb; }
            .trap-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 0.75rem; margin-top: 0.5rem; font-size: 0.9rem; }
            .solution-step { font-family: monospace; font-size: 1rem; color: #234938; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${resourceData.memo.title}</h1>
          <p><em>${resourceData.memo.subtitle}</em> • CAPS Reference Key</p>
          ${resourceData.memo.problems.map(p => `
            <div class="memo-box">
              <h3>Question ${p.index}: ${p.title}</h3>
              <p><strong>Original Problem:</strong> ${p.question}</p>
              <h4>Full Worked Solution:</h4>
              <ul>
                ${p.solution.map(s => `<li class="solution-step">${s}</li>`).join('')}
              </ul>
              <h4>Step-by-Step Misconception Diagnostics:</h4>
              ${p.stepBreakdown.map(s => `
                <div style="margin-top: 0.5rem;">
                  <strong>Step ${s.stepNumber}: ${s.prompt}</strong><br>
                  <em>Correct Answer:</em> <code>${s.correctOption}</code>
                  ${s.keyMisconceptionTraps.map(t => `
                    <div class="trap-box">
                      <strong>Trap: "${t.distractor}"</strong> — ${t.diagnostic}
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </body>
        </html>
      `;
    } else {
      docTitle = `${grade}_Math_Formula_Sheet`;
      contentHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${resourceData.formulaSheet.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: auto; }
            h1 { color: #6B3E21; border-bottom: 2px solid #B87D4B; }
            .sec { background: #fafaf9; border-left: 4px solid #6B3E21; padding: 1rem; margin-bottom: 1.5rem; }
            ul { margin: 0; padding-left: 1.5rem; }
          </style>
        </head>
        <body>
          <h1>${resourceData.formulaSheet.title}</h1>
          ${resourceData.formulaSheet.sections.map(s => `
            <div class="sec">
              <h3>${s.heading}</h3>
              <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </body>
        </html>
      `;
    }

    const blob = new Blob([contentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="printable-hub" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
      {/* Header with Sub-tabs and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--color-primary-900)', margin: 0 }}>
            {grade} Printable Resource Hub &amp; Memos
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            Clean, offline-ready student worksheets, parent/teacher marking memos, and key formula summaries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePrint}
            title="Print the active view using your browser's print dialog"
          >
            <Printer size={15} />
            <span>Print View</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleDownloadHtml(activeSubTab)}
            title="Download full self-contained HTML file for offline study"
          >
            <Download size={15} />
            <span>Download Offline HTML</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-surface-alt)', padding: '0.25rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        <button
          className={`btn btn-sm ${activeSubTab === 'worksheet' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveSubTab('worksheet')}
          style={{ fontSize: '0.8rem' }}
        >
          <FileText size={14} />
          <span>Student Practice Worksheet</span>
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'memo' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveSubTab('memo')}
          style={{ fontSize: '0.8rem' }}
        >
          <CheckCircle2 size={14} />
          <span>Parent / Teacher Memo</span>
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'formula' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveSubTab('formula')}
          style={{ fontSize: '0.8rem' }}
        >
          <BookOpen size={14} />
          <span>Formula Sheet &amp; Rules</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Preparing printable document formatting...
        </div>
      ) : error ? (
        <div className="notice-box notice-warning">
          <AlertTriangle size={18} />
          <span>Error loading document: {error}</span>
        </div>
      ) : !resourceData ? null : (
        <div className="printable-preview-area">
          {/* View 1: Student Practice Worksheet */}
          {activeSubTab === 'worksheet' && (
            <div>
              <div style={{ background: '#FAF8F5', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-900)', margin: 0 }}>
                      {resourceData.worksheet.title}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {resourceData.worksheet.subtitle}
                    </span>
                  </div>
                  <span className="verification-badge">DBE CAPS Aligned</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
                  <span>Learner: _______________________</span>
                  <span>Date: {resourceData.worksheet.date}</span>
                  <span>Grade: {grade}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {resourceData.worksheet.problems.map(p => (
                    <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-900)', fontSize: '1.05rem' }}>
                          Question {p.index}: {p.title}
                        </span>
                        <span className="pill-badge" style={{ fontSize: '0.75rem' }}>
                          {p.subtopic}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                        {p.question}
                      </p>
                      {p.latex && (
                        <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', background: 'var(--bg-surface-alt)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', marginBottom: '1rem', color: 'var(--color-bronze-dark)', fontWeight: 600 }}>
                          {p.latex}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <strong>Required Solving Steps:</strong>
                        <ol style={{ margin: '0.35rem 0 0 1.25rem', padding: 0 }}>
                          {p.steps.map((st, sidx) => (
                            <li key={sidx} style={{ marginBottom: '0.25rem' }}>{st}</li>
                          ))}
                        </ol>
                      </div>
                      <div style={{ height: '90px', border: '1px dashed #D1C9BE', borderRadius: 'var(--radius-sm)', background: '#FCFBF9', padding: '0.5rem', color: '#A89F91', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Space for learner's handwritten working &amp; final answer...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View 2: Parent / Teacher Marking Memo */}
          {activeSubTab === 'memo' && (
            <div>
              <div style={{ background: '#F5F9F6', border: '1px solid #C8DDD0', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #C8DDD0', paddingBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-forest-900)', margin: 0 }}>
                      {resourceData.memo.title}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Complete Worked Answers &amp; Misconception Diagnostics
                    </span>
                  </div>
                  <span className="pill-badge" style={{ background: '#D1E7DD', color: '#0F5132' }}>
                    Educator Resource
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {resourceData.memo.problems.map(p => (
                    <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid #D1E0D7', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                      <h4 style={{ color: 'var(--color-forest-900)', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>
                        Question {p.index}: {p.title}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
                        <strong>Question:</strong> {p.question}
                      </p>

                      <div style={{ background: '#F9FBF9', borderLeft: '3px solid var(--color-forest-700)', padding: '0.75rem 1rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-800)', marginBottom: '0.35rem' }}>
                          Official Worked Steps
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--color-forest-900)' }}>
                          {p.solution.map((sol, sidx) => (
                            <li key={sidx} style={{ marginBottom: '0.2rem' }}>{sol}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ fontSize: '0.85rem' }}>
                        <strong>Misconception Traps to Watch For:</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {p.stepBreakdown.flatMap(st => st.keyMisconceptionTraps).map((trap, tidx) => (
                            <div key={tidx} style={{ background: '#FFFDF5', border: '1px solid #F6E0B5', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                              <strong style={{ color: '#B45309' }}>Common Distractor: "{trap.distractor}"</strong>
                              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-main)', fontSize: '0.825rem' }}>
                                <em>Diagnostic:</em> {trap.diagnostic}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View 3: Formula Sheet & Rules */}
          {activeSubTab === 'formula' && (
            <div style={{ background: '#FCFBF9', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-900)', margin: '0 0 1rem' }}>
                {resourceData.formulaSheet.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {resourceData.formulaSheet.sections.map((sec, sidx) => (
                  <div key={sidx} style={{ background: '#FFFFFF', border: '1px solid #EAE5DE', borderLeft: '4px solid var(--color-bronze-metallic)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ color: 'var(--color-primary-900)', margin: '0 0 0.5rem', fontSize: '1.05rem' }}>
                      {sec.heading}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {sec.items.map((item, iidx) => (
                        <li key={iidx} style={{ marginBottom: '0.4rem', lineHeight: 1.4 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
