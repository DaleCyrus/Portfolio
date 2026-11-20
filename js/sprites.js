// Pixel art: the color palette, every sprite as rows of letters, and the code that draws them
// (sprites, tiled backgrounds, the castle, stone arches) when the page loads.

// pixel art: each sprite is rows of letters, each letter is a color
var PAL = {t:'#2dd4bf', d:'#0e8f80', w:'#ffffff', b:'#9db8f2', k:'#000000', r:'#ff5d73', p:'#ffb3c0',
           c:'#17302d', C:'#21405c', h:'#3a2a20', s:'#f2c097', n:'#2b3a67', l:'#9a5b2e', L:'#6b3a1c',
           y:'#ffd23f', Y:'#c99400', o:'#ff9f1c', B:'#e8e2cf', g:'#b8ad92', m:'#cfd8e6', D:'#24170f', E:'#5e4430',
           G:'#5b6170', H:'#8a90a0', K:'#2a2f3a', J:'#05070a', V:'#262b36', W:'#30374a', X:'#171b23',
           Z:'#3a3229', A:'#4a4034', q:'#efe3c2', Q:'#cdbb8f', f:'#0c4a44', F:'#168a7c',
           M:'#3e4452', N:'#565d6e', O:'#1c2028', u:'rgba(255,255,255,0.55)', I:'rgba(255,255,255,0.35)'};
