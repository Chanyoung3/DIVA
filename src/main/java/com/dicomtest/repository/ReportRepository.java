package com.dicomtest.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ReportRepository {
    private final JdbcTemplate mysqlJdbcTemplate;

    public ReportRepository(@Qualifier("mysqlJdbcTemplate") JdbcTemplate mysqlJdbcTemplate) {
        this.mysqlJdbcTemplate = mysqlJdbcTemplate;
    }

    public boolean checkUpload(Long studykey){
        String sql = "SELECT COUNT(*) FROM REPORT WHERE STUDYKEY = ?";
        Integer count = mysqlJdbcTemplate.queryForObject(sql, Integer.class, studykey);

        return count != null && count > 0;
    }

    public boolean uploadReport(Long studykey, String comment) {
        String sql = "UPDATE REPORT SET COMMENT = ? WHERE STUDYKEY = ?";
        int rows = mysqlJdbcTemplate.update(sql, comment, studykey);
        return rows > 0;
    }

    public boolean createComment(String userid, Long studykey, String comment) {
        String sql = "INSERT INTO Report (user_id, studykey, comment) VALUES (?, ?, ?)";
        int rows = mysqlJdbcTemplate.update(sql, userid, studykey, comment);
        return rows > 0;
    }

    public String getComment(Long key) {
        String sql = "SELECT COMMENT FROM REPORT WHERE STUDYKEY = ?";

        return mysqlJdbcTemplate.queryForObject(sql, String.class, key);
    }
}
