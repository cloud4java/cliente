package br.com.jornada.cliente;

import org.junit.runner.RunWith;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features", // Path to your feature files
    glue = "br.com.jornada.cliente.steps",   // Package where your step definitions are located
    plugin = {"pretty", "html:target/cucumber-reports.html"}
)
public class CucumberIT { // Renamed class
}
