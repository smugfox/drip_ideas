/* Mock data for the Drip prototype (no backend).
   Placeholder images are real assets pulled from dripshop.live/for-you. */
window.DRIP = (function () {
  const grads = ['g-purple','g-blue','g-green','g-red','g-gold','g-teal','g-pink','g-slate'];

  // real stream thumbnails (cdn.dripshop.live) used as card placeholders
  const T = [
    'https://cdn.dripshop.live/stream/hEQRZo5dT5Zpm_4elcSnR.webp',
    'https://cdn.dripshop.live/stream/64TVslbxmtatgOCvBGQmr.webp',
    'https://cdn.dripshop.live/stream/R3pfyBfEfntqtFHr821DE.webp',
    'https://cdn.dripshop.live/stream/OBJrxG0KyYlExahgBq4TZ.webp',
    'https://cdn.dripshop.live/stream/UwDjtnmkA6XmbdBdzn8s6.webp',
    'https://cdn.dripshop.live/stream/z6ZYqGsGJcxqPZf80X4uw.webp',
    'https://cdn.dripshop.live/stream/8TzvfFgV4oxvH9UKu1Epc.webp',
    'https://cdn.dripshop.live/stream/n7gqKm3zjqtvqG1s6FYXa.webp',
    'https://cdn.dripshop.live/stream/2q-l7p-G3WDz1kGnd3xcD.webp',
    'https://cdn.dripshop.live/stream/yYlwKrHryzavt0GIu2S4H.webp',
    'https://cdn.dripshop.live/stream/jEHb2BptCfeUVaoieW4fu.webp',
    'https://cdn.dripshop.live/stream/frbVaRiqNm6BhkBbvt3_7.webp',
  ];
  // real product/pack images for the live-room lots + shop
  const P = {
    reshiram: 'https://cdn.dripshop.live/product/rdJ3t3sV_EHMrU37M040F_thumbnail.webp',
    groudon:  'https://cdn.dripshop.live/product/IPbzxg7-Pdw29W1g3I1gB_thumbnail.webp',
    leafeon:  'https://cdn.dripshop.live/product/K9_KBuiJC7xsVF-ozDH8d_thumbnail.webp',
    starter:  'https://cdn.dripshop.live/product/asJ6jrGfDUPnn8NraAWpH_thumbnail.png',
    phantasm: 'https://cdn.dripshop.live/product/rwoI_Qusv1XEc896u94-s_thumbnail.webp',
    japan:    'https://cdn.dripshop.live/product/DrPqw3kVNwrpF2CuKGmOd_thumbnail.webp',
    mega:     'https://cdn.dripshop.live/product/qGFZRZJaPaRzvZUuMFFcV_thumbnail.png',
    mario:    'https://cdn.dripshop.live/product/vgib6T59TPbskCgO98Y5z_thumbnail.png',
  };
  const stageBg = T[1]; // landscape card-wall shot for the video stage

  // real seller avatars (cdn.dripshop.live user-profile thumbnails)
  const AV = [
    'https://cdn.dripshop.live/user-profile/2w6bZuj-J10VeZUr51iLg_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/DKCpvFP-X7rJHIOovYdZe_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/mf0kHV6_C_Ms9fzW3F-Bv_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/sKMyGuK_2NrlhW2MvCfLG_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/pmuf-52oWXednXcMKyAgo_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/UQ0IFWQ4HEbJY5-aFsrln_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/f3MVYJ4bMauL9NV56Angz_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/L1Lf5MlXqsZAEF00U1SYh_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/xzcUxFNDcysXmrcwHzWbh_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/qcmp_VgtHfucj4fUuNKBk_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/GDsD7fXqj-DXCiW1FcGba_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/b5fCZDZghDnvDnPoXDE6w_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/q4r8sfVUigs2AZQ6AAt3V_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/jxdrKvOw7gqqOF-kd9Mcv_thumbnail.jpg',
    'https://cdn.dripshop.live/user-profile/EfPr6DEh9UrzlO2MxB-r2_thumbnail.jpg',
  ];
  const avatars = {
    Charmenic: AV[0], hue_jazz: AV[1], Ogodno: AV[2], ProfOakes: AV[3],
    raregrails: AV[4], packfresh: AV[5], gumgum_go: AV[6], thevault: AV[7],
    eveecards: AV[8], voltage: AV[9], dexfiller: AV[10], artfull: AV[11],
    snapcity: AV[12], holo_hunter: AV[13], figfanatic: AV[14],
    midnightpulls: AV[11], shinyvault: AV[4], gradegeek: AV[6],
  };

  const categories = ['All','Pokémon','One Piece','Sports','Figures','Sealed','Marvel','Influencer'];

  const happeningNow = [
    { id:'charmenic', title:'PITCH BLACK + non-stop giveaways', seller:'Charmenic', rating:4.9, viewers:312, cat:'Pokémon', g:'g-purple', img:T[0], featured:true },
    { id:'huejazz',   title:'Silver slabs & sealed — $1 start', seller:'hue_jazz', rating:4.8, viewers:184, cat:'One Piece', g:'g-red', img:T[1] },
    { id:'ogodno',    title:'Collector Friday · extra buyer goodies', seller:'Ogodno', rating:5.0, viewers:96, cat:'Sports', g:'g-teal', img:T[2] },
    { id:'oakes',     title:'Come see Baby Samson!!!', seller:'ProfOakes', rating:5.0, viewers:41, cat:'Figures', g:'g-gold', img:T[3] },
    { id:'snapcity',  title:'Sealed Saturday — box after box', seller:'snapcity', rating:4.8, viewers:73, cat:'Sealed', g:'g-green', img:T[7] },
    { id:'holohunter', title:'Marvel holo hunt — rare inserts', seller:'holo_hunter', rating:4.9, viewers:58, cat:'Marvel', g:'g-blue', img:T[5] },
  ];

  const startingSoon = [
    { id:'s1', title:'Vintage WOTC break', seller:'raregrails', in:'25m', cat:'Pokémon', g:'g-blue', img:T[4] },
    { id:'s2', title:'Modern sealed rip battle', seller:'packfresh', in:'40m', cat:'Sealed', g:'g-green', img:T[5] },
    { id:'s3', title:'One Piece OP-09 case', seller:'gumgum_go', in:'1h', cat:'One Piece', g:'g-red', img:T[6] },
    { id:'s4', title:'Slab Sunday preview', seller:'thevault', in:'2h', cat:'Sports', g:'g-slate', img:T[7] },
    { id:'s5', title:'Figure Friday warm-up', seller:'figfanatic', in:'3h', cat:'Figures', g:'g-pink', img:T[8] },
    { id:'s6', title:'Midnight grails — $1 starts', seller:'midnightpulls', in:'4h', cat:'Pokémon', g:'g-purple', img:T[10] },
  ];

  const forYou = [
    { id:'f1', title:'Eeveelution elite chase', seller:'eveecards', rating:4.7, viewers:57, cat:'Pokémon', g:'g-teal', img:T[8] },
    { id:'f2', title:'Gold Pikachu hunt', seller:'voltage', rating:4.7, viewers:33, cat:'Pokémon', g:'g-gold', img:T[9] },
    { id:'f3', title:'151 master set night', seller:'dexfiller', rating:4.9, viewers:120, cat:'Pokémon', g:'g-purple', img:T[10] },
    { id:'f4', title:'Trainer gallery pulls', seller:'artfull', rating:4.6, viewers:22, cat:'Pokémon', g:'g-pink', img:T[11] },
    { id:'f5', title:'Shiny vault openings', seller:'shinyvault', rating:4.8, viewers:44, cat:'Pokémon', g:'g-blue', img:T[2] },
    { id:'f6', title:'Grade-worthy pulls only', seller:'gradegeek', rating:4.9, viewers:66, cat:'Pokémon', g:'g-red', img:T[6] },
  ];

  const replays = [
    { id:'r1', title:'Charmenic — Base Set night', seller:'Charmenic', len:'48:12', g:'g-purple', img:T[3] },
    { id:'r2', title:'hue_jazz — sealed marathon', seller:'hue_jazz', len:'1:02:40', g:'g-red', img:T[5] },
    { id:'r3', title:'Ogodno — sports slab sniping', seller:'Ogodno', len:'22:05', g:'g-teal', img:T[7] },
    { id:'r4', title:'voltage — gold rush', seller:'voltage', len:'35:18', g:'g-gold', img:T[9] },
    { id:'r5', title:'ProfOakes — figure frenzy', seller:'ProfOakes', len:'41:22', g:'g-gold', img:T[10] },
    { id:'r6', title:'eveecards — evolution night', seller:'eveecards', len:'58:03', g:'g-teal', img:T[11] },
  ];

  // Live room: the lot queue (mix of auctions + buy-now)
  const lots = [
    { id:'l1', type:'auction', name:'Charizard', set:'Base Set · PSA 8', start:120, inc:5, dur:22, g:'g-red', img:P.reshiram },
    { id:'l2', type:'buynow',  name:'Pitch Black Booster Pack', set:'Sealed · 170 left', price:11.77, g:'g-purple', img:P.phantasm },
    { id:'l3', type:'auction', name:'Umbreon VMAX', set:'Evolving Skies · Alt Art', start:60, inc:5, dur:20, g:'g-slate', img:P.leafeon },
    { id:'l4', type:'buynow',  name:'Silver Pokémon Slab Pack', set:'Rarity based · odds vary', price:50, g:'g-blue', img:P.starter },
    { id:'l5', type:'auction', name:'Mewtwo', set:'Wizards Promo · BGS 9', start:40, inc:5, dur:18, g:'g-teal', img:P.groudon },
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
  return { categories, happeningNow, startingSoon, forYou, replays, lots, bidderNames, chatSeed, chatFiller, grad, stageBg, avatars };
})();
