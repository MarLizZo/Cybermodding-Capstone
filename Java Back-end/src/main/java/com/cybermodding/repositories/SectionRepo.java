package com.cybermodding.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.Section;
import com.cybermodding.enumerators.ESectionCategory;

public interface SectionRepo extends JpaRepository<Section, Long> {
    List<Section> findByCategory(ESectionCategory category);

    @Query("SELECT s FROM Section s WHERE s.category = :cat AND s.active = true ORDER BY s.order_number")
    List<Section> findByCategoryOrderedActive(ESectionCategory cat);

    @Query("SELECT s FROM Section s WHERE s.active = true ORDER BY s.order_number")
    List<Section> findByActiveOrdered();
}