var ART = {
  heart: ['.rr.rr.','rprrrrr','rrrrrrr','.rrrrr.','..rrr..','...r...'],
  gem:   ['..tttt..','.twtttb.','twttttbb','tttttbbb','.tttbbb.','..tbbb..','...bb...'],
  star:  ['..w..','..w..','wwwww','..w..','..w..'],
  dot:   ['y'],
  cloud: ['....cccc......','..cccccccc.cc.','.cccccccccccc.','cccccccccccccc'],
  moon:  ['..wwww..','.wwwwmw.','wwmwwwww','wwwwwmww','wwwwwwww','.wmwwww.','..wwww..'],
  mail:  ['........','tttttttt','tdttttdt','ttdttdtt','tttddttt','tttttttt','tttttttt','........'],
  sword: ['...w...','..wbw..','..wbw..','..wbw..','..wbw..','..wbw..','..wbw..','..wbw..','ttttttt','...d...','...d...','...d...','..ttt..'],
  grassTop: ['..t...t.','t.tt.tt.','tttttttt','dddddddd','LdddLddd'],
  dirt:  ['D.......','....E...','........','..D.....','.......D','...E....','D.......','.....D..'],
  hero:  ['...hhhh.....','..hhhhhh....','..hhhssss...','..hhsskss...','...sssss....','....ss......',
          '..tttttt....','..ttttttss..','..tttttt....','..nnnnnnnn..','.lllll..nn..','.lLLLl..nn..','.lllll..kkk.'],
  fireA: ['....y...','...yy...','..yoy.y.','..yooyy.','.yoooooy','.ooroooo','oorrrroo','.orrrro.','lLlLlLlL','.LlLlLl.'],
  fireB: ['...y....','...yy...','.y.yoy..','.yyooy..','yoooooy.','oooorooo','oorrrroo','.orrrro.','lLlLlLlL','.LlLlLl.'],
  skull: ['..BBBB..','.BBBBBB.','BBBBBBBB','BkkBBkkB','BkkBBkkB','BBBkkBBB','.BBBBBB.','.BgBgBg.'],
  bone:  ['BB......BB','.BBBBBBBB.','.BBBBBBBB.','BB......BB'],
  fish:  ['..B.B.B.B....','.BBBBBBBBBB.B','Bk.B.B.B.BBB.','.BBBBBBBBBB.B','..B.B.B.B....'],
  coin:  ['.yy.','yYyy','yYyy','.yy.'],
  treasure: ['..kkkkkkkk..','.kLLLLLLLLk.','kLllllllllLk','kLllllllllLk','kyyyyyyyyyyk',
             'kLlllYYlllLk','kLlllYYlllLk','kLllllllllLk','kLLLLLLLLLLk','.kkkkkkkkkk.'],
  pine:  ['.....ff.....','....ffff....','....fFff....','...ffffff...','..ffFfffff..','...ffffff...','..fffFffff..',
          '.ffffffffff.','..ffffffff..','.ffFfffffFf.','ffffffffffff','.ffffffffff.','fffFffffFfff','ffffffffffff',
          '.....LL.....','.....LL.....','.....LL.....'],
  oak:   ['....ffffff....','..ffffFfffff..','.ffFffffffFff.','ffffffffffffff','fffFffffFfffff','ffffffffffffff',
          '.fffffffFffff.','..ffffffffff..','....ffLLff....','......LL......','......LL......','......LL......',
          '......LL......','.....LLLL.....'],
  rabbit:['.m.m...','.m.m...','.mmm...','mkmmmm.','.mmmmmm','.m..m..'],
  deer:  ['.g.g..........','.ggg..........','..ll..........','.lkl..........','..lll.........','...llllllll...',
          '...lllllllll..','...llllllll...','...l.l...l.l..','...l.l...l.l..','...L.L...L.L..'],
  owl:   ['l....l','llllll','lyllyl','llooll','lBBBBl','lBBBBl','.o..o.'],
  torchA: ['..y..','.yoy.','.yoo.','..o..','.lLl.','..L..','..L..','..L..','..L..'],
  torchB: ['.y...','.yy..','.oyy.','..o..','.lLl.','..L..','..L..','..L..','..L..'],
  vase:  ['..kkkk..','...ll...','..llll..','.llyyll.','llllllll','lyylyyly','llllllll','.llllll.','..llll..','.LLLLLL.'],
  globe: ['..bbbb..','.bttbbb.','bbtttbbb','bttbbttb','bbbbtttb','.bbbbtb.','..bbbb..','...LL...','..LLLL..','.LLLLLL.'],
  candle:['..y..','.yoy.','..o..','.BBB.','.BBB.','.BBB.','.BBB.','LLLLL','.LLL.'],
  banner:['LLLLLLLL','.tttttt.','.tddddt.','.tttttt.','.ttyytt.','.tyyyyt.','.ttyytt.','.tttttt.','.tddddt.','.tttttt.','.tt..tt.','.t....t.'],
  statue:['....HHHH....','...HGGGGH...','...GKKKKG...','...GGGGGG...','....GGGG....','..HHGGGGHH..',
          '.HGGGGGGGGH.','.GG.GGGG.GG.','.GG.GGGG.GG.','.GG.GHHG.GG.','..H.GHHG.H..','....GHHG....',
          '....GHHG....','....G..G....','....G..G....','...GG..GG...','..KKKKKKKK..','..GGGGGGGG..',
          '...GGGGGG...','...GHHHHG...','..GGGGGGGG..','.KKKKKKKKKK.'],
  rack:  ['...w....w.....GGG.','..www..wbw...LGGG.','...L...wbw...LGGG.','LLLLLLLLLLLLLLLLLL',
          '...L...wbw...L....','...L...wbw...L....','...L...wbw...L....','...L..yyyyy..L....',
          '...L....l....L....','...L....l....L....','...L....y....L....','...L.........L....',
          'LLLLLLLLLLLLLLLLLL','L................L','L................L','LL..............LL'],
  lectern: ['LLLLLLLLLLLLLLLL','LllllllllllllllL','.LLLLLLLLLLLLLL.','......LLLL......','......LllL......',
            '......LllL......','......LllL......','......LllL......','......LllL......','......LllL......',
            '......LllL......','......LllL......','......LllL......','......LllL......','.....LLLLLL.....',
            '....LllllllL....','...LllllllllL...','..LLLLLLLLLLLL..'],
  tome:  ['.dddddddddd.','dttttyyttttd','dttttyyttttd','qqqqqqqqqqqd','.dddddddddd.'],
  tomeOpen: ['..qqqq..qqqq..','.qqqqqqqqqqqq.','qqqqqqKKqqqqqq','qqqqqqKKqqqqqq','dddddddddddddd'],
  web:   ['uuuuuuuuuuuu','uu...u....u.','u.u..u...u..','u..uuu..u...','u..u.uuu....','uuuu..u.....',
          'u..u.u......','u...u.......','u..u........','u.u.........','uu..........','u...........'],
  capital: ['ONNNNNNNNNNNNNNNNNNO','ONMMMMMMMMMMMMMMMMNO','OMMMMMMMMMMMMMMMMMMO','OOOOOOOOOOOOOOOOOOOO',
            '..ONMMMMMMMMMMMMNO..','..OOOOOOOOOOOOOOOO..'],
  pillarTile: ['ONNMMMMMMMMMMOOO','ONNMMMMMMMMMMOOO','ONNMMMMMMMMMMOOO','ONNMMMMMMMMMMOOO',
               'ONNMMMMMMMMMMOOO','ONNMMMMMMMMMMOOO','ONNMMMMMMMMMMOOO','OOOOOOOOOOOOOOOO'],
  arrowR: ['....k...','....kk..','kkkkkkk.','kkkkkkkk','kkkkkkk.','....kk..','....k...'],
  brick: ['WWWWWWWXWWWWWWWX','VVVVVVVXVVVVVVVX','VVVVVVVXVVVVVVVX','XXXXXXXXXXXXXXXX',
          'WWWXWWWWWWWXWWWW','VVVXVVVVVVVXVVVV','VVVXVVVVVVVXVVVV','XXXXXXXXXXXXXXXX'],
  floor: ['XXXXXXXXXXXXXXXX','ZZZZZZZXZZZZZZZZ','ZAZZZZZXZZZZAZZZ','ZZZZZZZXZZZZZZZZ',
          'XXXXXXXXXXXXXXXX','ZZZXZZZZZZZZXZZZ','ZZZXZZZAZZZZXZZZ','ZZZXZZZZZZZZXZZZ']
};

