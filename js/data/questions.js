/**
 * RETO CASTILLOS DE ESPAÑA
 * Banco de preguntas rigurosamente contrastadas sobre fortificaciones españolas.
 * Criterios: Fidelidad histórica documental, ausencia de leyendas no verificadas,
 * pedagogía patrimonial y vinculación con la AEAC.
 */

export const PREGUNTAS = [
  // --- 1. IDENTIFICACIÓN Y FOTOGRAFÍA ---
  {
    id: "p01",
    enunciado: "¿Qué célebre fortaleza románica del siglo XI-XII, escenario de diversas películas históricas, se muestra en la imagen?",
    opciones: ["Castillo de Peñafiel", "Castillo de Belmonte", "Castillo de Loarre", "Castillo de Coca"],
    correcta: 2,
    explicacion: "Se trata del Castillo de Loarre (Huesca), considerado el castillo románico mejor conservado de Europa. Erigido en el siglo XI bajo los reinados de Sancho el Mayor y Sancho Ramírez para controlar la comarca de la Hoya de Huesca.",
    fuente: "AEAC / IPCE - Guía de Castillos de España",
    castilloId: "loarre",
    imagen: "assets/images/loarre.jpg?v=castle2",
    categoria: "identificacion",
    dificultad: "facil"
  },
  {
    id: "p02",
    enunciado: "¿A qué singular fortaleza gótico-mudéjar de ladrillo, rodeada por un profundo foso seco de más de 20 metros, corresponde esta estructura?",
    opciones: ["Castillo de Simancas", "Castillo de Coca", "Castillo de la Mota", "Castillo de Arévalo"],
    correcta: 1,
    explicacion: "Es el Castillo de Coca (Segovia), cumbre del mudéjar militar castellano levantado en el siglo XV por orden del arzobispo don Alonso de Fonseca.",
    fuente: "Inventario Nacional de Arquitectura Defensiva / AEAC",
    castilloId: "coca",
    imagen: "assets/images/coca.jpg",
    categoria: "identificacion",
    dificultad: "facil"
  },
  {
    id: "p03",
    enunciado: "¿Qué castillo de la Escuela de Valladolid, con torre del homenaje pentagonal y sede de la Asociación Española de Amigos de los Castillos, vemos en la fotografía?",
    opciones: ["Castillo de Peñafiel", "Castillo de Fuensaldaña", "Castillo de Portillo", "Castillo de Villafuerte de Esgueva"],
    correcta: 3,
    explicacion: "Es el Castillo de Villafuerte de Esgueva (Valladolid), rescatado y restaurado directamente por la Asociación Española de Amigos de los Castillos (AEAC) para albergar su sede y actividades patrimoniales.",
    fuente: "Asociación Española de Amigos de los Castillos (AEAC)",
    castilloId: "villafuerte",
    imagen: "assets/images/villafuerte.jpg",
    categoria: "identificacion",
    dificultad: "media"
  },
  {
    id: "p04",
    enunciado: "¿Cuál es el único castillo gótico de España con planta completamente circular y patio central cilíndrico de dos niveles?",
    opciones: ["Castillo de Bellver", "Castillo de San Marcos", "Castillo de Cuéllar", "Castillo de Santa Catalina"],
    correcta: 0,
    explicacion: "El Castillo de Bellver (Palma de Mallorca), mandado construir por el rey Jaime II de Mallorca a inicios del siglo XIV. Es una de las escasísimas fortificaciones circulares existentes en el continente europeo.",
    fuente: "Inventario Monumental de las Illes Balears / AEAC",
    castilloId: "bellver",
    imagen: "assets/images/bellver.jpg",
    categoria: "identificacion",
    dificultad: "facil"
  },
  {
    id: "p05",
    enunciado: "¿Qué fortaleza roquera del siglo XV de la Casa de Mendoza, con galería hispano-flamenca de Juan Guas, se alza junto al embalse de Santillana?",
    opciones: ["Castillo de Buitrago del Lozoya", "Castillo de Manzanares el Real", "Castillo de Torija", "Castillo de Chinchón"],
    correcta: 1,
    explicacion: "El Castillo Nuevo de Manzanares el Real (Madrid), proyectado por el arquitecto Juan Guas para la familia Mendoza, representa la síntesis perfecta entre fortaleza militar y residencia palaciega señorial.",
    fuente: "Comunidad de Madrid / AEAC",
    castilloId: "manzanares",
    imagen: "assets/images/manzanares.jpg",
    categoria: "identificacion",
    dificultad: "facil"
  },
  {
    id: "p06",
    enunciado: "¿Qué castillo templario marítimo, construido sobre un tómbolo rocoso bañado por el Mediterráneo, sirvió de sede pontificia a Benedicto XIII (el Papa Luna)?",
    opciones: ["Castillo de Santa Bárbara", "Castillo de Sagunto", "Castillo de Peñíscola", "Castillo de Tossa de Mar"],
    correcta: 2,
    explicacion: "El Castillo de Peñíscola (Castellón), levantado por los templarios a finales del siglo XIII y reformado para alojar la corte papal de Benedicto XIII durante el Cisma de Occidente.",
    fuente: "Patrimonio Cultural Generalitat Valenciana / AEAC",
    castilloId: "peniscola",
    imagen: "assets/images/peniscola.jpg",
    categoria: "identificacion",
    dificultad: "facil"
  },

  // --- 2. ELEMENTOS ARQUITECTÓNICOS DEFENSIVOS ---
  {
    id: "p07",
    enunciado: "¿Cómo se denomina el camino de ronda o pasillo elevado situado sobre las murallas que permite la vigilancia y el tránsito de los defensores?",
    opciones: ["Barbacana", "Tronera", "Aljibe", "Adarve"],
    correcta: 3,
    explicacion: "El adarve (del árabe 'ad-darb', el camino) es el pasillo o corredor que recorre la parte superior de las murallas, protegido habitualmente hacia el exterior por un parapeto con almenas.",
    fuente: "Diccionario de Arquitectura Militar AEAC",
    castilloId: null,
    imagen: "assets/images/adarve.jpg",
    categoria: "arquitectura",
    dificultad: "media"
  },
  {
    id: "p08",
    enunciado: "¿Qué elemento arquitectónico militar consistente en salientes de mampostería prismáticos situados sobre el parapeto permite disparar a resguardo?",
    opciones: ["Almenas o merlones", "Aspilleras", "Buhardas", "Poternas"],
    correcta: 0,
    explicacion: "Las almenas (también llamadas merlones) son los bloques sólidos salientes que coronan los muros, dejando entre ellos vanos llamados cañoneras o aspilleras para el tiro y la observación.",
    fuente: "Diccionario de Arquitectura Defensiva AEAC",
    castilloId: null,
    imagen: "assets/images/almenas.jpg",
    categoria: "arquitectura",
    dificultad: "facil"
  },
  {
    id: "p09",
    enunciado: "¿Qué es una barbacana en una fortificación medieval?",
    opciones: [
      "Un almacén subterráneo para almacenar pólvora",
      "Una estructura defensiva exterior adelantada que protege la puerta principal",
      "Una ventana con reja en la torre señorial",
      "El foso excavado en la roca viva sin agua"
    ],
    correcta: 1,
    explicacion: "La barbacana es una obra de fortificación adelantada y aislada o unida al muro principal, destinada a proteger puertas, puentes levadizos o accesos estratégicos contra el asalto frontal.",
    fuente: "Diccionario de Términos Militares AEAC",
    castilloId: null,
    imagen: "assets/images/barbacana.jpg",
    categoria: "arquitectura",
    dificultad: "media"
  },
  {
    id: "p10",
    enunciado: "¿Qué estructura subterránea impermeable era vital en los castillos para garantizar el suministro de agua durante asedios prolongados?",
    opciones: ["Matacán", "Poterna", "Aljibe", "Baluarte"],
    correcta: 2,
    explicacion: "El aljibe es un depósito subterráneo diseñado para recoger y almacenar el agua de lluvia mediante canalizaciones desde los tejados y patios de armas. Su existencia determinaba la capacidad de resistencia del castillo.",
    fuente: "Diccionario de Arquitectura Defensiva AEAC",
    castilloId: null,
    imagen: "assets/images/aljibe.jpg",
    categoria: "arquitectura",
    dificultad: "facil"
  },
  {
    id: "p11",
    enunciado: "¿Qué es el alambor o escarpa en la base de las murallas o torres de un castillo?",
    opciones: [
      "Una puerta secreta de escape para espías",
      "El escudo heráldico grabado sobre la puerta principal",
      "Una campana de aviso en la torre del homenaje",
      "Un talud inclinado que dificulta el escalo y el minado, y hace rebotar los proyectiles caídos hacia los atacantes"
    ],
    correcta: 3,
    explicacion: "El alambor es el ensanchamiento oblicuo o talud en la base de los muros. Impide que las máquinas de asedio se aproximen, evita el zanjado o zapa de la cimentación y permitía que las piedras arrojadas desde arriba rebotaran horizontalmente hacia las tropas sitiadoras.",
    fuente: "Vocabulario de Fortificación Histórica AEAC",
    castilloId: null,
    imagen: "assets/images/alambor.jpg",
    categoria: "arquitectura",
    dificultad: "avanzada"
  },
  {
    id: "p12",
    enunciado: "¿Cómo se llama la torre principal y más resistente de una fortaleza medieval, último reducto de defensa y residencia del señor?",
    opciones: ["Torre del homenaje", "Torre albarrana", "Torre vigía", "Torre de flanqueo"],
    correcta: 0,
    explicacion: "La torre del homenaje (o 'torre del homenaje' en castellano, 'donjon' en francés) era el núcleo neurálgico del castillo donde se realizaba el acto de pleitesía o juramento de fidelidad y el refugio definitivo ante una brecha en las murallas.",
    fuente: "IPCE / AEAC",
    castilloId: null,
    imagen: null,
    categoria: "arquitectura",
    dificultad: "facil"
  },
  {
    id: "p13",
    enunciado: "¿Qué distingue a una torre albarrana respecto al resto de torres de un recinto amurallado?",
    opciones: [
      "Tiene base redonda y remate piramidal de teja roja",
      "Está construida fuera de la muralla principal y unida a ella únicamente por un puente o arco",
      "Se destinaba exclusivamente a cárcel y mazmorras",
      "Se construía enteramente con troncos de roble y barro"
    ],
    correcta: 1,
    explicacion: "La torre albarrana (del árabe 'al-barraní', la exterior) se sitúa exenta del lienzo de la muralla, conectada solo por un arco o puente fácil de destruir en caso de ser tomada, permitiendo hostigar a los atacantes por los flancos. Ejemplo cumbre: la Torre del Oro en Sevilla.",
    fuente: "Diccionario de Fortificaciones AEAC",
    castilloId: null,
    imagen: null,
    categoria: "arquitectura",
    dificultad: "media"
  },
  {
    id: "p14",
    enunciado: "¿Qué es una poterna en una fortaleza medieval?",
    opciones: [
      "El mecanismo de poleas que eleva el puente",
      "La cocina donde se preparaban los víveres de la guarnición",
      "Una puerta secundaria disimulada para salidas discretas o auxilio durante un asedio",
      "La bandera heráldica izada en lo alto de la torre"
    ],
    correcta: 2,
    explicacion: "La poterna es una puerta pequeña y discreta, situada generalmente en una zona abrupta o poco accesible de la muralla, utilizada para salidas nocturnas, enlace con mensajeros o evacuación de emergencia.",
    fuente: "Glosario de Términos Defensivos AEAC",
    castilloId: null,
    imagen: null,
    categoria: "arquitectura",
    dificultad: "media"
  },

  // --- 3. GEOGRAFÍA Y LOCALIZACIÓN ---
  {
    id: "p15",
    enunciado: "¿En qué comunidad autónoma se encuentra el célebre Palacio Real de Olite, obra cumbre del gótico civil navarro?",
    opciones: ["Aragón", "La Rioja", "País Vasco", "Comunidad Foral de Navarra"],
    correcta: 3,
    explicacion: "El Palacio Real de Olite se sitúa en Navarra. Fue sede de los reyes de Navarra y reformado espectacularmente por Carlos III 'el Noble' entre finales del siglo XIV y principios del XV.",
    fuente: "Gobierno de Navarra / AEAC",
    castilloId: "olite",
    imagen: "assets/images/olite.jpg",
    categoria: "geografia",
    dificultad: "facil"
  },
  {
    id: "p16",
    enunciado: "¿En qué provincia española se sitúa el Castillo de Belmonte, cuya planta pentagonal estrellada fue mandada erigir por el marqués de Villena?",
    opciones: ["Cuenca", "Toledo", "Ciudad Real", "Albacete"],
    correcta: 0,
    explicacion: "El Castillo de Belmonte se localiza en la provincia de Cuenca (Castilla-La Mancha). Su trazado estrellado es atribuido al maestro Juan Guas y al arquitecto Hanequín de Bruselas.",
    fuente: "Diputación Provincial de Cuenca / AEAC",
    castilloId: "belmonte",
    imagen: "assets/images/belmonte.jpg",
    categoria: "geografia",
    dificultad: "facil"
  },
  {
    id: "p17",
    enunciado: "¿A qué provincia andaluza pertenece el majestuoso Castillo de Almodóvar del Río, encaramado sobre un cerro junto al río Guadalquivir?",
    opciones: ["Sevilla", "Córdoba", "Jaén", "Granada"],
    correcta: 1,
    explicacion: "El Castillo de Almodóvar del Río se encuentra en la provincia de Córdoba. Es una fortaleza de origen árabe reconstruida en el siglo XIV por Pedro I de Castilla.",
    fuente: "Patrimonio Histórico de Andalucía / AEAC",
    castilloId: "almodovar",
    imagen: "assets/images/almodovar.jpg",
    categoria: "geografia",
    dificultad: "facil"
  },
  {
    id: "p18",
    enunciado: "¿En qué provincia castellana encontramos el 'buque pétreo' del Castillo de Peñafiel, que hoy alberga el Museo Provincial del Vino?",
    opciones: ["Burgos", "Palencia", "Valladolid", "Zamora"],
    correcta: 2,
    explicacion: "El Castillo de Peñafiel se alza en la provincia de Valladolid, dominando la confluencia de los valles del Duero, Duratón y Botijas.",
    fuente: "Diputación de Valladolid / AEAC",
    castilloId: "penafiel",
    imagen: "assets/images/penafiel.jpg",
    categoria: "geografia",
    dificultad: "facil"
  },
  {
    id: "p19",
    enunciado: "¿En qué localidad se encuentra el histórico Castillo de la Muela, custodiado por un icónico conjunto de doce molinos de viento manchegos?",
    opciones: ["Campo de Criptana (Ciudad Real)", "Alcázar de San Juan (Ciudad Real)", "Mota del Cuervo (Cuenca)", "Consuegra (Toledo)"],
    correcta: 3,
    explicacion: "El Castillo de la Muela preside el cerro Calderico en el municipio de Consuegra (Toledo), sede histórica de la Orden de San Juan de Jerusalén en Castilla.",
    fuente: "Turismo de Castilla-La Mancha / AEAC",
    castilloId: "consuegra",
    imagen: "assets/images/consuegra.jpg",
    categoria: "geografia",
    dificultad: "facil"
  },
  {
    id: "p20",
    enunciado: "¿Dónde se sitúa la Alcazaba de Almería, imponente fortaleza califal mandada fundar por el califa Abderramán III?",
    opciones: ["Almería (Andalucía)", "Málaga (Andalucía)", "Jaén (Andalucía)", "Algeciras (Andalucía)"],
    correcta: 0,
    explicacion: "La Alcazaba de Almería se levanta en la ciudad de Almería, sobre el cerro de San Cristóbal, protegiendo lo que fue el principal puerto comercial y naval del Califato de Córdoba.",
    fuente: "Conjunto Monumental de la Alcazaba de Almería / AEAC",
    castilloId: "almeria",
    imagen: "assets/images/almeria.jpg",
    categoria: "geografia",
    dificultad: "facil"
  },
  {
    id: "p21",
    enunciado: "¿En qué provincia castellana y leonesa se halla el Castillo de Ampudia, célebre por su escarpa defensiva y la colección arqueológica Fontaneda?",
    opciones: ["León", "Palencia", "Ávila", "Segovia"],
    correcta: 1,
    explicacion: "El Castillo de Ampudia se encuentra en la comarca de Tierra de Campos, en la provincia de Palencia. Es una joya de la arquitectura señorial del siglo XV.",
    fuente: "Patrimonio de Castilla y León / AEAC",
    castilloId: "ampudia",
    imagen: "assets/images/ampudia.jpg",
    categoria: "geografia",
    dificultad: "media"
  },
  {
    id: "p22",
    enunciado: "¿En qué provincia vasca podemos contemplar el pintoresco Castillo de Butrón, rodeado de robledales y con aspecto de castillo de cuento centroeuropeo?",
    opciones: ["Gipuzkoa", "Álava", "Bizkaia", "Navarra"],
    correcta: 2,
    explicacion: "El Castillo de Butrón se encuentra en el término municipal de Gatika, en la provincia de Bizkaia (País Vasco). Su aspecto romántico data de la reforma decimonónica del marqués de Cubas.",
    fuente: "Gobierno Vasco / AEAC",
    castilloId: "butron",
    imagen: "assets/images/butron.jpg",
    categoria: "geografia",
    dificultad: "facil"
  },

  // --- 4. CONTEXTO HISTÓRICO Y ÓRDENES MILITARES ---
  {
    id: "p23",
    enunciado: "¿A qué orden militar religiosa fue donado en 1178 el Castillo de Ponferrada para proteger a los peregrinos del Camino de Santiago?",
    opciones: ["Orden de Santiago", "Orden de Calatrava", "Orden de Alcántara", "Orden del Temple (Caballeros Templarios)"],
    correcta: 3,
    explicacion: "El rey Fernando II de León donó Ponferrada a los Caballeros Templarios en 1178. La orden fortificó el enclave con amplios lienzos de murallas y barbacanas para custodiar el paso jacobeo a través del Bierzo.",
    fuente: "Archivo Histórico Nacional / AEAC",
    castilloId: "ponferrada",
    imagen: "assets/images/ponferrada.jpg",
    categoria: "historia",
    dificultad: "media"
  },
  {
    id: "p24",
    enunciado: "¿Qué orden militar hispánica tuvo su sede principal y convento mayor en el sacro convento-castillo de Calatrava la Nueva?",
    opciones: ["Orden de Calatrava", "Orden de Montesa", "Orden de San Juan", "Orden del Santo Sepulcro"],
    correcta: 0,
    explicacion: "La Orden de Calatrava, primera orden militar autóctona fundada en Castilla en 1158 por Raimundo de Fitero, estableció su sede definitiva en Calatrava la Nueva (Aldea del Rey, Ciudad Real) tras la batalla de Las Navas de Tolosa.",
    fuente: "Catálogo Monumental de Castilla-La Mancha / AEAC",
    castilloId: null,
    imagen: null,
    categoria: "historia",
    dificultad: "media"
  },
  {
    id: "p25",
    enunciado: "¿En qué año se fundó la Asociación Española de Amigos de los Castillos (AEAC), reconocida entidad de Utilidad Pública dedicada a velar por las fortalezas de España?",
    opciones: ["1978", "1952", "1929", "1992"],
    correcta: 1,
    explicacion: "La AEAC fue fundada en el año 1952 por un grupo de entusiastas historiadores, arquitectos y amantes del patrimonio para frenar la ruina de los castillos españoles. En 1966 fue declarada Entidad de Utilidad Pública por el Estado.",
    fuente: "Sede de la AEAC en el Castillo de Villafuerte (Valladolid)",
    castilloId: "villafuerte",
    imagen: "assets/images/villafuerte.jpg",
    categoria: "historia",
    dificultad: "media"
  },
  {
    id: "p26",
    enunciado: "¿Qué famosa batalla tuvo lugar en 1097 bajo las murallas del Castillo de Consuegra, en la que perdió la vida el hijo del Cid Campeador?",
    opciones: [
      "Batalla de Las Navas de Tolosa",
      "Batalla de Simancas",
      "Batalla de Consuegra contra el ejército almorávide",
      "Batalla de Guadalete"
    ],
    correcta: 2,
    explicacion: "En la Batalla de Consuegra (15 de agosto de 1097), el rey Alfonso VI de León y Castilla fue derrotado por las tropas almorávides del emir Yusuf ibn Tasufin. En el combate murió Diego Rodríguez, único hijo varón del Cid Campeador.",
    fuente: "Crónica Najerense / Fuentes Históricas Medievales / AEAC",
    castilloId: "consuegra",
    imagen: "assets/images/consuegra.jpg",
    categoria: "historia",
    dificultad: "avanzada"
  },
  {
    id: "p27",
    enunciado: "¿Cuál de estas fortalezas ostenta el título de ser la fortaleza califal musulmana de mayor perímetro amurallado conservada en Europa (más de 1,2 km de muralla)?",
    opciones: ["Alcazaba de Mérida", "Castillo de Baños de la Encina", "Alcázar de Jerez", "Castillo de Gormaz (Soria)"],
    correcta: 3,
    explicacion: "La fortaleza califal de Gormaz (Soria), erigida en el año 965 por el general Galib bajo el mandato de al-Hakam II, cuenta con más de 1.200 metros de perímetro amurallado y 28 torres cuadradas.",
    fuente: "IPCE / Plan Nacional de Arquitectura Defensiva / AEAC",
    castilloId: null,
    imagen: null,
    categoria: "historia",
    dificultad: "media"
  },
  {
    id: "p28",
    enunciado: "¿Qué importante decreto estatal firmado en España en 1949 supuso un hito pionero en Europa para la protección integral de todos los castillos?",
    opciones: [
      "El Decreto de 22 de abril de 1949 sobre protección de los castillos españoles",
      "La Ley del Suelo de 1956",
      "El Real Decreto de Desamortización de Mendizábal",
      "La Carta de Atenas de Restauración"
    ],
    correcta: 0,
    explicacion: "El Decreto de 22 de abril de 1949 colocó bajo la salvaguarda del Estado todos los castillos de España con independencia de su estado de conservación, considerándolos 'Bienes de Interés Cultural' (BIC) protegidos por ley.",
    fuente: "Boletín Oficial del Estado (BOE) / AEAC",
    castilloId: null,
    imagen: null,
    categoria: "historia",
    dificultad: "avanzada"
  },

  // --- 5. CURIOSIDADES Y AFIRMACIONES HISTÓRICAS DOCUMENTADAS ---
  {
    id: "p29",
    enunciado: "¿Cuál de las siguientes afirmaciones sobre el Castillo de Baños de la Encina (Jaén), conocido como 'Burgalimar', es históricamente CORRECTA?",
    opciones: [
      "Fue mandado levantar por los Reyes Católicos tras la rendición del Reino de Granada en 1492",
      "Fue construido con muros de tapial califal en el año 968 d.C. y conserva casi íntegro su trazado original",
      "Fue edificado completamente en mármol blanco procedente de las canteras de Macael",
      "Fue un palacio renacentista diseñado por Juan de Herrera en el siglo XVI"
    ],
    correcta: 1,
    explicacion: "El Castillo de Burgalimar en Baños de la Encina data de 968 d.C. bajo el mandato del califa al-Hakam II. Está edificado en tapial de arcilla, cal y canto rodado y es una de las fortalezas musulmanas más antiguas de Europa.",
    fuente: "Catálogo Monumental de Andalucía / AEAC",
    castilloId: null,
    imagen: null,
    categoria: "curiosidad",
    dificultad: "avanzada"
  },
  {
    id: "p30",
    enunciado: "¿Por qué el Castillo de Peñafiel (Valladolid) tiene una forma tan alargada y estrecha que recuerda a la de un navío?",
    opciones: [
      "Porque fue proyectado por ingenieros navales venecianos para simbolizar la flota castellana",
      "Porque en la Edad Media el río Duero navegable cubría la totalidad del valle",
      "Porque se adaptó milimétricamente al relieve de una loma caliza estrecha y alargada",
      "Para permitir la salida rápida de carruajes a través de dos puertas opuestas"
    ],
    correcta: 2,
    explicacion: "La forma de 'buque' del Castillo de Peñafiel responde estrictamente a la topografía del terreno: una estrecha cuchilla caliza natural de 210 metros de longitud que dictó el perfil alargado de las murallas.",
    fuente: "IPCE / Estudios Topográficos Defensivos AEAC",
    castilloId: "penafiel",
    imagen: "assets/images/penafiel.jpg",
    categoria: "curiosidad",
    dificultad: "media"
  },
  {
    id: "p31",
    enunciado: "¿Qué castillo de la provincia de Guadalajara alberga en su interior el célebre Museo del 'Viaje a la Alcarria', dedicado a la novela de Camilo José Cela?",
    opciones: ["Castillo de Sigüenza", "Castillo de Jadraque", "Castillo de Zorita de los Canes", "Castillo de Torija"],
    correcta: 3,
    explicacion: "El Castillo de Torija (Guadalajara) aloja en las salas de su imponente torre del homenaje el primer museo mundial consagrado a un libro de viajes, creado en homenaje a Camilo José Cela.",
    fuente: "Diputación Provincial de Guadalajara / AEAC",
    castilloId: "torija",
    imagen: "assets/images/torija.jpg",
    categoria: "curiosidad",
    dificultad: "facil"
  },
  {
    id: "p32",
    enunciado: "¿En qué castillo medieval español se filmó en 1961 la célebre película épica 'El Cid' de Anthony Mann, con Charlton Heston y Sophia Loren?",
    opciones: ["Castillo de Peñíscola y Castillo de Belmonte", "Castillo de Simancas", "Castillo de Olite", "Castillo de Bellver"],
    correcta: 0,
    explicacion: "La superproducción de Hollywood 'El Cid' utilizó el Castillo de Peñíscola para ambientar la entrada triunfal en Valencia y la fortaleza de Belmonte (Cuenca) para el mítico torneo de Calahorra.",
    fuente: "Hemeroteca cinematográfica / AEAC",
    castilloId: "belmonte",
    imagen: "assets/images/belmonte.jpg",
    categoria: "curiosidad",
    dificultad: "media"
  },
  {
    id: "p33",
    enunciado: "¿Qué enorme fortaleza abaluartada del siglo XVIII situada en Figueres (Girona) es el monumento defensivo de mayores dimensiones de Cataluña?",
    opciones: ["Castillo de Montjuïc", "Castillo de San Fernando", "Castillo de Cardona", "Castillo de Hostalric"],
    correcta: 1,
    explicacion: "El Castillo de San Fernando de Figueres, construido entre 1753 y 1766, es la mayor fortaleza abaluartada del siglo XVIII de toda Europa, con una superficie de más de 32 hectáreas.",
    fuente: "Consorcio del Castillo de San Fernando / AEAC",
    castilloId: "san_fernando",
    imagen: "assets/images/san_fernando.jpg",
    categoria: "identificacion",
    dificultad: "media"
  },
  {
    id: "p34",
    enunciado: "¿Cuál de estos castillos roqueros se encuentra encaramado sobre un peñasco vertical que parece fundirse con su torre del homenaje en la comarca de Las Merindades (Burgos)?",
    opciones: ["Castillo de Medina de Pomar", "Castillo de Sotopalacios", "Castillo de los Duques de Frías", "Castillo de Muñatones"],
    correcta: 2,
    explicacion: "El Castillo de los Duques de Frías (Burgos) se alza sobre la peña rocosa de La Muela presidiendo la ciudad más pequeña de España y el vado defensivo del río Ebro.",
    fuente: "Patrimonio de Castilla y León / AEAC",
    castilloId: "frias",
    imagen: "assets/images/frias.jpg",
    categoria: "identificacion",
    dificultad: "facil"
  },
  {
    id: "p35",
    enunciado: "¿Qué castillo toledano fue el primer castillo histórico de España transformado en Parador Nacional de Turismo en el año 1930?",
    opciones: ["Castillo de Guadamur", "Castillo de Escalona", "Castillo de Malpica", "Castillo de Oropesa"],
    correcta: 3,
    explicacion: "El Castillo de Oropesa (Toledo), palacio-fortaleza de los Álvarez de Toledo condes de Oropesa, abrió sus puertas en 1930 como el primer parador alojado en un castillo monumental.",
    fuente: "Red de Paradores / AEAC",
    castilloId: "oropesa",
    imagen: "assets/images/oropesa.jpg",
    categoria: "curiosidad",
    dificultad: "media"
  },
  {
    id: "p36",
    enunciado: "¿Cuál es la función del foso seco que rodea fortalezas como las de Coca o Ampudia?",
    opciones: [
      "Impedir el acercamiento de arietes, catapultas y escalas, y evitar el socavamiento de muros mediante zapas subterráneas",
      "Criar carpas y peces para alimentar a la guarnición en verano",
      "Canalizar el barro procedente de los campos de cultivo",
      "Servir de basurero comunal para el pueblo adyacente"
    ],
    correcta: 0,
    explicacion: "El foso seco aumentaba drásticamente la altura efectiva de los muros y obligaba a los atacantes a descender a campo descubierto bajo el fuego cruzado de aspilleras y almenas, frustrando la aproximación de maquinaria de asedio.",
    fuente: "Manual de Poliorcética Medieval AEAC",
    castilloId: null,
    imagen: null,
    categoria: "arquitectura",
    dificultad: "facil"
  }
];

export default PREGUNTAS;
