package com.dicomtest.repository;

import com.dicomtest.dto.DicomResponseDto;
import com.dicomtest.dto.Image;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ViewerRepository {
    private final JdbcTemplate jdbcTemplate;

    public ViewerRepository(@Qualifier("oracleJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long getImageCnt(String studyinstanceuid) {
        String sql = "SELECT IMAGECNT FROM STUDYTAB WHERE STUDYKEY = ?";

        return jdbcTemplate.queryForObject(sql, Long.class, studyinstanceuid);
    }

    public List<Image> getImageList(String studyinstanceuid) {
        String sql = "SELECT i.PATH, i.FNAME, i.SERIESKEY, i.IMAGEKEY,s.PID, s.STUDYDATE , S.PNAME , s.STUDYTIME FROM IMAGETAB i JOIN STUDYTAB s ON i.STUDYKEY = s.STUDYKEY WHERE i.STUDYKEY = ?\n";

        return jdbcTemplate.query(sql, new Object[]{studyinstanceuid}, (rs, rowNum) -> {
            // STUDYDATE 포맷 YYYY/MM/DD
            String studyDate = rs.getString("STUDYDATE");
            if (studyDate != null && studyDate.length() == 8) {
                studyDate = studyDate.substring(0,4) + "/" +
                        studyDate.substring(4,6) + "/" +
                        studyDate.substring(6,8);
            }

            // STUDYTIME 포맷 HH:MM:SS
            String studyTime = rs.getString("STUDYTIME");
            if (studyTime != null && studyTime.length() >= 6) {
                studyTime = studyTime.substring(0,2) + ":" +
                        studyTime.substring(2,4) + ":" +
                        studyTime.substring(4,6);
            }

            return new Image(
                    "Z:\\" + rs.getString("PATH"),
                    rs.getString("FNAME"),
                    rs.getLong("SERIESKEY"),
                    rs.getLong("IMAGEKEY"),
                    rs.getString("PID"),
                    rs.getString("PNAME"),
                    studyDate,
                    studyTime
            );
        });
    }
}
