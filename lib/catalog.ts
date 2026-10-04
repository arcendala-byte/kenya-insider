export type Money = { kes: number; usd: number };
export type Experience = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  destination: string;
  duration: string;
  price: Money;
  description: string;
  image: string;
  bestFor: string;
  highlights: string[];
  included: string[];
};

export type Destination = {
  slug: string; name: string; region: string; image: string; description: string; bestFor: string;
  thingsToDo: string[]; bestTime: string; idealDuration: string;
};

// Development seed content. Replace these records with Supabase queries once the production schema is populated.
export const experiences: Experience[] = [
  { id: 'nairobi-insider', slug: 'nairobi-insider', title: 'Nairobi Insider Experience', category: 'City', destination: 'Nairobi', duration: 'Full day', price: { kes: 12500, usd: 100 }, description: 'A locally informed day through the city: neighbourhoods, independent makers, food, art and the stories behind them.', image: '/images/categories/city/city.avif', bestFor: 'First-time visitors, friends, business travelers', highlights: ['A flexible route shaped around your interests', 'Local food and neighbourhood stops', 'Culture, design and city perspective'], included: ['Experience coordination', 'Local host', 'Selected activities'] },
  { slug: 'nairobi-wildlife', title: 'Nairobi Wildlife Experience', category: 'Wildlife', destination: 'Nairobi', duration: 'Half or full day', price: { kes: 9500, usd: 76 }, description: 'See the wild edge of Kenya’s capital with time for wildlife, conservation and a gentler city rhythm.', image: '/images/wildlife/home_feature1.jpg', bestFor: 'Wildlife lovers, families, photographers', highlights: ['Wildlife-focused day planning', 'Flexible pickup guidance', 'Time for conservation stories'], included: ['Experience coordination', 'Guide', 'Selected activities'] },
  { slug: 'nairobi-food-culture', title: 'Nairobi Food & Culture Experience', category: 'Food', destination: 'Nairobi', duration: '5-6 hours', price: { kes: 10800, usd: 86 }, description: 'Follow Kenya through its flavours, markets and everyday rituals, from a morning coffee to a memorable shared meal.', image: '/images/wildlife/home_feature2.jpg', bestFor: 'Food lovers, couples, curious travelers', highlights: ['Thoughtful tasting stops', 'Market and culture context', 'Vegetarian-friendly planning available'], included: ['Local host', 'Selected tastings', 'Experience coordination'] },
  { slug: 'maasai-mara-safari', title: 'Maasai Mara Safari Experience', category: 'Wildlife', destination: 'Maasai Mara', duration: '2-3 days', price: { kes: 48000, usd: 384 }, description: 'A carefully paced safari designed around game drives, wide landscapes and time to take in the reserve properly.', image: '/images/experiences_hero.jpg', bestFor: 'Wildlife lovers, couples, families', highlights: ['Game-drive planning', 'Photography opportunities', 'Flexible itinerary discussion'], included: ['Experience coordination', 'Selected activities', 'Local guide where applicable'] },
  { slug: 'naivasha-weekend-escape', title: 'Naivasha Weekend Escape', category: 'Nature', destination: 'Naivasha', duration: '2 days', price: { kes: 24000, usd: 192 }, description: 'Trade the city for lake air, Rift Valley scenery and an unhurried weekend built around the outdoors.', image: '/images/wildlife/home_1.jpg', bestFor: 'Weekend travelers, couples, friends', highlights: ['Lake and landscape time', 'Relaxed weekend pacing', 'Optional active add-ons'], included: ['Experience coordination', 'Selected activities', 'Local recommendations'] },
  { slug: 'mount-kenya-adventure', title: 'Mount Kenya Adventure', category: 'Adventure', destination: 'Mount Kenya', duration: '3 days', price: { kes: 39000, usd: 312 }, description: 'A mountain escape for travelers who want fresh air, elevation and a route matched to their confidence and time.', image: '/images/wildlife/experience1.jpg', bestFor: 'Active travelers, nature lovers, small groups', highlights: ['Route guidance', 'Scenic trail time', 'Preparation support'], included: ['Experience coordination', 'Local guide where applicable', 'Selected activities'] },
  { slug: 'diani-beach-escape', title: 'Diani Beach Escape', category: 'Beach', destination: 'Diani', duration: '3 days', price: { kes: 36000, usd: 288 }, description: 'Slow down on the coast with room for clear water, good food and a beach stay that feels genuinely restorative.', image: '/hero_placeholder.jpg', bestFor: 'Couples, friends, relaxation seekers', highlights: ['Coast-first itinerary', 'Flexible dining ideas', 'Optional water activities'], included: ['Experience coordination', 'Selected activities', 'Local recommendations'] },
  { slug: 'kenya-custom-experience', title: 'Kenya Custom Experience', category: 'Custom', destination: 'Across Kenya', duration: 'Designed around you', price: { kes: 0, usd: 0 }, description: 'Start with a conversation, then let us shape an experience around your dates, people and kind of Kenya.', image: '/images/hero/zebra-kenya.jpg', bestFor: 'Travelers with a specific idea or multi-stop trip', highlights: ['Personal recommendations', 'Multi-destination planning', 'Concierge-style support options'], included: ['Planning consultation', 'Curated recommendations', 'Coordination guidance'] },
];

