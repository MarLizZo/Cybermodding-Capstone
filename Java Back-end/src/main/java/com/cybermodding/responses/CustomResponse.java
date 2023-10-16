package com.cybermodding.responses;

import java.util.Date;

import org.springframework.http.HttpStatus;

public class CustomResponse {
    private Date timestamp;
    private String message;
    private HttpStatus status;

    public CustomResponse(Date timestamp, String message, HttpStatus status) {
        this.timestamp = timestamp;
        this.message = message;
        this.status = status;
    }

    public CustomResponse(Date timestamp, String message) {
        this.timestamp = timestamp;
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
