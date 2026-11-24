const ROOMS=[['keuken','in de'],['salon','in de'],['serre','in de'],['hal','in de'],['zolder','op de'],['kelder','in de'],['atelier','in het'],['kantoor','in het'],['garage','in de'],['eetkamer','in de']];
const PEOPLE=[['Anna','#1d6fd1'],['Bram','#e0711b'],['Chantal','#1f9a55'],['Daan','#8a3fc4'],['Eva','#d42f6b'],['Floris','#0b8fa3']];
const VICTIM=['Vincent','#6b6b73'];
const BLOCK={plant:1,kast:1};
const DIFF={
 makkelijk:{n:5,rooms:4,label:'Makkelijk',w:{roomOn:5,roomBeside:4,room:3,on:2,beside:1,edge:1,with:1,alone:2,notroom:0}},
 gemiddeld:{n:6,rooms:5,label:'Gemiddeld',w:{roomOn:3,roomBeside:3,room:3,on:2,beside:2,edge:2,with:2,alone:2,notroom:.4}},
 moeilijk:{n:7,rooms:6,label:'Moeilijk',w:{roomOn:1.5,roomBeside:1.5,room:2,on:2,beside:3,edge:2,with:3,alone:2,notroom:1}}};
function mkRng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function neighbours(c,n){const r=Math.floor(c/n),k=c%n,o=[];if(r>0)o.push(c-n);if(r<n-1)o.push(c+n);if(k>0)o.push(c-1);if(k<n-1)o.push(c+1);return o}