// sprites built from other sprites
// scroll hall sprites
ART.scroll = ['.LL..................LL.',
              'LllL.qqqqqqqqqqqqqq.LllL',
              'LllLqqqqqqqqqqqqqqqqLllL',
              'LllLqQqqqqqqrrqqqqQqLllL',
              'LllLqqqqqqqrrrrqqqqqLllL',
              'LllLqQqqqqqqrrqqqqQqLllL',
              'LllLQQQQQQQQrrQQQQQQLllL',
              'LllL.QQQQQQrQQrQQQQ.LllL',
              '.LL........r..r......LL.'];
ART.scrollGold = ART.scroll.map(function (r) { return r.replace(/r/g, 't').replace(/L/g, 'Y').replace(/l/g, 'y'); });
ART.scrollLying = ART.scroll.slice(1, 8);
function podiumArt(colRows) {
  var W = 26, out = [];
  var row = function (edge, mid, inner) { return edge + mid.repeat(inner) + edge; };
  out.push('H'.repeat(W), row('H', 'G', W - 2), 'K'.repeat(W));
  out.push('.' + 'H'.repeat(W - 2) + '.', '.' + 'K'.repeat(W - 2) + '.');
  for (var i = 0; i < colRows; i++) {
    var c = (i % 5 === 4) ? 'K' : 'G';
    out.push('...' + 'H' + c.repeat(W - 8) + 'K' + '...');
  }
  out.push('..' + 'H'.repeat(W - 4) + '..', '.' + row('H', 'G', W - 4) + '.', row('H', 'G', W - 2), 'K'.repeat(W));
  return out;
}
ART.podium = podiumArt(14);
ART.podiumTall = podiumArt(19);
ART.scrollRack = (function () {
  var W = 22, out = ['L'.repeat(W)];
  for (var r = 0; r < 4; r++) {
    var a = 'L', b = 'L', c = 'L';
    for (var k = 0; k < 4; k++) {
      var tint = 'qQqb'[(r + k) % 4];
      a += '.qq.L'; b += 'q' + tint + 'Qq' + 'L'; c += '.qq.L';
    }
    out.push(a.slice(0, W - 1) + 'L', b.slice(0, W - 1) + 'L', c.slice(0, W - 1) + 'L', 'L'.repeat(W));
  }
  out.push('L'.repeat(W), 'LL' + '.'.repeat(W - 4) + 'LL');
  return out;
})();
// up and down arrows for the room buttons
ART.arrowDn = ART.arrowR[0].split('').map(function (c, x) {
  return ART.arrowR.map(function (row) { return row[x]; }).join('').replace(/k/g, 't');
});
ART.arrowU = ART.arrowDn.slice().reverse();
// training grounds sprites
ART.dummy = ['....gggg....','...gggggg...','...grggrg...','...gggggg...','....gggg....','.....LL.....','LLLLLLLLLLLL',
             'L..gggggg..L','...gggggg...','...ggrrgg...','...grrrrg...','...ggrrgg...','...gggggg...','...gggggg...',
             '....gggg....','.....LL.....','.....LL.....','.....LL.....','.....LL.....','...LLLLLL...','..LLLLLLLL..'];
