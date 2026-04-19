package com.airline.exception;

public class AirlineAlreadyExistsException extends RuntimeException {
	public AirlineAlreadyExistsException(String message) {
        super(message);
    }
}
