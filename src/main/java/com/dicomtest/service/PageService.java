package com.dicomtest.service;

import com.dicomtest.dto.DicomStudyResponseDto;
import com.dicomtest.dto.Study;
import com.dicomtest.repository.PageRepository;
import com.dicomtest.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PageService {
    private final PageRepository pageRepository;
    private final ReportRepository recordRepository;

    public PageService(PageRepository pageRepository,  ReportRepository recordRepository) {
        this.pageRepository = pageRepository;
        this.recordRepository = recordRepository;
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

    public boolean checkUpload(Long studykey){
        return recordRepository.checkUpload(studykey);
    }

    public boolean uploadReport(Long studykey, String comment) {
        return recordRepository.uploadReport(studykey, comment);
    }

    public boolean createReport(String userid, Long studykey, String comment) {
        return recordRepository.createComment(userid, studykey, comment);
    }

    public String getReport(Long key) {
        return recordRepository.getComment(key);
    }
}
