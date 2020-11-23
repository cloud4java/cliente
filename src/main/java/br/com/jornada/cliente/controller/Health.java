package br.com.jornada.cliente.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Health {

    @GetMapping()
    public String findAll(){
        return "Serviço de cliente-V10";
    }
}
