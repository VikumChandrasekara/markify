'use client';

import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import Image from 'next/image';

export default function MarkdownGenerator() {
  const [source, setSource] = useState('# Welcome to Markify.\n\nStart writing markdown...');
  const [filename, setFilename] = useState('post.md');
  const [wordCount, setWordCount] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  marked.setOptions({ gfm: true, breaks: true });

  useEffect(() => {
    const renderMarkdown = async () => {
      if (previewRef.current) {
        const html = await Promise.resolve(marked.parse(source));
        previewRef.current.innerHTML = html;
        setWordCount(source.trim() ? source.trim().split(/\s+/).length : 0);
      }
    };
    renderMarkdown();
  }, [source]);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      alert('Copied to clipboard!');
    } catch {
      alert('Failed to copy.');
    }
  };

  const handleClear = () => {
    if (confirm('Clear editor?')) setSource('');
  };

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
    <div className="min-h-screen bg-[#0f1724] text-[#e6eef8] font-[Inter,Segoe UI,Arial]">
      <div className="flex flex-col lg:flex-row gap-4 p-4 min-h-screen box-border">
        {/* Left Panel */}
        <div className="bg-[#0b1220] rounded-lg p-3 flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
            <div>
              <Image
                src="/images/logo.png"
                alt="Next.js Logo"
                width={100}
                height={0}
                className="h-auto"
              />
              <div className="text-sm text-[#9aa6b2]">
                Type or use the toolbar to insert snippets
              </div>
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="text"
                placeholder="post.md"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="px-2 py-1 rounded-md border border-white/10 bg-transparent text-inherit text-sm outline-none"
              />
              <button
                onClick={handleDownload}
                className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-md transition"
              >
                Download .md
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm shadow-md transition"
              >
                Copy
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm shadow-md transition"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {['h1', 'h2', 'bold', 'italic', 'code', 'ul', 'link', 'img', 'frontmatter'].map((act) => (
              <button
                key={act}
                onClick={() => insertSnippet(act)}
                className="px-2 py-1 bg-[#1a2338] hover:bg-[#22304a] rounded-md text-sm transition border border-white/5"
              >
                {act.toUpperCase()}
              </button>
            ))}
            <button
              onClick={handleTemplate}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm shadow-md transition"
            >
              Use Template
            </button>
          </div>

          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            rows={12}
            className="flex-1 bg-transparent border border-white/10 text-inherit p-3 rounded-md font-mono resize-none min-h-[200px] focus:ring-1 focus:ring-blue-600 outline-none"
          />

          <div className="mt-3 text-sm text-[#9aa6b2]">
            Live preview updates as you type. Use Ctrl+S (Cmd+S on Mac) to download. 
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-[#0b1220] rounded-lg p-3 flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <div>
              <strong>Preview</strong>
              <div className="text-sm text-[#9aa6b2]">
                GitHub-flavored Markdown
              </div>
            </div>
            <div className="text-sm text-[#9aa6b2]">{wordCount} words</div>
          </div>

          <div
            ref={previewRef}
            className="overflow-auto p-5 rounded-md bg-[#071022] flex-1 text-[#e6eef8] leading-relaxed markdown-preview prose prose-invert max-w-none"
          />
        <a
          href="https://www.linkedin.com/in/vikumch/"
          target="_blank"
          className="fixed bottom-4 right-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-md transition px-4 py-2"
        >
          Meet the Developer
        </a>
        </div>
      </div>
    </div>
  );
}