ART.target = (function () {
  var out = [];
  for (var y = 0; y < 13; y++) {
    var r = '';
    for (var x = 0; x < 13; x++) {
      var d = Math.sqrt((x - 6) * (x - 6) + (y - 6) * (y - 6));
      r += d > 6.4 ? '.' : d > 5.2 ? 'L' : d > 4 ? 'r' : d > 2.8 ? 'w' : d > 1.5 ? 'r' : 'y';
    }
    out.push(r);
  }
  return out;
})();
ART.barrel = ['..LLLLLL..','.LllllllL.','LKKKKKKKKL','LllLllLllL','LllLllLllL','LllLllLllL','LllLllLllL','LKKKKKKKKL','.LllllllL.','..LLLLLL..'];
ART.pauseI = ['tt.tt','tt.tt','tt.tt','tt.tt','tt.tt','tt.tt'];
ART.playI = ['t....','tt...','ttt..','tttt.','ttt..','tt...','t....'];
ART.map = ['qqqQqqqQ','qrqQqqqQ','qqrQrqqQ','qqqQqrqQ','qqqQqqrQ','qqqQqqqQ'];
// contact icons
ART.phone = ['.kkkkkk.','.kttttk.','.kbbbbk.','.kbbbbk.','.kbbbbk.','.kttttk.','.ktkktk.','.kkkkkk.'];
ART.octo = ['.....t.....','..t...t.t..','.t...t...t.','t....t....t','.t...t...t.','..t.t...t..','....t......'];
// fortinet shield and the messenger with glasses
ART.shield = ['.rrrrrr.','rrwwwwrr','rrwrrwrr','rrwwwwrr','.rrwwrr.','.rrrrrr.','..rrrr..','...rr...'];
ART.messenger = ['...ttttt....','..ttttttttt.','..hhssssss..','..hkbbkbbk..','..hsssssss..','...ssLsss...','....sss.....',
                 '..bbbbbbbL..','.bbbbbbLbb..','.sbbbbLbbbs.','.sbbbLbbbqq.','..bbLLLLLqq.','..nnLllLnn..','..nnLLLLnn..',
                 '..nn....nn..','..nn....nn..','.kkk....kkk.'];
