/**
 * Game Control System
 * Adds Pause, Exit, Restart, and Fullscreen buttons to all games
 * Include this script in any game HTML to enable control overlay
 */

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.gameControlsInitialized) return;
  window.gameControlsInitialized = true;

  // Game state
  let gamePaused = false;
  let gameStarted = false;

  // Create control overlay
  function createControls() {
    const controls = document.createElement('div');
    controls.id = 'game-controls';
    controls.innerHTML = `
      <button id="btn-pause" class="game-control-btn" title="Pause">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
      </button>
      <button id="btn-restart" class="game-control-btn" title="Restart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
      <button id="btn-exit" class="game-control-btn" title="Exit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
      <button id="btn-fullscreen" class="game-control-btn" title="Fullscreen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </svg>
      </button>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #game-controls {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 8px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      #game-container:hover #game-controls,
      body:hover #game-controls {
        opacity: 1;
      }

      .game-control-btn {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .game-control-btn:hover {
        background: rgba(118, 75, 162, 0.9);
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(118, 75, 162, 0.5);
      }

      .game-control-btn:active {
        transform: scale(0.95);
      }

      #pause-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 999;
        border-radius: 12px;
      }

      #pause-overlay.active {
        display: flex;
      }

      #pause-overlay h2 {
        color: white;
        font-size: 48px;
        margin-bottom: 20px;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
      }

      #pause-overlay p {
        color: #ccc;
        font-size: 18px;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(controls);

    // Add pause overlay
    const pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.innerHTML = `
      <h2>⏸ PAUSED</h2>
      <p>Click Resume to continue</p>
    `;
    document.body.appendChild(pauseOverlay);

    // Event listeners
    document.getElementById('btn-pause').addEventListener('click', togglePause);
    document.getElementById('btn-restart').addEventListener('click', restartGame);
    document.getElementById('btn-exit').addEventListener('click', exitGame);
    document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        togglePause();
      }
      if (e.key === 'r' || e.key === 'R') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          restartGame();
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    });
  }

  function togglePause() {
    gamePaused = !gamePaused;
    const overlay = document.getElementById('pause-overlay');
    const pauseBtn = document.getElementById('btn-pause');

    if (gamePaused) {
      overlay.classList.add('active');
      pauseBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="8,5 19,12 8,19"/>
        </svg>
      `;
      // Dispatch pause event
      window.dispatchEvent(new CustomEvent('game-pause', { detail: { paused: true } }));
    } else {
      overlay.classList.remove('active');
      pauseBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
      `;
      // Dispatch resume event
      window.dispatchEvent(new CustomEvent('game-pause', { detail: { paused: false } }));
    }
  }

  function restartGame() {
    // Dispatch restart event
    window.dispatchEvent(new CustomEvent('game-restart'));
    // Auto unpause
    if (gamePaused) {
      gamePaused = false;
      document.getElementById('pause-overlay').classList.remove('active');
    }
  }

  function exitGame() {
    // Try to go back to parent window
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'exitGame' }, '*');
    } else {
      // Fallback to homepage
      window.location.href = '/';
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  // Helper: Check if game is paused
  window.isGamePaused = function() {
    return gamePaused;
  };

  // Helper: Mark game as started
  window.markGameStarted = function() {
    gameStarted = true;
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createControls);
  } else {
    createControls();
  }
})();