export const destinations: Destination[] = [
  { slug: 'nairobi', name: 'Nairobi', region: 'Central Kenya', image: '/images/destinations/nairobi.jpg', description: 'Kenya’s lively capital pairs city energy with wildlife, art, food and memorable local encounters.', bestFor: 'First-time visitors, food, culture, photography', thingsToDo: ['Explore city food and coffee', 'Visit art and design spaces', 'Spend time near Nairobi National Park'], bestTime: 'Year-round, shaped around your plans', idealDuration: '2-3 days' },
  { slug: 'maasai-mara', name: 'Maasai Mara', region: 'Southwest Kenya', image: '/images/destinations/masai_mara.jpeg', description: 'Open grassland, remarkable wildlife and the kind of horizon that makes a safari feel expansive.', bestFor: 'Wildlife, couples, families', thingsToDo: ['Plan game drives', 'Watch sunrise over the reserve', 'Pair with a longer Kenya route'], bestTime: 'Seasonality varies; plan with local guidance', idealDuration: '2-3 days' },
  { slug: 'amboseli', name: 'Amboseli', region: 'Southern Kenya', image: '/images/destinations/Amboseli.jpg', description: 'A wildlife destination known for expansive views, elephant country and a slower, landscape-led pace.', bestFor: 'Wildlife, photography, quiet escapes', thingsToDo: ['Wildlife viewing', 'Landscape photography', 'Build a southern circuit'], bestTime: 'Seasonality varies; plan with local guidance', idealDuration: '2 days' },
  { slug: 'naivasha', name: 'Naivasha', region: 'Great Rift Valley', image: '/images/destinations/naivasha.webp', description: 'Lake air, volcanic landscapes and a refreshing change of pace within easy reach of Nairobi.', bestFor: 'Nature, weekend trips, couples', thingsToDo: ['Spend time by the lake', 'Explore Rift Valley scenery', 'Add an outdoor activity'], bestTime: 'Year-round for a short escape', idealDuration: '1-2 days' },
  { slug: 'diani', name: 'Diani', region: 'South Coast', image: '/images/destinations/diani.jpeg', description: 'A stretch of Indian Ocean coast for beach days, water time and long, unhurried evenings.', bestFor: 'Beach, relaxation, couples', thingsToDo: ['Enjoy the coast', 'Try a water activity', 'Explore local dining'], bestTime: 'Plan around your preferred beach season', idealDuration: '3-4 days' },
  { slug: 'mombasa', name: 'Mombasa', region: 'Coast', image: '/images/destinations/momabasa.webp', description: 'A historic coastal city with Swahili influences, rich food culture and an easy route to the sea.', bestFor: 'Culture, food, coast', thingsToDo: ['Explore Old Town', 'Discover coastal cooking', 'Combine city and beach'], bestTime: 'Year-round, with seasonal planning', idealDuration: '2-3 days' },
  { slug: 'lamu', name: 'Lamu', region: 'North Coast', image: '/images/destinations/lamu.jpg', description: 'A slower coastal island rhythm shaped by heritage, dhow sails and winding historic streets.', bestFor: 'Culture, beach, slow travel', thingsToDo: ['Explore the old town', 'Spend time on the water', 'Plan a restful coastal stay'], bestTime: 'Seasonality varies; ask for guidance', idealDuration: '3 days' },
  { slug: 'watamu', name: 'Watamu', region: 'North Coast', image: '/images/destinations/watamu.jpeg', description: 'A relaxed beach base for ocean days, marine life and easy-going coastal discoveries.', bestFor: 'Beach, families, nature', thingsToDo: ['Explore the shoreline', 'Consider marine activities', 'Enjoy coastal dining'], bestTime: 'Plan around your preferred beach season', idealDuration: '3 days' },
];

