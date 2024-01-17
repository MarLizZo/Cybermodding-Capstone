package com.cybermodding.services;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

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

    private FTPClient connectFTP() {
        FTPClient ftpClient = new FTPClient();
        try {
            ftpClient.connect(ftpHost, 21);
            ftpClient.login(ftpUsername, ftpPassword);

            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            ftpClient.enterLocalPassiveMode();
        } catch (Exception ex) {
            return ftpClient;
        }
        return ftpClient;
    }

    public String uploadAvatar(MultipartFile file, String username, Boolean temp) {
        try {
            FTPClient ftpClient = connectFTP();

            if (ftpClient.isConnected()) {
                String tmp = temp ? "tmp/" : "";
                String remoteFilePath = "avatars/" + tmp + LocalDateTime.now().toString() + "-" + username + "-"
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

    public Boolean deleteFile(List<String> paths) {
        Boolean result = true;
        FTPClient ftpClient = null;
        try {
            ftpClient = connectFTP();

            if (ftpClient.isConnected()) {
                for (String path : paths) {
                    String fixedPath = path.replace("https://www.lizcybm.altervista.org/", "");
                    ftpClient.deleteFile(fixedPath);
                }
            }
        } catch (Exception ex) {
            return false;
        } finally {
            if (ftpClient != null && ftpClient.isConnected()) {
                try {
                    ftpClient.logout();
                    ftpClient.disconnect();
                } catch (Exception ex) {
                    return false;
                }
            }
        }
        return result;
    }
}
