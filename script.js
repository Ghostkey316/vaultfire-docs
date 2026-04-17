/* ======================================================
   VAULTFIRE DEVELOPER PORTAL — script.js
   Framework picker, contract tabs, trust checker, nav
   ====================================================== */

(function () {
  'use strict';

  // ── Mobile Nav Toggle ──
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ── Nav background on scroll ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.borderBottomColor = window.scrollY > 20 ? '' : 'transparent';
    }, { passive: true });
  }

  // ── Tab System (generic) ──
  function initTabs(tabSelector, panelSelector, dataAttrTab, dataAttrPanel) {
    const tabs = document.querySelectorAll(tabSelector);
    const panels = document.querySelectorAll(panelSelector);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const value = tab.getAttribute(dataAttrTab);
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        panels.forEach(p => {
          p.classList.toggle('active', p.getAttribute(dataAttrPanel) === value);
        });
        // Re-highlight code in newly visible panel
        if (window.Prism) {
          const activePanel = document.querySelector(`${panelSelector}.active`);
          if (activePanel) Prism.highlightAllUnder(activePanel);
        }
      });
    });
  }

  // Framework tabs
  initTabs('.fw-tab', '.fw-panel', 'data-fw', 'data-panel');
  // Chain tabs
  initTabs('.chain-tab', '.chain-panel', 'data-chain', 'data-cpanel');

  // ── Contract Addresses & RPC Config ──
  const CHAINS = {
    base: {
      rpc: 'https://mainnet.base.org',
      chainId: 8453,
      identity: '0x35978DB675576598F0781dA2133E94cdCf4858bC',
      partnership: '0x01C479F0c039fEC40c0Cf1c5C921bab457d57441',
      reputation: '0xdB54B8925664816187646174bdBb6Ac658A55a5F',
    },
    avalanche: {
      rpc: 'https://api.avax.network/ext/bc/C/rpc',
      chainId: 43114,
      identity: '0x57741F4116925341d8f7Eb3F381d98e07C73B4a3',
      partnership: '0xDC8447c66fE9D9c7D54607A98346A15324b7985D',
      reputation: '0x11C267C8A75B13A4D95357CEF6027c42F8e7bA24',
    },
    arbitrum: {
      rpc: 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
      identity: '0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1',
      partnership: '0xdB54B8925664816187646174bdBb6Ac658A55a5F',
      reputation: '0x8aceF0Bc7e07B2dE35E9069663953f41B5422218',
    },
    polygon: {
      rpc: 'https://polygon-rpc.com',
      chainId: 137,
      identity: '0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1',
      partnership: '0x83dd216449B3F0574E39043ECFE275946fa492e9',
      reputation: '0x8aceF0Bc7e07B2dE35E9069663953f41B5422218',
    },
  };

  // ── ABIs (minimal read-only) ──
  const IDENTITY_ABI = [
    'function isAgentActive(address agent) view returns (bool)',
  ];
  const PARTNERSHIP_ABI = [
    'function getBondsByParticipant(address participant) view returns (uint256[])',
    'function getBond(uint256 bondId) view returns (tuple(address initiator, address partner, uint256 amount, uint256 startTime, uint256 endTime, bool active, uint8 tier))',
  ];
  const REPUTATION_ABI = [
    'function getReputation(address agent) view returns (uint256)',
  ];

  // ── Street Cred Calculator ──
  function calculateStreetCred(isActive, bonds, reputation) {
    let score = 0;
    const breakdown = {};

    // Identity: 30 pts
    breakdown.identity = isActive ? 30 : 0;
    score += breakdown.identity;

    // Has Bond: 25 pts
    const hasBond = bonds.length > 0;
    breakdown.hasBond = hasBond ? 25 : 0;
    score += breakdown.hasBond;

    // Active Bond: 15 pts
    const hasActiveBond = bonds.some(b => b.active);
    breakdown.activeBond = hasActiveBond ? 15 : 0;
    score += breakdown.activeBond;

    // Bond Tier: 20 pts (scaled by highest tier)
    let highestTier = 0;
    bonds.forEach(b => {
      const t = Number(b.tier);
      if (t > highestTier) highestTier = t;
    });
    // Tiers: 0=None, 1=Bronze(5), 2=Silver(10), 3=Gold(15), 4=Platinum(20)
    const tierPts = [0, 5, 10, 15, 20];
    breakdown.bondTier = tierPts[highestTier] || 0;
    score += breakdown.bondTier;

    // Multiple Bonds: 5 pts
    breakdown.multipleBonds = bonds.length > 1 ? 5 : 0;
    score += breakdown.multipleBonds;

    return { score, breakdown };
  }

  function getTierName(score) {
    if (score >= 80) return 'Platinum';
    if (score >= 60) return 'Gold';
    if (score >= 40) return 'Silver';
    if (score >= 20) return 'Bronze';
    return 'None';
  }

  function getTierClass(score) {
    if (score >= 80) return 'tier-platinum';
    if (score >= 60) return 'tier-gold';
    if (score >= 40) return 'tier-silver';
    if (score >= 20) return 'tier-bronze';
    return 'tier-none';
  }

  // ── Trust Checker ──
  const checkBtn = document.getElementById('checkTrustBtn');
  const resultDiv = document.getElementById('checkerResult');

  if (checkBtn) {
    checkBtn.addEventListener('click', async () => {
      const address = document.getElementById('agentAddress').value.trim();
      const chain = document.getElementById('chainSelect').value;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        resultDiv.innerHTML = '<div class="checker-error">Please enter a valid Ethereum address (0x...)</div>';
        return;
      }

      // Check if ethers is loaded
      if (typeof ethers === 'undefined') {
        resultDiv.innerHTML = '<div class="checker-error">ethers.js is still loading. Please wait a moment and try again.</div>';
        return;
      }

      resultDiv.innerHTML = '<div class="checker-loading"><div class="spinner"></div>Querying on-chain data...</div>';

      try {
        const cfg = CHAINS[chain];
        const provider = new ethers.JsonRpcProvider(cfg.rpc);

        const identityContract = new ethers.Contract(cfg.identity, IDENTITY_ABI, provider);
        const partnershipContract = new ethers.Contract(cfg.partnership, PARTNERSHIP_ABI, provider);
        const reputationContract = new ethers.Contract(cfg.reputation, REPUTATION_ABI, provider);

        // Parallel queries
        const [isActive, bondIds, reputation] = await Promise.all([
          identityContract.isAgentActive(address).catch(() => false),
          partnershipContract.getBondsByParticipant(address).catch(() => []),
          reputationContract.getReputation(address).catch(() => 0n),
        ]);

        // Fetch bond details
        const bonds = [];
        const ids = Array.from(bondIds).slice(0, 10); // limit to 10
        for (const id of ids) {
          try {
            const bond = await partnershipContract.getBond(id);
            bonds.push(bond);
          } catch (e) {
            // skip failed bond fetches
          }
        }

        const { score, breakdown } = calculateStreetCred(isActive, bonds, reputation);
        const tier = getTierName(score);
        const tierClass = getTierClass(score);

        const chainName = chain.charAt(0).toUpperCase() + chain.slice(1);

        resultDiv.innerHTML = `
          <div class="trust-result">
            <div class="trust-result-header">
              <div class="trust-score-circle ${tierClass}">
                ${score}
                <small>/ 95</small>
              </div>
              <div class="trust-meta">
                <h4>${tier} Tier</h4>
                <p>Identity: ${isActive ? 'Active' : 'Inactive'} · Bonds: ${bonds.length} · Chain: ${chainName}</p>
              </div>
            </div>
            <div class="trust-breakdown">
              <div class="trust-breakdown-item"><span>Identity</span><span>${breakdown.identity} / 30</span></div>
              <div class="trust-breakdown-item"><span>Has Bond</span><span>${breakdown.hasBond} / 25</span></div>
              <div class="trust-breakdown-item"><span>Active Bond</span><span>${breakdown.activeBond} / 15</span></div>
              <div class="trust-breakdown-item"><span>Bond Tier</span><span>${breakdown.bondTier} / 20</span></div>
              <div class="trust-breakdown-item"><span>Multiple Bonds</span><span>${breakdown.multipleBonds} / 5</span></div>
            </div>
          </div>
        `;
      } catch (err) {
        console.error('Trust check error:', err);
        let message = 'Failed to query on-chain data. ';
        if (err.message && err.message.includes('network')) {
          message += 'Network error — the RPC endpoint may be unavailable.';
        } else if (err.message && err.message.includes('call revert')) {
          message += 'Contract call reverted — the address may not be registered.';
        } else {
          message += err.message || 'Unknown error.';
        }
        resultDiv.innerHTML = `<div class="checker-error">${message}</div>`;
      }
    });
  }

  // ── Highlight code on load ──
  if (window.Prism) {
    Prism.highlightAll();
  } else {
    window.addEventListener('load', () => {
      if (window.Prism) Prism.highlightAll();
    });
  }

})();
