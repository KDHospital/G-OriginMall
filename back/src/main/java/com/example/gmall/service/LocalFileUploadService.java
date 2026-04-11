package com.example.gmall.service;

import org.springframework.web.multipart.MultipartFile;

public interface LocalFileUploadService {

	String uploadBannerImage(MultipartFile file);
	
}
