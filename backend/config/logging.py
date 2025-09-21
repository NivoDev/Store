"""
Secure logging configuration to prevent information disclosure
"""
import logging
import os
from typing import Any, Dict

class SecurityAwareLogger:
    """Logger that sanitizes sensitive information"""
    
    SENSITIVE_FIELDS = [
        'password', 'token', 'access_token', 'refresh_token', 
        'email', 'phone', 'credit_card', 'ssn', 'api_key',
        'billing_address', 'street_address', 'city', 'state_province',
        'postal_code', 'country', 'company_name', 'vat_number'
    ]
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.is_production = os.getenv('ENVIRONMENT') == 'production'
        
        # Configure logging level
        if self.is_production:
            self.logger.setLevel(logging.ERROR)
        else:
            self.logger.setLevel(logging.INFO)
    
    def sanitize_data(self, data: Any) -> Any:
        """Remove sensitive data from logging output"""
        if isinstance(data, dict):
            sanitized = {}
            for key, value in data.items():
                if any(sensitive in key.lower() for sensitive in self.SENSITIVE_FIELDS):
                    sanitized[key] = '[REDACTED]'
                else:
                    sanitized[key] = self.sanitize_data(value)
            return sanitized
        elif isinstance(data, list):
            return [self.sanitize_data(item) for item in data]
        return data
    
    def info(self, message: str, data: Dict = None):
        """Log info message with sanitized data"""
        if data:
            data = self.sanitize_data(data)
            self.logger.info(f"{message} - Data: {data}")
        else:
            self.logger.info(message)
    
    def error(self, message: str, data: Dict = None):
        """Log error message with sanitized data"""
        if data:
            data = self.sanitize_data(data)
            self.logger.error(f"{message} - Data: {data}")
        else:
            self.logger.error(message)
    
    def warning(self, message: str, data: Dict = None):
        """Log warning message with sanitized data"""
        if data:
            data = self.sanitize_data(data)
            self.logger.warning(f"{message} - Data: {data}")
        else:
            self.logger.warning(message)

# Create global logger instance
secure_logger = SecurityAwareLogger(__name__)
