/**
 * ContractShield ΓÇö Main Layout Scripts
 * ContractVerse | Collapsible sidebar, scanned history, details modal, dark mode UI
 */

(function () {
  'use strict';

  /* --- Dynamic Dummy Database --- */
  let activeContractId = 'h1';
  let activeChatHistory = [];
  let activeClause = null;
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
  const heroExploreBtn = document.getElementById('heroExploreBtn');
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
  const errorPanel = document.getElementById('errorPanel');
  const errorPanelMessage = document.getElementById('errorPanelMessage');
  const retryAnalysisBtn = document.getElementById('retryAnalysisBtn');

  /* --- Constants --- */
  const MOBILE_BREAKPOINT = 768;
  const STORAGE_KEY_SIDEBAR = 'contractshield-sidebar-collapsed';
  const STORAGE_KEY_DARK_MODE = 'contractshield-dark-mode';

  /* --- Layout State --- */
  let isSidebarCollapsed = false;
  let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  /**
   * Enter landing mode - hide sidebar, show full-width homepage
   */
  function enterLandingMode() {
    document.body.classList.add('landing-mode');
    // Sync sidebar collapsed state to landing-mode class
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed-landing');
    }
  }

  /**
   * Exit landing mode - show sidebar, switch to analysis layout
   */
  function exitLandingMode() {
    document.body.classList.remove('landing-mode');
    document.body.classList.remove('sidebar-collapsed-landing');
  }

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
    // Sync landing-mode sidebar collapse class
    if (document.body.classList.contains('landing-mode')) {
      document.body.classList.toggle('sidebar-collapsed-landing', isSidebarCollapsed);
    }
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
    if (darkModeToggle) {
      darkModeToggle.setAttribute('aria-checked', String(isDark));
    }
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
    activeClause = clause;

    modalTitle.textContent = clause.title;
    modalClauseText.textContent = clause.text;
    modalRiskExplanation.textContent = clause.risk;
    modalAiExplanation.textContent = clause.explanation;
    modalRecommendation.innerHTML = '<strong>Recommended Action:</strong> ' + clause.recommendation;

    // Reset severity badge colors
    modalSeverityBadge.className = 'clause-modal-badge';
    modalSeverityBadge.classList.add('badge-' + clause.severity);
    modalSeverityBadge.textContent = clause.severity.toUpperCase() + ' RISK';

    // Reset redraft mode
    const container = clauseDetailModal.querySelector('.clause-modal-container');
    if (container) container.classList.remove('redraft-mode');
    if (modalSuggestRedraftBtn) {
      modalSuggestRedraftBtn.textContent = "Suggest Redraft";
      modalSuggestRedraftBtn.disabled = false;
    }

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

    fetch('/delete/' + id, { method: 'DELETE' })
      .then(response => {
        const index = DUMMY_HISTORY.findIndex(x => x.id === id);
        if (index !== -1) {
          DUMMY_HISTORY.splice(index, 1);
        }
        
        if (activeContractId === id) {
          if (DUMMY_HISTORY.length > 0) {
            loadContract(DUMMY_HISTORY[0].id);
          } else {
            // Return to upload screen
            activeContractId = '';
            renderHistory();
            resetUpload();
            if (analysisReport) analysisReport.style.display = 'none';
            enterLandingMode();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          renderHistory();
        }
      })
      .catch(err => {
        console.error("Failed to delete contract from database:", err);
        alert("Failed to delete contract. Please try again.");
      });
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
    exitLandingMode();
    renderHistory();
    
    // Reset active chat history for the newly loaded contract
    activeChatHistory = [];
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.innerHTML = `
        <div class="chat-message bot">
            <div class="chat-message__bubble">
                Hello! I can answer specific questions about this contract. Try asking:
                <ul>
                    <li><em>"What is the governing law of this agreement?"</em></li>
                    <li><em>"What are my confidentiality obligations?"</em></li>
                    <li><em>"Is there an auto-renewal clause?"</em></li>
                </ul>
            </div>
        </div>
      `;
    }

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

    // 5. Update Full Report Section Header Metadata
    const reportContractName = document.getElementById('reportContractName');
    if (reportContractName) reportContractName.textContent = contract.name;

    const reportUploadDate = document.getElementById('reportUploadDate');
    if (reportUploadDate) reportUploadDate.textContent = contract.date || 'Just now';

    // Populate SaaS Summary Dashboard Grid
    const dbContractType = document.getElementById('dashboardContractType');
    if (dbContractType) dbContractType.textContent = contract.contractType || 'Unknown';

    const dbRiskLevel = document.getElementById('dashboardRiskLevel');
    if (dbRiskLevel) {
      dbRiskLevel.textContent = contract.riskLevel;
      dbRiskLevel.className = `dashboard-card__value severity ${contract.riskScore > 80 ? 'high' : contract.riskScore > 50 ? 'medium' : 'low'}`;
    }

    const dbRiskLevelIcon = document.getElementById('dashboardRiskLevelIcon');
    if (dbRiskLevelIcon) {
      dbRiskLevelIcon.innerHTML = contract.riskScore > 80 
        ? `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
        : contract.riskScore > 50 
        ? `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    }

    const dbRiskScore = document.getElementById('dashboardRiskScore');
    if (dbRiskScore) dbRiskScore.textContent = `${contract.riskScore}%`;

    // Dynamic Segmented Needle Indicator
    const dbRiskNeedle = document.getElementById('dashboardRiskNeedle');
    if (dbRiskNeedle) {
      dbRiskNeedle.style.left = `${contract.riskScore}%`;
    }

    const dbRiskScoreBadge = document.getElementById('dashboardRiskScoreBadge');
    if (dbRiskScoreBadge) {
      dbRiskScoreBadge.textContent = contract.riskLevel ? contract.riskLevel.split(' ')[0] : 'Low';
      dbRiskScoreBadge.className = 'dashboard-card__badge ' + 
        (contract.riskScore > 80 ? 'high' : contract.riskScore > 50 ? 'medium' : 'low');
    }

    // Compute Risk Severity Breakdown
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    if (contract.clauses) {
      contract.clauses.forEach(c => {
        const s = c.severity ? c.severity.toLowerCase() : 'low';
        if (s === 'high') highCount++;
        else if (s === 'medium') mediumCount++;
        else lowCount++;
      });
    }

    const dbRiskBreakdown = document.getElementById('dashboardRiskBreakdown');
    if (dbRiskBreakdown) {
      dbRiskBreakdown.innerHTML = `
        <span class="breakdown-item high">${highCount} High</span>
        <span class="breakdown-item medium">${mediumCount} Med</span>
        <span class="breakdown-item low">${lowCount} Low</span>
      `;
    }

    const dbRiskyClauses = document.getElementById('dashboardRiskyClauses');
    if (dbRiskyClauses) dbRiskyClauses.textContent = contract.clauses.length;

    const dbKeyObligations = document.getElementById('dashboardKeyObligations');
    if (dbKeyObligations) dbKeyObligations.textContent = contract.obligations.length;

    // Helper to generate Action Badges dynamically
    function getActionBadge(recommendation, severity) {
      const recLower = recommendation.toLowerCase();
      let label = 'Review';
      let badgeClass = 'review';
      
      if (recLower.includes('negotiate') || recLower.includes('discuss')) {
        label = 'Negotiate';
        badgeClass = 'negotiate';
      } else if (recLower.includes('remove') || recLower.includes('delete') || severity === 'high') {
        label = 'Needs Attention';
        badgeClass = 'needs-attention';
      } else if (recLower.includes('accept') || recLower.includes('standard') || severity === 'low') {
        label = 'Accept';
        badgeClass = 'accept';
      }
      
      return `<span class="action-badge ${badgeClass}">${label}</span>`;
    }

    // Populate Detected Risks Table
    const tableBody = document.querySelector('#riskyClausesTable tbody');
    if (tableBody) {
      tableBody.innerHTML = '';
      
      if (contract.clauses.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" style="text-align: center; color: var(--color-gray-400);">No risky clauses detected.</td>`;
        tableBody.appendChild(tr);
      } else {
        contract.clauses.forEach(clause => {
          const tr = document.createElement('tr');
          tr.style.cursor = 'pointer';
          
          const severityLabel = clause.severity ? clause.severity.toUpperCase() : 'Not Available';
          const badgeClass = clause.severity ? clause.severity.toLowerCase() : 'low';
          
          tr.innerHTML = `
            <td><strong>${clause.title.split(' (')[0]}</strong></td>
            <td><span class="severity-badge ${badgeClass}">${severityLabel}</span></td>
            <td>${clause.risk}</td>
            <td style="display: flex; align-items: center; gap: 4px;">
              ${getActionBadge(clause.recommendation, badgeClass)}
              <span>${clause.recommendation.split('. ')[0]}.</span>
            </td>
          `;
          
          tr.addEventListener('click', () => openClauseModal(clause));
          tableBody.appendChild(tr);
        });
      }
    }

    const summaryParagraph = document.getElementById('reportSummaryText');
    if (summaryParagraph) {
      summaryParagraph.textContent = contract.summary;
    }

    // Populate Executive Summary Card Assessment Badge & Insights
    const dbSummaryBadge = document.getElementById('summaryAssessmentBadge');
    if (dbSummaryBadge) {
      const isHigh = contract.riskScore >= 70;
      const isMedium = contract.riskScore >= 30;
      
      dbSummaryBadge.textContent = isHigh ? 'High Risk' : isMedium ? 'Needs Review' : 'Safe to Sign';
      dbSummaryBadge.className = 'summary-card__assessment-badge ' + (isHigh ? 'high' : isMedium ? 'medium' : 'low');
    }

    const dbSummaryInsights = document.getElementById('summaryInsightsList');
    if (dbSummaryInsights) {
      dbSummaryInsights.innerHTML = `
        <div class="insight-pill">
          <span class="insight-pill__label">Type:</span>
          <span class="insight-pill__value">${contract.contractType || 'Unknown'}</span>
        </div>
        <div class="insight-pill">
          <span class="insight-pill__label">Flagged Issues:</span>
          <span class="insight-pill__value">${contract.clauses ? contract.clauses.length : 0}</span>
        </div>
        <div class="insight-pill">
          <span class="insight-pill__label">Obligations:</span>
          <span class="insight-pill__value">${contract.obligations ? contract.obligations.length : 0}</span>
        </div>
      `;
    }

    const suggestionContainer = document.getElementById('reportSuggestionsContainer');
    if (suggestionContainer) {
      suggestionContainer.innerHTML = '';
      if (contract.clauses && contract.clauses.length > 0) {
        contract.clauses.forEach(clause => {
          const card = document.createElement('div');
          card.className = 'suggestion-card';
          
          card.innerHTML = `
            <div class="suggestion-card__icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="suggestion-card__content">
              <span class="suggestion-card__title">${clause.recommendation.split('. ')[0]}.</span>
              <p class="suggestion-card__explanation">${clause.risk}</p>
            </div>
          `;
          suggestionContainer.appendChild(card);
        });
      } else {
        suggestionContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-gray-400); padding: 24px;">No suggestions needed.</div>`;
      }
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
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
    if (sidebarCollapseBtn) sidebarCollapseBtn.addEventListener('click', toggleDesktopSidebar);
    if (searchInput) searchInput.addEventListener('input', filterContracts);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);

    // New Analysis button resets UI to upload view
    if (sidebarNewBtn) {
      sidebarNewBtn.addEventListener('click', () => {
        activeContractId = '';
        renderHistory();
        resetUpload();
        if (analysisReport) analysisReport.style.display = 'none';
        enterLandingMode();

        if (isMobile) {
          closeMobileSidebar();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        const container = clauseDetailModal.querySelector('.clause-modal-container');
        if (!container) return;
        
        const isRedraftMode = container.classList.toggle('redraft-mode');
        
        if (isRedraftMode) {
          modalSuggestRedraftBtn.textContent = "Back to Analysis";
          
          // Clear text with loader
          const consText = document.getElementById('redraftConservativeText');
          const neutText = document.getElementById('redraftNeutralText');
          const aggText = document.getElementById('redraftAggressiveText');
          
          if (consText) consText.textContent = "Generating conservative alternative...";
          if (neutText) neutText.textContent = "Generating neutral compromise...";
          if (aggText) aggText.textContent = "Generating aggressive stance...";
          
          // Call API
          fetch('/redraft', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              clause_text: activeClause ? activeClause.text : '',
              risk_reason: activeClause ? activeClause.risk : ''
            })
          })
          .then(response => {
            if (!response.ok) {
              return response.json().then(err => { throw new Error(err.error || "Server error"); });
            }
            return response.json();
          })
          .then(data => {
            if (consText) consText.textContent = data.conservative || "Failed to generate revision.";
            if (neutText) neutText.textContent = data.neutral || "Failed to generate revision.";
            if (aggText) aggText.textContent = data.aggressive || "Failed to generate revision.";
          })
          .catch(err => {
            if (consText) consText.textContent = `⚠️ Error: ${err.message}`;
            if (neutText) neutText.textContent = `⚠️ Error: ${err.message}`;
            if (aggText) aggText.textContent = `⚠️ Error: ${err.message}`;
          });
        } else {
          modalSuggestRedraftBtn.textContent = "Suggest Redraft";
        }
      });
    }

    // Copy Redraft suggestions inside modal via event delegation
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.redraft-card__copy');
      if (!copyBtn) return;
      
      const targetId = copyBtn.getAttribute('data-target');
      const textElement = document.getElementById(targetId);
      if (!textElement) return;
      
      const textToCopy = textElement.textContent;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          const oldText = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = oldText;
            copyBtn.classList.remove('copied');
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy redraft: ", err);
          alert("Failed to copy redraft text.");
        });
    });

    // Retry Analysis Event
    if (retryAnalysisBtn) {
      retryAnalysisBtn.addEventListener('click', () => {
        hideErrorPanel();
        if (submitAnalysisBtn) {
          submitAnalysisBtn.click();
        }
      });
    }

    // Copy Analysis Report to Clipboard Click Event
    const copyReportBtn = document.getElementById('copyReportBtn');
    if (copyReportBtn) {
      copyReportBtn.addEventListener('click', () => {
        const contract = DUMMY_HISTORY.find(x => x.id === activeContractId) || DUMMY_HISTORY[0];
        if (!contract) return;

        copyReportBtn.disabled = true;
        const btnText = copyReportBtn.querySelector('.report-download-btn__text');
        const oldText = btnText ? btnText.textContent : 'Copy Results';

        const reportText = `--------------------------------------------
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

        navigator.clipboard.writeText(reportText)
          .then(() => {
            if (btnText) btnText.textContent = 'Copied to Clipboard!';
            copyReportBtn.classList.add('is-success');
            setTimeout(() => {
              if (btnText) btnText.textContent = oldText;
              copyReportBtn.classList.remove('is-success');
              copyReportBtn.disabled = false;
            }, 2000);
          })
          .catch(err => {
            console.error("Clipboard copy failed:", err);
            alert("Failed to copy report to clipboard.");
            copyReportBtn.disabled = false;
          });
      });
    }

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

          // Generate true binary PDF using jsPDF
          try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const margin = 15;
            const contentWidth = 180;
            let y = 25;

            function checkPageBound(neededHeight) {
              if (y + neededHeight > 272) {
                doc.addPage();
                y = 25;
              }
            }

            // ==========================================
            // PAGE 1: COVER PAGE
            // ==========================================
            doc.setFillColor(248, 249, 250);
            doc.rect(margin, 20, contentWidth, 250, 'F');
            doc.setDrawColor(229, 231, 235);
            doc.rect(margin, 20, contentWidth, 250, 'S');

            // Header Banner
            doc.setFillColor(28, 28, 26); // Match branding color-dark navy
            doc.rect(margin, 20, contentWidth, 60, 'F');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(250, 250, 247);
            doc.text("CONTRACT ANALYSIS REPORT", 105, 45, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(156, 163, 175);
            doc.text("ContractShield  |  YOUR TRUSTED LEGAL AID", 105, 55, { align: "center" });

            // Report Metadata Card
            doc.setFillColor(255, 255, 255);
            doc.rect(20, 95, 170, 70, 'F');
            doc.setDrawColor(229, 231, 235);
            doc.rect(20, 95, 170, 70, 'S');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(28, 28, 26);
            doc.text("REPORT METADATA", 25, 107);
            doc.line(25, 111, 185, 111);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(107, 114, 128);
            doc.text("Contract File:", 25, 121);
            doc.text("Analysis Date:", 25, 129);
            doc.text("Contract Type:", 25, 137);
            doc.text("AI Confidence Score:", 25, 145);
            doc.text("Analysis Status:", 25, 153);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(28, 28, 26);
            
            const cleanContractName = contract.name.replace(/[^\x00-\x7F]/g, "").trim();
            doc.text(cleanContractName, 70, 121);
            doc.text(contract.date || new Date().toLocaleDateString(), 70, 129);
            doc.text(contract.contractType || "General", 70, 137);
            doc.text("98.4% (Optimal)", 70, 145);
            doc.text("Analysis Completed", 70, 153);

            // Risk Overview Section on Cover
            const isHigh = contract.riskScore >= 70;
            const isMedium = contract.riskScore >= 30;
            const levelText = isHigh ? "HIGH RISK" : isMedium ? "NEEDS REVIEW" : "SAFE TO SIGN";
            const levelColor = isHigh ? [220, 38, 38] : isMedium ? [217, 119, 6] : [22, 163, 74];

            doc.setFillColor(255, 255, 255);
            doc.rect(20, 180, 170, 60, 'F');
            doc.setDrawColor(levelColor[0], levelColor[1], levelColor[2]);
            doc.rect(20, 180, 170, 60, 'S');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(107, 114, 128);
            doc.text("OVERALL CONTRACT RISK RATINGS", 25, 192);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(36);
            doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
            doc.text(`${contract.riskScore}%`, 25, 230);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.text(levelText, 85, 212);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(107, 114, 128);
            const detailLines = doc.splitTextToSize("Primary recommendation rating for this agreement based on AI legal parsing. Check detailed concerns below before proceeding.", 100);
            doc.text(detailLines, 85, 221);

            // Disclaimer on Cover
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text("Disclaimer: ContractShield provides automated scanning. Not a substitute for formal legal counsel.", 105, 262, { align: "center" });

            // ==========================================
            // PAGE 2: SUMMARY & OBLIGATIONS TABLE
            // ==========================================
            doc.addPage();
            y = 25;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(28, 28, 26);
            doc.text("1. Executive Summary & Assessment", margin, y);
            y += 8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(55, 65, 81);
            
            const cleanSummary = contract.summary.replace(/[^\x00-\x7F]/g, "").trim();
            const summaryLines = doc.splitTextToSize(cleanSummary, contentWidth);
            doc.text(summaryLines, margin, y);
            y += (summaryLines.length * 5.2) + 12;

            // Key Obligations Table
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(28, 28, 26);
            doc.text("2. Key Obligations Table Checklist", margin, y);
            y += 8;

            // Draw Table Header
            doc.setFillColor(243, 244, 246);
            doc.rect(margin, y, contentWidth, 8, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81);
            doc.text("Obligation Covenant Description", margin + 4, y + 5);
            doc.text("Compliance Status", margin + 115, y + 5);
            doc.text("Check Level", margin + 150, y + 5);
            y += 8;

            contract.obligations.forEach(ob => {
              const cleanObName = ob.name.replace(/[^\x00-\x7F]/g, "").trim();
              const nameLines = doc.splitTextToSize(cleanObName, 105);
              const rowHeight = Math.max(8, nameLines.length * 5);

              checkPageBound(rowHeight + 4);

              doc.setFont("helvetica", "normal");
              doc.setFontSize(8.5);
              doc.setTextColor(75, 85, 99);
              doc.text(nameLines, margin + 4, y + 4);
              doc.text(ob.status || "Active", margin + 115, y + 4);
              doc.text("Required Check", margin + 150, y + 4);

              doc.setDrawColor(243, 244, 246);
              doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);
              y += rowHeight;
            });

            y += 12;

            // ==========================================
            // PAGE 3: DETAILED CLAUSE RISKS CARDS
            // ==========================================
            checkPageBound(40);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(28, 28, 26);
            doc.text("3. Detected Risks & Recommended Actions", margin, y);
            y += 8;

            contract.clauses.forEach((clause, index) => {
              const cleanRisk = clause.risk.replace(/[^\x00-\x7F]/g, "").trim();
              const whyItMattersLines = doc.splitTextToSize(cleanRisk, 160);
              
              const recClean = (clause.recommendation || clause.explanation || "").replace(/Recommendation:\s*/i, "");
              const cleanRec = recClean.replace(/[^\x00-\x7F]/g, "").trim();
              const recLines = doc.splitTextToSize(cleanRec, 160);

              const cardContentHeight = 6 + 6 + (whyItMattersLines.length * 4.5) + (recLines.length * 4.5) + 18;
              checkPageBound(cardContentHeight);

              // Draw Card Background
              doc.setFillColor(255, 255, 255);
              doc.setDrawColor(229, 231, 235);
              doc.rect(margin, y, contentWidth, cardContentHeight - 5, 'FD');

              // Color-coded left indicator bar
              const sev = clause.severity ? clause.severity.toLowerCase() : 'low';
              const sColor = sev === 'high' ? [220, 38, 38] : sev === 'medium' ? [217, 119, 6] : [22, 163, 74];
              doc.setFillColor(sColor[0], sColor[1], sColor[2]);
              doc.rect(margin, y, 4, cardContentHeight - 5, 'F');

              let innerY = y + 6;

              // Title
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.setTextColor(28, 28, 26);
              const cleanTitle = clause.title.replace(/[^\x00-\x7F]/g, "").replace(/[\u26A0\u2705\u2714\u2611\u26A1]/g, '').trim();
              doc.text(`${index + 1}. ${cleanTitle}`, margin + 8, innerY);

              // Severity
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(sColor[0], sColor[1], sColor[2]);
              doc.text(sev.toUpperCase(), margin + 155, innerY);

              innerY += 7;

              // Why it matters
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8.5);
              doc.setTextColor(107, 114, 128);
              doc.text("POTENTIAL RISK & CONCERN:", margin + 8, innerY);
              innerY += 4.5;

              doc.setFont("helvetica", "normal");
              doc.setFontSize(8.5);
              doc.setTextColor(55, 65, 81);
              doc.text(whyItMattersLines, margin + 8, innerY);
              innerY += (whyItMattersLines.length * 4.5) + 3;

              // Action recommendation
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8.5);
              doc.setTextColor(107, 114, 128);
              doc.text("RECOMMENDED NEGOTIATION / REVISION:", margin + 8, innerY);
              innerY += 4.5;

              doc.setFont("helvetica", "normal");
              doc.setFontSize(8.5);
              doc.setTextColor(55, 65, 81);
              doc.text(recLines, margin + 8, innerY);

              y += cardContentHeight + 3;
            });

            // ==========================================
            // PAGE 4: QUESTIONS & NEGOTIATION TIPS
            // ==========================================
            checkPageBound(60);
            y += 8;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(28, 28, 26);
            doc.text("4. Questions to Ask Before Signing", margin, y);
            y += 8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81);

            const questionsList = [
              "Are there any mutual caps on liability that can be negotiated?",
              "Does the governing law align with your local state or country?",
              "Can the intellectual property assignment terms be restricted only to deliverable items?",
              "Is there a clear termination clause for convenience with a standard notice period?"
            ];

            questionsList.forEach(q => {
              checkPageBound(10);
              const qLines = doc.splitTextToSize("-  " + q, contentWidth - 10);
              doc.text(qLines, margin + 4, y);
              y += (qLines.length * 5) + 2;
            });

            y += 8;
            checkPageBound(40);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(28, 28, 26);
            doc.text("5. Negotiation Guidelines & Tips", margin, y);
            y += 8;

            const negotiationTipsList = [
              "Ensure liability clauses are mutual rather than unilateral.",
              "Verify governing laws match your primary place of business operation.",
              "Request written exceptions or schedules for IP transfers before signing."
            ];

            negotiationTipsList.forEach((tip, idx) => {
              checkPageBound(10);
              const tipLines = doc.splitTextToSize(`${idx + 1}.  ${tip}`, contentWidth - 10);
              doc.text(tipLines, margin + 4, y);
              y += (tipLines.length * 5) + 2;
            });

            y += 8;
            checkPageBound(50);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(28, 28, 26);
            doc.text("6. Legal Terms Glossary (Plain English)", margin, y);
            y += 8;

            const glossaryList = [
              ["Indemnity", "An obligation to compensate another party for losses or damages incurred."],
              ["Limitation of Liability", "A cap on the maximum financial damages a party is responsible for under the contract."],
              ["Governing Law", "The jurisdiction and legal framework that will govern dispute resolutions."]
            ];

            glossaryList.forEach(item => {
              checkPageBound(12);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9);
              doc.setTextColor(28, 28, 26);
              doc.text(item[0] + ": ", margin + 4, y);
              const labelWidth = doc.getTextWidth(item[0] + ": ");

              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(75, 85, 99);
              const glLines = doc.splitTextToSize(item[1], contentWidth - 12 - labelWidth);
              doc.text(glLines, margin + 4 + labelWidth, y);

              y += (glLines.length * 5) + 3;
            });

            // Loop through all pages to draw header/footer dynamically
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              doc.setPage(i);
              
              if (i > 1) {
                // Top Header line
                doc.setDrawColor(229, 231, 235);
                doc.setLineWidth(0.5);
                doc.line(margin, 12, 195, 12);
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(156, 163, 175);
                doc.text("ContractShield - Enterprise Contract Analysis Report", margin, 9);
                doc.text("CONFIDENTIAL", 195, 9, { align: "right" });
                
                // Bottom Footer line
                doc.line(margin, 280, 195, 280);
                doc.text("ContractShield (c) 2026. Powered by AI Legal Intelligence.", margin, 285);
                doc.text(`Page ${i} of ${totalPages}`, 195, 285, { align: "right" });
              }
            }

            // Save PDF File
            doc.save(contract.name.replace(/\.[^/.]+$/, "") + "_Analysis_Report.pdf");
          } catch (pdfErr) {
            console.error("PDF generation error:", pdfErr);
            alert("An error occurred while generating the PDF document.");
          }

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

    // Chat Interface Bindings
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    
    if (chatSendBtn && chatInput) {
      const sendChat = () => {
        const text = chatInput.value.trim();
        if (!text) return;
        
        appendChatMessage("user", text);
        chatInput.value = '';
        
        const loadingBubble = appendChatMessage("bot", "Thinking...", true);
        
        fetch('/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contract_id: activeContractId,
            question: text,
            chat_history: activeChatHistory
          })
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || "Server error"); });
          }
          return response.json();
        })
        .then(data => {
          loadingBubble.remove();
          appendChatMessage("bot", data.answer);
          activeChatHistory.push({ sender: 'user', text: text });
          activeChatHistory.push({ sender: 'bot', text: data.answer });
        })
        .catch(err => {
          loadingBubble.remove();
          appendChatMessage("bot", `⚠️ Error: ${err.message}`);
        });
      };
      
      chatSendBtn.addEventListener('click', sendChat);
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendChat();
        }
      });
    }
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

    if (heroExploreBtn) {
      heroExploreBtn.addEventListener('click', () => {
        const howItWorks = document.getElementById('howItWorks');
        if (howItWorks) {
          howItWorks.scrollIntoView({ behavior: 'smooth' });
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

        hideErrorPanel();

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

          // Prepend the new database record directly to history
          DUMMY_HISTORY.unshift(analysis);

          activeContractId = analysis.id;
          renderHistory();
          loadContract(analysis.id);

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
          showErrorPanel(err.message);
          btnText.textContent = 'Analyze Contract';
          submitAnalysisBtn.disabled = false;
          if (analyzingState) {
            analyzingState.style.display = 'none';
          }
        });
      });
    }

    function resetUploadProgressSuccess() {
      if (uploadProgress) {
        uploadProgress.style.display = 'none';
        if (uploadProgressFill) uploadProgressFill.style.width = '0%';
      }
      if (uploadSuccess) {
        uploadSuccess.style.display = 'none';
      }
    }

    function runCompareUploadSimulation(fileName, successMessage, onComplete) {
      if (uploadProgress) {
        uploadProgress.style.display = 'flex';
        if (uploadSuccess) uploadSuccess.style.display = 'none';
        if (uploadProgressFill) uploadProgressFill.style.width = '0%';
        if (uploadPercent) uploadPercent.textContent = '0%';
        
        let progress = 0;
        const progressTimer = setInterval(() => {
          progress += 25;
          if (uploadProgressFill) uploadProgressFill.style.width = progress + '%';
          if (uploadPercent) uploadPercent.textContent = progress + '%';

          if (progress >= 100) {
            clearInterval(progressTimer);
            uploadProgress.style.display = 'none';
            if (uploadSuccess) {
              uploadSuccess.textContent = successMessage;
              uploadSuccess.style.display = 'flex';
            }
            if (onComplete) onComplete();
          }
        }, 100);
      } else {
        if (onComplete) onComplete();
      }
    }

    // Tab Switching logic
    const tabSingle = document.getElementById('tabSingle');
    const tabCompare = document.getElementById('tabCompare');
    const singleUploadContainer = document.getElementById('singleUploadContainer');
    const compareUploadContainer = document.getElementById('compareUploadContainer');
    
    if (tabSingle && tabCompare) {
      tabSingle.addEventListener('click', () => {
        tabSingle.classList.add('active');
        tabCompare.classList.remove('active');
        singleUploadContainer.style.display = 'block';
        compareUploadContainer.style.display = 'none';
        resetUploadProgressSuccess();
        
        // Hide comparison report, show single analysis if active
        const compareReport = document.getElementById('compare-report');
        if (compareReport) compareReport.style.display = 'none';
        if (activeContractId) {
          const analysisReport = document.getElementById('analysis-report');
          if (analysisReport) analysisReport.style.display = 'block';
        }
      });
      
      tabCompare.addEventListener('click', () => {
        tabCompare.classList.add('active');
        tabSingle.classList.remove('active');
        singleUploadContainer.style.display = 'none';
        compareUploadContainer.style.display = 'block';
        resetUploadProgressSuccess();
        
        // Hide single report, show comparison if active
        const analysisReport = document.getElementById('analysis-report');
        if (analysisReport) analysisReport.style.display = 'none';
        const compareReport = document.getElementById('compare-report');
        if (compareReport && compareReport.getAttribute('data-active') === 'true') {
          compareReport.style.display = 'block';
        }
      });
    }

    // Compare uploads logic
    const draftFileInput = document.getElementById('draftFileInput');
    const playbookFileInput = document.getElementById('playbookFileInput');
    const draftDropzone = document.getElementById('draftDropzone');
    const playbookDropzone = document.getElementById('playbookDropzone');
    const draftStatusText = document.getElementById('draftStatusText');
    const playbookStatusText = document.getElementById('playbookStatusText');
    const startCompareBtn = document.getElementById('startCompareBtn');

    if (draftDropzone && draftFileInput) {
      draftDropzone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'LABEL' && e.target.tagName !== 'BUTTON') {
          draftFileInput.click();
        }
      });
      draftFileInput.addEventListener('change', () => {
        const file = draftFileInput.files[0];
        if (file) {
          runCompareUploadSimulation(file.name, "✓ Draft contract uploaded successfully", () => {
            draftStatusText.innerHTML = `<strong>Selected Draft:</strong> ${file.name}`;
            checkCompareReady();
          });
        }
      });
      ['dragenter', 'dragover'].forEach(name => {
        draftDropzone.addEventListener(name, (e) => {
          e.preventDefault(); e.stopPropagation();
          draftDropzone.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach(name => {
        draftDropzone.addEventListener(name, (e) => {
          e.preventDefault(); e.stopPropagation();
          draftDropzone.classList.remove('is-dragover');
        });
      });
      draftDropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          draftFileInput.files = files;
          runCompareUploadSimulation(files[0].name, "✓ Draft contract uploaded successfully", () => {
            draftStatusText.innerHTML = `<strong>Selected Draft:</strong> ${files[0].name}`;
            checkCompareReady();
          });
        }
      });
    }

    if (playbookDropzone && playbookFileInput) {
      playbookDropzone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'LABEL' && e.target.tagName !== 'BUTTON') {
          playbookFileInput.click();
        }
      });
      playbookFileInput.addEventListener('change', () => {
        const file = playbookFileInput.files[0];
        if (file) {
          runCompareUploadSimulation(file.name, "✓ Playbook contract uploaded successfully", () => {
            playbookStatusText.innerHTML = `<strong>Selected Playbook:</strong> ${file.name}`;
            checkCompareReady();
          });
        }
      });
      ['dragenter', 'dragover'].forEach(name => {
        playbookDropzone.addEventListener(name, (e) => {
          e.preventDefault(); e.stopPropagation();
          playbookDropzone.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach(name => {
        playbookDropzone.addEventListener(name, (e) => {
          e.preventDefault(); e.stopPropagation();
          playbookDropzone.classList.remove('is-dragover');
        });
      });
      playbookDropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          playbookFileInput.files = files;
          runCompareUploadSimulation(files[0].name, "✓ Playbook contract uploaded successfully", () => {
            playbookStatusText.innerHTML = `<strong>Selected Playbook:</strong> ${files[0].name}`;
            checkCompareReady();
          });
        }
      });
    }

    function checkCompareReady() {
      if (draftFileInput.files[0] && playbookFileInput.files[0]) {
        startCompareBtn.removeAttribute('disabled');
      } else {
        startCompareBtn.setAttribute('disabled', 'true');
      }
    }

    if (startCompareBtn) {
      startCompareBtn.addEventListener('click', () => {
        const draftFile = draftFileInput.files[0];
        const playbookFile = playbookFileInput.files[0];
        if (!draftFile || !playbookFile) return;
        
        startCompareBtn.disabled = true;
        const btnText = startCompareBtn.querySelector('span');
        const oldBtnText = btnText ? btnText.textContent : 'Compare';
        if (btnText) btnText.textContent = 'Comparing...';
        
        if (analyzingState) {
          const loadingText = analyzingState.querySelector('.analyzing-state__text');
          if (loadingText) loadingText.textContent = "Comparing Documents with Playbook...";
          analyzingState.style.display = 'flex';
        }
        
        hideErrorPanel();
        
        const formData = new FormData();
        formData.append('draft', draftFile);
        formData.append('template', playbookFile);
        
        fetch('/compare', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              throw new Error(data.error || 'Server error occurred during comparison.');
            });
          }
          return response.json();
        })
        .then(data => {
          if (analyzingState) analyzingState.style.display = 'none';
          
          // Render comparison report
          const compareReport = document.getElementById('compare-report');
          const summaryText = document.getElementById('compareSummaryText');
          const matchesList = document.getElementById('compareMatchesList');
          const deviationsBody = document.getElementById('compareDeviationsTableBody');
          
          if (summaryText) summaryText.textContent = data.summary || 'No differences identified.';
          
          if (matchesList) {
            matchesList.innerHTML = '';
            const matches = data.matches || [];
            if (matches.length === 0) {
              matchesList.innerHTML = '<li>No exact playbook matches identified.</li>';
            } else {
              matches.forEach(m => {
                const li = document.createElement('li');
                li.textContent = m;
                matchesList.appendChild(li);
              });
            }
          }
          
          if (deviationsBody) {
            deviationsBody.innerHTML = '';
            const deviations = data.deviations || [];
            if (deviations.length === 0) {
              deviationsBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--color-gray-500);">No deviations detected. Contract aligns with playbook standard.</td></tr>';
            } else {
              deviations.forEach(dev => {
                const tr = document.createElement('tr');
                
                const tdCat = document.createElement('td');
                tdCat.innerHTML = `<strong>${dev.clause}</strong><br><small style="color: var(--color-gray-500); font-family: var(--font-mono);">${dev.location || 'Unknown location'}</small>`;
                
                const tdOriginal = document.createElement('td');
                tdOriginal.textContent = dev.original || 'Missing';
                
                const tdTemplate = document.createElement('td');
                tdTemplate.textContent = dev.template || 'Standard template wording';
                
                const tdRisk = document.createElement('td');
                tdRisk.innerHTML = `<span style="color: var(--color-accent); font-weight: 600;">Risk:</span> ${dev.risk}<br><br><span style="color: #22c55e; font-weight: 600;">Recommendation:</span> ${dev.recommendation}`;
                
                tr.appendChild(tdCat);
                tr.appendChild(tdOriginal);
                tr.appendChild(tdTemplate);
                tr.appendChild(tdRisk);
                
                deviationsBody.appendChild(tr);
              });
            }
          }
          
          if (compareReport) {
            compareReport.style.display = 'block';
            compareReport.setAttribute('data-active', 'true');
            compareReport.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          
          // Hide single report if visible
          const singleReport = document.getElementById('analysis-report');
          if (singleReport) singleReport.style.display = 'none';
          
          if (btnText) btnText.textContent = oldBtnText;
          startCompareBtn.disabled = false;
          
          // Reset compare fields
          draftFileInput.value = '';
          playbookFileInput.value = '';
          draftStatusText.textContent = "Drag Draft file here, or click to browse";
          playbookStatusText.textContent = "Drag Playbook here, or click to browse";
          startCompareBtn.setAttribute('disabled', 'true');
        })
        .catch(err => {
          console.error("Comparison failed:", err);
          showErrorPanel(err.message);
          if (btnText) btnText.textContent = oldBtnText;
          startCompareBtn.disabled = false;
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
  }  function showErrorPanel(message) {
    if (errorPanel && errorPanelMessage) {
      errorPanelMessage.textContent = message;
      errorPanel.style.display = 'flex';
      errorPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function hideErrorPanel() {
    if (errorPanel) {
      errorPanel.style.display = 'none';
    }
  }

  function resetUpload() {
    hideErrorPanel();
    if (contractFileInput) contractFileInput.value = '';
    if (uploadedFileName) uploadedFileName.textContent = '';
    if (uploadedFileSize) uploadedFileSize.textContent = '';
    if (uploadDropzone) uploadDropzone.style.display = 'flex';
    if (uploadStatusPanel) uploadStatusPanel.style.display = 'none';
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
  /**
   * Fetch all past analyses from database and populate DUMMY_HISTORY
   */
  function loadHistoryFromDatabase(callback) {
    fetch('/history')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          DUMMY_HISTORY.length = 0;
          data.forEach(item => DUMMY_HISTORY.push(item));
          renderHistory();
          if (DUMMY_HISTORY.length > 0) {
            loadContract(DUMMY_HISTORY[0].id);
          } else {
            resetUpload();
            if (analysisReport) analysisReport.style.display = 'none';
            enterLandingMode();
          }
        }
        if (callback) callback();
      })
      .catch(err => {
        console.error("Failed to fetch scan history:", err);
        if (callback) callback();
      });
  }

  function appendChatMessage(sender, text, isLoading = false) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;
    
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    if (isLoading) div.classList.add('loading');
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-message__bubble';
    
    if (sender === 'bot' && !isLoading) {
      let formattedText = text
        .replace(/\n/g, '<br>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\* ([^*]+)/g, '<li>$1</li>');
      bubble.innerHTML = formattedText;
    } else {
      bubble.textContent = text;
    }
    
    div.appendChild(bubble);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return div;
  }

  /**
   * Typewriter effect for the main hero heading
   */
  function initTypewriter() {
    const titleEl = document.querySelector('.hero__title');
    if (!titleEl) return;
    
    const line1 = "Understand Legal Risks";
    const line2 = "Before You Sign";
    
    // Clear and structure elements
    titleEl.innerHTML = '';
    
    const span1 = document.createElement('span');
    span1.className = 'typewriter-line-1';
    titleEl.appendChild(span1);
    
    const br = document.createElement('br');
    titleEl.appendChild(br);
    
    const span2 = document.createElement('span');
    span2.className = 'hero__title-gradient typewriter-line-2';
    titleEl.appendChild(span2);
    
    let charIndex1 = 0;
    let charIndex2 = 0;
    
    function typeLine1() {
      if (charIndex1 < line1.length) {
        span1.textContent += line1.charAt(charIndex1);
        charIndex1++;
        setTimeout(typeLine1, 40);
      } else {
        typeLine2();
      }
    }
    
    function typeLine2() {
      if (charIndex2 < line2.length) {
        span2.textContent += line2.charAt(charIndex2);
        charIndex2++;
        setTimeout(typeLine2, 50);
      }
    }
    
    typeLine1();
  }

  function init() {
    // Always dark mode
    document.body.classList.add('dark-mode');
    enterLandingMode();
    bindEvents();
    initTypewriter();
    loadHistoryFromDatabase();
  }

  init();
})();