function generate(seed,diffKey){
  const R=mkRng(seed),D=DIFF[diffKey],n=D.n,N=n*n;
  const ri=m=>Math.floor(R()*m);
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=ri(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
  for(let attempt=0;attempt<400;attempt++){
    // kamers laten groeien vanuit zaadjes
    const k=D.rooms,room=new Array(N).fill(-1);
    const seeds=shuffle([...Array(N).keys()]).slice(0,k);
    seeds.forEach((c,i)=>room[c]=i);
    let left=N-k,guard=0;
    while(left>0&&guard++<10000){
      const i=ri(k),front=[];
      for(let c=0;c<N;c++)if(room[c]===i)for(const d of neighbours(c,n))if(room[d]<0)front.push(d);
      if(!front.length)continue;
      room[front[ri(front.length)]]=i;left--;
    }
    const sizes=Array(k).fill(0);room.forEach(r=>sizes[r]++);
    if(sizes.some(s=>s<3||s>N*0.4))continue;
    // meubels
    const obj=new Array(N).fill(null);
    for(let c=0;c<N;c++){const x=R();
      if(x<0.14)obj[c]=R()<0.55?'plant':'kast';
      else if(x<0.36){const y=R();obj[c]=y<0.5?'stoel':y<0.72?'bed':'kleed'}}
    // oplossing: één persoon per rij en kolom
    let cols=null;
    for(let t=0;t<300&&!cols;t++){const p=shuffle([...Array(n).keys()]);if(p.every((col,row)=>!BLOCK[obj[row*n+col]]))cols=p}
    if(!cols)continue;
    const rows=shuffle([...Array(n).keys()]);
    const sol=rows.map(r=>r*n+cols[r]);// persoon i (laatste = slachtoffer)
    const V=n-1,vr=room[sol[V]];
    const withV=[...Array(V).keys()].filter(p=>room[sol[p]]===vr);
    if(withV.length!==1)continue;
    const names=shuffle(ROOMS.slice()).slice(0,k);
    const people=shuffle(PEOPLE.slice()).slice(0,n-1).sort((a,b)=>a[0].localeCompare(b[0])).concat([VICTIM]);
    const pz={seed,diff:diffKey,n,room,obj,names,people:people.map(([name,col])=>({name,col})),V,sol,murderer:withV[0]};
    // per persoon alle ware aanwijzingen verzamelen
    const opts=[];
    for(let p=0;p<n;p++){
      const c=sol[p],rm=room[c],r=Math.floor(c/n),col=c%n,o=obj[c],L=[];
      const nb=[...new Set(neighbours(c,n).filter(d=>room[d]===rm).map(d=>obj[d]).filter(Boolean))];
      L.push({p,t:'room',a:rm});
      if(o){L.push({p,t:'on',a:o});L.push({p,t:'roomOn',a:rm,b:o})}
      nb.forEach(a=>{L.push({p,t:'beside',a});L.push({p,t:'roomBeside',a:rm,b:a})});
      if(r===0)L.push({p,t:'edge',a:'top'});
      if(r===n-1)L.push({p,t:'edge',a:'bottom'});
      if(col===0)L.push({p,t:'edge',a:'left'});
      if(col===n-1)L.push({p,t:'edge',a:'right'});
      const mates=[];for(let q=0;q<n;q++)if(q!==p&&room[sol[q]]===rm)mates.push(q);
      if(p!==V)mates.filter(q=>q!==V).forEach(q=>L.push({p,t:'with',a:q}));
      if(!mates.length)L.push({p,t:'alone'});
      [...Array(k).keys()].filter(x=>x!==rm).forEach(a=>L.push({p,t:'notroom',a}));
      opts.push(L);
    }
    // precies één aanwijzing per persoon kiezen, met een unieke oplossing
    const W=D.w,pickW=L=>{const tot=L.reduce((s,c)=>s+W[c.t],0);let x=R()*tot;for(const c of L){x-=W[c.t];if(x<=0)return c}return L[L.length-1]};
    for(let tries=0;tries<120;tries++){
      const clues=opts.map(pickW);
      if(!giveaway(pz,clues)&&solve(pz,clues)===1){pz.clues=clues;return pz}
    }
  }
  return null;
}

// kamers waarin iemand kan zijn, puur op basis van de eigen aanwijzing
function roomSet(pz,cl){
  const {n,obj,room}=pz,s=new Set();
  for(let c=0;c<n*n;c++)if(!BLOCK[obj[c]]&&checkUnary(pz,cl,c))s.add(room[c]);
  return s;
}
// true als je de dader al ziet zonder het bord in te vullen
function giveaway(pz,clues){
  const V=pz.V,vs=roomSet(pz,clues[V]);
  const sets=clues.slice(0,V).map(cl=>roomSet(pz,cl));
  const cand=sets.filter(s=>[...s].some(r=>vs.has(r)));
  if(cand.length<=1)return true;
  if(vs.size===1){const r=[...vs][0];if(sets.some(s=>s.size===1&&s.has(r)))return true}
  return false;
}
function checkUnary(pz,cl,c){
  const {n,room,obj}=pz;
  switch(cl.t){
    case 'room':return room[c]===cl.a;
    case 'roomOn':return room[c]===cl.a&&obj[c]===cl.b;
    case 'roomBeside':return room[c]===cl.a&&neighbours(c,n).some(d=>room[d]===room[c]&&obj[d]===cl.b);
    case 'notroom':return room[c]!==cl.a;
    case 'on':return obj[c]===cl.a;
    case 'beside':return neighbours(c,n).some(d=>room[d]===room[c]&&obj[d]===cl.a);
    case 'edge':{const r=Math.floor(c/n),k=c%n;return cl.a==='top'?r===0:cl.a==='bottom'?r===n-1:cl.a==='left'?k===0:k===n-1}
  }
  return true;
}
function checkGlobal(pz,clues,pos){
  const {room,V,n}=pz;
  for(const cl of clues){
    if(cl.t==='with'&&room[pos[cl.p]]!==room[pos[cl.a]])return false;
    if(cl.t==='alone'){for(let q=0;q<n;q++)if(q!==cl.p&&room[pos[q]]===room[pos[cl.p]])return false}
  }
  let cnt=0;for(let q=0;q<V;q++)if(room[pos[q]]===room[pos[V]])cnt++;
  return cnt===1;
}
// telt oplossingen (max 2); -1 als het zoeken te lang duurt
function solve(pz,clues,limit=400000){
  const {n,obj}=pz,N=n*n;
  const dom=[];
  for(let p=0;p<n;p++){const u=clues.filter(c=>c.p===p);const d=[];
    for(let c=0;c<N;c++)if(!BLOCK[obj[c]]&&u.every(cl=>checkUnary(pz,cl,c)))d.push(c);
    if(!d.length)return 0;dom.push(d)}
  const order=[...Array(n).keys()].sort((a,b)=>dom[a].length-dom[b].length);
  const pos=new Array(n),ur=new Array(n).fill(false),uc=new Array(n).fill(false);
  const withs=clues.filter(c=>c.t==='with');
  let count=0,nodes=0,over=false;
  const done=new Array(n).fill(false);
  function go(i){
    if(count>1||over)return;
    if(i===n){if(checkGlobal(pz,clues,pos))count++;return}
    const p=order[i];
    for(const c of dom[p]){
      if(++nodes>limit){over=true;return}
      const r=Math.floor(c/n),k=c%n;if(ur[r]||uc[k])continue;
      pos[p]=c;done[p]=true;
      let ok=true;
      for(const w of withs){const o=w.p===p?w.a:w.a===p?w.p:-1;if(o>=0&&done[o]&&pz.room[pos[o]]!==pz.room[c]){ok=false;break}}
      if(ok){ur[r]=uc[k]=true;go(i+1);ur[r]=uc[k]=false}
      done[p]=false;
      if(count>1||over)return;
    }
  }
  go(0);
  return over?-1:count;
}

const OBJ={stoel:['stoel','een stoel'],bed:['bed','een bed'],kleed:['kleed','een kleed'],plant:['plant','een plant'],kast:['boekenkast','een boekenkast']};
function clueText(pz,cl){
  const P=pz.people[cl.p].name,isV=cl.p===pz.V,rn=i=>pz.names[i][1]+' '+pz.names[i][0];
  const been=isV?'lag':'was',stand=isV?'lag':'stond';
  switch(cl.t){
    case 'room':return `${P} ${been} ${rn(cl.a)}.`;
    case 'roomOn':return cl.b==='stoel'?`${P} zat op een stoel ${rn(cl.a)}.`:cl.b==='bed'?`${P} lag op een bed ${rn(cl.a)}.`:`${P} ${stand} op een kleed ${rn(cl.a)}.`;
    case 'roomBeside':return `${P} ${stand} ${rn(cl.a)} naast ${OBJ[cl.b][1]}.`;
    case 'notroom':return `${P} ${been} niet ${rn(cl.a)}.`;
    case 'on':return cl.a==='stoel'?`${P} zat op een stoel.`:cl.a==='bed'?`${P} lag op een bed.`:`${P} ${stand} op een kleed.`;
    case 'beside':return `${P} ${stand} naast ${OBJ[cl.a][1]}.`;
    case 'edge':return `${P} ${stand} ${{top:'in de bovenste rij',bottom:'in de onderste rij',left:'in de linkerkolom',right:'in de rechterkolom'}[cl.a]}.`;
    case 'with':return `${P} ${been} in dezelfde kamer als ${pz.people[cl.a].name}.`;
    case 'alone':return `${P} ${been} helemaal alleen in de kamer.`;
  }
}
if(typeof module!=='undefined')module.exports={generate,solve,clueText,DIFF};
