# DIVA: Dicom Imaging & Visualization Application

DIVA는 웹 기반의 **DICOM (Digital Imaging and Communications in Medicine)** 이미지 뷰어 애플리케이션입니다.  
의료 영상 데이터를 손쉽게 열람하고 분석할 수 있는 **사용자 친화적인 인터페이스**를 제공합니다.

---

## ✨ 주요 기능
- 📂 **DICOM 파일 업로드 및 관리**  
  로컬 또는 PACS 서버에서 DICOM 데이터를 가져와 열람 가능

- 🔍 **다양한 뷰어 기능 지원**  
  - 확대/축소 (Zoom In/Out)  
  - 회전/반전 (Rotate/Flip)  
  - 윈도우 레벨(Window Level), 윈도우 폭(Window Width) 조정  

- 🖼 **멀티 프레임 지원**  
  CT, MRI 등 다중 슬라이스 영상 탐색

- ⚙️ **웹 기반 인터페이스**  
  브라우저만 있으면 설치 없이 사용 가능

- 🏥 **의료 분석 보조 도구**  
  ROI(Region of Interest) 표시, 거리/각도 측정 기능 제공

---

## 🛠 기술 스택
- **Frontend**: React.js, TailwindCSS (또는 Bootstrap)  
- **Backend**: Node.js / Python (FastAPI or Flask)  
- **DICOM 처리**: [cornerstone.js](https://github.com/cornerstonejs), [dicomParser](https://github.com/cornerstonejs/dicomParser)  
- **배포 환경**: Docker, Nginx  

---

## 🚀 설치 및 실행 방법

### 1. 저장소 클론
```bash
git clone https://github.com/username/diva.git
cd diva
