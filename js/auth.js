// ==========================================================================
// [화면 4: 로그인 / 회원가입 모달] 모듈 (js/auth.js)
// ==========================================================================
(function () {
  window.GamzaAuth = {
    containerEl: null,
    mode: 'login', // 'login' | 'signup'
    isSubmitting: false,
    pendingOnSuccess: null,
    _keydownHandler: null,

    init(containerEl) {
      if (typeof containerEl === 'string') {
        this.containerEl = document.querySelector(containerEl);
      } else if (containerEl instanceof HTMLElement) {
        this.containerEl = containerEl;
      }

      if (!this.containerEl) {
        this.containerEl = document.getElementById('app-auth-root');
      }

      if (!this.containerEl) {
        this.containerEl = document.createElement('div');
        this.containerEl.id = 'app-auth-root';
        document.body.appendChild(this.containerEl);
      }

      this.render();
      this.bindEvents();
    },

    render() {
      if (!this.containerEl) return;

      this.containerEl.innerHTML = `
        <div class="auth-overlay" id="gamza-auth-overlay" role="dialog" aria-modal="true" aria-labelledby="gamza-auth-title" aria-hidden="true">
          <div class="auth-modal">
            <header class="auth-header">
              <div class="auth-title-wrap">
                <span class="auth-title-icon" aria-hidden="true">🥔</span>
                <h2 class="auth-title" id="gamza-auth-title">감자 시작하기</h2>
              </div>
              <button type="button" class="auth-close-btn" id="gamza-auth-close-btn" aria-label="로그인 창 닫기">
                ✕ 닫기
              </button>
            </header>

            <div class="auth-tabs" role="tablist" aria-label="로그인 또는 회원가입 선택">
              <button
                type="button"
                role="tab"
                id="gamza-tab-login"
                class="auth-tab-btn active"
                data-auth-mode="login"
                aria-selected="true"
              >
                로그인
              </button>
              <button
                type="button"
                role="tab"
                id="gamza-tab-signup"
                class="auth-tab-btn"
                data-auth-mode="signup"
                aria-selected="false"
              >
                회원가입
              </button>
            </div>

            <form class="auth-body" id="gamza-auth-form" novalidate>
              <div class="auth-notice-msg hidden" id="gamza-auth-notice"></div>
              <div class="auth-error-msg hidden" id="gamza-auth-error" role="alert"></div>

              <!-- 이메일 -->
              <div class="auth-field">
                <label class="auth-label" for="gamza-auth-email">
                  <span>이메일</span>
                  <span class="auth-required">*</span>
                </label>
                <input
                  type="email"
                  id="gamza-auth-email"
                  class="auth-input"
                  placeholder="example@gamza.kr"
                  autocomplete="email"
                  required
                />
              </div>

              <!-- 비밀번호 -->
              <div class="auth-field">
                <label class="auth-label" for="gamza-auth-password">
                  <span>비밀번호</span>
                  <span class="auth-required">*</span>
                  <span class="auth-hint">6자 이상</span>
                </label>
                <input
                  type="password"
                  id="gamza-auth-password"
                  class="auth-input"
                  placeholder="비밀번호를 입력해 주세요"
                  autocomplete="current-password"
                  required
                />
              </div>

              <!-- 닉네임 (회원가입 시 필수) -->
              <div class="auth-field hidden" id="gamza-auth-nickname-field">
                <label class="auth-label" for="gamza-auth-nickname">
                  <span>닉네임 (별명)</span>
                  <span class="auth-required">*</span>
                  <span class="auth-hint">실명 대신 사용할 별명</span>
                </label>
                <input
                  type="text"
                  id="gamza-auth-nickname"
                  class="auth-input"
                  placeholder="예: 포슬감자, 연남동감자"
                  maxlength="30"
                  autocomplete="nickname"
                />
              </div>

              <button type="submit" class="btn btn-primary auth-submit-btn" id="gamza-auth-submit-btn">
                🥔 로그인하기
              </button>
            </form>
          </div>
        </div>
      `;
    },

    bindEvents() {
      if (!this.containerEl) return;

      const overlay = this.containerEl.querySelector('#gamza-auth-overlay');
      const closeBtn = this.containerEl.querySelector('#gamza-auth-close-btn');
      const form = this.containerEl.querySelector('#gamza-auth-form');
      const modeButtons = this.containerEl.querySelectorAll('[data-auth-mode]');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.pendingOnSuccess = null;
          this.close();
        });
      }

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.pendingOnSuccess = null;
            this.close();
          }
        });
      }

      modeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetMode = btn.getAttribute('data-auth-mode');
          if (targetMode) {
            this.setMode(targetMode);
          }
        });
      });

      if (form) {
        form.addEventListener('input', (e) => {
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

      if (this._keydownHandler) {
        document.removeEventListener('keydown', this._keydownHandler);
      }
      this._keydownHandler = (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
          this.pendingOnSuccess = null;
          this.close();
        }
      };
      document.addEventListener('keydown', this._keydownHandler);
    },

    setMode(mode) {
      this.mode = mode === 'signup' ? 'signup' : 'login';
      const isSignup = this.mode === 'signup';

      const loginTab = this.containerEl.querySelector('#gamza-tab-login');
      const signupTab = this.containerEl.querySelector('#gamza-tab-signup');
      const titleEl = this.containerEl.querySelector('#gamza-auth-title');
      const nicknameField = this.containerEl.querySelector('#gamza-auth-nickname-field');
      const submitBtn = this.containerEl.querySelector('#gamza-auth-submit-btn');
      const pwInput = this.containerEl.querySelector('#gamza-auth-password');

      if (loginTab) {
        loginTab.classList.toggle('active', !isSignup);
        loginTab.setAttribute('aria-selected', String(!isSignup));
      }
      if (signupTab) {
        signupTab.classList.toggle('active', isSignup);
        signupTab.setAttribute('aria-selected', String(isSignup));
      }
      if (titleEl) {
        titleEl.textContent = isSignup ? '감자 회원가입' : '감자 로그인';
      }
      if (nicknameField) {
        nicknameField.classList.toggle('hidden', !isSignup);
      }
      if (pwInput) {
        pwInput.setAttribute('autocomplete', isSignup ? 'new-password' : 'current-password');
      }
      if (submitBtn) {
        submitBtn.textContent = isSignup ? '🥔 회원가입 완료' : '🥔 로그인하기';
      }

      this.hideError();
    },

    showNotice(msg) {
      const noticeEl = this.containerEl.querySelector('#gamza-auth-notice');
      if (!noticeEl) return;
      if (msg) {
        noticeEl.textContent = msg;
        noticeEl.classList.remove('hidden');
      } else {
        noticeEl.textContent = '';
        noticeEl.classList.add('hidden');
      }
    },

    showError(msg) {
      const errEl = this.containerEl.querySelector('#gamza-auth-error');
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.classList.remove('hidden');
    },

    hideError() {
      const errEl = this.containerEl.querySelector('#gamza-auth-error');
      if (!errEl) return;
      errEl.textContent = '';
      errEl.classList.add('hidden');
    },

    async handleSubmit() {
      if (this.isSubmitting) return;

      const emailEl = this.containerEl.querySelector('#gamza-auth-email');
      const pwEl = this.containerEl.querySelector('#gamza-auth-password');
      const nicknameEl = this.containerEl.querySelector('#gamza-auth-nickname');
      const submitBtn = this.containerEl.querySelector('#gamza-auth-submit-btn');

      const email = emailEl ? emailEl.value.trim() : '';
      const password = pwEl ? pwEl.value : '';
      const nickname = nicknameEl ? nicknameEl.value.trim() : '';

      if (!email || !email.includes('@')) {
        if (emailEl) {
          emailEl.classList.add('is-invalid');
          emailEl.focus();
        }
        this.showError('올바른 이메일 주소를 입력해 주세요.');
        return;
      }

      if (!password || password.length < 6) {
        if (pwEl) {
          pwEl.classList.add('is-invalid');
          pwEl.focus();
        }
        this.showError('비밀번호는 6자 이상 입력해 주세요.');
        return;
      }

      if (this.mode === 'signup' && !nickname) {
        if (nicknameEl) {
          nicknameEl.classList.add('is-invalid');
          nicknameEl.focus();
        }
        this.showError('회원가입 시 사용할 닉네임을 꼭 입력해 주세요.');
        return;
      }

      this.isSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = this.mode === 'signup' ? '🥔 가입 처리 중...' : '🥔 로그인 중...';
      }

      try {
        if (this.mode === 'signup') {
          await window.GamzaStore.signUp({ email, password, nickname });
          window.GamzaStore.showToast(`환영합니다, ${nickname}님! 회원가입 및 로그인이 완료되었어요 🥔`);
        } else {
          const user = await window.GamzaStore.signIn({ email, password });
          const displayNick = (user && user.nickname) || '햇감자이웃';
          window.GamzaStore.showToast(`반가워요, ${displayNick}님! 로그인되었습니다 🥔`);
        }

        const nextAction = this.pendingOnSuccess;
        this.pendingOnSuccess = null;
        this.close();

        if (typeof nextAction === 'function') {
          setTimeout(() => {
            nextAction();
          }, 80);
        }
      } catch (err) {
        console.error('[GamzaAuth] 인증 오류:', err);
        const rawMsg = (err && err.message) ? String(err.message) : '';
        if (rawMsg.includes('Invalid login credentials')) {
          this.showError('이메일 또는 비밀번호가 일치하지 않습니다.');
        } else if (rawMsg.includes('User already registered')) {
          this.showError('이미 가입된 이메일입니다. [로그인] 탭에서 로그인해 주세요.');
        } else {
          this.showError(rawMsg || '인증 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      } finally {
        this.isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = this.mode === 'signup' ? '🥔 회원가입 완료' : '🥔 로그인하기';
        }
      }
    },

    open(options = {}) {
      if (!this.containerEl) {
        this.init();
      }

      const mode = options.mode || 'login';
      const notice = options.notice || '';
      this.pendingOnSuccess = typeof options.onSuccess === 'function' ? options.onSuccess : null;

      const form = this.containerEl.querySelector('#gamza-auth-form');
      if (form) form.reset();
      const invalids = this.containerEl.querySelectorAll('.is-invalid');
      invalids.forEach((el) => el.classList.remove('is-invalid'));

      this.setMode(mode);
      this.showNotice(notice);

      this.containerEl.classList.remove('hidden');
      const overlay = this.containerEl.querySelector('#gamza-auth-overlay');
      if (overlay) {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';

      const emailEl = this.containerEl.querySelector('#gamza-auth-email');
      if (emailEl) {
        setTimeout(() => emailEl.focus(), 60);
      }
    },

    close() {
      if (!this.containerEl) return;
      const overlay = this.containerEl.querySelector('#gamza-auth-overlay');
      if (overlay) {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
      }
      this.containerEl.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };
})();
