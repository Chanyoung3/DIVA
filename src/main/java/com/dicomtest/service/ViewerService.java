package com.dicomtest.service;

import com.dicomtest.dto.DicomResponseDto;
import com.dicomtest.dto.Image;
import com.dicomtest.repository.ViewerRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ViewerService {
    private final ViewerRepository viewerRepository;

    public ViewerService(ViewerRepository viewerRepository) {
        this.viewerRepository = viewerRepository;
    }

    public DicomResponseDto getImageUrlList(String studyinstanceuid) {
        Long imageCnt = viewerRepository.getImageCnt(studyinstanceuid);
        List<Image> imageUrlList = viewerRepository.getImageList(studyinstanceuid);

        return new DicomResponseDto(imageCnt, imageUrlList);
    }

    /*
    public byte[] getPatientInfo(Long studyinstanceuid, Long seriesinstanceuid) throws IOException {
         String filePath = "Z:\\" + viewerRepository.getImagePath(studyinstanceuid, seriesinstanceuid) + "CR.1.2.410.200013.1.510.1.20210310170346701.0009.dcm";
         return Files.readAllBytes(Paths.get(filePath));
    }
     */
}
