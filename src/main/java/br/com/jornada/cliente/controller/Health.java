package br.com.jornada.cliente.controller;

import br.com.jornada.cliente.domain.Cliente;
import br.com.jornada.cliente.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Optional;

@RestController
public class Health {

    @GetMapping()
    public String findAll(){
        return "Novo Pipeline - V4";
    }
}
