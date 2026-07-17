/* ============================================================
   Modal system
   ============================================================ */
function openModal(eyebrow, title, desc, stats, formClass, svgHtml, buttons){
  const statHtml = (stats||[]).map(function(s){
    return '<div><b>'+s.value+'</b>'+s.label+'</div>';
  }).join('');
  const btnHtml = (buttons||[]).map(function(b,i){
    return '<button class="primary-btn" data-btn-idx="'+i+'" style="'+(b.primary?'':'background:#EAEFE3;color:#3B3A33;box-shadow:none;')+'">'+b.text+'</button>';
  }).join('');

  document.getElementById('modalRoot').innerHTML =
    '<div class="modal-overlay" id="modalOverlay">' +
      '<div class="modal-card">' +
        (svgHtml ? '<div style="display:flex;justify-content:center;margin-bottom:6px;">'+svgHtml+'</div>' : '') +
        '<div class="modal-eyebrow">'+eyebrow+'</div>' +
        '<h2 class="'+(formClass==='bad'?'bad':(formClass==='great'?'great':'good'))+'">'+title+'</h2>' +
        '<p class="desc">'+desc+'</p>' +
        (statHtml ? '<div class="modal-stats">'+statHtml+'</div>' : '') +
        btnHtml +
      '</div>' +
    '</div>';

  (buttons||[]).forEach(function(b, i){
    const el = document.querySelector('[data-btn-idx="'+i+'"]');
    if (el) el.addEventListener('click', b.action);
  });
}

function closeModal(){
  document.getElementById('modalRoot').innerHTML = '';
}
