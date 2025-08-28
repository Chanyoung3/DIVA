package com.dicomtest.service;

import com.dicomtest.repository.LoginRepository;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final LoginRepository loginRepository;

    public  LoginService(LoginRepository loginRepository) {
        this.loginRepository = loginRepository;
    }

    public boolean checkUser(String username,String password){
        return loginRepository.checkInfo(username, password);
    }
}
