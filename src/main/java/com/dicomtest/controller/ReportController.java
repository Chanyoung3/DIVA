package com.dicomtest.controller;

import com.dicomtest.service.PageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ReportController {
    private final PageService pageService;

    public ReportController(PageService pageService) {
        this.pageService = pageService;
    }

    @PostMapping("/report")
    public ResponseEntity<?> reportUpload(
            @RequestParam String id,
            @RequestParam Long key,
            @RequestParam String comment){
        if(pageService.checkUpload(key)){ // 등록되어 있는 리포트가 있는지 확인
            if(pageService.uploadReport(key, comment)){ // 리포트의 코멘트 업데이트 시도
                return ResponseEntity.ok(Map.of("success", true));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false));
            }
        }else{
            if(pageService.createReport(id, key, comment)) {
                return ResponseEntity.ok(Map.of("success", true));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false));
            }
        }
    }

    @GetMapping("/report")
    public String reportCommnt(
            @RequestParam Long key){
        if(pageService.checkUpload(key)){
            return pageService.getReport(key);
        }else return "";
    }
}
