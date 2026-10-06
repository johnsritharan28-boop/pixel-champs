(() => {
  // V85 compatibility shim for the direct-DOM V93 build.
  // The core index.html owns the battle buttons and V93 wraps the core
  // attack/newFight functions. Do not replace button.onclick here; doing so
  // bypasses the shared battle state and later V93 battle logic.
  const d = document;
  const version = window.PIXEL_CHAMPS_UI_VERSION || 'V94';
  const heroNote = d.querySelector('.hero .note');
  if (heroNote) heroNote.textContent = heroNote.textContent.replace(/V77|V80|V81|V82|V83|V84|V85/g, 'V93');
  const title = d.querySelector('title');
  if (title) title.textContent = `Pixel Champs ${version} — Cosmic Universe`;
})();
