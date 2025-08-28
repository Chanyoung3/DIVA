package com.dicomtest.service;

import com.dicomtest.dto.DicomStudyResponseDto;
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

    public Long getTotalCnt(){ return pageRepository.findTotalCnt(); }

    public DicomStudyResponseDto getAllPatients() {
        Long totalcnt = getTotalCnt();
        List<Study> allPatients = pageRepository.findAll();

        return new DicomStudyResponseDto(totalcnt, allPatients);
    }

    public DicomStudyResponseDto getRecord(String studyPid) {
        Long recordCnt = pageRepository.getRecordCnt(studyPid);
        List<Study> recordList = pageRepository.getRecordList(studyPid);

        return new DicomStudyResponseDto(recordCnt, recordList);
    }
}
