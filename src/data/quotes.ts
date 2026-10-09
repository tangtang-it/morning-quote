export interface QuoteItem {
  id: string;
  category: 'inspirational' | 'love' | 'friends' | 'monday' | 'blessings' | 'short' | 'woolly' | 'cafe' | 'floral' | 'horizon';
  quote: string;
  author?: string;
}

export interface LocaleQuotes {
  categories: { key: QuoteItem['category']; label: string }[];
  quotes: QuoteItem[];
}

export const QUOTES_DATA: Record<'en' | 'es' | 'pt', LocaleQuotes> = {
  en: {
    categories: [
      { key: 'love', label: '❤️ Love & Romance' },
      { key: 'friends', label: '🤝 For Friends' },
      { key: 'short', label: '⚡ Short & Sweet' },
      { key: 'inspirational', label: '✨ Inspirational' },
      { key: 'horizon', label: '🌅 Golden Horizon' },
      { key: 'cafe', label: '☕ Cozy Cafe' },
      { key: 'woolly', label: '🧸 Woolly Hugs' },
      { key: 'floral', label: '🌸 Sunlit Florals' },
      { key: 'monday', label: '💼 Monday Motivation' },
      { key: 'blessings', label: '🕊️ Blessings & Peace' },
    ],
    quotes: [
      {
            "id": "horizon-en-1",
            "category": "horizon",
            "quote": "Rise, reset, and conquer today. ⚡",
            "author": "Monday Power"
      },
      {
            "id": "horizon-en-2",
            "category": "horizon",
            "quote": "A new week, a clean slate, and infinite power. 🌅",
            "author": "Dawn Energy"
      },
      {
            "id": "horizon-en-3",
            "category": "horizon",
            "quote": "Let your courage shine brighter than the morning dawn. 🌄",
            "author": "Mountain Peak"
      },
      {
            "id": "horizon-en-4",
            "category": "horizon",
            "quote": "Push forward with purpose; today is yours to shape. 🛣️",
            "author": "Unstoppable Drive"
      },
      {
            "id": "horizon-en-5",
            "category": "horizon",
            "quote": "Great things never came from comfort zones. Rise up! ⛰️",
            "author": "Golden Grit"
      },
      {
            "id": "horizon-en-6",
            "category": "horizon",
            "quote": "Breathe in the golden dawn, breathe out the doubt. ✨",
            "author": "Quiet Strength"
      },
      {
            "id": "horizon-en-7",
            "category": "horizon",
            "quote": "Your potential is as boundless as the open horizon. 🌊",
            "author": "Ocean Dawn"
      },
      {
            "id": "horizon-en-8",
            "category": "horizon",
            "quote": "Monday is not an obstacle; it is your launchpad. 🚀",
            "author": "Weekly Launch"
      },
      {
            "id": "floral-en-1",
            "category": "floral",
            "quote": "May your day bloom with happiness, grace, and peace. 🌸",
            "author": "Morning Blossom"
      },
      {
            "id": "floral-en-2",
            "category": "floral",
            "quote": "Sending you morning sunshine and fresh petals of joy. ✨",
            "author": "Sunlit Garden"
      },
      {
            "id": "floral-en-3",
            "category": "floral",
            "quote": "Bloom where you are planted and shine brightly today. 🌻",
            "author": "Golden Meadow"
      },
      {
            "id": "floral-en-4",
            "category": "floral",
            "quote": "Like a flower reaching for dawn, embrace today with open arms. 🌷",
            "author": "Dawn Whisper"
      },
      {
            "id": "floral-en-5",
            "category": "floral",
            "quote": "May your heart be as light as a flower petal in the morning breeze. 🌼",
            "author": "Gentle Daisy"
      },
      {
            "id": "floral-en-6",
            "category": "floral",
            "quote": "A gentle reminder: You are blossoming in your own beautiful time. 🌺",
            "author": "Quiet Grace"
      },
      {
            "id": "floral-en-7",
            "category": "floral",
            "quote": "Fresh blooms on the table, peace in the soul, and hope in the heart. 🪻",
            "author": "Provence Serenity"
      },
      {
            "id": "floral-en-8",
            "category": "floral",
            "quote": "Wishing you a fragrant and delightful morning filled with smiles. 💐",
            "author": "Sweet Petals"
      },
      {
            "id": "cafe-en-1",
            "category": "cafe",
            "quote": "First coffee, then the world. ☕",
            "author": "Morning Ritual"
      },
      {
            "id": "cafe-en-2",
            "category": "cafe",
            "quote": "Sip slowly, breathe deeply, and live gently today. ✨",
            "author": "Artisan Mindset"
      },
      {
            "id": "cafe-en-3",
            "category": "cafe",
            "quote": "A warm cup in hand, peace in the heart, and sunlight on the table. 🥐",
            "author": "Cozy Table"
      },
      {
            "id": "cafe-en-4",
            "category": "cafe",
            "quote": "Start your morning with good thoughts and even better coffee. ☕",
            "author": "Daily Brew"
      },
      {
            "id": "cafe-en-5",
            "category": "cafe",
            "quote": "Life happens, but fresh coffee and warm croissants always help. 🥐",
            "author": "Parisian Morning"
      },
      {
            "id": "cafe-en-6",
            "category": "cafe",
            "quote": "Nourish your morning, feed your soul, and savor every bite. 🥑",
            "author": "Morning Wellness"
      },
      {
            "id": "cafe-en-7",
            "category": "cafe",
            "quote": "May your coffee be strong, your breakfast sweet, and your day bright. 🥞",
            "author": "Sunday Bliss"
      },
      {
            "id": "cafe-en-8",
            "category": "cafe",
            "quote": "Pour a little extra kindness into your cup this morning. ☕",
            "author": "Warm Thoughts"
      },
      {
            "id": "woolly-en-1",
            "category": "woolly",
            "quote": "Sending you a warm morning hug and a fresh cup of gentle joy. 🧸",
            "author": "Woolly Bear"
      },
      {
            "id": "woolly-en-2",
            "category": "woolly",
            "quote": "Hop into today with a soft smile and blooming hope. 🐰",
            "author": "Velvet Bunny"
      },
      {
            "id": "woolly-en-3",
            "category": "woolly",
            "quote": "Stretch out, soak in the sun, and take it slow this morning. 🐱",
            "author": "Sunny Kitten"
      },
      {
            "id": "woolly-en-4",
            "category": "woolly",
            "quote": "A wagging tail, golden sunshine, and endless good vibes ahead! 🐶",
            "author": "Little Shiba"
      },
      {
            "id": "woolly-en-5",
            "category": "woolly",
            "quote": "You are otter-ly amazing! Float through today with peace. 🦦",
            "author": "Plush Otter"
      },
      {
            "id": "woolly-koala-6",
            "category": "woolly",
            "quote": "Wrap yourself in morning kindness and cozy dreams. 🐨",
            "author": "Drowsy Koala"
      },
      {
            "id": "woolly-en-7",
            "category": "woolly",
            "quote": "Today's forecast: 100% chance of soft hugs and sweet moments. 🧸",
            "author": "Morning Fluff"
      },
      {
            "id": "woolly-en-8",
            "category": "woolly",
            "quote": "Pause, breathe, and let today be as soft as morning light. ✨",
            "author": "Quiet Whispers"
      },
      {
            "id": "en-1",
            "category": "inspirational",
            "quote": "Every sunrise is an invitation to brighten someone’s day and build the life you dream of.",
            "author": "Morning Whisper"
      },
      {
            "id": "en-2",
            "category": "inspirational",
            "quote": "Opportunities are like sunrises. If you wait too long, you miss them. Step forward with courage.",
            "author": "William Arthur Ward"
      },
      {
            "id": "en-3",
            "category": "inspirational",
            "quote": "Today is not just another day, but a fresh chance to achieve what you couldn’t yesterday.",
            "author": "Daily Wisdom"
      },
      {
            "id": "en-4",
            "category": "inspirational",
            "quote": "Write it on your heart that every day is the best day in the year.",
            "author": "Ralph Waldo Emerson"
      },
      {
            "id": "en-5",
            "category": "inspirational",
            "quote": "The breeze at dawn has secrets to tell you. Don't go back to sleep.",
            "author": "Rumi"
      },
      {
            "id": "en-6",
            "category": "inspirational",
            "quote": "With the new day comes new strength and new thoughts.",
            "author": "Eleanor Roosevelt"
      },
      {
            "id": "en-7",
            "category": "inspirational",
            "quote": "Every morning you have two choices: continue to sleep with your dreams, or wake up and chase them.",
            "author": "Carmelo Anthony"
      },
      {
            "id": "en-8",
            "category": "inspirational",
            "quote": "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love.",
            "author": "Marcus Aurelius"
      },
      {
            "id": "en-9",
            "category": "inspirational",
            "quote": "Believe you can and you’re halfway there. Let this morning mark your new summit.",
            "author": "Theodore Roosevelt"
      },
      {
            "id": "en-10",
            "category": "inspirational",
            "quote": "Do not wait for extraordinary circumstances to do good actions; try to use ordinary situations.",
            "author": "Jean Paul"
      },
      {
            "id": "en-11",
            "category": "inspirational",
            "quote": "Your imagination is your preview of life’s coming attractions. Make today extraordinary.",
            "author": "Albert Einstein"
      },
      {
            "id": "en-12",
            "category": "inspirational",
            "quote": "Light tomorrow with today. Take one bold step into the morning glow.",
            "author": "Elizabeth Barrett Browning"
      },
      {
            "id": "en-13",
            "category": "love",
            "quote": "Waking up knowing you are in my life makes every morning golden. Good morning, my favorite thought.",
            "author": "Endless Love"
      },
      {
            "id": "en-14",
            "category": "love",
            "quote": "You are the warmth of my morning sun and the quiet calm of my twilight. Have a beautiful day.",
            "author": "Pure Affection"
      },
      {
            "id": "en-15",
            "category": "love",
            "quote": "Every morning is a masterpiece because I get to wake up loving you more than yesterday.",
            "author": "Forever Yours"
      },
      {
            "id": "en-16",
            "category": "love",
            "quote": "If I had a flower for every time I thought of you this morning, I could walk through my garden forever.",
            "author": "Alfred Tennyson"
      },
      {
            "id": "en-17",
            "category": "love",
            "quote": "The best part of my morning is sending you a smile across the miles. Good morning, sweetheart.",
            "author": "Heartfelt Note"
      },
      {
            "id": "en-18",
            "category": "love",
            "quote": "My mornings are brighter, warmer, and sweeter simply because you are in my world.",
            "author": "Gentle Dawn"
      },
      {
            "id": "en-19",
            "category": "love",
            "quote": "You are the first ray of sunshine that warms my heart every morning. Wishing you a day full of joy.",
            "author": "True Romance"
      },
      {
            "id": "en-20",
            "category": "love",
            "quote": "Good morning my love. Remember that you are cherished beyond all measure today.",
            "author": "Soulful Murmurs"
      },
      {
            "id": "en-21",
            "category": "friends",
            "quote": "Good morning to a friend who always brings laughter to my days. Go make today unforgettable!",
            "author": "True Friendship"
      },
      {
            "id": "en-22",
            "category": "friends",
            "quote": "Coffee tastes better, work feels lighter, and mornings are brighter with a friend like you.",
            "author": "Warm Companion"
      },
      {
            "id": "en-23",
            "category": "friends",
            "quote": "May your coffee be strong, your commute be easy, and your day be filled with victories, my friend.",
            "author": "Cheering Squad"
      },
      {
            "id": "en-24",
            "category": "friends",
            "quote": "A true friend is someone who thinks that you are a good egg even though he knows that you are slightly cracked.",
            "author": "Bernard Meltzer"
      },
      {
            "id": "en-25",
            "category": "friends",
            "quote": "Sending you sunshine, warm hugs, and positive energy for a truly productive day ahead.",
            "author": "Kindred Spirit"
      },
      {
            "id": "en-26",
            "category": "friends",
            "quote": "Count your age by friends, not years. Count your life by smiles, not tears. Have a fantastic morning!",
            "author": "John Lennon"
      },
      {
            "id": "en-27",
            "category": "friends",
            "quote": "Good morning! Just a quick reminder that you are capable of tackling anything that comes your way.",
            "author": "Unshakable Bond"
      },
      {
            "id": "en-28",
            "category": "friends",
            "quote": "Here is to another day of laughing at our own jokes and keeping each other sane. Have an awesome morning!",
            "author": "Best Pals"
      },
      {
            "id": "en-29",
            "category": "monday",
            "quote": "Monday is a blank page in your 365-page book. Write a powerful, inspiring first chapter.",
            "author": "Weekly Fuel"
      },
      {
            "id": "en-30",
            "category": "monday",
            "quote": "Don't let Monday steal your peace. Treat it as the launchpad for your greatest triumphs.",
            "author": "Momentum Mindset"
      },
      {
            "id": "en-31",
            "category": "monday",
            "quote": "Mondays are the start of the work week which offer new beginnings 52 times a year!",
            "author": "David Dweck"
      },
      {
            "id": "en-32",
            "category": "monday",
            "quote": "Your Monday morning thoughts set the tone for your whole week. See yourself becoming stronger.",
            "author": "Germany Kent"
      },
      {
            "id": "en-33",
            "category": "monday",
            "quote": "New Monday. New week. New goals. Step out with purpose and conquer the day.",
            "author": "Grit & Grace"
      },
      {
            "id": "en-34",
            "category": "monday",
            "quote": "It is not the mountain we conquer, but ourselves. Take on this Monday with fearless resolve.",
            "author": "Sir Edmund Hillary"
      },
      {
            "id": "en-35",
            "category": "monday",
            "quote": "Start this Monday with a positive mindset, a grateful heart, and a cup of ambition.",
            "author": "Morning Driver"
      },
      {
            "id": "en-36",
            "category": "monday",
            "quote": "Wake up with determination, go to bed with satisfaction. Make this week count from day one.",
            "author": "Weekly Catalyst"
      },
      {
            "id": "en-37",
            "category": "blessings",
            "quote": "May your morning be peaceful, your heart be light, and your day be guarded by grace.",
            "author": "Morning Grace"
      },
      {
            "id": "en-38",
            "category": "blessings",
            "quote": "May peace surround your home, wisdom guide your steps, and gratitude fill your soul today.",
            "author": "Serenity Note"
      },
      {
            "id": "en-39",
            "category": "blessings",
            "quote": "Every morning brings fresh mercies. May you walk through today enveloped in peace and harmony.",
            "author": "Quiet Solace"
      },
      {
            "id": "en-40",
            "category": "blessings",
            "quote": "May the road rise up to meet you. May the wind be always at your back. Have a blessed morning.",
            "author": "Irish Blessing"
      },
      {
            "id": "en-41",
            "category": "blessings",
            "quote": "Breathe in the calm of early dawn. Let go of yesterday's worries and receive today's blessing.",
            "author": "Still Waters"
      },
      {
            "id": "en-42",
            "category": "blessings",
            "quote": "May your heart find peace in the quiet moments of this morning and strength throughout the day.",
            "author": "Sacred Morning"
      },
      {
            "id": "en-43",
            "category": "blessings",
            "quote": "Blessings upon your day: for joy in simple things, love in every encounter, and rest in your soul.",
            "author": "Gentle Horizon"
      },
      {
            "id": "en-44",
            "category": "blessings",
            "quote": "May hope brighten your morning, faith strengthen your noon, and peace crown your evening.",
            "author": "Tranquil Prayer"
      },
      {
            "id": "en-45",
            "category": "short",
            "quote": "Rise, shine, and let your brilliance illuminate the world.",
            "author": "Dawn Radiance"
      },
      {
            "id": "en-46",
            "category": "short",
            "quote": "Smile in the mirror. Do that every morning and you'll start to see a big difference.",
            "author": "Yoko Ono"
      },
      {
            "id": "en-47",
            "category": "short",
            "quote": "Wake up, drink coffee, be awesome, repeat.",
            "author": "Daily Motto"
      },
      {
            "id": "en-48",
            "category": "short",
            "quote": "Hello, gorgeous world! Today is filled with brand new possibilities.",
            "author": "Spark of Life"
      },
      {
            "id": "en-49",
            "category": "short",
            "quote": "Breathe. Smile. Start fresh today.",
            "author": "Mindful Breath"
      },
      {
            "id": "en-50",
            "category": "short",
            "quote": "Make each day your masterpiece.",
            "author": "John Wooden"
      },
      {
            "id": "en-51",
            "category": "short",
            "quote": "Sun up. Spirits up. Let's make magic.",
            "author": "Morning Vibe"
      },
      {
            "id": "en-52",
            "category": "short",
            "quote": "Good morning! Peace in mind, joy in heart, fire in spirit.",
            "author": "Golden Hour"
      }
]
  },
  es: {
    categories: [
      { key: 'horizon', label: '🌅 Amanecer Dorado' },
      { key: 'woolly', label: '🧸 Abrazos Suaves' },
      { key: 'cafe', label: '☕ Café & Desayuno' },
      { key: 'floral', label: '🌸 Flores de Mañana' },
      { key: 'inspirational', label: 'Inspiración' },
      { key: 'love', label: 'Amor y Romance' },
      { key: 'friends', label: 'Para Amigos' },
      { key: 'monday', label: 'Lunes Motivador' },
      { key: 'blessings', label: 'Bendiciones y Paz' },
      { key: 'short', label: 'Cortas y Bonitas' },
    ],
    quotes: [
      {
            "id": "horizon-es-1",
            "category": "horizon",
            "quote": "Levántate, reinicia y conquista este día. ⚡",
            "author": "Fuerza de Lunes"
      },
      {
            "id": "horizon-es-2",
            "category": "horizon",
            "quote": "Nueva semana, mente clara y fuerza infinita. 🌅",
            "author": "Energía del Alba"
      },
      {
            "id": "horizon-es-3",
            "category": "horizon",
            "quote": "Que tu coraje brille más fuerte que la luz del amanecer. 🌄",
            "author": "Cima Dorada"
      },
      {
            "id": "horizon-es-4",
            "category": "horizon",
            "quote": "Avanza con determinación; el éxito te espera hoy. 🛣️",
            "author": "Rumbo Firme"
      },
      {
            "id": "horizon-es-5",
            "category": "horizon",
            "quote": "Las grandes metas exigen grandes despertares. ¡Con todo! ⛰️",
            "author": "Voluntad Inquebrantable"
      },
      {
            "id": "horizon-es-6",
            "category": "horizon",
            "quote": "Inhala la luz dorada, exhala cualquier duda. ✨",
            "author": "Paz Interior"
      },
      {
            "id": "horizon-es-7",
            "category": "horizon",
            "quote": "Tu potencial es tan infinito como el horizonte. 🌊",
            "author": "Mar de Esperanza"
      },
      {
            "id": "horizon-es-8",
            "category": "horizon",
            "quote": "El lunes no es un freno; es tu punto de despegue. 🚀",
            "author": "Despegue Semanal"
      },
      {
            "id": "floral-es-1",
            "category": "floral",
            "quote": "Que tu día florezca con alegría, paz y bendiciones. 🌸",
            "author": "Flor de Mañana"
      },
      {
            "id": "floral-es-2",
            "category": "floral",
            "quote": "Te envío la luz de la mañana y pétalos de felicidad. ✨",
            "author": "Jardín Soleado"
      },
      {
            "id": "floral-es-3",
            "category": "floral",
            "quote": "Florece donde la vida te plante y brilla con fuerza hoy. 🌻",
            "author": "Girasol Dorado"
      },
      {
            "id": "floral-es-4",
            "category": "floral",
            "quote": "Como una flor al amanecer, recibe este día con amor y gratitud. 🌷",
            "author": "Luz del Alba"
      },
      {
            "id": "floral-es-5",
            "category": "floral",
            "quote": "Que tu corazón se sienta tan ligero como una caricia de primavera. 🌼",
            "author": "Margarita Dulce"
      },
      {
            "id": "floral-es-6",
            "category": "floral",
            "quote": "Un recordatorio dulce: Estás floreciendo a tu propio tiempo. 🌺",
            "author": "Gracia Serena"
      },
      {
            "id": "floral-es-7",
            "category": "floral",
            "quote": "Flores frescas, alma en calma y un día lleno de oportunidades. 🪻",
            "author": "Brisa Floral"
      },
      {
            "id": "floral-es-8",
            "category": "floral",
            "quote": "Deseándote una mañana radiante y llena de hermosas sonrisas. 💐",
            "author": "Pétalos de Amor"
      },
      {
            "id": "cafe-es-1",
            "category": "cafe",
            "quote": "Primero el café, luego el mundo. ☕",
            "author": "Ritual Matutino"
      },
      {
            "id": "cafe-es-2",
            "category": "cafe",
            "quote": "Respira hondo, disfruta tu café y vive con calma hoy. ✨",
            "author": "Paz Diaria"
      },
      {
            "id": "cafe-es-3",
            "category": "cafe",
            "quote": "Un café caliente, paz en el alma y luz en el corazón. 🥐",
            "author": "Mesa Acogedora"
      },
      {
            "id": "cafe-es-4",
            "category": "cafe",
            "quote": "Que tu mañana tenga aroma a café recién hecho y buena vibra. ☕",
            "author": "Café Fresco"
      },
      {
            "id": "cafe-es-5",
            "category": "cafe",
            "quote": "Un café con amor y un desayuno lleno de gratitud. 🥐",
            "author": "Mañana Dulce"
      },
      {
            "id": "cafe-es-6",
            "category": "cafe",
            "quote": "Nutre tu cuerpo, alegra tu espíritu y disfruta cada momento. 🥑",
            "author": "Despertar Sano"
      },
      {
            "id": "cafe-es-7",
            "category": "cafe",
            "quote": "Que tu día sea tan dulce como tus panqueques de domingo. 🥞",
            "author": "Domingo de Paz"
      },
      {
            "id": "cafe-es-8",
            "category": "cafe",
            "quote": "Ponle una pizca de ternura a tu taza de cada mañana. ☕",
            "author": "Cariño Matutino"
      },
      {
            "id": "woolly-es-1",
            "category": "woolly",
            "quote": "Te mando un abrazo suave de buenos días y un café lleno de ternura. 🧸",
            "author": "Osito Tierno"
      },
      {
            "id": "woolly-es-2",
            "category": "woolly",
            "quote": "Empieza el día con una sonrisa dulce y florece a tu propio ritmo. 🐰",
            "author": "Conejito Suave"
      },
      {
            "id": "woolly-es-3",
            "category": "woolly",
            "quote": "Estírate, recibe los rayos de sol y disfruta de una mañana tranquila. 🐱",
            "author": "Gatito Soleado"
      },
      {
            "id": "woolly-es-4",
            "category": "woolly",
            "quote": "¡Mueve la colita y recibe este nuevo día lleno de alegrías! 🐶",
            "author": "Shiba Feliz"
      },
      {
            "id": "woolly-es-5",
            "category": "woolly",
            "quote": "¡Eres una persona increíble! Navega este día con paz en el corazón. 🦦",
            "author": "Nutria Dulce"
      },
      {
            "id": "woolly-es-6",
            "category": "woolly",
            "quote": "Envuélvete en ternura y deja que el día te trate con cariño. 🐨",
            "author": "Koala Acogedor"
      },
      {
            "id": "woolly-es-7",
            "category": "woolly",
            "quote": "Pronóstico de hoy: 100% de abrazos suaves y momentos bonitos. 🧸",
            "author": "Abrazo Matinal"
      },
      {
            "id": "woolly-es-8",
            "category": "woolly",
            "quote": "Respira hondo y deja que hoy todo fluya con suavidad. ✨",
            "author": "Luz de Mañana"
      },
      {
            "id": "es-1",
            "category": "inspirational",
            "quote": "Cada amanecer es una nueva oportunidad para agradecer, soñar y conquistar lo que te propongas.",
            "author": "Pensamiento del Día"
      },
      {
            "id": "es-2",
            "category": "inspirational",
            "quote": "Que hoy la vida te sonría, que tus metas se acerquen y que nada apague tu luz.",
            "author": "Fuerza Diaria"
      },
      {
            "id": "es-3",
            "category": "inspirational",
            "quote": "El secreto para salir adelante es comenzar. Da hoy el primer paso con fe y valentía.",
            "author": "Mark Twain"
      },
      {
            "id": "es-4",
            "category": "inspirational",
            "quote": "No cuentes los días, haz que los días cuenten. ¡Que tengas un día grandioso!",
            "author": "Muhammad Ali"
      },
      {
            "id": "es-5",
            "category": "inspirational",
            "quote": "La vida es un libro en blanco cada amanecer; escribe hoy una página inolvidable.",
            "author": "Inspiración Matutina"
      },
      {
            "id": "es-6",
            "category": "inspirational",
            "quote": "Tus únicos límites son los que tú mismo te impones. Despierta y desafía lo imposible.",
            "author": "Coraje y Fe"
      },
      {
            "id": "es-7",
            "category": "inspirational",
            "quote": "Abre tus alas y deja que el viento de esta nueva mañana te eleve hacia tus sueños.",
            "author": "Vuelo Alto"
      },
      {
            "id": "es-8",
            "category": "inspirational",
            "quote": "La mejor manera de predecir el futuro es crearlo hoy mismo. ¡Buenos días!",
            "author": "Peter Drucker"
      },
      {
            "id": "es-9",
            "category": "inspirational",
            "quote": "Haz de cada día tu obra maestra con gratitud, esfuerzo y una sonrisa sincera.",
            "author": "Sabiduría Diaria"
      },
      {
            "id": "es-10",
            "category": "inspirational",
            "quote": "El sol siempre sale de nuevo, recordándonos que siempre hay un nuevo comienzo.",
            "author": "Esperanza Viva"
      },
      {
            "id": "es-11",
            "category": "inspirational",
            "quote": "No busques el momento perfecto; toma este momento y hazlo perfecto.",
            "author": "Acción Diaria"
      },
      {
            "id": "es-12",
            "category": "inspirational",
            "quote": "Hoy es el día ideal para ser feliz, amar intensamente y vivir sin temores.",
            "author": "Plenitud"
      },
      {
            "id": "es-13",
            "category": "love",
            "quote": "Despertar y saber que existes en mi vida hace que cada mañana sea perfecta. ¡Buenos días, mi amor!",
            "author": "Siempre Contigo"
      },
      {
            "id": "es-14",
            "category": "love",
            "quote": "Que tu día sea tan hermoso, dulce y radiante como tu sonrisa.",
            "author": "Con Cariño"
      },
      {
            "id": "es-15",
            "category": "love",
            "quote": "Eres el primer pensamiento dulce que ilumina mi mente cada mañana al despertar.",
            "author": "Amor Eterno"
      },
      {
            "id": "es-16",
            "category": "love",
            "quote": "Si el sol brilla hoy con tanta fuerza, es porque intenta imitar el calor de tu corazón.",
            "author": "Alma Gemela"
      },
      {
            "id": "es-17",
            "category": "love",
            "quote": "Buenos días, vida mía. Gracias por hacer que cada instante valga la pena.",
            "author": "Mi Gran Amor"
      },
      {
            "id": "es-18",
            "category": "love",
            "quote": "No necesito café para despertar con energía; me basta con recordarte y sonreír.",
            "author": "Pura Ternura"
      },
      {
            "id": "es-19",
            "category": "love",
            "quote": "Te envío un abrazo apretado y un beso suave para que comiences el día sintiéndote amada.",
            "author": "Desde el Corazón"
      },
      {
            "id": "es-20",
            "category": "love",
            "quote": "Eres la luz de mis mañanas y la paz de mis noches. ¡Que tengas un día maravilloso!",
            "author": "Para Ti"
      },
      {
            "id": "es-21",
            "category": "friends",
            "quote": "¡Buenos días, amigo! Que no te falte el café caliente, la buena vibra y los motivos para sonreír.",
            "author": "Amistad Verdadera"
      },
      {
            "id": "es-22",
            "category": "friends",
            "quote": "La vida es más bonita y divertida con amigos como tú. ¡A comerse el mundo hoy!",
            "author": "Compañero de Ruta"
      },
      {
            "id": "es-23",
            "category": "friends",
            "quote": "Te deseo un día lleno de éxitos, buena compañía y cero complicaciones.",
            "author": "Abrazo de Amigo"
      },
      {
            "id": "es-24",
            "category": "friends",
            "quote": "Buenos días. Recuerda que no estás solo; aquí tienes un amigo para celebrar cada logro.",
            "author": "Lealtad"
      },
      {
            "id": "es-25",
            "category": "friends",
            "quote": "¡Arriba ese ánimo! Hoy va a ser un gran día para ti, te lo mereces de corazón.",
            "author": "Energía Positiva"
      },
      {
            "id": "es-26",
            "category": "friends",
            "quote": "Que la suerte te acompañe, que el trabajo sea ligero y que la risa sobreabunde.",
            "author": "Vibra Amiga"
      },
      {
            "id": "es-27",
            "category": "friends",
            "quote": "Un buen café para despertar el cuerpo y una buena charla para alimentar el alma.",
            "author": "Café y Charla"
      },
      {
            "id": "es-28",
            "category": "friends",
            "quote": "Gracias por ser ese amigo que alegra hasta los lunes más grises. ¡Que tengas un día genial!",
            "author": "Gratitud Amistosa"
      },
      {
            "id": "es-29",
            "category": "monday",
            "quote": "Feliz inicio de semana. Abraza este lunes con ganas de triunfar y escribir una gran historia.",
            "author": "Motivación Lunes"
      },
      {
            "id": "es-30",
            "category": "monday",
            "quote": "Un nuevo lunes significa 7 nuevas oportunidades para brillar y alcanzar tus metas.",
            "author": "Enfoque Semanal"
      },
      {
            "id": "es-31",
            "category": "monday",
            "quote": "No le temas al lunes; haz que el lunes te tema a ti por toda la energía que traes.",
            "author": "Actitud Ganadora"
      },
      {
            "id": "es-32",
            "category": "monday",
            "quote": "La actitud con la que inicias tu semana determina los triunfos que cosecharás el fin de semana.",
            "author": "Impulso Vital"
      },
      {
            "id": "es-33",
            "category": "monday",
            "quote": "Lunes con 'L' de lograr todo lo que te propongas. ¡Con paso firme y la frente en alto!",
            "author": "Poder Mental"
      },
      {
            "id": "es-34",
            "category": "monday",
            "quote": "Convierte este lunes en el trampolín hacia tu mejor versión. ¡Adelante con todo!",
            "author": "Superación"
      },
      {
            "id": "es-35",
            "category": "monday",
            "quote": "Despierta con gratitud y determinación. Que este lunes marque el inicio de tus mayores éxitos.",
            "author": "Lunes Imparable"
      },
      {
            "id": "es-36",
            "category": "monday",
            "quote": "Haz que cada hora de este lunes cuente. Tu futuro se construye hoy.",
            "author": "Visión Clara"
      },
      {
            "id": "es-37",
            "category": "blessings",
            "quote": "Que Dios bendiga tu camino hoy, cuide a tu familia y derrame paz sobre tu hogar.",
            "author": "Paz y Gracia"
      },
      {
            "id": "es-38",
            "category": "blessings",
            "quote": "Que la serenidad inunde tu corazón y que no te falte la salud, el amor ni la esperanza.",
            "author": "Bendición Matinal"
      },
      {
            "id": "es-39",
            "category": "blessings",
            "quote": "Que cada paso que des hoy esté guiado por la sabiduría y protegido por el amor divino.",
            "author": "Luz en el Camino"
      },
      {
            "id": "es-40",
            "category": "blessings",
            "quote": "Doy gracias por este nuevo día y pido paz, abundancia y armonía para tu vida.",
            "author": "Plegaria de Paz"
      },
      {
            "id": "es-41",
            "category": "blessings",
            "quote": "Que la paz de esta mañana calme cualquier tormenta y renueve tus fuerzas.",
            "author": "Serenidad"
      },
      {
            "id": "es-42",
            "category": "blessings",
            "quote": "Que la bendición de la vida se renueve hoy en ti como el rocío sobre las flores.",
            "author": "Gracia Serena"
      },
      {
            "id": "es-43",
            "category": "blessings",
            "quote": "Que encuentres descanso en medio del ajetreo y gratitud en cada pequeño detalle.",
            "author": "Armonía Divina"
      },
      {
            "id": "es-44",
            "category": "blessings",
            "quote": "Que la luz de la esperanza brille en tu alma y te guíe hacia momentos felices.",
            "author": "Paz Profunda"
      },
      {
            "id": "es-45",
            "category": "short",
            "quote": "¡Sonríe, que hoy va a ser un día maravilloso!",
            "author": "Buenos Días"
      },
      {
            "id": "es-46",
            "category": "short",
            "quote": "Respira hondo y brilla con toda tu luz.",
            "author": "Luz y Paz"
      },
      {
            "id": "es-47",
            "category": "short",
            "quote": "Café en mano y sueños en marcha.",
            "author": "Despertar"
      },
      {
            "id": "es-48",
            "category": "short",
            "quote": "Hoy elijo ser feliz y estar en paz.",
            "author": "Elección Diaria"
      },
      {
            "id": "es-49",
            "category": "short",
            "quote": "¡Amaneció! Una nueva oportunidad para amar y vivir.",
            "author": "Nuevo Día"
      },
      {
            "id": "es-50",
            "category": "short",
            "quote": "Haz que hoy valga la pena cada suspiro.",
            "author": "Vivir Hoy"
      },
      {
            "id": "es-51",
            "category": "short",
            "quote": "Brilla con luz propia, sin apagar la de nadie.",
            "author": "Luz Interior"
      },
      {
            "id": "es-52",
            "category": "short",
            "quote": "¡Buenos días! Que la alegría sea tu brújula hoy.",
            "author": "Alegría Pura"
      }
]
  },
  pt: {
    categories: [
      { key: 'horizon', label: '🌅 Alvorecer Dourado' },
      { key: 'woolly', label: '🧸 Abraços Fofos' },
      { key: 'cafe', label: '☕ Café & Manhã' },
      { key: 'floral', label: '🌸 Flores Matinais' },
      { key: 'inspirational', label: 'Inspiração' },
      { key: 'love', label: 'Amor e Carinho' },
      { key: 'friends', label: 'Para Amigos' },
      { key: 'monday', label: 'Segunda Motivadora' },
      { key: 'blessings', label: 'Bênçãos e Paz' },
      { key: 'short', label: 'Curtas e Lindas' },
    ],
    quotes: [
      {
            "id": "horizon-pt-1",
            "category": "horizon",
            "quote": "Levante-se, recomece e vença o dia de hoje. ⚡",
            "author": "Força de Segunda"
      },
      {
            "id": "horizon-pt-2",
            "category": "horizon",
            "quote": "Nova semana, energia renovada e foco total. 🌅",
            "author": "Energia da Alvorada"
      },
      {
            "id": "horizon-pt-3",
            "category": "horizon",
            "quote": "Que a sua coragem brilhe mais que a luz da alvorada. 🌄",
            "author": "Pico Dourado"
      },
      {
            "id": "horizon-pt-4",
            "category": "horizon",
            "quote": "Caminhe com propósito; o dia de hoje é seu. 🛣️",
            "author": "Rumo Certo"
      },
      {
            "id": "horizon-pt-5",
            "category": "horizon",
            "quote": "Grandes vitórias exigem novos começos. Vamos com tudo! ⛰️",
            "author": "Garra e Fé"
      },
      {
            "id": "horizon-pt-6",
            "category": "horizon",
            "quote": "Inspire a luz dourada, expire qualquer incerteza. ✨",
            "author": "Força Serena"
      },
      {
            "id": "horizon-pt-7",
            "category": "horizon",
            "quote": "O seu potencial é tão imenso quanto o horizonte. 🌊",
            "author": "Horizonte Aberto"
      },
      {
            "id": "horizon-pt-8",
            "category": "horizon",
            "quote": "A segunda-feira não é um obstáculo; é o seu trampolim. 🚀",
            "author": "Impulso Semanal"
      },
      {
            "id": "floral-pt-1",
            "category": "floral",
            "quote": "Que o seu dia floresça com alegria, paz e muita luz. 🌸",
            "author": "Flor da Manhã"
      },
      {
            "id": "floral-pt-2",
            "category": "floral",
            "quote": "Te enviando a luz da manhã e pétalas de carinho. ✨",
            "author": "Jardim Solar"
      },
      {
            "id": "floral-pt-3",
            "category": "floral",
            "quote": "Floresça onde Deus te plantar e brilhe com intensidade hoje. 🌻",
            "author": "Girassol Dourado"
      },
      {
            "id": "floral-pt-4",
            "category": "floral",
            "quote": "Como uma flor ao amanhecer, receba este dia com gratidão no peito. 🌷",
            "author": "Alvorecer"
      },
      {
            "id": "floral-pt-5",
            "category": "floral",
            "quote": "Que sua alma seja leve e seu caminho perfumado de esperança. 🌼",
            "author": "Margarida Serena"
      },
      {
            "id": "floral-pt-6",
            "category": "floral",
            "quote": "Lembrete carinhoso: Você está florescendo no seu próprio tempo. 🌺",
            "author": "Doce Calma"
      },
      {
            "id": "floral-pt-7",
            "category": "floral",
            "quote": "Flores frescas na mesa, paz no coração e um novo dia abençoado. 🪻",
            "author": "Perfume Suave"
      },
      {
            "id": "floral-pt-8",
            "category": "floral",
            "quote": "Desejando a você uma manhã radiante e cheia de sorrisos doces. 💐",
            "author": "Pétalas de Luz"
      },
      {
            "id": "cafe-pt-1",
            "category": "cafe",
            "quote": "Primeiro o café, depois o mundo. ☕",
            "author": "Ritual Matinal"
      },
      {
            "id": "cafe-pt-2",
            "category": "cafe",
            "quote": "Beba devagar, respire fundo e viva com leveza hoje. ✨",
            "author": "Mente Serena"
      },
      {
            "id": "cafe-pt-3",
            "category": "cafe",
            "quote": "Café quente na xícara, paz no peito e sol na janela. 🥐",
            "author": "Aconchego"
      },
      {
            "id": "cafe-pt-4",
            "category": "cafe",
            "quote": "Que sua manhã comece com aroma de café fresco e esperança. ☕",
            "author": "Café & Fé"
      },
      {
            "id": "cafe-pt-5",
            "category": "cafe",
            "quote": "Um café com carinho e um café da manhã cheio de gratidão. 🥐",
            "author": "Manhã Especial"
      },
      {
            "id": "cafe-pt-6",
            "category": "cafe",
            "quote": "Alimente a alma com paz e comece o dia com o coração leve. 🥑",
            "author": "Equilíbrio"
      },
      {
            "id": "cafe-pt-7",
            "category": "cafe",
            "quote": "Que o seu dia seja doce, inspirador e cheio de boas energias. 🥞",
            "author": "Domingo Leve"
      },
      {
            "id": "cafe-pt-8",
            "category": "cafe",
            "quote": "Coloque uma dose extra de afeto no seu café desta manhã. ☕",
            "author": "Com Amor"
      },
      {
            "id": "woolly-pt-1",
            "category": "woolly",
            "quote": "Te enviando um abraço quentinho de bom dia e um café cheio de carinho. 🧸",
            "author": "Ursinho Fofo"
      },
      {
            "id": "woolly-pt-2",
            "category": "woolly",
            "quote": "Comece o dia com um sorriso leve e floresça no seu próprio tempo. 🐰",
            "author": "Coelhinho Aveludado"
      },
      {
            "id": "woolly-pt-3",
            "category": "woolly",
            "quote": "Espreguice-se, receba a luz do sol e viva uma manhã de pura paz. 🐱",
            "author": "Gatinho Solar"
      },
      {
            "id": "woolly-pt-4",
            "category": "woolly",
            "quote": "Abanando o rabinho para dar as boas-vindas a um dia maravilhoso! 🐶",
            "author": "Shiba Alegre"
      },
      {
            "id": "woolly-pt-5",
            "category": "woolly",
            "quote": "Você é simplesmente incrível! Flutue por hoje com leveza na alma. 🦦",
            "author": "Lontra Doce"
      },
      {
            "id": "woolly-pt-6",
            "category": "woolly",
            "quote": "Aconchegue-se no carinho e tenha um dia doce e especial. 🐨",
            "author": "Koala Calmo"
      },
      {
            "id": "woolly-pt-7",
            "category": "woolly",
            "quote": "Previsão para hoje: 100% de abraços fofos e doces sorrisos. 🧸",
            "author": "Abraço de Manhã"
      },
      {
            "id": "woolly-pt-8",
            "category": "woolly",
            "quote": "Respire fundo e deixe o dia te abraçar com delicadeza. ✨",
            "author": "Manhã Serena"
      },
      {
            "id": "pt-1",
            "category": "inspirational",
            "quote": "Cada manhã traz a promessa de um recomeço. Acredite na sua força e faça acontecer!",
            "author": "Inspiração Matinal"
      },
      {
            "id": "pt-2",
            "category": "inspirational",
            "quote": "Que o seu dia seja repleto de boas surpresas, sorrisos sinceros e passos firmes rumo aos seus sonhos.",
            "author": "Sabedoria Diária"
      },
      {
            "id": "pt-3",
            "category": "inspirational",
            "quote": "O segredo de progredir é começar. Levante-se com coragem e conquiste o seu dia.",
            "author": "Mark Twain"
      },
      {
            "id": "pt-4",
            "category": "inspirational",
            "quote": "A vida não é sobre esperar a tempestade passar, é sobre aprender a dançar na chuva da alvorada.",
            "author": "Vivian Greene"
      },
      {
            "id": "pt-5",
            "category": "inspirational",
            "quote": "Hoje é uma página em branco que o universo lhe presenteou. Escreva uma linda história.",
            "author": "Recomeço"
      },
      {
            "id": "pt-6",
            "category": "inspirational",
            "quote": "Você é mais forte do que imagina e capaz de superar qualquer obstáculo. Bom dia!",
            "author": "Força Interior"
      },
      {
            "id": "pt-7",
            "category": "inspirational",
            "quote": "O sol brilha para todos, mas só quem abre a janela sente o calor da oportunidade.",
            "author": "Visão Positiva"
      },
      {
            "id": "pt-8",
            "category": "inspirational",
            "quote": "A melhor maneira de prever o futuro é construí-lo com as escolhas que você faz hoje.",
            "author": "Foco e Fé"
      },
      {
            "id": "pt-9",
            "category": "inspirational",
            "quote": "Comece onde você está, use o que você tem, faça o que você pode.",
            "author": "Arthur Ashe"
      },
      {
            "id": "pt-10",
            "category": "inspirational",
            "quote": "A gratidão transforma o que temos em suficiente e abre as portas da abundância.",
            "author": "Coração Grato"
      },
      {
            "id": "pt-11",
            "category": "inspirational",
            "quote": "Nunca é tarde demais para ser aquilo que você sempre sonhou ser. Bom dia!",
            "author": "George Eliot"
      },
      {
            "id": "pt-12",
            "category": "inspirational",
            "quote": "Que a sua coragem seja maior que o seu medo e a sua fé maior que as suas dúvidas.",
            "author": "Coragem Diária"
      },
      {
            "id": "pt-13",
            "category": "love",
            "quote": "Acordar e saber que você faz parte da minha vida torna cada amanhecer especial. Bom dia, meu amor!",
            "author": "Para Sempre"
      },
      {
            "id": "pt-14",
            "category": "love",
            "quote": "Que o seu dia seja tão doce, iluminado e encantador quanto o seu olhar.",
            "author": "Com Amor"
      },
      {
            "id": "pt-15",
            "category": "love",
            "quote": "Você é o primeiro e mais lindo pensamento que invade a minha mente ao acordar.",
            "author": "Amor Verdadeiro"
      },
      {
            "id": "pt-16",
            "category": "love",
            "quote": "Se eu pudesse colher uma flor para cada vez que penso em você, teria um jardim infinito.",
            "author": "Coração Apaixonado"
      },
      {
            "id": "pt-17",
            "category": "love",
            "quote": "Bom dia, minha vida! Que o calor do sol leve até você o meu abraço mais apertado.",
            "author": "Meu Bem"
      },
      {
            "id": "pt-18",
            "category": "love",
            "quote": "Meu dia só começa de verdade depois que desejo bom dia para a pessoa que amo.",
            "author": "Pura Ternura"
      },
      {
            "id": "pt-19",
            "category": "love",
            "quote": "Você ilumina meus dias mais do que o próprio sol. Tenha um dia maravilhoso, amor!",
            "author": "Minha Luz"
      },
      {
            "id": "pt-20",
            "category": "love",
            "quote": "Desejo que o seu dia seja repleto de paz, amor e a certeza de que estou pensando em você.",
            "author": "Carinho Sem Fim"
      },
      {
            "id": "pt-21",
            "category": "friends",
            "quote": "Bom dia, amigo(a)! Que não falte café quente, bom humor e vitórias no seu dia.",
            "author": "Amizade Sincera"
      },
      {
            "id": "pt-22",
            "category": "friends",
            "quote": "A vida é muito mais leve e colorida quando temos amigos especiais para caminhar ao lado.",
            "author": "Companheirismo"
      },
      {
            "id": "pt-23",
            "category": "friends",
            "quote": "Passando para desejar um dia produtivo, alegre e livre de qualquer preocupação!",
            "author": "Abraço de Amigo"
      },
      {
            "id": "pt-24",
            "category": "friends",
            "quote": "Que o seu dia seja incrível como a nossa amizade e cheio de momentos para sorrir.",
            "author": "Laços Fortes"
      },
      {
            "id": "pt-25",
            "category": "friends",
            "quote": "Um café forte para o corpo e uma dose de fé para a alma. Vamos com tudo hoje, parceiro!",
            "author": "Energia Amiga"
      },
      {
            "id": "pt-26",
            "category": "friends",
            "quote": "Amizade boa é aquela que aquece o peito e dá forças para enfrentar qualquer desafio.",
            "author": "Parceria"
      },
      {
            "id": "pt-27",
            "category": "friends",
            "quote": "Que a sua jornada hoje seja repleta de portas abertas e pessoas de bom coração.",
            "author": "Torcida Fiel"
      },
      {
            "id": "pt-28",
            "category": "friends",
            "quote": "Bom dia! Lembre-se de que você é incrível e capaz de alcançar coisas grandiosas.",
            "author": "Incentivo Amigo"
      },
      {
            "id": "pt-29",
            "category": "monday",
            "quote": "Feliz segunda-feira! Uma nova semana se inicia, repleta de oportunidades para vencer.",
            "author": "Energia da Semana"
      },
      {
            "id": "pt-30",
            "category": "monday",
            "quote": "Segunda-feira é dia de recomeçar com o pé direito e foco total nos seus objetivos.",
            "author": "Foco Semanal"
      },
      {
            "id": "pt-31",
            "category": "monday",
            "quote": "Não encare a segunda como um peso, mas como a largada para as suas maiores conquistas.",
            "author": "Atitude Positiva"
      },
      {
            "id": "pt-32",
            "category": "monday",
            "quote": "A forma como você encara a sua segunda-feira dita o ritmo de toda a sua semana. Seja imparável!",
            "author": "Garra e Força"
      },
      {
            "id": "pt-33",
            "category": "monday",
            "quote": "Nova semana, novos planos, novas vitórias. Vá em frente com fé e determinação.",
            "author": "Novo Fôlego"
      },
      {
            "id": "pt-34",
            "category": "monday",
            "quote": "Segunda-feira com 'S' de sucesso! Que a sua semana seja extraordinária do início ao fim.",
            "author": "Mente Vencedora"
      },
      {
            "id": "pt-35",
            "category": "monday",
            "quote": "Respire fundo, tome um café reforçado e assuma o controle do seu destino esta semana.",
            "author": "Impulso Vital"
      },
      {
            "id": "pt-36",
            "category": "monday",
            "quote": "A vitória pertence aos que persistem. Faça desta segunda-feira o seu melhor começo.",
            "author": "Determinação"
      },
      {
            "id": "pt-37",
            "category": "blessings",
            "quote": "Que Deus abençoe o seu dia, guie os seus passos e proteja quem você ama com infinita paz.",
            "author": "Paz e Graça"
      },
      {
            "id": "pt-38",
            "category": "blessings",
            "quote": "Que a paz de Deus reine em seu coração e que a esperança renove as suas energias hoje.",
            "author": "Bênção da Manhã"
      },
      {
            "id": "pt-39",
            "category": "blessings",
            "quote": "Que a serenidade matinal acalme qualquer aflição e traga clareza para as suas decisões.",
            "author": "Serenidade"
      },
      {
            "id": "pt-40",
            "category": "blessings",
            "quote": "Agradeça pelo dom da vida. Cada respiração é uma bênção e uma chance de fazer o bem.",
            "author": "Luz Divina"
      },
      {
            "id": "pt-41",
            "category": "blessings",
            "quote": "Que o seu lar seja cercado de harmonia, saúde e da doce presença da paz.",
            "author": "Proteção e Fé"
      },
      {
            "id": "pt-42",
            "category": "blessings",
            "quote": "Que o amor divino seja o escudo que protege o seu caminho em cada instante de hoje.",
            "author": "Graça Divina"
      },
      {
            "id": "pt-43",
            "category": "blessings",
            "quote": "Que você encontre motivos para sorrir e agradecer nas pequenas delicadezas deste amanhecer.",
            "author": "Paz no Coração"
      },
      {
            "id": "pt-44",
            "category": "blessings",
            "quote": "Que a luz da esperança nunca se apague e que o seu dia seja repleto de bênçãos.",
            "author": "Esperança Viva"
      },
      {
            "id": "pt-45",
            "category": "short",
            "quote": "Sorria, respire fundo e faça hoje valer a pena!",
            "author": "Bom Dia"
      },
      {
            "id": "pt-46",
            "category": "short",
            "quote": "Café na mão, fé no coração e coragem para vencer.",
            "author": "Despertar"
      },
      {
            "id": "pt-47",
            "category": "short",
            "quote": "Hoje é dia de ser feliz e espalhar gentileza.",
            "author": "Gentileza"
      },
      {
            "id": "pt-48",
            "category": "short",
            "quote": "Amanheceu! Uma nova chance de ser a sua melhor versão.",
            "author": "Novo Dia"
      },
      {
            "id": "pt-49",
            "category": "short",
            "quote": "Viva o presente com amor, leveza e gratidão.",
            "author": "Leveza"
      },
      {
            "id": "pt-50",
            "category": "short",
            "quote": "Brilhe com a sua própria luz e contagie o mundo.",
            "author": "Luz Interior"
      },
      {
            "id": "pt-51",
            "category": "short",
            "quote": "Que a alegria seja a sua companhia em cada passo de hoje.",
            "author": "Alegria"
      },
      {
            "id": "pt-52",
            "category": "short",
            "quote": "Bom dia! Paz na alma, amor no peito e vida em abundância.",
            "author": "Plenitude"
      }
]
  }
};
