package com.dicomtest.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class LoginRepository {
    private final JdbcTemplate mysqlJdbcTemplate;

    public LoginRepository(@Qualifier("mysqlJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.mysqlJdbcTemplate =jdbcTemplate;
    }

    public boolean checkInfo(String username, String password) {
        String sql = "SELECT COUNT(*) FROM USER WHERE id = ? AND password = ?";
        Integer count = mysqlJdbcTemplate.queryForObject(sql, Integer.class, username, password);

        return count != null && count > 0; // 존재하면 true, 없으면 false
    }
}