export const categories = ['Wildlife', 'Nature', 'Adventure', 'Food', 'Culture', 'Photography', 'Beach', 'City', 'Luxury', 'Weekend Escapes'];

// Keep image assignment next to catalogue data rather than scattering paths through cards.
export const experienceImages: Record<string, string> = {
  'nairobi-insider': '/images/categories/city/city.avif',
  'nairobi-wildlife': '/images/categories/wildlife/A-herd-of-elephants-in-Amboseli-NP-209601368201897.jpg',
  'nairobi-food-culture': '/images/categories/food/iz9xbiy5yz6g1.jpeg',
  'maasai-mara-safari': '/images/categories/wildlife/masai-mara-wildlife.jpg',
  'naivasha-weekend-escape': '/images/categories/nature/Mt.-Kenya-Exhibition-37-scaled.jpg',
  'mount-kenya-adventure': '/images/categories/adventure/mount-kenya-getty.webp',
  'diani-beach-escape': '/images/categories/beach/bofa-beach-kenya-scaled.webp',
  'kenya-custom-experience': '/images/categories/luxury/emara.jpeg',
};

// Maintain the legacy `image` field for existing consumers while keeping one source of truth.
experiences.forEach((experience) => {
  experience.image = experienceImages[experience.slug] ?? experience.image;
});

export const categoryTranslations: Record<string, string> = {
  Wildlife: 'Faune',
  Nature: 'Nature',
  Adventure: 'Aventure',
  Food: 'Gastronomie',
  Culture: 'Culture',
  Photography: 'Photographie',
  Beach: 'Plage',
  City: 'Ville',
  Luxury: 'Luxe',
  'Weekend Escapes': 'Escapades week-end',
};

export const destinationTranslations: Record<string, {
  name: string;
  region: string;
  description: string;
  bestFor: string;
  thingsToDo: string[];
  bestTime: string;
  idealDuration: string;
}> = {
  nairobi: {
    name: 'Nairobi',
    region: 'Kenya central',
    description: 'La capitale dynamique du Kenya allie l’énergie urbaine à la faune, l’art, la gastronomie et des rencontres locales authentiques.',
    bestFor: 'Première visite, gastronomie, culture, photographie',
    thingsToDo: ['Explorer la scène culinaire et le café de la ville', 'Visiter des espaces d’art et de création', 'Passer du temps près du parc national de Nairobi'],
    bestTime: 'Toute l’année, selon vos projets',
    idealDuration: '2 à 3 jours',
  },
  'maasai-mara': {
    name: 'Maasai Mara',
    region: 'Sud-ouest du Kenya',
    description: 'De vastes plaines herbeuses, une faune extraordinaire et des horizons infinis qui confèrent au safari toute sa grandeur.',
    bestFor: 'Faune, couples, familles',
    thingsToDo: ['Planifier des safaris animaliers', 'Admirer le lever de soleil sur la réserve', 'Associer à un plus grand circuit au Kenya'],
    bestTime: 'La saisonnalité varie ; planifiez avec un accompagnement local',
    idealDuration: '2 à 3 jours',
  },
  amboseli: {
    name: 'Amboseli',
    region: 'Sud du Kenya',
    description: 'Une destination réputée pour ses panoramas grandioses, le pays des éléphants et un rythme paisible au cœur des paysages.',
    bestFor: 'Faune, photographie, escapades tranquilles',
    thingsToDo: ['Observation de la faune sauvage', 'Photographie de paysages', 'Créer un circuit dans le sud'],
    bestTime: 'La saisonnalité varie ; demandez conseil',
    idealDuration: '2 jours',
  },
  naivasha: {
    name: 'Naivasha',
    region: 'Vallée du Grand Rift',
    description: 'L’air revigorant du lac, des paysages volcaniques et un dépaysement ressourçant à proximité immédiate de Nairobi.',
    bestFor: 'Nature, escapades de week-end, couples',
    thingsToDo: ['Se détendre au bord du lac', 'Explorer les paysages de la vallée du Rift', 'Ajouter une activité de plein air'],
    bestTime: 'Toute l’année pour une courte escapade',
    idealDuration: '1 à 2 jours',
  },
  diani: {
    name: 'Diani',
    region: 'Côte sud',
    description: 'Une étendue de l’océan Indien parfaite pour les journées plage, les activités nautiques et de longues soirées détendues.',
    bestFor: 'Plage, détente, couples',
    thingsToDo: ['Profiter de la côte', 'Essayer une activité nautique', 'Découvrir la gastronomie locale'],
    bestTime: 'À planifier selon votre saison balnéaire préférée',
    idealDuration: '3 à 4 jours',
  },
  mombasa: {
    name: 'Mombasa',
    region: 'Côte',
    description: 'Une ville côtière historique aux influences swahilies, riche d’une belle culture culinaire et ouverte sur la mer.',
    bestFor: 'Culture, gastronomie, littoral',
    thingsToDo: ['Explorer la vieille ville', 'Découvrir la cuisine côtière', 'Combiner ville et plage'],
    bestTime: 'Toute l’année avec planification saisonnière',
    idealDuration: '2 à 3 jours',
  },
  lamu: {
    name: 'Lamu',
    region: 'Côte nord',
    description: 'Le rythme insulaire paisible de la côte, façonné par le patrimoine, les boutres traditionnels et les ruelles historiques.',
    bestFor: 'Culture, plage, slow travel',
    thingsToDo: ['Visiter la vieille ville', 'Naviguer en boutre sur l’eau', 'Prévoir un séjour côtier reposant'],
    bestTime: 'La saisonnalité varie ; demandez des conseils',
    idealDuration: '3 jours',
  },
  watamu: {
    name: 'Watamu',
    region: 'Côte nord',
    description: 'Un havre balnéaire relaxant pour profiter de l’océan, des réserves marines et de découvertes côtières décontractées.',
    bestFor: 'Plage, familles, nature',
    thingsToDo: ['Explorer le littoral', 'Découvrir les activités marines', 'Savourer la cuisine côtière'],
    bestTime: 'À planifier selon votre saison balnéaire préférée',
    idealDuration: '3 jours',
  },
};

