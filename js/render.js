/* ============================================================
   SVG monster rendering
   ============================================================ */
function slotBadge(number){
  if (number === null || number === undefined) return '';
  return '' +
    '<circle cx="30" cy="32" r="17" fill="#2F6F5E" stroke="#fff" stroke-width="2.5"/>' +
    '<text x="30" y="37" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="15" font-weight="700" fill="#fff">'+number+'</text>';
}

function eggSVG(color, number){
  return '' +
  '<svg viewBox="0 0 200 200" width="170" height="170">' +
    '<ellipse cx="100" cy="118" rx="54" ry="64" fill="'+color+'" opacity="0.16"/>' +
    '<ellipse cx="100" cy="118" rx="54" ry="64" fill="none" stroke="'+color+'" stroke-width="4"/>' +
    '<path d="M76 88 L92 104 L80 112 L98 130" fill="none" stroke="'+color+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>' +
    '<circle cx="132" cy="150" r="4" fill="'+color+'" opacity="0.4"/>' +
    '<circle cx="70" cy="150" r="3" fill="'+color+'" opacity="0.4"/>' +
    slotBadge(number) +
  '</svg>';
}

function accessoryMarkup(type, scale, color, tier, topY, mirror){
  const rot = tier === 'bad' ? 10 : 0;
  const op = tier === 'bad' ? 0.55 : 1;
  const flip = mirror ? -1 : 1;
  let inner = '';
  if (type === 'leaf'){
    inner =
      '<path d="M -13 0 Q -13 -24 0 -28 Q 13 -24 13 0 Q 0 7 -13 0 Z" fill="'+color+'" opacity="'+op+'"/>' +
      '<path d="M -13 0 Q -13 -24 0 -28 Q 13 -24 13 0 Q 0 7 -13 0 Z" fill="'+color+'" opacity="'+op+'" transform="translate(19,5) scale(0.68) rotate(24)"/>';
  } else if (type === 'fin'){
    inner =
      '<path d="M 0 4 L -12 -26 L 12 -22 Z" fill="'+color+'" opacity="'+op+'"/>' +
      '<path d="M -30 10 L -42 2 L -30 -6 Z" fill="'+color+'" opacity="'+op+'"/>' +
      '<path d="M 30 10 L 42 2 L 30 -6 Z" fill="'+color+'" opacity="'+op+'"/>';
  } else if (type === 'shell'){
    inner =
      '<path d="M -22 6 Q 0 -22 22 6 Z" fill="'+color+'" opacity="'+op+'"/>' +
      '<ellipse cx="-34" cy="18" rx="10" ry="6" fill="'+color+'" opacity="'+op+'"/>' +
      '<ellipse cx="34" cy="18" rx="10" ry="6" fill="'+color+'" opacity="'+op+'"/>';
  } else if (type === 'cloud'){
    inner =
      '<circle cx="-32" cy="10" r="13" fill="'+color+'" opacity="'+(op*0.9)+'"/>' +
      '<circle cx="-20" cy="2" r="10" fill="'+color+'" opacity="'+(op*0.9)+'"/>' +
      '<circle cx="32" cy="10" r="13" fill="'+color+'" opacity="'+(op*0.9)+'"/>' +
      '<circle cx="20" cy="2" r="10" fill="'+color+'" opacity="'+(op*0.9)+'"/>';
  } else if (type === 'gem'){
    inner =
      '<path d="M 0 -30 L 12 -8 L 0 6 L -12 -8 Z" fill="'+color+'" opacity="'+op+'"/>' +
      '<path d="M -22 -6 L -14 -18 L -8 -4 L -18 6 Z" fill="'+color+'" opacity="'+op+'"/>' +
      '<path d="M 22 -6 L 14 -18 L 8 -4 L 18 6 Z" fill="'+color+'" opacity="'+op+'"/>';
  }
  return '<g transform="translate(100,'+topY+') scale('+scale+') rotate('+rot+') scale('+flip+',1)">' + inner + '</g>';
}

