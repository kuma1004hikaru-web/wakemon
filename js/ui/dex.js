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

function renderDexView(){
  let cards = '';
  allFinalSlots().forEach(function(node){
    const key = 'slot' + node.slot;
    const entry = COLLECTION[key];
    const tier = tierForPath(node.pathIndex);
    if (entry){
      cards += '<div class="mon-card '+tier+'" data-key="'+key+'">' +
        '<div class="mini-icon">'+tierIcon(tier)+'</div>' +
        '<b>No.'+node.slot+'</b>' +
        '<div class="count">'+entry.count+'回 育成</div>' +
      '</div>';
    } else {
      cards += '<div class="mon-card locked">' +
        '<div class="mini-icon">❔</div>' +
        '<b>No.'+node.slot+'</b>' +
        '<div class="count">みつけていない</div>' +
      '</div>';
    }
  });

  const raisedCount = Object.keys(COLLECTION).reduce(function(sum,k){ return sum + COLLECTION[k].count; }, 0);
  const obtainedCount = Object.keys(COLLECTION).length;
  const totalSlots = allFinalSlots().length;

  const html = '' +
  '<div class="card">' +
    '<button class="back-btn" id="dexBackBtn">← もどる</button>' +
    '<div class="graph-title"><span>ずかん登録数</span><b>'+obtainedCount+' / '+totalSlots+'</b></div>' +
    '<div class="collection-grid">'+cards+'</div>' +
    '<div class="lifetime-box">' +
      '<div><b>'+raisedCount+'</b>育てたモンスター</div>' +
      '<div><b>'+formatGrams(LIFETIME.recycle+LIFETIME.paper+LIFETIME.compost)+'</b>資源に回した量</div>' +
    '</div>' +
  '</div>';

  document.getElementById('dexView').innerHTML = html;
  document.getElementById('dexBackBtn').addEventListener('click', function(){ setTab('raise'); });

  document.querySelectorAll('.mon-card[data-key]').forEach(function(el){
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
