/**
 * ARDS Community Connect
 * Small local-only peer connection demo for the prototype.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ards_community_connections_v1';

  function readConnections() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function saveConnections(connections) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
    } catch (error) {
      // The demo still works for the current page if storage is unavailable.
    }
  }

  function refreshButton(button, connected) {
    button.classList.toggle('is-connected', connected);
    button.setAttribute('aria-pressed', String(connected));
    button.innerHTML = connected
      ? '<i data-lucide="check" class="w-4 h-4"></i><span>Request sent</span>'
      : '<i data-lucide="user-plus" class="w-4 h-4"></i><span>Connect</span>';
  }

  function refreshSavedButtons() {
    const connections = readConnections();
    document.querySelectorAll('.community-connect-btn').forEach((button) => {
      refreshButton(button, connections.includes(button.dataset.peer));
    });
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function setupCommunity() {
    const grid = document.getElementById('communityConnections');
    const filter = document.getElementById('communityGoalFilter');
    const empty = document.getElementById('communityEmptyState');
    const status = document.getElementById('communityStatus');

    if (!grid) return;

    grid.addEventListener('click', (event) => {
      const button = event.target.closest('.community-connect-btn');
      if (!button) return;

      const connections = readConnections();
      const peerId = button.dataset.peer;
      const alreadyConnected = connections.includes(peerId);
      const nextConnections = alreadyConnected
        ? connections.filter((id) => id !== peerId)
        : [...connections, peerId];

      saveConnections(nextConnections);
      refreshButton(button, !alreadyConnected);
      if (status) {
        status.textContent = alreadyConnected
          ? 'Connection request removed.'
          : 'Connection request saved on this device.';
        status.classList.add('is-visible');
      }
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });

    if (filter) {
      filter.addEventListener('change', () => {
        const selectedGoal = filter.value;
        let visibleCount = 0;
        grid.querySelectorAll('.community-peer-card').forEach((card) => {
          const visible = selectedGoal === 'all' || card.dataset.goal === selectedGoal;
          card.classList.toggle('hidden', !visible);
          if (visible) visibleCount += 1;
        });
        if (empty) empty.classList.toggle('hidden', visibleCount > 0);
      });
    }

    refreshSavedButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCommunity);
  } else {
    setupCommunity();
  }
})();