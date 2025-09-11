package com.dicomtest.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
public class MysqlConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.mysql.datasource")
    public DataSource mysqlDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean mysqlEntityManager(@Qualifier("mysqlDataSource") DataSource ds) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(ds);
        em.setPackagesToScan("com.dicomtest.entity"); // MySQL 엔티티 패키지
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "create"); // 엔티티 기반 테이블 자동 생성
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        em.setJpaPropertyMap(properties);

        return em;
    }

    @Bean
    public JdbcTemplate mysqlJdbcTemplate(@Qualifier("mysqlDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }

    @Bean
    public CommandLineRunner initData(@Qualifier("mysqlJdbcTemplate") JdbcTemplate jdbcTemplate) {
        return args -> {
            Integer adminCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM `user` WHERE userid = 'admin'", Integer.class);
            if (adminCount == 0) {
                jdbcTemplate.execute("INSERT INTO `user` (userid, password, username, drank) VALUES ('admin', '1', '관리자', 'admin');");
            }

            Integer chanCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM `user` WHERE userid = '33chan'", Integer.class);
            if (chanCount == 0) {
                jdbcTemplate.execute("INSERT INTO `user` (userid, password, username, drank) VALUES ('33chan', '1', '나찬영', 'doctor');");
            }
        };
    }

}