function faceMarkup(scale, tier){
  const ex = 22*scale, ey = 108, er = 8.5*scale;
  let eyes, mouth;
  if (tier === 'bad'){
    eyes =
      '<line x1="'+(100-ex-6)+'" y1="'+(ey-6)+'" x2="'+(100-ex+6)+'" y2="'+(ey+6)+'" stroke="#4a4a3a" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="'+(100-ex-6)+'" y1="'+(ey+6)+'" x2="'+(100-ex+6)+'" y2="'+(ey-6)+'" stroke="#4a4a3a" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="'+(100+ex-6)+'" y1="'+(ey-6)+'" x2="'+(100+ex+6)+'" y2="'+(ey+6)+'" stroke="#4a4a3a" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="'+(100+ex-6)+'" y1="'+(ey+6)+'" x2="'+(100+ex+6)+'" y2="'+(ey-6)+'" stroke="#4a4a3a" stroke-width="3" stroke-linecap="round"/>';
    mouth = '<path d="M '+(100-15*scale)+' 146 Q 100 134 '+(100+15*scale)+' 146" fill="none" stroke="#4a4a3a" stroke-width="3.5" stroke-linecap="round"/>';
  } else {
    eyes =
      '<circle cx="'+(100-ex)+'" cy="'+ey+'" r="'+er+'" fill="#3B3A33"/>' +
      '<circle cx="'+(100-ex+2.5)+'" cy="'+(ey-2.5)+'" r="'+(er*0.32)+'" fill="#fff"/>' +
      '<circle cx="'+(100+ex)+'" cy="'+ey+'" r="'+er+'" fill="#3B3A33"/>' +
      '<circle cx="'+(100+ex+2.5)+'" cy="'+(ey-2.5)+'" r="'+(er*0.32)+'" fill="#fff"/>';
    mouth = '<path d="M '+(100-15*scale)+' 138 Q 100 '+(150*1)+' '+(100+15*scale)+' 138" fill="none" stroke="#3B3A33" stroke-width="3.5" stroke-linecap="round"/>';
  }
  return eyes + mouth;
}

function grimeMarkup(scale){
  const spots = [[-30,10],[26,26],[-8,34],[18,-4]];
  return spots.map(function(p){
    return '<circle cx="'+(100+p[0]*scale)+'" cy="'+(120+p[1]*scale)+'" r="'+(5*scale)+'" fill="#6B6142" opacity="0.45"/>';
  }).join('');
}

// Smooth 4-point blob (N/E/S/W anchors joined by cubic beziers). Varying the
// four radii gives each species a distinct silhouette instead of one shared
// ellipse — a bud shape for forest, a droplet for river, etc.
function blobBodyPath(cx, cy, rTop, rRight, rBottom, rLeft, kappa){
  const k = kappa || 0.552;
  const N=[cx,cy-rTop], E=[cx+rRight,cy], S=[cx,cy+rBottom], W=[cx-rLeft,cy];
  const hN=rTop*k, hE=rRight*k, hS=rBottom*k, hW=rLeft*k;
  return 'M '+N[0]+' '+N[1]+
    ' C '+(N[0]+hN)+' '+N[1]+' '+E[0]+' '+(E[1]-hE)+' '+E[0]+' '+E[1]+
    ' C '+E[0]+' '+(E[1]+hE)+' '+(S[0]+hS)+' '+S[1]+' '+S[0]+' '+S[1]+
    ' C '+(S[0]-hS)+' '+S[1]+' '+W[0]+' '+(W[1]+hW)+' '+W[0]+' '+W[1]+
    ' C '+W[0]+' '+(W[1]-hW)+' '+(N[0]-hN)+' '+N[1]+' '+N[0]+' '+N[1]+
    ' Z';
}

// Per-species silhouette recipe: radius multipliers (of the base radius) for
// top/right/bottom/left, plus how round (kappa) the corners feel.
const BODY_SHAPES = {
  forest: { top:0.82, right:1.03, bottom:1.18, left:1.03, kappa:0.55 }, // bud/acorn
  river:  { top:0.62, right:0.98, bottom:1.28, left:0.98, kappa:0.58 }, // raindrop
  ocean:  { top:1.04, right:1.12, bottom:1.06, left:1.12, kappa:0.56 }, // plump & round
  sky:    { top:0.92, right:1.22, bottom:0.88, left:1.22, kappa:0.62 }, // wide & fluffy
  earth:  { top:0.98, right:0.94, bottom:1.08, left:0.94, kappa:0.42 }, // sturdy, squarer
};

function bodyGroundShadowY(cy, rBottom){ return cy + rBottom*0.52; }

function starPath(cx, cy, r){
  const k = r*0.32;
  return 'M '+cx+' '+(cy-r)+' L '+(cx+k)+' '+(cy-k)+' L '+(cx+r)+' '+cy+' L '+(cx+k)+' '+(cy+k)+
    ' L '+cx+' '+(cy+r)+' L '+(cx-k)+' '+(cy+k)+' L '+(cx-r)+' '+cy+' L '+(cx-k)+' '+(cy-k)+' Z';
}

function shineHalo(scale){
  return '<circle cx="100" cy="120" r="'+(78*scale)+'" fill="#FBCB4A" opacity="0.16"/>';
}

function shineSparkles(scale){
  const spots = [[-48,-38,7],[50,-30,9],[42,42,6],[-46,32,7],[6,-58,5]];
  return spots.map(function(p){
    return '<path d="'+starPath(100+p[0]*scale, 120+p[1]*scale, p[2]*scale)+'" fill="#FFE49A"/>';
  }).join('');
}

