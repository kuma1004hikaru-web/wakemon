// Every collectible final-form slot across all egg groups, in diagram order.
function allFinalSlots(){
  const list = [];
  EGG_GROUPS.forEach(function(g, gi){
    PATH_LAYOUT[gi].forEach(function(path, pi){
      path.finals.forEach(function(slotNum, fi){
        list.push({ groupIdx:gi, pathIndex:pi, finalIndex:fi, slot:slotNum });
      });
    });
  });
  return list;
}

// Small thumbnail for a tree node: real art when available, otherwise the
// procedural placeholder (egg for pathIndex null, blob otherwise).
function dexThumbHTML(groupIdx, pathIndex, finalIndex, slot){
  const src = CUSTOM_ART[slot];
  if (src) return '<img src="'+src+'" alt="No.'+slot+'"/>';
  const group = EGG_GROUPS[groupIdx];
  const nodeLike = { id: group.shape, color: group.color, accessory: group.accessory };
  if (pathIndex === null) return eggSVG(group.color, null);
  const tier = tierForPath(pathIndex);
  if (finalIndex === null) return blobSVG(nodeLike, 0.8, tier, false, null);
  return blobSVG(nodeLike, 1.0, tier, finalIndex === 1, null);
}

// GROUP_META (type names/icons) now lives in js/data/monsters.js — the egg
// picker uses it too.

// Which spread of the dex book is open (one egg group per spread).
let DEX_PAGE = 0;

// Dex as an open picture book: left page = the group's egg and stats,
// right page = that group's evolution tree (mid form -> two finals).
// The curled arrows turn the page to the next/previous group.
// Uncaught finals are silhouettes.
function renderDexView(){
  // "みつけた" totals count the collectible endpoints: final forms + each
  // type's ハズレ. Mid-tier slots are also stored in COLLECTION (to
  // un-silhouette them) but must not inflate these totals.
  const finalKeys = allFinalSlots().map(function(n){ return 'slot' + n.slot; });
  const hazureKeys = HAZURE_SLOTS.map(function(s){ return 'slot' + s; });
  const collectibleKeys = finalKeys.concat(hazureKeys);
  const totalSlots = collectibleKeys.length;
  const obtainedCount = collectibleKeys.filter(function(k){ return COLLECTION[k]; }).length;
  const raisedCount = finalKeys.reduce(function(sum,k){ return sum + (COLLECTION[k] ? COLLECTION[k].count : 0); }, 0);

  const gi = DEX_PAGE;
  const g = EGG_GROUPS[gi];
  const meta = GROUP_META[g.shape] || { icon:'❔', label:g.baby };

  let rows = '';
  let groupTotal = 0, groupObtained = 0;
  PATH_LAYOUT[gi].forEach(function(path, pi){
    const tier = tierForPath(pi);
    let finals = '';
    path.finals.forEach(function(slotNum, fi){
      const key = 'slot' + slotNum;
      const entry = COLLECTION[key];
      groupTotal++;
      if (entry) groupObtained++;
      // rarity is shown even while undiscovered, so it reads as a target
      finals += '<div class="dex-node final r'+rarityOf(slotNum)+' '+(entry ? '' : 'locked')+'"'+(entry ? ' data-key="'+key+'"' : '')+'>' +
        '<span class="node-no">'+slotNum+'</span>' +
        '<div class="thumb">'+dexThumbHTML(gi, pi, fi, slotNum)+'</div>' +
        '<b>'+(entry ? tMon(slotNum,'name') : t('dex.unknown'))+'</b>' +
        '<div class="rarity">'+rarityStars(slotNum)+'</div>' +
        '<div class="sub">'+(entry ? t('dex.raised', { n: entry.count }) : t('dex.notFound'))+'</div>' +
      '</div>';
    });
    // Mid-tier (2〜3日目) forms stay silhouettes until raised at least once.
    const midKey = 'slot' + path.slot;
    const midSeen = !!COLLECTION[midKey];
    rows += '<div class="dex-row">' +
      '<div class="dex-node mid '+(midSeen ? '' : 'locked')+'">' +
        '<span class="node-no">'+path.slot+'</span>' +
        '<div class="thumb">'+dexThumbHTML(gi, pi, null, path.slot)+'</div>' +
        '<b>'+(midSeen ? tMon(path.slot,'name') : t('dex.unknown'))+'</b>' +
        '<div class="sub">'+(midSeen ? t('dex.mid') : t('dex.notFound'))+'</div>' +
      '</div>' +
      '<div class="dex-arrow">➜</div>' +
      '<div class="dex-finals">'+finals+'</div>' +
    '</div>';
  });

  // Separate ハズレ (failure) slot for this type — never inside the tree.
  const hazSlot = hazureSlotForGroup(gi);
  const hazKey = 'slot' + hazSlot;
  const hazEntry = COLLECTION[hazKey];
  groupTotal++;
  if (hazEntry) groupObtained++;
  const hazHtml = '' +
    '<div class="dex-hazure">' +
      '<div class="dex-hazure-label">'+t('dex.hazLabel')+'</div>' +
      '<div class="dex-arrow">➜</div>' +
      '<div class="dex-node hazure '+(hazEntry ? 'bad' : 'locked')+'"'+(hazEntry ? ' data-key="'+hazKey+'"' : '')+'>' +
        '<span class="node-no">'+hazSlot+'</span>' +
        '<div class="thumb">'+hazureArtHTML(gi)+'</div>' +
        '<b>'+(hazEntry ? tMon(hazSlot,'name') : t('dex.unknown'))+'</b>' +
        '<div class="sub">'+(hazEntry ? t('dex.hazCount', { n: hazEntry.count }) : t('dex.notFound'))+'</div>' +
      '</div>' +
    '</div>';

  const html = '' +
  '<button class="back-btn" id="dexBackBtn">'+t('common.back')+'</button>' +
  '<div class="dex-book">' +
    '<div class="dex-pages">' +
      '<div class="page page-single">' +
        '<div class="page-topbar">' +
          '<span class="page-egg">'+dexThumbHTML(gi, null, null, g.slot)+'</span>' +
          '<span class="page-title-wrap">' +
            '<b class="page-type">'+meta.icon+' '+tType(g.shape,'label')+'</b>' +
            '<span class="page-progress">'+t('dex.found', { a: groupObtained, b: groupTotal, c: obtainedCount, d: totalSlots })+'</span>' +
          '</span>' +
        '</div>' +
        rows +
        hazHtml +
        '<div class="page-note">'+t('dex.note')+'</div>' +
        '<button class="page-turn prev" id="dexPrevBtn" title="'+t('dex.prev')+'">↶</button>' +
        '<button class="page-turn next" id="dexNextBtn" title="'+t('dex.next')+'">↷</button>' +
      '</div>' +
    '</div>' +
    '<div class="page-num">- '+(gi+1)+' / '+EGG_GROUPS.length+' -</div>' +
  '</div>';

  document.getElementById('dexView').innerHTML = html;
  document.getElementById('dexBackBtn').addEventListener('click', function(){ setTab('raise'); });
  document.getElementById('dexPrevBtn').addEventListener('click', function(){ turnDexPage(-1); });
  document.getElementById('dexNextBtn').addEventListener('click', function(){ turnDexPage(1); });

  document.querySelectorAll('.dex-node[data-key]').forEach(function(el){
    el.addEventListener('click', function(){ showDexDetail(el.getAttribute('data-key')); });
  });

  attachDexSwipe();
}

