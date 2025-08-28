package com.dicomtest.repository;

import com.dicomtest.dto.Study;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PageRepository {
    private final JdbcTemplate jdbcTemplate;

    public PageRepository(@Qualifier("oracleJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long findTotalCnt(){
        String sql = "SELECT count(*) TOTAL FROM STUDYTAB";

        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public List<Study> findAll() {
        String sql = "SELECT PID, STUDYDESC, BODYPART, SERIESCNT, IMAGECNT, MODALITY, STUDYDATE, STUDYKEY FROM STUDYTAB";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            String studyDate = rs.getString("STUDYDATE");
            if (studyDate != null && studyDate.length() == 8) {
                studyDate = studyDate.substring(0, 4) + "/" +
                        studyDate.substring(4, 6) + "/" +
                        studyDate.substring(6, 8);
            }

            return new Study(
                    rs.getString("PID"),
                    rs.getString("STUDYDESC"),
                    rs.getString("BODYPART"),
                    rs.getLong("SERIESCNT"),
                    rs.getLong("IMAGECNT"),
                    rs.getString("MODALITY"),
                    studyDate,
                    rs.getString("STUDYKEY")
            );
        });
    }

    public Long getRecordCnt(String studyUid) {
        String sql = "SELECT COUNT(*) CNT FROM STUDYTAB WHERE PID = ?";

        return  jdbcTemplate.queryForObject(sql, Long.class, studyUid);
    }

    public List<Study> getRecordList(String studyUid) {
        String sql = "SELECT PID, STUDYDESC, BODYPART, SERIESCNT, IMAGECNT, MODALITY, STUDYDATE, STUDYKEY " +
                "FROM STUDYTAB WHERE PID = ? ORDER BY STUDYDATE DESC";

        return jdbcTemplate.query(sql, new Object[]{studyUid}, (rs, rowNum) -> {
            String studyDate = rs.getString("STUDYDATE");
            if (studyDate != null && studyDate.length() == 8) {
                studyDate = studyDate.substring(0, 4) + "/" +
                        studyDate.substring(4, 6) + "/" +
                        studyDate.substring(6, 8);
            }
            return new Study(
                    rs.getString("PID"),
                    rs.getString("STUDYDESC"),
                    rs.getString("BODYPART"),
                    rs.getLong("SERIESCNT"),
                    rs.getLong("IMAGECNT"),
                    rs.getString("MODALITY"),
                    studyDate,
                    rs.getString("STUDYKEY")
            );
        });
    }
}