function blobSVG(nodeLike, scale, tier, mirror, number){
  const R = 62*scale;
  const shape = BODY_SHAPES[nodeLike.id] || BODY_SHAPES.forest;
  const rTop = R*shape.top, rRight = R*shape.right, rBottom = R*shape.bottom, rLeft = R*shape.left;
  const cy = 122;
  const bodyColor = nodeLike.color;
  const topY = cy - rTop*0.88;
  const bodyPath = blobBodyPath(100, cy, rTop, rRight, rBottom, rLeft, shape.kappa);
  const dim = tier === 'bad' ? ' opacity="0.78"' : '';

  let svg = '<svg viewBox="0 0 200 210" width="'+Math.round(170*Math.min(scale+0.35,1.2))+'" height="'+Math.round(178*Math.min(scale+0.35,1.2))+'">';
  if (tier === 'great') svg += shineHalo(scale);
  svg += '<path d="'+bodyPath+'" fill="'+bodyColor+'" stroke="rgba(0,0,0,0.1)" stroke-width="2"'+dim+'/>';
  // soft ground shadow inside the body base
  svg += '<ellipse cx="100" cy="'+(cy+rBottom*0.52)+'" rx="'+(rRight*0.65)+'" ry="'+(rBottom*0.2)+'" fill="#000" opacity="0.07"/>';
  // glossy highlight
  svg += '<ellipse cx="'+(100-rLeft*0.38)+'" cy="'+(cy-rTop*0.45)+'" rx="'+(rLeft*0.32)+'" ry="'+(rTop*0.22)+'" fill="#fff" opacity="'+(tier==='bad'?0.12:0.28)+'"/>';
  svg += accessoryMarkup(nodeLike.accessory, scale, bodyColor, tier, topY, mirror);
  svg += faceMarkup(scale, tier);
  if (tier !== 'bad'){
    svg += '<ellipse cx="'+(100-32*scale)+'" cy="122" rx="'+(9*scale)+'" ry="'+(5.5*scale)+'" fill="#FF9E85" opacity="0.35"/>';
    svg += '<ellipse cx="'+(100+32*scale)+'" cy="122" rx="'+(9*scale)+'" ry="'+(5.5*scale)+'" fill="#FF9E85" opacity="0.35"/>';
  }
  if (tier === 'bad') svg += grimeMarkup(scale);
  if (tier === 'great') svg += shineSparkles(scale);
  svg += slotBadge(number);
  svg += '</svg>';
  return svg;
}

// tier used purely for visual family-resemblance: path/final index 0 gets
// the "great" sparkle treatment, the messiest option gets "bad" grime, the
// middle option is plain. This does not imply the old good/bad game outcome.
function tierForPath(pathIndex){
  if (pathIndex === 0) return 'great';
  if (pathIndex === 2) return 'bad';
  return 'normal';
}

function customArtHTML(slotNumber){
  const src = CUSTOM_ART[slotNumber];
  if (!src) return null;
  return '' +
    '<div class="custom-art-wrap">' +
      '<img src="'+src+'" alt="No.'+slotNumber+'"/>' +
      '<div class="slot-badge-overlay">'+slotNumber+'</div>' +
    '</div>';
}

// The type's ハズレ (failure) monster: real art if provided, otherwise a
// muddy "bad"-tier procedural blob as a placeholder.
function hazureArtHTML(groupIdx){
  const slot = hazureSlotForGroup(groupIdx);
  const custom = customArtHTML(slot);
  if (custom) return custom;
  const group = EGG_GROUPS[groupIdx];
  const nodeLike = { id: group.shape, color:'#8C8A6A', accessory: group.accessory };
  return blobSVG(nodeLike, 1.0, 'bad', false, null);
}

// Renders whatever should be on screen right now for a given cycle state:
// day1 egg -> day2/3 path (mid-tier) look -> day4 completion final look.
// Real uploaded art (CUSTOM_ART) takes priority; otherwise falls back to
// the procedural placeholder monster.
function monsterSVG(state, stage){
  const group = groupByIdx(state.groupIdx);

  if (stage === 0){
    return customArtHTML(group.slot) || eggSVG(group.color, group.slot);
  }

  const nodeLike = { id: group.shape, color: group.color, accessory: group.accessory };
  const scaleByStage = { 1:0.62, 2:0.82, 3:1.0 };

  if (state.pathIndex === null || stage < 3){
    // mid-tier (day 2-3): if the path hasn't resolved yet for some reason,
    // fall back to a neutral look rather than erroring.
    const pIdx = state.pathIndex === null ? 1 : state.pathIndex;
    const tier = tierForPath(pIdx);
    const slot = PATH_LAYOUT[state.groupIdx][pIdx].slot;
    return customArtHTML(slot) || blobSVG(nodeLike, scaleByStage[stage] || 0.82, tier, false, slot);
  }

  // final reveal (stage 3, at cycle completion)
  const pIdx = state.pathIndex;
  const fIdx = state.finalIndex === null ? 0 : state.finalIndex;
  const tier = tierForPath(pIdx);
  const slot = PATH_LAYOUT[state.groupIdx][pIdx].finals[fIdx];
  return customArtHTML(slot) || blobSVG(nodeLike, 1.0, tier, fIdx === 1, slot);
}
