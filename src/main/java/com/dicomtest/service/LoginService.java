package com.dicomtest.service;

import com.dicomtest.repository.LoginRepository;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final LoginRepository loginRepository;

    public  LoginService(LoginRepository loginRepository) {
        this.loginRepository = loginRepository;
    }

    public boolean checkUser(String userid, String password){
        return loginRepository.checkInfo(userid, password);
    }

    public boolean checkUser(String userid){
        return loginRepository.checkInfo(userid);
    }

    public String getUsername(String userid) {
        return loginRepository.getUsername(userid);
    }

    public Long getId(String userid) {
        return loginRepository.getId(userid);
    }
}
