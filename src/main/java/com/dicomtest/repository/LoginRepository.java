package com.dicomtest.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class LoginRepository {
    private final JdbcTemplate mysqlJdbcTemplate;

    public LoginRepository(@Qualifier("mysqlJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.mysqlJdbcTemplate =jdbcTemplate;
    }

    public boolean checkInfo(String userid, String password) {
        String sql = "SELECT COUNT(*) FROM USER WHERE userid = ? AND password = ?";
        Integer count = mysqlJdbcTemplate.queryForObject(sql, Integer.class, userid, password);

        return count != null && count > 0; // 존재하면 true, 없으면 false
    }

    public boolean checkInfo(String userid) {
        String sql = "SELECT COUNT(*) FROM USER WHERE userid = ?";
        Integer count = mysqlJdbcTemplate.queryForObject(sql, Integer.class, userid);

        return count != null && count > 0;
    }

    public String getUsername(String userid) {
        String sql = "SELECT username FROM USER WHERE userid = ?";
        try {
            return mysqlJdbcTemplate.queryForObject(sql, String.class, userid);
        } catch (EmptyResultDataAccessException e) {
            // userid가 없으면 null 반환
            return null;
        }
    }

    public Long getId(String userid) {
        String sql = "SELECT id FROM USER WHERE userid = ?";
        try {
            return mysqlJdbcTemplate.queryForObject(sql, Long.class, userid);
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}
