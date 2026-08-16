/* ============================================================
   ごみのじてん（検索画面）
   ============================================================
   打てない子でも使えるように、入力欄のほかにカテゴリのボタンを
   置いて、タップだけで一覧を見られるようにしている。
   ============================================================ */
let SEARCH_QUERY = '';
let SEARCH_CAT = null;   // カテゴリ一覧モードのとき id が入る

function searchResultCard(item){
  const meta = dictCatMeta(item.cat);
  const label = item.cat === 'special' ? t('search.special') : tCat(meta, 'label');
  const title = LANG === 'hira' ? item.kana : item.name;
  const sub = LANG === 'hira' ? '' : item.kana;
  return '' +
    '<div class="dict-card" style="--dict-color:'+meta.color+';">' +
      '<div class="dict-head">' +
        '<span class="dict-icon">'+meta.icon+'</span>' +
        '<span class="dict-name"><b>'+title+'</b>'+(sub ? '<i>'+sub+'</i>' : '')+'</span>' +
        '<span class="dict-cat">'+label+'</span>' +
      '</div>' +
      '<div class="dict-tip">'+item.tip+'</div>' +
    '</div>';
}

function renderSearchResults(){
  let list;
  if (SEARCH_CAT) list = dictByCategory(SEARCH_CAT);
  else if (SEARCH_QUERY) list = dictSearch(SEARCH_QUERY);
  else return '<div class="dict-empty">'+t('search.empty')+'</div>';

  if (!list.length) return '<div class="dict-empty">'+t('search.noHit')+'</div>';
  return '<div class="dict-count">'+t('search.count', { n: list.length })+'</div>' +
    list.map(searchResultCard).join('');
}

function renderSearchChips(){
  let chips = '';
  WASTE_CATEGORIES.forEach(function(c){
    chips += '<button class="dict-chip'+(SEARCH_CAT === c.id ? ' on' : '')+'" data-cat="'+c.id+'" ' +
      'style="--dict-color:'+c.color+';">'+c.icon+' '+tCat(c,'label')+'</button>';
  });
  chips += '<button class="dict-chip'+(SEARCH_CAT === 'special' ? ' on' : '')+'" data-cat="special" ' +
    'style="--dict-color:'+DICT_SPECIAL.color+';">'+DICT_SPECIAL.icon+' '+t('search.special')+'</button>';
  return '<div class="dict-chips">'+chips+'</div>';
}

function renderSearchView(){
  return '' +
  '<div class="search-overlay" id="searchOverlay">' +
    '<div class="search-head">' +
      '<button class="back-btn" id="searchBackBtn">'+t('common.back')+'</button>' +
      '<b>'+t('search.title')+'</b>' +
    '</div>' +
    '<div class="search-box">' +
      '<input type="search" id="searchInput" placeholder="'+t('search.placeholder')+'" ' +
        'value="'+SEARCH_QUERY.replace(/"/g,'&quot;')+'" autocomplete="off" />' +
      (SEARCH_QUERY || SEARCH_CAT ? '<button class="dict-clear" id="searchClearBtn">✕</button>' : '') +
    '</div>' +
    renderSearchChips() +
    '<div class="dict-results" id="dictResults">'+renderSearchResults()+'</div>' +
    '<div class="dict-note">'+t('search.note')+'</div>' +
  '</div>';
}

function refreshSearchResults(){
  const box = document.getElementById('dictResults');
  if (box) box.innerHTML = renderSearchResults();
  // chips reflect the current selection
  document.querySelectorAll('.dict-chip').forEach(function(btn){
    btn.classList.toggle('on', btn.getAttribute('data-cat') === SEARCH_CAT);
  });
  const clear = document.getElementById('searchClearBtn');
  if (!clear && (SEARCH_QUERY || SEARCH_CAT)) openSearch(true);   // need the ✕ button
}

function attachSearchHandlers(){
  document.getElementById('searchBackBtn').addEventListener('click', closeSearch);

  const input = document.getElementById('searchInput');
  input.addEventListener('input', function(){
    SEARCH_QUERY = input.value;
    SEARCH_CAT = null;          // typing leaves category-browse mode
    refreshSearchResults();
  });

  document.querySelectorAll('.dict-chip').forEach(function(btn){
    btn.addEventListener('click', function(){
      const id = btn.getAttribute('data-cat');
      SEARCH_CAT = (SEARCH_CAT === id) ? null : id;
      SEARCH_QUERY = '';
      document.getElementById('searchInput').value = '';
      refreshSearchResults();
    });
  });

  const clear = document.getElementById('searchClearBtn');
  if (clear) clear.addEventListener('click', function(){
    SEARCH_QUERY = ''; SEARCH_CAT = null;
    openSearch(true);
  });
}

function openSearch(keepQuery){
  if (!keepQuery){ SEARCH_QUERY = ''; SEARCH_CAT = null; }
  document.getElementById('modalRoot').innerHTML = renderSearchView();
  attachSearchHandlers();
}

function closeSearch(){
  SEARCH_QUERY = ''; SEARCH_CAT = null;
  closeModal();
}
