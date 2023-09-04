package com.cybermodding.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cybermodding.entities.SideBlock;
import com.cybermodding.enumerators.ESideBlock;

public interface SideBlockRepo extends JpaRepository<SideBlock, Long> {

    @Query("SELECT b FROM SideBlock b WHERE b.e_block_type = :eType ORDER BY b.order_number")
    List<SideBlock> findByESideBlockType(ESideBlock eType);

    List<SideBlock> findByActive(Boolean value);
}
