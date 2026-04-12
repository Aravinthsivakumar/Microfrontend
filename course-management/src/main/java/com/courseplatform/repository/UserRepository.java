// UserRepository.java
package com.courseplatform.repository;
import com.courseplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRoles_Name(com.courseplatform.entity.Role.ERole role);
}