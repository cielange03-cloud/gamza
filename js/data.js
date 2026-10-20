// 감자 (Gamza) 중고거래 플랫폼 - 공유 데이터 및 Supabase 연동 스토어 (js/data.js)
window.GAMZA_CATEGORIES = [
  '전체',
  '디지털기기',
  '가구/인테리어',
  '의류',
  '생활가전',
  '도서/티켓',
  '기타'
];

window.GAMZA_STATUSES = ['판매중', '예약중', '거래 완료'];

function createProductSvgDataUri(bgHex, accentHex, emoji, label) {
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

function createAvatarSvgDataUri(bgHex, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="60" fill="${bgHex}"/>
    <text x="60" y="66" font-size="56" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

window.GAMZA_INITIAL_PRODUCTS = [
  {
    id: 1,
    title: '아이패드 에어 5세대 64GB 스타라이트 (풀박스)',
    category: '디지털기기',
    price: 580000,
    location: '서울 마포구 연남동',
    uploadTime: '15분 전',
    status: '판매중',
    image: createProductSvgDataUri('#F5EBE0', '#E3D5CA', '📱', 'iPad Air 5 64GB'),
    description: '구매 후 필름 붙여서 실내에서만 유튜브 시청용으로 아껴 사용했습니다.\n배터리 효율 96%이며 찍힘이나 기스 전혀 없는 S급 상태입니다.\n정품 충전기와 박스 모두 그대로 챙겨드려요. 연남동 직거래 선호합니다!',
    seller: {
      nickname: '포슬감자',
      avatar: createAvatarSvgDataUri('#E6CCB2', '🥔'),
      region: '서울 마포구 연남동'
    }
  },
  {
    id: 2,
    title: '원목 2인용 감성 카페 테이블 + 의자 세트',
    category: '가구/인테리어',
    price: 85000,
    location: '서울 성동구 성수동',
    uploadTime: '1시간 전',
    status: '판매중',
    image: createProductSvgDataUri('#EDE0D4', '#DDB892', '🪑', '원목 카페 테이블 세트'),
    description: '따뜻한 우드톤 인테리어에 딱 맞는 원목 원형 테이블과 의자 2개 세트입니다.\n이사하면서 더 큰 식탁을 사게 되어 내놓습니다.\n상판 생활감 거의 없고 튼튼해요. 성수동 직거래로 가져가실 분 연락 주세요.',
    seller: {
      nickname: '우드러버',
      avatar: createAvatarSvgDataUri('#DDB892', '🌿'),
      region: '서울 성동구 성수동'
    }
  },
  {
    id: 3,
    title: '발뮤다 더 토스터 베이지 (실사용 5회 미만)',
    category: '생활가전',
    price: 160000,
    location: '서울 강남구 역삼동',
    uploadTime: '3시간 전',
    status: '예약중',
    image: createProductSvgDataUri('#FAF0CA', '#F4D35E', '🍞', '발뮤다 더 토스터 베이지'),
    description: '집들이 선물로 받았는데 빵을 자주 안 먹어서 보관만 하다가 판매합니다.\n내부 그릴과 물컵 모두 새것처럼 깨끗하게 세척해 두었습니다.\n감자 브라운 주방 인테리어와도 정말 잘 어울리는 베이지 컬러예요!',
    seller: {
      nickname: '버터구이감자',
      avatar: createAvatarSvgDataUri('#F3D5B5', '🧈'),
      region: '서울 강남구 역삼동'
    }
  },
  {
    id: 4,
    title: '폴로 랄프로렌 코튼 케이블 니트 베이지 M사이즈',
    category: '의류',
    price: 69000,
    location: '서울 송파구 잠실동',
    uploadTime: '5시간 전',
    status: '판매중',
    image: createProductSvgDataUri('#F2E9E4', '#C9ADA7', '🧶', '폴로 케이블 니트 M'),
    description: '백화점 정품 매장 구매 후 드라이클리닝 완료해 둔 상태입니다.\n보풀 없이 깔끔하고 봄/가을에 단독으로 입기 좋은 포근한 베이지 색상입니다.\n잠실역 인근 직거래 가능해요.',
    seller: {
      nickname: '가을산책',
      avatar: createAvatarSvgDataUri('#E8D1C5', '🍂'),
      region: '서울 송파구 잠실동'
    }
  },
  {
    id: 5,
    title: '클린 코드 + 리팩터링 2판 개발 서적 일괄',
    category: '도서/티켓',
    price: 32000,
    location: '경기 성남시 분당구 정자동',
    uploadTime: '어제',
    status: '거래 완료',
    image: createProductSvgDataUri('#E8ECEF', '#CBD5E1', '📚', '개발 필독서 2권 세트'),
    description: '개발자 필독서 클린 코드와 리팩터링 2판 두 권 일괄로 판매합니다.\n밑줄이나 필기 전혀 없고 책 표지 상태도 아주 깨끗합니다.\n정자역 직거래 완료되었습니다.',
    seller: {
      nickname: '코딩하는감자',
      avatar: createAvatarSvgDataUri('#D8E2DC', '💻'),
      region: '경기 성남시 분당구 정자동'
    }
  },
  {
    id: 6,
    title: '감성 캠핑 우드 롤테이블 + 수납 가방 포함',
    category: '기타',
    price: 45000,
    location: '서울 용산구 한남동',
    uploadTime: '2일 전',
    status: '판매중',
    image: createProductSvgDataUri('#EFE5DC', '#C2A88E', '⛺', '캠핑 우드 롤테이블'),
    description: '피크닉이랑 감성 캠핑 갈 때 2번 챙겨간 원목 롤테이블입니다.\n접이식이라 트렁크 자리도 적게 차지하고 전용 캔버스 가방에 쏙 들어갑니다.\n한남동에서 직거래 희망합니다!',
    seller: {
      nickname: '주말캠퍼',
      avatar: createAvatarSvgDataUri('#D6C2B2', '🔥'),
      region: '서울 용산구 한남동'
    }
  }
];

// 전역 상태 관리 및 Supabase 연동 스토어
window.GamzaStore = {
  products: [...window.GAMZA_INITIAL_PRODUCTS],
  filterCategory: '전체',
  onlyAvailable: false,
  searchQuery: '',
  isLoading: false,
  isConnected: false,
  currentUser: null, // { id, nickname, avatar, region }

  // =========================================================================
  // Supabase Auth & Profiles (회원 인증 및 익명 프로필 관리)
  // =========================================================================
  async initAuth() {
    if (!window.supabaseClient || !window.supabaseClient.auth) return null;

    try {
      const { data } = await window.supabaseClient.auth.getSession();
      const sessionUser = data && data.session && data.session.user;
      if (sessionUser) {
        await this.loadUserProfile(sessionUser);
      } else {
        this.currentUser = null;
      }
    } catch (err) {
      console.warn('[Gamza] 세션 확인 실패:', err);
      this.currentUser = null;
    }

    this._notifyAuthChanged();

    // 실시간 로그인/로그아웃 상태 변경 리스너 등록
    window.supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session && session.user;
      if (sessionUser) {
        await this.loadUserProfile(sessionUser);
      } else {
        this.currentUser = null;
      }
      this._notifyAuthChanged();
    });

    return this.currentUser;
  },

  async loadUserProfile(authUser) {
    if (!authUser) {
      this.currentUser = null;
      return null;
    }

    const metaNickname =
      (authUser.user_metadata && authUser.user_metadata.nickname) || '햇감자이웃';
    const defaultAvatar =
      (authUser.user_metadata && authUser.user_metadata.avatar_url) ||
      createAvatarSvgDataUri('#E6CCB2', '🥔');

    let profileData = null;
    if (window.supabaseClient) {
      try {
        const { data } = await window.supabaseClient
          .from('profiles')
          .select('id, nickname, avatar_url, region')
          .eq('id', authUser.id)
          .maybeSingle();

        profileData = data || null;

        // 프로필 행이 아직 없으면 즉시 생성
        if (!profileData) {
          const { data: created } = await window.supabaseClient
            .from('profiles')
            .upsert(
              [
                {
                  id: authUser.id,
                  nickname: metaNickname,
                  avatar_url: defaultAvatar,
                  region: '우리 동네'
                }
              ],
              { onConflict: 'id' }
            )
            .select('id, nickname, avatar_url, region')
            .maybeSingle();
          profileData = created || null;
        }
      } catch (err) {
        console.warn('[Gamza] 프로필 조회 실패:', err);
      }
    }

    this.currentUser = {
      id: authUser.id,
      nickname: (profileData && profileData.nickname) || metaNickname,
      avatar: (profileData && profileData.avatar_url) || defaultAvatar,
      region: (profileData && profileData.region) || '우리 동네'
    };

    return this.currentUser;
  },

  async signUp({ email, password, nickname }) {
    if (!window.supabaseClient) {
      throw new Error('Supabase 클라이언트가 연결되지 않았습니다.');
    }

    const cleanNick = (nickname || '').trim() || '햇감자이웃';
    const avatarUri = createAvatarSvgDataUri('#E6CCB2', '🥔');

    const { data, error } = await window.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: cleanNick,
          avatar_url: avatarUri
        }
      }
    });

    if (error) {
      throw error;
    }

    let authUser = data && data.user;
    let session = data && data.session;

    // 만약 세션이 즉시 반환되지 않았다면 바로 로그인 시도
    if (!session) {
      const signInRes = await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (!signInRes.error && signInRes.data) {
        authUser = signInRes.data.user;
        session = signInRes.data.session;
      }
    }

    if (authUser) {
      // public.profiles 에 닉네임 확실히 저장
      await window.supabaseClient.from('profiles').upsert(
        [
          {
            id: authUser.id,
            nickname: cleanNick,
            avatar_url: avatarUri,
            region: '우리 동네'
          }
        ],
        { onConflict: 'id' }
      );
      await this.loadUserProfile(authUser);
      this._notifyAuthChanged();
    }

    return this.currentUser;
  },

  async signIn({ email, password }) {
    if (!window.supabaseClient) {
      throw new Error('Supabase 클라이언트가 연결되지 않았습니다.');
    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (data && data.user) {
      await this.loadUserProfile(data.user);
      this._notifyAuthChanged();
    }

    return this.currentUser;
  },

  async signOut() {
    if (window.supabaseClient && window.supabaseClient.auth) {
      await window.supabaseClient.auth.signOut();
    }
    this.currentUser = null;
    this._notifyAuthChanged();
  },

  _notifyAuthChanged() {
    if (window.GamzaList && typeof window.GamzaList.updateAuthUI === 'function') {
      window.GamzaList.updateAuthUI();
    }
    if (window.GamzaDetail && typeof window.GamzaDetail.refreshOwnerUI === 'function') {
      window.GamzaDetail.refreshOwnerUI();
    }
  },

  // 현재 로그인한 회원이 해당 상품의 작성자인지 확인
  isProductOwner(product) {
    if (!this.currentUser || !this.currentUser.id || !product) return false;
    const seller = product.seller || {};
    if (seller.id) {
      return String(seller.id) === String(this.currentUser.id);
    }
    // seller_id가 없는 이전 데이터의 경우 닉네임 일치 여부로 보조 확인
    return Boolean(this.currentUser.nickname && seller.nickname === this.currentUser.nickname);
  },

  // =========================================================================
  // 상품 데이터 포맷 및 CRUD
  // =========================================================================
  formatPrice(price) {
    const num = Number(price) || 0;
    return num === 0 ? '무료나눔' : num.toLocaleString('ko-KR') + '원';
  },

  formatRelativeTime(dateInput) {
    if (!dateInput) return '방금 전';
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return String(dateInput);

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 60) return '방금 전';

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '어제';
    if (diffDays < 30) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR');
  },

  getStatusBadgeClass(status) {
    if (status === '판매중') return 'status-sale';
    if (status === '예약중') return 'status-reserved';
    return 'status-done';
  },

  // Supabase public.products 행(row)을 화면 모델로 변환
  mapRowToProduct(row) {
    let imageUrl = row.image_url || '';
    if (!imageUrl || imageUrl.includes('%F0%9F%3C')) {
      imageUrl = createProductSvgDataUri('#EDE0D4', '#DDB892', '🪑', (row.title || '감자 매물').slice(0, 14));
    }

    return {
      id: row.id,
      title: row.title || '',
      category: row.category || '기타',
      price: Number(row.price) || 0,
      location: row.location || '우리 동네',
      uploadTime: this.formatRelativeTime(row.created_at),
      createdAt: row.created_at,
      status: row.status || '판매중',
      image: imageUrl,
      description: row.description || '',
      seller: {
        id: row.seller_id || null,
        nickname: row.seller_nickname || '햇감자이웃',
        avatar: row.seller_avatar || createAvatarSvgDataUri('#E6CCB2', '🥔'),
        region: row.seller_region || row.location || '우리 동네'
      }
    };
  },

  // Supabase에서 전체 상품 목록 불러오기
  async fetchProducts() {
    if (!window.supabaseClient) {
      return this.products;
    }

    this.isLoading = true;
    try {
      const { data, error } = await window.supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (Array.isArray(data)) {
        this.products = data.map((row) => this.mapRowToProduct(row));
        this.isConnected = true;
      }
    } catch (err) {
      console.error('[Gamza] Supabase 상품 목록 조회 실패:', err);
      this.showToast('DB 연결을 확인해 주세요 (로컬 데이터 표시 중)');
    } finally {
      this.isLoading = false;
      if (window.GamzaList && typeof window.GamzaList.render === 'function') {
        window.GamzaList.render();
      }
    }
    return this.products;
  },

  // 이미지 파일을 Supabase Storage (product-images 버킷)에 업로드하고 공개 URL 반환
  async uploadProductImage(file) {
    if (!file || !window.supabaseClient) return null;

    const bucketName =
      (window.GAMZA_SUPABASE_CONFIG && window.GAMZA_SUPABASE_CONFIG.storageBucket) ||
      'product-images';
    const ext = (file.name && file.name.includes('.') ? file.name.split('.').pop() : 'jpg')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const filePath = `items/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`;

    const { error: uploadError } = await window.supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = window.supabaseClient.storage.from(bucketName).getPublicUrl(filePath);
    return (data && data.publicUrl) || null;
  },

  getFilteredProducts() {
    return this.products.filter((item) => {
      const matchCat = this.filterCategory === '전체' || item.category === this.filterCategory;
      // '거래 가능만 보기'가 켜져 있으면 '거래 완료' 및 '예약중'을 제외하고 '판매중'만 표시
      const matchAvail = !this.onlyAvailable || (item.status === '판매중' && item.status !== '거래 완료');
      const q = this.searchQuery.trim().toLowerCase();
      const sellerNick = (item.seller && item.seller.nickname) ? item.seller.nickname.toLowerCase() : '';
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        sellerNick.includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchCat && matchAvail && matchSearch;
    });
  },

  // 새 상품을 Supabase public.products에 저장 (로그인한 작성자 ID 및 닉네임 함께 저장)
  async addProduct(newProduct) {
    const defaultAvatar = createAvatarSvgDataUri('#E6CCB2', '🥔');
    const defaultImage =
      newProduct.image ||
      createProductSvgDataUri('#F5EBE0', '#D4A373', '🥔', (newProduct.title || '감자 매물').slice(0, 14));

    const user = this.currentUser;
    const sellerId = (user && user.id) || null;
    const sellerNickname =
      (user && user.nickname) ||
      (newProduct.seller && newProduct.seller.nickname) ||
      '햇감자이웃';
    const sellerAvatar =
      (user && user.avatar) ||
      (newProduct.seller && newProduct.seller.avatar) ||
      defaultAvatar;
    const sellerRegion = newProduct.location || (user && user.region) || '우리 동네';

    if (window.supabaseClient) {
      const insertPayload = {
        title: newProduct.title,
        category: newProduct.category,
        price: Number(newProduct.price) || 0,
        description: newProduct.description || '',
        location: newProduct.location,
        status: newProduct.status || '판매중',
        image_url: defaultImage,
        seller_id: sellerId,
        seller_nickname: sellerNickname,
        seller_avatar: sellerAvatar,
        seller_region: sellerRegion
      };

      const { data, error } = await window.supabaseClient
        .from('products')
        .insert([insertPayload])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const savedProduct = this.mapRowToProduct(data);
      this.products.unshift(savedProduct);
      return savedProduct;
    }

    // 폴백 (오프라인/클라이언트 미연결 시)
    const fallbackProduct = {
      id: Date.now(),
      title: newProduct.title,
      category: newProduct.category,
      price: Number(newProduct.price) || 0,
      location: newProduct.location,
      uploadTime: '방금 전',
      status: newProduct.status || '판매중',
      image: defaultImage,
      description: newProduct.description || '',
      seller: {
        id: sellerId,
        nickname: sellerNickname,
        avatar: sellerAvatar,
        region: sellerRegion
      }
    };
    this.products.unshift(fallbackProduct);
    return fallbackProduct;
  },

  // 상품 판매 상태(판매중 / 예약중 / 거래 완료) 변경 및 Supabase 저장
  async updateProductStatus(productId, newStatus) {
    return this.updateProduct(productId, { status: newStatus });
  },

  // 게시글 수정 (제목, 카테고리, 가격, 설명, 위치, 상태, 이미지) 및 Supabase 저장
  async updateProduct(productId, updates) {
    const idx = this.products.findIndex((item) => String(item.id) === String(productId));
    const existing = idx !== -1 ? this.products[idx] : null;

    if (window.supabaseClient) {
      const dbPayload = {};
      if (updates.title !== undefined) dbPayload.title = updates.title;
      if (updates.category !== undefined) dbPayload.category = updates.category;
      if (updates.price !== undefined) dbPayload.price = Number(updates.price) || 0;
      if (updates.description !== undefined) dbPayload.description = updates.description;
      if (updates.location !== undefined) {
        dbPayload.location = updates.location;
        dbPayload.seller_region = updates.location;
      }
      if (updates.status !== undefined) dbPayload.status = updates.status;
      if (updates.image !== undefined) dbPayload.image_url = updates.image;

      const { data, error } = await window.supabaseClient
        .from('products')
        .update(dbPayload)
        .eq('id', productId)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedProduct = this.mapRowToProduct(data);
      if (idx !== -1) {
        this.products[idx] = updatedProduct;
      }
      if (window.GamzaList && typeof window.GamzaList.render === 'function') {
        window.GamzaList.render();
      }
      return updatedProduct;
    }

    if (existing) {
      const merged = Object.assign({}, existing, updates);
      if (updates.price !== undefined) merged.price = Number(updates.price) || 0;
      this.products[idx] = merged;
      if (window.GamzaList && typeof window.GamzaList.render === 'function') {
        window.GamzaList.render();
      }
      return merged;
    }
    return null;
  },

  // 게시글 삭제 및 Supabase 반영
  async deleteProduct(productId) {
    if (window.supabaseClient) {
      const { error } = await window.supabaseClient
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }
    }

    this.products = this.products.filter((item) => String(item.id) !== String(productId));
    if (window.GamzaList && typeof window.GamzaList.render === 'function') {
      window.GamzaList.render();
    }
    return true;
  },

  showToast(message) {
    let toast = document.getElementById('gamza-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gamza-toast';
      toast.className = 'gamza-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }
};
