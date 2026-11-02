# Lantern Drift — Stories

Rigor: `minimal` · Engine: HTML5 Canvas · Evidence: `production/qa/evidence/`
Verification: Playwright (Chromium 1000×650 + 390×760) drove each criterion through the
`window.__lantern` test seam; no console errors; ~61 fps.

## S01 — 이동 + 빛/어둠 렌더링 · Type: Visual/Feel

- [x] Enter로 시작하면 state가 `play`가 된다.
- [x] D 키 0.5초 → 플레이어가 오른쪽으로 약 118px 이동.
- [x] 빛 반경 밖은 어둡고 반경 안만 보인다.

Evidence: `S01-S03-play.png` · Status: DONE

## S02 — 빛 감소 + 반딧불 회복 · Type: Logic

- [x] 1.5초 동안 빛이 약 3.2 감소 (2.1/s + 분당 증가).
- [x] 반딧불 획득 시 빛 +9, 점수 +10.

Evidence: Playwright 수치 확인 · Status: DONE

## S03 — 그림자 정령 · Type: Logic

- [x] 빛 안에 머문 정령은 1초 이내 소멸, 처치 수 +1.
- [x] 접촉 시 빛 -22, 화면 흔들림.

Evidence: Playwright 수치 확인, `S01-S03-play.png` · Status: DONE

## S04 — 플레어 · Type: Visual/Feel

- [x] 사용 시 빛 -18, 쿨다운 1.4초, 범위 안 정령만 제거 (범위 밖 1마리는 남음).

Evidence: `S04-flare.png` · Status: DONE

## S05 — 난이도 상승 · Type: Config/Data

- [x] 정령 생성 간격 2.3초 → 2분 후 0.5초. 속도·빛 감소도 시간에 비례해 증가.

Evidence: CONFIG 공식 확인 · Status: DONE

## S06 — 상태 화면 / HUD · Type: UI

- [x] 타이틀, 일시정지(P/포커스 이탈), 게임 오버, 최고 점수(localStorage), R로 재시작.
- [x] 모바일 세로 화면에서도 HUD가 겹치지 않음.

Evidence: `S06-title.png`, `S06-paused.png`, `S06-gameover.png`, `S06-mobile.png` · Status: DONE

## S07 — 손맛 · Type: Visual/Feel

- [x] 파티클, 플레어 링, 흔들림(`prefers-reduced-motion` 시 비활성), WebAudio 효과음, M 음소거.

Evidence: `S04-flare.png` · Status: DONE (효과음은 헤드리스로 들을 수 없어 수동 확인 필요)

## QA notes

- 수정: 창 크기 변경 시 플레이어가 화면 가장자리로 밀리던 문제 → 상대 위치 유지.
- 수정: 터치 사용자에게 플레어 조작(더블탭)이 HUD에 안 보이던 문제.
- 미검증: 실제 사람의 플레이테스트, 난이도 체감 (`/balance-check` 다음 단계).
