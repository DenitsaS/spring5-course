package com.techprimers.mongodb.springbootmongodbexample.Service;

import com.techprimers.mongodb.springbootmongodbexample.Documents.Blog;
import com.techprimers.mongodb.springbootmongodbexample.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BlogsService {

    private BlogRepository blogRepository;

    @Autowired
    public BlogsService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public Page<Blog> findAllBlogs(int page, int size) {
        return blogRepository.findAll(new PageRequest(page, size, new Sort(Sort.Direction.DESC, "dateCreated")));
    }

    public void deleteBlog(String id) {
        blogRepository.delete(id);
    }

    public Blog save(Blog blog) {
        return blogRepository.save(blog);
    }
}
