export const BUILDER_OPTIONS = {
  // Step 1: Flower Selection
  flowers: [
    {
      id: 'red-rose',
      name: 'রক্তিম ডাচ গোলাপ',
      englishName: 'Dutch Red Rose',
      pricePerStem: 120,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
      color: '#B22222',
      tag: 'জনপ্রিয়'
    },
    {
      id: 'pink-rose',
      name: 'প্যাস্টেল পিংক রোজ',
      englishName: 'Pastel Pink Rose',
      pricePerStem: 130,
      image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=400&auto=format&fit=crop',
      color: '#FFB6C1',
      tag: 'রোমান্টিক'
    },
    {
      id: 'white-lily',
      name: 'সুবাসিত শুভ্র লিলি',
      englishName: 'Fragrant White Lily',
      pricePerStem: 280,
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop',
      color: '#F8F8FF',
      tag: 'আভিজাত্য'
    },
    {
      id: 'dutch-tulip',
      name: 'ডাচ টিউলিপ',
      englishName: 'Imported Dutch Tulip',
      pricePerStem: 320,
      image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=400&auto=format&fit=crop',
      color: '#E0115F',
      tag: 'এক্সক্লুসিভ'
    },
    {
      id: 'sunflower',
      name: 'সোনালী সূর্যমুখী',
      englishName: 'Golden Sunflower',
      pricePerStem: 180,
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400&auto=format&fit=crop',
      color: '#FFD700',
      tag: 'প্রাণবন্ত'
    },
    {
      id: 'thai-orchid',
      name: 'পার্পল থাই অর্কিড',
      englishName: 'Purple Thai Orchid',
      pricePerStem: 220,
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400&auto=format&fit=crop',
      color: '#BA55D3',
      tag: 'দীর্ঘস্থায়ী'
    },
    {
      id: 'rajnigandha',
      name: 'দেশি তাজা রজনীগন্ধা',
      englishName: 'Fresh Tuberose (Rajnigandha)',
      pricePerStem: 60,
      image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=400&auto=format&fit=crop',
      color: '#FFFFFF',
      tag: 'ঐতিহ্যবাহী সুবাস'
    },
    {
      id: 'gypsophila',
      name: 'বেবিস ব্রেথ (জিপসি ফিলার)',
      englishName: "Baby's Breath Gypsophila",
      pricePerStem: 150,
      image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=400&auto=format&fit=crop',
      color: '#FFF8DC',
      tag: 'ফিলার ক্লাউড'
    }
  ],

  // Step 2: Color Palette Theme
  colorPalettes: [
    {
      id: 'burgundy-red',
      name: 'ক্লাসিক বার্গান্ডি ও রেড',
      description: 'গভীর ভালোবাসা ও আবেগের প্রতীক',
      preview: ['#610000', '#B22222', '#8B0000']
    },
    {
      id: 'blush-pink',
      name: 'কোমল ব্লাশ ও পিংক',
      description: 'স্নিগ্ধতা, মিষ্টি অনুভূতি ও বন্ধুত্ব',
      preview: ['#FFDAD4', '#FFB6C1', '#DB7093']
    },
    {
      id: 'royal-white',
      name: 'রয়্যাল হোয়াইট ও আইভরি',
      description: 'পবিত্রতা, শান্তি ও মার্জিত আভিজাত্য',
      preview: ['#FFFFFF', '#F6F3F2', '#E0D5D0']
    },
    {
      id: 'sunshine-glow',
      name: 'সানশাইন ইয়োলো ও ওরেঞ্জ',
      description: 'আনন্দ, উদযাপন ও নতুন আশার আলো',
      preview: ['#FFD700', '#FFA500', '#FF8C00']
    },
    {
      id: 'vibrant-mix',
      name: 'রঙিন বসন্ত ব্লুম মিক্স',
      description: 'সব রঙের বর্ণিল ও উৎসবমুখর সমাহার',
      preview: ['#B22222', '#FFB6C1', '#FFD700', '#BA55D3']
    }
  ],

  // Step 3: Bouquet Size
  sizes: [
    {
      id: 'standard',
      name: 'স্ট্যান্ডার্ড তোড়া',
      stemCount: 12,
      label: '১২টি স্টেম',
      description: 'দৈনন্দিন উপহার ও মিষ্টি সারপ্রাইজের জন্য চমৎকার',
      basePrice: 400,
      badge: 'বাজেট ফ্রেন্ডলি'
    },
    {
      id: 'deluxe',
      name: 'ডিলাক্স তোড়া',
      stemCount: 24,
      label: '২৪টি স্টেম',
      description: 'আমাদের সবচেয়ে জনপ্রিয় ও আকর্ষণীয় কম্বিনেশন',
      basePrice: 700,
      badge: 'সর্বাধিক জনপ্রিয়'
    },
    {
      id: 'grand',
      name: 'গ্র্যান্ড তোড়া',
      stemCount: 36,
      label: '৩৬টি স্টেম',
      description: 'বিবাহবার্ষিকী বা বিশেষ প্রপোজালের জন্য জাঁকজমকপূর্ণ',
      basePrice: 1100,
      badge: 'প্রিমিয়াম চয়েস'
    },
    {
      id: 'luxury',
      name: 'লাক্সারি মেগা তোড়া',
      stemCount: 50,
      label: '৫০টি স্টেম',
      description: 'বিশাল রাজকীয় উপহার যা নজর কাড়বেই',
      basePrice: 1600,
      badge: 'আলটিমেট লাক্সারি'
    }
  ],

  // Step 4: Wrapping Style
  wrappings: [
    {
      id: 'burgundy-matte',
      name: 'সিগনেচার বার্গান্ডি ম্যাট',
      price: 150,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop',
      tag: 'ফুল কিনি স্পেশাল'
    },
    {
      id: 'kraft-eco',
      name: 'ইকো ভিন্টেজ ক্রাফট পেপার',
      price: 100,
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=300&auto=format&fit=crop',
      tag: 'প্রাকৃতিক নান্দনিক'
    },
    {
      id: 'pastel-velvet',
      name: 'সফট ভেলভেট পিংক পেপার',
      price: 180,
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=300&auto=format&fit=crop',
      tag: 'কোমল অনুভূতি'
    },
    {
      id: 'black-gold',
      name: 'মডার্ন ব্ল্যাক উইথ গোল্ড বর্ডার',
      price: 200,
      image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=300&auto=format&fit=crop',
      tag: 'রাজকীয় লুক'
    }
  ],

  // Step 5: Add-ons
  addOns: [
    {
      id: 'chocolates',
      name: 'লাক্সারি বেলজিয়ান চকলেট বক্স',
      price: 850,
      icon: '🍫',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'scented-candle',
      name: 'সুগন্ধি ফ্রেঞ্চ ভ্যানিলা সয়া ক্যান্ডেল',
      price: 650,
      icon: '🕯️',
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'teddy-bear',
      name: 'কিউট টেডি বিয়ার (৮ ইঞ্চি)',
      price: 500,
      icon: '🧸',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'glass-vase',
      name: 'হাতে খোদাই করা কাঁচের ভেস',
      price: 750,
      icon: '🏺',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop'
    }
  ],

  // Step 6: Greeting Card Presets
  cards: [
    {
      id: 'romantic',
      title: 'ভালোবাসার চিঠি',
      icon: '💌',
      defaultMessage: 'আমার জীবনের প্রতিটি দিনে তোমার ভালোবাসা যেন এই ফুলের মতোই চিরসতেজ ও সুবাসিত থাকে।'
    },
    {
      id: 'birthday',
      title: 'শুভ জন্মদিন',
      icon: '🎂',
      defaultMessage: 'জন্মদিনের অফুরন্ত শুভেচ্ছা ও ভালোবাসা! আগামী প্রতিটি দিন ভরে উঠুক অনাবিল আনন্দে ও সাফল্যে।'
    },
    {
      id: 'anniversary',
      title: 'বিবাহবার্ষিকীর শুভেচ্ছা',
      icon: '💍',
      defaultMessage: 'ভালোবাসার এই সুন্দর পথচলা যেন আজীবন এমন স্নিগ্ধ ও রঙিন থাকে। শুভ বিবাহবার্ষিকী!'
    },
    {
      id: 'congratulations',
      title: 'হার্দিক অভিনন্দন',
      icon: '🌟',
      defaultMessage: 'তোমার এই চমৎকার সাফল্যে আমি অত্যন্ত গর্বিত ও আনন্দিত। ভবিষ্যতের জন্য অনেক শুভকামনা!'
    },
    {
      id: 'custom',
      title: 'নিজের বার্তা লিখুন',
      icon: '✍️',
      defaultMessage: ''
    }
  ]
};
