/* Mock data for the Drip prototype (no backend). */
window.DRIP = (function () {
  const grads = ['g-purple','g-blue','g-green','g-red','g-gold','g-teal','g-pink','g-slate'];

  const categories = ['All','Pokémon','One Piece','Sports','Figures','Sealed','Marvel','Influencer'];

  const happeningNow = [
    { id:'charmenic', title:'PITCH BLACK + non-stop giveaways', seller:'Charmenic', rating:4.9, viewers:312, cat:'Pokémon', g:'g-purple', featured:true },
    { id:'huejazz',   title:'Silver slabs & sealed — $1 start', seller:'hue_jazz', rating:4.8, viewers:184, cat:'One Piece', g:'g-red' },
    { id:'ogodno',    title:'Collector Friday · extra buyer goodies', seller:'Ogodno', rating:5.0, viewers:96, cat:'Sports', g:'g-teal' },
    { id:'oakes',     title:'Come see Baby Samson!!!', seller:'ProfOakes', rating:5.0, viewers:41, cat:'Figures', g:'g-gold' },
  ];

  const startingSoon = [
    { id:'s1', title:'Vintage WOTC break', seller:'raregrails', in:'25m', cat:'Pokémon', g:'g-blue' },
    { id:'s2', title:'Modern sealed rip battle', seller:'packfresh', in:'40m', cat:'Sealed', g:'g-green' },
    { id:'s3', title:'One Piece OP-09 case', seller:'gumgum_go', in:'1h', cat:'One Piece', g:'g-red' },
    { id:'s4', title:'Slab Sunday preview', seller:'thevault', in:'2h', cat:'Sports', g:'g-slate' },
  ];

  const forYou = [
    { id:'f1', title:'Eeveelution elite chase', seller:'eveecards', rating:4.7, viewers:57, cat:'Pokémon', g:'g-teal' },
    { id:'f2', title:'Gold Pikachu hunt', seller:'voltage', rating:4.7, viewers:33, cat:'Pokémon', g:'g-gold' },
    { id:'f3', title:'151 master set night', seller:'dexfiller', rating:4.9, viewers:120, cat:'Pokémon', g:'g-purple' },
    { id:'f4', title:'Trainer gallery pulls', seller:'artfull', rating:4.6, viewers:22, cat:'Pokémon', g:'g-pink' },
  ];

  const replays = [
    { id:'r1', title:'Charmenic — Base Set night', seller:'Charmenic', len:'48:12', g:'g-purple' },
    { id:'r2', title:'hue_jazz — sealed marathon', seller:'hue_jazz', len:'1:02:40', g:'g-red' },
    { id:'r3', title:'Ogodno — sports slab sniping', seller:'Ogodno', len:'22:05', g:'g-teal' },
    { id:'r4', title:'voltage — gold rush', seller:'voltage', len:'35:18', g:'g-gold' },
  ];

  // Live room: the lot queue (mix of auctions + buy-now)
  const lots = [
    { id:'l1', type:'auction', name:'Charizard', set:'Base Set · PSA 8', start:120, inc:5, dur:22, g:'g-red' },
    { id:'l2', type:'buynow',  name:'Pitch Black Booster Pack', set:'Sealed · 170 left', price:11.77, g:'g-purple' },
    { id:'l3', type:'auction', name:'Umbreon VMAX', set:'Evolving Skies · Alt Art', start:60, inc:5, dur:20, g:'g-slate' },
    { id:'l4', type:'buynow',  name:'Silver Pokémon Slab Pack', set:'Rarity based · odds vary', price:50, g:'g-blue' },
    { id:'l5', type:'auction', name:'Mewtwo', set:'Wizards Promo · BGS 9', start:40, inc:5, dur:18, g:'g-teal' },
  ];

  const bidderNames = ['pokemom','j_kay90','collector7','mikec_tcg','snorlax_zzz','raregrails','pipcharms','voltage'];
  const chatSeed = [
    { u:'jessaruu', t:'waaaah that pull 🔥' },
    { u:'treadlightly', t:'ggs chris' },
    { u:'mikec_tcg', t:'is the zard still up?' },
    { u:'pokemom', t:'sniped! lets go' },
    { u:'drip_ash', t:'first time here, love this' },
    { u:'nb_nate', t:'🎉🎉🎉' },
  ];
  const chatFiller = [
    'this seller is so clean','W stream','need that umbreon','+1','lets goooo','bid bid bid',
    'shipping fast?','ty for the giveaway 🙏','that alt art 😍','how many left?','GG','first!',
    'been waiting for this','packing asap 📦','love the energy','snipe incoming 👀'
  ];

  function grad(i){ return grads[i % grads.length]; }
  return { categories, happeningNow, startingSoon, forYou, replays, lots, bidderNames, chatSeed, chatFiller, grad };
})();
