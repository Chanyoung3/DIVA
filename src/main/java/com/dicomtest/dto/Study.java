package com.dicomtest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Study {
    private String pid; // 환자 ID
    private String pname; // 환자이름
    private String studydesc; // 검사 설명
    private String bodypart; // 부위
    private Long seriescnt; // 시리즈 수
    private Long imagecnt; // 이미지 수
    private String modality; // 장비
    private String studydate; // 검사 날
    private String studykey;
}
