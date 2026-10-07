/* ===== Extracted script block 1 ===== */
class InnerHero extends HTMLElement{connectedCallback(){if(this.children.length)return;const t=document.getElementById('inner-hero-template').content.cloneNode(true);t.querySelector('[data-title]').textContent=this.getAttribute('title')||'';t.querySelector('[data-body]').textContent=this.getAttribute('body')||'';this.appendChild(t)}}
  class PageCta extends HTMLElement{connectedCallback(){if(this.children.length)return;const t=document.getElementById('page-cta-template').content.cloneNode(true);t.querySelector('[data-title]').textContent=this.getAttribute('title')||'';t.querySelector('[data-body]').textContent=this.getAttribute('body')||'Atendimento individual e confidencial.';this.appendChild(t)}}
  class LegalPage extends HTMLElement{connectedCallback(){if(this.children.length)return;const t=document.getElementById('legal-page-template').content.cloneNode(true);t.querySelector('[data-title]').textContent=this.getAttribute('title')||'';this.appendChild(t)}}
  customElements.define('inner-hero',InnerHero);customElements.define('page-cta',PageCta);customElements.define('legal-page',LegalPage);

  function siteApp(){return{
    route:'/pt',
    solutionLinks:[
      {name:'Planejamento Patrimonial Internacional',route:'/pt/planejamento-patrimonial-internacional',icon:'landmark',desc:'Patrimônio, residência fiscal e arquitetura internacional.'},
      {name:'Saída Fiscal do Brasil',route:'/pt/saida-fiscal-do-brasil',icon:'plane',desc:'Organização antes, durante e depois da mudança.'},
      {name:'Estrutura Offshore',route:'/pt/estrutura-offshore',icon:'building-2',desc:'Veículos internacionais escolhidos a partir da estratégia.'},
      {name:'Regularização de Criptoativos',route:'/pt/regularizacao-fiscal-criptoativos',icon:'file-check-2',desc:'Reconstrução e organização do histórico patrimonial.'},
      {name:'Planejamento para Criptoativos',route:'/pt/criptoativos',icon:'blocks',desc:'Integração entre patrimônio digital e estrutura global.'}
    ],
    featuredSolutions:[
      {name:'Planejamento Patrimonial e Tributário Internacional',route:'/pt/planejamento-patrimonial-internacional',body:'Proteção de bens, corte legal de impostos e sucessão familiar estruturada com ferramentas internacionais e digitais.'},
      {name:'Saída Fiscal do Brasil',route:'/pt/saida-fiscal-do-brasil',body:'Desvinculação oficial da Receita Federal com zero imposto em ganhos futuros e eliminação definitiva da bitributação.'},
      {name:'Regularização de Criptoativos',route:'/pt/regularizacao-fiscal-criptoativos',body:'Histórico fiscal alinhado e transição crypto-fiat com total conformidade bancária e a menor carga fiscal da lei.'}
    ],
    process:[
      {title:'Diagnóstico',body:'Situação atual, patrimônio, residência fiscal e objetivos.'},
      {title:'Estratégia',body:'Viabilidade, riscos e alternativas.'},
      {title:'Estruturação',body:'Jurisdições, veículos, instituições e tributação.'},
      {title:'Execução',body:'Coordenação da implementação e dos profissionais envolvidos.'},
      {title:'Operação',body:'Acompanhamento até a estrutura funcionar na prática.'}
    ],
    integrationItems:['Uma mudança de residência fiscal pode alterar a tributação.','A tributação pode mudar a estrutura ideal.','A estrutura pode mudar a forma de movimentar o patrimônio.','A movimentação pode depender de bancos, corretoras, exchanges ou ativos digitais.'],
    planningDeliverables:['Planejamento tributário internacional','Residência e saída fiscal','Empresas internacionais','Holdings · IBC · LLC','Foundations · Trusts','Contas bancárias internacionais','Fluxo financeiro','Regularização patrimonial','Criptoativos','Sucessão','Movimentação internacional','Diversificação geográfica'],
    exitPhases:[
      {title:'Antes da mudança',body:'Mapeamento patrimonial, análise tributária e reorganização das estruturas quando necessária.',tags:['Patrimônio','Tributação','Estratégia']},
      {title:'Durante a transição',body:'Procedimentos da mudança de residência, coordenação documental e adequação de contas, empresas e investimentos.',tags:['Documentação','Contas','Investimentos']},
      {title:'Depois da mudança',body:'Organização do fluxo internacional, acompanhamento das estruturas e saída fiscal definitiva.',tags:['Fluxo internacional','Acompanhamento','Operação']}
    ],
    cryptoTopics:['Wallets','Exchanges','DEXs','DeFi','Stablecoins','Staking','Custódia','Off-ramp','Residência fiscal','Tributação','Sucessão','Fluxo crypto-fiat'],
    regularizationFlow:[
      {title:'Mapear ambientes',body:'Exchanges, wallets, DEXs e protocolos.',icon:'network'},
      {title:'Reconstruir movimentações',body:'Compras, vendas, swaps e transferências.',icon:'waypoints'},
      {title:'Organizar documentos',body:'Registros e evidências disponíveis.',icon:'folder-check'},
      {title:'Avaliar obrigações',body:'Contexto fiscal aplicável ao cliente.',icon:'scale'},
      {title:'Definir estratégia',body:'Desenho de estratégia de elisão fiscal antes da próxima movimentação.',icon:'route'}
    ],
    regularizationSteps:['Identificar ativos','Analisar movimentações','Organizar documentos','Entender operações relevantes','Avaliar obrigações existentes','Definir estratégia adequada'],
    routeHref(route){return String(route||'').replace(/^\/+/, '') + '/'},
    parseRoute(){let p=location.pathname.replace(/\/index\.html$/,'').replace(/\/+$/,'');if(!p)p='/';if(p==='/pt/conteudos')p='/pt/contato';return p.startsWith('/pt')?p:'/pt'},
    init(){this.route=document.body?.dataset?.currentRoute || this.parseRoute();this.$nextTick(()=>this.afterRoute())},
    afterRoute(){window.lucide?.createIcons();initReveals();initScrollFX()}
  }}

  function offshoreExplorer(){return{selected:0,vehicles:[
    {name:'LLC',body:'Estrutura de responsabilidade limitada que separa os bens do titular com o da empresa, oferecendo vantagens fiscais e legais.',tags:['Operação','Patrimônio','Flexibilidade']},
    {name:'IBC',body:'Sociedade Anônima que garante proteção de ativos imobiliários, bancários ou de corretagem, bem como atividade no exterior.',tags:['Internacional','Empresarial','Patrimônio']},
    {name:'Holding Internacional',body:'Estrutura destinada à organização de participações, investimentos e patrimônio dentro de uma arquitetura internacional.',tags:['Participações','Investimentos','Organização']},
    {name:'Trust',body:'Instrumento internacional para planejamento tributário, com proteção de bens e otimização de sucessão.',tags:['Sucessão','Administração','Patrimônio']},
    {name:'Foundation',body:'Benefícios dos Trusts mas com forma de empresa estrangeira, são anônimos e protegem legalmente o patrimônio da fundação contra atos do fundador.',tags:['Organização','Sucessão','Jurisdição']},
    {name:'Contas & Infraestrutura',body:'Contas bancárias, instituições financeiras e demais recursos necessários para que a estrutura funcione garantindo liquidez e baixos custos.',tags:['Bancos','Fluxo','Execução']}
  ]}}

  function getMetaCookie(name) {
    try {
      const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
      if (match && match[1]) return decodeURIComponent(match[1]);
      if (name === '_fbc') {
        const urlParams = new URLSearchParams(window.location.search);
        const fbclid = urlParams.get('fbclid');
        if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
      }
    } catch (_) {}
    return '';
  }

  function contactForm(){return{
    subjectOpen:false,
    subjectError:false,
    redirecting:false,
    subjects:[
      'Planejamento patrimonial internacional',
      'Saída fiscal do Brasil',
      'Estrutura offshore',
      'Regularização de criptoativos',
      'Patrimônio em criptoativos',
      'Parcerias e contato institucional',
      'Outro'
    ],
    form:{name:'',email:'',whatsapp:'',country:'',subject:'',message:''},
    async submit(){
      if(!this.form.subject){
        this.subjectError=true;
        this.subjectOpen=true;
        this.$nextTick(()=>document.querySelector('.contact-select-trigger')?.focus());
        return;
      }
      this.redirecting=true;
      
      const formData=new FormData();
      formData.append('formType','Contato');
      for(const key in this.form)formData.append(key,this.form[key]);

      const fbp=getMetaCookie('_fbp');
      const fbc=getMetaCookie('_fbc');
      if(fbp)formData.append('fbp',fbp);
      if(fbc)formData.append('fbc',fbc);
      formData.append('client_user_agent',navigator.userAgent||'');
      formData.append('event_source_url',window.location.href);

      try{
        const url='https://script.google.com/macros/s/AKfycbyeoX_kKGYEhr_1rc7t5yZDTtBgu6phBakDdHIEa4W5n0LU5PtbFJPOnL66My7PnSxR/exec';
        if(!url.includes('COLOQUE_SUA_URL')) await fetch(url,{method:'POST',body:formData,mode:'no-cors'});
      }catch(e){console.error(e);}

      const clean=value=>(value||'').toString().trim();
      const message=[
        'Olá! Vim pelo site da Liberaction e gostaria de falar com a equipe.',
        '',
        `Nome: ${clean(this.form.name)}`,
        `E-mail: ${clean(this.form.email)}`,
        `WhatsApp: ${clean(this.form.whatsapp) || 'Não informado'}`,
        `País de residência: ${clean(this.form.country) || 'Não informado'}`,
        `Assunto: ${clean(this.form.subject)}`,
        '',
        'Mensagem:',
        clean(this.form.message)
      ].join('\n');
      const waUrl='https://wa.me/5511953448220?text='+encodeURIComponent(message);
      setTimeout(()=>{ window.location.href=waUrl; },180);
    }
  }}

  // Chave pública (site key) do Google reCAPTCHA v3. Gere em https://www.google.com/recaptcha/admin
  const RECAPTCHA_SITE_KEY='COLOQUE_SUA_SITE_KEY';
  const FORM_ENDPOINT='https://script.google.com/macros/s/AKfycbyeoX_kKGYEhr_1rc7t5yZDTtBgu6phBakDdHIEa4W5n0LU5PtbFJPOnL66My7PnSxR/exec';
  let recaptchaPromise=null;
  function loadRecaptcha(){
    if(RECAPTCHA_SITE_KEY.includes('COLOQUE'))return Promise.resolve(false);
    if(!recaptchaPromise)recaptchaPromise=new Promise(resolve=>{
      const s=document.createElement('script');
      s.src='https://www.google.com/recaptcha/api.js?render='+RECAPTCHA_SITE_KEY;
      s.async=true;s.onload=()=>window.grecaptcha.ready(()=>resolve(true));s.onerror=()=>resolve(false);
      document.head.appendChild(s);
    });
    return recaptchaPromise;
  }

  const COUNTRIES_DATA = [
    { name: 'Brasil', code: 'BR', dial: '+55', flag: '🇧🇷', priority: 1, aliases: ['brasil', 'brazil', 'br', '11', '21', '31', '41', '48', '51', '61', '71', '81', '85', 'sp', 'rj', 'mg', 'sc', 'pr', 'rs'] },
    { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹', priority: 2, aliases: ['portugal', 'pt', 'lisboa', 'porto'] },
    { name: 'Estados Unidos', code: 'US', dial: '+1', flag: '🇺🇸', priority: 3, aliases: ['estados unidos', 'eua', 'usa', 'us', 'miami', 'florida', 'delaware', 'wyoming'] },
    { name: 'Espanha', code: 'ES', dial: '+34', flag: '🇪🇸', priority: 4, aliases: ['espanha', 'spain', 'es', 'madrid', 'barcelona'] },
    { name: 'Emirados Árabes Unidos', code: 'AE', dial: '+971', flag: '🇦🇪', priority: 5, aliases: ['emirados arabes unidos', 'emirados', 'dubai', 'abu dhabi', 'uae', 'ae'] },
    { name: 'Paraguai', code: 'PY', dial: '+595', flag: '🇵🇾', priority: 6, aliases: ['paraguai', 'paraguay', 'py', 'assuncao'] },
    { name: 'Uruguai', code: 'UY', dial: '+598', flag: '🇺🇾', priority: 7, aliases: ['uruguai', 'uruguay', 'uy', 'montevideu', 'punta del este'] },
    { name: 'Suíça', code: 'CH', dial: '+41', flag: '🇨🇭', priority: 8, aliases: ['suica', 'switzerland', 'ch', 'zurique', 'genebra', 'lugano'] },
    { name: 'Reino Unido', code: 'GB', dial: '+44', flag: '🇬🇧', priority: 9, aliases: ['reino unido', 'uk', 'inglaterra', 'londres', 'gb'] },
    { name: 'Itália', code: 'IT', dial: '+39', flag: '🇮🇹', priority: 10, aliases: ['italia', 'italy', 'it', 'roma', 'milao'] },
    { name: 'Panamá', code: 'PA', dial: '+507', flag: '🇵🇦', priority: 11, aliases: ['panama', 'pa'] },
    { name: 'Ilhas Cayman', code: 'KY', dial: '+1 345', flag: '🇰🇾', priority: 12, aliases: ['ilhas cayman', 'cayman', 'ky'] },
    { name: 'Bahamas', code: 'BS', dial: '+1 242', flag: '🇧🇸', priority: 13, aliases: ['bahamas', 'bs'] },
    { name: 'Ilhas Virgens Britânicas', code: 'VG', dial: '+1 284', flag: '🇻🇬', priority: 14, aliases: ['ilhas virgens britanicas', 'bvi', 'vg'] },
    { name: 'Singapura', code: 'SG', dial: '+65', flag: '🇸🇬', priority: 15, aliases: ['singapura', 'singapore', 'sg'] },
    { name: 'Hong Kong', code: 'HK', dial: '+852', flag: '🇭🇰', priority: 16, aliases: ['hong kong', 'hk'] },
    { name: 'Alemanha', code: 'DE', dial: '+49', flag: '🇩🇪', priority: 17, aliases: ['alemanha', 'germany', 'de', 'berlim', 'frankfurt'] },
    { name: 'França', code: 'FR', dial: '+33', flag: '🇫🇷', priority: 18, aliases: ['franca', 'france', 'fr', 'paris'] },
    { name: 'Canadá', code: 'CA', dial: '+1', flag: '🇨🇦', priority: 19, aliases: ['canada', 'ca'] },
    { name: 'Irlanda', code: 'IE', dial: '+353', flag: '🇮🇪', priority: 20, aliases: ['irlanda', 'ireland', 'ie', 'dublin'] },
    { name: 'Luxemburgo', code: 'LU', dial: '+352', flag: '🇱🇺', priority: 21, aliases: ['luxemburgo', 'luxembourg', 'lu'] },
    { name: 'Malta', code: 'MT', dial: '+356', flag: '🇲🇹', priority: 22, aliases: ['malta', 'mt'] },
    { name: 'Chipre', code: 'CY', dial: '+357', flag: '🇨🇾', priority: 23, aliases: ['chipre', 'cyprus', 'cy'] },
    { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷', priority: 24, aliases: ['argentina', 'ar', 'buenos aires'] },
    { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱', priority: 25, aliases: ['chile', 'cl', 'santiago'] },
    { name: 'Colômbia', code: 'CO', dial: '+57', flag: '🇨🇴', priority: 26, aliases: ['colombia', 'co', 'bogota', 'medellin'] },
    { name: 'México', code: 'MX', dial: '+52', flag: '🇲🇽', priority: 27, aliases: ['mexico', 'mx'] },
    { name: 'Austrália', code: 'AU', dial: '+61', flag: '🇦🇺', priority: 28, aliases: ['australia', 'au', 'sydney'] },
    { name: 'Holanda', code: 'NL', dial: '+31', flag: '🇳🇱', priority: 29, aliases: ['holanda', 'paises baixos', 'netherlands', 'nl', 'amsterdam'] },
    { name: 'Bélgica', code: 'BE', dial: '+32', flag: '🇧🇪', priority: 30, aliases: ['belgica', 'belgium', 'be', 'bruxelas'] },
    { name: 'África do Sul', code: 'ZA', dial: '+27', flag: '🇿🇦', aliases: ['africa do sul', 'south africa', 'za'] },
    { name: 'Albânia', code: 'AL', dial: '+355', flag: '🇦🇱', aliases: ['albania', 'al'] },
    { name: 'Andorra', code: 'AD', dial: '+376', flag: '🇦🇩', aliases: ['andorra', 'ad'] },
    { name: 'Angola', code: 'AO', dial: '+244', flag: '🇦🇴', aliases: ['angola', 'ao', 'luanda'] },
    { name: 'Antígua e Barbuda', code: 'AG', dial: '+1 268', flag: '🇦🇬', aliases: ['antigua e barbuda', 'ag'] },
    { name: 'Arábia Saudita', code: 'SA', dial: '+966', flag: '🇸🇦', aliases: ['arabia saudita', 'saudi arabia', 'sa', 'riad'] },
    { name: 'Argélia', code: 'DZ', dial: '+213', flag: '🇩🇿', aliases: ['argelia', 'algeria', 'dz'] },
    { name: 'Armênia', code: 'AM', dial: '+374', flag: '🇦🇲', aliases: ['armenia', 'am'] },
    { name: 'Áustria', code: 'AT', dial: '+43', flag: '🇦🇹', aliases: ['austria', 'at', 'viena'] },
    { name: 'Azerbaijão', code: 'AZ', dial: '+994', flag: '🇦🇿', aliases: ['azerbaijao', 'azerbaijan', 'az'] },
    { name: 'Bahrein', code: 'BH', dial: '+973', flag: '🇧🇭', aliases: ['bahrein', 'bahrain', 'bh'] },
    { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩', aliases: ['bangladesh', 'bd'] },
    { name: 'Barbados', code: 'BB', dial: '+1 246', flag: '🇧🇧', aliases: ['barbados', 'bb'] },
    { name: 'Belarus', code: 'BY', dial: '+375', flag: '🇧🇾', aliases: ['belarus', 'bielorrussia', 'by'] },
    { name: 'Belize', code: 'BZ', dial: '+501', flag: '🇧🇿', aliases: ['belize', 'bz'] },
    { name: 'Bermudas', code: 'BM', dial: '+1 441', flag: '🇧🇲', aliases: ['bermudas', 'bermuda', 'bm'] },
    { name: 'Bolívia', code: 'BO', dial: '+591', flag: '🇧🇴', aliases: ['bolivia', 'bo', 'la paz', 'santa cruz'] },
    { name: 'Bósnia e Herzegovina', code: 'BA', dial: '+387', flag: '🇧🇦', aliases: ['bosnia', 'ba'] },
    { name: 'Botsuana', code: 'BW', dial: '+267', flag: '🇧🇼', aliases: ['botsuana', 'bw'] },
    { name: 'Bulgária', code: 'BG', dial: '+359', flag: '🇧🇬', aliases: ['bulgaria', 'bg'] },
    { name: 'Cabo Verde', code: 'CV', dial: '+238', flag: '🇨🇻', aliases: ['cabo verde', 'cv', 'praia'] },
    { name: 'Camboja', code: 'KH', dial: '+855', flag: '🇰🇭', aliases: ['camboja', 'cambodia', 'kh'] },
    { name: 'Catar', code: 'QA', dial: '+974', flag: '🇶🇦', aliases: ['catar', 'qatar', 'qa', 'doha'] },
    { name: 'Cazaquistão', code: 'KZ', dial: '+7', flag: '🇰🇿', aliases: ['cazaquistao', 'kazakhstan', 'kz'] },
    { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳', aliases: ['china', 'cn', 'pequim', 'shanghai'] },
    { name: 'Coreia do Sul', code: 'KR', dial: '+82', flag: '🇰🇷', aliases: ['coreia do sul', 'south korea', 'kr', 'seul'] },
    { name: 'Costa do Marfim', code: 'CI', dial: '+225', flag: '🇨🇮', aliases: ['costa do marfim', 'ci'] },
    { name: 'Costa Rica', code: 'CR', dial: '+506', flag: '🇨🇷', aliases: ['costa rica', 'cr'] },
    { name: 'Croácia', code: 'HR', dial: '+385', flag: '🇭🇷', aliases: ['croacia', 'croatia', 'hr'] },
    { name: 'Curaçao', code: 'CW', dial: '+599', flag: '🇨🇼', aliases: ['curacao', 'cw'] },
    { name: 'Dinamarca', code: 'DK', dial: '+45', flag: '🇩🇰', aliases: ['dinamarca', 'denmark', 'dk', 'copenhague'] },
    { name: 'Egito', code: 'EG', dial: '+20', flag: '🇪🇬', aliases: ['egito', 'egypt', 'eg', 'cairo'] },
    { name: 'El Salvador', code: 'SV', dial: '+503', flag: '🇸🇻', aliases: ['el salvador', 'sv'] },
    { name: 'Equador', code: 'EC', dial: '+593', flag: '🇪🇨', aliases: ['equador', 'ecuador', 'ec', 'quito'] },
    { name: 'Eslováquia', code: 'SK', dial: '+421', flag: '🇸🇰', aliases: ['eslovaquia', 'slovakia', 'sk'] },
    { name: 'Eslovênia', code: 'SI', dial: '+386', flag: '🇸🇮', aliases: ['eslovenia', 'slovenia', 'si'] },
    { name: 'Estônia', code: 'EE', dial: '+372', flag: '🇪🇪', aliases: ['estonia', 'ee', 'tallinn'] },
    { name: 'Filipinas', code: 'PH', dial: '+63', flag: '🇵🇭', aliases: ['filipinas', 'philippines', 'ph'] },
    { name: 'Finlândia', code: 'FI', dial: '+358', flag: '🇫🇮', aliases: ['finlandia', 'finland', 'fi', 'helsinque'] },
    { name: 'Gana', code: 'GH', dial: '+233', flag: '🇬🇭', aliases: ['gana', 'gh'] },
    { name: 'Geórgia', code: 'GE', dial: '+995', flag: '🇬🇪', aliases: ['georgia', 'ge', 'tbilisi'] },
    { name: 'Gibraltar', code: 'GI', dial: '+350', flag: '🇬🇮', aliases: ['gibraltar', 'gi'] },
    { name: 'Grécia', code: 'GR', dial: '+30', flag: '🇬🇷', aliases: ['grecia', 'greece', 'gr', 'atenas'] },
    { name: 'Guatemala', code: 'GT', dial: '+502', flag: '🇬🇹', aliases: ['guatemala', 'gt'] },
    { name: 'Guiana', code: 'GY', dial: '+592', flag: '🇬🇾', aliases: ['guiana', 'gy'] },
    { name: 'Honduras', code: 'HN', dial: '+504', flag: '🇭🇳', aliases: ['honduras', 'hn'] },
    { name: 'Hungria', code: 'HU', dial: '+36', flag: '🇭🇺', aliases: ['hungria', 'hungary', 'hu', 'budapeste'] },
    { name: 'Iêmen', code: 'YE', dial: '+967', flag: '🇾🇪', aliases: ['iemen', 'ye'] },
    { name: 'Índia', code: 'IN', dial: '+91', flag: '🇮🇳', aliases: ['india', 'in', 'nova delhi', 'mumbai'] },
    { name: 'Indonésia', code: 'ID', dial: '+62', flag: '🇮🇩', aliases: ['indonesia', 'id', 'bali', 'jacarta'] },
    { name: 'Islândia', code: 'IS', dial: '+354', flag: '🇮🇸', aliases: ['islandia', 'iceland', 'is'] },
    { name: 'Israel', code: 'IL', dial: '+972', flag: '🇮🇱', aliases: ['israel', 'il', 'tel aviv'] },
    { name: 'Jamaica', code: 'JM', dial: '+1 876', flag: '🇯🇲', aliases: ['jamaica', 'jm'] },
    { name: 'Japão', code: 'JP', dial: '+81', flag: '🇯🇵', aliases: ['japao', 'japan', 'jp', 'toquio'] },
    { name: 'Jordânia', code: 'JO', dial: '+962', flag: '🇯🇴', aliases: ['jordania', 'jo'] },
    { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼', aliases: ['kuwait', 'kw'] },
    { name: 'Letônia', code: 'LV', dial: '+371', flag: '🇱🇻', aliases: ['letonia', 'latvia', 'lv', 'riga'] },
    { name: 'Líbano', code: 'LB', dial: '+961', flag: '🇱🇧', aliases: ['libano', 'lb', 'beirute'] },
    { name: 'Liechtenstein', code: 'LI', dial: '+423', flag: '🇱🇮', aliases: ['liechtenstein', 'li'] },
    { name: 'Lituânia', code: 'LT', dial: '+370', flag: '🇱🇹', aliases: ['lituania', 'lithuania', 'lt', 'vilnius'] },
    { name: 'Macedônia do Norte', code: 'MK', dial: '+389', flag: '🇲🇰', aliases: ['macedonia', 'mk'] },
    { name: 'Malásia', code: 'MY', dial: '+60', flag: '🇲🇾', aliases: ['malasia', 'my', 'kuala lumpur'] },
    { name: 'Maldivas', code: 'MV', dial: '+960', flag: '🇲🇻', aliases: ['maldivas', 'mv'] },
    { name: 'Marrocos', code: 'MA', dial: '+212', flag: '🇲🇦', aliases: ['marrocos', 'ma'] },
    { name: 'Maurício', code: 'MU', dial: '+230', flag: '🇲🇺', aliases: ['mauricio', 'mauritius', 'mu'] },
    { name: 'Mônaco', code: 'MC', dial: '+377', flag: '🇲🇨', aliases: ['monaco', 'mc', 'monte carlo'] },
    { name: 'Montenegro', code: 'ME', dial: '+382', flag: '🇲🇪', aliases: ['montenegro', 'me'] },
    { name: 'Moçambique', code: 'MZ', dial: '+258', flag: '🇲🇿', aliases: ['mocambique', 'mz', 'maputo'] },
    { name: 'Namíbia', code: 'NA', dial: '+264', flag: '🇳🇦', aliases: ['namibia', 'na'] },
    { name: 'Nicarágua', code: 'NI', dial: '+505', flag: '🇳🇮', aliases: ['nicaragua', 'ni'] },
    { name: 'Nigéria', code: 'NG', dial: '+234', flag: '🇳🇬', aliases: ['nigeria', 'ng'] },
    { name: 'Noruega', code: 'NO', dial: '+47', flag: '🇳🇴', aliases: ['noruega', 'norway', 'no', 'oslo'] },
    { name: 'Nova Zelândia', code: 'NZ', dial: '+64', flag: '🇳🇿', aliases: ['nova zelandia', 'new zealand', 'nz', 'auckland'] },
    { name: 'Omã', code: 'OM', dial: '+968', flag: '🇴🇲', aliases: ['oma', 'oman', 'om'] },
    { name: 'Paquistão', code: 'PK', dial: '+92', flag: '🇵🇰', aliases: ['paquistao', 'pakistan', 'pk'] },
    { name: 'Peru', code: 'PE', dial: '+51', flag: '🇵🇪', aliases: ['peru', 'pe', 'lima'] },
    { name: 'Polinésia Francesa', code: 'PF', dial: '+689', flag: '🇵🇫', aliases: ['polinesia francesa', 'tahiti', 'pf'] },
    { name: 'Polônia', code: 'PL', dial: '+48', flag: '🇵🇱', aliases: ['polonia', 'poland', 'pl', 'varsovia'] },
    { name: 'Porto Rico', code: 'PR', dial: '+1', flag: '🇵🇷', aliases: ['porto rico', 'puerto rico', 'pr', 'san juan'] },
    { name: 'Quênia', code: 'KE', dial: '+254', flag: '🇰🇪', aliases: ['quenia', 'ke'] },
    { name: 'República Dominicana', code: 'DO', dial: '+1', flag: '🇩🇴', aliases: ['republica dominicana', 'do', 'punta cana'] },
    { name: 'República Tcheca', code: 'CZ', dial: '+420', flag: '🇨🇿', aliases: ['republica tcheca', 'czech republic', 'cz', 'praga'] },
    { name: 'Romênia', code: 'RO', dial: '+40', flag: '🇷🇴', aliases: ['romenia', 'romania', 'ro'] },
    { name: 'Rússia', code: 'RU', dial: '+7', flag: '🇷🇺', aliases: ['russia', 'ru', 'moscou'] },
    { name: 'Santa Lúcia', code: 'LC', dial: '+1 758', flag: '🇱🇨', aliases: ['santa lucia', 'lc'] },
    { name: 'São Cristóvão e Névis', code: 'KN', dial: '+1 869', flag: '🇰🇳', aliases: ['sao cristovao e nevis', 'st kitts', 'kn'] },
    { name: 'São Marino', code: 'SM', dial: '+378', flag: '🇸🇲', aliases: ['sao marino', 'sm'] },
    { name: 'São Tomé e Príncipe', code: 'ST', dial: '+239', flag: '🇸🇹', aliases: ['sao tome e principe', 'st'] },
    { name: 'São Vicente e Granadinas', code: 'VC', dial: '+1 784', flag: '🇻🇨', aliases: ['sao vicente e granadinas', 'vc'] },
    { name: 'Senegal', code: 'SN', dial: '+221', flag: '🇸🇳', aliases: ['senegal', 'sn'] },
    { name: 'Sérvia', code: 'RS', dial: '+381', flag: '🇷🇸', aliases: ['servia', 'serbia', 'rs', 'belgrado'] },
    { name: 'Seychelles', code: 'SC', dial: '+248', flag: '🇸🇨', aliases: ['seychelles', 'sc'] },
    { name: 'Suécia', code: 'SE', dial: '+46', flag: '🇸🇪', aliases: ['suecia', 'sweden', 'se', 'estocolmo'] },
    { name: 'Suriname', code: 'SR', dial: '+597', flag: '🇸🇷', aliases: ['suriname', 'sr'] },
    { name: 'Tailândia', code: 'TH', dial: '+66', flag: '🇹🇭', aliases: ['tailandia', 'thailand', 'th', 'bangkok'] },
    { name: 'Taiwan', code: 'TW', dial: '+886', flag: '🇹🇼', aliases: ['taiwan', 'tw', 'taipei'] },
    { name: 'Tanzânia', code: 'TZ', dial: '+255', flag: '🇹🇿', aliases: ['tanzania', 'tz', 'zanzibar'] },
    { name: 'Timor-Leste', code: 'TL', dial: '+670', flag: '🇹🇱', aliases: ['timor leste', 'tl'] },
    { name: 'Trinidad e Tobago', code: 'TT', dial: '+1 868', flag: '🇹🇹', aliases: ['trinidad e tobago', 'tt'] },
    { name: 'Tunísia', code: 'TN', dial: '+216', flag: '🇹🇳', aliases: ['tunisia', 'tn'] },
    { name: 'Turquia', code: 'TR', dial: '+90', flag: '🇹🇷', aliases: ['turquia', 'turkey', 'tr', 'istambul'] },
    { name: 'Ucrânia', code: 'UA', dial: '+380', flag: '🇺🇦', aliases: ['ucrania', 'ukraine', 'ua', 'kiev'] },
    { name: 'Vanuatu', code: 'VU', dial: '+678', flag: '🇻🇺', aliases: ['vanuatu', 'vu'] },
    { name: 'Venezuela', code: 'VE', dial: '+58', flag: '🇻🇪', aliases: ['venezuela', 've', 'caracas'] },
    { name: 'Vietnã', code: 'VN', dial: '+84', flag: '🇻🇳', aliases: ['vietna', 'vietnam', 'vn'] }
  ];

  function normStr(str) {
    return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function diagnosticForm(){return{
    step:1,
    total:7,
    dir:1,
    sending:false,
    sent:false,
    isQualified:false,
    error:'',
    startedAt:Date.now(),
    website:'',
    needs:[
      'Saída fiscal do Brasil',
      'Planejamento tributário internacional',
      'Estrutura offshore',
      'Regularização de criptoativos',
      'Movimentação de patrimônio em criptoativos',
      'Planejamento sucessório',
      'Internacionalização patrimonial',
      'Outro'
    ],
    assetsOptions:[
      'Até R$ 1 milhão',
      'R$ 1 milhão a R$ 3 milhões',
      'R$ 3 milhões a R$ 10 milhões',
      'R$ 10 milhões a R$ 50 milhões',
      'Acima de R$ 50 milhões',
      'Prefiro informar durante o atendimento'
    ],
    form:{need:'',name:'',whatsapp:'',email:'',country:'',assets:'',message:''},

    phoneCountry: COUNTRIES_DATA[0],
    phoneDropdownOpen: false,
    phoneSearch: '',
    rawPhone: '',

    countryDropdownOpen: false,
    countryQuery: '',
    selectedCountryFlag: '',
    countryHighlightIndex: -1,

    init(){
      this.$el.addEventListener('focusin',()=>loadRecaptcha(),{once:true});
      this.focusStep();
    },
    checkQualified(assets){
      const a = (assets || '').toString().toLowerCase().trim();
      if(!a) return false;
      if(a.includes('até r$ 1') || a.includes('ate r$ 1') || a.includes('até 1') || a.includes('ate 1')) {
        return false;
      }
      return true;
    },
    get progress(){return this.sent?100:Math.round((this.step-1)/this.total*100);},
    letter(i){return String.fromCharCode(65+i);},
    focusStep(){
      this.$nextTick(()=>setTimeout(()=>{
        const el = document.querySelector('[data-tl-step="'+this.step+'"] .tl-input');
        if(el) el.focus({preventScroll:true});
      },260));
    },
    pick(field,value){this.form[field]=value;this.error='';},
    hotkey(e){
      if(this.sent||e.metaKey||e.ctrlKey||e.altKey||e.target.matches('input,textarea'))return;
      if(e.key==='Enter'&&this.step<this.total){e.preventDefault();this.next();return;}
      const list=this.step===1?this.needs:this.step===6?this.assetsOptions:null;
      if(!list)return;
      const i=e.key.toUpperCase().charCodeAt(0)-65;
      if(e.key.length===1&&i>=0&&i<list.length){e.preventDefault();this.pick(this.step===1?'need':'assets',list[i]);}
    },
    get waUrl(){
      const clean=v=>(v||'').toString().trim();
      const name = clean(this.form.name);
      const need = clean(this.form.need) || 'Internacionalização patrimonial';
      const greeting = name ? `Olá, Dra. Victória! Meu nome é ${name}.` : 'Olá, Dra. Victória!';
      const msg = `${greeting} Enviei minha solicitação no site sobre "${need}" e gostaria de dar início ao atendimento prioritário e confidencial.`;
      return 'https://wa.me/5511953448220?text='+encodeURIComponent(msg);
    },

    get phonePlaceholder(){
      if(this.phoneCountry.code==='BR')return '(11) 90000-0000';
      if(this.phoneCountry.code==='US'||this.phoneCountry.code==='CA')return '(555) 000-0000';
      if(this.phoneCountry.code==='PT')return '912 345 678';
      return '00000-0000';
    },
    togglePhoneDropdown(){
      this.phoneDropdownOpen = !this.phoneDropdownOpen;
      if(this.phoneDropdownOpen){
        this.phoneSearch = '';
        this.$nextTick(()=>{
          document.querySelector('.tl-phone-search-input')?.focus();
        });
      }
    },
    filteredPhoneCountries(){
      const q = normStr(this.phoneSearch);
      if(!q) return COUNTRIES_DATA;
      return COUNTRIES_DATA.filter(c => {
        if(normStr(c.name).includes(q)) return true;
        if(c.dial.replace(/\D/g,'').includes(q.replace(/\D/g,'')) && q.replace(/\D/g,'').length>0) return true;
        if(normStr(c.code).includes(q)) return true;
        if(c.aliases && c.aliases.some(a => normStr(a).includes(q) || q.includes(normStr(a)))) return true;
        return false;
      });
    },
    choosePhoneCountry(c){
      this.phoneCountry = c;
      this.phoneDropdownOpen = false;
      this.phoneSearch = '';
      this.formatAndSyncPhone(this.rawPhone);
      this.$nextTick(()=>{
        document.querySelector('.tl-phone-input')?.focus();
      });
    },
    selectFirstPhoneCountry(){
      const list = this.filteredPhoneCountries();
      if(list.length) this.choosePhoneCountry(list[0]);
    },
    onPhoneInput(e){
      let val = e.target.value;
      const trimmed = val.trim();
      if(trimmed.startsWith('+')){
        const sorted = [...COUNTRIES_DATA].sort((a,b)=>b.dial.replace(/\s+/g,'').length - a.dial.replace(/\s+/g,'').length);
        for(const c of sorted){
          const dialClean = c.dial.replace(/\s+/g,'');
          const valClean = trimmed.replace(/\s+/g,'');
          if(valClean.startsWith(dialClean)){
            this.phoneCountry = c;
            val = valClean.slice(dialClean.length);
            break;
          }
        }
      }
      this.formatAndSyncPhone(val);
    },
    formatAndSyncPhone(val){
      if(this.phoneCountry.code==='BR'){
        const digits = (val||'').replace(/\D/g,'').slice(0,11);
        if(!digits) this.rawPhone = '';
        else if(digits.length<=2) this.rawPhone = '(' + digits;
        else if(digits.length<=6) this.rawPhone = '(' + digits.slice(0,2) + ') ' + digits.slice(2);
        else if(digits.length<=10) this.rawPhone = '(' + digits.slice(0,2) + ') ' + digits.slice(2,6) + '-' + digits.slice(6);
        else this.rawPhone = '(' + digits.slice(0,2) + ') ' + digits.slice(2,7) + '-' + digits.slice(7);
      } else {
        this.rawPhone = val;
      }
      const clean = (this.rawPhone||'').trim();
      this.form.whatsapp = clean ? `${this.phoneCountry.dial} ${clean}` : '';
      if(this.error) this.error = '';
    },

    filteredCountries(){
      const q = normStr(this.countryQuery);
      if(!q) return COUNTRIES_DATA;
      return COUNTRIES_DATA.filter(c => {
        if(normStr(c.name).includes(q)) return true;
        if(normStr(c.code) === q) return true;
        if(c.aliases && c.aliases.some(a => normStr(a).includes(q))) return true;
        return false;
      });
    },
    openCountryDropdown(){
      this.countryDropdownOpen = true;
      this.countryHighlightIndex = 0;
    },
    toggleCountryDropdown(){
      this.countryDropdownOpen = !this.countryDropdownOpen;
      if(this.countryDropdownOpen){
        this.countryHighlightIndex = 0;
        this.$nextTick(()=>{
          document.querySelector('.tl-country-input')?.focus();
        });
      }
    },
    onCountryInput(){
      this.form.country = this.countryQuery;
      this.countryDropdownOpen = true;
      this.countryHighlightIndex = 0;
      const q = normStr(this.countryQuery);
      const match = COUNTRIES_DATA.find(c => normStr(c.name) === q);
      this.selectedCountryFlag = match ? match.flag : '';
      if(this.error) this.error = '';
    },
    chooseCountry(c){
      this.countryQuery = c.name;
      this.form.country = c.name;
      this.selectedCountryFlag = c.flag;
      this.countryDropdownOpen = false;
      this.countryHighlightIndex = -1;
      this.error = '';
      this.$nextTick(()=>{
        document.querySelector('.tl-country-input')?.focus();
      });
    },
    clearCountry(){
      this.countryQuery = '';
      this.form.country = '';
      this.selectedCountryFlag = '';
      this.countryDropdownOpen = true;
      this.countryHighlightIndex = 0;
      this.$nextTick(()=>{
        document.querySelector('.tl-country-input')?.focus();
      });
    },
    moveCountryHighlight(delta){
      if(!this.countryDropdownOpen){
        this.countryDropdownOpen = true;
        this.countryHighlightIndex = 0;
        return;
      }
      const list = this.filteredCountries();
      if(!list.length) return;
      this.countryHighlightIndex = Math.max(0, Math.min(list.length - 1, (this.countryHighlightIndex < 0 ? 0 : this.countryHighlightIndex) + delta));
      this.$nextTick(()=>{
        const el = document.querySelector('.tl-country-menu .tl-dropdown-item.is-highlighted');
        el?.scrollIntoView({block:'nearest'});
      });
    },
    selectHighlightedCountry(){
      if(this.countryDropdownOpen){
        const list = this.filteredCountries();
        if(list.length > 0){
          const idx = this.countryHighlightIndex >= 0 ? this.countryHighlightIndex : 0;
          this.chooseCountry(list[idx]);
          return;
        }
        this.countryDropdownOpen = false;
      } else {
        this.next();
      }
    },

    validateStep(){
      this.error='';
      const f=this.form;
      if(this.step===1&&!f.need){this.error='Escolha uma opção para continuar.';return false;}
      if(this.step===2&&f.name.trim().length<3){this.error='Informe seu nome completo.';return false;}
      if(this.step===3){
        const digits = (this.rawPhone||'').replace(/\D/g,'');
        if(this.phoneCountry.code==='BR'){
          if(digits.length<10){this.error='Informe seu WhatsApp com DDD (ex.: 11 98765-4321).';return false;}
        } else {
          if(digits.length<7){this.error='Informe um número de WhatsApp válido.';return false;}
        }
      }
      if(this.step===4&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())){this.error='Informe um e-mail válido.';return false;}
      if(this.step===6&&!f.assets){this.error='Escolha uma opção para continuar.';return false;}
      return true;
    },
    next(){
      this.phoneDropdownOpen = false;
      this.countryDropdownOpen = false;
      if(this.validateStep()&&this.step<this.total){
        this.dir=1;
        this.step++;
        window.scrollTo({top:0,behavior:'smooth'});
        this.focusStep();
      }
    },
    back(){
      this.phoneDropdownOpen = false;
      this.countryDropdownOpen = false;
      this.error='';
      if(this.step>1){
        this.dir=-1;
        this.step--;
        window.scrollTo({top:0,behavior:'smooth'});
        this.focusStep();
      }
    },
    async submit(){
      this.phoneDropdownOpen = false;
      this.countryDropdownOpen = false;
      if(this.step<this.total){this.next();return;}
      if(this.sending)return;
      if(!this.validateStep())return;
      if(this.website||Date.now()-this.startedAt<4000){
        this.isQualified = this.checkQualified(this.form.assets);
        this.sent = true;
        this.$nextTick(()=>{ window.lucide?.createIcons(); });
        return;
      }
      this.sending=true;this.error='';
      try{
        const formData=new FormData();
        formData.append('formType','Diagnóstico');
        for(const key in this.form)formData.append(key,this.form[key]);

        const fbp=getMetaCookie('_fbp');
        const fbc=getMetaCookie('_fbc');
        if(fbp)formData.append('fbp',fbp);
        if(fbc)formData.append('fbc',fbc);
        formData.append('client_user_agent',navigator.userAgent||'');
        formData.append('event_source_url',window.location.href);

        if(await loadRecaptcha()){
          const token=await window.grecaptcha.execute(RECAPTCHA_SITE_KEY,{action:'diagnostico'});
          formData.append('recaptchaToken',token);
        }
        const res=await fetch(FORM_ENDPOINT,{method:'POST',body:formData});
        const data=await res.json();
        if(!data||data.ok!==true)throw new Error((data&&data.error)||'Falha no envio');

        // Backend valida a qualificação; fallback local seguro
        this.isQualified = (typeof data.qualified === 'boolean')
          ? data.qualified
          : this.checkQualified(this.form.assets);

        this.sent=true;
        this.$nextTick(()=>{ window.lucide?.createIcons(); });
      }catch(e){
        console.error(e);
        this.error='Não foi possível enviar sua solicitação. Por favor, tente novamente.';
      }finally{this.sending=false;}
    }
  }}

  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revealObserver.unobserve(e.target)}}),{threshold:.12});
  function initReveals(){
    const nodes=[...document.querySelectorAll('.reveal')].filter(el=>el.offsetParent!==null);
    nodes.forEach(n=>{if(!n.classList.contains('in'))revealObserver.observe(n)});
  }

  let globeRAF=null;
  function initCryptoGlobe(){
    const canvas=document.getElementById('cryptoGlobe');if(!canvas)return;
    if(globeRAF)cancelAnimationFrame(globeRAF);
    const ctx=canvas.getContext('2d');let rot=0.35,drag=false,lastX=0;
    const pts=[[-80,25],[-46,-23],[-8,39],[8,46],[12,42],[7,47],[77,23],[103,1],[138,36],[151,-33],[-3,6],[31,-1],[55,25],[-70,-33],[18,-34]];
    const links=[[0,2],[2,3],[3,4],[4,6],[6,8],[8,9],[2,10],[10,11],[11,12],[10,14],[0,13],[13,14],[12,6]];
    const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0)};resize();window.addEventListener('resize',resize,{passive:true});
    const project=(lon,lat,w,h)=>{let lam=lon*Math.PI/180+rot,phi=lat*Math.PI/180;let x=Math.cos(phi)*Math.sin(lam),y=Math.sin(phi),z=Math.cos(phi)*Math.cos(lam);let R=Math.min(w,h)*.34;return{x:w*.53+x*R,y:h*.5-y*R,z,R}};
    const draw=()=>{let w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);let R=Math.min(w,h)*.34,cx=w*.53,cy=h*.5;
      let g=ctx.createRadialGradient(cx-R*.35,cy-R*.38,R*.06,cx,cy,R*1.12);g.addColorStop(0,'rgba(255,255,255,.98)');g.addColorStop(.52,'rgba(247,248,249,.94)');g.addColorStop(1,'rgba(236,240,243,.45)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(10,10,10,.10)';ctx.lineWidth=1;ctx.stroke();
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
      ctx.strokeStyle='rgba(10,10,10,.08)';ctx.lineWidth=.7;
      for(let lat=-60;lat<=60;lat+=30){ctx.beginPath();let started=false;for(let lon=-180;lon<=180;lon+=4){let p=project(lon,lat,w,h);if(p.z>0){if(!started){ctx.moveTo(p.x,p.y);started=true}else ctx.lineTo(p.x,p.y)}else started=false}ctx.stroke()}
      for(let lon=-150;lon<=180;lon+=30){ctx.beginPath();let started=false;for(let lat=-88;lat<=88;lat+=3){let p=project(lon,lat,w,h);if(p.z>0){if(!started){ctx.moveTo(p.x,p.y);started=true}else ctx.lineTo(p.x,p.y)}else started=false}ctx.stroke()}
      links.forEach((ln,i)=>{let a=project(...pts[ln[0]],w,h),b=project(...pts[ln[1]],w,h);if(a.z>0&&b.z>0){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,Math.min(a.y,b.y)-26,a.x===b.x?a.x:b.x,b.y);ctx.strokeStyle=i%5===0?'rgba(85,179,248,.38)':'rgba(10,10,10,.13)';ctx.lineWidth=.75;ctx.stroke()}});
      pts.forEach((pt,i)=>{let p=project(...pt,w,h);if(p.z>0){ctx.beginPath();ctx.arc(p.x,p.y,i%5===0?3.1:2.1,0,Math.PI*2);ctx.fillStyle=i%5===0?'#55B3F8':'rgba(10,10,10,.55)';ctx.fill()}});ctx.restore();rot+=drag?0:.0017;globeRAF=requestAnimationFrame(draw)};
    canvas.onpointerdown=e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(drag){rot+=(e.clientX-lastX)*.006;lastX=e.clientX}};canvas.onpointerup=()=>drag=false;canvas.onpointercancel=()=>drag=false;draw();
  }


  let scrollFxRAF=null;
  const scrollTitles=new Map();
  const visibleTitles=new Set();
  const titleObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)visibleTitles.add(entry.target);else visibleTitles.delete(entry.target)});
    scheduleScrollFX();
  },{rootMargin:'100px 0px'});
  function splitCharactersForScroll(el){
    if(el.dataset.charsReady==='1')return;
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(!node.nodeValue || !node.nodeValue.trim())return;
      const frag=document.createDocumentFragment();
      const parts=node.nodeValue.split(/(\s+)/);
      parts.forEach(part=>{
        if(!part)return;
        if(/^\s+$/.test(part)){
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const group=document.createElement('span');
        group.className='scroll-word-group';
        Array.from(part).forEach(char=>{
          const span=document.createElement('span');
          span.className='scroll-char';
          span.textContent=char;
          group.appendChild(span);
        });
        frag.appendChild(group);
      });
      node.parentNode.replaceChild(frag,node);
    });
    el.dataset.charsReady='1';
  }
  function initScrollFX(){
    const selector=[
      'main .section h2.headline',
      'main .section h2.display.text-5xl',
      'main .system-main h3.display'
    ].join(',');
    const titles=[...document.querySelectorAll(selector)].filter(el=>el.offsetParent!==null);
    titles.forEach(el=>{
      if(scrollTitles.has(el))return;
      el.classList.add('scroll-ink');
      splitCharactersForScroll(el);
      scrollTitles.set(el,{chars:[...el.querySelectorAll('.scroll-char')],progress:-1});
      titleObserver.observe(el);
    });
    updateScrollFX();
  }
  function initTestimonialCarousel(){
    const carousel=document.querySelector('[data-testimonial-carousel]');
    if(!carousel||carousel.dataset.initialized==='true')return;
    const track=carousel.querySelector('[data-testimonial-track]');
    const page=track?.querySelector('[data-testimonial-page]');
    if(!track||!page)return;
    carousel.dataset.initialized='true';
    const duplicate=page.cloneNode(true);
    duplicate.setAttribute('aria-hidden','true');
    duplicate.querySelectorAll('[id]').forEach(element=>element.removeAttribute('id'));
    duplicate.querySelectorAll('.light-hover-card').forEach(el=>delete el.dataset.lightBound);
    track.appendChild(duplicate);
    carousel.classList.add('is-in-view');
    window.bindCardLights?.();
  }
  function updateScrollFX(){
    scrollFxRAF=null;
    const vh=window.innerHeight||800;
    const measurements=[...visibleTitles].map(el=>[el,el.getBoundingClientRect()]);
    measurements.forEach(([el,r])=>{
      if(el.offsetParent===null)return;
      const state=scrollTitles.get(el);
      const chars=state.chars;
      const n=chars.length;
      if(!n)return;
      const progress=Math.max(0,Math.min(1,(vh*.92-r.top)/(vh*.50)));
      if(Math.abs(state.progress-progress)<.002)return;
      state.progress=progress;
      /* A short feather is intentional: only ~3 letters transition at once. */
      const feather=2.8;
      const playhead=progress*(n+feather);
      chars.forEach((char,i)=>{
        const local=Math.max(0,Math.min(1,(playhead-i)/feather));
        const eased=local*local*(3-2*local);
        const alpha=0.18+(eased*.82);
        const nextAlpha=alpha.toFixed(3);
        if(char.style.getPropertyValue('--char-alpha')===nextAlpha)return;
        char.style.setProperty('--char-alpha',nextAlpha);
        char.style.setProperty('--char-glow',(eased*.26).toFixed(3));
        char.style.setProperty('--char-lift',(1-eased).toFixed(3));
      });
    });
  }
  function scheduleScrollFX(){
    if(scrollFxRAF)return;
    scrollFxRAF=requestAnimationFrame(updateScrollFX);
  }
  window.addEventListener('scroll',scheduleScrollFX,{passive:true});
  window.addEventListener('resize',scheduleScrollFX,{passive:true});
  

  document.addEventListener('DOMContentLoaded',()=>{
    initReveals();
    initScrollFX();
    initTestimonialCarousel();
    window.lucide?.createIcons();
    document.fonts?.ready.then(scheduleScrollFX);
  });


