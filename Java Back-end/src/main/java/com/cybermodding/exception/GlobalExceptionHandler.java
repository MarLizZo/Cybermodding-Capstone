package com.cybermodding.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.cybermodding.responses.CustomResponse;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@SuppressWarnings("null")
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // handle specific exceptions
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<CustomResponse> handleResourceNotFoundException(ResourceNotFoundException exception,
            WebRequest webRequest) {
        CustomResponse errorDetails = new CustomResponse(new Date(), exception.getMessage(), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CustomResponse> handleBlogAPIException(CustomException exception, WebRequest webRequest) {
        CustomResponse errorDetails = new CustomResponse(new Date(), exception.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // global exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomResponse> handleGlobalException(Exception exception, WebRequest webRequest) {
        CustomResponse errorDetails = new CustomResponse(new Date(), exception.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CustomResponse> handleAccessDeniedException(AccessDeniedException exception,
            WebRequest webRequest) {
        CustomResponse errorDetails = new CustomResponse(new Date(), exception.getMessage(), HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }
}
