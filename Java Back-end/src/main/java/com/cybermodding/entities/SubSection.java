package com.cybermodding.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sub_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private Integer order_number;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private Section parent_section;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "sub_section", cascade = CascadeType.ALL)
    private List<Post> posts;

    @Override
    public String toString() {
        return "SubSection [id=" + id + ", title=" + title + ", description=" + description + ", active=" + active
                + ", order_number=" + order_number + "]";
    }
}
