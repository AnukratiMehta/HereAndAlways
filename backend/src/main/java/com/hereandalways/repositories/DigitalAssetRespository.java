package com.hereandalways.repositories;

import com.hereandalways.models.DigitalAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface DigitalAssetRepository extends JpaRepository<DigitalAsset, UUID> {
    // Inherits CRUD methods like save(), findById(), delete(), etc.

}