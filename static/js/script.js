/**
 * ContractShield — Main Layout Scripts
 * ContractVerse | Sidebar toggle, dark mode UI, interactions
 */


(function () {
  'use strict';

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
  const contractItems = document.querySelectorAll('.contract-item');

  /* --- Hero & Mockup Elements --- */
  const heroUploadBtn = document.getElementById('heroUploadBtn');
  const heroDemoBtn = document.getElementById('heroDemoBtn');
  const mockRiskProgress = document.getElementById('mockRiskProgress');
  const mockClauses = document.querySelectorAll('.mock-clause');
  const mockCards = document.querySelectorAll('.mock-card--interactive');

  /* --- Upload Section Elements --- */
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


  /* --- Constants --- */
  const MOBILE_BREAKPOINT = 768;
  const STORAGE_KEY_SIDEBAR = 'contractshield-sidebar-collapsed';
  const STORAGE_KEY_DARK_MODE = 'contractshield-dark-mode';

  /* --- State --- */
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

  /**
   * Filter contract list by search query
   */
  function filterContracts() {
    const query = searchInput.value.trim().toLowerCase();

    contractItems.forEach(function (item) {
      const name = item.querySelector('.contract-item__name').textContent.toLowerCase();
      const listItem = item.closest('li');
      listItem.style.display = name.includes(query) ? '' : 'none';
    });
  }

  /**
   * Handle contract item selection
   */
  function handleContractClick(event) {
    contractItems.forEach(function (item) {
      item.classList.remove('is-active');
    });
    event.currentTarget.classList.add('is-active');

    if (isMobile) {
      closeMobileSidebar();
    }
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
   * Handle notification button click (UI only)
   */
  function handleNotificationClick() {
    notificationBtn.classList.add('is-active');
    setTimeout(function () {
      notificationBtn.classList.remove('is-active');
    }, 200);
  }

  /**
   * Handle profile button click (UI only)
   */
  function handleProfileClick() {
    const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
    profileBtn.setAttribute('aria-expanded', String(!isExpanded));
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    hamburgerBtn.addEventListener('click', toggleSidebar);
    sidebarCollapseBtn.addEventListener('click', toggleDesktopSidebar);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    navThemeToggle.addEventListener('click', toggleDarkMode);
    notificationBtn.addEventListener('click', handleNotificationClick);
    profileBtn.addEventListener('click', handleProfileClick);

    sidebarOverlay.addEventListener('click', closeMobileSidebar);

    searchInput.addEventListener('input', filterContracts);

    contractItems.forEach(function (item) {
      item.addEventListener('click', handleContractClick);
    });

    window.addEventListener('resize', debounce(checkMobile, 150));

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (isMobile && sidebar.classList.contains('is-open')) {
          closeMobileSidebar();
        }
      }
    });

    bindMockDashboardEvents();
    bindUploadEvents();
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
   * Animate the circular risk progress bar on mockup dashboard
   */
  function animateMockRiskMeter() {
    if (!mockRiskProgress) return;
    
    // Set timeout to allow transition to trigger after element is rendered
    setTimeout(function () {
      const radius = 40;
      const circumference = 2 * Math.PI * radius; // ~251.2
      const percent = 82;
      const offset = circumference - (percent / 100) * circumference;
      mockRiskProgress.style.strokeDashoffset = String(offset);
    }, 400);
  }

  /**
   * Bind event listeners for interaction inside mockup dashboard
   */
  function bindMockDashboardEvents() {
    mockClauses.forEach(function (clause) {
      const clauseId = clause.getAttribute('data-clause');
      const matchingCard = document.getElementById('mockCard' + clauseId.charAt(0).toUpperCase() + clauseId.slice(1));

      clause.addEventListener('mouseenter', function () {
        if (matchingCard) {
          matchingCard.classList.add('is-focused');
          matchingCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      clause.addEventListener('mouseleave', function () {
        if (matchingCard) {
          matchingCard.classList.remove('is-focused');
        }
      });
    });

    mockCards.forEach(function (card) {
      const clauseId = card.getAttribute('data-clause');
      const matchingClause = document.getElementById('mock' + clauseId.charAt(0).toUpperCase() + clauseId.slice(1));

      card.addEventListener('mouseenter', function () {
        if (matchingClause) {
          matchingClause.classList.add('is-hovered');
          matchingClause.style.background = clauseId === 'clause-1' ? 'rgba(239, 68, 68, 0.07)' : 'rgba(245, 158, 11, 0.07)';
          const tooltip = matchingClause.querySelector('.mock-tooltip');
          if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.transform = 'translateX(-50%) translateY(0)';
          }
        }
      });

      card.addEventListener('mouseleave', function () {
        if (matchingClause) {
          matchingClause.classList.remove('is-hovered');
          matchingClause.style.background = '';
          const tooltip = matchingClause.querySelector('.mock-tooltip');
          if (tooltip) {
            tooltip.style.opacity = '';
            tooltip.style.visibility = '';
            tooltip.style.transform = '';
          }
        }
      });
      
      card.addEventListener('click', function () {
        alert('Suggesting AI redraft for ' + card.querySelector('.mock-card__sub').textContent + '...');
      });
    });
    
    if (heroUploadBtn) {
      heroUploadBtn.addEventListener('click', function () {
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    if (heroDemoBtn) {
      heroDemoBtn.addEventListener('click', function () {
        // Highlight mock dashboard to guide the user
        const dashboard = document.getElementById('mockDashboard');
        if (dashboard) {
          dashboard.style.transform = 'translateY(-12px) scale(1.02)';
          dashboard.style.boxShadow = '0 30px 60px rgba(37, 99, 235, 0.2)';
          setTimeout(function () {
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
    uploadDropzone.addEventListener('click', function (event) {
      if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'BUTTON') {
        contractFileInput.click();
      }
    });

    // Toggle dragover visual states
    ['dragenter', 'dragover'].forEach(function (eventName) {
      uploadDropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        event.stopPropagation();
        uploadDropzone.classList.add('is-dragover');
      }, false);
    });

    ['dragleave', 'dragend', 'drop'].forEach(function (eventName) {
      uploadDropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        event.stopPropagation();
        uploadDropzone.classList.remove('is-dragover');
      }, false);
    });

    // Handle dropped files
    uploadDropzone.addEventListener('drop', function (event) {
      const dt = event.dataTransfer;
      const files = dt.files;
      handleUploadedFiles(files);
    });

    // Handle selected files from dialog
    contractFileInput.addEventListener('change', function () {
      handleUploadedFiles(contractFileInput.files);
    });

    // Handle file removal
    if (removeFileBtn) {
      removeFileBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent click from triggering dropzone browse
        resetUpload();
      });
    }

    // Handle submit simulation
    if (submitAnalysisBtn) {
      submitAnalysisBtn.addEventListener('click', function () {
    
        submitAnalysisBtn.disabled = true;
    
        const btnText = submitAnalysisBtn.querySelector('span');
    
        btnText.textContent = 'Analyzing...';
    
    
        // Show AI analyzing animation
        if (analyzingState) {
          analyzingState.style.display = 'flex';
        }
    
    
        setTimeout(function () {
    
    
          // Hide loading state
          if (analyzingState) {
            analyzingState.style.display = 'none';
          }
    
          // Show Analysis Report
      const analysisReport = document.getElementById('analysis-report');

      if (analysisReport) {
        analysisReport.style.display = 'block';


        // Smooth scroll to report
        analysisReport.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }


      btnText.textContent = 'Analysis Complete';

      submitAnalysisBtn.disabled = false;


    }, 3000);

  });
}
    }  /**
   * Validate file size/type and update UI states
   */
  function handleUploadedFiles(files) {
    if (files.length === 0) return;
    const file = files[0];

    // Validate type: PDF or DOCX
    const allowedExtensions = /(\.pdf|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert('Error: Unsupported format. Please upload a PDF or DOCX file.');
      resetUpload();
      return;
    }

    // Validate size: Max 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Error: File is too large. Maximum size allowed is 10 MB.');
      resetUpload();
      return;
    }

    // Update details card
    if (uploadedFileName) uploadedFileName.textContent = file.name;
    if (uploadedFileSize) uploadedFileSize.textContent = formatBytes(file.size);

    // Swap panel views
    if (uploadDropzone) uploadDropzone.style.display = 'none';
    if (uploadStatusPanel) uploadStatusPanel.style.display = 'block';


  // NEW: fake upload progress (UI only)
  if (uploadProgress) {
    uploadProgress.style.display = 'flex';

    let progress = 0;

    const progressTimer = setInterval(() => {

      progress += 20;

      if (uploadProgressFill) {
        uploadProgressFill.style.width = progress + "%";
      }

      if (uploadPercent) {
        uploadPercent.textContent = progress + "%";
      }


      if (progress >= 100) {

        clearInterval(progressTimer);

        if (uploadSuccess) {
          uploadSuccess.style.display = 'flex';
        }

      }

    }, 150);
  }

      if (submitAnalysisBtn) submitAnalysisBtn.disabled = false;
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
   * Initialize application layout
   */
  function init() {
    restorePreferences();
    setDarkMode(document.body.classList.contains('dark-mode'));
    bindEvents();
    updateHamburgerAria();
    animateMockRiskMeter();
  }


  init();
})();
