// ==========================================================================
// [화면 1: 상품 목록] 모듈 (js/list.js)
// window.GamzaList = { init(containerEl, callbacks), render() }
// ==========================================================================

(function () {
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.GamzaList = {
    containerEl: null,
    callbacks: {
      onSelectProduct: function () {},
      onOpenWrite: function () {},
      onOpenAuth: function () {}
    },
    _isShellMounted: false,

    init(containerEl, callbacks) {
      this.containerEl = containerEl;
      this.callbacks = Object.assign(
        {
          onSelectProduct: function () {},
          onOpenWrite: function () {},
          onOpenAuth: function () {}
        },
        callbacks || {}
      );
      this._isShellMounted = false;
      this._mountShell();
      this.render();
    },

    _mountShell() {
      if (!this.containerEl) return;

      this.containerEl.innerHTML = `
        <!-- 상단 고정 헤더 -->
        <header class="gamza-header">
          <div class="container gamza-header-inner">
            <a class="gamza-logo" data-action="reset-home" role="button" tabindex="0" aria-label="감자 홈으로 이동">
              <span class="gamza-logo-icon" aria-hidden="true">🥔</span>
              <span class="gamza-logo-text">
                <span>🥔 감자</span>
                <span class="gamza-logo-sub">포슬포슬 따뜻한 우리 동네 중고거래</span>
              </span>
            </a>

            <div class="gamza-search-wrap">
              <span class="gamza-search-icon" aria-hidden="true">🔍</span>
              <input
                type="search"
                id="gamza-search-input"
                class="gamza-search-input"
                placeholder="동네 이름, 물품명, 카테고리로 검색해보세요"
                autocomplete="off"
                aria-label="상품 검색"
              />
              <button
                type="button"
                id="gamza-search-clear"
                class="gamza-search-clear"
                aria-label="검색어 지우기"
                title="검색어 지우기"
              >✕</button>
            </div>

            <div class="gamza-header-actions">
              <button type="button" class="btn btn-primary gamza-write-btn" data-action="open-write">
                <span>+ 글쓰기</span>
              </button>

              <!-- 로그인 전: [로그인] 버튼만 표시 -->
              <button
                type="button"
                id="gamza-login-btn"
                class="btn btn-outline gamza-login-btn"
                data-action="login"
              >
                <span>로그인</span>
              </button>

              <!-- 로그인 후: [닉네임]과 [로그아웃] 버튼만 표시 -->
              <span
                id="gamza-user-badge"
                class="gamza-user-badge hidden"
                aria-label="현재 로그인된 닉네임"
              >
                <span class="gamza-user-badge-icon" aria-hidden="true">🥔</span>
                <span id="gamza-user-nickname"></span>
              </span>
              <button
                type="button"
                id="gamza-logout-btn"
                class="btn btn-outline gamza-logout-btn hidden"
                data-action="logout"
              >
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </header>

        <!-- 메인 컨텐츠 -->
        <main class="container gamza-list-main">
          <!-- 소개 배너 -->
          <section class="gamza-hero-bar" aria-label="서비스 안내">
            <div class="gamza-hero-text">
              <h1>오늘 우리 동네에 올라온 햇감자 같은 꿀매물 🥔</h1>
              <p>이웃과 가깝고 따뜻하게 직거래하고, 안 쓰는 물건에 새 주인을 찾아주세요.</p>
            </div>
            <div class="gamza-hero-badge">
              <span>✨ 실시간 직거래 장터</span>
            </div>
          </section>

          <!-- 카테고리 및 거래 가능 필터 영역 -->
          <section class="gamza-filter-section" aria-label="상품 필터">
            <div class="gamza-filter-row">
              <div class="gamza-category-list" id="gamza-category-list" role="tablist" aria-label="카테고리 선택"></div>

              <button
                type="button"
                id="gamza-available-toggle"
                class="gamza-available-toggle"
                aria-pressed="false"
              >
                <span class="gamza-toggle-track" aria-hidden="true">
                  <span class="gamza-toggle-thumb"></span>
                </span>
                <span>거래 가능만 보기</span>
                <span class="gamza-toggle-status-text" id="gamza-toggle-status-text">OFF</span>
              </button>
            </div>

            <div class="gamza-list-meta">
              <span class="gamza-list-count" id="gamza-list-count"></span>
            </div>
          </section>

          <!-- 상품 카드 그리드 영역 -->
          <section aria-label="상품 목록">
            <div class="gamza-product-grid" id="gamza-product-grid"></div>
          </section>
        </main>
      `;

      this._bindEvents();
      this._isShellMounted = true;
    },

    _bindEvents() {
      const store = window.GamzaStore;
      const searchInput = this.containerEl.querySelector('#gamza-search-input');
      const searchClearBtn = this.containerEl.querySelector('#gamza-search-clear');
      const availableToggleBtn = this.containerEl.querySelector('#gamza-available-toggle');

      // 실시간 검색 입력 이벤트
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          store.searchQuery = e.target.value;
          this._updateSearchClearVisibility();
          this._renderProductsAndMeta();
        });
      }

      // 검색어 지우기 버튼
      if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
          store.searchQuery = '';
          if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
          }
          this._updateSearchClearVisibility();
          this._renderProductsAndMeta();
        });
      }

      // 거래 가능만 보기 토글 버튼
      if (availableToggleBtn) {
        availableToggleBtn.addEventListener('click', () => {
          store.onlyAvailable = !store.onlyAvailable;
          this.render();
        });
      }

      // 컨테이너 이벤트 위임 (로고, 글쓰기, 로그인, 카테고리, 상품 카드, 필터 초기화)
      this.containerEl.addEventListener('click', (e) => {
        // 1) 글쓰기 버튼
        const writeBtn = e.target.closest('[data-action="open-write"]');
        if (writeBtn) {
          if (this.callbacks && typeof this.callbacks.onOpenWrite === 'function') {
            this.callbacks.onOpenWrite();
          }
          return;
        }

        // 2) 로그인 버튼 -> 로그인/회원가입 모달 열기
        const loginBtn = e.target.closest('[data-action="login"]');
        if (loginBtn) {
          if (this.callbacks && typeof this.callbacks.onOpenAuth === 'function') {
            this.callbacks.onOpenAuth({ mode: 'login' });
          } else if (window.GamzaAuth && typeof window.GamzaAuth.open === 'function') {
            window.GamzaAuth.open({ mode: 'login' });
          }
          return;
        }

        // 2-1) 로그아웃 버튼 -> Supabase 로그아웃 처리
        const logoutBtn = e.target.closest('[data-action="logout"]');
        if (logoutBtn) {
          store.signOut().then(() => {
            store.showToast('로그아웃되었습니다 🥔');
          });
          return;
        }

        // 3) 로고 클릭 시 필터 초기화
        const resetHomeBtn = e.target.closest('[data-action="reset-home"]');
        if (resetHomeBtn) {
          e.preventDefault();
          store.filterCategory = '전체';
          store.onlyAvailable = false;
          store.searchQuery = '';
          this.render();
          return;
        }

        // 4) 빈 상태에서 필터 초기화 버튼
        const resetFilterBtn = e.target.closest('[data-action="reset-filters"]');
        if (resetFilterBtn) {
          store.filterCategory = '전체';
          store.onlyAvailable = false;
          store.searchQuery = '';
          this.render();
          return;
        }

        // 5) 카테고리 버튼
        const catBtn = e.target.closest('[data-category]');
        if (catBtn) {
          const category = catBtn.getAttribute('data-category');
          if (category) {
            store.filterCategory = category;
            this.render();
          }
          return;
        }

        // 6) 상품 카드 클릭 -> 상세 팝업 열기
        const cardEl = e.target.closest('[data-product-id]');
        if (cardEl) {
          const rawId = cardEl.getAttribute('data-product-id');
          const productId = Number(rawId);
          if (!Number.isNaN(productId) && this.callbacks && typeof this.callbacks.onSelectProduct === 'function') {
            this.callbacks.onSelectProduct(productId);
          }
        }
      });

      // 키보드 접근성 (상품 카드 Enter / Space 지원)
      this.containerEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const cardEl = e.target.closest('[data-product-id]');
          if (cardEl) {
            e.preventDefault();
            const productId = Number(cardEl.getAttribute('data-product-id'));
            if (!Number.isNaN(productId) && this.callbacks && typeof this.callbacks.onSelectProduct === 'function') {
              this.callbacks.onSelectProduct(productId);
            }
          }
        }
      });
    },

    _updateSearchClearVisibility() {
      const searchClearBtn = this.containerEl.querySelector('#gamza-search-clear');
      if (!searchClearBtn) return;
      const hasQuery = Boolean(window.GamzaStore.searchQuery && window.GamzaStore.searchQuery.length > 0);
      searchClearBtn.classList.toggle('visible', hasQuery);
    },

    _renderCategories() {
      const catListEl = this.containerEl.querySelector('#gamza-category-list');
      if (!catListEl) return;

      const categories = window.GAMZA_CATEGORIES || [
        '전체',
        '디지털기기',
        '가구/인테리어',
        '의류',
        '생활가전',
        '도서/티켓',
        '기타'
      ];
      const currentCategory = window.GamzaStore.filterCategory || '전체';

      catListEl.innerHTML = categories
        .map((cat) => {
          const isActive = cat === currentCategory;
          return `
            <button
              type="button"
              role="tab"
              aria-selected="${isActive}"
              class="gamza-category-btn ${isActive ? 'active' : ''}"
              data-category="${escapeHtml(cat)}"
            >${escapeHtml(cat)}</button>
          `;
        })
        .join('');
    },

    _renderAvailableToggle() {
      const toggleBtn = this.containerEl.querySelector('#gamza-available-toggle');
      const statusTextEl = this.containerEl.querySelector('#gamza-toggle-status-text');
      if (!toggleBtn) return;

      const isOn = Boolean(window.GamzaStore.onlyAvailable);
      toggleBtn.classList.toggle('active', isOn);
      toggleBtn.setAttribute('aria-pressed', String(isOn));
      if (statusTextEl) {
        statusTextEl.textContent = isOn ? 'ON' : 'OFF';
      }
    },

    _renderProductsAndMeta() {
      const store = window.GamzaStore;
      const gridEl = this.containerEl.querySelector('#gamza-product-grid');
      const countEl = this.containerEl.querySelector('#gamza-list-count');
      if (!gridEl) return;

      const filteredProducts = store.getFilteredProducts();

      // 상단 결과 개수 텍스트 업데이트
      if (countEl) {
        const catLabel = store.filterCategory === '전체' ? '전체 카테고리' : `'${escapeHtml(store.filterCategory)}'`;
        const queryLabel = store.searchQuery.trim()
          ? ` · 검색어 "${escapeHtml(store.searchQuery.trim())}"`
          : '';
        const availLabel = store.onlyAvailable ? ' · 거래 가능(판매중) 상품만' : '';
        countEl.innerHTML = `${catLabel}${queryLabel}${availLabel} — 총 <strong>${filteredProducts.length}개</strong>의 감자 매물`;
      }

      // 결과가 없을 때 빈 상태(Empty State) 렌더링
      if (filteredProducts.length === 0) {
        gridEl.innerHTML = `
          <div class="gamza-empty-state">
            <div class="gamza-empty-icon" aria-hidden="true">🥔</div>
            <h2 class="gamza-empty-title">조건에 맞는 감자 매물이 없어요</h2>
            <p class="gamza-empty-desc">검색어나 카테고리 필터를 변경하거나 거래 가능 필터를 해제해 보세요.</p>
            <button type="button" class="btn btn-secondary" data-action="reset-filters">
              전체 매물 다시 보기
            </button>
          </div>
        `;
        return;
      }

      // 상품 카드 그리드 렌더링
      gridEl.innerHTML = filteredProducts
        .map((product) => {
          const badgeClass = store.getStatusBadgeClass(product.status);
          const isDone = product.status === '거래 완료';
          const formattedPrice = store.formatPrice(product.price);
          const sellerNickname = (product.seller && product.seller.nickname) || '햇감자이웃';

          return `
            <article
              class="gamza-card ${isDone ? 'is-done' : ''}"
              data-product-id="${escapeHtml(product.id)}"
              role="button"
              tabindex="0"
              aria-label="${escapeHtml(product.title)} - ${escapeHtml(formattedPrice)} (${escapeHtml(product.status)})"
            >
              <div class="gamza-card-thumb-wrap">
                <img
                  class="gamza-card-thumb"
                  src="${escapeHtml(product.image)}"
                  alt="${escapeHtml(product.title)}"
                  loading="lazy"
                />
                <span class="gamza-card-category-chip">${escapeHtml(product.category)}</span>
                <span class="gamza-card-status-chip status-badge ${escapeHtml(badgeClass)}">${escapeHtml(product.status)}</span>
              </div>

              <div class="gamza-card-body">
                <h3 class="gamza-card-title">${escapeHtml(product.title)}</h3>

                <div class="gamza-card-meta">
                  <span class="gamza-card-location">📍 ${escapeHtml(product.location)}</span>
                  <span class="gamza-card-dot" aria-hidden="true">·</span>
                  <span class="gamza-card-time">${escapeHtml(product.uploadTime)}</span>
                </div>

                <div class="gamza-card-seller">
                  <span class="gamza-card-seller-label">🥔 작성자</span>
                  <strong class="gamza-card-seller-name">${escapeHtml(sellerNickname)}</strong>
                </div>

                <div class="gamza-card-footer">
                  <span class="gamza-card-price">${escapeHtml(formattedPrice)}</span>
                  <span class="status-badge ${escapeHtml(badgeClass)}">${escapeHtml(product.status)}</span>
                </div>
              </div>
            </article>
          `;
        })
        .join('');
    },

    updateAuthUI() {
      if (!this.containerEl) return;
      const user = window.GamzaStore && window.GamzaStore.currentUser;
      const isLoggedIn = Boolean(user && user.id);

      const loginBtn = this.containerEl.querySelector('#gamza-login-btn');
      const userBadge = this.containerEl.querySelector('#gamza-user-badge');
      const userNicknameEl = this.containerEl.querySelector('#gamza-user-nickname');
      const logoutBtn = this.containerEl.querySelector('#gamza-logout-btn');

      if (loginBtn) {
        loginBtn.classList.toggle('hidden', isLoggedIn);
      }
      if (userBadge) {
        userBadge.classList.toggle('hidden', !isLoggedIn);
      }
      if (userNicknameEl) {
        userNicknameEl.textContent = isLoggedIn ? (user.nickname || '햇감자이웃') : '';
      }
      if (logoutBtn) {
        logoutBtn.classList.toggle('hidden', !isLoggedIn);
      }
    },

    render() {
      if (!this.containerEl) return;
      if (!this._isShellMounted || !this.containerEl.querySelector('#gamza-product-grid')) {
        this._mountShell();
      }

      // 검색창 동기화 (포커스 중이 아닐 때만 값을 덮어써서 한글 조합 깨짐 방지)
      const searchInput = this.containerEl.querySelector('#gamza-search-input');
      if (searchInput && document.activeElement !== searchInput) {
        searchInput.value = window.GamzaStore.searchQuery || '';
      }

      this.updateAuthUI();
      this._updateSearchClearVisibility();
      this._renderCategories();
      this._renderAvailableToggle();
      this._renderProductsAndMeta();
    }
  };
})();
