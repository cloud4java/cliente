package br.com.jornada.cliente.steps;

import io.restassured.response.Response;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;

@Component
@Scope(value = "cucumber-glue", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TestContext {
    private Response response;
    private Exception latestException;

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public Exception getLatestException() {
        return latestException;
    }

    public void setLatestException(Exception exception) {
        this.latestException = exception;
    }

    public void reset() {
        response = null;
        latestException = null;
    }
}
