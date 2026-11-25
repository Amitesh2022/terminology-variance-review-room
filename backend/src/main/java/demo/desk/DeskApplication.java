package demo.desk;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import java.time.LocalDate;
@SpringBootApplication
public class DeskApplication {
 public static void main(String[] args) { SpringApplication.run(DeskApplication.class,args); }
 @Bean CommandLineRunner seed(DeskRepository repo) {
  return args -> { if (repo.all().isEmpty()) {
  repo.insert("1",new DeskRecord.Input("Cooling centre","FR language desk","French","Proposed","Centre de rafraîchissement",LocalDate.now().plusDays(2),"Record the source or usage example supporting the final choice. Nothing is exported to a live translation service.",11));
  repo.insert("2",new DeskRecord.Input("Street works permit","NL language desk","Dutch","Comparing","Vergunning voor wegwerkzaamheden",LocalDate.now().plusDays(6),"Record the source or usage example supporting the final choice. Nothing is exported to a live translation service.",17));
  repo.insert("3",new DeskRecord.Input("Payment reminder","DE language desk","German","Accepted","Zahlungserinnerung",LocalDate.now().plusDays(10),"Record the source or usage example supporting the final choice. Nothing is exported to a live translation service.",4));
  repo.insert("4",new DeskRecord.Input("Appointment confirmation","FR language desk","French","Proposed","Confirmation de rendez-vous",LocalDate.now().plusDays(14),"Record the source or usage example supporting the final choice. Nothing is exported to a live translation service.",21));
  repo.insert("5",new DeskRecord.Input("Waste sorting point","NL language desk","Dutch","Comparing","Sorteerpunt",LocalDate.now().plusDays(18),"Record the source or usage example supporting the final choice. Nothing is exported to a live translation service.",9));
  repo.insert("6",new DeskRecord.Input("Application reference","DE language desk","German","Accepted","Antragsreferenz",LocalDate.now().plusDays(22),"Record the source or usage example supporting the final choice. Nothing is exported to a live translation service.",14));
  }};
 }
}
