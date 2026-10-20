// 감자 (Gamza) 중고거래 플랫폼 - 메인 통합 컨트롤러 (js/app.js)
document.addEventListener('DOMContentLoaded', () => {
  const listRoot = document.getElementById('app-list-root');
  const detailRoot = document.getElementById('app-detail-root');
  const writeRoot = document.getElementById('app-write-root');
  const authRoot = document.getElementById('app-auth-root');

  // [화면 4] 로그인 / 회원가입 모달 초기화
  if (window.GamzaAuth) {
    window.GamzaAuth.init(authRoot);
  }

  // [화면 2] 상세 팝업 초기화
  if (window.GamzaDetail) {
    window.GamzaDetail.init(detailRoot);
  }

  // [화면 3] 글쓰기 화면 초기화
  if (window.GamzaWrite) {
    window.GamzaWrite.init(writeRoot, {
      onProductCreated(newProduct) {
        // 새 글 작성 시 전체 카테고리로 맞추거나 현재 필터를 유지한 채 목록 즉시 갱신
        if (
          window.GamzaStore.filterCategory !== '전체' &&
          window.GamzaStore.filterCategory !== newProduct.category
        ) {
          window.GamzaStore.filterCategory = '전체';
        }
        if (window.GamzaStore.onlyAvailable && newProduct.status !== '판매중') {
          window.GamzaStore.onlyAvailable = false;
        }
        if (window.GamzaList) {
          window.GamzaList.render();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // [화면 1] 상품 목록 화면 초기화
  if (window.GamzaList) {
    window.GamzaList.init(listRoot, {
      onSelectProduct(productId) {
        if (window.GamzaDetail) {
          window.GamzaDetail.open(productId);
        }
      },
      onOpenWrite() {
        const user = window.GamzaStore && window.GamzaStore.currentUser;
        // 비로그인 상태에서 [글쓰기] 클릭 시 로그인 모달을 먼저 띄우고, 로그인 성공 시 글쓰기 창 이어서 열기
        if (!user || !user.id) {
          if (window.GamzaAuth) {
            window.GamzaAuth.open({
              mode: 'login',
              notice: '내 물건을 팔려면 먼저 로그인해 주세요 🥔 로그인 완료 시 글쓰기 창이 바로 이어서 열립니다!',
              onSuccess() {
                if (window.GamzaWrite) {
                  window.GamzaWrite.open();
                }
              }
            });
          }
          return;
        }

        if (window.GamzaWrite) {
          window.GamzaWrite.open();
        }
      },
      onOpenAuth(options) {
        if (window.GamzaAuth) {
          window.GamzaAuth.open(options || { mode: 'login' });
        }
      }
    });
  }

  // Supabase Auth 세션 복원 및 실시간 매물 목록 불러오기
  if (window.GamzaStore) {
    if (typeof window.GamzaStore.initAuth === 'function') {
      window.GamzaStore.initAuth();
    }
    if (typeof window.GamzaStore.fetchProducts === 'function') {
      window.GamzaStore.fetchProducts();
    }
  }
});
