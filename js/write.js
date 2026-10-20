// [화면 3: 글쓰기 (내 물건 팔기)] 모듈 - js/write.js
(function () {
  const SAMPLE_PRESETS = [
    { id: 'potato', label: '포슬 햇감자', emoji: '🥔', bg: '#F5EBE0', accent: '#D4A373', svgTitle: '포슬포슬 햇감자' },
    { id: 'lamp', label: '우드 조명', emoji: '💡', bg: '#FAF0CA', accent: '#E6CCB2', svgTitle: '우드 스탠드 조명' },
    { id: 'digital', label: '디지털/음향', emoji: '🎧', bg: '#E8ECEF', accent: '#CBD5E1', svgTitle: '무선 헤드폰' },
    { id: 'cafe', label: '홈카페 소품', emoji: '☕', bg: '#EDE0D4', accent: '#DDB892', svgTitle: '감성 홈카페 세트' },
    { id: 'plant', label: '인테리어 화분', emoji: '🪴', bg: '#E8F5E9', accent: '#C8E6C9', svgTitle: '반려식물 테라코타' }
  ];

  const CATEGORY_EMOJI_MAP = {
    '디지털기기': { emoji: '📱', bg: '#F5EBE0', accent: '#E3D5CA' },
    '가구/인테리어': { emoji: '🪑', bg: '#EDE0D4', accent: '#DDB892' },
    '의류': { emoji: '🧶', bg: '#F2E9E4', accent: '#C9ADA7' },
    '생활가전': { emoji: '🍞', bg: '#FAF0CA', accent: '#F4D35E' },
    '도서/티켓': { emoji: '📚', bg: '#E8ECEF', accent: '#CBD5E1' },
    '기타': { emoji: '🥔', bg: '#EFE5DC', accent: '#D4A373' }
  };

  function makeSvgImage(bgHex, accentHex, emoji, label) {
    if (typeof window.createProductSvgDataUri === 'function') {
      return window.createProductSvgDataUri(bgHex, accentHex, emoji, label);
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bgHex}"/>
          <stop offset="100%" stop-color="${accentHex}"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#g)"/>
      <circle cx="300" cy="195" r="95" fill="rgba(255,255,255,0.55)"/>
      <text x="300" y="220" font-size="84" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      <text x="300" y="345" font-family="Pretendard, sans-serif" font-size="24" font-weight="700" fill="#4A3525" text-anchor="middle">${label}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  window.GamzaWrite = {
    containerEl: null,
    callbacks: {},
    currentImageData: '',
    selectedFile: null,
    activePresetId: '',
    editingProductId: null,
    isSubmitting: false,
    _keydownHandler: null,

    init(containerEl, callbacks = {}) {
      if (!containerEl) return;
      this.containerEl = containerEl;
      this.callbacks = callbacks || {};
      this.currentImageData = '';
      this.selectedFile = null;
      this.activePresetId = '';
      this.editingProductId = null;
      this.isSubmitting = false;

      this.render();
      this.bindEvents();
    },

    getCategories() {
      const raw = Array.isArray(window.GAMZA_CATEGORIES)
        ? window.GAMZA_CATEGORIES
        : ['디지털기기', '가구/인테리어', '의류', '생활가전', '도서/티켓', '기타'];
      return raw.filter((cat) => cat !== '전체');
    },

    getStatuses() {
      return Array.isArray(window.GAMZA_STATUSES)
        ? window.GAMZA_STATUSES
        : ['판매중', '예약중', '거래 완료'];
    },

    render() {
      const categories = this.getCategories();
      const statuses = this.getStatuses();

      const categoryOptionsHtml = categories
        .map((cat) => `<option value="${cat}">${cat}</option>`)
        .join('');

      const sampleButtonsHtml = SAMPLE_PRESETS.map(
        (preset) => `
          <button type="button" class="write-sample-btn" data-preset-id="${preset.id}">
            <span>${preset.emoji}</span>
            <span>${preset.label}</span>
          </button>
        `
      ).join('');

      const statusTabsHtml = statuses
        .map(
          (status, idx) => `
          <div class="write-status-option">
            <input
              type="radio"
              id="write-status-${idx}"
              name="write-status"
              value="${status}"
              ${status === '판매중' ? 'checked' : ''}
            />
            <label class="write-status-label" for="write-status-${idx}">
              <span class="write-status-dot"></span>
              <span>${status}</span>
            </label>
          </div>
        `
        )
        .join('');

      this.containerEl.innerHTML = `
        <div class="write-overlay" id="gamza-write-overlay" role="dialog" aria-modal="true" aria-labelledby="gamza-write-title">
          <div class="write-modal">
            <header class="write-header">
              <div class="write-title-wrap">
                <span class="write-title-icon" aria-hidden="true">🥔</span>
                <h2 class="write-title" id="gamza-write-title">내 물건 팔기</h2>
              </div>
              <button type="button" class="write-close-btn" id="gamza-write-close-btn" aria-label="글쓰기 화면 닫기">
                <span>✕ 닫기</span>
              </button>
            </header>

            <form class="write-body" id="gamza-write-form" novalidate>
              <div class="write-error-msg hidden" id="gamza-write-error" role="alert"></div>

              <!-- 1. 상품 이미지 -->
              <div class="write-field">
                <label class="write-label">
                  <span>상품 이미지</span>
                  <span class="write-hint">미첨부 시 상품명에 맞는 감자 일러스트가 자동 생성돼요</span>
                </label>
                <div class="write-image-section">
                  <div class="write-image-preview-box" id="gamza-image-preview-box" title="클릭하여 이미지 파일 선택">
                    <img id="gamza-image-preview" class="write-image-preview hidden" alt="상품 이미지 미리보기" />
                    <div id="gamza-image-placeholder" class="write-image-placeholder">
                      <span class="write-image-placeholder-icon">📷</span>
                      <span class="write-image-placeholder-text">사진 올리기</span>
                    </div>
                    <button type="button" id="gamza-image-remove-btn" class="write-image-remove-btn hidden" title="이미지 지우기" aria-label="선택된 이미지 삭제">✕</button>
                  </div>

                  <div class="write-image-controls">
                    <div class="write-upload-actions">
                      <input type="file" id="gamza-image-input" accept="image/*" class="hidden" />
                      <button type="button" class="btn btn-secondary" id="gamza-file-trigger-btn">
                        📁 내 기기에서 사진 선택
                      </button>
                    </div>
                    <div class="write-sample-group">
                      <span class="write-sample-title">또는 테스트용 귀여운 샘플 이미지 바로 선택:</span>
                      <div class="write-sample-list" id="gamza-sample-list">
                        ${sampleButtonsHtml}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. 상품명 -->
              <div class="write-field">
                <label class="write-label" for="gamza-input-title">
                  <span>상품명</span>
                  <span class="write-required">*</span>
                </label>
                <input
                  type="text"
                  id="gamza-input-title"
                  class="write-input"
                  placeholder="예: 따뜻한 우드 스탠드 조명"
                  maxlength="60"
                  required
                />
              </div>

              <!-- 3. 카테고리 & 4. 가격 -->
              <div class="write-row-2col">
                <div class="write-field">
                  <label class="write-label" for="gamza-input-category">
                    <span>카테고리</span>
                    <span class="write-required">*</span>
                  </label>
                  <select id="gamza-input-category" class="write-select" required>
                    ${categoryOptionsHtml}
                  </select>
                </div>

                <div class="write-field">
                  <label class="write-label" for="gamza-input-price">
                    <span>가격</span>
                    <span class="write-required">*</span>
                    <span class="write-hint">0원 입력 시 무료나눔</span>
                  </label>
                  <div class="write-price-wrap">
                    <input
                      type="number"
                      id="gamza-input-price"
                      class="write-input"
                      placeholder="예: 25000"
                      min="0"
                      step="100"
                      required
                    />
                    <span class="write-price-unit">원</span>
                  </div>
                </div>
              </div>

              <!-- 5. 자세한 설명 -->
              <div class="write-field">
                <label class="write-label" for="gamza-input-desc">
                  <span>자세한 설명</span>
                  <span class="write-required">*</span>
                  <span class="write-hint" id="gamza-desc-counter">0 / 500자</span>
                </label>
                <textarea
                  id="gamza-input-desc"
                  class="write-textarea"
                  placeholder="구매 시기, 사용감, 하자 여부, 선호하는 거래 방법(직거래/택배) 등을 이웃에게 자세히 알려주세요."
                  maxlength="500"
                  required
                ></textarea>
              </div>

              <!-- 6. 거래 동네 -->
              <div class="write-field">
                <label class="write-label" for="gamza-input-location">
                  <span>거래 동네</span>
                  <span class="write-required">*</span>
                </label>
                <input
                  type="text"
                  id="gamza-input-location"
                  class="write-input"
                  placeholder="예: 서울 마포구 연남동"
                  maxlength="40"
                  required
                />
              </div>

              <!-- 7. 판매 상태 -->
              <div class="write-field">
                <label class="write-label">
                  <span>판매 상태</span>
                  <span class="write-required">*</span>
                </label>
                <div class="write-status-tabs" role="radiogroup" aria-label="판매 상태 선택">
                  ${statusTabsHtml}
                </div>
              </div>
            </form>

            <footer class="write-footer">
              <button type="submit" form="gamza-write-form" class="btn btn-primary write-submit-btn" id="gamza-write-submit-btn">
                🥔 작성 완료
              </button>
            </footer>
          </div>
        </div>
      `;
    },

    bindEvents() {
      const overlay = this.containerEl.querySelector('#gamza-write-overlay');
      const closeBtn = this.containerEl.querySelector('#gamza-write-close-btn');
      const form = this.containerEl.querySelector('#gamza-write-form');
      const fileInput = this.containerEl.querySelector('#gamza-image-input');
      const fileTriggerBtn = this.containerEl.querySelector('#gamza-file-trigger-btn');
      const previewBox = this.containerEl.querySelector('#gamza-image-preview-box');
      const removeImgBtn = this.containerEl.querySelector('#gamza-image-remove-btn');
      const sampleList = this.containerEl.querySelector('#gamza-sample-list');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.close();
          }
        });
      }

      if (this._keydownHandler) {
        document.removeEventListener('keydown', this._keydownHandler);
      }
      this._keydownHandler = (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
          this.close();
        }
      };
      document.addEventListener('keydown', this._keydownHandler);

      // 파일 업로드 트리거
      if (fileTriggerBtn && fileInput) {
        fileTriggerBtn.addEventListener('click', () => fileInput.click());
      }
      if (previewBox && fileInput) {
        previewBox.addEventListener('click', (e) => {
          if (e.target.closest('#gamza-image-remove-btn')) return;
          fileInput.click();
        });
      }

      // FileReader 즉시 미리보기 + Supabase Storage 업로드용 파일 보관
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) {
            this.showError('이미지 파일만 업로드할 수 있어요.');
            return;
          }
          this.selectedFile = file;
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            this.activePresetId = '';
            this.updateSampleActiveUI();
            this.setImagePreview(loadEvent.target.result);
          };
          reader.readAsDataURL(file);
        });
      }

      // 이미지 제거
      if (removeImgBtn) {
        removeImgBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.clearImagePreview();
        });
      }

      // 샘플 프리셋 버튼 클릭
      if (sampleList) {
        sampleList.addEventListener('click', (e) => {
          const btn = e.target.closest('.write-sample-btn');
          if (!btn) return;
          const presetId = btn.getAttribute('data-preset-id');
          const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
          if (!preset) return;

          const titleInput = this.containerEl.querySelector('#gamza-input-title');
          const customLabel =
            titleInput && titleInput.value.trim()
              ? titleInput.value.trim().slice(0, 14)
              : preset.svgTitle;

          const svgUri = makeSvgImage(preset.bg, preset.accent, preset.emoji, customLabel);
          this.selectedFile = null;
          this.activePresetId = preset.id;
          this.updateSampleActiveUI();
          this.setImagePreview(svgUri);
        });
      }

      // 입력 시 에러 표시 해제
      if (form) {
        const descEl = this.containerEl.querySelector('#gamza-input-desc');
        const descCounterEl = this.containerEl.querySelector('#gamza-desc-counter');

        form.addEventListener('input', (e) => {
          if (e.target === descEl && descEl) {
            if (descEl.value.length > 500) {
              descEl.value = descEl.value.slice(0, 500);
            }
            if (descCounterEl) {
              descCounterEl.textContent = `${descEl.value.length} / 500자`;
            }
          }
          if (e.target.classList.contains('is-invalid')) {
            e.target.classList.remove('is-invalid');
          }
          this.hideError();
        });

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit();
        });
      }
    },

    updateSampleActiveUI() {
      if (!this.containerEl) return;
      const buttons = this.containerEl.querySelectorAll('.write-sample-btn');
      buttons.forEach((btn) => {
        const id = btn.getAttribute('data-preset-id');
        btn.classList.toggle('is-active', id === this.activePresetId);
      });
    },

    setImagePreview(dataUrl) {
      this.currentImageData = dataUrl || '';
      const previewBox = this.containerEl.querySelector('#gamza-image-preview-box');
      const previewImg = this.containerEl.querySelector('#gamza-image-preview');
      const placeholder = this.containerEl.querySelector('#gamza-image-placeholder');
      const removeBtn = this.containerEl.querySelector('#gamza-image-remove-btn');

      if (!previewImg || !placeholder || !previewBox || !removeBtn) return;

      if (this.currentImageData) {
        previewImg.src = this.currentImageData;
        previewImg.classList.remove('hidden');
        placeholder.classList.add('hidden');
        removeBtn.classList.remove('hidden');
        previewBox.classList.add('has-image');
      } else {
        this.clearImagePreview();
      }
    },

    clearImagePreview() {
      this.currentImageData = '';
      this.selectedFile = null;
      this.activePresetId = '';
      this.updateSampleActiveUI();

      const fileInput = this.containerEl.querySelector('#gamza-image-input');
      const previewBox = this.containerEl.querySelector('#gamza-image-preview-box');
      const previewImg = this.containerEl.querySelector('#gamza-image-preview');
      const placeholder = this.containerEl.querySelector('#gamza-image-placeholder');
      const removeBtn = this.containerEl.querySelector('#gamza-image-remove-btn');

      if (fileInput) fileInput.value = '';
      if (previewImg) {
        previewImg.removeAttribute('src');
        previewImg.classList.add('hidden');
      }
      if (placeholder) placeholder.classList.remove('hidden');
      if (removeBtn) removeBtn.classList.add('hidden');
      if (previewBox) previewBox.classList.remove('has-image');
    },

    showError(msg) {
      const errEl = this.containerEl.querySelector('#gamza-write-error');
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    },

    hideError() {
      const errEl = this.containerEl.querySelector('#gamza-write-error');
      if (!errEl) return;
      errEl.textContent = '';
      errEl.classList.add('hidden');
    },

    async handleSubmit() {
      if (this.isSubmitting) return;

      const titleEl = this.containerEl.querySelector('#gamza-input-title');
      const categoryEl = this.containerEl.querySelector('#gamza-input-category');
      const priceEl = this.containerEl.querySelector('#gamza-input-price');
      const locationEl = this.containerEl.querySelector('#gamza-input-location');
      const descEl = this.containerEl.querySelector('#gamza-input-desc');
      const statusRadio = this.containerEl.querySelector('input[name="write-status"]:checked');
      const submitBtn = this.containerEl.querySelector('#gamza-write-submit-btn');

      const title = titleEl ? titleEl.value.trim() : '';
      const category = categoryEl ? categoryEl.value : '디지털기기';
      const priceRaw = priceEl ? priceEl.value.trim() : '';
      const location = locationEl ? locationEl.value.trim() : '';
      const description = descEl ? descEl.value.trim() : '';
      const status = statusRadio ? statusRadio.value : '판매중';

      // 필수 입력값 검증
      if (!title) {
        titleEl.classList.add('is-invalid');
        titleEl.focus();
        this.showError('상품명을 입력해 주세요.');
        return;
      }

      if (!category) {
        categoryEl.classList.add('is-invalid');
        categoryEl.focus();
        this.showError('카테고리를 선택해 주세요.');
        return;
      }

      if (priceRaw === '' || isNaN(Number(priceRaw)) || Number(priceRaw) < 0) {
        priceEl.classList.add('is-invalid');
        priceEl.focus();
        this.showError('올바른 가격(0원 이상 숫자)을 입력해 주세요.');
        return;
      }

      if (!description) {
        descEl.classList.add('is-invalid');
        descEl.focus();
        this.showError('상품에 대한 자세한 설명을 입력해 주세요.');
        return;
      }

      if (description.length > 500) {
        descEl.classList.add('is-invalid');
        descEl.focus();
        this.showError('자세한 설명은 최대 500자까지 입력할 수 있어요.');
        return;
      }

      if (!location) {
        locationEl.classList.add('is-invalid');
        locationEl.focus();
        this.showError('거래할 동네 이름을 입력해 주세요.');
        return;
      }

      this.isSubmitting = true;
      const isEditMode = this.editingProductId !== null && this.editingProductId !== undefined;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isEditMode ? '🥔 수정 저장 중...' : '🥔 등록 중...';
      }

      try {
        // 1) 실제 파일이 선택된 경우 Supabase Storage (product-images 버킷) 업로드 시도
        let finalImage = this.currentImageData;
        if (this.selectedFile && window.GamzaStore && typeof window.GamzaStore.uploadProductImage === 'function') {
          try {
            const uploadedUrl = await window.GamzaStore.uploadProductImage(this.selectedFile);
            if (uploadedUrl) {
              finalImage = uploadedUrl;
            }
          } catch (uploadErr) {
            console.warn('[Gamza] Storage 업로드 실패, 미리보기 데이터로 대체합니다:', uploadErr);
          }
        }

        // 2) 이미지 미첨부 시 카테고리별 감자 테마 SVG 자동 생성
        if (!finalImage) {
          const catTheme = CATEGORY_EMOJI_MAP[category] || CATEGORY_EMOJI_MAP['기타'];
          finalImage = makeSvgImage(catTheme.bg, catTheme.accent, catTheme.emoji, title.slice(0, 14));
        }

        if (isEditMode) {
          // 기존 게시글 수정 (Supabase public.products UPDATE)
          const updatedProduct = await window.GamzaStore.updateProduct(this.editingProductId, {
            title,
            category,
            price: Number(priceRaw),
            location,
            status,
            image: finalImage,
            description
          });

          this.resetForm();

          if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
            window.GamzaStore.showToast('게시글이 수정되었어요! 🥔');
          }

          this.close();

          if (updatedProduct && window.GamzaDetail && typeof window.GamzaDetail.open === 'function') {
            window.GamzaDetail.open(updatedProduct.id);
          }
        } else {
          // 3) 새 상품 등록 (Supabase public.products INSERT)
          const createdProduct = await window.GamzaStore.addProduct({
            title,
            category,
            price: Number(priceRaw),
            location,
            status,
            image: finalImage,
            description
          });

          if (this.callbacks && typeof this.callbacks.onProductCreated === 'function') {
            this.callbacks.onProductCreated(createdProduct);
          }

          this.resetForm();

          if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
            window.GamzaStore.showToast('상품이 등록되었어요! 🥔');
          }

          this.close();
        }
      } catch (err) {
        console.error('[Gamza] 상품 저장 오류:', err);
        this.showError('저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        this.isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent =
            this.editingProductId !== null && this.editingProductId !== undefined
              ? '🥔 수정 완료'
              : '🥔 작성 완료';
        }
      }
    },

    resetForm() {
      if (!this.containerEl) return;
      this.editingProductId = null;
      const form = this.containerEl.querySelector('#gamza-write-form');
      if (form) form.reset();
      const modalTitleEl = this.containerEl.querySelector('#gamza-write-title');
      if (modalTitleEl) modalTitleEl.textContent = '내 물건 팔기';
      const submitBtn = this.containerEl.querySelector('#gamza-write-submit-btn');
      if (submitBtn) submitBtn.textContent = '🥔 작성 완료';
      const descCounterEl = this.containerEl.querySelector('#gamza-desc-counter');
      if (descCounterEl) descCounterEl.textContent = '0 / 500자';
      const invalids = this.containerEl.querySelectorAll('.is-invalid');
      invalids.forEach((el) => el.classList.remove('is-invalid'));
      this.clearImagePreview();
      this.hideError();
    },

    open() {
      if (!this.containerEl) return;
      this.resetForm();
      this.containerEl.classList.remove('hidden');
      const overlay = this.containerEl.querySelector('#gamza-write-overlay');
      if (overlay) {
        overlay.classList.add('is-open');
      }
      document.body.style.overflow = 'hidden';

      const titleEl = this.containerEl.querySelector('#gamza-input-title');
      if (titleEl) {
        setTimeout(() => titleEl.focus(), 80);
      }
    },

    openEdit(product) {
      if (!this.containerEl || !product) return;
      this.resetForm();
      this.editingProductId = product.id;

      const modalTitleEl = this.containerEl.querySelector('#gamza-write-title');
      if (modalTitleEl) modalTitleEl.textContent = '내 게시글 수정하기';

      const submitBtn = this.containerEl.querySelector('#gamza-write-submit-btn');
      if (submitBtn) submitBtn.textContent = '🥔 수정 완료';

      const titleEl = this.containerEl.querySelector('#gamza-input-title');
      const categoryEl = this.containerEl.querySelector('#gamza-input-category');
      const priceEl = this.containerEl.querySelector('#gamza-input-price');
      const locationEl = this.containerEl.querySelector('#gamza-input-location');
      const descEl = this.containerEl.querySelector('#gamza-input-desc');
      const descCounterEl = this.containerEl.querySelector('#gamza-desc-counter');

      if (titleEl) titleEl.value = product.title || '';
      if (categoryEl && product.category) categoryEl.value = product.category;
      if (priceEl) priceEl.value = Number(product.price) || 0;
      if (locationEl) locationEl.value = product.location || '';
      if (descEl) {
        descEl.value = product.description || '';
        if (descCounterEl) {
          descCounterEl.textContent = `${descEl.value.length} / 500자`;
        }
      }

      const statusRadios = this.containerEl.querySelectorAll('input[name="write-status"]');
      statusRadios.forEach((radio) => {
        radio.checked = radio.value === (product.status || '판매중');
      });

      if (product.image) {
        this.setImagePreview(product.image);
      }

      this.containerEl.classList.remove('hidden');
      const overlay = this.containerEl.querySelector('#gamza-write-overlay');
      if (overlay) {
        overlay.classList.add('is-open');
      }
      document.body.style.overflow = 'hidden';

      if (titleEl) {
        setTimeout(() => titleEl.focus(), 80);
      }
    },

    close() {
      if (!this.containerEl) return;
      const overlay = this.containerEl.querySelector('#gamza-write-overlay');
      if (overlay) {
        overlay.classList.remove('is-open');
      }
      this.containerEl.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };
})();
