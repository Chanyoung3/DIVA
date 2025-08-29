package com.dicomtest.controller;

import com.dicomtest.dto.DicomStudyResponseDto;
import com.dicomtest.dto.DicomResponseDto;
import com.dicomtest.dto.Study;
import com.dicomtest.service.PageService;
import com.dicomtest.service.ViewerService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PageController {
    private final PageService pageService;
    private final ViewerService viewerService;

    public  PageController(PageService pageService,  ViewerService viewerService) {
        this.pageService = pageService;
        this.viewerService = viewerService;
    }

    // STUDYTAB의 검사 리스트
    @GetMapping("/studies")
    public DicomStudyResponseDto getAllPatients() {
        return pageService.getAllPatients();
    }

    // 검사 이미지 경로 가져오기
    @GetMapping("/studies/{studyinstanceuid}")
    public DicomResponseDto getImageUrl(
            @PathVariable String studyinstanceuid) {
        return viewerService.getImageUrlList(studyinstanceuid);
    }

    // 뷰어에서 이미지 불러오기
    @GetMapping("/studies/{studyUid}/image")
    public ResponseEntity<byte[]> getDicomImage(
            @PathVariable("studyUid") String studyUid,
            @RequestParam String path,
            @RequestParam String fname) {

        try {
            // 파일 경로 생성
            File dicomFile = new File(path, fname);

            if (!dicomFile.exists()) {
                System.out.println("파일이 존재하지 않음: " + dicomFile.getAbsolutePath());
                return ResponseEntity.notFound().build();
            }

            // DICOM 파일 읽기
            byte[] dicomBytes = Files.readAllBytes(dicomFile.toPath());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/dicom"));
            headers.setContentLength(dicomBytes.length);

            return new ResponseEntity<>(dicomBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 리스트에서 클릭시 과거 검사 이력 불러오기
    @GetMapping("/studies/{studyPid}/record")
    public DicomStudyResponseDto getDicomRecord(
            @PathVariable String studyPid){
        return pageService.getRecord(studyPid);
    }
}