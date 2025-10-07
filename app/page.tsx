'use client';

import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

export default function MarkdownGenerator() {
  const [source, setSource] = useState('# Hello world\n\nStart writing markdown...');
  const [filename, setFilename] = useState('post.md');
  const [wordCount, setWordCount] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Configure marked for GitHub-flavored markdown
  marked.setOptions({ gfm: true, breaks: true });

  // Live render markdown
useEffect(() => {
  const renderMarkdown = async () => {
    if (previewRef.current) {
      const html = await Promise.resolve(marked.parse(source)); // ensure string
      previewRef.current.innerHTML = html;
      setWordCount(source.trim() ? source.trim().split(/\s+/).length : 0);
    }
  };
  renderMarkdown();
}, [source]);


  // Toolbar insert logic
  const insertSnippet = (action: string) => {
    const snippets: Record<string, string> = {
      h1: '# Heading 1\n\n',
      h2: '## Heading 2\n\n',
      bold: '**bold text**',
      italic: '*italic text*',
      code: '```\ncode\n```',
      ul: '- Item 1\n- Item 2\n- Item 3\n',
      link: '[Link text](https://example.com)',
      img: '![alt text](https://placehold.co/600x200)',
      frontmatter: `---\ntitle: My Post\ndate: ${new Date().toISOString().slice(0, 10)}\n---\n\n`
    };
    setSource((prev) => prev + (snippets[action] || ''));
  };

  // Download file
  const handleDownload = () => {
    const blob = new Blob([source], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || 'post.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  };

  // Copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      alert('Copied to clipboard!');
    } catch {
      alert('Failed to copy.');
    }
  };

  // Clear
  const handleClear = () => {
    if (confirm('Clear editor?')) setSource('');
  };

  // Template
  const handleTemplate = () => {
    const template = `---
title: My Project
date: ${new Date().toISOString().slice(0, 10)}
tags: [demo, markdown]
---

# Project Title

Short description here.

## Features

- Feature A
- Feature B

## Usage

\`\`\`bash
npm install
npm start
\`\`\`
`;
    setSource(template);
  };

  // Ctrl/Cmd + S → download
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [source, filename]);

  return (
    <div style={{
      background: '#0f1724',
      color: '#e6eef8',
      fontFamily: 'Inter, Segoe UI, Arial',
      minHeight: '100vh',
      margin: 0
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        padding: '18px',
        boxSizing: 'border-box',
        minHeight: '100vh'
      }}>
        {/* Left panel */}
        <div style={{
          background: '#0b1220',
          borderRadius: '10px',
          padding: '12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div>
              <strong>Markdown Source</strong>
              <div style={{ fontSize: '0.9rem', color: '#9aa6b2' }}>
                Type or use the toolbar to insert snippets
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="post.md"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                style={{
                  padding: '6px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'transparent',
                  color: 'inherit'
                }}
              />
              <button onClick={handleDownload}>Download .md</button>
              <button onClick={handleCopy}>Copy</button>
              <button onClick={handleClear}>Clear</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {['h1', 'h2', 'bold', 'italic', 'code', 'ul', 'link', 'img', 'frontmatter'].map((act) => (
              <button key={act} onClick={() => insertSnippet(act)}>{act.toUpperCase()}</button>
            ))}
            <button onClick={handleTemplate}>Use Template</button>
          </div>

          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            rows={12}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'inherit',
              padding: '12px',
              borderRadius: '8px',
              fontFamily: 'ui-monospace, monospace',
              resize: 'none',
              minHeight: '200px'
            }}
          />

          <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#9aa6b2' }}>
            Live preview updates as you type.
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          background: '#0b1220',
          borderRadius: '10px',
          padding: '12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div>
              <strong>Preview</strong>
              <div style={{ fontSize: '0.9rem', color: '#9aa6b2' }}>GitHub-flavored Markdown</div>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#9aa6b2' }}>{wordCount} words</div>
          </div>

          <div
            ref={previewRef}
            style={{
              overflow: 'auto',
              padding: '20px',
              borderRadius: '8px',
              background: '#071022',
              flex: 1,
              color: '#e6eef8',
              lineHeight: 1.6,
            }}
            className="markdown-preview"
          />
        </div>
      </div>
    </div>
  );
}
