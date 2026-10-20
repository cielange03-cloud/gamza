// 감자 (Gamza) - Supabase 클라이언트 설정 (공개용 URL 및 Anon Key만 포함)
// 주의: SUPABASE_SERVICE_ROLE_KEY는 서버/백엔드 전용이므로 클라이언트 코드에 절대 포함하지 않습니다 (.env 파일에만 보관).
window.GAMZA_SUPABASE_CONFIG = {
  projectId: 'iupxmkygczpipmqwfgnu',
  url: 'https://iupxmkygczpipmqwfgnu.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cHhta3lnY3pwaXBtcXdmZ251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MDc0NzAsImV4cCI6MjEwNzk4MzQ3MH0.2tvGg3zYAPv9HJnpZSVQUxjpHyGdJGD6u6vXt6jMoxg',
  storageBucket: 'product-images'
};

// Supabase JS 클라이언트 인스턴스 초기화
if (window.supabase && typeof window.supabase.createClient === 'function') {
  window.supabaseClient = window.supabase.createClient(
    window.GAMZA_SUPABASE_CONFIG.url,
    window.GAMZA_SUPABASE_CONFIG.anonKey
  );
} else {
  console.warn('[Gamza] Supabase SDK가 로드되지 않아 로컬 폴백 모드로 동작합니다.');
  window.supabaseClient = null;
}
