/* ==========================================================================
   COMMAND PALETTE (CTRL+K) & TERMINAL CLI EMULATOR
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. Command Palette Modal Logic ---
  const cmdModal = document.getElementById('cmd-palette-modal');
  const cmdTriggerBtns = document.querySelectorAll('.trigger-cmd-palette');
  const cmdInput = document.getElementById('cmd-search-input');
  const cmdItemsList = document.getElementById('cmd-items-list');

  const paletteItems = [
    { title: 'Home & Hero', desc: 'Jump to top intro & telemetry', icon: '🏠', action: () => scrollToSection('#hero') },
    { title: 'About & Principles', desc: 'Engineering background and philosophy', icon: '👤', action: () => scrollToSection('#about') },
    { title: 'Tech Stack & Skills', desc: 'Explore languages, databases & cloud stack', icon: '⚡', action: () => scrollToSection('#skills') },
    { title: 'Featured Projects', desc: 'View high-scale system designs & live demos', icon: '🚀', action: () => scrollToSection('#projects') },
    { title: 'System Architecture Lab', desc: 'Interactive latency & concurrency playground', icon: '🧪', action: () => scrollToSection('#playground') },
    { title: 'Career Experience', desc: 'Past roles, impact metrics and track record', icon: '💼', action: () => scrollToSection('#experience') },
    { title: 'Contact & Hire', desc: 'Send a message or schedule a call', icon: '📬', action: () => scrollToSection('#contact') },
    { title: 'Open Terminal CLI', desc: 'Launch interactive terminal developer shell', icon: '💻', action: () => openTerminalModal() },
    { title: 'Toggle Theme', desc: 'Switch between Dark and Light mode', icon: '🌓', action: () => window.toggleTheme && window.toggleTheme() },
    { title: 'Copy Direct Email', desc: 'Copy engineer email to clipboard', icon: '📋', action: () => window.copyDirectEmail && window.copyDirectEmail() }
  ];

  function openCmdPalette() {
    if (!cmdModal) return;
    cmdModal.classList.add('active');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
      renderPaletteItems(paletteItems);
    }
  }

  function closeCmdPalette() {
    if (!cmdModal) return;
    cmdModal.classList.remove('active');
  }

  function renderPaletteItems(items) {
    if (!cmdItemsList) return;
    if (items.length === 0) {
      cmdItemsList.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">No matching commands found.</div>';
      return;
    }

    cmdItemsList.innerHTML = items.map((item, idx) => `
      <div class="cmd-row-item ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
        <div class="cmd-row-left">
          <span>${item.icon}</span>
          <div>
            <div style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${item.title}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">${item.desc}</div>
          </div>
        </div>
        <span class="cmd-kbd">↵</span>
      </div>
    `).join('');

    // Attach click handlers
    const rows = cmdItemsList.querySelectorAll('.cmd-row-item');
    rows.forEach((row, idx) => {
      row.addEventListener('click', () => {
        closeCmdPalette();
        items[idx].action();
      });
    });
  }

  function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cmdTriggerBtns.forEach((btn) => btn.addEventListener('click', openCmdPalette));

  // Global Ctrl+K / Cmd+K listener
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (cmdModal && cmdModal.classList.contains('active')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
    if (e.key === 'Escape') {
      closeCmdPalette();
      closeTerminalModal();
      if (window.closeProjectModal) window.closeProjectModal();
      if (window.closeCVModal) window.closeCVModal();
    }
  });

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = paletteItems.filter(item => 
        item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
      );
      renderPaletteItems(filtered);
    });

    cmdInput.addEventListener('keydown', (e) => {
      const rows = cmdItemsList.querySelectorAll('.cmd-row-item');
      let selectedIdx = Array.from(rows).findIndex(r => r.classList.contains('selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (rows.length > 0) {
          if (selectedIdx >= 0) rows[selectedIdx].classList.remove('selected');
          selectedIdx = (selectedIdx + 1) % rows.length;
          rows[selectedIdx].classList.add('selected');
          rows[selectedIdx].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (rows.length > 0) {
          if (selectedIdx >= 0) rows[selectedIdx].classList.remove('selected');
          selectedIdx = (selectedIdx - 1 + rows.length) % rows.length;
          rows[selectedIdx].classList.add('selected');
          rows[selectedIdx].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIdx >= 0 && rows[selectedIdx]) {
          rows[selectedIdx].click();
        }
      }
    });
  }


  // --- 2. Interactive Terminal Emulator Modal ---
  const terminalModal = document.getElementById('terminal-modal');
  const termBody = document.getElementById('terminal-screen-body');
  const termInput = document.getElementById('terminal-cmd-input');
  const termTriggerBtns = document.querySelectorAll('.trigger-terminal');

  function openTerminalModal() {
    if (!terminalModal) return;
    terminalModal.classList.add('active');
    if (termInput) {
      termInput.focus();
    }
  }

  function closeTerminalModal() {
    if (!terminalModal) return;
    terminalModal.classList.remove('active');
  }

  termTriggerBtns.forEach((btn) => btn.addEventListener('click', openTerminalModal));

  if (terminalModal) {
    terminalModal.addEventListener('click', (e) => {
      if (e.target === terminalModal) closeTerminalModal();
    });
  }

  const termCommands = {
    help: () => `
<div class="terminal-line"><span class="term-cyan">Available Commands:</span></div>
<div class="terminal-line">  <span class="term-green">skills</span>      - List all core technologies & proficiency</div>
<div class="terminal-line">  <span class="term-green">projects</span>    - Display flagship distributed systems & apps</div>
<div class="terminal-line">  <span class="term-green">resume</span>      - View resume summary & key career highlights</div>
<div class="terminal-line">  <span class="term-green">bench</span>       - Run simulated multi-threaded latency benchmark</div>
<div class="terminal-line">  <span class="term-green">uptime</span>      - Check system availability and server telemetry</div>
<div class="terminal-line">  <span class="term-green">contact</span>     - Output direct email, GitHub & LinkedIn links</div>
<div class="terminal-line">  <span class="term-green">theme</span>       - Toggle UI dark / light color scheme</div>
<div class="terminal-line">  <span class="term-green">clear</span>       - Clear the terminal console output</div>
<div class="terminal-line">  <span class="term-green">matrix</span>      - Initialize cyber matrix animation</div>
<div class="terminal-line">  <span class="term-green">exit</span>        - Close the terminal window</div>
`,
    skills: () => `
<div class="terminal-line"><span class="term-purple">Core Architecture & Tech Stack:</span></div>
<div class="terminal-line">  • <span class="term-cyan">Languages:</span> TypeScript, Go, Rust, Python, SQL</div>
<div class="terminal-line">  • <span class="term-cyan">Frontend:</span> React, Next.js, WebGL/Three.js, Vanilla CSS Glassmorphism</div>
<div class="terminal-line">  • <span class="term-cyan">Backend:</span> Node.js/Fastify, Go/gRPC, Kafka, Redis, PostgreSQL</div>
<div class="terminal-line">  • <span class="term-cyan">Cloud & Infra:</span> Kubernetes, Docker, AWS (EKS, RDS, S3), Terraform, CI/CD</div>
`,
    projects: () => `
<div class="terminal-line"><span class="term-purple">Flagship Engineering Projects:</span></div>
<div class="terminal-line">  [1] <span class="term-green">Apex Cloud</span>      - Autonomous Cloud Observability & Microservices Tracing</div>
<div class="terminal-line">  [2] <span class="term-green">NeuralFlow</span>      - Real-Time Node-Based AI Workflow & Canvas Engine</div>
<div class="terminal-line">  [3] <span class="term-green">PulsePay</span>        - Ultra-low Latency Global Financial Settlement (78µs)</div>
<div class="terminal-line">  [4] <span class="term-green">Hyperion 3D</span>     - Web-Based Collaborative WebGL 3D Scene Pipeline</div>
<div class="terminal-line"><span class="term-cyan">Tip: Scroll down to the Projects section to explore interactive browser previews!</span></div>
`,
    resume: () => `
<div class="terminal-line"><span class="term-purple">Resume Summary:</span></div>
<div class="terminal-line">  Name: Satya Ram</div>
<div class="terminal-line">  Role: Computer Science Engineer & AI/ML Specialist</div>
<div class="terminal-line">  Focus: Neural Networks, Computer Vision, Data Modeling & Distributed Systems</div>
<div class="terminal-line">  GitHub: github.com/Satyaram12</div>
`,
    uptime: () => `
<div class="terminal-line">System uptime: <span class="term-green">99.998%</span> | Active nodes: <span class="term-cyan">48/48 Healthy</span> | P99 Latency: <span class="term-green">14.2ms</span></div>
`,
    bench: () => `
<div class="terminal-line"><span class="term-cyan">[BENCHMARK STARTING]</span> Running 10,000 concurrent simulated requests...</div>
<div class="terminal-line">Progress: [████████████████████] 100%</div>
<div class="terminal-line">Results: <span class="term-green">10,000 OK (0 errors)</span> | Avg Latency: <span class="term-green">1.8ms</span> | Throughput: <span class="term-purple">54,200 req/sec</span></div>
`,
    contact: () => `
<div class="terminal-line"><span class="term-purple">Contact Details:</span></div>
<div class="terminal-line">  Email: <span class="term-green">s09084268@gmail.com</span></div>
<div class="terminal-line">  GitHub: <span class="term-cyan">github.com/Satyaram12</span></div>
<div class="terminal-line">  LinkedIn: <span class="term-cyan">linkedin.com/in/satya-ram</span></div>
`,
    theme: () => {
      if (window.toggleTheme) window.toggleTheme();
      return `<div class="terminal-line"><span class="term-green">UI Theme toggled successfully.</span></div>`;
    },
    clear: () => {
      if (termBody) termBody.innerHTML = '';
      return '';
    },
    matrix: () => `
<div class="terminal-line"><span class="term-green">01010011 01100001 01110100 01111001 01100001 00100000 01010010 01100001 01101101</span></div>
<div class="terminal-line"><span class="term-green">SATYA RAM // AI & MACHINE LEARNING SPECIALIST</span></div>
`,
    exit: () => {
      closeTerminalModal();
      return `<div class="terminal-line">Session closed.</div>`;
    }
  };

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = termInput.value.trim();
        const cmd = raw.toLowerCase();
        termInput.value = '';

        if (!raw) return;

        // Echo prompt
        const echoLine = document.createElement('div');
        echoLine.className = 'terminal-line';
        echoLine.innerHTML = `<span class="term-prompt">satya@portfolio:~$</span> <span>${raw}</span>`;
        termBody.appendChild(echoLine);

        // Run command
        if (termCommands[cmd]) {
          const res = termCommands[cmd]();
          if (res) {
            const outDiv = document.createElement('div');
            outDiv.innerHTML = res;
            termBody.appendChild(outDiv);
          }
        } else {
          const errLine = document.createElement('div');
          errLine.className = 'terminal-line';
          errLine.innerHTML = `<span style="color: var(--accent-rose);">Command not found: "${raw}". Type <span class="term-green">help</span> for a list of available commands.</span>`;
          termBody.appendChild(errLine);
        }

        termBody.scrollTop = termBody.scrollHeight;
      }
    });
  }

  // Export functions globally
  window.openCmdPalette = openCmdPalette;
  window.closeCmdPalette = closeCmdPalette;
  window.openTerminalModal = openTerminalModal;
  window.closeTerminalModal = closeTerminalModal;
})();
