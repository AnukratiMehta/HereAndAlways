package com.hereandalways.repositories;

import com.hereandalways.models.LegacyOwnerTrustee;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LegacyOwnerTrusteeRepository extends JpaRepository<LegacyOwnerTrustee, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
