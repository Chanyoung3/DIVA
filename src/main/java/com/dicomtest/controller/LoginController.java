package com.dicomtest.controller;

import com.dicomtest.service.LoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {
    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @GetMapping("/session-check")
    public ResponseEntity<Map<String, Object>> sessionCheck(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Long id = (Long) session.getAttribute("id");
        String username = (String) session.getAttribute("username"); // 세션에서 이름 가져오기

        if (id != null) {
            response.put("loggedIn", true);
            response.put("userid", id);
            response.put("username", username); // 클라이언트에 보내기
        } else {
            response.put("loggedIn", false);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session-username")
    public ResponseEntity<Map<String, Object>> getSessionUsername(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Long id = (Long) session.getAttribute("id");
        String username = (String) session.getAttribute("username");

        if (username != null) {
            response.put("loggedIn", true);
            response.put("id", id);
            response.put("username", username);
        } else {
            response.put("loggedIn", false);
            response.put("username", null);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestParam String userid,
            @RequestParam String password,
            HttpSession session){

        Map<String, Object> response = new HashMap<>();

        if (!loginService.checkUser(userid)) {
            // 아이디 자체가 존재하지 않을 때
            response.put("success", false);
            response.put("reason", "not_found");
        } else if (!loginService.checkUser(userid, password)) {// 비밀번호 불일치
            response.put("success", false);
            response.put("reason", "wrong_password");
        } else { // 로그인 성공
            session.setAttribute("id", loginService.getId(userid));
            session.setAttribute("username", loginService.getUsername(userid));
            response.put("success", true);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}
