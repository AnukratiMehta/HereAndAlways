package com.hereandalways.repositories;

import com.hereandalways.models.DigitalAsset;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DigitalAssetRepository extends JpaRepository<DigitalAsset, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
