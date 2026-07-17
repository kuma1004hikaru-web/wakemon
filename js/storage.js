/* ============================================================
   Persistent storage helpers (localStorage — works standalone/offline,
   including as an installed PWA)
   ============================================================ */
const GAME_KEY = 'wakemon-game-data';
const COLLECTION_KEY = 'wakemon-collection';

function loadGameData(){
  try{
    const raw = localStorage.getItem(GAME_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    return null; // no save yet, or a corrupted entry — either way, fall back quietly
  }
}
function saveGameData(data){
  try{
    localStorage.setItem(GAME_KEY, JSON.stringify(data));
  }catch(e){
    console.warn('save failed', e);
  }
}
function loadCollection(){
  try{
    const raw = localStorage.getItem(COLLECTION_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}
function saveCollection(col){
  try{
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(col));
  }catch(e){
    console.warn('save failed', e);
  }
}
function deleteAllSaves(){
  try{ localStorage.removeItem(GAME_KEY); }catch(e){}
  try{ localStorage.removeItem(COLLECTION_KEY); }catch(e){}
}

// Debounced save for rapid taps (feeding): collapses many quick saves
// into one, a short pause after the last tap.
let pendingSaveTimer = null;
function flushPendingSave(){
  if (pendingSaveTimer){ clearTimeout(pendingSaveTimer); pendingSaveTimer = null; }
}
function scheduleSaveGameData(){
  flushPendingSave();
  pendingSaveTimer = setTimeout(function(){
    pendingSaveTimer = null;
    saveGameData({ state: STATE, lifetime: LIFETIME });
  }, 450);
}
