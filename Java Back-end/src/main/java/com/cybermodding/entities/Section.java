package com.cybermodding.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sections")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Section {

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

    @OneToMany(mappedBy = "parent_section", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<SubSection> sub_sections = new ArrayList<>();

    public Section(String title, String description, Boolean _active, Integer _order_number) {
        this.title = title;
        this.description = description;
        this.active = _active;
        this.order_number = _order_number;
    }

    @Override
    public String toString() {
        return "Section [id=" + id + ", title=" + title + ", description=" + description + ", active=" + active
                + ", order_number=" + order_number + "]";
    }
}
