package com.cybermodding.services;

import java.io.InputStream;
import java.time.LocalDateTime;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FTPUploadService {
    @Value("${ftp.host}")
    private String ftpHost;

    @Value("${ftp.username}")
    private String ftpUsername;

    @Value("${ftp.password}")
    private String ftpPassword;

    public String uploadAvatar(MultipartFile file, String username) {
        try {
            FTPClient ftpClient = new FTPClient();
            ftpClient.connect(ftpHost, 21);
            boolean loginSuccess = ftpClient.login(ftpUsername, ftpPassword);

            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            ftpClient.enterLocalPassiveMode();

            if (loginSuccess) {
                String remoteFilePath = "avatars/" + LocalDateTime.now().toString() + "-" + username + "-"
                        + file.getOriginalFilename();
                try (InputStream inputStream = file.getInputStream()) {
                    boolean uploaded = ftpClient.storeFile(remoteFilePath, inputStream);

                    if (uploaded) {
                        return "https://www.lizcybm.altervista.org/" + remoteFilePath;
                    } else {
                        System.out.println("null return");
                        return null;
                    }
                } finally {
                    ftpClient.logout();
                    ftpClient.disconnect();
                }
            } else {
                System.out.println("Connection error");
                return null;
            }

        } catch (Exception ex) {
            return null;
        }
    }
}
