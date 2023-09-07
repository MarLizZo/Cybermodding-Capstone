package com.cybermodding.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.SubSection;

public interface SubSectionRepo extends JpaRepository<SubSection, Long> {
    // @Query("SELECT s FROM SubSection s JOIN s.parent_section ps WHERE ps.id =
    // :parent_id AND s.active = true ORDER BY s.order_number")
    @Query("SELECT s FROM SubSection s WHERE s.parent_section.id = :parent_id AND s.active = true ORDER BY s.order_number")
    List<SubSection> findByActiveOrderedForSectionId(Long parent_id);

    @Query("SELECT s FROM SubSection s ORDER BY RANDOM() LIMIT 1")
    SubSection getRandom();
}
