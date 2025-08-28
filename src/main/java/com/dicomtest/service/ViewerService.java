package com.dicomtest.service;

import com.dicomtest.dto.DicomResponseDto;
import com.dicomtest.dto.Image;
import com.dicomtest.repository.ViewerRepository;
import org.springframework.stereotype.Service;

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
}
