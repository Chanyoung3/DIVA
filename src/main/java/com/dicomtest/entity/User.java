package com.dicomtest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "`User`")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userid;
    private String password;
    private String username;
    private String drank;

    public User(String userid, String password, String username, String drank) {
        this.userid = userid;
        this.password = password;
        this.username = username;
        this.drank = drank;
    }
}
