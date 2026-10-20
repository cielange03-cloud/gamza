// 감자 (Gamza) 중고거래 플랫폼 - [화면 2: 상세 팝업 (Detail Modal)]
(function () {
  const DEFAULT_AVATAR =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="60" fill="#E6CCB2"/>
        <text x="60" y="66" font-size="56" text-anchor="middle" dominant-baseline="middle">🥔</text>
      </svg>`
    );

  window.GamzaDetail = {
    containerEl: null,
    backdropEl: null,
    currentProductId: null,
    wishedIds: new Set(),
    isUpdating: false,
    _keydownHandler: null,

    init(containerEl) {
      if (typeof containerEl === 'string') {
        this.containerEl = document.querySelector(containerEl);
      } else if (containerEl instanceof HTMLElement) {
        this.containerEl = containerEl;
      }

      if (!this.containerEl) {
        this.containerEl =
          document.getElementById('detail-modal-container') ||
          document.getElementById('detail-modal') ||
          document.getElementById('detail-root');
      }

      if (!this.containerEl) {
        this.containerEl = document.createElement('div');
        this.containerEl.id = 'detail-modal-container';
        document.body.appendChild(this.containerEl);
      }

      // 컨테이너 자체에 hidden 클래스가 걸려 있을 경우 모달 표시를 위해 제거
      this.containerEl.classList.remove('hidden');

      this._renderShell();
      this._bindEvents();
    },

    _renderShell() {
      this.containerEl.innerHTML = `
        <div class="detail-modal-backdrop" id="gamza-detail-backdrop" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="gamza-detail-title">
          <div class="detail-modal-dialog">
            <button type="button" class="detail-close-btn" data-action="close" aria-label="상세 팝업 닫기" title="닫기 (Esc)">
              ✕
            </button>

            <div class="detail-scroll-area" id="gamza-detail-scroll">
              <!-- 위쪽 절반: 상품 대표 이미지 -->
              <div class="detail-image-wrapper">
                <img id="gamza-detail-image" class="detail-product-image" src="" alt="상품 대표 이미지" />
              </div>

              <!-- 아래쪽 절반: 명세 순서에 맞춘 상품 상세 정보 및 판매자 정보 -->
              <div class="detail-content">
                <!-- 1. 판매 상태 & 2. 카테고리 -->
                <div class="detail-meta-badges">
                  <div class="detail-status-row">
                    <span id="gamza-detail-status" class="status-badge status-sale">판매중</span>
                  </div>
                  <div class="detail-category-row">
                    <span id="gamza-detail-category" class="category-tag">카테고리</span>
                  </div>
                </div>

                <!-- 3. 상품명 -->
                <h2 id="gamza-detail-title" class="detail-title"></h2>

                <!-- 4. 판매 위치 & 5. 업로드 시간 -->
                <div class="detail-submeta">
                  <div class="detail-meta-item">
                    <span class="detail-meta-label">📍 판매 위치</span>
                    <span id="gamza-detail-location" class="detail-meta-value"></span>
                  </div>
                  <div class="detail-meta-item">
                    <span class="detail-meta-label">🕒 업로드</span>
                    <span id="gamza-detail-time" class="detail-meta-value"></span>
                  </div>
                </div>

                <!-- 6. 가격 -->
                <div id="gamza-detail-price" class="detail-price"></div>

                <!-- 7. 상품 설명 -->
                <p id="gamza-detail-description" class="detail-description"></p>

                <!-- [작성자 전용 관리 영역] 본인이 쓴 게시글일 때만 표시 -->
                <div id="gamza-detail-owner-box" class="detail-owner-box hidden" aria-label="내 게시글 관리">
                  <div class="detail-owner-header">
                    <span class="detail-owner-title">🥔 내 게시글 관리</span>
                    <div class="detail-owner-actions">
                      <button type="button" class="btn btn-outline detail-owner-edit-btn" data-action="edit-product">
                        ✏️ 수정
                      </button>
                      <button type="button" class="btn btn-outline detail-owner-delete-btn" data-action="delete-product">
                        🗑️ 삭제
                      </button>
                    </div>
                  </div>

                  <div class="detail-owner-status-group">
                    <span class="detail-owner-status-label">판매 상태 변경</span>
                    <div class="detail-owner-status-buttons" role="group" aria-label="판매 상태 선택">
                      <button type="button" class="detail-status-select-btn" data-action="change-status" data-status="판매중">
                        판매중
                      </button>
                      <button type="button" class="detail-status-select-btn" data-action="change-status" data-status="예약중">
                        예약중
                      </button>
                      <button type="button" class="detail-status-select-btn" data-action="change-status" data-status="거래 완료">
                        거래 완료
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 판매자 정보 섹션 -->
                <div class="detail-seller-card" aria-label="판매자 정보">
                  <div class="detail-seller-profile">
                    <img id="gamza-detail-seller-avatar" class="detail-seller-avatar" src="" alt="판매자 프로필" />
                    <div class="detail-seller-info">
                      <span id="gamza-detail-seller-nickname" class="detail-seller-nickname"></span>
                      <span id="gamza-detail-seller-region" class="detail-seller-region"></span>
                    </div>
                  </div>
                  <span class="detail-seller-badge">🥔 판매자</span>
                </div>
              </div>
            </div>

            <!-- 맨 아래 하단 액션 바 -->
            <div class="detail-action-bar">
              <button type="button" id="gamza-detail-wish-btn" class="btn btn-outline detail-wish-btn" data-action="wish">
                <span id="gamza-detail-wish-icon" class="detail-wish-icon">🤍</span>
                <span id="gamza-detail-wish-text">관심 추가</span>
              </button>
              <button type="button" id="gamza-detail-chat-btn" class="btn btn-primary detail-chat-btn" data-action="chat">
                💬 채팅 시작하기
              </button>
            </div>
          </div>
        </div>
      `;

      this.backdropEl = this.containerEl.querySelector('#gamza-detail-backdrop');
    },

    _bindEvents() {
      if (!this.backdropEl) return;

      // 모달 내부 버튼 및 바깥 배경(백드롭) 클릭 처리
      this.backdropEl.addEventListener('click', (e) => {
        if (e.target === this.backdropEl) {
          this.close();
          return;
        }

        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.getAttribute('data-action');
        if (action === 'close') {
          this.close();
        } else if (action === 'wish') {
          this._handleToggleWish();
        } else if (action === 'chat') {
          this._handleStartChat();
        } else if (action === 'change-status') {
          const newStatus = actionBtn.getAttribute('data-status');
          if (newStatus) {
            this._handleChangeStatus(newStatus);
          }
        } else if (action === 'edit-product') {
          this._handleEditProduct();
        } else if (action === 'delete-product') {
          this._handleDeleteProduct();
        }
      });

      // Escape 키 입력 시 닫기
      if (this._keydownHandler) {
        document.removeEventListener('keydown', this._keydownHandler);
      }
      this._keydownHandler = (e) => {
        if (e.key === 'Escape' && this.backdropEl && this.backdropEl.classList.contains('is-open')) {
          this.close();
        }
      };
      document.addEventListener('keydown', this._keydownHandler);
    },

    _findProduct(productOrId) {
      if (!productOrId && productOrId !== 0) return null;
      if (typeof productOrId === 'object') return productOrId;
      const products = (window.GamzaStore && window.GamzaStore.products) || window.GAMZA_INITIAL_PRODUCTS || [];
      return products.find((item) => String(item.id) === String(productOrId)) || null;
    },

    open(productId) {
      if (!this.backdropEl) {
        this.init(this.containerEl);
      }

      const product = this._findProduct(productId);
      if (!product) {
        if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
          window.GamzaStore.showToast('상품 정보를 찾을 수 없습니다.');
        }
        return;
      }

      this.currentProductId = product.id;
      this.containerEl.classList.remove('hidden');

      this._populateProductDetails(product);

      // 관심 버튼 상태 동기화
      this._updateWishButtonUI();

      // 스크롤 최상단으로 초기화 후 모달 열기
      const scrollEl = this.containerEl.querySelector('#gamza-detail-scroll');
      if (scrollEl) scrollEl.scrollTop = 0;

      this.backdropEl.classList.add('is-open');
      this.backdropEl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },

    _populateProductDetails(product) {
      if (!this.containerEl || !product) return;

      // 위쪽 절반: 상품 대표 이미지
      const imgEl = this.containerEl.querySelector('#gamza-detail-image');
      imgEl.src = product.image || '';
      imgEl.alt = `${product.title} 상품 이미지`;

      // 1. 판매 상태 배지
      const statusEl = this.containerEl.querySelector('#gamza-detail-status');
      const statusText = product.status || '판매중';
      const badgeClass =
        window.GamzaStore && typeof window.GamzaStore.getStatusBadgeClass === 'function'
          ? window.GamzaStore.getStatusBadgeClass(statusText)
          : 'status-sale';
      statusEl.className = `status-badge ${badgeClass}`;
      statusEl.textContent = statusText;

      // 2. 카테고리
      const categoryEl = this.containerEl.querySelector('#gamza-detail-category');
      categoryEl.textContent = product.category || '기타';

      // 3. 상품명
      const titleEl = this.containerEl.querySelector('#gamza-detail-title');
      titleEl.textContent = product.title || '';

      // 4. 판매 위치
      const locationEl = this.containerEl.querySelector('#gamza-detail-location');
      locationEl.textContent = product.location || '지역 정보 없음';

      // 5. 업로드 시간
      const timeEl = this.containerEl.querySelector('#gamza-detail-time');
      timeEl.textContent = product.uploadTime || '방금 전';

      // 6. 가격
      const priceEl = this.containerEl.querySelector('#gamza-detail-price');
      priceEl.textContent =
        window.GamzaStore && typeof window.GamzaStore.formatPrice === 'function'
          ? window.GamzaStore.formatPrice(product.price)
          : `${Number(product.price || 0).toLocaleString('ko-KR')}원`;

      // 7. 상품 설명 (줄바꿈 유지)
      const descEl = this.containerEl.querySelector('#gamza-detail-description');
      descEl.textContent = product.description || '등록된 상품 설명이 없습니다.';

      // 판매자 정보 섹션
      const seller = product.seller || {};
      const sellerAvatarEl = this.containerEl.querySelector('#gamza-detail-seller-avatar');
      const sellerNicknameEl = this.containerEl.querySelector('#gamza-detail-seller-nickname');
      const sellerRegionEl = this.containerEl.querySelector('#gamza-detail-seller-region');

      sellerAvatarEl.src = seller.avatar || DEFAULT_AVATAR;
      sellerAvatarEl.alt = `${seller.nickname || '햇감자이웃'} 프로필 이미지`;
      sellerNicknameEl.textContent = seller.nickname || '햇감자이웃';
      sellerRegionEl.textContent = seller.region || product.location || '우리 동네';

      // 작성자 본인 여부 확인 후 관리 박스(수정/삭제 + 상태 변경 버튼) 표시
      this.refreshOwnerUI();
    },

    refreshOwnerUI() {
      if (!this.containerEl || this.currentProductId === null) return;
      const product = this._findProduct(this.currentProductId);
      const ownerBox = this.containerEl.querySelector('#gamza-detail-owner-box');
      if (!ownerBox || !product) return;

      const isOwner =
        window.GamzaStore &&
        typeof window.GamzaStore.isProductOwner === 'function' &&
        window.GamzaStore.isProductOwner(product);

      ownerBox.classList.toggle('hidden', !isOwner);

      // 현재 상태 버튼 활성화 표시
      const currentStatus = product.status || '판매중';
      const statusBtns = ownerBox.querySelectorAll('.detail-status-select-btn');
      statusBtns.forEach((btn) => {
        const btnStatus = btn.getAttribute('data-status');
        const isActive = btnStatus === currentStatus;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
    },

    async _handleChangeStatus(newStatus) {
      if (this.isUpdating || this.currentProductId === null) return;
      const product = this._findProduct(this.currentProductId);
      if (!product || product.status === newStatus) return;

      this.isUpdating = true;
      try {
        const updated = await window.GamzaStore.updateProductStatus(this.currentProductId, newStatus);
        if (updated) {
          this._populateProductDetails(updated);
          if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
            window.GamzaStore.showToast(`판매 상태가 '${newStatus}'(으)로 변경되었어요 🥔`);
          }
        }
      } catch (err) {
        console.error('[GamzaDetail] 상태 변경 실패:', err);
        if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
          window.GamzaStore.showToast('상태 변경 중 오류가 발생했어요.');
        }
      } finally {
        this.isUpdating = false;
      }
    },

    _handleEditProduct() {
      if (this.currentProductId === null) return;
      const product = this._findProduct(this.currentProductId);
      if (!product) return;

      this.close();
      if (window.GamzaWrite && typeof window.GamzaWrite.openEdit === 'function') {
        window.GamzaWrite.openEdit(product);
      }
    },

    async _handleDeleteProduct() {
      if (this.isUpdating || this.currentProductId === null) return;
      const product = this._findProduct(this.currentProductId);
      if (!product) return;

      const confirmed = window.confirm(`'${product.title}' 게시글을 정말 삭제하시겠어요?`);
      if (!confirmed) return;

      this.isUpdating = true;
      try {
        await window.GamzaStore.deleteProduct(this.currentProductId);
        this.close();
        if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
          window.GamzaStore.showToast('게시글이 삭제되었어요 🥔');
        }
      } catch (err) {
        console.error('[GamzaDetail] 게시글 삭제 실패:', err);
        if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
          window.GamzaStore.showToast('게시글 삭제 중 오류가 발생했어요.');
        }
      } finally {
        this.isUpdating = false;
      }
    },

    close() {
      if (!this.backdropEl) return;
      this.backdropEl.classList.remove('is-open');
      this.backdropEl.setAttribute('aria-hidden', 'true');
      this.currentProductId = null;
      document.body.style.overflow = '';
    },

    _updateWishButtonUI() {
      const wishBtn = this.containerEl.querySelector('#gamza-detail-wish-btn');
      const wishIcon = this.containerEl.querySelector('#gamza-detail-wish-icon');
      const wishText = this.containerEl.querySelector('#gamza-detail-wish-text');
      if (!wishBtn || !wishIcon || !wishText) return;

      const isWished = this.wishedIds.has(this.currentProductId);
      wishBtn.classList.toggle('is-wished', isWished);
      wishBtn.setAttribute('aria-pressed', String(isWished));
      wishIcon.textContent = isWished ? '🤎' : '🤍';
      wishText.textContent = isWished ? '관심 추가됨' : '관심 추가';
    },

    _handleToggleWish() {
      if (this.currentProductId === null) return;
      const isNowWished = !this.wishedIds.has(this.currentProductId);
      if (isNowWished) {
        this.wishedIds.add(this.currentProductId);
      } else {
        this.wishedIds.delete(this.currentProductId);
      }

      this._updateWishButtonUI();

      if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
        window.GamzaStore.showToast(
          isNowWished ? '관심 상품에 추가되었습니다 🤎' : '관심 상품에서 해제되었습니다.'
        );
      }
    },

    _handleStartChat() {
      const product = this._findProduct(this.currentProductId);
      const nickname = (product && product.seller && product.seller.nickname) || '판매자';
      if (window.GamzaStore && typeof window.GamzaStore.showToast === 'function') {
        window.GamzaStore.showToast(`${nickname}님과의 채팅 기능은 준비 중입니다 💬`);
      }
    }
  };
})();
