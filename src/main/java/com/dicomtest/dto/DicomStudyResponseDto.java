package com.dicomtest.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DicomStudyResponseDto {
    private Long recordCnt;
    private List<Study> data;
}
