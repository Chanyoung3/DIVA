package com.dicomtest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Image {
    private String path;
    private String fname;
    private Long serieskey;
    private Long imagekey;
    private String pid;
    private String pname;
    private String studydate;
    private String studytime;
}
