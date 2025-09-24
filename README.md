# DIVA: Dicom Imaging & Visualization Application

DIVA는 웹 기반의 **DICOM (Digital Imaging and Communications in Medicine)** 이미지 뷰어 애플리케이션입니다.  
의료 영상 데이터를 손쉽게 열람하고 분석할 수 있는 **사용자 친화적인 인터페이스**를 제공합니다.

---

## 📝 프로젝트 개요

- **개발 기간**: 2025년 8월 21일 ~ 2025년 9월 11일  
- **개발 환경**:  
  - **Java & JDK**: 24버전  
  - **Node.js**: 22버전  
  - **프론트엔드**: React, JavaScript  
  - **백엔드**: Spring Boot, Node.js  
  - **데이터베이스**: MySQL (로컬), Oracle (서버)  

---

## ✨ 주요 기능

- 📂 **DICOM 파일 업로드 및 관리**  
  로컬 서버에서 DICOM 데이터를 가져와 열람 가능

- 🖼 **멀티 프레임 지원**  
  CT, MRI 등 다중 슬라이스 영상 탐색

- ⚙️ **웹 기반 인터페이스**  
  브라우저만 있으면 설치 없이 사용 가능

- 🏥 **의료 분석 보조 도구 제공**  
  ROI(Region of Interest) 표시, 거리/각도 측정, 주석 추가/삭제 가능

---

## 🛠 지원 도구 (Tools)

- 🖐 **Pan Tool** – 이미지를 드래그하여 이동  
- 🔍 **Zoom Tool** – 영상 확대/축소  
- 🌗 **Window Level Tool** – 윈도우 레벨(Window Level) & 윈도우 폭(Window Width) 조정  
- 📐 **Angle Tool** – 각도 측정  
- 📏 **Length Tool** – 거리 측정  
- 🎯 **Probe Tool** – 특정 지점의 픽셀 값/정보 확인  
- ⬛ **Rectangle ROI Tool** – 직사각형 ROI 표시  
- 🟠 **Elliptical ROI Tool** – 타원형 ROI 표시  
- 🩹 **Eraser Tool** – ROI/주석 삭제  
- 🏷 **Label Tool** – 라벨/주석 추가  

---

## 🛠 기술 스택

- **Frontend**  
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">  

- **Backend**  
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">  

- **Database**  
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 로컬 DB  
  <img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white"> 서버 DB  

- **DICOM 처리**  
  [cornerstone.js](https://github.com/cornerstonejs)

---

## 📸 실행 화면

- **로그인 페이지 (Login Page)**  
  사용자가 계정으로 로그인할 수 있는 화면  

<img width="770" height="549" alt="Login Page" src="https://github.com/user-attachments/assets/4c895163-14c1-4a6d-902f-ed12859a9755" />

- **메인 페이지 (Main Page)**  
  업로드된 DICOM 파일 목록 및 관리 & 리포트 작성 화면

<img width="1221" height="624" alt="Main Page" src="https://github.com/user-attachments/assets/6939517a-2e14-44c6-98d8-82db2917333e" />

- **뷰어 페이지 (Viewer Page)**  
  DICOM 이미지 확인 및 분석 도구 사용 화면  

<img width="1219" height="626" alt="Viewer Page" src="https://github.com/user-attachments/assets/a4175fb2-e418-4434-b730-a541f8fc86aa" />
