"""
Email service using Resend for transactional emails.
Handles email verification, purchase confirmations, etc.
"""
import os
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import resend
from resend import ResendError

# Initialize Resend
resend.api_key = os.getenv("RESEND_API_KEY")

class EmailService:
    """Service for sending transactional emails via Resend."""
    
    def __init__(self):
        self.from_email = os.getenv("FROM_EMAIL", "atomicrosetools@gmail.com")
        self.base_url = os.getenv("FRONTEND_URL", "https://atomic-rose-tools.netlify.app")
    
    def send_guest_verification_email(self, email: str, order_number: str, verification_token: str, items: list, total_amount: float) -> bool:
        """
        Send guest verification email for purchase.
        
        Args:
            email: Guest's email address
            order_number: Order number
            verification_token: Verification token
            items: List of purchased items
            total_amount: Total order amount
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Generate OTP code (6 digits)
            otp_code = self._generate_otp()
            
            # Create verification URL
            verify_url = f"{self.base_url}/verify-guest-email?token={verification_token}"
            
            # Load and customize guest verification template
            html_content = self._load_guest_verification_template()
            html_content = self._customize_guest_template(html_content, {
                "ORDER_NUMBER": order_number,
                "EMAIL_ADDRESS": email,
                "VERIFY_URL": verify_url,
                "OTP_CODE": otp_code,
                "EMAIL_DATE": datetime.now().strftime("%B %d, %Y"),
                "EXPIRES_IN_HOURS": "24",
                "YEAR": str(datetime.now().year),
                "HELP_URL": f"{self.base_url}/support",
                "TOTAL_AMOUNT": f"${total_amount:.2f}",
                "ITEMS_COUNT": str(len(items))
            })
            
            # Send email via Resend
            r = resend.Emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": f"Verify Your Email - Order {order_number} - Atomic Rose Tools",
                "html": html_content
            })
            
            print(f"✅ Guest verification email sent to {email}")
            return True
            
        except ResendError as e:
            print(f"❌ Failed to send guest verification email to {email}: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error sending guest verification email to {email}: {e}")
            return False
    
    def _generate_otp(self, length: int = 6) -> str:
        """Generate a numeric OTP code."""
        return ''.join(secrets.choice(string.digits) for _ in range(length))
    
    def _load_guest_verification_template(self) -> str:
        """Load the guest verification HTML template."""
        template_path = os.path.join(os.path.dirname(__file__), "templates", "guest_verification_email.html")
        try:
            with open(template_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            # Fallback to inline template if file not found
            return self._get_guest_fallback_template()
    
    def _customize_guest_template(self, template: str, variables: Dict[str, str]) -> str:
        """Replace guest template variables with actual values."""
        for key, value in variables.items():
            template = template.replace(f"{{{{{key}}}}}", str(value))
        return template
    
    def _get_guest_fallback_template(self) -> str:
        """Fallback guest template if file not found."""
        return """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Verify Your Email</h1>
            <p>Order Number: {{ORDER_NUMBER}}</p>
            <p>Total: {{TOTAL_AMOUNT}}</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="{{VERIFY_URL}}" style="background: #ff2a6d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Verify Email
            </a>
            <p>Or use this code: {{OTP_CODE}}</p>
            <p>This link expires in {{EXPIRES_IN_HOURS}} hours.</p>
        </body>
        </html>
        """

# Create global instance
email_service = EmailService()
