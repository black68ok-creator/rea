# Lantern Drift 3D — Stories

Rigor `minimal` · Engine Three.js r128 · Evidence `production/qa/evidence/`
검증: Playwright + Chromium(SwiftShader 소프트웨어 WebGL), `window.__lantern` 테스트 시드. 콘솔 오류 0.

| ID  | Story                                | Type        | 결과 / 근거                                                        | Status |
| --- | ------------------------------------ | ----------- | ------------------------------------------------------------------ | ------ |
| S01 | 3D 아레나·조명·그림자·카메라         | Visual/Feel | `title.png`, `play.png` (석순 그림자가 랜턴 반대로 드리움)         | DONE   |
| S02 | 이동 + 기둥 충돌                     | Logic       | D키 이동 확인, 기둥 중심에 놓으면 반경 밖으로 밀려남               | DONE   |
| S03 | 빛 감소·반딧불·정령 소멸·접촉        | Logic       | 반딧불 +9, 빛 안 정령 소멸 1, 접촉 -22 및 콤보 초기화              | DONE   |
| S04 | 플레어                               | Visual/Feel | 빛 -18, 쿨다운 1.4초, 범위 내 7마리 제거, `flare.png`              | DONE   |
| S05 | 콤보·점수 팝업·WAVE                  | Logic/UI    | 연속 획득 시 ×1→×2→×3, 점수 10→20→30; 30초에 WAVE 2 배너           | DONE   |
| S06 | 타이틀·일시정지·게임 오버·HUD·모바일 | UI          | `title.png`, `gameover.png`, `mobile.png`; R 재시작 시 상태 초기화 | DONE   |

## QA notes

- 수정: `display: grid`가 `hidden` 속성을 덮어써 모든 화면이 겹쳐 보이던 문제.
- 수정: 그림자 정령이 분홍 방울처럼 보여 적으로 읽히지 않던 문제 → 어두운 몸체 + 빛나는 눈.
- 수정: 위에서 본 랜턴이 검은 원판처럼 보이던 문제, 콤보 텍스트 우측 잘림, 게임 오버 위 WAVE 배너 겹침, 모바일 HUD 줄바꿈.
- 미검증: 실제 GPU 프레임레이트(헤드리스 소프트웨어 렌더링은 약 18fps), 효과음 청취, 사람 플레이테스트.
