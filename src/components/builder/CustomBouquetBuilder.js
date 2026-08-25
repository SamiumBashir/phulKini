'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BUILDER_OPTIONS } from '@/data/builderOptions';
import { useCart } from '@/context/CartContext';
import { formatBengaliPrice, toBengaliNumber } from '@/utils/bengaliUtils';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  HelpCircle,
  Gift,
  Palette,
  Layers,
  FileText,
  ShieldCheck,
  Flower2
} from 'lucide-react';

export default function CustomBouquetBuilder() {
  const router = useRouter();
  const { addToCart, openCartDrawer } = useCart();

  const [currentStep, setCurrentStep] = useState(1);

  // Customizer State
  const [selectedFlowers, setSelectedFlowers] = useState({
    'red-rose': 6,
    'pink-rose': 6
  });
  const [selectedPalette, setSelectedPalette] = useState('burgundy-red');
  const [selectedSize, setSelectedSize] = useState('deluxe'); // 24 stems
  const [selectedWrapping, setSelectedWrapping] = useState('burgundy-matte');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [cardDesign, setCardDesign] = useState('romantic');
  const [customMessage, setCustomMessage] = useState(
    'আমার জীবনের প্রতিটি দিনে তোমার ভালোবাসা যেন এই ফুলের মতোই চিরসতেজ ও সুবাসিত থাকে।'
  );
  const [recipientName, setRecipientName] = useState('');

  // Helpers
  const totalStemsSelected = Object.values(selectedFlowers).reduce((a, b) => a + b, 0);
  const currentSizeObj = BUILDER_OPTIONS.sizes.find((s) => s.id === selectedSize) || BUILDER_OPTIONS.sizes[1];
  const currentWrappingObj = BUILDER_OPTIONS.wrappings.find((w) => w.id === selectedWrapping) || BUILDER_OPTIONS.wrappings[0];
  const currentPaletteObj = BUILDER_OPTIONS.colorPalettes.find((p) => p.id === selectedPalette) || BUILDER_OPTIONS.colorPalettes[0];

  // Price Calculation
  const flowerCost = Object.entries(selectedFlowers).reduce((total, [flowerId, count]) => {
    const flower = BUILDER_OPTIONS.flowers.find((f) => f.id === flowerId);
    return total + (flower ? flower.pricePerStem * count : 0);
  }, 0);

  const wrappingCost = currentWrappingObj.price || 0;
  const sizeBaseCost = currentSizeObj.basePrice || 0;

  const addOnsCost = selectedAddOns.reduce((total, addOnId) => {
    const addon = BUILDER_OPTIONS.addOns.find((a) => a.id === addOnId);
    return total + (addon ? addon.price : 0);
  }, 0);

  const totalPrice = flowerCost + wrappingCost + sizeBaseCost + addOnsCost;

  // Modifiers
  const updateFlowerCount = (flowerId, delta) => {
    setSelectedFlowers((prev) => {
      const current = prev[flowerId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[flowerId];
        return copy;
      }
      return { ...prev, [flowerId]: next };
    });
  };

  const toggleAddOn = (addonId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleCardSelect = (card) => {
    setCardDesign(card.id);
    if (card.defaultMessage) {
      setCustomMessage(card.defaultMessage);
    }
  };

  const handleCompleteAndAddToCart = () => {
    // Trigger festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const customProduct = {
      id: `custom-bouquet-${Date.now()}`,
      name: `কাস্টম তোড়া (${currentPaletteObj.name})`,
      categoryName: 'কাস্টম ডিজাইন',
      price: totalPrice,
      images: [
        'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1000&auto=format&fit=crop'
      ],
      customBouquetConfig: {
        flowers: selectedFlowers,
        sizeId: selectedSize,
        wrappingId: selectedWrapping,
        addOnIds: selectedAddOns,
        cardDesign,
        recipientName,
        customMessage
      },
      customDetails: {
        isCustom: true,
        label: `${toBengaliNumber(totalStemsSelected)}টি স্টেমের সিগনেচার তোড়া`,
        flowerCount: `${toBengaliNumber(totalStemsSelected)} স্টেম`,
        palette: currentPaletteObj.name,
        size: currentSizeObj.name,
        wrapping: currentWrappingObj.name,
        recipientName,
        customMessage,
        addOns: selectedAddOns.map((id) => BUILDER_OPTIONS.addOns.find((a) => a.id === id)?.name)
      }
    };

    addToCart(customProduct, 1);
    openCartDrawer();
  };

  const steps = [
    { num: 1, label: 'ফুল বাছাই', icon: Flower2 },
    { num: 2, label: 'কালার থিম', icon: Palette },
    { num: 3, label: 'তোড়ার সাইজ', icon: Layers },
    { num: 4, label: 'র‍্যাপিং স্টাইল', icon: Sparkles },
    { num: 5, label: 'স্পেশাল উপহার', icon: Gift },
    { num: 6, label: 'গ্রিটিং কার্ড', icon: FileText },
    { num: 7, label: 'ফাইনাল প্রিভিউ', icon: Check }
  ];

  return (
    <div className="font-bengali">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold mb-2.5">
          <Sparkles size={14} />
          আপনার মনমতো ফ্লোরাল ক্রিয়েশন
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-main-text leading-tight">
          নিজের মতো করে তোড়া বানান
        </h1>
        <p className="text-sm text-main-muted mt-2">
          আপনার পছন্দের ফুল, প্রিয় রঙ ও বাজেট অনুযায়ী ধাপে ধাপে তৈরি করুন একটি নিখুঁত ও অনন্য তোড়া।
        </p>
      </div>

      {/* Step Progress Indicators */}
      <div className="max-w-4xl mx-auto mb-10 overflow-x-auto pb-3">
        <div className="flex items-center justify-between min-w-[620px] px-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className="flex flex-col items-center gap-1.5 group focus:outline-none"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-primary text-white shadow-soft ring-4 ring-primary-light scale-110'
                        : isCompleted
                        ? 'bg-accent-green text-white shadow-sm'
                        : 'bg-surface-soft text-main-muted border border-border-muted group-hover:border-primary'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span
                    className={`text-[12px] font-medium transition-colors ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isCompleted
                        ? 'text-accent-green font-semibold'
                        : 'text-main-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      currentStep > step.num ? 'bg-accent-green' : 'bg-border-subtle'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Builder Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
        
        {/* Left Column: Interactive Step Selector (8 cols) */}
        <div className="lg:col-span-8 bg-surface-white border border-border-muted rounded-3xl p-6 sm:p-8 shadow-soft">
          
          {/* STEP 1: Flower Selection */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-xl font-bold text-main-text">
                  ১. আপনার পছন্দের ফুল বাছাই করুন
                </h2>
                <p className="text-xs text-main-muted mt-0.5">
                  প্রতিটি ফুলের পরিমাণ (+) বা (-) চিহ্নে ক্লিক করে ঠিক করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BUILDER_OPTIONS.flowers.map((flower) => {
                  const count = selectedFlowers[flower.id] || 0;
                  return (
                    <div
                      key={flower.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        count > 0
                          ? 'border-primary bg-primary-subtle/70 shadow-soft-sm'
                          : 'border-border-subtle hover:border-border-muted bg-surface-soft/40'
                      }`}
                    >
                      <img
                        src={flower.image}
                        alt={flower.name}
                        className="w-14 h-14 rounded-xl object-cover border border-border-subtle shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-main-text">{flower.name}</h4>
                        </div>
                        <p className="text-xs text-primary font-semibold">
                          {formatBengaliPrice(flower.pricePerStem)} / স্টেম
                        </p>
                        <span className="text-[10px] text-main-subtle">{flower.tag}</span>
                      </div>

                      {/* Count Control */}
                      <div className="flex items-center border border-border-muted rounded-lg bg-surface-white">
                        <button
                          onClick={() => updateFlowerCount(flower.id, -1)}
                          disabled={count === 0}
                          className="p-1 text-main-muted hover:text-primary disabled:opacity-30 rounded-l"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-main-text font-sans">
                          {toBengaliNumber(count)}
                        </span>
                        <button
                          onClick={() => updateFlowerCount(flower.id, 1)}
                          className="p-1 text-main-muted hover:text-primary rounded-r"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Color Palette Theme */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-xl font-bold text-main-text">
                  ২. রঙের থিম (Color Palette) নির্ধারণ করুন
                </h2>
                <p className="text-xs text-main-muted mt-0.5">
                  তোড়ার সামগ্রিক কালার মুড নির্বাচন করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_OPTIONS.colorPalettes.map((palette) => {
                  const isSelected = selectedPalette === palette.id;
                  return (
                    <div
                      key={palette.id}
                      onClick={() => setSelectedPalette(palette.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-subtle shadow-soft'
                          : 'border-border-subtle hover:border-border-muted bg-surface-soft/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-main-text">{palette.name}</h4>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check size={12} />
                          </span>
                        )}
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center gap-2 mb-2">
                        {palette.preview.map((color, i) => (
                          <span
                            key={i}
                            className="w-7 h-7 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-main-muted">{palette.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Bouquet Size */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-xl font-bold text-main-text">
                  ৩. তোড়ার আকার ও স্টেম সংখ্যা নির্বাচন
                </h2>
                <p className="text-xs text-main-muted mt-0.5">
                  উপহারের উপলক্ষ অনুযায়ী উপযুক্ত সাইজ পছন্দ করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_OPTIONS.sizes.map((size) => {
                  const isSelected = selectedSize === size.id;
                  return (
                    <div
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-subtle shadow-soft'
                          : 'border-border-subtle hover:border-border-muted bg-surface-soft/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                          {size.badge}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check size={12} />
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-main-text mt-1">{size.name}</h4>
                      <p className="text-sm font-semibold text-primary mt-0.5">
                        {size.label} ({formatBengaliPrice(size.basePrice)} বেস ফি)
                      </p>
                      <p className="text-xs text-main-muted mt-1.5">{size.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Wrapping Style */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-xl font-bold text-main-text">
                  ৪. লাক্সারি র‍্যাপিং ও রিবন স্টাইল
                </h2>
                <p className="text-xs text-main-muted mt-0.5">
                  তোড়ার বাইরের নান্দনিক মোড়ক নির্বাচন করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_OPTIONS.wrappings.map((wrap) => {
                  const isSelected = selectedWrapping === wrap.id;
                  return (
                    <div
                      key={wrap.id}
                      onClick={() => setSelectedWrapping(wrap.id)}
                      className={`flex gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-subtle shadow-soft'
                          : 'border-border-subtle hover:border-border-muted bg-surface-soft/40'
                      }`}
                    >
                      <img
                        src={wrap.image}
                        alt={wrap.name}
                        className="w-16 h-16 rounded-xl object-cover border border-border-subtle shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-main-text">{wrap.name}</h4>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                                <Check size={10} />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-main-subtle">{wrap.tag}</span>
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          +{formatBengaliPrice(wrap.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Special Add-on Gifts */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-xl font-bold text-main-text">
                  ৫. অতিরিক্ত গিফট অ্যাড-অন (ঐচ্ছিক)
                </h2>
                <p className="text-xs text-main-muted mt-0.5">
                  ফুলের সাথে চকলেট, ক্যান্ডেল বা টেডি যোগ করে উপহারকে করুন আরও বিশেষ।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_OPTIONS.addOns.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`flex gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-subtle shadow-soft'
                          : 'border-border-subtle hover:border-border-muted bg-surface-soft/40'
                      }`}
                    >
                      <img
                        src={addon.image}
                        alt={addon.name}
                        className="w-16 h-16 rounded-xl object-cover border border-border-subtle shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-main-text flex items-center gap-1.5">
                              <span>{addon.icon}</span>
                              <span>{addon.name}</span>
                            </h4>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-border-muted bg-white'
                              }`}
                            >
                              {isSelected && <Check size={12} />}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          +{formatBengaliPrice(addon.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Free Greeting Card */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-xl font-bold text-main-text">
                  ৬. ফ্রি গ্রিটিং কার্ড ও মিষ্টি বার্তা
                </h2>
                <p className="text-xs text-main-muted mt-0.5">
                  একটি চমৎকার কার্ডে আমরা আপনার মনের কথা সুন্দর হস্তাক্ষরে লিখে দেব।
                </p>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-xs font-semibold text-main-text mb-1.5">
                  প্রিয়জনের নাম (Recipient Name):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: অনুষ্কা / প্রিয় মায়িশা"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-surface-soft border border-border-muted rounded-xl p-3 text-xs text-main-text focus:outline-none focus:border-primary"
                />
              </div>

              {/* Card Preset Categories */}
              <div>
                <label className="block text-xs font-semibold text-main-text mb-2">
                  কার্ডের ধরন নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BUILDER_OPTIONS.cards.map((card) => {
                    const isSelected = cardDesign === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleCardSelect(card)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'border-primary bg-primary-light text-primary font-bold'
                            : 'border-border-subtle hover:border-border-muted bg-surface-soft text-main-muted'
                        }`}
                      >
                        <span className="text-base">{card.icon}</span>
                        <span className="truncate">{card.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-xs font-semibold text-main-text mb-1.5">
                  কার্ডে লেখার বার্তা:
                </label>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="আপনার বার্তা লিখুন..."
                  className="w-full bg-surface-soft border border-border-muted rounded-xl p-3 text-xs text-main-text focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 7: Final Preview */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="text-xl font-bold text-main-text">
                  ৭. আপনার কাস্টম তোড়ার সম্পূর্ণ রূপরেখা
                </h2>
                <p className="text-xs text-main-muted mt-0.5">
                  সবকিছু ঠিক থাকলে তোড়াটি সরাসরি কার্টে যোগ করুন।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-soft border border-border-subtle space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-main-subtle">কালার থিম:</span>
                    <p className="font-bold text-main-text text-sm mt-0.5">{currentPaletteObj.name}</p>
                  </div>
                  <div>
                    <span className="text-main-subtle">সাইজ ও স্টেম:</span>
                    <p className="font-bold text-main-text text-sm mt-0.5">
                      {currentSizeObj.name} ({toBengaliNumber(totalStemsSelected)} স্টেম)
                    </p>
                  </div>
                  <div>
                    <span className="text-main-subtle">র‍্যাপিং:</span>
                    <p className="font-bold text-main-text text-sm mt-0.5">{currentWrappingObj.name}</p>
                  </div>
                  <div>
                    <span className="text-main-subtle">উপহার প্রাপক:</span>
                    <p className="font-bold text-main-text text-sm mt-0.5">
                      {recipientName || 'প্রিয়জন'}
                    </p>
                  </div>
                </div>

                {customMessage && (
                  <div className="p-3 bg-surface-white rounded-xl border border-border-subtle">
                    <span className="text-[11px] text-main-subtle font-semibold">গ্রিটিং কার্ড বার্তা:</span>
                    <p className="italic text-main-text mt-1">“{customMessage}”</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nav Actions Bottom Bar */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-subtle">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 rounded-full border border-border-muted text-xs font-semibold text-main-muted hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>আগের ধাপ</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="btn-primary-burgundy text-xs py-2.5 px-6 font-semibold"
              >
                <span>পরবর্তী ধাপ</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteAndAddToCart}
                className="btn-primary-burgundy text-sm py-3 px-8 font-bold shadow-soft flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>কার্টে যোগ করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Price & Summary Card (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-surface-white border border-border-muted rounded-3xl p-6 shadow-soft space-y-4">
            
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-main-text flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span>লাইভ সামারি</span>
              </h3>
              <span className="text-xs text-primary font-bold bg-primary-light px-2.5 py-0.5 rounded-full">
                {currentSizeObj.name}
              </span>
            </div>

            {/* Selected Flowers Count Breakdown */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-main-text">বাছাইকৃত ফুল:</span>
              {Object.keys(selectedFlowers).length === 0 ? (
                <p className="text-main-subtle italic">এখনো কোনো ফুল বাছাই করা হয়নি</p>
              ) : (
                <div className="space-y-1 bg-surface-soft p-3 rounded-xl border border-border-subtle">
                  {Object.entries(selectedFlowers).map(([fId, count]) => {
                    const flower = BUILDER_OPTIONS.flowers.find((f) => f.id === fId);
                    if (!flower) return null;
                    return (
                      <div key={fId} className="flex justify-between text-main-muted">
                        <span>
                          {flower.name} × {toBengaliNumber(count)}
                        </span>
                        <span className="font-medium text-main-text">
                          {formatBengaliPrice(flower.pricePerStem * count)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wrapping & Addons Breakdown */}
            <div className="space-y-1.5 text-xs text-main-muted border-t border-border-subtle pt-3">
              <div className="flex justify-between">
                <span>র‍্যাপিং: {currentWrappingObj.name}</span>
                <span className="font-semibold text-main-text">+{formatBengaliPrice(wrappingCost)}</span>
              </div>
              {selectedAddOns.length > 0 && (
                <div className="flex justify-between">
                  <span>অতিরিক্ত গিফট ({toBengaliNumber(selectedAddOns.length)}টি)</span>
                  <span className="font-semibold text-main-text">+{formatBengaliPrice(addOnsCost)}</span>
                </div>
              )}
            </div>

            {/* Total Calculation */}
            <div className="pt-3 border-t border-border-muted flex items-baseline justify-between">
              <span className="text-sm font-bold text-main-text">মোট প্রাক্কলিত মূল্য:</span>
              <span className="text-2xl font-bold text-primary">{formatBengaliPrice(totalPrice)}</span>
            </div>

            <button
              onClick={handleCompleteAndAddToCart}
              className="w-full btn-primary-burgundy py-3 text-sm font-bold shadow-soft flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>তোড়াটি কার্টে নিন</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-main-muted opacity-80 pt-1">
              <ShieldCheck size={14} className="text-accent-green" />
              <span>দক্ষ ফ্লোরিস্ট দ্বারা প্রস্তুতকৃত ও তাজা ডেলিভারি</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