// certification sprites: medal, badge and the display case
ART.medal = ['tr....rt','.tr..rt.','..trrt..','...yy...','..yyyy..','.yyYYyy.','.yyYYyy.','..yyyy..','...yy...'];
ART.badge = ['...tt...','.tttttt.','ttttttwt','tttttwtt','twttwttt','ttwwtttt','.tttttt.','...tt...'];
ART.showcase = (function () {
  var W = 32, H = 36, g = [];
  for (var y = 0; y < H; y++) g.push(new Array(W).fill('.'));
  function fill(x0, y0, x1, y1, c) {
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = c;
  }
  // wooden top
  fill(1, 0, 30, 1, 'L'); fill(0, 2, 31, 2, 'l'); fill(0, 3, 31, 3, 'L');
  // glass box with dark velvet inside and a shelf
  fill(0, 4, 1, 21, 'L'); fill(30, 4, 31, 21, 'L');
  fill(2, 4, 29, 21, 'c');
  fill(2, 13, 29, 13, 'L');
  // two framed certificates and a medal on the top shelf
  [4, 20].forEach(function (x) {
    fill(x, 6, x + 7, 12, 'Y'); fill(x + 1, 7, x + 6, 11, 'q');
    fill(x + 2, 8, x + 5, 8, 'g'); fill(x + 2, 9, x + 4, 9, 'g'); fill(x + 5, 10, x + 6, 11, 't');
  });
  fill(14, 5, 14, 7, 'r'); fill(17, 5, 17, 7, 't'); fill(15, 8, 16, 8, 'r');
  fill(14, 9, 17, 12, 'y'); fill(15, 10, 16, 11, 'Y');
  // a rolled diploma and a trophy on the bottom shelf
  fill(4, 17, 12, 19, 'q'); fill(4, 17, 4, 19, 'Q'); fill(12, 17, 12, 19, 'Q'); fill(8, 16, 8, 20, 't');
  fill(19, 15, 26, 16, 'y'); fill(20, 17, 25, 17, 'y'); fill(21, 18, 24, 18, 'y'); fill(22, 19, 23, 19, 'Y'); fill(20, 20, 25, 20, 'Y');
  fill(18, 15, 18, 16, 'y'); fill(27, 15, 27, 16, 'y');
  // light catching on the glass
  for (var t = 0; t < 8; t++) {
    if (g[18 - t][3 + t] === 'c') g[18 - t][3 + t] = 'I';
    if (g[20 - t][6 + t] === 'c') g[20 - t][6 + t] = 'I';
  }
  fill(2, 4, 29, 4, 'I');
  // cabinet base with two doors and gold knobs
  fill(0, 22, 31, 22, 'L'); fill(0, 23, 31, 32, 'l');
  fill(0, 23, 0, 32, 'L'); fill(31, 23, 31, 32, 'L'); fill(15, 23, 16, 32, 'L');
  fill(3, 25, 12, 25, 'L'); fill(3, 30, 12, 30, 'L'); fill(3, 25, 3, 30, 'L'); fill(12, 25, 12, 30, 'L');
  fill(19, 25, 28, 25, 'L'); fill(19, 30, 28, 30, 'L'); fill(19, 25, 19, 30, 'L'); fill(28, 25, 28, 30, 'L');
  fill(13, 27, 13, 28, 'y'); fill(18, 27, 18, 28, 'y');
  fill(0, 33, 31, 33, 'L'); fill(1, 34, 3, 35, 'L'); fill(28, 34, 30, 35, 'L');
  return g.map(function (r) { return r.join(''); });
})();
ART.portrait = ART.hero.slice(0, 9).map(function (r) { return r.slice(1, 11); });
ART.cloudN = ART.cloud.map(function (r) { return r.replace(/c/g, 'C'); });
ART.arrowL = ART.arrowR.map(function (r) { return r.split('').reverse().join(''); });
ART.webR = ART.web.map(function (r) { return r.split('').reverse().join(''); });
ART.base = ART.capital.slice().reverse();
ART.archRing = ART.brick.map(function (r) { return r.replace(/W/g, 'H').replace(/V/g, 'G').replace(/X/g, 'K'); });
ART.stoneTile = ART.brick.map(function (r) { return r.replace(/W/g, 'N').replace(/V/g, 'M').replace(/X/g, 'O'); });
(function () {
  var full = 'LLLLLLLLLLLLLLLL';
  var w = function (s) { return 'L' + s + 'L'; };
  var books = w('rrttnnbbyyrrtt');
  ART.shelf = [full, books, books, books, books, full,
    w('..BBBB..qqqQqq'), w('.BkBkB..qQqqQq'), w('.BBBBB..qqqQqq'), w('..BgB...qQqqQq'), full,
    w('nnbbyyttrr.yy.'), w('nnbbyyttrr.yy.'), w('nnbbyyttrr.yy.'), w('nnbbyyttrrYYYY'), full,
    w('llllllllllllll'), w('lllllyylllllll'), w('llllllllllllll'), full];
})();

