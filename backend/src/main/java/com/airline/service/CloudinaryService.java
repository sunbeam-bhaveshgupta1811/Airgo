package com.airline.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        validateFile(file);

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image",
                        "transformation", "w_400,h_400,c_fill,g_face,q_auto"
                ));

        String url = (String) uploadResult.get("secure_url");
        log.info("Image uploaded to Cloudinary: {}", url);
        return url;
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        try {
            String publicId = extractPublicId(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Image deleted from Cloudinary: {}", publicId);
            }
        } catch (Exception e) {
            log.warn("Failed to delete image from Cloudinary: {}", e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
        }
    }

    private String extractPublicId(String url) {
        try {
            String[] parts = url.split("/upload/");
            if (parts.length > 1) {
                String path = parts[1];
                // Remove version prefix if present (v1234567890/)
                if (path.matches("^v\\d+/.*")) {
                    path = path.substring(path.indexOf('/') + 1);
                }
                // Remove file extension
                int dotIndex = path.lastIndexOf('.');
                if (dotIndex > 0) {
                    path = path.substring(0, dotIndex);
                }
                return path;
            }
        } catch (Exception e) {
            log.warn("Could not extract public ID from URL: {}", url);
        }
        return null;
    }
}