/* ===== Extracted script block 2 ===== */
/* Global ambient-light parallax — intentionally slow and subtle. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  const getLights = () => ({
    a: document.querySelector('.ambient-light.a'),
    b: document.querySelector('.ambient-light.b'),
    c: document.querySelector('.ambient-light.c')
  });
  function renderAmbient(){
    raf = 0;
    if(reduced.matches) return;
    const {a,b,c}=getLights();
    if(!a||!b||!c) return;
    const y = window.scrollY || 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = Math.min(1, y / max);
    const wave = Math.sin(p * Math.PI * 2);
    a.style.transform = `translate3d(${(wave*28).toFixed(1)}px,${(-y*.028).toFixed(1)}px,0) scale(${(1+p*.045).toFixed(3)})`;
    b.style.transform = `translate3d(${(p*70-18).toFixed(1)}px,${(y*.018).toFixed(1)}px,0) scale(${(1.04-p*.035).toFixed(3)})`;
    c.style.transform = `translate3d(${(-p*54).toFixed(1)}px,${(-y*.014).toFixed(1)}px,0) scale(${(.98+p*.055).toFixed(3)})`;
  }
  function scheduleAmbient(){if(!raf)raf=requestAnimationFrame(renderAmbient)}
  addEventListener('scroll',scheduleAmbient,{passive:true});
  addEventListener('resize',scheduleAmbient,{passive:true});
  
  document.addEventListener('DOMContentLoaded',scheduleAmbient);
  reduced.addEventListener?.('change',scheduleAmbient);
})();


/* ===== Extracted script block 3 ===== */
/* Mouse-following light for the two contextual cards. */
(() => {
  function bindCardLights(){
    document.querySelectorAll('.light-hover-card').forEach(card=>{
      if(card.dataset.lightBound==='1')return;
      card.dataset.lightBound='1';
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--light-x',`${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);
        card.style.setProperty('--light-y',`${((e.clientY-r.top)/r.height*100).toFixed(1)}%`);
      },{passive:true});
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--light-x','72%');
        card.style.setProperty('--light-y','28%');
      },{passive:true});
    });
  }
  window.bindCardLights = bindCardLights;
  document.addEventListener('DOMContentLoaded',bindCardLights);
  
})();


