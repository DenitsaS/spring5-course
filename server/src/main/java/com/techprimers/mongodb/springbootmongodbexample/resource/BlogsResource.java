package com.techprimers.mongodb.springbootmongodbexample.resource;

import com.techprimers.mongodb.springbootmongodbexample.Documents.Blog;
import com.techprimers.mongodb.springbootmongodbexample.Service.BlogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blog")
public class BlogsResource {

    private BlogsService blogsService;

    @Autowired
    public BlogsResource(BlogsService blogsService) {
        this.blogsService = blogsService;
    }

    @GetMapping("/all")
    public Page<Blog> findAllBlogs(@RequestParam int page, @RequestParam int size) {
        return blogsService.findAllBlogs(page, size);
    }

    @RequestMapping(
            value = "/add",
            produces = {"application/json"},
            consumes = {"application/json"},
            method = RequestMethod.POST)
    public Blog add(@RequestBody Blog blog) {
        return blogsService.save((blog));
    }

    @RequestMapping(
            value = "/{id}",
            method = RequestMethod.DELETE
    )
    public void deleteBlog(@PathVariable(name = "id") String id) {
        blogsService.deleteBlog(id);
    }
}
