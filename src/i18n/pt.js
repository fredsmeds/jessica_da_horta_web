const pt = {
  // Navigation
  nav: {
    home: 'Início',
    about: 'Sobre',
    projects: 'Projetos',
    blog: 'Blog',
    faq: 'FAQ',
    contact: 'Contacto',
    schedule: 'Agendar Visita',
  },

  // Hero
  hero: {
    tagline: 'Paisagismo mediterrânico com consciência ecológica',
    cta: 'Agendar Visita',
  },

  // About
  about: {
    sectionLabel: 'Sobre',
    earlyLifeTitle: 'Origens e Formação',
    earlyLifeText: [
      'Cresci entre a África do Sul e Portugal — as minhas primeiras memórias de plantas são dos viveiros que a minha mãe me levava ao fim de semana, onde aprendi a olhar para as flores com uma atenção que nunca mais perdi. Quando vim para Portugal, reencontrei as raízes rurais da família do meu pai, e com o meu avô paterno tive as primeiras conversas a sério sobre plantas.',
      'Na hora de escolher um percurso académico, estava indecisa entre biologia, psicologia, ergonomia e arquitetura. Sabia que queria trabalhar com espaços exteriores, mas ainda não percebia bem o que isso significava. Durante o curso fui tentando sempre aproximar-me do terreno: experiências em hortas comunitárias, recriações históricas onde me apaixonei pela etnobotânica e pela ligação entre os seres humanos e as plantas.',
      'Completei o mestrado numa área que une paisagismo, ecologia e horticultura. Esses anos de formação deram-me as bases, mas foi no campo que aprendi o essencial.',
    ],
    educationLabel: 'Formação Académica',
    educationItems: [
      {
        degree: 'Mestrado em Arquitetura Paisagista',
        school: 'Instituto Superior de Agronomia, ULisboa',
        period: '2013 – 2015',
        note: '',
      },
      {
        degree: 'Licenciatura em Arquitetura Paisagista',
        school: 'Instituto Superior de Agronomia, ULisboa',
        period: '2008 – 2013',
        note: 'Vogal fundadora do NAPISA',
      },
    ],
    careerTitle: 'Percurso Profissional',
    careerText: [
      'Jéssica Horta Gomes nasceu na África do Sul e mudou-se ainda jovem para Portugal, reconectando-se com as raízes da sua família. É mestre em Arquitetura Paisagista pelo Instituto Superior de Agronomia, Universidade de Lisboa, área em que trabalha desde 2015.',
      'Desde cedo envolveu-se em projetos centrados nas plantas, desenvolvendo uma prática ancorada no trabalho de campo e numa relação de maior reciprocidade com a natureza. O seu percurso, entre ateliers e empresas, fundiu a ligação entre projeto conceptual e implementação prática no terreno.',
      'Atualmente trabalha por conta própria, desenvolvendo jardins adaptados ao clima mediterrânico e ao contexto local, prestando serviços de consultoria e acompanhamento de instalações.',
      'Paralelamente, colabora com ONGs, ministrando formações sobre jardins de sequeiro através da associação APEJECEM-MGAP e participando em plantações de microflorestas urbanas em Lisboa com a URBEM.',
    ],
    philosophyTitle: 'Filosofia e Missão',
    philosophyText: [
      'A minha missão é aproximar a perceção ecológica à horticultura do quotidiano. Nós estamos um pouco desconexos da nossa paisagem — às vezes olhamos para ela e não conseguimos apreciar a beleza porque a nossa expectativa foi moldada por referências que não pertencem ao nosso clima.',
      'Trabalho com jardins naturalistas e mediterrânicos que são adaptados ao lugar, que não dependem de inputs constantes, que integram as comunidades de plantas que existem na natureza. É uma abordagem sustentável — não por tendência, mas por lógica ecológica.',
      'A Jessica da Horta Garden Design foi fundada oficialmente em janeiro de 2025. Para além do design e instalação, ofereço formação, consultoria e gestão de jardins, e invisto em equipas que valorizam a jardinagem como profissão.',
    ],
    servicesTitle: 'Serviços',
    servicesList: [
      'Consultoria técnica (presencial ou remota)',
      'Conceção e planeamento de espaços exteriores / espaços verdes',
      'Acompanhamento e supervisão da instalação de jardins, com orientação das equipas em obra',
      'Visitas técnicas de manutenção, que podem incluir intervenções específicas na vegetação (como podas), inspeção e identificação de pragas e doenças, e apoio às equipas responsáveis pela gestão e manutenção contínua do espaço',
      'Formadora em jardinagem mediterrânica de sequeiro',
    ],
    missionTitle: 'Missão',
    missionStatement: 'Aproximar a perceção ecológica à perceção diária da horticultura — criando jardins que pertencem ao lugar, respeitam os ciclos naturais e mudam as expectativas de quem os habita.',
    pressTitle: 'Imprensa & Palestras',
    pressTypeArticle: 'Artigo',
    pressTypeTalk: 'Palestra',
    pressItems: [
      { type: 'article', title: 'Redescoberta da Jardinagem em Clima Mediterrânico', outlet: 'Jardins', year: '', url: 'https://mgaportugal.org/redescoberta-da-jardinagem-em-clima-mediterranico' },
      { type: 'article', title: 'Criar um Jardim de Sequeiro Mediterrânico: Passos e Princípios', outlet: 'Revista APH, Nº 141', year: '2021', url: 'https://www.mgaportugal.org/revista_aph_141_p40-43.pdf' },
      { type: 'article', title: 'Primeira Bolsa de Formação MGAP — Porto Urban Greening Biennial', outlet: 'MGAP', year: '2024', url: 'https://mgaportugal.org/news-events/news/first-mgap-training-bursary' },
      { type: 'talk', title: 'Adaptar os Espaços Verdes à Transição Climática', outlet: 'Lisboa E-Nova / CIUL, Lisboa', year: '2026', url: 'https://lisboaenova.org/adaptar-os-espacos-verdes-a-transicao-climatica/' },
      { type: 'talk', title: 'Jardins Mediterrânicos de Sequeiro: Semeando Beleza ao Ritmo da Natureza', outlet: 'LNEC / Iniciativa FCCN + Sustentável, Lisboa', year: '2025', url: 'https://mgaportugal.org/news-events/news/mgap-in-lisbon-and-beira' },
      { type: 'talk', title: 'Workshop Jardins Xerófitos', outlet: 'Câmara Municipal de Mértola', year: '2025', url: 'https://mgaportugal.org/news-events/news/Workshops-Jardins' },
      { type: 'talk', title: 'Introdução à Jardinagem em Clima Mediterrânico', outlet: 'Módulo de Formação MGAP, Moncarapacho', year: '2025', url: 'https://mgaportugal.org/news-events/news/first-dry-gardening-training-module' },
      { type: 'talk', title: 'Como Libertar o Seu Jardim do Relvado', outlet: 'Feira Mediterrânica de Jardins de Outono MGAP, Lagoa', year: '2025', url: 'https://mgaportugal.org/news-events/past-events/2025-mgap-autumn-garden-fair' },
      { type: 'talk', title: 'Workshop de Design de Jardim Seco', outlet: 'MGAP', year: '2024', url: 'https://mgaportugal.org/news-events/news/dry-garden-design-workshop-22-may-2024' },
      { type: 'talk', title: 'Como Libertar o Seu Jardim do Relvado + Propagação de Plantas para Jardim Seco', outlet: 'Feira Mediterrânica de Jardins de Outono MGAP, Lagoa', year: '2024', url: 'https://mgaportugal.org/news-events/news/thousands-of-garden-lovers-flock-to-fatacil-for-autumn-garden-fair' },
      { type: 'talk', title: 'Começar do Zero: Design de Jardim Compatível com o Clima', outlet: 'Feira Mediterrânica de Jardins de Outono MGAP, Silves', year: '2023', url: 'https://mgaportugal.org/news-events/news/future-proof-your-garden' },
    ],
    certTitle: 'Certificações e Formação',
    certItems: [
      { title: 'AFC Técnicas de Engenharia Natural', issuer: 'EcoSalix & Montis / APAP', year: '2023' },
      { title: 'Sistemas de Rega sob Pressão', issuer: 'APAP', year: '2022' },
      { title: 'Poda de Árvores', issuer: 'ArqCoop+', year: '2022' },
      { title: 'Plant it Right!', issuer: 'Linda Chalker-Scott / Garden Masterclass', year: '2021' },
      { title: 'Naturalistic Planting Design', issuer: 'Nigel Dunnett & Noel Kingsbury / Garden Masterclass', year: '2021' },
      { title: 'Projecto de Execução de Arquitetura Paisagista', issuer: 'ArqCoop+', year: '2021' },
      { title: 'Rega de Espaços Verdes, Nível I', issuer: 'CUDELL Outdoor Solutions', year: '2018' },
      { title: 'CCP – Formação de Formadores', issuer: 'IEFP – Joviform (90 h) · Formação Pedagógica Inicial de Formadores CCP, com foco no planeamento, execução e avaliação de atividades formativas', year: 'Abr. 2025' },
    ],
    volunteerTitle: 'Voluntariado e Comunidade',
    volunteerItems: [
      { role: 'Consultora de Horticultura', org: 'MGAP / APEJECM', period: '2020 – presente' },
      { role: 'Voluntária & Guia de Jardins', org: 'Festival Jardins Abertos', period: '2021 – presente' },
      { role: 'Voluntária e Colaboração', org: 'Associação Urbem Forests', period: 'Fev. 2026 – presente' },
      { role: 'Voluntária', org: 'Banco Genético Vegetal Autóctone de Sintra', period: '2013 – 2015' },
      { role: 'Voluntária Ambiental', org: 'Cascais Natura / Oxigénio', period: '2010 – 2012' },
    ],
    portraitAlt: 'Jessica da Horta',
  },

  // Projects
  blog: {
    sectionLabel: 'Blog',
    title: 'Artigos & Recursos',
    intro: 'Conhecimento sobre jardinagem mediterrânica, cuidados de plantas e design de espaços verdes.',
    all: 'Todos',
    loading: 'A carregar...',
    empty: 'Ainda não há artigos publicados.',
  },

  projects: {
    sectionLabel: 'Projetos',
    title: 'Portfólio',
    intro: 'Uma seleção de projetos de jardim, consultoria e instalação. Portefólio completo em breve.',
    placeholder: 'Projetos em atualização.',
    comingSoon: 'Em breve',
  },

  // FAQ
  faq: {
    sectionLabel: 'Perguntas Frequentes',
    title: 'FAQ',
    items: [
      {
        q: 'O que é uma visita técnica e quando é necessária?',
        a: 'A visita técnica é uma deslocação ao local para análise do espaço, condições do solo, exposição solar e orientação. É obrigatória para serviços de design de jardim, instalação ou gestão/manutenção. Permite criar uma proposta realista e totalmente adaptada ao seu espaço.',
      },
      {
        q: 'Quais são os serviços disponíveis?',
        a: 'Oferecemos consultoria simples (telefone, email, reunião online) e avançada (visita técnica + análises + proposta), design de jardim em pacote simples ou completo com partes técnicas, licenciamento municipal, instalação e monitorização, e gestão e manutenção contínua.',
      },
      {
        q: 'O que são jardins mediterrânicos e quais as vantagens?',
        a: 'São jardins compostos por espécies adaptadas ao clima mediterrânico — resistentes à seca, às temperaturas extremas de verão e à sazonalidade da nossa região. Após o período de estabelecimento, prosperam com as chuvas naturais, sem depender de sistemas de rega. São mais resilientes, mais económicos a longo prazo e integram-se harmoniosamente na paisagem local.',
      },
      {
        q: 'Posso ter um jardim bonito sem sistema de rega permanente?',
        a: 'Sim. Com uma seleção cuidadosa de espécies e um bom design, é possível criar jardins de sequeiro que florescem com as chuvas naturais após o estabelecimento. O segredo está na escolha das plantas certas e numa boa preparação do solo.',
      },
      {
        q: 'Qual é a melhor época para instalar um jardim?',
        a: 'O Outono é a estação ideal. As chuvas e temperaturas mais amenas permitem que as plantas se enraízem antes do calor de verão. A Primavera é a segunda opção. Para garantir a disponibilidade das plantas, a lista de espécies deve ser finalizada com pelo menos dois meses de antecedência.',
      },
      {
        q: 'Como funciona o processo desde o primeiro contacto?',
        a: 'O processo começa com o preenchimento do formulário de agendamento, que nos permite compreender o seu espaço e necessidades antes da visita. Seguem-se a visita técnica, a proposta de design, a aprovação e a instalação. Cada etapa é acompanhada de perto.',
      },
      {
        q: 'Em que zonas geográficas trabalham?',
        a: 'Trabalhamos principalmente em Portugal continental, com foco no clima mediterrânico. Para projetos de grande dimensão ou com características especiais, podemos considerar outras regiões.',
      },
      {
        q: 'Aceitam candidaturas de jardineiros independentes?',
        a: 'Sim. Trabalhamos com prestadores de serviços (recibo verde) — jardineiros independentes e equipas externas. Pode candidatar-se através do formulário de contacto, selecionando a opção Emprego/Carreira.',
      },
    ],
  },

  // Contact
  contact: {
    sectionLabel: 'Contacto',
    title: 'Fale Connosco',
    intro: 'Selecione o assunto para continuar.',
    subjectLabel: 'Assunto',
    subjects: {
      general: 'Consulta Geral',
      schedule: 'Agendar uma Visita',
      prices: 'Preços e Orçamentos',
      jobs: 'Emprego / Carreira',
    },
    nameLabel: 'Nome completo',
    emailLabel: 'Email',
    phoneLabel: 'Telefone',
    zipLabel: 'Código Postal',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Descreva a sua questão ou necessidade...',
    privacyText: 'Li e aceito a',
    privacyLink: 'Política de Privacidade',
    sendBtn: 'Enviar Mensagem',
    sending: 'A enviar...',
    successTitle: 'Mensagem enviada',
    successText: 'Receberá uma resposta em breve. Obrigado pelo contacto.',
    errorText: 'Ocorreu um erro ao enviar a mensagem. Por favor tente novamente.',
    // Jobs form
    jobsIntro: 'Colaboramos pontualmente com jardineiros independentes e profissionais de horticultura em regime freelance. Não oferecemos contratos de trabalho — esta é uma base de contacto para colaborações pontuais. Deixe os seus dados e entraremos em contacto se surgir uma oportunidade.',
    jobsNameLabel: 'Nome completo',
    jobsPhoneLabel: 'Telefone',
    jobsEmailLabel: 'Email',
    jobsExperienceLabel: 'Breve descrição do seu percurso (opcional)',
    jobsExperiencePlaceholder: 'Espécies com que trabalha, anos de experiência, especialidades...',
  },

  // Schedule a Visit
  schedule: {
    sectionLabel: 'Agendar Visita',
    title: 'Agendamento de Visita Técnica',
    intro: 'Este formulário destina-se à recolha de informação essencial para preparar uma visita técnica ao seu espaço. Por favor preencha todos os campos com atenção.',
    note: 'Uma visita técnica ao local é necessária para qualquer serviço de consultoria avançada, design de jardim ou gestão/manutenção.',
    stepOf: 'Passo {current} de {total}',
    nextBtn: 'Seguinte',
    prevBtn: 'Anterior',
    submitBtn: 'Enviar Pedido',
    submitting: 'A enviar...',
    successTitle: 'Pedido recebido',
    successText: 'O seu pedido de visita foi enviado com sucesso. Receberá uma confirmação por email em breve. Obrigado.',
    errorText: 'Ocorreu um erro ao enviar o formulário. Por favor tente novamente.',

    // Steps
    steps: [
      'Informação do Cliente',
      'Detalhes da Localização',
      'Solo e Água',
      'Fauna Doméstica',
      'Preferências de Jardim',
      'Serviços Pretendidos',
      'Calendário',
      'Manutenção Atual',
      'Observações Adicionais',
    ],

    // Step 1
    s1title: 'Informação do Cliente',
    s1desc: 'Dados de contacto para que possamos comunicar consigo de forma eficiente.',
    fullNameLabel: 'Nome completo',
    phoneLabel: 'Telefone (com indicativo de país)',
    emailLabel: 'Email',
    addressLabel: 'Morada do local de intervenção',
    postalCodeLabel: 'Código postal',

    // Step 2
    s2title: 'Detalhes da Localização',
    s2desc: 'Dimensões aproximadas da área a trabalhar, limites e especificidades.',
    totalAreaLabel: 'Área total do terreno (m²)',
    interventionAreaLabel: 'Área de intervenção paisagística (m²)',
    limitsLabel: 'Limites de intervenção (descrição)',
    limitsDesc: 'Descreva as zonas específicas do terreno que pretende transformar.',
    limitsPlansLabel: 'Limite de intervenção (plantas/documentos)',
    limitsPlansDesc: 'Se tiver uma planta, imagem de satélite ou outro documento, pode anexá-lo após a submissão.',
    topoLabel: 'Levantamento topográfico existente?',
    topoFormatLabel: 'Se sim, em que formato?',
    constructionsLabel: 'Existência de construções no local?',
    constructionsDescLabel: 'Se sim, descreva:',
    yes: 'Sim',
    no: 'Não',
    pdf: 'PDF',
    dwg: 'DWG',
    other: 'Outro',

    // Step 3
    s3title: 'Condições de Solo e Água',
    s3desc: 'Indique as condições do solo e disponibilidade de água no local.',
    soilAnalysisLabel: 'Análise de solo realizada?',
    waterAnalysisLabel: 'Análise de água realizada?',
    waterSourcesLabel: 'Fontes de água disponíveis para rega:',
    waterStorageLabel: 'Se selecionou depósito, tanque ou similar, indique a capacidade (volume):',
    waterSources: {
      well: 'Furo / Poço',
      borehole: 'Captação de furo',
      rainwater: 'Recolha de água da chuva — depósito',
      tank: 'Tanque',
      public: 'Rede pública de abastecimento',
    },

    // Step 4
    s4title: 'Fauna Doméstica',
    s4desc: 'Informe-nos sobre animais domésticos no local — é importante para garantir que o projeto é seguro e funcional para todos.',
    hasPetsLabel: 'Tem animais domésticos?',
    petsDescLabel: 'Se sim, especifique espécie(s) e quantidade:',
    petsAccessLabel: 'Os animais terão acesso às novas áreas de plantação?',

    // Step 5
    s5title: 'Preferências de Jardim',
    s5desc: 'Partilhe as suas preferências de estilo e ideias para o espaço.',
    plantingStyleLabel: 'Estilo de plantação preferido',
    plantingStyleDesc: '(Aspeto geral — caminhos e materiais)',
    pathStyleLabel: 'Estilo de formas e matrizes de plantação preferido',
    pathStyleDesc: '(Formas + matriz de plantação)',
    plantTypesLabel: 'Preferência por tipo de plantas:',
    colorsLabel: 'Cores preferidas no jardim:',
    desiredElementsLabel: 'Elementos desejados:',
    plantingStyles: {
      naturalist: '+Naturalista',
      intermediate: 'Intermédio',
      stylized: '+Estilizado',
    },
    plantTypes: {
      native: 'Nativas',
      mediterranean: 'Mediterrânicas (indígenas e de outras origens)',
      edible: 'Comestíveis',
      medicinal: 'Medicinais',
      ornamental: 'Ornamentais',
      evergreen: 'Perenifólias',
      groundcover: 'Coberturas de solo (alternativas ao relvado)',
    },
    desiredElements: {
      water: 'Elemento de água',
      living: 'Zona de estar',
      edibleGarden: 'Jardim comestível',
      vegetable: 'Horta',
      pathways: 'Caminhos / percursos',
    },

    // Step 6
    s6title: 'Serviços Pretendidos',
    s6desc: 'Indique o tipo de serviço que pretende. Uma visita técnica é sempre realizada antes de cada serviço.',
    serviceTypeLabel: 'Tipo de serviço desejado:',
    services: {
      '1A': '1A — Consultoria Simples (via telefone, email, whatsapp, reunião online)',
      '1B': '1B — Consultoria Avançada (visita técnica, análises, proposta, contacto com fornecedores)',
      '2A': '2A — Design Simples de Jardim / Arquitetura Paisagista',
      '2B': '2B — Projeto Completo com Partes Técnicas (Estudo Preliminar, Projeto Preliminar e de Execução)',
      '2C': '2C — Pacote de Licenciamento Municipal',
      '3': '3 — Instalação e Monitorização do Projeto de Execução',
      '4': '4 — Gestão e Monitorização de Manutenção',
    },

    hiredArchitectLabel: 'Já alguma vez contratou os serviços de um arquiteto paisagista?',

    // Step 7
    s7title: 'Calendário',
    s7desc: 'Ajuda-nos a alinhar o planeamento com as suas expectativas. O design de jardim é desenvolvido tendo em conta as épocas de plantação ideais — preferencialmente Outono, ou Primavera como último recurso.',
    installationLabel: 'Instalação / Implementação:',
    seasons: {
      autumn: 'Próximo Outono',
      spring: 'Próxima Primavera',
    },
    prioritiesLabel: 'Há elementos ou características que considera essenciais e devem ser prioritizados dentro do seu orçamento?',
    additionalDescLabel: 'Descreva a sua situação com mais detalhe se necessário:',

    // Step 8
    s8title: 'Manutenção Atual do Jardim',
    s8desc: '',
    maintenanceTeamLabel: 'Tem uma equipa de manutenção que visita o jardim?',
    maintenanceDetailsLabel: 'Se sim, com que frequência visitam e quantas pessoas compõem a equipa?',

    // Step 9
    s9title: 'Observações Adicionais',
    s9desc: 'Utilize este espaço para partilhar qualquer outra informação relevante que não tenha sido coberta nas secções anteriores.',
    observationsLabel: 'Informação relevante ou considerações especiais:',

    // Uploads
    uploadBtn: 'Selecionar ficheiro',
    uploadBtnMulti: 'Selecionar ficheiros',
    uploadMaxSize: 'Máx. 25MB por ficheiro.',
    uploadSizeError: 'excede o limite de 25MB e não foi adicionado.',
    topoFileLabel: 'Carregar ficheiro do levantamento',
    constructionImagesLabel: 'Fotografias das construções existentes (opcional)',
    rainwaterImageLabel: 'Fotografia do depósito de recolha de água',
    interventionImagesLabel: 'Fotografias da área de intervenção (opcional)',

    // Disclaimer / travel fee
    disclaimerTitle: 'Taxa de Deslocação',
    disclaimerText: 'Valor base: 90€ — inclui visita e consultoria no local (1 a 2 horas). Taxa de deslocação: 0,40€/km (ida e volta desde a base). O valor base é abatido no total do projeto caso o cliente avance com os serviços.',
    disclaimerCalc: 'A calcular distância...',
    disclaimerDist: 'Distância estimada: {km} km',
    disclaimerWithin: 'Sem taxa de deslocação adicional.',
    postalCodeRequired: 'Por favor, introduza o seu código postal para continuar.',
    disclaimerError: 'Não foi possível calcular a distância automaticamente.',

    // Preferred visit date/time (Step 9)
    preferredDateLabel: 'Data preferida para a visita',
    preferredTimeLabel: 'Preferência de horário',
    timeOptions: {
      morning: 'Manhã (9h–13h)',
      afternoon: 'Tarde (14h–18h)',
      flexible: 'Flexível',
    },
    visitNote: 'Sujeito a confirmação por parte da Jessica da Horta.',

    privacyText: 'Li e aceito a',
    privacyLink: 'Política de Privacidade',
  },

  // Project categories
  projectCategories: {
    1: 'Consultoria + Design',
    2: 'Design · Plano Geral · Jardim de Sequeiro',
    3: 'Design · Jardim de Sequeiro',
    4: 'Instalação · Jardim de Sequeiro',
    5: 'Acompanhamento · Jardim de Sequeiro',
    6: 'Formação · Jardinagem de Sequeiro em Clima Mediterrânico',
  },

  // Album tags
  albumTags: {
    planning: 'Planeamento',
    before: 'Antes',
    after: 'Depois',
  },

  // Footer
  footer: {
    tagline: 'Paisagismo mediterrânico com consciência ecológica.',
    links: 'Links',
    privacy: 'Política de Privacidade',
    rights: 'Todos os direitos reservados.',
  },

  // Privacy Policy
  privacy: {
    title: 'Política de Privacidade',
    close: 'Fechar',
    content: `Os dados pessoais recolhidos através dos formulários deste website são utilizados exclusivamente para responder às suas solicitações e para comunicação relacionada com os serviços da Jessica da Horta Garden Design. Não partilhamos os seus dados com terceiros sem o seu consentimento. Tem o direito de aceder, corrigir ou solicitar a eliminação dos seus dados pessoais. Para exercer esses direitos, entre em contacto através de contact@jessicadahorta.com.`,
  },
}

export default pt
