package com.dicomtest.controller;

import com.dicomtest.dto.DicomResponseDto;
import com.dicomtest.dto.Study;
import com.dicomtest.service.PageService;
import com.dicomtest.service.ViewerService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class PageController {
    private final PageService pageService;
    private final ViewerService viewerService;

    public  PageController(PageService pageService,  ViewerService viewerService) {
        this.pageService = pageService;
        this.viewerService = viewerService;
    }

    // STUDYTAB의 검사 리스트
    @GetMapping("/studies")
    public List<Study> getAllPatients() {
        return pageService.getAllPatients();
    }

    // 검사 이미지 경로 가져오기
    @GetMapping("/studies/{studyinstanceuid}")
    public DicomResponseDto getImageUrl(
            @PathVariable String studyinstanceuid) {
        return viewerService.getImageUrlList(studyinstanceuid);
    }
    
    // 검사 이미지 base64로 변환 후 응답
    /*
    @GetMapping("/studies/{studyinstanceuid}/series/{seriesinstanceuid}")
    public ResponseEntity<byte[]> getPatient(
            @PathVariable Long studyinstanceuid,
            @PathVariable Long seriesinstanceuid) {
        try {
            byte[] dicomBytes = viewerService.getPatientInfo(studyinstanceuid, seriesinstanceuid);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
                    .body(dicomBytes);
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 에러 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
     */

}