/* ===== Extracted script block 4 ===== */
/* V6.17 — pointer parallax + subtle animated technology network. */
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pointerX = .5, pointerY = .5, scrollRAF = 0;

  function applyParallax(){
    scrollRAF = 0;
    if(reduced.matches){
      root.style.setProperty('--ambient-mx','0px');
      root.style.setProperty('--ambient-my','0px');
      root.style.setProperty('--tech-mx','0px');
      root.style.setProperty('--tech-my','0px');
      root.style.setProperty('--tech-sy','0px');
      return;
    }
    const dx = pointerX - .5, dy = pointerY - .5;
    const y = window.scrollY || 0;
    root.style.setProperty('--ambient-mx', `${(dx * 34).toFixed(1)}px`);
    root.style.setProperty('--ambient-my', `${(dy * 24).toFixed(1)}px`);
    root.style.setProperty('--tech-mx', `${(dx * -18).toFixed(1)}px`);
    root.style.setProperty('--tech-my', `${(dy * -12).toFixed(1)}px`);
    root.style.setProperty('--tech-sy', `${Math.max(-18, Math.min(18, -y * .006)).toFixed(1)}px`);
  }
  function scheduleParallax(){ if(!scrollRAF) scrollRAF=requestAnimationFrame(applyParallax); }
  addEventListener('pointermove', e => {
    pointerX = Math.max(0,Math.min(1,e.clientX / Math.max(1,innerWidth)));
    pointerY = Math.max(0,Math.min(1,e.clientY / Math.max(1,innerHeight)));
    scheduleParallax();
  }, {passive:true});
  addEventListener('scroll',scheduleParallax,{passive:true});
  addEventListener('resize',scheduleParallax,{passive:true});

  const canvas = document.getElementById('techAtmosphereCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d',{alpha:true});
  if(!ctx) return;
  let w=0,h=0,dpr=1,raf=0,last=0,timer=0,elapsed=0;
  const nodes=[];

  function seed(){
    nodes.length=0;
    const count=innerWidth<=768 ? 18 : 32;
    for(let i=0;i<count;i++){
      nodes.push({
        x:(i%8+.25+Math.random()*.5)/8,
        y:(Math.floor(i/8)+.25+Math.random()*.5)/Math.ceil(count/8),
        r:Math.random()*1.05+.45,
        accent:i%7===0 ? 2 : (i%4===0 ? 1 : 0)
      });
    }
  }
  function resize(){
    dpr=1;
    w=Math.max(1,innerWidth); h=Math.max(1,innerHeight);
    canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function draw(ts){
    raf=0;
    if(document.hidden) return;
    const dt=last ? Math.min(100,ts-last) : 0; last=ts;
    elapsed+=dt;
    ctx.clearRect(0,0,w,h);
    const maxD=Math.min(340,Math.max(145,w*.18));
    const maxD2=maxD*maxD;

    for(let i=0;i<nodes.length;i++){
      const a=nodes[i], ax=a.x*w, ay=a.y*h;
      for(let j=i+1;j<nodes.length;j++){
        const b=nodes[j], bx=b.x*w, by=b.y*h;
        const dx=ax-bx,dy=ay-by,d2=dx*dx+dy*dy;
        if(d2<maxD2){
          const alpha=(1-d2/maxD2)*.24;
          const violet=(a.accent===2||b.accent===2);
          ctx.strokeStyle=violet?`rgba(155,140,255,${alpha*.72})`:`rgba(85,179,248,${alpha})`;
          ctx.lineWidth=.65;
          ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
          if((i+j)%3===0){
            const phase=(elapsed/11000+i*.173+j*.071)%1;
            const fade=Math.sin(phase*Math.PI);
            ctx.fillStyle=`rgba(142,213,255,${fade*.72})`;
            ctx.fillRect(ax+(bx-ax)*phase-1,ay+(by-ay)*phase-1,2,2);
          }
        }
      }
    }
    nodes.forEach(n=>{
      const x=n.x*w,y=n.y*h;
      ctx.beginPath();ctx.arc(x,y,n.r,0,Math.PI*2);
      ctx.fillStyle=n.accent===2?'rgba(155,140,255,.34)':n.accent===1?'rgba(93,231,231,.32)':'rgba(130,199,250,.22)';
      ctx.fill();
      if(n.accent){
        ctx.beginPath();ctx.arc(x,y,n.r+4,0,Math.PI*2);
        ctx.strokeStyle=n.accent===2?'rgba(155,140,255,.055)':'rgba(85,179,248,.055)';ctx.stroke();
      }
    });
    timer=setTimeout(()=>{raf=requestAnimationFrame(draw)},1000/24);
  }
  function start(){clearTimeout(timer);cancelAnimationFrame(raf);last=0;if(!document.hidden)raf=requestAnimationFrame(draw)}
  function visibility(){if(document.hidden){clearTimeout(timer);cancelAnimationFrame(raf)}else start()}
  seed(); resize(); scheduleParallax(); start();
  let resizeTimer=0;
  addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{seed();resize();start()},150);
  },{passive:true});
  document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener?.('change',()=>{scheduleParallax();start()});
})();
