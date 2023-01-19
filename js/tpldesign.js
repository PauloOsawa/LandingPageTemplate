/**
 * Documento JS criado por Paulo Osawa
 * Código Destinado à página Landing Page - Template Design
 * Colaboradores:
 */
const winOnload = () => {

  const setElemnts = (arElms = [], pai) => arElms.map(elm => (pai ?? document).querySelector(elm));
  const setAllElemnts = (arElms = [], pai) => arElms.map(elm => (pai ?? document).querySelectorAll(elm));
  const [navdesk, menu, main, btnl, carsel] = setElemnts(['.navdesk', '#menu', 'main', '.btnl', '.dvcarsel']);
  const [btbenefs, frm] = setElemnts(['button[name=btgobenefs]', '[name=frmcadastro]'], main);
  const [bthearts, boxsectn, inpts] = setAllElemnts(['.btheart', '.boxsectn', 'form input:not([type=submit])'], main);
  const [txtarea, spncount, spnmsgerr, btnsubmt] = setElemnts(['textarea', '.txtcount', '.msgerr', 'input[type=submit]'], frm);

  const scrolTo = (id) => {
    main.querySelector(id).scrollIntoView({ block:'start', behavior: 'smooth'});
  }
  const scrola = (e) => {
    e.preventDefault(); const href = e.target.getAttribute('href');
    if (href) { document.querySelector(href).scrollIntoView({ block:'start', behavior: 'smooth'}); }
  }

  navdesk.querySelectorAll('a').forEach(lia => lia.onclick = (e) => scrola(e) );

  const openMenu = (e) => { e.preventDefault(); e.stopPropagation(); menu.classList.add('aberto'); }
  const closeMenu = (e) => { scrola(e); menu.classList.remove('aberto'); }
  document.querySelector('#btmenu > li').onclick = openMenu;
  menu.querySelectorAll('ul > li').forEach((li => li.onclick = closeMenu));
  btbenefs.onclick = e => scrolTo('#beneficios');
  bthearts.forEach( bth => bth.onclick = (e) => bth.querySelector('.svheart').classList.toggle('filred'));

  const togOpenBox = (elm) => {
    const aberto = main.querySelector(`.open`);
    if(aberto){
      aberto.classList.toggle('open');
      aberto.scrollTo({ top:0, behavior: 'smooth'});
      if (aberto === elm) { return; }
    }
    elm.classList.toggle('open');
  }

  boxsectn.forEach( dvbox => {
    dvbox.onclick = (e) => { if(e.target.nodeName !== 'P'){ togOpenBox(e.currentTarget) }}
    dvbox.onkeypress = (e) => { if([32, 13].includes(e.keyCode) ){ e.preventDefault(); dvbox.click(); }}
  });
  let actv = 0;
  const scrolToActv = (smoth) => {
    const bbehavior = !smoth ? 'auto' : 'smooth';
    carsel.children[actv].scrollIntoView({ block:'nearest', behavior: bbehavior, inline:'center'});
  }
  const setActv = (i) => {
    if (actv === i || !(i >= 0 && i < carsel.children.length)) { return; }
    document.querySelector('.active').classList.remove('active');
    carsel.children[i].classList.add('active');
    actv = i; 
    scrolToActv();
    // setTimeout(() => scrolToActv(), 100);
  }
  carsel.querySelectorAll('.cont').forEach((cont, i) => { 
    cont.onfocus = (e) => setActv(i);
    cont.onpointerdown = (e) => setActv(i);
  })
  const gira = (e, i) => {
    e.stopPropagation(); const t = actv + i;
    if(t >= 0 && t < carsel.children.length){ carsel.children[t].focus(); }
  }
  document.querySelectorAll('.btnl, .btnr').forEach((btar, i) => {
    btar.onclick = (e) => { const v = (btar === btnl) ? -1 : 1; gira(e, v);  btar.focus(); }
    btar.onkeypress = (e) => { if([32, 13].includes(e.keyCode) ){ e.preventDefault(); btar.click(); } }
   });
  const tiraEspacoDuplo = (txt) => txt.replace(/( )+/g, ' ');
  const resto = 300 - txtarea.value.length;
  spncount.textContent = resto;
  const objValids = {
    nome: [/[^a-zãáéêíóõçú ]/gi, 'Preencha Nome e Sobrenome Sem Abreviações!!'],
    email: [/[^a-z0-9@_\-\.]/g, 'Preencha o E-mail Corretamente!!'],
    telefone: [/[^\(\)0-9 \-]/, "Preencha o Telefone com DDD !!  Exemplo: (11) 95555-2222 ou 11 95555-2222"],
    mensagem: [/[^a-zãáéêíóõçú0-9,@!_\-\.\? ]/gi, 'Não use Caracteres Especiais!!']
  }

  const validaMsg = (e) => {    
    const txt = txtarea.value;
    const charrs = txt.match(objValids.mensagem[0]);
    if (charrs) {
      txtarea.setCustomValidity(objValids.mensagem[1]);
      spnmsgerr.textContent = objValids.mensagem[1];
      setTimeout(() => {
        txtarea.setCustomValidity('');
        charrs.forEach(chr => txtarea.value = txtarea.value.replaceAll(chr, ''));
        spnmsgerr.textContent = '';
      }, 3000);
      return false;
    }
    return true;
  }
  let objInputs = { }
  frm.onsubmit = (e) => {
    e.preventDefault();
    if (Object.keys(objInputs).length) {
      frm.reset();
      spncount.textContent = 300;
      setTimeout(() => {
        frm.scrollIntoView({ block:'start', behavior: 'smooth'});
        frm.querySelector('.msgfrm').textContent = "Cadastro Validado!";
        frm.classList.toggle('msgshow');
        frm.setAttribute('disabled', 'true');
      }, 700);
    }
    console.log(' -- form inputs valid and submited!');
  }

  const checkSubmt = (e) => {
    e.stopPropagation();
    if(frm.getAttribute('disabled')) { e.preventDefault(); return; }
    let err = false;
    for (let i = 0; i < inpts.length; i++) {
      const inp = inpts[i];
      const cp = inp.getAttribute('placeholder').replace(':', '').replace('-', '').toLowerCase();
      err = (inp.required && (!inp.value || inp.validity.valueMissing)) || inp.validity.patternMismatch;
      const retErro = () => {
        inp.setCustomValidity(objValids[cp][1]); 
        inp.scrollIntoView({ block:'start', behavior: 'smooth'});
        inp.reportValidity();
        inp.setCustomValidity(''); objInputs = {}; return;
      }
      if (err) { return retErro(); }
      if (inp.value) {
        const val = tiraEspacoDuplo(inp.value).trim();
        if (val.match(objValids[cp][0])) { err = true; return retErro(); }
        objInputs[cp] = val;
      }
    }
    if(txtarea.value !== '') {
      if (!validaMsg()) { objInputs = {}; err = true; return; }
      objInputs.mensagem = tiraEspacoDuplo(txtarea.value).trim();
    }
  }
  txtarea.onpaste = (e) => e.preventDefault();
  txtarea.oninput = (e) => { if (validaMsg(e)) { spncount.textContent = 300 - txtarea.value.length; } }
  btnsubmt.onclick = checkSubmt;
  frm.oninput = (e) => {
    if(frm.getAttribute('disabled')) { e.preventDefault(); frm.reset(); spncount.textContent = 300; return false; }
  }
}
window.onload = winOnload();