// the castle, drawn cell by cell
ART.castle = (function () {
  var W = 44, H = 34, g = [];
  for (var y = 0; y < H; y++) g.push(new Array(W).fill('.'));
  function fill(x0, y0, x1, y1, c) {
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) g[y][x] = c;
  }
  function stone(x0, y0, x1, y1) {
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
      var c = 'G';
      if (y % 4 === 3) c = 'K';
      else if ((x + ((y >> 2) % 2) * 3) % 6 === 0) c = 'K';
      else if (x === x0) c = 'H';
      g[y][x] = c;
    }
  }
  stone(10, 14, 33, 33);
  stone(0, 8, 9, 33);
  stone(34, 8, 43, 33);
  for (var x = 10; x <= 32; x += 4) fill(x, 12, x + 1, 13, 'G');
  [0, 4, 8, 34, 38, 42].forEach(function (x) { fill(x, 5, x + 1, 7, 'G'); fill(x, 5, x + 1, 5, 'H'); });
  [4, 39].forEach(function (x) { fill(x, 0, x, 4, 'k'); fill(x + 1, 0, x + 3, 1, 't'); fill(x + 1, 2, x + 2, 2, 't'); });
  fill(4, 14, 5, 16, 'y'); fill(38, 14, 39, 16, 'y');
  fill(4, 24, 5, 26, 'J'); fill(38, 24, 39, 26, 'J');
  fill(20, 15, 23, 18, 't'); fill(21, 16, 22, 17, 'y');
  fill(19, 20, 24, 20, 'J'); fill(18, 21, 25, 21, 'J'); fill(17, 22, 26, 33, 'J');
  for (var px = 17; px <= 26; px += 2) fill(px, 22, px, 25, 'K');
  fill(17, 25, 26, 25, 'K');
  return g.map(function (r) { return r.join(''); });
})();

// the fancy double door, with an open version
(function () {
  var plank = ['lLlLlLl', 'KlLlLlL'], band = ['KKKKKKK', 'KKKKKKK'], studs = ['lKlLlKl', 'KlKlLlK'], ring = ['lLlLlLy', 'yLlLlLl'];
  var order = [plank, band, plank, studs, plank, plank, ring, ring, plank, band, plank, studs, plank, plank, plank, band, plank, studs, plank, plank];
  var rows = ['........HHHHHH........', '.....HHHGGttGGHHH.....', '...HHGGGGGttGGGGGHH...',
              '..HGGGKKKKKKKKKKGGGH..', '.HGGKKlLlLlLlLlLKKGGH.', '.HGKlLlLlLlLlLlLKGH.'.replace('.HGKlLlLlLlLlLlLKGH.', '.HGKlLlLlLlLlLlLlLKGH.')];
  order.forEach(function (o) { rows.push('.HGK' + o[0] + o[1] + 'KGH.'); });
  rows.push('HHHHHHHHHHHHHHHHHHHHHH', 'GGGGGGGGGGGGGGGGGGGGGG');
  ART.bigDoor = rows;
  ART.bigDoorOpen = rows.map(function (r, i) {
    if (i < 4 || i >= rows.length - 2) return r;
    var inner = r.slice(4, 18).replace(/./g, 'J');
    inner = 'l' + inner.slice(1, 13) + 'l';
    if (i > 8 && i < rows.length - 4 && i % 3 === 0) inner = inner.slice(0, 6) + 'tt' + inner.slice(8);
    return r.slice(0, 4) + inner + r.slice(18);
  });
})();

// each sprite is drawn once into a tiny picture, then shown scaled up with crisp pixels
// (one small image per sprite is much lighter for slow phones than thousands of SVG squares)
var sprCache = new Map();
function sprURL(rows) {
  var url = sprCache.get(rows);
  if (url) return url;
  var w = rows[0].length, h = rows.length;
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  var g = c.getContext('2d');
  rows.forEach(function (row, y) {
    for (var x = 0; x < w; x++) {
      if (PAL[row[x]]) { g.fillStyle = PAL[row[x]]; g.fillRect(x, y, 1, 1); }
    }
  });
  url = c.toDataURL('image/png');
  sprCache.set(rows, url);
  return url;
}
function sprite(rows, px) {
  return '<img src="' + sprURL(rows) + '" width="' + rows[0].length * px + '" height="' + rows.length * px + '" alt="" draggable="false">';
}
function tileBg(el, name, px) {
  var rows = ART[name];
  el.style.backgroundImage = 'url("' + sprURL(rows) + '")';
  el.style.backgroundSize = rows[0].length * px + 'px ' + rows.length * px + 'px';
}
document.querySelectorAll('.spr').forEach(function (el) {
  el.innerHTML = sprite(ART[el.dataset.s], +el.dataset.px || 4);
});
// tiled pixel backgrounds (grass, dirt, bricks, floor)
document.querySelectorAll('[data-tile]').forEach(function (el) {
  tileBg(el, el.dataset.tile, +el.dataset.px || 6);
});

var reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
function isStill() {
  var c = document.documentElement.classList;
  return c.contains('still') || (reduceMQ.matches && !c.contains('moving'));
}

// stone arches with stepped pixel curves, pillars and cobwebs
function archClip(w, h, rx, ry) {
  var cx = w / 2, step = 8, prev = h;
  var pts = ['0px ' + h + 'px', '0px 0px', w + 'px 0px', w + 'px ' + h + 'px', (cx + rx) + 'px ' + h + 'px'];
  for (var x = cx + rx; x >= cx - rx; x -= step) {
    var t = (x - cx) / rx;
    var y = Math.round((h - Math.sqrt(Math.max(0, 1 - t * t)) * ry) / step) * step;
    pts.push(x + 'px ' + prev + 'px', x + 'px ' + y + 'px');
    prev = y;
  }
  pts.push((cx - rx) + 'px ' + prev + 'px', (cx - rx) + 'px ' + h + 'px', '0px ' + h + 'px');
  return 'polygon(' + pts.join(',') + ')';
}
function buildArches() {
  document.querySelectorAll('[data-arches]').forEach(function (box) {
    var room = box.parentElement, W = room.clientWidth, Hr = room.clientHeight;
    var pw = W < 720 ? 36 : 64, cpx = W < 720 ? 2 : 4, wpx = W < 720 ? 3 : 5;
    var ah = Math.round(Math.min(200, Math.max(140, Hr * 0.22)));
    var pL = Math.round(W * 0.21), pR = Math.round(W * 0.79);
    room.style.setProperty('--ah', ah + 'px');
    box.innerHTML = '';
    var ring = W < 720 ? 10 : 18;
    [[0, pL - pw / 2], [pL + pw / 2, pR - pw / 2], [pR + pw / 2, W]].forEach(function (s) {
      var w = s[1] - s[0], ry = ah - 40;
      // light ring of arch stones, then darker stone above it
      [['archRing', w / 2 - ring, ry - ring], ['stoneTile', w / 2, ry]].forEach(function (layer) {
        var a = document.createElement('div');
        a.className = 'arch';
        a.style.left = s[0] + 'px';
        a.style.width = w + 'px';
        a.style.height = ah + 'px';
        a.style.clipPath = archClip(w, ah, layer[1], layer[2]);
        tileBg(a, layer[0], 4);
        box.appendChild(a);
      });
    });
    [pL, pR].forEach(function (cx) {
      var p = document.createElement('div');
      p.className = 'pillar';
      p.style.left = (cx - pw / 2) + 'px';
      p.style.width = pw + 'px';
      tileBg(p, 'pillarTile', pw / 16);
      p.innerHTML = '<i class="spr cap" style="top:' + (ah - 6 * cpx) + 'px">' + sprite(ART.capital, cpx) + '</i>' +
                    '<i class="spr base">' + sprite(ART.base, cpx) + '</i>';
      box.appendChild(p);
    });
    var ws = 12 * wpx, top = Math.round(ah * 0.42);
    [['webR', pL - pw / 2 - ws], ['web', pR + pw / 2], ['web', 0], ['webR', W - ws]].forEach(function (c) {
      var web = document.createElement('i');
      web.className = 'web';
      web.style.left = c[1] + 'px';
      web.style.top = top + 'px';
      web.innerHTML = sprite(ART[c[0]], wpx);
      box.appendChild(web);
    });
  });
}
buildArches();
addEventListener('resize', buildArches);
