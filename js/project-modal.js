/* ==========================================================================
   PROJECT MODAL, SKILL FILTERS & SYSTEM ARCHITECTURE PLAYGROUND
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. Project Detail Data & Modal ---
  const projectModal = document.getElementById('project-modal');
  const projectModalImg = document.getElementById('modal-project-img');
  const projectModalTitle = document.getElementById('modal-project-title');
  const projectModalCategory = document.getElementById('modal-project-category');
  const projectModalDesc = document.getElementById('modal-project-desc');
  const projectModalArchitecture = document.getElementById('modal-project-arch');
  const projectModalMetrics = document.getElementById('modal-project-metrics');
  const projectModalTech = document.getElementById('modal-project-tech');
  const projectModalLiveLink = document.getElementById('modal-project-live');
  const projectModalGithubLink = document.getElementById('modal-project-github');

  const projectsData = {
    apex: {
      title: 'Apex Cloud — Autonomous Multi-Cloud Observability',
      category: 'Cloud Infrastructure & Distributed Tracing',
      img: 'assets/images/project-apex.jpg',
      desc: 'An enterprise-grade observability and telemetry platform designed to monitor heterogeneous microservices across AWS, GCP, and Kubernetes clusters in real-time.',
      arch: 'Architected with a Go and Rust distributed telemetry collector that processes OpenTelemetry traces with sub-millisecond overhead. Backed by Apache Kafka for high-throughput stream ingestion and ClickHouse for analytical time-series querying. The UI is built using Next.js, WebGL network topology graphs, and WebSockets for real-time trace streaming.',
      metrics: [
        { label: 'Throughput', val: '450,000 events/sec' },
        { label: 'Ingestion Latency', val: '< 3.2ms' },
        { label: 'Cloud Cost Savings', val: '38% reduction' }
      ],
      tech: ['Go', 'Rust', 'Next.js', 'Kafka', 'ClickHouse', 'Kubernetes', 'WebGL', 'Docker', 'OpenTelemetry'],
      live: 'https://console.nebula.io/observe',
      github: 'https://github.com/Satyaram12/portfolio'
    },
    neuralflow: {
      title: 'NeuralFlow — Real-Time Collaborative AI Canvas',
      category: 'Generative AI & Visual Workflow Systems',
      img: 'assets/images/project-neuralflow.jpg',
      desc: 'A visual node-based programming canvas for designing, chaining, evaluating, and deploying multi-modal LLM workflows and vector search pipelines.',
      arch: 'Features a custom GPU-accelerated canvas engine rendered via WebGL and HTML5 Canvas with CRDT (Conflict-free Replicated Data Types) for multi-user real-time collaboration. The backend utilizes Python FastAPI, LangChain, Qdrant vector database, and asynchronous Celery workers to stream model inference results via Server-Sent Events (SSE).',
      metrics: [
        { label: 'Active Creators', val: '12,000+ engineers' },
        { label: 'DAG Execution', val: 'Sub-second node latency' },
        { label: 'Sync Latency', val: '< 16ms multi-cursor' }
      ],
      tech: ['React', 'TypeScript', 'FastAPI', 'Python', 'Qdrant Vector DB', 'WebSockets', 'Tailwind CSS', 'Redis', 'Docker'],
      live: 'https://cognito-ai-flow.app',
      github: 'https://github.com/Satyaram12/portfolio'
    },
    pulsepay: {
      title: 'PulsePay — Sub-Millisecond Global Fintech Settlement',
      category: 'Fintech & High-Frequency Settlement',
      img: 'assets/images/project-pulsepay.jpg',
      desc: 'A distributed transactional ledger engine delivering deterministic sub-millisecond settlement across multi-region banking protocols with zero double-spend guarantees.',
      arch: 'Implements Raft consensus clustering in Go with memory-mapped zero-copy IPC queues. Transactions undergo deterministic lock-free validation with cryptographic signatures before atomic persistence into CockroachDB and distributed PostgreSQL clusters. Built with rigorous audit compliance and automated fault recovery.',
      metrics: [
        { label: 'Settlement Latency', val: '78 microseconds' },
        { label: 'Transaction Vol', val: '$1.89B / month' },
        { label: 'Availability', val: '99.999% SLA' }
      ],
      tech: ['Go', 'Raft Protocol', 'PostgreSQL', 'CockroachDB', 'gRPC', 'AWS EKS', 'Grafana', 'Prometheus'],
      live: 'https://globepay-settlement.network',
      github: 'https://github.com/Satyaram12/portfolio'
    },
    hyperion: {
      title: 'Hyperion Studio — Collaborative WebGL 3D Pipeline',
      category: 'Computer Graphics & Interactive Web Tools',
      img: 'assets/images/project-hyperion.jpg',
      desc: 'A browser-native 3D scene compositor, shader editor, and animation timeline empowering 3D artists to collaborate synchronously on WebGL and WebGPU scenes.',
      arch: 'Powered by Three.js and custom GLSL PBR (Physically Based Rendering) shader pipelines compiled down via WebAssembly for maximum FPS. Supports real-time ray-marched refractions, glTF/USDZ asset export, and WebRTC peer-to-peer data mesh synchronization.',
      metrics: [
        { label: 'Render Performance', val: 'Solid 60 FPS on WebGL' },
        { label: 'Asset Load Time', val: '4x faster with WASM' },
        { label: 'Live Users', val: '4 concurrent editors' }
      ],
      tech: ['Three.js', 'WebGL', 'WebAssembly', 'TypeScript', 'GLSL Shaders', 'WebRTC', 'Vite', 'CSS Glassmorphism'],
      live: 'https://neonflow.studio/editor',
      github: 'https://github.com/Satyaram12/portfolio'
    }
  };

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    if (projectModalImg) projectModalImg.src = data.img;
    if (projectModalTitle) projectModalTitle.textContent = data.title;
    if (projectModalCategory) projectModalCategory.textContent = data.category;
    if (projectModalDesc) projectModalDesc.textContent = data.desc;
    if (projectModalArchitecture) projectModalArchitecture.textContent = data.arch;

    if (projectModalMetrics) {
      projectModalMetrics.innerHTML = data.metrics.map(m => `
        <div class="sim-metric-cell">
          <div class="sim-cell-val" style="color: var(--accent-cyan); font-size: 1.05rem;">${m.val}</div>
          <div class="sim-cell-lbl">${m.label}</div>
        </div>
      `).join('');
    }

    if (projectModalTech) {
      projectModalTech.innerHTML = data.tech.map(t => `
        <span class="tech-tag" style="color: var(--accent-primary);">${t}</span>
      `).join('');
    }

    if (projectModalLiveLink) projectModalLiveLink.href = data.live;
    if (projectModalGithubLink) projectModalGithubLink.href = data.github;

    projectModal.classList.add('active');
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
  }

  // Attach triggers to project zoom buttons and cards
  document.querySelectorAll('[data-project]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = trigger.getAttribute('data-project');
      openProjectModal(projId);
    });
  });

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
    const closeBtn = projectModal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  }

  window.openProjectModal = openProjectModal;
  window.closeProjectModal = closeProjectModal;


  // --- 2. Tech Stack Category Filtering ---
  const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  // --- 3. Interactive System Architecture Playground Simulator ---
  const concurrencySlider = document.getElementById('sim-concurrency');
  const cacheHitSlider = document.getElementById('sim-cache');
  const dbReplicationSlider = document.getElementById('sim-replication');

  const concurrencyValDisplay = document.getElementById('sim-concurrency-val');
  const cacheHitValDisplay = document.getElementById('sim-cache-val');
  const dbReplicationValDisplay = document.getElementById('sim-replication-val');

  const outThroughput = document.getElementById('sim-out-tps');
  const outLatency = document.getElementById('sim-out-latency');
  const outCpu = document.getElementById('sim-out-cpu');
  const outStatus = document.getElementById('sim-out-status');

  function calculateSimulation() {
    if (!concurrencySlider || !cacheHitSlider || !dbReplicationSlider) return;

    const concurrency = parseInt(concurrencySlider.value, 10); // 100 to 50000
    const cacheHitPct = parseInt(cacheHitSlider.value, 10); // 0 to 100%
    const replicationLag = parseInt(dbReplicationSlider.value, 10); // 1 to 50 ms

    // Displays
    if (concurrencyValDisplay) concurrencyValDisplay.textContent = `${concurrency.toLocaleString()} users`;
    if (cacheHitValDisplay) cacheHitValDisplay.textContent = `${cacheHitPct}%`;
    if (dbReplicationValDisplay) dbReplicationValDisplay.textContent = `${replicationLag} ms`;

    // Mathematical model for system behavior
    // Cache miss penalty
    const cacheMissRatio = (100 - cacheHitPct) / 100;
    
    // Calculated Throughput (TPS)
    const baseThroughput = concurrency * 1.8;
    const cacheBonus = 1 + (cacheHitPct / 100) * 1.5;
    const computedTps = Math.round(baseThroughput * cacheBonus);

    // Calculated P99 Latency (ms)
    // Latency increases with concurrency load and cache misses
    const loadFactor = Math.pow(concurrency / 10000, 1.3);
    const dbPenalty = cacheMissRatio * replicationLag * 1.8;
    const baseLatency = 1.2;
    const computedLatency = (baseLatency + loadFactor * 2.5 + dbPenalty).toFixed(1);

    // CPU Utilization (%)
    const rawCpu = (concurrency / 500) * (0.3 + cacheMissRatio * 0.7);
    const computedCpu = Math.min(Math.round(rawCpu), 99);

    // Update UI
    if (outThroughput) outThroughput.textContent = `${computedTps.toLocaleString()} req/s`;
    if (outLatency) outLatency.textContent = `${computedLatency} ms`;
    if (outCpu) outCpu.textContent = `${computedCpu}%`;

    if (outStatus) {
      if (computedLatency < 15 && computedCpu < 75) {
        outStatus.innerHTML = '<span class="live-pill" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">Optimal / High Efficiency</span>';
      } else if (computedLatency < 35 && computedCpu < 90) {
        outStatus.innerHTML = '<span class="live-pill" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber);">Nominal Load</span>';
      } else {
        outStatus.innerHTML = '<span class="live-pill" style="background: rgba(244, 63, 94, 0.15); color: var(--accent-rose);">Scale Recommended</span>';
      }
    }
  }

  if (concurrencySlider) concurrencySlider.addEventListener('input', calculateSimulation);
  if (cacheHitSlider) cacheHitSlider.addEventListener('input', calculateSimulation);
  if (dbReplicationSlider) dbReplicationSlider.addEventListener('input', calculateSimulation);

  // Initial calculation on load
  calculateSimulation();
})();
