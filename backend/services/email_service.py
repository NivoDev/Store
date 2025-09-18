
import os
import secrets
import string
from datetime import datetime
from typing import Dict
import resend

# Initialize Resend
resend.api_key = os.getenv("RESEND_API_KEY")

class EmailService:
    """Service for sending transactional emails via Resend."""
    
    def __init__(self):
        self.from_email = os.getenv("FROM_EMAIL", "artools@guerrillatrance.com")
        self.base_url = os.getenv("FRONTEND_URL", "https://atomic-rose-tools.netlify.app")
    
    def send_guest_verification_email(self, email: str, order_number: str, verification_token: str, otp_code: str, items: list, total_amount: float) -> bool:
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
            print(f"📧 Attempting to send email to {email}")
            print(f"📧 From email: {self.from_email}")
            
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
            
            print(f"📧 HTML content length: {len(html_content)}")
            
            # Send email via Resend
            r = resend.Emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": f"Verify Your Email - Order {order_number} - Atomic Rose Tools",
                "html": html_content
            })
            
            print(f"📧 Resend response: {r}")
            print(f"✅ Guest verification email sent to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send guest verification email to {email}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return False
    
    def send_user_verification_email(self, email: str, name: str, verification_token: str, otp_code: str) -> bool:
        """
        Send user verification email for account registration.
        
        Args:
            email: User's email address
            name: User's name
            verification_token: Verification token
            otp_code: 6-digit OTP code
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            print(f"📧 Attempting to send user verification email to {email}")
            print(f"📧 From email: {self.from_email}")
            
            # Create verification URL
            verify_url = f"{self.base_url}/verify-user-email?token={verification_token}"
            
            # Load and customize user verification template
            html_content = self._load_user_verification_template()
            html_content = self._customize_user_template(html_content, {
                "FIRST_NAME": name.split()[0] if name else "User",
                "EMAIL_ADDRESS": email,
                "VERIFY_URL": verify_url,
                "OTP_CODE": otp_code,
                "EMAIL_DATE": datetime.now().strftime("%B %d, %Y"),
                "EXPIRES_IN_MINUTES": "1440",  # 24 hours in minutes
                "YEAR": str(datetime.now().year),
                "HELP_URL": f"{self.base_url}/support"
            })
            
            print(f"📧 HTML content length: {len(html_content)}")
            
            # Send email via Resend
            r = resend.Emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": f"Verify Your Email - Welcome to Atomic Rose Tools",
                "html": html_content
            })
            
            print(f"📧 Resend response: {r}")
            print(f"✅ User verification email sent to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send user verification email to {email}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
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
    
    def _load_user_verification_template(self) -> str:
        """Load the user verification HTML template."""
        template_path = os.path.join(os.path.dirname(__file__), "templates", "user_verification_email.html")
        try:
            with open(template_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            # Fallback to inline template if file not found
            return self._get_user_fallback_template()
    
    def _customize_guest_template(self, template: str, variables: Dict[str, str]) -> str:
        """Replace guest template variables with actual values."""
        for key, value in variables.items():
            template = template.replace(f"{{{{{key}}}}}", str(value))
        return template
    
    def _customize_user_template(self, template: str, variables: Dict[str, str]) -> str:
        """Replace user template variables with actual values."""
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
    
    def _get_user_fallback_template(self) -> str:
        """Fallback user template if file not found."""
        return """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Welcome to Atomic Rose Tools!</h1>
            <p>Hi {{FIRST_NAME}}, thanks for signing up.</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="{{VERIFY_URL}}" style="background: #ff2a6d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Verify Email
            </a>
            <p>Or use this code: {{OTP_CODE}}</p>
            <p>This link expires in {{EXPIRES_IN_MINUTES}} minutes.</p>
            <p>If you didn't request this, you can ignore this email.</p>
        </body>
        </html>
        """
    
    def send_guest_thank_you_email(self, email: str, order_number: str, download_links: list) -> bool:
        """
        Send thank you email with download links to guest user.
        
        Args:
            email: Guest's email address
            order_number: Order number
            download_links: List of download link objects
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            print(f"📧 Sending thank you email to {email}")
            print(f"📧 From email: {self.from_email}")
            
            # Load and customize thank you template
            html_content = self._load_guest_thank_you_template()
            
            # Generate download links HTML
            download_links_html = ""
            for link in download_links:
                download_links_html += f"""
                <div style="margin:12px 0;padding:12px;background:rgba(255,255,255,0.05);border-radius:6px;border:1px solid rgba(255,255,255,0.1);">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <img src="{link.get('cover_image_url', '/images/placeholder-product.jpg')}" 
                             alt="{link.get('title', 'Product')}" 
                             style="width:40px;height:40px;object-fit:cover;border-radius:4px;">
                        <div style="flex:1;">
                            <h4 style="margin:0 0 4px;color:var(--brand-text);font:600 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                                {link.get('title', 'Unknown Product')}
                            </h4>
                            <p style="margin:0;color:var(--muted);font:500 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                                by {link.get('artist', 'Unknown Artist')} • {link.get('price', '$0.00')}
                            </p>
                        </div>
                        <a href="{link.get('download_url', '#')}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           style="background:var(--brand-accent);color:var(--btn-text);text-decoration:none;font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:8px 16px;border-radius:6px;white-space:nowrap;">
                            Download
                        </a>
                    </div>
                </div>
                """
            
            html_content = self._customize_guest_thank_you_template(html_content, {
                "ORDER_NUMBER": order_number,
                "EMAIL_DATE": datetime.now().strftime("%B %d, %Y"),
                "YEAR": str(datetime.now().year),
                "HELP_URL": f"{self.base_url}/support",
                "DOWNLOAD_PAGE_URL": f"{self.base_url}/guest-downloads",
                "DOWNLOAD_LINKS": download_links_html
            })
            
            print(f"📧 HTML content length: {len(html_content)}")
            
            # Send email via Resend
            r = resend.Emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": f"Thank You for Your Purchase - {order_number} - Atomic Rose Tools",
                "html": html_content
            })
            
            print(f"📧 Resend response: {r}")
            print(f"✅ Guest thank you email sent to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send guest thank you email to {email}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return False
    
    def _load_guest_thank_you_template(self) -> str:
        """Load the guest thank you HTML template."""
        template_path = os.path.join(os.path.dirname(__file__), "templates", "guest_thank_you_email.html")
        try:
            with open(template_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            # Fallback to inline template if file not found
            return self._get_guest_thank_you_fallback_template()
    
    def _customize_guest_thank_you_template(self, template: str, variables: Dict[str, str]) -> str:
        """Replace guest thank you template variables with actual values."""
        for key, value in variables.items():
            template = template.replace(f"{{{{{key}}}}}", str(value))
        return template
    
    def _get_guest_thank_you_fallback_template(self) -> str:
        """Fallback guest thank you template if file not found."""
        return """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Thank You for Your Purchase! 🎉</h1>
            <p>Your order {{ORDER_NUMBER}} has been completed successfully.</p>
            <p>Here are your download links:</p>
            {{DOWNLOAD_LINKS}}
            <p><strong>Important:</strong> Each download link can only be used once and expires in 24 hours.</p>
            <p>If you have any questions, please contact us at support@atomicrosetools.com</p>
        </body>
        </html>
        """

# Create global instance
email_service = EmailService()
