function tierIcon(tier){
  return tier === 'great' ? '🌟' : (tier === 'normal' ? '🙂' : '💀');
}

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
      finals += '<div class="dex-node final '+(entry ? tier : 'locked')+'"'+(entry ? ' data-key="'+key+'"' : '')+'>' +
        '<span class="node-no">'+slotNum+'</span>' +
        '<div class="thumb">'+dexThumbHTML(gi, pi, fi, slotNum)+'</div>' +
        '<b>'+(entry ? monsterName(slotNum) : '？？？')+'</b>' +
        '<div class="sub">'+(entry ? tierIcon(tier)+' '+entry.count+'回' : 'みつけていない')+'</div>' +
      '</div>';
    });
    // Mid-tier (2〜3日目) forms stay silhouettes until raised at least once.
    const midKey = 'slot' + path.slot;
    const midSeen = !!COLLECTION[midKey];
    rows += '<div class="dex-row">' +
      '<div class="dex-node mid '+(midSeen ? '' : 'locked')+'">' +
        '<span class="node-no">'+path.slot+'</span>' +
        '<div class="thumb">'+dexThumbHTML(gi, pi, null, path.slot)+'</div>' +
        '<b>'+(midSeen ? monsterName(path.slot) : '？？？')+'</b>' +
        '<div class="sub">'+(midSeen ? '2〜3日目' : 'みつけていない')+'</div>' +
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
      '<div class="dex-hazure-label">💀 そだてに<br>しっぱいすると…</div>' +
      '<div class="dex-arrow">➜</div>' +
      '<div class="dex-node hazure '+(hazEntry ? 'bad' : 'locked')+'"'+(hazEntry ? ' data-key="'+hazKey+'"' : '')+'>' +
        '<span class="node-no">'+hazSlot+'</span>' +
        '<div class="thumb">'+hazureArtHTML(gi)+'</div>' +
        '<b>'+(hazEntry ? monsterName(hazSlot) : '？？？')+'</b>' +
        '<div class="sub">'+(hazEntry ? '💀 '+hazEntry.count+'回' : 'みつけていない')+'</div>' +
      '</div>' +
    '</div>';

  const html = '' +
  '<button class="back-btn" id="dexBackBtn">← もどる</button>' +
  '<div class="dex-book">' +
    '<div class="dex-pages">' +
      '<div class="page page-single">' +
        '<div class="page-topbar">' +
          '<span class="page-egg">'+dexThumbHTML(gi, null, null, g.slot)+'</span>' +
          '<span class="page-title-wrap">' +
            '<b class="page-type">'+meta.icon+' '+meta.label+'</b>' +
            '<span class="page-progress">みつけた '+groupObtained+' / '+groupTotal+'　（ぜんぶで '+obtainedCount+' / '+totalSlots+'）</span>' +
          '</span>' +
        '</div>' +
        rows +
        hazHtml +
        '<div class="page-note">「？？？」はまだ出会っていないモンスター。カードをタップでくわしく見られるよ。</div>' +
        '<button class="page-turn prev" id="dexPrevBtn" title="前のタイプ">↶</button>' +
        '<button class="page-turn next" id="dexNextBtn" title="次のタイプ">↷</button>' +
      '</div>' +
    '</div>' +
    '<div class="page-num">- '+(gi+1)+' / '+EGG_GROUPS.length+' -</div>' +
  '</div>';

  document.getElementById('dexView').innerHTML = html;
  document.getElementById('dexBackBtn').addEventListener('click', function(){ setTab('raise'); });
  document.getElementById('dexPrevBtn').addEventListener('click', function(){
    DEX_PAGE = (DEX_PAGE + EGG_GROUPS.length - 1) % EGG_GROUPS.length;
    renderDexView();
  });
  document.getElementById('dexNextBtn').addEventListener('click', function(){
    DEX_PAGE = (DEX_PAGE + 1) % EGG_GROUPS.length;
    renderDexView();
  });

  document.querySelectorAll('.dex-node[data-key]').forEach(function(el){
    el.addEventListener('click', function(){ showDexDetail(el.getAttribute('data-key')); });
  });
}

function tierEyebrow(tier){
  if (tier === 'great') return '🌟 かんぺきモンスター';
  if (tier === 'normal') return '🙂 ふつうモンスター';
  return '💀 はずれモンスター';
}

function showDexDetail(key){
  const slotNum = parseInt(key.replace('slot',''), 10);

  // ハズレ monsters live outside the tree, so handle them separately.
  const hazIdx = HAZURE_SLOTS.indexOf(slotNum);
  if (hazIdx >= 0){
    const hz = COLLECTION[key];
    openModal(
      '💀 ハズレモンスター',
      monsterName(slotNum),
      monsterDesc(slotNum),
      [
        { label:'ずかん番号', value: 'No.' + slotNum },
        { label:'なってしまった回数', value: (hz ? hz.count : 0) + ' 回' },
        { label:'はじめて出た日', value: hz ? new Date(hz.firstDate).toLocaleDateString('ja-JP') : '-' }
      ],
      'bad',
      hazureArtHTML(hazIdx),
      [{ text:'とじる', action: closeModal, primary:true }]
    );
    return;
  }

  const node = allFinalSlots().filter(function(n){ return n.slot === slotNum; })[0];
  const entry = COLLECTION[key];
  const tier = tierForPath(node.pathIndex);
  const fakeState = { groupIdx: node.groupIdx, pathIndex: node.pathIndex, finalIndex: node.finalIndex };
  openModal(
    tierEyebrow(tier),
    monsterName(slotNum),
    monsterDesc(slotNum),
    [
      { label:'ずかん番号', value: 'No.' + slotNum },
      { label:'育成回数', value: entry.count + ' 回' },
      { label:'はじめて出会った日', value: new Date(entry.firstDate).toLocaleDateString('ja-JP') }
    ],
    tier,
    monsterSVG(fakeState, 3),
    [{ text:'とじる', action: closeModal, primary:true }]
  );
}
