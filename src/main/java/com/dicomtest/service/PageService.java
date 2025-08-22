package com.dicomtest.service;

import com.dicomtest.dto.Study;
import com.dicomtest.repository.PageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PageService {
    private final PageRepository pageRepository;

    public PageService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    public List<Study> getAllPatients() {
        return pageRepository.findAll();
    }
}
