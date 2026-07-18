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

// Dex as an evolution tree: per egg group, one row per path showing
// mid-tier form -> its two finals, so it's clear where every monster
// sits in the correlation diagram. Uncaught finals are silhouettes.
function renderDexView(){
  const totalSlots = allFinalSlots().length;
  const obtainedCount = Object.keys(COLLECTION).length;
  const raisedCount = Object.keys(COLLECTION).reduce(function(sum,k){ return sum + COLLECTION[k].count; }, 0);

  let groupsHtml = '';
  EGG_GROUPS.forEach(function(g, gi){
    let rows = '';
    PATH_LAYOUT[gi].forEach(function(path, pi){
      const tier = tierForPath(pi);
      let finals = '';
      path.finals.forEach(function(slotNum, fi){
        const key = 'slot' + slotNum;
        const entry = COLLECTION[key];
        finals += '<div class="dex-node final '+(entry ? tier : 'locked')+'"'+(entry ? ' data-key="'+key+'"' : '')+'>' +
          '<div class="thumb">'+dexThumbHTML(gi, pi, fi, slotNum)+'</div>' +
          '<b>No.'+slotNum+'</b>' +
          '<div class="sub">'+(entry ? tierIcon(tier)+' '+entry.count+'回育成' : '？？？')+'</div>' +
        '</div>';
      });
      rows += '<div class="dex-row">' +
        '<div class="dex-node mid">' +
          '<div class="thumb">'+dexThumbHTML(gi, pi, null, path.slot)+'</div>' +
          '<b>No.'+path.slot+'</b>' +
          '<div class="sub">2〜3日目</div>' +
        '</div>' +
        '<div class="dex-arrow">➜</div>' +
        '<div class="dex-finals">'+finals+'</div>' +
      '</div>';
    });
    groupsHtml += '<div class="dex-group">' +
      '<div class="dex-group-head"><span class="dex-egg">'+dexThumbHTML(gi, null, null, g.slot)+'</span>'+g.baby+'のなかま（No.'+g.slot+'）</div>' +
      rows +
    '</div>';
  });

  const html = '' +
  '<div class="card">' +
    '<button class="back-btn" id="dexBackBtn">← もどる</button>' +
    '<div class="graph-title"><span>ずかん登録数</span><b>'+obtainedCount+' / '+totalSlots+'</b></div>' +
    '<div class="dex-legend">たまごから 2〜3日目のすがたを経て、かんせい形（4日目）に分かれるよ。「？？？」はまだ出会っていないモンスター。</div>' +
    groupsHtml +
    '<div class="lifetime-box">' +
      '<div><b>'+raisedCount+'</b>育てたモンスター</div>' +
      '<div><b>'+formatGrams(LIFETIME.recycle+LIFETIME.paper+LIFETIME.compost)+'</b>資源に回した量</div>' +
    '</div>' +
  '</div>';

  document.getElementById('dexView').innerHTML = html;
  document.getElementById('dexBackBtn').addEventListener('click', function(){ setTab('raise'); });

  document.querySelectorAll('.dex-node.final[data-key]').forEach(function(el){
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
  const node = allFinalSlots().filter(function(n){ return n.slot === slotNum; })[0];
  const entry = COLLECTION[key];
  const tier = tierForPath(node.pathIndex);
  const fakeState = { groupIdx: node.groupIdx, pathIndex: node.pathIndex, finalIndex: node.finalIndex };
  openModal(
    tierEyebrow(tier),
    'No.' + slotNum,
    '相関図の'+slotNum+'番のモンスター（画像はこれから当てはめ予定）',
    [
      { label:'育成回数', value: entry.count + ' 回' },
      { label:'はじめて出会った日', value: new Date(entry.firstDate).toLocaleDateString('ja-JP') }
    ],
    tier,
    monsterSVG(fakeState, 3),
    [{ text:'とじる', action: closeModal, primary:true }]
  );
}
