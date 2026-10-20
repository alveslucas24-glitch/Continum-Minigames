(() => {
  'use strict';
  const host = document.querySelector('#library3d');
  if (!host) return;
  const fallback = document.querySelector('#sceneFallback');
  const badge = document.querySelector('#sceneBadge');
  const halloweenDecor = document.querySelector('#sceneHalloween');
  const cases = [-3.08, 0, 3.08];
  const rowsPerCase = 5;
  let renderer, scene, camera, shelfGroup, pumpkinGroup, spookyGroup, raycaster;
  let yaw = 0.56, targetYaw = 0.56, pitch = 0.16, targetPitch = 0.16, distance = 10.4;
  let drag = null, pointerMoved = false;
  const bookMeshes = [];
  const colors = ['#7c4239','#465d69','#6d764f','#78555a','#a3653d','#4d5680','#75618a','#3f695c','#a84c34','#555b6c','#946e45','#596e76'];
  const mat = (color, roughness=.82) => new THREE.MeshStandardMaterial({color, roughness});
  function box(w,h,d,x,y,z,material,parent=scene) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
  }
  function spineTexture(book, color) {
    const canvas=document.createElement('canvas');canvas.width=128;canvas.height=512;
    const g=canvas.getContext('2d');g.fillStyle=color;g.fillRect(0,0,128,512);
    g.fillStyle='rgba(255,239,194,.75)';g.fillRect(8,17,112,4);g.fillRect(8,490,112,4);
    g.strokeStyle='rgba(255,246,217,.48)';g.lineWidth=2;g.strokeRect(10,29,108,454);
    g.save();g.translate(64,256);g.rotate(-Math.PI/2);g.fillStyle='#fff8e8';g.textAlign='center';g.textBaseline='middle';
    let font=25;g.font=`bold ${font}px Georgia`;while(g.measureText(book.title).width>390&&font>11){font--;g.font=`bold ${font}px Georgia`}
    g.fillText(book.title,0,-4,400);g.font='15px sans-serif';g.fillStyle='#f5d9a7';g.fillText((book.author||'Continum').split(' ').slice(-1)[0],0,22,340);g.restore();
    const tex=new THREE.CanvasTexture(canvas);tex.needsUpdate=true;return tex;
  }
  function makeRoom() {
    const red=mat(0x641e29), dark=mat(0x24191b), trim=mat(0x3a2425), floor=mat(0x574032);
    const upper=new THREE.Mesh(new THREE.PlaneGeometry(48,5.0),red);upper.position.set(0,3.8,-1.22);upper.receiveShadow=false;scene.add(upper);
    const lower=new THREE.Mesh(new THREE.PlaneGeometry(48,1.35),dark);lower.position.set(0,.62,-1.20);lower.receiveShadow=false;scene.add(lower);
    box(48,.12,.12,0,1.34,-1.12,trim);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,24),floor);ground.rotation.x=-Math.PI/2;ground.position.set(0,-.17,3.6);ground.receiveShadow=true;scene.add(ground);
    const floorSeams=new THREE.Group(),seamMat=new THREE.LineBasicMaterial({color:0x3b2926,transparent:true,opacity:.38});for(let z=-6;z<=14;z+=.72){floorSeams.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-16,-.158,z),new THREE.Vector3(16,-.158,z)]),seamMat))}for(let x=-15;x<=15;x+=2.6)for(let z=-5.5;z<=14;z+=1.44){floorSeams.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,-.158,z),new THREE.Vector3(x,-.158,z+.72)]),seamMat))}scene.add(floorSeams);
    const panelEdge=mat(0x875a4b,.82);for(let x=-14.5;x<=14.5;x+=2.9){box(2.55,.09,.045,x,.99,-1.08,panelEdge);box(.06,.47,.045,x-1.27,.75,-1.08,panelEdge);box(.06,.47,.045,x+1.27,.75,-1.08,panelEdge);box(2.5,.04,.05,x,.51,-1.08,panelEdge)}box(40,.16,.13,0,.19,-1.09,panelEdge);box(40,.08,.11,0,1.40,-1.09,panelEdge);
    const rug=document.createElement('canvas');rug.width=256;rug.height=256;const g=rug.getContext('2d');g.fillStyle='#783438';g.fillRect(0,0,256,256);g.strokeStyle='#d7b76a';g.lineWidth=8;g.strokeRect(10,10,236,236);g.lineWidth=3;g.strokeRect(22,22,212,212);g.strokeRect(42,42,172,172);g.fillStyle='#d7b76a';for(let i=0;i<8;i++){g.save();g.translate(128,128);g.rotate(i*Math.PI/4);g.fillRect(-3,-90,6,180);g.restore()}
    const rugMesh=new THREE.Mesh(new THREE.PlaneGeometry(7.2,2.3),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(rug),roughness:1}));rugMesh.rotation.x=-Math.PI/2;rugMesh.position.set(0,-.155,2.25);rugMesh.receiveShadow=true;scene.add(rugMesh);
  }
  function makeVase(x,y,z,scale,color) {
    const profile=[new THREE.Vector2(.02,0),new THREE.Vector2(.15,0),new THREE.Vector2(.22,.12),new THREE.Vector2(.19,.27),new THREE.Vector2(.10,.39),new THREE.Vector2(.09,.50),new THREE.Vector2(.12,.51)];
    const vase=new THREE.Mesh(new THREE.LatheGeometry(profile,20),mat(color,.42));vase.position.set(x,y,z);vase.scale.setScalar(scale);vase.castShadow=true;scene.add(vase);
  }
  function makePlant(x,y,z,scale=1) {
    const pot=mat(0xc58961,.55),leaf=mat(0x486744,.9),leaf2=mat(0x698458,.9);
    const pg=new THREE.Mesh(new THREE.CylinderGeometry(.15*scale,.11*scale,.25*scale,12),pot);pg.position.set(x,y+.125*scale,z);pg.castShadow=true;scene.add(pg);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5,mesh=new THREE.Mesh(new THREE.ConeGeometry(.10*scale,.52*scale,8),i%2?leaf:leaf2);mesh.position.set(x+Math.cos(a)*.12*scale,y+.48*scale,z+Math.sin(a)*.10*scale);mesh.rotation.z=Math.cos(a)*.35;mesh.rotation.x=Math.sin(a)*.3;mesh.castShadow=true;scene.add(mesh)}
  }
  function makeGlobe(x,y,z,scale=1) {
    const mount=mat(0xc49a58,.5),ocean=mat(0x3c7892,.4);
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(.19*scale,20,16),ocean);sphere.position.set(x,y+.27*scale,z);sphere.castShadow=true;scene.add(sphere);
    const foot=new THREE.Mesh(new THREE.CylinderGeometry(.04*scale,.10*scale,.16*scale,10),mount);foot.position.set(x,y+.08*scale,z);foot.castShadow=true;scene.add(foot);
  }
  function makeFrame(x,y,z) {
    const frame=mat(0xb48b53,.58),paper=mat(0xf4e4c5,.95),red=mat(0x854536,.8);
    box(.47,.55,.07,x,y+.31,z,frame);box(.35,.42,.035,x,y+.31,z+.045,paper);
    const art=new THREE.Mesh(new THREE.CircleGeometry(.105,18),red);art.position.set(x,y+.31,z+.07);art.castShadow=true;scene.add(art);
  }
  function makeStack(x,y,z,seed) {
    for(let i=0;i<3;i++){
      const width=.5+(i%2)*.11,mesh=new THREE.Mesh(new THREE.BoxGeometry(width,.10,.30),mat(colors[(seed+i)%colors.length],.9));
      mesh.position.set(x+(i%2?-.025:.02),y+.06+i*.105,z);mesh.rotation.y=(i%2?-.06:.04);mesh.castShadow=true;scene.add(mesh);
    }
  }
  function addRoomDecor() {
    // Um vaso de folhas no alto e pequenos objetos entre os livros, como na referência.
    makePlant(0,4.39,-.02,1.2);
    const brass=mat(0xc39553,.46),mount=mat(0x3b2424,.8),flameMat=new THREE.MeshStandardMaterial({color:0xffb743,emissive:0xff6a18,emissiveIntensity:1.8,roughness:.4});for(const x of [-6.15,6.15]){box(.38,.22,.12,x,3.65,-1.05,mount);box(.08,.48,.08,x,3.93,-1.02,brass);const candle=new THREE.Mesh(new THREE.CylinderGeometry(.08,.095,.3,12),mat(0xe7d5b7,.8));candle.position.set(x,4.08,-1.02);scene.add(candle);const flame=new THREE.Mesh(new THREE.SphereGeometry(.075,10,8),flameMat);flame.scale.set(.7,1.35,.7);flame.position.set(x,4.29,-1.02);scene.add(flame);const glow=new THREE.PointLight(0xff8c35,.34,4);glow.position.set(x,4.3,-.65);scene.add(glow)}
    for(let cell=0;cell<cases.length*rowsPerCase;cell++){
      const ci=Math.floor(cell/rowsPerCase),row=cell%rowsPerCase,cx=cases[ci],boardY=.10+row*.82;
      const side=(cell%2===0)?1:-1,propX=cx+side*.77,z=.27,y=boardY+.09;
      switch(cell%5){
        case 0: makeVase(propX,y,z,.62,cell%10===0?0xb15342:0xc69a62); break;
        case 1: makeFrame(propX,y,z); break;
        case 2: makePlant(propX,y,z,.58); break;
        case 3: makeGlobe(propX,y,z,.75); break;
        case 4: makeStack(propX,y,z,cell); break;
      }
    }
  }
  function addBookcases() {
    const wood=mat(0xf0e6d4,.7),sideMat=mat(0xe2d3bf,.78),back=mat(0x755d55,.93),shelf=mat(0xfff8ec,.62),edge=mat(0xcbb89d,.72),dark=mat(0x493332,.76);
    cases.forEach((cx,unit)=>{
      const w=2.86,depth=.94,height=4.45,centerY=2.20;
      box(w-.18,height-.08,.10,cx,centerY,-.43,back);
      box(.16,height,depth,cx-w/2+.08,centerY,0,wood);box(.16,height,depth,cx+w/2-.08,centerY,0,wood);
      // Laterais internas e painéis de sombra tornam cada móvel distinto da parede.
      box(.035,height-.13,.035,cx-w/2+.18,centerY,.48,edge);box(.035,height-.13,.035,cx+w/2-.18,centerY,.48,edge);
      for(let row=0;row<=rowsPerCase;row++){
        const y=.10+row*.82;box(w-.25,.105,depth,cx,y,0,shelf);
        box(w-.25,.025,.035,cx,y-.06,.475,edge);
        box(w-.25,.028,.025,cx,y+.055,-.46,dark);
      }
      // Pequenas molduras decorativas no topo e rodapé de cada estante.
      box(w,.13,depth+.04,cx,4.36,.01,wood);box(w,.12,depth+.04,cx,.025,.01,wood);
      box(w-.10,.035,.035,cx,4.285,.49,edge);box(w-.10,.035,.035,cx,.095,.49,edge);
      if(unit<2){const knob=new THREE.Mesh(new THREE.SphereGeometry(.055,12,10),mat(0xc49a58,.5));knob.position.set(cx+(unit===0?1.36:-1.36),.18,.52);scene.add(knob)}
    });
  }
  function addBooks(books) {
    if(!shelfGroup)return;
    for(const object of bookMeshes){shelfGroup.remove(object.mesh);object.mesh.geometry.dispose();object.mesh.material.forEach(m=>{if(m.map)m.map.dispose();m.dispose()})}
    bookMeshes.length=0;
    const visibleBooks=books.slice(0,60),totalCells=cases.length*rowsPerCase,slotWidth=.31,gap=.045;
    visibleBooks.forEach((book,index)=>{
      const cell=index%totalCells,slot=Math.floor(index/totalCells),unit=Math.min(cases.length-1,Math.floor(cell/rowsPerCase)),row=cell%rowsPerCase,cx=cases[unit];
      const onCell=Math.floor((visibleBooks.length-1-cell)/totalCells)+1;
      const width=slotWidth+((index*13)%5)*.012,height=.45+((index*17)%23)/100,depth=.21,color=book.color||colors[index%colors.length];
      const groupWidth=onCell*slotWidth+(onCell-1)*gap,side=cell%2===0?-1:1;
      const startX=side<0?cx-1.26:cx+1.26-groupWidth;
      const x=startX+slot*(slotWidth+gap)+width/2,y=.10+row*.82+.08+height/2;
      const spine=new THREE.MeshStandardMaterial({map:spineTexture(book,color),roughness:.68}),cover=mat(color,.75),pages=mat(0xf1e9db,.92);
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(width,height,depth),[cover,cover,pages,pages,spine,cover]);
      mesh.position.set(x,y,.20);mesh.rotation.z=((index%5)-2)*.018;mesh.rotation.y=((index%3)-1)*.045;mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.book=book;shelfGroup.add(mesh);bookMeshes.push({mesh,book});
    });
    if(badge)badge.innerHTML=`📚 <span>${visibleBooks.length} livros · 3 estantes · 15 prateleiras</span>`;
  }
  function addSpookyDetails(){spookyGroup=new THREE.Group();scene.add(spookyGroup);const webMat=new THREE.LineBasicMaterial({color:0xd8c7d1,transparent:true,opacity:.48});for(const side of [-1,1]){const cx=side*6.35,cy=4.62,cz=-1.01;for(let spoke=0;spoke<7;spoke++){const a=spoke*Math.PI/3;spookyGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(cx,cy,cz),new THREE.Vector3(cx+Math.cos(a)*.82,cy+Math.sin(a)*.72,cz)]),webMat))}for(let ring=1;ring<=4;ring++){const pts=[];for(let i=0;i<=56;i++){const a=i/56*Math.PI*2,r=ring/4;pts.push(new THREE.Vector3(cx+Math.cos(a)*.82*r,cy+Math.sin(a)*.72*r,cz))}spookyGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),webMat))}}const batMat=mat(0x17131d,.82);for(let i=0;i<5;i++){const group=new THREE.Group(),x=-4.2+i*2.08,y=4.88-(i%2)*.18,body=new THREE.Mesh(new THREE.SphereGeometry(.075,8,7),batMat);body.scale.set(.6,1.5,.5);group.add(body);for(const dir of [-1,1]){const wing=new THREE.Mesh(new THREE.ConeGeometry(.19,.48,3),batMat);wing.position.set(dir*.17,.04,0);wing.rotation.z=dir*-1.1;group.add(wing)}group.position.set(x,y,-.96);group.rotation.z=i%2?-.15:.15;spookyGroup.add(group)}const sparkleMat=new THREE.PointsMaterial({color:0xffd8a0,size:.035,transparent:true,opacity:.55}),positions=[];for(let i=0;i<110;i++)positions.push((Math.random()-.5)*13,Math.random()*4.8+.2,Math.random()*4-.8);const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));spookyGroup.add(new THREE.Points(dustGeo,sparkleMat))}
  function addPumpkins() {
    pumpkinGroup=new THREE.Group();scene.add(pumpkinGroup);
    for(const x of [-4.45,4.45]){
      const p=new THREE.Group();p.position.set(x,.08,1.18);pumpkinGroup.add(p);
      const fruit=new THREE.Mesh(new THREE.SphereGeometry(.32,20,16),mat(0xef792c,.72));fruit.scale.set(1,.83,.86);fruit.castShadow=true;p.add(fruit);
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(.035,.055,.13,8),mat(0x55683c));stem.position.y=.28;stem.rotation.z=.16;stem.castShadow=true;p.add(stem);
      const eyeMat=new THREE.MeshStandardMaterial({color:0x2c1b16,roughness:1});
      for(const ex of [-.105,.105]){const eye=new THREE.Mesh(new THREE.ConeGeometry(.045,.10,3),eyeMat);eye.position.set(ex,.035,.265);eye.rotation.x=.35;p.add(eye)}
      const mouth=new THREE.Mesh(new THREE.BoxGeometry(.12,.035,.018),eyeMat);mouth.position.set(0,-.095,.272);p.add(mouth);
    }
  }
  function resize(){if(!renderer||!camera)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));camera.aspect=w/h;camera.updateProjectionMatrix()}
  function setSeason(){const spooky=document.body.dataset.season==='halloween'||document.body.dataset.page==='terror';if(pumpkinGroup)pumpkinGroup.visible=spooky;if(spookyGroup)spookyGroup.visible=spooky;if(halloweenDecor)halloweenDecor.hidden=!spooky;if(scene)scene.background.set(spooky?0x21151e:0x352426)}
  function update(){requestAnimationFrame(update);yaw+=(targetYaw-yaw)*.08;pitch+=(targetPitch-pitch)*.08;camera.position.set(Math.sin(yaw)*distance,2.28+pitch*distance,Math.cos(yaw)*distance);camera.lookAt(0,2.22,0);renderer.render(scene,camera)}
  function pick(e){const r=renderer.domElement.getBoundingClientRect(),pointer=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(bookMeshes.map(x=>x.mesh),false)[0];if(!hit)return;const book=hit.object.userData.book;if(book.unlock&&window.ContinumGame.getPasses()<book.unlock){window.ContinumGame.notify(`Este livro precisa de ${book.unlock} passe(s) para ser aberto.`);return}window.ContinumGame.openBook(book)}
  function bind(){const canvas=renderer.domElement;canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY};pointerMoved=false;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>4)pointerMoved=true;targetYaw-=dx*.006;targetPitch=Math.max(-.16,Math.min(.36,targetPitch+dy*.003));drag.lastX=e.clientX;drag.lastY=e.clientY});canvas.addEventListener('pointerup',e=>{if(drag&&!pointerMoved)pick(e);drag=null});canvas.addEventListener('pointercancel',()=>{drag=null});canvas.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(8.2,Math.min(16,distance+Math.sign(e.deltaY)*.6))},{passive:false});canvas.addEventListener('pointerleave',()=>{if(!drag)canvas.style.cursor='grab'});canvas.addEventListener('pointermove',()=>canvas.style.cursor=drag?'grabbing':'grab');
    const left=document.querySelector('#sceneLeft'),right=document.querySelector('#sceneRight'),out=document.querySelector('#sceneZoomOut'),inside=document.querySelector('#sceneZoomIn');if(left)left.onclick=()=>targetYaw-=.42;if(right)right.onclick=()=>targetYaw+=.42;if(out)out.onclick=()=>distance=Math.min(16,distance+1);if(inside)inside.onclick=()=>distance=Math.max(8.2,distance-1);
  }
  function init(){
    if(!window.THREE){if(fallback)fallback.hidden=false;return}
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch(error){console.error('WebGL não pôde iniciar.',error);if(fallback)fallback.hidden=false;return}
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x352426,1);host.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-label','Biblioteca tridimensional com três estantes. Arraste para girar, role ou use os botões para zoom e clique num livro completo para ler.');
    scene=new THREE.Scene();scene.background=new THREE.Color(0x352426);camera=new THREE.PerspectiveCamera(36,1,.1,70);
    scene.add(new THREE.HemisphereLight(0xffeedb,0x211719,.7));const key=new THREE.DirectionalLight(0xffe9cf,1.05);key.position.set(-4,8,7);key.castShadow=true;key.shadow.mapSize.set(1536,1536);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-4;scene.add(key);const fill=new THREE.DirectionalLight(0xc1d8ff,.28);fill.position.set(5,4,3);scene.add(fill);const warm=new THREE.PointLight(0xffc77e,.23,12);warm.position.set(0,4.8,3);scene.add(warm);
    makeRoom();addBookcases();shelfGroup=new THREE.Group();scene.add(shelfGroup);addRoomDecor();addPumpkins();addSpookyDetails();raycaster=new THREE.Raycaster();addBooks(window.ContinumGame?.getBooks?.()||[]);fallback.hidden=true;bind();new ResizeObserver(resize).observe(host);resize();setSeason();update();
  }
  window.addEventListener('continum:books-changed',e=>addBooks(e.detail.books));window.addEventListener('continum:season-changed',setSeason);window.addEventListener('DOMContentLoaded',init,{once:true});
})();