function turnDexPage(delta){
  DEX_PAGE = (DEX_PAGE + EGG_GROUPS.length + delta) % EGG_GROUPS.length;
  renderDexView();
  const book = document.querySelector('.dex-book');
  if (book){
    book.classList.remove('turn-left', 'turn-right');
    void book.offsetWidth;                       // restart the animation
    book.classList.add(delta > 0 ? 'turn-left' : 'turn-right');
  }
}

// Swipe the book sideways to turn the page, like a real one. Only a mostly
// horizontal drag counts, so scrolling the page vertically still works.
function attachDexSwipe(){
  const book = document.querySelector('.dex-book');
  if (!book) return;
  let x0 = null, y0 = null;

  book.addEventListener('touchstart', function(e){
    const tp = e.changedTouches[0];
    x0 = tp.clientX; y0 = tp.clientY;
  }, { passive:true });

  book.addEventListener('touchend', function(e){
    if (x0 === null) return;
    const tp = e.changedTouches[0];
    const dx = tp.clientX - x0, dy = tp.clientY - y0;
    x0 = null; y0 = null;
    if (Math.abs(dx) < 45) return;               // too small to be a swipe
    if (Math.abs(dx) < Math.abs(dy) * 1.4) return;  // that was a vertical scroll
    turnDexPage(dx < 0 ? 1 : -1);                // swipe left = next page
  }, { passive:true });
}

function showDexDetail(key){
  const slotNum = parseInt(key.replace('slot',''), 10);

  // ハズレ monsters live outside the tree, so handle them separately.
  const hazIdx = HAZURE_SLOTS.indexOf(slotNum);
  if (hazIdx >= 0){
    const hz = COLLECTION[key];
    openModal(
      t('dex.hazMonster'),
      tMon(slotNum,'name'),
      tMon(slotNum,'desc'),
      [
        { label:t('dex.no'), value: 'No.' + slotNum },
        { label:t('dex.becameCount'), value: t('dex.times', { n: (hz ? hz.count : 0) }) },
        { label:t('dex.firstAppeared'), value: hz ? new Date(hz.firstDate).toLocaleDateString() : '-' }
      ],
      'bad',
      hazureArtHTML(hazIdx),
      [{ text:t('common.close'), action: closeModal, primary:true }]
    );
    return;
  }

  const node = allFinalSlots().filter(function(n){ return n.slot === slotNum; })[0];
  const entry = COLLECTION[key];
  const tier = tierForPath(node.pathIndex);
  const fakeState = { groupIdx: node.groupIdx, pathIndex: node.pathIndex, finalIndex: node.finalIndex };
  openModal(
    rarityStars(slotNum) + ' ' + tRarityLabel(rarityOf(slotNum)),
    tMon(slotNum,'name'),
    tMon(slotNum,'desc'),
    [
      { label:t('dex.no'), value: 'No.' + slotNum },
      { label:t('dex.raiseCount'), value: t('dex.times', { n: entry.count }) },
      { label:t('dex.firstMet'), value: new Date(entry.firstDate).toLocaleDateString() }
    ],
    tier,
    monsterSVG(fakeState, 3),
    [{ text:t('common.close'), action: closeModal, primary:true }]
  );
}
