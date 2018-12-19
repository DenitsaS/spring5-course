package com.techprimers.mongodb.springbootmongodbexample.config;

import com.techprimers.mongodb.springbootmongodbexample.Documents.Blog;
import com.techprimers.mongodb.springbootmongodbexample.repository.BlogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackageClasses = BlogRepository.class)
@Configuration
public class MongoDBConfig {


//    @Bean
//    CommandLineRunner commandLineRunner(BlogRepository blogRepository) {
//        return strings -> {
//
//        };
//    }

}
