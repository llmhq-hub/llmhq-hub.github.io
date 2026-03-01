/**
 * Interactive terminal demo for PromptOps + ReleaseOps.
 * Displays pre-recorded demo output with typewriter animation.
 */
(function () {
  "use strict";

  // ── Line classifier ──────────────────────────────────────────────
  function classifyLine(text) {
    var t = text.trimStart();
    if (/^={10,}/.test(t)) return "line-header";
    if (/^-{3,}\s/.test(t)) return "line-section";
    if (/^\+\s/.test(t) || /^\s+\+\s/.test(text)) return "line-ok";
    if (/^!\s/.test(t) || /^\s+!\s/.test(text)) return "line-warn";
    if (/^\*\s/.test(t)) return "line-fail";
    if (/^\s+-\s.*(?:\$50|\$200|Conservative|Permissive|escalate >)/.test(text))
      return "line-diff-remove";
    if (/^\s+\+\s.*(?:\$200|Auto-approve|Escalate any)/.test(text))
      return "line-diff-add";
    if (/sha256:/.test(t)) return "line-dimmed";
    if (/Scenario\s+Amount/.test(t) || /^  -{10,}/.test(text)) return "line-table-header";
    if (/<-- !/.test(t)) return "line-divergent";
    if (/^\s+--\s/.test(text) || /^  ={10,}/.test(text)) return "line-box";
    if (/Act \d:/.test(t)) return "line-header";
    return "";
  }

  // ── Parse raw text into acts ─────────────────────────────────────
  function parseActs(raw) {
    var lines = raw.split("\n");
    var acts = [];
    var current = null;
    var headerPattern = /^\s*Act (\d): (.+)/;
    var introLines = [];
    var summaryLines = [];
    var inIntro = true;
    var inSummary = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // Detect "Demo Complete" section
      if (/Demo Complete/.test(line)) {
        inSummary = true;
        if (current) {
          acts.push(current);
          current = null;
        }
        summaryLines.push(line);
        continue;
      }

      if (inSummary) {
        summaryLines.push(line);
        continue;
      }

      var match = headerPattern.exec(line);
      if (match) {
        if (current) acts.push(current);
        inIntro = false;
        current = {
          id: "act" + match[1],
          label: match[2].trim(),
          num: parseInt(match[1], 10),
          lines: [],
        };
        // Include the === separator and Act header line
        if (i > 0 && /^={10,}/.test(lines[i - 1].trim())) {
          current.lines.push(lines[i - 1]);
        }
        current.lines.push(line);
        continue;
      }

      if (inIntro) {
        introLines.push(line);
      } else if (current) {
        current.lines.push(line);
      }
    }

    if (current) acts.push(current);

    // Trim trailing === from each act that belongs to next act
    acts.forEach(function (act) {
      while (
        act.lines.length > 0 &&
        /^\s*$/.test(act.lines[act.lines.length - 1])
      ) {
        act.lines.pop();
      }
    });

    return {
      intro: {
        id: "intro",
        label: "Intro",
        num: 0,
        lines: introLines,
      },
      acts: acts,
      summary: {
        id: "summary",
        label: "Summary",
        num: 5,
        lines: summaryLines,
      },
    };
  }

  // ── DOM helpers ──────────────────────────────────────────────────
  function $(sel) {
    return document.querySelector(sel);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ── Main ─────────────────────────────────────────────────────────
  var outputEl = $(".terminal-output");
  var statusEl = $(".terminal-status");
  var playBtn = $(".terminal-btn.play-btn");
  var speedSlider = $(".speed-slider");

  if (!outputEl) return;

  var rawContent = ($("#demo-data") || {}).textContent || "";
  var parsed = parseActs(rawContent);
  var allSections = [parsed.intro]
    .concat(parsed.acts)
    .concat([parsed.summary]);

  var activeSection = null;
  var animTimer = null;
  var isPlaying = false;
  var lineIndex = 0;
  var speed = 1;

  // ── Build one continuous stream from all sections ────────────────
  var allLines = [];
  allSections.forEach(function (section) {
    allLines = allLines.concat(section.lines);
    allLines.push(""); // blank separator between sections
  });
  var fullSection = { id: "all", label: "All", num: 0, lines: allLines };

  // ── Start full stream ─────────────────────────────────────────────
  function startFull() {
    stopAnimation();
    activeSection = fullSection;
    lineIndex = 0;
    outputEl.innerHTML = "";
    startAnimation();
  }

  // ── Animation ────────────────────────────────────────────────────
  function getDelay(line) {
    var base = 30;
    var t = line.trim();
    if (/^={10,}/.test(t)) return base * 2;
    if (/^-{3,}\s/.test(t)) return base * 1.5;
    if (/^\s*$/.test(t)) return base * 0.3;
    return base;
  }

  function addLine(text) {
    var lineEl = el("div", "term-line");
    var cls = classifyLine(text);
    if (cls) lineEl.classList.add(cls);

    // Truncate long SHA hashes for display
    var display = text.replace(/(sha256:[a-f0-9]{30})[a-f0-9]+/g, "$1...");
    lineEl.textContent = display;

    outputEl.appendChild(lineEl);

    // Trigger animation
    requestAnimationFrame(function () {
      lineEl.classList.add("visible");
    });

    // Auto-scroll
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function startAnimation() {
    if (!activeSection || isPlaying) return;
    isPlaying = true;
    updatePlayBtn();
    animateNext();
  }

  function animateNext() {
    if (!isPlaying || !activeSection) return;
    if (lineIndex >= activeSection.lines.length) {
      isPlaying = false;
      updatePlayBtn();
      updateStatus("Done");
      return;
    }

    var line = activeSection.lines[lineIndex];
    addLine(line);
    lineIndex++;

    updateStatus(lineIndex + " / " + activeSection.lines.length);

    var delay = getDelay(line) / speed;
    animTimer = setTimeout(animateNext, delay);
  }

  function stopAnimation() {
    isPlaying = false;
    if (animTimer) {
      clearTimeout(animTimer);
      animTimer = null;
    }
    updatePlayBtn();
  }

  function togglePlay() {
    if (isPlaying) {
      stopAnimation();
    } else {
      if (!activeSection || lineIndex >= activeSection.lines.length) {
        // Restart from beginning
        startFull();
      } else {
        startAnimation();
      }
    }
  }

  function showAllInstant() {
    stopAnimation();
    if (!activeSection) return;

    outputEl.innerHTML = "";
    activeSection.lines.forEach(function (line) {
      var lineEl = el("div", "term-line instant visible");
      var cls = classifyLine(line);
      if (cls) lineEl.classList.add(cls);
      var display = line.replace(/(sha256:[a-f0-9]{30})[a-f0-9]+/g, "$1...");
      lineEl.textContent = display;
      outputEl.appendChild(lineEl);
    });

    lineIndex = activeSection.lines.length;
    outputEl.scrollTop = outputEl.scrollHeight;
    updateStatus("Done");
  }

  // ── UI updates ───────────────────────────────────────────────────
  function updatePlayBtn() {
    if (!playBtn) return;
    if (isPlaying) {
      playBtn.textContent = "Pause";
      playBtn.classList.add("playing");
    } else {
      playBtn.textContent = "Play";
      playBtn.classList.remove("playing");
    }
  }

  function updateStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  // ── Event listeners ──────────────────────────────────────────────
  if (playBtn) {
    playBtn.addEventListener("click", togglePlay);
  }

  var skipBtn = $(".terminal-btn.skip-btn");
  if (skipBtn) {
    skipBtn.addEventListener("click", showAllInstant);
  }

  if (speedSlider) {
    speedSlider.addEventListener("input", function () {
      speed = parseFloat(this.value);
      var label = $(".speed-label");
      if (label) label.textContent = speed.toFixed(1) + "x";
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === " ") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "s") {
      showAllInstant();
    }
  });

  // ── Start full continuous stream ─────────────────────────────────
  startFull();
})();
