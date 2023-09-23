package com.cybermodding.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.Section;

public interface SectionRepo extends JpaRepository<Section, Long> {

    @Query("SELECT s FROM Section s WHERE s.active = true ORDER BY s.order_number")
    List<Section> findByActiveOrdered();

    @Query("SELECT s FROM Section s ORDER BY s.order_number")
    List<Section> findByOrdered();
}