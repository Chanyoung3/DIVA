package com.dicomtest.controller;

import com.dicomtest.dto.Study;
import com.dicomtest.service.PageService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PageController {
    private final PageService pageService;

    public  PageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping("/all")
    public List<Study> getAllPatients() {
        return pageService.getAllPatients();
    }
}