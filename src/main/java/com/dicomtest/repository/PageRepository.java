package com.dicomtest.repository;

import com.dicomtest.dto.Study;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PageRepository {
    private final JdbcTemplate jdbcTemplate;

    public PageRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Study> findAll() {
        String sql = "SELECT PID, STUDYDESC, BODYPART, SERIESCNT, IMAGECNT, MODALITY, STUDYDATE, STUDYKEY FROM STUDYTAB\n";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Study(
                rs.getString("PID"),
                rs.getString("STUDYDESC"),
                rs.getString("BODYPART"),
                rs.getLong("SERIESCNT"),
                rs.getLong("IMAGECNT"),
                rs.getString("MODALITY"),
                rs.getString("STUDYDATE"),
                rs.getString("STUDYKEY")
        ));
    }
}
