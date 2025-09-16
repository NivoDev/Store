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
    
    def send_verification_email(self, email: str, first_name: str, verification_token: str) -> bool:
        """
        Send email verification email to user.
        
        Args:
            email: User's email address
            first_name: User's first name
            verification_token: Unique verification token
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Generate OTP code (6 digits)
            otp_code = self._generate_otp()
            
            # Create verification URL
            verify_url = f"{self.base_url}/verify-email?token={verification_token}"
            
            # Load and customize email template
            html_content = self._load_verification_template()
            html_content = self._customize_template(html_content, {
                "FIRST_NAME": first_name,
                "EMAIL_ADDRESS": email,
                "VERIFY_URL": verify_url,
                "OTP_CODE": otp_code,
                "EMAIL_DATE": datetime.now().strftime("%B %d, %Y"),
                "EXPIRES_IN_MINUTES": "60",
                "YEAR": str(datetime.now().year),
                "HELP_URL": f"{self.base_url}/support"
            })
            
            # Send email via Resend
            r = resend.Emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": "Verify your email - Atomic Rose Tools",
                "html": html_content
            })
            
            print(f"✅ Verification email sent to {email}")
            return True
            
        except ResendError as e:
            print(f"❌ Failed to send verification email to {email}: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error sending verification email to {email}: {e}")
            return False
    
    def send_purchase_confirmation(self, email: str, first_name: str, order_data: Dict[str, Any]) -> bool:
        """
        Send purchase confirmation email.
        
        Args:
            email: User's email address
            first_name: User's first name
            order_data: Order details including products, total, etc.
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Create purchase confirmation HTML
            html_content = self._create_purchase_confirmation_html(first_name, order_data)
            
            # Send email via Resend
            r = resend.Emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": "Purchase Confirmation - Atomic Rose Tools",
                "html": html_content
            })
            
            print(f"✅ Purchase confirmation sent to {email}")
            return True
            
        except ResendError as e:
            print(f"❌ Failed to send purchase confirmation to {email}: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error sending purchase confirmation to {email}: {e}")
            return False
    
    def _generate_otp(self, length: int = 6) -> str:
        """Generate a numeric OTP code."""
        return ''.join(secrets.choice(string.digits) for _ in range(length))
    
    def _load_verification_template(self) -> str:
        """Load the email verification HTML template."""
        template_path = os.path.join(os.path.dirname(__file__), "templates", "verification_email.html")
        try:
            with open(template_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            # Fallback to inline template if file not found
            return self._get_fallback_template()
    
    def _customize_template(self, template: str, variables: Dict[str, str]) -> str:
        """Replace template variables with actual values."""
        for key, value in variables.items():
            template = template.replace(f"{{{{{key}}}}}", str(value))
        return template
    
    def _create_purchase_confirmation_html(self, first_name: str, order_data: Dict[str, Any]) -> str:
        """Create purchase confirmation email HTML."""
        # This would be a separate template, but for now we'll create a simple one
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Purchase Confirmation</h1>
            <p>Hi {first_name},</p>
            <p>Thank you for your purchase! Your order has been confirmed.</p>
            <p>Order Total: ${order_data.get('total', 0)}</p>
            <p>You can download your products from your account page.</p>
            <p>Best regards,<br>Atomic Rose Tools</p>
        </body>
        </html>
        """
    
    def _get_fallback_template(self) -> str:
        """Fallback template if file not found."""
        return """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Verify Your Email</h1>
            <p>Hi {{FIRST_NAME}},</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="{{VERIFY_URL}}" style="background: #ff2a6d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Verify Email
            </a>
            <p>Or use this code: {{OTP_CODE}}</p>
            <p>This link expires in {{EXPIRES_IN_MINUTES}} minutes.</p>
        </body>
        </html>
        """

# Create global instance
email_service = EmailService()
