package com.dicomtest.repository;

import com.dicomtest.dto.DicomResponseDto;
import com.dicomtest.dto.Image;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ViewerRepository {
    private final JdbcTemplate jdbcTemplate;

    public ViewerRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long getImageCnt(String studyinstanceuid) {
        String sql = "SELECT IMAGECNT FROM STUDYTAB WHERE STUDYKEY = ?";

        return jdbcTemplate.queryForObject(sql, Long.class, studyinstanceuid);
    }

    public List<Image> getImageList(String studyinstanceuid) {
        String sql = "SELECT PATH, FNAME FROM IMAGETAB WHERE STUDYKEY = ?";

        return jdbcTemplate.query(sql, new Object[]{studyinstanceuid}, (rs, rowNum) -> new Image(
                "Z:\\" +rs.getString("PATH"),
                rs.getString("FNAME"),
                (long) (rowNum + 1)
        ));
    }

    /*
    public String getImagePath(Long studyInstanceUid, Long seriesInstanceUid) {
        String sql = "SELECT PATH FROM IMAGETAB WHERE STUDYKEY = ? AND SERIESKEY = ?";

        return jdbcTemplate.queryForObject(
                sql,
                new Object[]{studyInstanceUid, seriesInstanceUid},
                String.class
        );
    }
     */
}
