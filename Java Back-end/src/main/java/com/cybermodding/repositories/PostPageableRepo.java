package com.cybermodding.repositories;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.cybermodding.entities.Post;

public interface PostPageableRepo extends PagingAndSortingRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN p.sub_section pss WHERE pss.parent_section.id = :parent_id ORDER BY p.publishedDate DESC")
    public Page<Post> getPostsHomeForSectionIdDate(Long parent_id, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.sub_section pss JOIN p.reactions pr WHERE pss.parent_section.id = :parent_id GROUP BY p.id ORDER BY COUNT(pr) DESC")
    public Page<Post> getPostsHomeForSectionIdReact(Long parent_id, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.comments pc WHERE p.sub_section.parent_section.id = :parent_id GROUP BY p.id ORDER BY COUNT(pc) DESC")
    public Page<Post> getPostsHomeForSectionIdComments(Long parent_id, Pageable pageable);

    @Query("SELECT p FROM Post p ORDER BY p.publishedDate DESC")
    public Page<Post> findAllOrderDate(Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.reactions pr GROUP BY p.id ORDER BY COUNT(pr) DESC")
    public Page<Post> findAllOrderReact(Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.comments pc GROUP BY p.id ORDER BY COUNT(pc) DESC")
    public Page<Post> findAllOrderComments(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    public Page<Post> findAllByTitle(String title, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.author pa WHERE LOWER(pa.username) LIKE LOWER(CONCAT('%', :username, '%'))")
    public Page<Post> findAllByAuthorName(String username, Pageable pageable);

    public Page<Post> findAllByPublishedDateBetween(LocalDateTime date1, LocalDateTime date2, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE %:str%")
    public Page<Post> findAllByTitlePart(String str, Pageable pageable);
}
