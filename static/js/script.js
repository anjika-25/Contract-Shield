/**
 * ContractShield ΓÇö Main Layout Scripts
 * ContractVerse | Collapsible sidebar, scanned history, details modal, dark mode UI
 */

(function () {
  'use strict';

  /* --- Dynamic Dummy Database --- */
  let activeContractId = 'h1';
  const DUMMY_HISTORY = [
    {
      id: 'h1',
      name: 'Employment_Contract_v2.pdf',
      date: 'Today, 10:42 AM',
      type: 'pdf',
      category: 'Today',
      riskScore: 78,
      riskLevel: 'Medium Risk',
      summary: 'This employment contract contains standard operational terms. However, our AI scan identified key provisions regarding uncapped liability, non-compete restrictions, and intellectual property ownership that require legal negotiation.',
      obligations: [
        { name: 'Confidentiality Obligations (Mutual)', status: 'Compliant', severity: 'success' },
        { name: 'Governing Law (New York)', status: 'Standard', severity: 'success' },
        { name: 'Liability Cap Clause (Missing)', status: 'Critical', severity: 'danger' },
        { name: 'Pre-existing Intellectual Property', status: 'Warning', severity: 'warning' }
      ],
      clauses: [
        {
          id: 'clause-1',
          title: '≡ƒö┤ Unlimited Liability (Sec. 5)',
          severity: 'high',
          text: "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY CONSEQUENTIAL, INDIRECT, SPECIAL, OR PUNITIVE DAMAGES, EXCEPT THAT THE RECEIVING PARTY'S LIABILITY FOR BREACH OF CONFIDENTIALITY SHALL BE ENTIRELY UNLIMITED AND UNCAPPED.",
          risk: 'Exposes the company to catastrophic financial liabilities in the event of an accidental confidentiality breach. Liability claims could easily exceed the total contract value multiple times over.',
          explanation: 'Confidentiality breaches are a common source of litigation. In standard service or employment contracts, liability for such breaches is typically capped at a reasonable limit (e.g., 1x or 2x the annual contract value or a fixed dollar cap) to protect the signing parties.',
          recommendation: 'Negotiate to cap the liability for confidentiality breaches. Example replacement: "except that the Receiving Party\'s total liability for breach of confidentiality shall be capped at $250,000."'
        },
        {
          id: 'clause-2',
          title: '≡ƒƒá Automatic IP Transfer (Sec. 7)',
          severity: 'medium',
          text: 'All intellectual property created by the Disclosing Party prior to or during the term of this Agreement shall automatically transfer to the Receiving Party upon signing.',
          risk: 'Automatically assigns pre-existing patents, copyrights, and trade secrets to the other party, which is an aggressive clause for an NDA or early-stage agreement.',
          explanation: 'Pre-existing intellectual property must remain the sole property of the original creator. Only IP specifically created for and paid for by the client during the contract term should be transferred, and even then, only upon receipt of full payment.',
          recommendation: 'Amend the clause to protect pre-existing rights. Example: "Each party shall retain all right, title, and interest in its pre-existing Intellectual Property. Only work product created specifically for the Receiving Party under this Agreement shall transfer upon full payment."'
        },
        {
          id: 'clause-3',
          title: '≡ƒƒó Governing Law (Sec. 6)',
          severity: 'low',
          text: 'This Agreement shall be governed by, and construed in accordance with, the laws of the State of New York, without regard to conflict of laws principles.',
          risk: 'Standard clause, but you should verify that you have legal representation or counsel familiar with New York jurisdiction in case of dispute.',
          explanation: 'New York law is standard and widely accepted in commercial agreements. However, if your business is based in another state, you might prefer local courts to minimize travel and legal representation expenses.',
          recommendation: 'No immediate action required unless you prefer to change the venue to your home state.'
        }
      ]
    },
    {
      id: 'h2',
      name: 'NDA_Final_Draft.docx',
      date: 'Today, 09:15 AM',
      type: 'docx',
      category: 'Today',
      riskScore: 82,
      riskLevel: 'High Risk',
      summary: 'Critical risk NDA. The agreement contains high-severity clauses regarding unilateral intellectual property transfer and restrictive non-solicitation covenants that violate normal commercial boundaries.',
      obligations: [
        { name: 'Confidentiality Obligations (Unilateral)', status: 'Warning', severity: 'warning' },
        { name: 'Governing Law (California)', status: 'Standard', severity: 'success' },
        { name: 'Non-solicit Clause (3 Years)', status: 'Excessive', severity: 'danger' }
      ],
      clauses: [
        {
          id: 'clause-1',
          title: '≡ƒö┤ Unilateral IP Ownership',
          severity: 'high',
          text: 'All feedback, suggestions, or modifications proposed by the consultant shall become the exclusive intellectual property of the Company without compensation.',
          risk: 'Assigns valuable advisory ideas and modifications to the company without any royalty, payment, or ownership stake.',
          explanation: 'While standard feedback clauses are common, assigning entire modifications or suggestions before a commercial relationship is established can lead to pre-emptive IP loss.',
          recommendation: 'Add a license instead of a transfer. Example: "Consultant grants the Company a non-exclusive, royalty-free, perpetual license to use feedback for any purpose."'
        },
        {
          id: 'clause-2',
          title: '≡ƒƒá Strict Non-Solicit Covenant',
          severity: 'medium',
          text: 'For a period of three (3) years following termination, Consultant shall not solicit, employ, or contract any employee or contractor of the Company.',
          risk: 'A 3-year solicitation ban is unusually long and restrictively drafted. It could prevent you from hiring former colleagues or industry contacts.',
          explanation: 'Standard non-solicit covenants range from 12 to 18 months. Covenants exceeding 2 years are often deemed unreasonable by courts and can limit professional networking.',
          recommendation: 'Negotiate the duration down. Example: "For a period of twelve (12) months following termination..."'
        }
      ]
    },
    {
      id: 'h3',
      name: 'Rental_Agreement_Signed.pdf',
      date: 'Yesterday, 04:30 PM',
      type: 'pdf',
      category: 'Yesterday',
      riskScore: 45,
      riskLevel: 'Low Risk',
      summary: 'This lease agreement matches standard local residential leasing regulations. The risk score is low, with deposit return terms and maintenance obligations within typical boundaries.',
      obligations: [
        { name: 'Security Deposit (2 Months)', status: 'Standard', severity: 'success' },
        { name: 'Maintenance Obligations', status: 'Shared', severity: 'success' },
        { name: 'Subleasing Terms', status: 'Restricted', severity: 'warning' }
      ],
      clauses: [
        {
          id: 'clause-1',
          title: '≡ƒƒó Deposit Refund Timeline',
          severity: 'low',
          text: 'The Landlord shall return the security deposit to the Tenant within thirty (30) days of lease expiration and vacant surrender of the premises.',
          risk: 'Low risk. Standard lease clause complying with local landlord-tenant statutes.',
          explanation: 'Most jurisdictions mandate return of security deposits within 21 to 30 days. This clause aligns with legal requirements.',
          recommendation: 'No changes needed. Ensure you complete a move-out checklist to protect your refund.'
        }
      ]
    },
    {
      id: 'h4',
      name: 'IP_Indemnity_Clause_Scan',
      date: 'July 12, 2026',
      type: 'clause',
      category: 'Previous 7 Days',
      riskScore: 90,
      riskLevel: 'High Risk',
      summary: 'Uncapped patent indemnity. This clause exposes the indemnifying vendor to unlimited liability for third-party intellectual property infringement claims.',
      obligations: [
        { name: 'Third Party IP Claims', status: 'Uncapped', severity: 'danger' },
        { name: 'Defense Obligations', status: 'Immediate', severity: 'warning' }
      ],
      clauses: [
        {
          id: 'clause-1',
          title: '≡ƒö┤ Uncapped Patent Indemnity',
          severity: 'high',
          text: 'Vendor shall indemnify, defend, and hold harmless Buyer from and against any and all claims, suits, or damages arising out of any infringement of patents, copyrights, or trade secrets.',
          risk: 'Unlimited patent litigation exposure. Patent lawsuits are highly expensive, and uncapped indemnity could bankrupt the vendor.',
          explanation: 'Intellectual property indemnity should be capped at a designated threshold (e.g., 2x or 3x the contract value) or limited to direct damages rather than consequential losses.',
          recommendation: 'Add a special liability cap for IP claims. Example: "Vendor\'s maximum aggregate liability for IP indemnity claims shall not exceed two million dollars ($2,000,000)."'
        }
      ]
    }
  ];

  /* --- DOM References --- */
  const appLayout = document.getElementById('appLayout');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const navThemeToggle = document.getElementById('navThemeToggle');
  const notificationBtn = document.getElementById('notificationBtn');
  const profileBtn = document.getElementById('profileBtn');
  const searchInput = document.getElementById('searchContracts');
  const sidebarHistoryContainer = document.getElementById('sidebarHistoryContainer');
  const sidebarNewBtn = document.getElementById('sidebarNewBtn');

  /* --- Modal References --- */
  const clauseDetailModal = document.getElementById('clauseDetailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
  const modalSuggestRedraftBtn = document.getElementById('modalSuggestRedraftBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalSeverityBadge = document.getElementById('modalSeverityBadge');
  const modalClauseText = document.getElementById('modalClauseText');
  const modalRiskExplanation = document.getElementById('modalRiskExplanation');
  const modalAiExplanation = document.getElementById('modalAiExplanation');
  const modalRecommendation = document.getElementById('modalRecommendation');

  /* --- Dashboard & Report Elements --- */
  const heroUploadBtn = document.getElementById('heroUploadBtn');
  const heroDemoBtn = document.getElementById('heroDemoBtn');
  const mockRiskProgress = document.getElementById('mockRiskProgress');
  const uploadDropzone = document.getElementById('uploadDropzone');
  const contractFileInput = document.getElementById('contractFileInput');
  const uploadStatusPanel = document.getElementById('uploadStatusPanel');
  const uploadedFileName = document.getElementById('uploadedFileName');
  const uploadedFileSize = document.getElementById('uploadedFileSize');
  const removeFileBtn = document.getElementById('removeFileBtn');
  const submitAnalysisBtn = document.getElementById('submitAnalysisBtn');
  const uploadProgress = document.getElementById('uploadProgress');
  const uploadProgressFill = document.getElementById('uploadProgressFill');
  const uploadPercent = document.getElementById('uploadPercent');
  const uploadSuccess = document.getElementById('uploadSuccess');
  const analyzingState = document.getElementById('analyzingState');
  const analysisReport = document.getElementById('analysis-report');

  /* --- Constants --- */
  const MOBILE_BREAKPOINT = 768;
  const STORAGE_KEY_SIDEBAR = 'contractshield-sidebar-collapsed';
  const STORAGE_KEY_DARK_MODE = 'contractshield-dark-mode';

  /* --- Layout State --- */
  let isSidebarCollapsed = false;
  let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  /**
   * Check if viewport is mobile-sized
   */
  function checkMobile() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (!wasMobile && isMobile) {
      closeMobileSidebar();
      appLayout.classList.remove('sidebar-collapsed');
    }

    if (wasMobile && !isMobile) {
      sidebar.classList.remove('is-open');
      sidebarOverlay.classList.remove('is-visible');
      applySidebarState();
    }
  }

  /**
   * Apply collapsed/expanded sidebar state (desktop)
   */
  function applySidebarState() {
    if (isMobile) return;

    if (isSidebarCollapsed) {
      appLayout.classList.add('sidebar-collapsed');
    } else {
      appLayout.classList.remove('sidebar-collapsed');
    }

    updateHamburgerAria();
  }

  /**
   * Toggle sidebar on desktop
   */
  function toggleDesktopSidebar() {
    isSidebarCollapsed = !isSidebarCollapsed;
    localStorage.setItem(STORAGE_KEY_SIDEBAR, String(isSidebarCollapsed));
    applySidebarState();
  }

  /**
   * Open sidebar on mobile
   */
  function openMobileSidebar() {
    sidebar.classList.add('is-open');
    sidebarOverlay.classList.add('is-visible');
    sidebarOverlay.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close sidebar on mobile
   */
  function closeMobileSidebar() {
    sidebar.classList.remove('is-open');
    sidebarOverlay.classList.remove('is-visible');
    sidebarOverlay.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /**
   * Toggle sidebar (context-aware: mobile vs desktop)
   */
  function toggleSidebar() {
    if (isMobile) {
      if (sidebar.classList.contains('is-open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    } else {
      toggleDesktopSidebar();
    }
  }

  /**
   * Update hamburger button aria attributes
   */
  function updateHamburgerAria() {
    const expanded = isMobile
      ? sidebar.classList.contains('is-open')
      : !isSidebarCollapsed;

    hamburgerBtn.setAttribute('aria-expanded', String(expanded));
  }

  /**
   * Apply dark mode state across all theme controls
   */
  function setDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    darkModeToggle.setAttribute('aria-checked', String(isDark));
    navThemeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    navThemeToggle.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
    localStorage.setItem(STORAGE_KEY_DARK_MODE, String(isDark));
  }

  /**
   * Toggle dark mode (UI only)
   */
  function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    setDarkMode(isDark);
  }

  /* --- Interactive Details Modal Logic --- */

  /**
   * Open the detailed clause view modal
   */
  function openClauseModal(clause) {
    if (!clause) return;

    modalTitle.textContent = clause.title;
    modalClauseText.textContent = clause.text;
    modalRiskExplanation.textContent = clause.risk;
    modalAiExplanation.textContent = clause.explanation;
    modalRecommendation.innerHTML = '<strong>Recommended Action:</strong> ' + clause.recommendation;

    // Reset severity badge colors
    modalSeverityBadge.className = 'clause-modal-badge';
    modalSeverityBadge.classList.add('badge-' + clause.severity);
    modalSeverityBadge.textContent = clause.severity.toUpperCase() + ' RISK';

    // Show modal overlay
    clauseDetailModal.classList.add('is-visible');
    clauseDetailModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  }

  /**
   * Close the detailed clause view modal
   */
  function closeClauseModal() {
    clauseDetailModal.classList.remove('is-visible');
    clauseDetailModal.setAttribute('aria-hidden', 'true');
    if (!isMobile || !sidebar.classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  /* --- Scanned Contract/Clause History List Logic --- */

  /**
   * Render the sidebar history list grouped by dates (Today, Yesterday, Previous 7 Days)
   */
  function renderHistory(filterQuery = '') {
    if (!sidebarHistoryContainer) return;
    sidebarHistoryContainer.innerHTML = '';

    const query = filterQuery.trim().toLowerCase();

    // Group items by category
    const groups = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': []
    };

    DUMMY_HISTORY.forEach(item => {
      if (query && !item.name.toLowerCase().includes(query)) return;
      if (groups[item.category]) {
        groups[item.category].push(item);
      } else {
        groups['Previous 7 Days'].push(item);
      }
    });

    Object.keys(groups).forEach(category => {
      const items = groups[category];
      if (items.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'sidebar-history-group';

      const title = document.createElement('h2');
      title.className = 'sidebar-history-title';
      title.textContent = category;
      groupDiv.appendChild(title);

      const list = document.createElement('ul');
      list.className = 'history-item-list';

      items.forEach(item => {
        const li = document.createElement('li');

        const button = document.createElement('button');
        button.className = 'history-item';
        button.type = 'button';
        button.setAttribute('data-id', item.id);
        if (item.id === activeContractId) {
          button.classList.add('is-active');
        }

        // SVG Document Type Icon
        let iconSvg = '';
        if (item.type === 'pdf') {
          iconSvg = `<svg class="history-item__icon icon-pdf" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
          </svg>`;
        } else if (item.type === 'docx') {
          iconSvg = `<svg class="history-item__icon icon-docx" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
            <path d="M8 12H16M8 16H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>`;
        } else {
          // Clause scan (Shield icon)
          iconSvg = `<svg class="history-item__icon icon-clause" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
          </svg>`;
        }

        button.innerHTML = `
          ${iconSvg}
          <div class="history-item__info">
            <span class="history-item__name">${item.name}</span>
            <span class="history-item__date">${item.date}</span>
          </div>
        `;

        // Action Buttons (Rename / Delete)
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'history-item__actions';

        // Rename Pencil Button
        const renameBtn = document.createElement('button');
        renameBtn.type = 'button';
        renameBtn.className = 'history-item__action-btn';
        renameBtn.title = 'Rename Scan';
        renameBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        renameBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startRename(item.id, button);
        });

        // Delete Trash Button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'history-item__action-btn';
        deleteBtn.title = 'Delete Scan';
        deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteScan(item.id);
        });

        actionsDiv.appendChild(renameBtn);
        actionsDiv.appendChild(deleteBtn);
        button.appendChild(actionsDiv);

        // Click on item loading dashboard
        button.addEventListener('click', () => {
          if (!button.querySelector('input')) {
            loadContract(item.id);
          }
        });

        li.appendChild(button);
        list.appendChild(li);
      });

      groupDiv.appendChild(list);
      sidebarHistoryContainer.appendChild(groupDiv);
    });
  }

  /**
   * Begin inline rename process for a history item
   */
  function startRename(id, buttonEl) {
    const item = DUMMY_HISTORY.find(x => x.id === id);
    if (!item) return;

    const infoEl = buttonEl.querySelector('.history-item__info');
    const nameEl = buttonEl.querySelector('.history-item__name');
    const oldName = item.name;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'history-item__input';
    input.value = oldName;

    // Hide text info, show input
    infoEl.style.display = 'none';
    buttonEl.insertBefore(input, buttonEl.querySelector('.history-item__actions'));
    input.focus();
    input.select();

    const saveRename = () => {
      const newName = input.value.trim();
      if (newName && newName !== oldName) {
        item.name = newName;
        renderHistory();
        if (activeContractId === id) {
          document.querySelector('.mock-dashboard__doc-title').textContent = newName;
        }
      } else {
        cancelRename();
      }
    };

    const cancelRename = () => {
      input.remove();
      infoEl.style.display = '';
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveRename();
      } else if (e.key === 'Escape') {
        cancelRename();
      }
    });

    input.addEventListener('blur', saveRename);
  }

  /**
   * Delete a scan from the history with visual confirmation
   */
  function deleteScan(id) {
    const confirmDelete = confirm('Are you sure you want to delete this scan history?');
    if (!confirmDelete) return;

    const index = DUMMY_HISTORY.findIndex(x => x.id === id);
    if (index === -1) return;

    DUMMY_HISTORY.splice(index, 1);
    
    if (activeContractId === id) {
      if (DUMMY_HISTORY.length > 0) {
        loadContract(DUMMY_HISTORY[0].id);
      } else {
        // Return to upload screen
        activeContractId = '';
        renderHistory();
        resetUpload();
        if (analysisReport) analysisReport.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      renderHistory();
    }
  }

  /**
   * Filter the history list based on the search field
   */
  function filterContracts() {
    renderHistory(searchInput.value);
  }

  /**
   * Dynamically render all contract details inside the dashboard and report
   */
  function loadContract(contractId) {
    activeContractId = contractId;
    renderHistory();

    const contract = DUMMY_HISTORY.find(x => x.id === contractId);
    if (!contract) return;

    // 1. Update Document Preview Panel
    const docTitle = document.querySelector('.mock-dashboard__doc-title');
    if (docTitle) docTitle.textContent = contract.name;

    const docBody = document.querySelector('.mock-dashboard__doc-body');
    if (docBody) {
      docBody.innerHTML = '';

      // Render introduction paragraph
      const intro = document.createElement('p');
      intro.className = 'mock-doc-paragraph';
      intro.innerHTML = `<strong>1. Project Agreement.</strong> This document constitutes a binding contract between the parties. Under terms set forth herein, the parties agree to perform services related to legal auditing and data analytics.`;
      docBody.appendChild(intro);

      // Render clauses dynamically
      contract.clauses.forEach((clause, index) => {
        const paragraphNumber = index + 2;
        const div = document.createElement('div');
        div.className = `mock-clause mock-clause--${clause.severity}-risk`;
        div.setAttribute('data-id', clause.id);

        const badgeText = clause.severity === 'high' ? 'High Risk' : clause.severity === 'medium' ? 'Warning' : 'Low Risk';
        const colorClass = clause.severity === 'high' ? 'high' : clause.severity === 'medium' ? 'med' : 'low';

        div.innerHTML = `
          <p class="mock-doc-paragraph">
            <strong>${paragraphNumber}. ${clause.title.split(' (')[0]}.</strong> 
            ${clause.text.replace(
              /ENTIRELY UNLIMITED AND UNCAPPED|shall automatically transfer|uncapped liability/g,
              match => `<span class="mock-highlight mock-highlight--${colorClass}">${match}</span>`
            )}
          </p>
          <div class="mock-tooltip">
            <div class="mock-tooltip__header">
              <span class="mock-tooltip__risk-badge ${clause.severity === 'medium' ? 'mock-tooltip__risk-badge--warning' : ''}">ΓÜá∩╕Å ${badgeText}</span>
              <span>Sec. ${paragraphNumber}</span>
            </div>
            <p class="mock-tooltip__text">${clause.risk}</p>
          </div>
        `;

        // Modal triggers on clicking the highlight block
        div.addEventListener('click', () => openClauseModal(clause));
        docBody.appendChild(div);
      });
    }

    // 2. Update Risk Gauge Meter
    const mockRiskNumber = document.querySelector('.mock-risk-meter__number');
    if (mockRiskNumber) mockRiskNumber.textContent = contract.riskScore;

    const mockRiskBadge = document.querySelector('.mock-badge--risk');
    if (mockRiskBadge) {
      mockRiskBadge.textContent = `${contract.riskScore}% ${contract.riskLevel}`;
      mockRiskBadge.className = 'mock-badge mock-badge--risk';
      if (contract.riskScore > 80) mockRiskBadge.classList.add('high');
      else if (contract.riskScore > 50) mockRiskBadge.classList.add('medium');
    }

    // Re-trigger SVG Circle animation
    if (mockRiskProgress) {
      const radius = 40;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (contract.riskScore / 100) * circumference;
      mockRiskProgress.style.strokeDasharray = `${circumference}`;
      mockRiskProgress.style.strokeDashoffset = `${circumference}`;
      setTimeout(() => {
        mockRiskProgress.style.strokeDashoffset = String(offset);
      }, 100);
    }

    // 3. Update Obligations Checklist Card
    const checklistContainer = document.querySelector('.mock-checklist');
    if (checklistContainer) {
      checklistContainer.innerHTML = '';
      contract.obligations.forEach(ob => {
        const item = document.createElement('div');
        item.className = 'mock-checklist__item';
        
        let iconHtml = '';
        if (ob.severity === 'success') {
          iconHtml = `<svg class="mock-checklist__icon mock-checklist__icon--success" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="13" height="13">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
        } else if (ob.severity === 'warning') {
          iconHtml = `<svg class="mock-checklist__icon mock-checklist__icon--warning" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="13" height="13">
            <path d="M12 9V13M12 17H12.01M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
        } else {
          iconHtml = `<svg class="mock-checklist__icon mock-checklist__icon--danger" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="13" height="13">
            <path d="M12 9V13M12 17H12.01M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
        }

        item.innerHTML = `
          ${iconHtml}
          <span class="mock-checklist__text">${ob.name}</span>
          <span class="mock-checklist__status-pill mock-checklist__status-pill--${ob.severity}">${ob.status}</span>
        `;
        checklistContainer.appendChild(item);
      });
    }

    // 4. Update Interactive Obligations Cards in Mock Panel
    const analysisPanel = document.querySelector('.mock-dashboard__analysis-panel');
    if (analysisPanel) {
      const listContainer = document.createElement('div');
      listContainer.className = 'mock-interactive-cards-container';
      
      const oldDynamic = analysisPanel.querySelector('.mock-interactive-cards-container');
      if (oldDynamic) oldDynamic.remove();
      
      contract.clauses.forEach(clause => {
        if (clause.severity === 'low') return; // only show high/medium as obligations cards

        const card = document.createElement('div');
        card.className = 'mock-card mock-card--interactive';
        card.setAttribute('data-clause-id', clause.id);
        
        const badgeColor = clause.severity === 'high' ? 'high' : 'warning';
        const badgeText = clause.severity === 'high' ? 'High Risk' : 'Warning';

        card.innerHTML = `
          <div class="mock-card__header">
            <span class="mock-card__sub">${clause.title}</span>
            <span class="mock-badge mock-badge--${badgeColor}">${badgeText}</span>
          </div>
          <p class="mock-card__text">${clause.risk}</p>
          <button class="mock-card__action" type="button">Suggest Redraft</button>
        `;
        
        card.addEventListener('click', () => openClauseModal(clause));
        listContainer.appendChild(card);
      });
      analysisPanel.appendChild(listContainer);
    }

    // 5. Update Full Report Section
    const reportTitle = document.querySelector('.analysis-report h2');
    if (reportTitle) reportTitle.textContent = `Contract Analysis Report: ${contract.name}`;

    const reportScoreText = document.querySelector('.risk-score p');
    if (reportScoreText) reportScoreText.textContent = `${contract.riskScore}%`;

    const reportLevelText = document.querySelector('.risk-score span');
    if (reportLevelText) {
      reportLevelText.textContent = contract.riskLevel;
      reportLevelText.className = contract.riskScore > 80 ? 'severity high' : contract.riskScore > 50 ? 'severity medium' : 'severity low';
    }

    // Count severity occurrences
    const highCount = contract.clauses.filter(x => x.severity === 'high').length;
    const medCount = contract.clauses.filter(x => x.severity === 'medium').length;
    const lowCount = contract.clauses.filter(x => x.severity === 'low').length;

    const scoreSummaryCards = document.querySelectorAll('.risk-card');
    if (scoreSummaryCards.length === 3) {
      scoreSummaryCards[0].querySelector('span:not(.risk-dot)').textContent = `${highCount} Clause${highCount !== 1 ? 's' : ''}`;
      scoreSummaryCards[1].querySelector('span:not(.risk-dot)').textContent = `${medCount} Clause${medCount !== 1 ? 's' : ''}`;
      scoreSummaryCards[2].querySelector('span:not(.risk-dot)').textContent = `${lowCount} Clause${lowCount !== 1 ? 's' : ''}`;
    }

    // Dynamic Report Detected Clauses Cards
    const clauseListContainer = document.querySelector('.clause-list');
    if (clauseListContainer) {
      clauseListContainer.innerHTML = '';
      
      contract.clauses.forEach(clause => {
        const card = document.createElement('div');
        card.className = `clause-card ${clause.severity}`;
        
        const dotColor = clause.severity === 'high' ? '≡ƒö┤' : clause.severity === 'medium' ? '≡ƒƒá' : '≡ƒƒó';
        const badgeColor = clause.severity === 'high' ? 'high' : clause.severity === 'medium' ? 'medium' : 'low';
        const textLabel = clause.severity === 'high' ? 'HIGH' : clause.severity === 'medium' ? 'MEDIUM' : 'LOW';

        card.innerHTML = `
          <div class="clause-header">
            <h4>${dotColor} ${clause.title.split(' (')[0]}</h4>
            <span class="severity ${badgeColor}">${textLabel}</span>
          </div>
          <p>${clause.risk}</p>
          <div class="clause-tip">
            ≡ƒÆí AI Suggestion:
            ${clause.recommendation.split('. ')[0]}.
          </div>
        `;
        
        card.addEventListener('click', () => openClauseModal(clause));
        clauseListContainer.appendChild(card);
      });
    }

    const summaryParagraph = document.querySelector('.report-section:nth-of-type(3) p');
    if (summaryParagraph) {
      summaryParagraph.textContent = contract.summary;
    }

    const suggestionList = document.querySelector('.report-section:nth-of-type(2) ul');
    if (suggestionList) {
      suggestionList.innerHTML = '';
      contract.clauses.forEach(clause => {
        const li = document.createElement('li');
        li.textContent = clause.recommendation.split('. ')[0];
        suggestionList.appendChild(li);
      });
    }

    // Smooth scroll mockup dashboard layout back into alignment if they clicked from list
    const dashboard = document.getElementById('mockDashboard');
    if (dashboard) {
      dashboard.style.transform = 'translateY(-4px)';
      setTimeout(() => {
        dashboard.style.transform = '';
      }, 400);
    }
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    hamburgerBtn.addEventListener('click', toggleSidebar);
    sidebarCollapseBtn.addEventListener('click', toggleDesktopSidebar);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    navThemeToggle.addEventListener('click', toggleDarkMode);
    notificationBtn.addEventListener('click', () => {
      notificationBtn.classList.add('is-active');
      setTimeout(() => notificationBtn.classList.remove('is-active'), 200);
    });
    profileBtn.addEventListener('click', () => {
      const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
      profileBtn.setAttribute('aria-expanded', String(!isExpanded));
    });

    sidebarOverlay.addEventListener('click', closeMobileSidebar);
    searchInput.addEventListener('input', filterContracts);

    // New Analysis button resets UI to upload view
    if (sidebarNewBtn) {
      sidebarNewBtn.addEventListener('click', () => {
        activeContractId = '';
        renderHistory();
        resetUpload();
        if (analysisReport) analysisReport.style.display = 'none';

        if (isMobile) {
          closeMobileSidebar();
        }

        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Close Modal Events
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeClauseModal);
    if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeClauseModal);
    if (clauseDetailModal) {
      clauseDetailModal.addEventListener('click', (e) => {
        if (e.target === clauseDetailModal) {
          closeClauseModal();
        }
      });
    }

    if (modalSuggestRedraftBtn) {
      modalSuggestRedraftBtn.addEventListener('click', () => {
        alert('Re-drafting suggestions generated by AI have been saved. Check the main documents panel.');
        closeClauseModal();
      });
    }

    // Download Report PDF Click Event (UI only simulation)
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    if (downloadReportBtn) {
      downloadReportBtn.addEventListener('click', () => {
        const contract = DUMMY_HISTORY.find(x => x.id === activeContractId) || DUMMY_HISTORY[0];
        if (!contract) return;

        downloadReportBtn.disabled = true;
        const btnIcon = downloadReportBtn.querySelector('.report-download-btn__icon');
        const btnText = downloadReportBtn.querySelector('.report-download-btn__text');
        
        // Save original icon HTML to restore later
        const originalIconHtml = btnIcon ? btnIcon.outerHTML : '';

        // Show spinner loader
        if (btnIcon) {
          btnIcon.outerHTML = '<span class="btn-spinner"></span>';
        }
        btnText.textContent = 'Generating Report...';

        setTimeout(() => {
          // Success state
          const currentSpinner = downloadReportBtn.querySelector('.btn-spinner');
          if (currentSpinner) {
            currentSpinner.outerHTML = `<svg class="report-download-btn__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="color: #22c55e;">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
          }
          btnText.textContent = 'Report generated successfully!';
          downloadReportBtn.classList.add('is-success');

          // Trigger dynamic mock download text file renamed to .pdf
          const reportContent = `--------------------------------------------
CONTRACTSHIELD AI ANALYSIS REPORT
--------------------------------------------
Generated on: ${new Date().toLocaleDateString()}
Contract Name: ${contract.name}
Overall Risk Score: ${contract.riskScore}% (${contract.riskLevel})

Summary:
${contract.summary}

Obligations Checklist:
${contract.obligations.map(ob => `- [${ob.status}] ${ob.name}`).join('\n')}

Detected Risk Clauses:
${contract.clauses.map(clause => `\n* ${clause.title}\n  - Risk: ${clause.risk}\n  - Recommended Action: ${clause.recommendation}`).join('\n')}
`;
          const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = contract.name.replace(/\.[^/.]+$/, "") + "_Analysis_Report.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // Reset button back after 3 seconds
          setTimeout(() => {
            const successIcon = downloadReportBtn.querySelector('.report-download-btn__icon');
            if (successIcon) {
              successIcon.outerHTML = originalIconHtml;
            }
            btnText.textContent = 'Download Report PDF';
            downloadReportBtn.classList.remove('is-success');
            downloadReportBtn.disabled = false;
          }, 3000);

        }, 2000);
      });
    }

    window.addEventListener('resize', debounce(checkMobile, 150));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (clauseDetailModal.classList.contains('is-visible')) {
          closeClauseModal();
        }
        if (isMobile && sidebar.classList.contains('is-open')) {
          closeMobileSidebar();
        }
      }
    });

    bindMockEvents();
    bindUploadEvents();
  }

  /**
   * Bind event listeners for actions inside mockup dashboard hero
   */
  function bindMockEvents() {
    if (heroUploadBtn) {
      heroUploadBtn.addEventListener('click', () => {
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (heroDemoBtn) {
      heroDemoBtn.addEventListener('click', () => {
        const dashboard = document.getElementById('mockDashboard');
        if (dashboard) {
          dashboard.style.transform = 'translateY(-12px) scale(1.02)';
          dashboard.style.boxShadow = '0 30px 60px rgba(37, 99, 235, 0.2)';
          setTimeout(() => {
            dashboard.style.transform = '';
            dashboard.style.boxShadow = '';
          }, 1000);
        }
      });
    }
  }

  /**
   * Bind all drag-and-drop, selection, and submit event listeners for the upload section
   */
  function bindUploadEvents() {
    if (!uploadDropzone || !contractFileInput) return;

    // Trigger file picker on dropzone click
    uploadDropzone.addEventListener('click', (event) => {
      if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'BUTTON') {
        contractFileInput.click();
      }
    });

    // Toggle dragover visual states
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        uploadDropzone.classList.add('is-dragover');
      }, false);
    });

    ['dragleave', 'dragend', 'drop'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        uploadDropzone.classList.remove('is-dragover');
      }, false);
    });

    // Handle dropped files
    uploadDropzone.addEventListener('drop', (event) => {
      const dt = event.dataTransfer;
      const files = dt.files;
      handleUploadedFiles(files);
    });

    // Handle selected files from dialog
    contractFileInput.addEventListener('change', () => {
      handleUploadedFiles(contractFileInput.files);
    });

    // Handle file removal
    if (removeFileBtn) {
      removeFileBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        resetUpload();
      });
    }

    // Handle real file upload and AI analysis
    if (submitAnalysisBtn) {
      submitAnalysisBtn.addEventListener('click', function () {
        const file = contractFileInput.files[0];
        if (!file) {
          alert("Please select a file first.");
          return;
        }

        submitAnalysisBtn.disabled = true;
        const btnText = submitAnalysisBtn.querySelector('span');
        const oldBtnText = btnText.textContent;
        btnText.textContent = 'Analyzing...';

        // Show AI analyzing animation
        if (analyzingState) {
          analyzingState.style.display = 'flex';
        }

        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              throw new Error(data.error || 'Server error occurred during analysis.');
            });
          }
          return response.json();
        })
        .then(data => {
          // Hide loading state
          if (analyzingState) {
            analyzingState.style.display = 'none';
          }

          const analysis = data.analysis;
          if (!analysis) {
            throw new Error("No analysis payload returned from the server.");
          }

          // Construct the new history item with the real AI analysis response
          const fileName = file.name;
          const fileExt = fileName.split('.').pop().toLowerCase();
          const fileType = (fileExt === 'pdf' || fileExt === 'docx') ? fileExt : 'pdf';
          const newId = 'h_new_' + Date.now();
          const scanTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // Calculate risk score based on clause severity counts
          let highCount = 0;
          let mediumCount = 0;
          let lowCount = 0;

          const clausesMapped = (analysis.risky_clauses || []).map((clause, idx) => {
            const riskLower = (clause.risk || 'low').toLowerCase();
            if (riskLower === 'high') highCount++;
            else if (riskLower === 'medium') mediumCount++;
            else lowCount++;

            const emoji = riskLower === 'high' ? '🔴' : riskLower === 'medium' ? '🟠' : '🟢';

            return {
              id: `clause-new-${idx}`,
              title: `${emoji} ${clause.category}`,
              severity: riskLower,
              text: `This agreement is subject to terms and covenants governing the ${clause.category} category.`,
              risk: clause.reason,
              explanation: `A clause related to ${clause.category} was flagged with ${clause.risk} risk rating because: ${clause.reason}.`,
              recommendation: `Check the exact terms of the ${clause.category} clause. Suggest negotiating or modifying it based on: ${clause.reason}`
            };
          });

          // If no risky clauses, provide a default low risk clause
          if (clausesMapped.length === 0) {
            clausesMapped.push({
              id: 'clause-new-none',
              title: '🟢 No Major Risks Detected',
              severity: 'low',
              text: 'This contract contains standard and compliant clauses with no high or medium risks found.',
              risk: 'No major risks identified by the AI Engine.',
              explanation: 'All extracted clauses align with standard commercial parameters.',
              recommendation: 'No immediate redrafting required.'
            });
            lowCount = 1;
          }

          const calculatedScore = Math.min(100, (highCount * 30) + (mediumCount * 15) + (lowCount * 5));
          let riskLevelStr = 'Low Risk';
          if (calculatedScore >= 70) riskLevelStr = 'High Risk';
          else if (calculatedScore >= 30) riskLevelStr = 'Medium Risk';

          const obligationsMapped = (analysis.obligations || []).map(ob => {
            return { name: ob, status: 'Active', severity: 'success' };
          });
          if (obligationsMapped.length === 0) {
            obligationsMapped.push({ name: 'No explicit obligations extracted.', status: 'Standard', severity: 'success' });
          }

          const newScanItem = {
            id: newId,
            name: fileName,
            date: 'Today, ' + scanTime,
            type: fileType,
            category: 'Today',
            riskScore: calculatedScore,
            riskLevel: riskLevelStr,
            summary: analysis.summary || 'No summary available.',
            obligations: obligationsMapped,
            clauses: clausesMapped
          };

          DUMMY_HISTORY.unshift(newScanItem);

          activeContractId = newId;
          renderHistory();
          loadContract(newId);

          // Show Analysis Report
          const analysisReport = document.getElementById('analysis-report');
          if (analysisReport) {
            analysisReport.style.display = 'block';
            analysisReport.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }

          btnText.textContent = 'Analysis Complete';
          submitAnalysisBtn.disabled = false;
          
          setTimeout(() => {
            btnText.textContent = oldBtnText;
            resetUpload();
          }, 1500);
        })
        .catch(err => {
          console.error("Analysis upload failed:", err);
          alert("Analysis failed: " + err.message);
          btnText.textContent = 'Analyze Contract';
          submitAnalysisBtn.disabled = false;
          if (analyzingState) {
            analyzingState.style.display = 'none';
          }
        });
      });
    }
  }
  /**
   * Validate file size/type and update UI states
   */
  function handleUploadedFiles(files) {
    if (files.length === 0) return;
    const file = files[0];

    const allowedExtensions = /(\.pdf|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert('Error: Unsupported format. Please upload a PDF or DOCX file.');
      resetUpload();
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Error: File is too large. Maximum size allowed is 10 MB.');
      resetUpload();
      return;
    }

    if (uploadedFileName) uploadedFileName.textContent = file.name;
    if (uploadedFileSize) uploadedFileSize.textContent = formatBytes(file.size);

    if (uploadDropzone) uploadDropzone.style.display = 'none';
    if (uploadStatusPanel) uploadStatusPanel.style.display = 'block';

    if (uploadProgress) {
      uploadProgress.style.display = 'flex';
      let progress = 0;
      const progressTimer = setInterval(() => {
        progress += 25;
        if (uploadProgressFill) {
          uploadProgressFill.style.width = progress + '%';
        }
        if (uploadPercent) {
          uploadPercent.textContent = progress + '%';
        }

        if (progress >= 100) {
          clearInterval(progressTimer);
          if (uploadSuccess) {
            uploadSuccess.style.display = 'flex';
          }
          if (submitAnalysisBtn) submitAnalysisBtn.disabled = false;
        }
      }, 100);
    }
  }

  /**
   * Reset file input and swap dropzone states back
   */
  function resetUpload() {
    if (contractFileInput) contractFileInput.value = '';
    if (uploadedFileName) uploadedFileName.textContent = '';
    if (uploadedFileSize) uploadedFileSize.textContent = '';
    if (uploadDropzone) uploadDropzone.style.display = 'flex';
    if (uploadStatusPanel) uploadStatusPanel.style.display = 'none';
    if (uploadProgress) {
      uploadProgress.style.display = 'none';
      if (uploadProgressFill) uploadProgressFill.style.width = '0%';
    }
    if (uploadSuccess) uploadSuccess.style.display = 'none';
    if (submitAnalysisBtn) submitAnalysisBtn.disabled = true;
  }

  /**
   * Helper to format raw bytes to human-readable size
   */
  function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Simple debounce utility
   */
  function debounce(fn, delay) {
    let timer;
    return function () {
      const args = arguments;
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  /**
   * Restore persisted preferences from localStorage
   */
  function restorePreferences() {
    const savedCollapsed = localStorage.getItem(STORAGE_KEY_SIDEBAR);
    if (savedCollapsed === 'true' && !isMobile) {
      isSidebarCollapsed = true;
      applySidebarState();
    }

    const savedDarkMode = localStorage.getItem(STORAGE_KEY_DARK_MODE);
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
  }

  /**
   * Initialize application layout and load default state
   */
  function init() {
    restorePreferences();
    setDarkMode(document.body.classList.contains('dark-mode'));
    bindEvents();
    renderHistory();
    loadContract(activeContractId);
    updateHamburgerAria();
  }

  init();
})();
