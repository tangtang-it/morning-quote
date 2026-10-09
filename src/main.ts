declare global {
  interface Window {
    __INITIAL_CATEGORY__?: string;
  }
}
import 'iconify-icon';
import { CardRenderer, TextPlacement, TextMood, TextColorMode } from './engine/CardRenderer';
import { FanSpreadDeck } from './engine/FanSpreadDeck';
import { STYLE_PRESETS, AspectRatio, StylePreset, BackgroundEffect, BADGE_OPTIONS, BadgeOption } from './engine/presets';
import { QUOTES_DATA, QuoteItem } from './data/quotes';

document.addEventListener('DOMContentLoaded', () => {
  const lang = (document.documentElement.lang || 'en') as 'en' | 'es' | 'pt';
  const localeData = QUOTES_DATA[lang] || QUOTES_DATA.en;

  // DOM Elements
  const canvasEl = document.getElementById('cardCanvas') as HTMLCanvasElement;
  if (!canvasEl) return;

  const renderer = new CardRenderer(canvasEl);

  // Preload photo background assets for instant rendering
  // Preload Agnes AI generated badge icons for instant rendering
  BADGE_OPTIONS.forEach(b => {
    if (b.iconUrl) {
      renderer.preloadImage(b.iconUrl).catch(() => {});
    }
  });

  STYLE_PRESETS.forEach(p => {
    if (p.bgImageUrl) {
      renderer.preloadImage(p.bgImageUrl).catch(() => {});
    }
  });

  // Form Controls
  const inputName = document.getElementById('inputName') as HTMLInputElement;
  const inputQuote = document.getElementById('inputQuote') as HTMLTextAreaElement;
  const inputAuthor = document.getElementById('inputAuthor') as HTMLInputElement;
  const toggleWatermark = document.getElementById('toggleWatermark') as HTMLInputElement;
  const btnShuffle = document.getElementById('btnShuffle') as HTMLButtonElement;
  const btnDownload = document.getElementById('btnDownload') as HTMLButtonElement;
  const btnCopy = document.getElementById('btnCopy') as HTMLButtonElement;
  const btnShare = document.getElementById('btnShare') as HTMLButtonElement;
  const btnCopyText = document.getElementById('btnCopyText') as HTMLButtonElement;
  const toastEl = document.getElementById('toastNotice') as HTMLDivElement;

  // Containers
  const recipientChipsContainer = document.getElementById('recipientChipsContainer') as HTMLDivElement;
  const presetContainer = document.getElementById('presetContainer') as HTMLDivElement;
  const presetFilterContainer = document.getElementById('presetFilterContainer') as HTMLDivElement;
  const bgEffectsContainer = document.getElementById('bgEffectsContainer') as HTMLDivElement;
  const badgesContainer = document.getElementById('badgesContainer') as HTMLDivElement;
  const ratioBtns = document.querySelectorAll<HTMLButtonElement>('.ratio-btn');
  const langSelect = document.getElementById('langSelect') as HTMLSelectElement;

  // Quotes list container
  const catNavContainer = document.getElementById('catNavContainer') as HTMLDivElement;
  const quotesGrid = document.getElementById('quotesGrid') as HTMLDivElement;

  // Mobile Sticky Bar
  const mobileStickyBar = document.getElementById('mobileStickyBar') as HTMLDivElement;
  const stickyBtnDownload = document.getElementById('stickyBtnDownload') as HTMLButtonElement;
  const stickyBtnShare = document.getElementById('stickyBtnShare') as HTMLButtonElement;
  const stickyBtnTop = document.getElementById('stickyBtnTop') as HTMLButtonElement;

  // State Management - Default to Sunrise Bloom Hero Preset & Sunrise Category Filter
  const defaultPreset = STYLE_PRESETS[0]; // Woolly Bear & Warm Coffee (First card in First series)
  let currentPreset: StylePreset = defaultPreset;
  let currentRatio: AspectRatio = '1:1';
  let currentBgEffect: BackgroundEffect = 'auto';
  let currentBadge: BadgeOption = BADGE_OPTIONS[0];
  let currentCategoryFilter = 'sunrise';
  let currentQuotesList = localeData.quotes;
  let currentTextPlacement: TextPlacement = 'top';
  let currentTextMood: TextMood = 'serif';
  let currentTextColorMode: TextColorMode = 'auto';
  let currentTextBackplate = false;

  // Initial quote selection - sync with first card
  const firstWoollyQuote = localeData.quotes.find(q => q.category === 'woolly') || currentQuotesList[0];
  if (inputQuote && !inputQuote.value) {
    inputQuote.value = firstWoollyQuote.quote;
  }
  if (inputAuthor && !inputAuthor.value) {
    inputAuthor.value = firstWoollyQuote.author || '';
  }

  // Toast Helper
  const showToast = (message: string, iconName = 'lucide:check-circle-2') => {
    if (!toastEl) return;
    toastEl.innerHTML = `<iconify-icon icon="${iconName}"></iconify-icon><span>${message}</span>`;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  };

  // Render Function
  const updateCard = () => {
    renderer.render({
      recipientName: inputName?.value || '',
      quoteText: inputQuote?.value || 'Good morning! Have a bright day.',
      authorText: inputAuthor?.value || '',
      preset: currentPreset,
      aspectRatio: currentRatio,
      showWatermark: toggleWatermark ? toggleWatermark.checked : true,
      backgroundEffect: currentBgEffect,
      badgeOption: currentBadge,
      textPlacement: currentTextPlacement,
      textMood: currentTextMood,
      textColorMode: currentTextColorMode,
      textBackplate: currentTextBackplate,
    });
  };

  // Pulse effect helper when quote transferred
  const triggerCanvasPulse = () => {
    canvasEl.classList.remove('highlight-pulse');
    void canvasEl.offsetWidth; // trigger reflow
    canvasEl.classList.add('highlight-pulse');
  };

  // 1. Mount Fan Spread Background Deck (Poker-Style)
  const fanDeckViewport = document.getElementById('fanDeckViewport') as HTMLDivElement;
  const fanDeckActiveName = document.getElementById('fanDeckActiveName') as HTMLElement;
  const btnShuffleDeck = document.getElementById('btnShuffleDeck') as HTMLButtonElement;
  let fanDeck: FanSpreadDeck | null = null;

  if (fanDeckViewport) {
    const initialSeries = 'woolly';
    const initialSeriesPresets = STYLE_PRESETS.filter(p => p.category === initialSeries);
    fanDeck = new FanSpreadDeck(
      fanDeckViewport,
      initialSeriesPresets.length > 0 ? initialSeriesPresets : STYLE_PRESETS,
      (selectedPreset) => {
        currentPreset = selectedPreset;
        if (fanDeckActiveName) {
          fanDeckActiveName.textContent = selectedPreset.name;
        }
        updateCard();
      },
      defaultPreset.id
    );
    if (fanDeckActiveName) {
      fanDeckActiveName.textContent = currentPreset.name;
    }
  }

  // Series Nav Tabs Handler (h���bh)
  const seriesNavBar = document.getElementById('seriesNavBar') as HTMLDivElement;

  // Retrieve all series categories currently present in DOM or presets
  const getAvailableSeriesCategories = (): string[] => {
    const navButtons = document.querySelectorAll<HTMLButtonElement>('#seriesNavBar .series-tab-btn');
    const navSeries = Array.from(navButtons)
      .map(btn => btn.getAttribute('data-series'))
      .filter((s): s is string => Boolean(s && s !== 'all'));
    if (navSeries.length > 0) return navSeries;

    const catSet = new Set<string>();
    STYLE_PRESETS.forEach(p => {
      if (p.bgImageUrl && p.category) catSet.add(p.category);
    });
    return Array.from(catSet);
  };

  // Build balanced, interleaved themes collection across all available series
  const getAllThemesPresets = (): StylePreset[] => {
    const categories = getAvailableSeriesCategories();
    const presetsByCat: StylePreset[][] = categories.map(cat =>
      STYLE_PRESETS.filter(p => p.category === cat)
    );

    const result: StylePreset[] = [];
    const maxLen = Math.max(...presetsByCat.map(arr => arr.length), 0);
    
    // Interleave across series so the user sees cards from every series in the fan arc
    for (let i = 0; i < maxLen; i++) {
      for (const catList of presetsByCat) {
        if (i < catList.length) {
          result.push(catList[i]);
        }
      }
    }

    // Only retain curated presets from newly made series for visual consistency and delicacy

    return result;
  };

  const filterPresetsBySeries = (series: string): StylePreset[] => {
    if (series === 'all') {
      return getAllThemesPresets();
    }
    // Dynamically match any current or future series by category
    const matched = STYLE_PRESETS.filter(p => p.category === series);
    if (matched.length > 0) {
      return matched;
    }
    return getAllThemesPresets();
  };

  if (seriesNavBar && fanDeck) {
    const seriesBtns = seriesNavBar.querySelectorAll<HTMLButtonElement>('.series-tab-btn');

    seriesBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        seriesBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const seriesKey = btn.getAttribute('data-series') || 'all';
        const filtered = filterPresetsBySeries(seriesKey);
        if (filtered.length > 0) {
          // If current active preset belongs to filtered list, preserve it; otherwise use first
          const keepId = filtered.some(p => p.id === currentPreset.id) ? currentPreset.id : filtered[0].id;
          fanDeck!.setPresets(filtered, keepId);
          currentPreset = filtered.find(p => p.id === keepId) || filtered[0];
          if (fanDeckActiveName) {
            fanDeckActiveName.textContent = currentPreset.name;
          }
          updateCard();
          
          // Sync default series quote if user has not entered custom text
          const targetCat = seriesKey === 'all' ? 'inspirational' : seriesKey;
          let seriesQuotes = localeData.quotes.filter(q => q.category === targetCat);
          if (seriesQuotes.length === 0 && seriesKey !== 'all') {
            seriesQuotes = localeData.quotes.filter(q => q.category === 'woolly');
          }
          if (seriesQuotes.length > 0 && inputQuote && inputQuote.value.length < 90) {
            inputQuote.value = seriesQuotes[0].quote;
            if (inputAuthor) inputAuthor.value = seriesQuotes[0].author || '';
            updateCard();
            triggerCanvasPulse();
          }
          
          const seriesName = btn.querySelector('span')?.textContent || seriesKey;
          showToast("" + seriesName + " (" + filtered.length + " themes)", 'lucide:sparkles');
        }
      });
    });
  }

  // Text Styling Controls (排版重心、字体气质、颜色与磨砂垫交互)
  const placementBtns = document.querySelectorAll<HTMLButtonElement>('#placementGroup .style-pill-btn');
  placementBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      placementBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTextPlacement = (btn.getAttribute('data-placement') || 'top') as TextPlacement;
      updateCard();
      triggerCanvasPulse();
    });
  });

  const moodBtns = document.querySelectorAll<HTMLButtonElement>('#moodGroup .style-pill-btn');
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTextMood = (btn.getAttribute('data-mood') || 'serif') as TextMood;
      updateCard();
      triggerCanvasPulse();
    });
  });

  const colorModeBtns = document.querySelectorAll<HTMLButtonElement>('#colorModeGroup .style-pill-btn');
  colorModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTextColorMode = (btn.getAttribute('data-colormode') || 'auto') as TextColorMode;
      updateCard();
      triggerCanvasPulse();
    });
  });

  const toggleTextBackplate = document.getElementById('toggleTextBackplate') as HTMLInputElement;
  if (toggleTextBackplate) {
    toggleTextBackplate.addEventListener('change', () => {
      currentTextBackplate = toggleTextBackplate.checked;
      updateCard();
      triggerCanvasPulse();
    });
  }



  // 2. Random Background Shuffle Button
  if (btnShuffleDeck && fanDeck) {
    btnShuffleDeck.addEventListener('click', () => {
      const chosen = fanDeck.shuffleRandom();
      if (fanDeckActiveName) {
        fanDeckActiveName.textContent = chosen.name;
      }
      showToast(chosen.name, 'lucide:sparkles');
    });
  }

  // 3. Quick Recipient Chips
  const recipientSuggestions: Record<'en' | 'es' | 'pt', string[]> = {
    en: ['Mom', 'My Love', 'Dad', 'Bestie', 'Dear Friend', 'Sister'],
    es: ['Mamá', 'Mi Amor', 'Papá', 'Amiga', 'Familia', 'Amor'],
    pt: ['Mãe', 'Meu Amor', 'Pai', 'Amigo(a)', 'Família', 'Querida']
  };

  if (recipientChipsContainer) {
    recipientChipsContainer.innerHTML = '';
    const suggestions = recipientSuggestions[lang] || recipientSuggestions.en;
    suggestions.forEach(name => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'recipient-chip-btn';
      chip.textContent = '+ ' + name;
      chip.addEventListener('click', () => {
        if (inputName) {
          if (inputName.value === name) {
            inputName.value = '';
            chip.classList.remove('active');
          } else {
            inputName.value = name;
            document.querySelectorAll('.recipient-chip-btn').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
          }
          updateCard();
        }
      });
      recipientChipsContainer.appendChild(chip);
    });
  }

  // 4. Ratio Buttons
  ratioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      ratioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRatio = (btn.getAttribute('data-ratio') || '1:1') as AspectRatio;
      updateCard();
    });
  });

  // 5. Realtime Input Events
  [inputName, inputQuote, inputAuthor].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      updateCard();
    });
  });

  if (toggleWatermark) {
    toggleWatermark.addEventListener('change', () => {
      updateCard();
    });
  }

  // 6. Shuffle Button
  if (btnShuffle) {
    btnShuffle.addEventListener('click', () => {
      const pool = localeData.quotes;
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      if (randomItem) {
        if (inputQuote) inputQuote.value = randomItem.quote;
        if (inputAuthor) inputAuthor.value = randomItem.author || '';
        updateCard();
        triggerCanvasPulse();
        const toastMsg = lang === 'es' ? '¡Frase aleatoria cargada!' : lang === 'pt' ? 'Frase aleatória carregada!' : 'Loaded a fresh quote!';
        showToast(toastMsg, 'lucide:sparkles');
      }
    });
  }


  // Dynamic Quote Library Link Text Sync (自动动态同步句库数量)
  const browseLinkText = document.getElementById('browseLibraryLinkText');
  if (browseLinkText) {
    const total = localeData.quotes.length;
    const rounded = Math.floor(total / 10) * 10;
    const countStr = rounded >= 50 ? `${rounded}+` : `${total}`;
    if (lang === 'es') {
      browseLinkText.textContent = `Ver Biblioteca de Frases (${countStr}) ↓`;
    } else if (lang === 'pt') {
      browseLinkText.textContent = `Ver Coleção de Frases (${countStr}) ↓`;
    } else {
      browseLinkText.textContent = `Explore Quote Library (${countStr}) ↓`;
    }
  }

  // 7. Copy Text Only Action (Zero Friction for pure message sharing)
  if (btnCopyText) {
    btnCopyText.addEventListener('click', async () => {
      const text = inputQuote?.value || '';
      const to = inputName?.value?.trim() ? `To ${inputName.value}: \n` : '';
      const by = inputAuthor?.value?.trim() ? `\n— ${inputAuthor.value}` : '';
      const fullText = `${to}${text}${by}`;

      try {
        await navigator.clipboard.writeText(fullText);
        const toastMsg = lang === 'es' ? '¡Texto de la frase copiado!' : lang === 'pt' ? 'Texto copiado com sucesso!' : 'Quote text copied to clipboard!';
        showToast(toastMsg, 'lucide:clipboard-check');
      } catch (err) {
        showToast('Could not copy text.', 'lucide:alert-triangle');
      }
    });
  }

  // 8. Download Handler
  const handleDownload = async () => {
    const originalHtml = btnDownload?.innerHTML || '';
    if (btnDownload) btnDownload.innerHTML = '<iconify-icon icon="line-md:loading-loop"></iconify-icon><span>Generating...</span>';
    if (stickyBtnDownload) stickyBtnDownload.innerHTML = '<iconify-icon icon="line-md:loading-loop"></iconify-icon>';

    try {
      const safeName = (inputName?.value || 'greeting').trim().replace(/[^a-zA-Z0-9]/g, '_');
      await renderer.download(`morning-quote-${safeName}.png`);
      const toastMsg = lang === 'es' ? '¡Tarjeta HD descargada con éxito!' : lang === 'pt' ? 'Cartão HD baixado com sucesso!' : 'High-resolution card downloaded!';
      showToast(toastMsg, 'lucide:download-cloud');
    } catch (err) {
      console.error(err);
      showToast('Failed to download image.', 'lucide:alert-circle');
    } finally {
      if (btnDownload) btnDownload.innerHTML = originalHtml;
      if (stickyBtnDownload) stickyBtnDownload.innerHTML = '<iconify-icon icon="lucide:download"></iconify-icon><span>Download</span>';
    }
  };

  if (btnDownload) btnDownload.addEventListener('click', handleDownload);
  if (stickyBtnDownload) stickyBtnDownload.addEventListener('click', handleDownload);

  // 9. Copy to Clipboard Button (Image)
  if (btnCopy) {
    btnCopy.addEventListener('click', async () => {
      try {
        const ok = await renderer.copyToClipboard();
        if (ok) {
          const toastMsg = lang === 'es' ? '¡Imagen copiada al portapapeles! Lista para pegar en WhatsApp.' : lang === 'pt' ? 'Imagem copiada! Pronta para colar no WhatsApp.' : 'Card image copied! Ready to paste into WhatsApp.';
          showToast(toastMsg, 'lucide:clipboard-check');
        } else {
          showToast('Direct copy not supported. Please use Download.', 'lucide:info');
        }
      } catch (err) {
        console.error(err);
        showToast('Could not copy image.', 'lucide:alert-triangle');
      }
    });
  }

  // 10. Share Handler (Enhanced Deep Linking for WhatsApp & Social)
  const handleShare = async () => {
    try {
      const blob = await renderer.exportBlob('image/png', 0.95);
      const file = new File([blob], 'morning-quote.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Good Morning Greeting',
          text: inputQuote?.value || 'Good morning!',
          files: [file]
        });
      } else {
        // High quality WhatsApp deep link with quote text
        const toPrefix = inputName?.value?.trim() ? `To ${inputName.value.trim()}: \n` : '';
        const quoteContent = inputQuote?.value || 'Good morning! Have a blessed day.';
        const authorSuffix = inputAuthor?.value?.trim() ? ` — ${inputAuthor.value.trim()}` : '';
        const shareMsg = encodeURIComponent(`${toPrefix}“${quoteContent}”${authorSuffix}\n\n🌅 Created with https://morning-quote.com`);
        window.open(`https://api.whatsapp.com/send?text=${shareMsg}`, '_blank');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (btnShare) btnShare.addEventListener('click', handleShare);
  const btnShareTop = document.getElementById('btnShareTop') as HTMLButtonElement;
  if (btnShareTop) btnShareTop.addEventListener('click', handleShare);
  if (stickyBtnShare) stickyBtnShare.addEventListener('click', handleShare);

  if (stickyBtnTop) {
    stickyBtnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 11. Mobile Sticky Bar Observer (Trigger when canvas scrolls out of view)
  if (mobileStickyBar && canvasEl) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When canvas is NOT visible, show floating bottom bar on mobile
        if (!entry.isIntersecting && window.innerWidth <= 960) {
          mobileStickyBar.classList.add('visible');
        } else {
          mobileStickyBar.classList.remove('visible');
        }
      });
    }, { threshold: 0.15 });

    observer.observe(canvasEl);
  }

  // 12. Language Selector Redirection
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const targetLang = (e.target as HTMLSelectElement).value;
      if (targetLang === 'es') {
        window.location.href = '/es/';
      } else if (targetLang === 'pt') {
        window.location.href = '/pt/';
      } else {
        window.location.href = '/';
      }
    });
  }

  // 13. Quotes Library Progressive Rendering (渐进式折叠展开)
  const quotesExpandContainer = document.getElementById('quotesExpandContainer') as HTMLDivElement;
  const QUOTE_PAGE_SIZE = 6;
  let currentVisibleQuotesCount = QUOTE_PAGE_SIZE;
  let activeQuotesCategoryKey: string | undefined = undefined;

  const renderQuotesGrid = (categoryKey?: string, isAppend = false) => {
    if (!quotesGrid) return;

    // Reset count when switching category
    if (categoryKey !== activeQuotesCategoryKey) {
      activeQuotesCategoryKey = categoryKey;
      currentVisibleQuotesCount = QUOTE_PAGE_SIZE;
    }

    if (!isAppend) {
      quotesGrid.innerHTML = '';
    }

    const allFiltered = activeQuotesCategoryKey
      ? localeData.quotes.filter(q => q.category === activeQuotesCategoryKey)
      : localeData.quotes;

    const totalQuotes = allFiltered.length;
    const displayList = allFiltered.slice(0, currentVisibleQuotesCount);
    const useLabel = lang === 'es' ? 'Usar en tarjeta' : lang === 'pt' ? 'Usar no cartão' : 'Use on Card';

    // Render cards
    quotesGrid.innerHTML = '';
    displayList.forEach((item: QuoteItem) => {
      const card = document.createElement('div');
      card.className = 'quote-item-card quote-fade-in';
      card.innerHTML = `
        <p class="quote-item-text">“${item.quote}”</p>
        <div class="quote-item-footer">
          <span class="quote-item-author">${item.author ? '— ' + item.author : ''}</span>
          <button class="btn-use-quote" type="button">
            <iconify-icon icon="lucide:wand-sparkles"></iconify-icon>
            <span>${useLabel}</span>
          </button>
        </div>
      `;

      const useBtn = card.querySelector('.btn-use-quote');
      if (useBtn) {
        useBtn.addEventListener('click', () => {
          if (inputQuote) inputQuote.value = item.quote;
          if (inputAuthor) inputAuthor.value = item.author || '';
          updateCard();
          triggerCanvasPulse();
          const toastMsg = lang === 'es' ? '¡Frase transferida al lienzo!' : lang === 'pt' ? 'Frase aplicada ao cartão!' : 'Quote transferred to your card!';
          showToast(toastMsg, 'lucide:sparkles');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      quotesGrid.appendChild(card);
    });

    // Render Expand / Collapse Control Bar
    if (quotesExpandContainer) {
      quotesExpandContainer.innerHTML = '';

      if (totalQuotes > QUOTE_PAGE_SIZE) {
        const isFullyExpanded = currentVisibleQuotesCount >= totalQuotes;
        const expandBtn = document.createElement('button');
        expandBtn.type = 'button';

        if (!isFullyExpanded) {
          expandBtn.className = 'btn-expand-quotes';
          const expandLabel = lang === 'es' 
            ? `Ver Más Frases (${currentVisibleQuotesCount}/${totalQuotes})` 
            : lang === 'pt' 
            ? `Ver Mais Frases (${currentVisibleQuotesCount}/${totalQuotes})` 
            : `Show More Quotes (${currentVisibleQuotesCount}/${totalQuotes})`;
          expandBtn.innerHTML = `<iconify-icon icon="lucide:chevron-down"></iconify-icon><span>${expandLabel}</span>`;

          expandBtn.addEventListener('click', () => {
            currentVisibleQuotesCount = Math.min(totalQuotes, currentVisibleQuotesCount + QUOTE_PAGE_SIZE);
            renderQuotesGrid(activeQuotesCategoryKey, true);
          });
        } else {
          expandBtn.className = 'btn-expand-quotes collapse-mode';
          const collapseLabel = lang === 'es' ? 'Mostrar Menos ↑' : lang === 'pt' ? 'Mostrar Menos ↑' : 'Show Less ↑';
          expandBtn.innerHTML = `<iconify-icon icon="lucide:chevron-up"></iconify-icon><span>${collapseLabel}</span>`;

          expandBtn.addEventListener('click', () => {
            currentVisibleQuotesCount = QUOTE_PAGE_SIZE;
            renderQuotesGrid(activeQuotesCategoryKey);
            const targetAnchor = document.querySelector('.seo-h2') as HTMLElement;
            if (targetAnchor) {
              targetAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }

        quotesExpandContainer.appendChild(expandBtn);
      }
    }
  };

  // Build Category Navigation
  if (catNavContainer) {
    catNavContainer.innerHTML = '';
    
    // "All" Tab
    const allBtn = document.createElement('button');
    allBtn.className = 'cat-tab-btn active';
    allBtn.type = 'button';
    allBtn.innerHTML = '<iconify-icon icon="lucide:sparkles"></iconify-icon><span>' + (lang === 'es' ? 'Todas' : lang === 'pt' ? 'Todas' : 'All Quotes') + '</span>';
    allBtn.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
      renderQuotesGrid();
    });
    catNavContainer.appendChild(allBtn);

    localeData.categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'cat-tab-btn';
      btn.type = 'button';
      btn.innerHTML = '<iconify-icon icon="lucide:tag"></iconify-icon><span>' + cat.label + '</span>';
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderQuotesGrid(cat.key);
      });
      catNavContainer.appendChild(btn);
    });

    const initCat = window.__INITIAL_CATEGORY__;
    if (initCat) {
      const matchBtn = Array.from(catNavContainer.querySelectorAll('.cat-tab-btn')).find(b => b.textContent?.toLowerCase().includes(initCat) || b.getAttribute('data-cat') === initCat);
      document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
      if (matchBtn) matchBtn.classList.add('active');
      renderQuotesGrid(initCat);
      const catQuotes = localeData.quotes.filter(q => q.category === initCat);
      if (catQuotes.length > 0 && inputQuote) {
        inputQuote.value = catQuotes[0].quote;
        if (inputAuthor) inputAuthor.value = catQuotes[0].author || '';
        updateCard();
      }
    } else {
      renderQuotesGrid();
    }
  }

  // 14. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });

  
  // In-situ Canvas Toolbar Actions
  const inSituCopy = document.getElementById('inSituCopy') as HTMLButtonElement;
  const inSituShuffle = document.getElementById('inSituShuffle') as HTMLButtonElement;
  if (inSituCopy && btnCopy) {
    inSituCopy.addEventListener('click', () => btnCopy.click());
  }
  if (inSituShuffle && btnShuffle) {
    inSituShuffle.addEventListener('click', () => btnShuffle.click());
  }

  // ==========================================
  // Dynamic Curated Bento Showcase (全自动动态画报展台)
  // ==========================================
  const trendingContainer = document.getElementById('trendingContainer') as HTMLDivElement;
  const trendingFilterBar = document.getElementById('trendingFilterBar') as HTMLDivElement;

  const SERIES_META: Record<string, { icon: string; recipients: Record<'en' | 'es' | 'pt', string[]> }> = {
    woolly: { icon: '🧸', recipients: { en: ['Sarah', 'Sweetheart', 'Bestie', 'Brother', 'My Love', 'Mom'], es: ['Mamá', 'Mi Amor', 'Amiga', 'Hermano', 'Cariño', 'Abuela'], pt: ['Meu Amor', 'Querida', 'Amigo(a)', 'Família', 'Mãe', 'Pai'] } },
    cafe: { icon: '☕', recipients: { en: ['Sarah', 'Alex', 'My Love', 'Mom', 'Emma', 'Bestie'], es: ['Mamá', 'Mi Amor', 'Amiga', 'Hermana', 'Cariño', 'Papá'], pt: ['Meu Amor', 'Mãe', 'Amigo(a)', 'Pai', 'Querida', 'Família'] } },
    floral: { icon: '🌸', recipients: { en: ['Mom', 'Sarah', 'Bestie', 'My Love', 'Sister', 'Friend'], es: ['Mamá', 'Amiga', 'Hermana', 'Mi Amor', 'Abuela', 'Familia'], pt: ['Mãe', 'Querida', 'Amiga', 'Meu Amor', 'Paz', 'Família'] } },
    horizon: { icon: '🌅', recipients: { en: ['Alex', 'Team', 'Brother', 'Future Me', 'Friend', 'Leader'], es: ['Equipo', 'Hermano', 'Amigo', 'Hijo', 'Compañero', 'Líder'], pt: ['Equipe', 'Amigo(a)', 'Irmão', 'Parceiro', 'Família', 'Líder'] } }
  };

  interface DynamicTrendingCard {
    preset: StylePreset;
    tag: string;
    recipient: string;
    quote: string;
    author: string;
    isHero: boolean;
  }

  const getDynamicCards = (seriesKey: string): DynamicTrendingCard[] => {
    const quotesPool = localeData.quotes;

    if (seriesKey === 'all') {
      const navBtns = document.querySelectorAll<HTMLButtonElement>('#seriesNavBar .series-tab-btn');
      const navCats = Array.from(navBtns).map(b => b.getAttribute('data-series')).filter((s): s is string => Boolean(s && s !== 'all'));
      const allCategories = navCats.length > 0 ? navCats : ['woolly', 'cafe', 'floral', 'horizon'];
      const result: DynamicTrendingCard[] = [];
      allCategories.forEach(cat => {
        const catPresets = STYLE_PRESETS.filter(p => p.category === cat);
        const catQuotes = quotesPool.filter(q => q.category === cat);
        catPresets.slice(0, 3).forEach((p, idx) => {
          const q = catQuotes[idx % catQuotes.length] || quotesPool[0];
          const meta = SERIES_META[cat];
          const recList = meta?.recipients[lang] || ['Friend'];
          result.push({
            preset: p,
            tag: p.badgeText || `${meta?.icon || '✦'} ${p.name}`,
            recipient: recList[idx % recList.length] || '',
            quote: q.quote,
            author: q.author || p.name,
            isHero: false
          });
        });
      });
      return result;
    }

    const catPresets = STYLE_PRESETS.filter(p => p.category === seriesKey);
    const catQuotes = quotesPool.filter(q => q.category === seriesKey);
    const meta = SERIES_META[seriesKey];
    const recList = meta?.recipients[lang] || ['Friend'];

    return catPresets.map((p, idx) => {
      const q = catQuotes[idx % catQuotes.length] || quotesPool[0];
      return {
        preset: p,
        tag: p.badgeText || `${meta?.icon || '✦'} ${p.name}`,
        recipient: recList[idx % recList.length] || '',
        quote: q.quote,
        author: q.author || p.name,
        isHero: idx === 0
      };
    });
  };

  const renderTrendingBento = (activeSeries: string) => {
    if (!trendingContainer) return;
    trendingContainer.innerHTML = '';
    
    if (activeSeries !== 'all') {
      trendingContainer.classList.add('bento-active');
    } else {
      trendingContainer.classList.remove('bento-active');
    }

    const cards = getDynamicCards(activeSeries);
    const cloneLabel = lang === 'es' ? 'Usar Diseño ↑' : lang === 'pt' ? 'Usar Modelo ↑' : 'Clone Design ↑';

    cards.forEach((item, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'trending-card' + (item.isHero ? ' bento-hero' : ' bento-companion') + ' bento-animate';
      cardEl.style.animationDelay = `${index * 0.05}s`;

      const targetPreset = item.preset;
      let previewBg = '';
      if (targetPreset.bgImageUrl) {
        previewBg = `<img src="${targetPreset.bgImageUrl}" alt="${targetPreset.name}" class="preview-bg-img" loading="lazy"><div class="preview-overlay"></div>`;
      } else {
        const bgGrad = `linear-gradient(${targetPreset.gradientAngle}deg, ${targetPreset.bgColors.join(', ')})`;
        previewBg = `<div style="position: absolute; inset: 0; background: ${bgGrad};"></div>`;
      }

      const heroBadgeHtml = item.isHero 
        ? `<div class="bento-hero-badge"><iconify-icon icon="lucide:sparkles"></iconify-icon><span>✦ FEATURED HERO</span></div>` 
        : '';

      cardEl.innerHTML = `
        <div class="trending-card-preview">
          ${previewBg}
          <div class="trending-card-content">
            ${heroBadgeHtml}
            <div class="trending-tag">${item.tag}</div>
            ${item.recipient ? `<div class="trending-recipient">To: ${item.recipient}</div>` : ''}
            <div class="trending-text">“${item.quote}”</div>
            ${item.author ? `<div class="trending-author">— ${item.author}</div>` : ''}
          </div>
        </div>
        <div class="trending-card-footer">
          <div class="trending-preset-label">
            <span class="preset-color-dot" style="background: ${targetPreset.bgColors[0]};"></span>
            <span>${targetPreset.name}</span>
          </div>
          <span class="trending-clone-badge">
            <iconify-icon icon="lucide:sparkles"></iconify-icon>
            <span>${cloneLabel}</span>
          </span>
        </div>
      `;

      cardEl.addEventListener('click', () => {
        currentPreset = targetPreset;
        currentBgEffect = 'auto';

        if (inputName) inputName.value = item.recipient;
        if (inputQuote) inputQuote.value = item.quote;
        if (inputAuthor) inputAuthor.value = item.author;

        if (targetPreset.category === 'woolly') {
          currentTextMood = 'handwriting';
        } else if (targetPreset.category === 'cafe' || targetPreset.category === 'floral') {
          currentTextMood = 'serif';
        } else {
          currentTextMood = 'modern';
        }
        document.querySelectorAll('#moodGroup .style-pill-btn').forEach(b => {
          if (b.getAttribute('data-mood') === currentTextMood) b.classList.add('active');
          else b.classList.remove('active');
        });

        const seriesKey = targetPreset.category || 'all';
        const seriesBtns = document.querySelectorAll<HTMLButtonElement>('#seriesNavBar .series-tab-btn');
        seriesBtns.forEach(b => {
          if (b.getAttribute('data-series') === seriesKey) b.classList.add('active');
          else b.classList.remove('active');
        });

        if (fanDeck) {
          const filteredPresets = STYLE_PRESETS.filter(p => p.category === seriesKey);
          if (filteredPresets.length > 0) {
            fanDeck.setPresets(filteredPresets, targetPreset.id);
          } else {
            fanDeck.setActiveById(targetPreset.id);
          }
          if (fanDeckActiveName) {
            fanDeckActiveName.textContent = targetPreset.name;
          }
        }

        updateCard();
        triggerCanvasPulse();

        const toastMsg = lang === 'es' ? '¡Plantilla cargada en tu tarjeta!' : lang === 'pt' ? 'Modelo aplicado ao seu cartão!' : `Loaded "${targetPreset.name}" to your card!`;
        showToast(toastMsg, 'lucide:sparkles');

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      trendingContainer.appendChild(cardEl);
    });
  };

  if (trendingFilterBar) {
    const filterBtns = trendingFilterBar.querySelectorAll<HTMLButtonElement>('.trending-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const series = btn.getAttribute('data-series') || 'woolly';
        renderTrendingBento(series);
      });
    });
  }

  renderTrendingBento('woolly');

  // 15. Initial Canvas Draw (Ensures photo & typography sync)
  const initDraw = () => {
    if (currentPreset.bgImageUrl) {
      renderer.preloadImage(currentPreset.bgImageUrl).finally(() => {
        updateCard();
      });
    } else {
      updateCard();
    }
  };

  if ('fonts' in document) {
    document.fonts.ready.then(initDraw);
  } else {
    initDraw();
  }
});