export const experienceTranslations: Record<string, {
  title: string;
  category: string;
  duration: string;
  price: string;
  description: string;
}> = {
  'nairobi-insider': {
    title: 'Expérience Nairobi Insider',
    category: 'Ville',
    duration: 'Journée entière',
    price: 'KES 12 500',
    description: 'Une journée authentique à travers la ville : quartiers typiques, créateurs indépendants, saveurs locales, art et histoire urbaine.',
  },
  'nairobi-wildlife': {
    title: 'Expérience faune sauvage de Nairobi',
    category: 'Faune',
    duration: 'Demi-journée ou journée',
    price: 'KES 9 500',
    description: 'Découvrez la dimension sauvage de la capitale kenyane avec du temps pour la faune, la préservation de la nature et un rythme citadin plus doux.',
  },
  'nairobi-food-culture': {
    title: 'Expérience gastronomie et culture à Nairobi',
    category: 'Gastronomie',
    duration: '5 à 6 heures',
    price: 'KES 10 800',
    description: 'Parcourez le Kenya à travers ses saveurs, ses marchés et ses rituels quotidiens, d’un café du matin à un repas partagé mémorable.',
  },
  'maasai-mara-safari': {
    title: 'Safari d’exception au Maasai Mara',
    category: 'Faune',
    duration: '2 à 3 jours',
    price: 'KES 48 000',
    description: 'Un safari au rythme idéal conçu autour de sorties animalières, d’horizons infinis et du temps nécessaire pour s’imprégner de la réserve.',
  },
  'naivasha-weekend-escape': {
    title: 'Escapade week-end à Naivasha',
    category: 'Nature',
    duration: '2 jours',
    price: 'KES 24 000',
    description: 'Quittez la ville pour respirer l’air du lac, contempler la vallée du Rift et savourer un week-end paisible au grand air.',
  },
  'mount-kenya-adventure': {
    title: 'Aventure sur le Mont Kenya',
    category: 'Aventure',
    duration: '3 jours',
    price: 'KES 39 000',
    description: 'Une escapade en altitude pour les voyageurs en quête d’air frais, de panoramas alpins et d’un itinéraire adapté à leur niveau et calendrier.',
  },
  'diani-beach-escape': {
    title: 'Séjour détente sur la plage de Diani',
    category: 'Plage',
    duration: '3 jours',
    price: 'KES 36 000',
    description: 'Ralentissez le pas sur le littoral avec des eaux cristallines, une excellente table et un séjour balnéaire véritablement ressourçant.',
  },
  'kenya-custom-experience': {
    title: 'Expérience personnalisée sur mesure',
    category: 'Luxe',
    duration: 'Conçu sur mesure pour vous',
    price: 'Sur demande',
    description: 'Commencez par un échange avec nos experts locaux pour concevoir une aventure façonnée autour de vos dates, de vos proches et de vos envies.',
  },
};

