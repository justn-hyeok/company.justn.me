# company.justn.me

justn 스튜디오 소개 사이트. Next.js 16 App Router, Tailwind 4, React Flow(제품 지도 목차), GSAP.

```sh
pnpm install
pnpm dev        # http://localhost:3000 → /ko 또는 /en 으로 리다이렉트
pnpm build && pnpm start
pnpm lint
```

- 언어: `/ko`, `/en`. 루트 `/`는 `src/proxy.ts`가 쿠키(`NEXT_LOCALE`)·Accept-Language로 보냅니다.
- 문구: `src/i18n/dictionaries/{ko,en}.ts`. 제품·연혁 사실: `src/content/{products,milestones,site}.ts`.
- 제품 녹화: `public/media/*.mp4`는 각 저장소 문서의 실제 TUI 녹화(agent-progress `docs/media/progress.mp4`, brgr `docs/assets/demo.gif`를 mp4로 변환).
- 법적 페이지: `/[locale]/terms`, `/[locale]/privacy`. 게시 전 내용을 직접 확인하세요.
- 구조: 히어로(대표 제품 brgr 실제 녹화) → 제품(지도 목차 + 제품별 행; justn 제품 4개, 2인 팀 공동 제품 2개) → 원칙 → 기록 → 만드는 사람 → 연락.
- 검수: 헤드리스 Chrome 스크립트는 세션 scratchpad의 `verify.mjs` 참고(1440/390, ko/en, 콘솔, reduced-motion, 키보드).
