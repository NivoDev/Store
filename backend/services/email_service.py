
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
        self.support_email = os.getenv("SUPPORT_EMAIL", "support@atomicrosetools.com")
        print(f"🌐 EmailService initialized with base_url: {self.base_url}")
        print(f"📧 Support email: {self.support_email}")
    
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
                "SUPPORT_EMAIL": self.support_email,
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
            verify_url = f"{self.base_url}/verify-email?token={verification_token}"
            
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
                "HELP_URL": f"{self.base_url}/support",
                "SUPPORT_EMAIL": self.support_email
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
    
    def _load_password_reset_template(self) -> str:
        """Load the password reset HTML template."""
        template_path = os.path.join(os.path.dirname(__file__), "templates", "password_reset_email.html")
        try:
            with open(template_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            # Fallback to inline template if file not found
            return self._get_password_reset_fallback_template()
    
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
    
    def _customize_password_reset_template(self, template: str, variables: Dict[str, str]) -> str:
        """Replace password reset template variables with actual values."""
        for key, value in variables.items():
            template = template.replace(f"{{{{{key}}}}}", str(value))
        return template
    
    def _get_guest_fallback_template(self) -> str:
        """Fallback guest template if file not found."""
        return """
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0b10; color: #f4f6f8; }
                .card { background: #161622; border: 1px solid #26263a; border-radius: 12px; padding: 32px; margin: 20px 0; }
                .otp-code { background: #1a1a2e; border: 2px solid #00ffff; border-radius: 8px; padding: 16px 24px; text-align: center; margin: 20px 0; }
                .otp-text { font: 700 24px/1.2 'Courier New', Courier, monospace; color: #00ffff; letter-spacing: 4px; }
                .btn { background: #ff2a6d; color: #0b0b10; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }
                .muted { color: #9aa0a6; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Verify Your Email</h1>
                <p>Order Number: <strong>{{ORDER_NUMBER}}</strong></p>
                <p>Total: <strong>{{TOTAL_AMOUNT}}</strong></p>
                <p>Please click the link below to verify your email address:</p>
                <a href="{{VERIFY_URL}}" class="btn">Verify Email</a>
                
                <div class="otp-code">
                    <p class="muted">Or copy and paste this verification code:</p>
                    <div class="otp-text">{{OTP_CODE}}</div>
                    <p class="muted">This code expires in {{EXPIRES_IN_HOURS}} hours</p>
                </div>
                
                <p class="muted">If you didn't initiate this purchase, you can ignore this email.</p>
            </div>
        </body>
        </html>
        """
    
    def _get_user_fallback_template(self) -> str:
        """Fallback user template if file not found."""
        return """
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0b10; color: #f4f6f8; }
                .card { background: #161622; border: 1px solid #26263a; border-radius: 12px; padding: 32px; margin: 20px 0; }
                .otp-code { background: #1a1a2e; border: 2px solid #00ffff; border-radius: 8px; padding: 16px 24px; text-align: center; margin: 20px 0; }
                .otp-text { font: 700 24px/1.2 'Courier New', Courier, monospace; color: #00ffff; letter-spacing: 4px; }
                .muted { color: #9aa0a6; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Verify Your Email</h1>
                <p>Hi {{FIRST_NAME}}, thanks for signing up!</p>
                <p>Please verify your email address to complete your registration and access all features.</p>
                
                <div class="otp-code">
                    <p class="muted">Please enter this verification code in the app:</p>
                    <div class="otp-text">{{OTP_CODE}}</div>
                </div>
                
                <p class="muted">If you didn't request this, you can ignore this email.</p>
            </div>
        </body>
        </html>
        """
    
    def _get_password_reset_fallback_template(self) -> str:
        """Fallback password reset template if file not found."""
        return """
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0b10; color: #f4f6f8; }
                .card { background: #161622; border: 1px solid #26263a; border-radius: 12px; padding: 32px; margin: 20px 0; }
                .btn { background: #ff2a6d; color: #0b0b10; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }
                .muted { color: #9aa0a6; }
                .warning { background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.3); border-radius: 8px; padding: 16px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Reset Your Password</h1>
                <p>Hi {{FIRST_NAME}},</p>
                <p>We received a request to reset your password for your Atomic Rose Tools account.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{RESET_URL}}" class="btn">Reset Password</a>
                </div>
                
                <div class="warning">
                    <p><strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.</p>
                </div>
                
                <p class="muted">If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.</p>
                
                <p class="muted">If you have any questions, please contact us at {self.support_email}</p>
            </div>
        </body>
        </html>
        """
    
    def send_password_reset_email(self, email: str, name: str, reset_url: str) -> bool:
        """
        Send password reset email to user.
        
        Args:
            email: User's email address
            name: User's name
            reset_url: Password reset URL
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            print(f"📧 Attempting to send password reset email to {email}")
            print(f"📧 From email: {self.from_email}")
            
            # Load and customize password reset template
            html_content = self._load_password_reset_template()
            html_content = self._customize_password_reset_template(html_content, {
                "FIRST_NAME": name.split()[0] if name else "User",
                "EMAIL_ADDRESS": email,
                "RESET_URL": reset_url,
                "YEAR": str(datetime.now().year),
                "HELP_URL": f"{self.base_url}/support",
                "SUPPORT_EMAIL": self.support_email
            })
            
            r = self.resend_client.emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": "Reset Your Password - Atomic Rose Tools",
                "html": html_content
            })
            
            print(f"📧 Resend response: {r}")
            print(f"✅ Password reset email sent to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send password reset email to {email}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return False

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
            
            # Generate product list HTML with individual download links
            download_links_html = ""
            for link in download_links:
                download_links_html += f"""
                <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin:12px 0;background:rgba(255,255,255,0.05);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
                    <tr>
                        <td style="padding:16px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td width="50" style="vertical-align:top;padding-right:12px;">
                                        <img src="{link.get('cover_image_url', '/images/placeholder-product.jpg')}" 
                                             alt="{link.get('title', 'Product')}" 
                                             width="50" height="50"
                                             style="display:block;width:50px;height:50px;object-fit:cover;border-radius:6px;">
                                    </td>
                                    <td style="vertical-align:top;">
                                        <h4 style="margin:0 0 6px;color:#f8fafc;font:600 16px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                                            {link.get('title', 'Unknown Product')}
                                        </h4>
                                        <p style="margin:0 0 8px;color:#94a3b8;font:500 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                                            by {link.get('artist', 'Unknown Artist')} • ${link.get('price', '0.00')}
                                        </p>
                                        <a href="{link.get('download_url', '#')}" 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           style="display:inline-block;background:#0ea5e9;color:#ffffff;text-decoration:none;font:700 14px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:8px 16px;border-radius:6px;box-shadow:0 2px 8px rgba(14,165,233,0.3);">
                                            Download Now
                                        </a>
                                    </td>
                                    <td width="100" style="vertical-align:middle;text-align:right;color:#10b981;font:500 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                                        ✓ Purchased
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                """
            
            html_content = self._customize_guest_thank_you_template(html_content, {
                "ORDER_NUMBER": order_number,
                "EMAIL_DATE": datetime.now().strftime("%B %d, %Y"),
                "YEAR": str(datetime.now().year),
                "HELP_URL": f"{self.base_url}/support",
                "SUPPORT_EMAIL": self.support_email,
                "DOWNLOAD_PAGE_URL": f"{self.base_url}/guest-downloads?order={order_number}",
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
            <p>If you have any questions, please contact us at {self.support_email}</p>
        </body>
        </html>
        """
    
    def send_user_thank_you_email(self, email: str, name: str, order_number: str, download_links: list, user_id: str = None) -> bool:
        """
        Send thank you email with download links to registered user.
        
        Args:
            email: User's email address
            name: User's name
            order_number: Order number
            download_links: List of download link objects
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            print(f"📧 Sending user thank you email to {email}")
            print(f"📧 From email: {self.from_email}")
            
            # Load and customize thank you template
            html_content = self._load_user_thank_you_template()
            
            # Generate download links HTML
            download_links_html = ""
            for link in download_links:
                download_links_html += f"""
                <div style="margin:12px 0;padding:16px;background:rgba(255,255,255,0.05);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
                    <div style="display:flex;align-items:center;gap:16px;">
                        <img src="{link.get('cover_image_url', '/images/placeholder-product.jpg')}" 
                             alt="{link.get('title', 'Product')}" 
                             style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
                        <div style="flex:1;">
                            <h4 style="margin:0 0 6px;color:#f8fafc;font:600 16px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                                {link.get('title', 'Unknown Product')}
                            </h4>
                            <p style="margin:0;color:#94a3b8;font:500 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                                by {link.get('artist', 'Unknown Artist')} • {link.get('price', '$0.00')}
                            </p>
                        </div>
                        <a href="{link.get('download_url', '#')}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           style="background:#0ea5e9;color:#ffffff;text-decoration:none;font:700 14px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:12px 20px;border-radius:8px;white-space:nowrap;box-shadow:0 2px 8px rgba(14,165,233,0.3);transition:all 0.2s ease;">
                            Download Now
                        </a>
                    </div>
                </div>
                """
            
            # Generate URLs
            profile_url = f"{self.base_url}/profile"
            download_url = f"{self.base_url}/profile"  # Default to profile
            download_button_text = "Download Now"
            
            # If we have download links, use the first one for direct download
            if download_links and len(download_links) > 0:
                first_download = download_links[0]
                if first_download.get('download_url'):
                    download_url = first_download['download_url']
                    # Always use simple "Download" text for the button
                    download_button_text = "Download"
            
            # If we have user_id, create auto-login token for profile
            if user_id:
                try:
                    from simple_api import create_access_token
                    import datetime as dt
                    # Create a short-lived token for auto-login (1 hour)
                    auto_login_token = create_access_token(
                        data={"sub": user_id}, 
                        expires_delta=dt.timedelta(hours=1)
                    )
                    profile_url = f"{self.base_url}/auth/auto-login?token={auto_login_token}&redirect=/profile"
                except Exception as e:
                    print(f"❌ Error creating auto-login token: {e}")
                    # Fallback to regular profile URL
                    profile_url = f"{self.base_url}/profile"
            
            html_content = self._customize_user_thank_you_template(html_content, {
                "FIRST_NAME": name.split()[0] if name else "User",
                "ORDER_NUMBER": order_number,
                "EMAIL_DATE": datetime.now().strftime("%B %d, %Y"),
                "YEAR": str(datetime.now().year),
                "HELP_URL": f"{self.base_url}/support",
                "SUPPORT_EMAIL": self.support_email,
                "PROFILE_URL": profile_url,
                "DOWNLOAD_PAGE_URL": download_url,
                "DOWNLOAD_BUTTON_TEXT": download_button_text,
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
            print(f"✅ User thank you email sent to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send user thank you email to {email}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return False
    
    def _load_user_thank_you_template(self) -> str:
        """Load the user thank you HTML template."""
        template_path = os.path.join(os.path.dirname(__file__), "templates", "user_thank_you_email.html")
        try:
            with open(template_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            # Fallback to inline template if file not found
            return self._get_user_thank_you_fallback_template()
    
    def _customize_user_thank_you_template(self, template: str, variables: Dict[str, str]) -> str:
        """Replace user thank you template variables with actual values."""
        for key, value in variables.items():
            template = template.replace(f"{{{{{key}}}}}", str(value))
        return template
    
    def _get_user_thank_you_fallback_template(self) -> str:
        """Fallback user thank you template if file not found."""
        return """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Thank You for Your Purchase! 🎉</h1>
            <p>Hi {{FIRST_NAME}}! Your order {{ORDER_NUMBER}} has been completed successfully.</p>
            <p>You now have access to 3 downloads per product:</p>
            {{DOWNLOAD_LINKS}}
            <p><strong>Important:</strong> Each download link expires in 1 hour. You can access your products anytime from your profile page.</p>
            <p>If you have any questions, please contact us at {self.support_email}</p>
        </body>
        </html>
        """

    def send_newsletter_welcome_email(self, email: str, name: str) -> bool:
        """
        Send newsletter welcome email with free gift.
        
        Args:
            email: Subscriber's email address
            name: Subscriber's name
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            print(f"📧 Sending newsletter welcome email to {email}")
            
            # Load and customize newsletter welcome template
            html_content = self._load_newsletter_welcome_template()
            html_content = self._customize_newsletter_template(html_content, {
                "USER_NAME": name,
                "EMAIL_DATE": datetime.now().strftime("%B %d, %Y"),
                "YEAR": datetime.now().year,
                "HELP_URL": f"{self.base_url}/support",
                "GIFT_DOWNLOAD_URL": f"{self.base_url}/download-newsletter-gift?email={email}",
                "COUPON_CODE": "ATOMIC-ROSE",
                "DISCOUNT_PERCENT": "10",
                "MAX_DISCOUNT": "$50",
                "COUPON_LINK": f"{self.base_url}/?coupon=ATOMIC-ROSE"
            })
            
            # Send email
            response = resend.Emails.send({
                "from": self.from_email,
                "to": [email],
                "subject": "🎁 Welcome to Our Newsletter - Your Free Gift Awaits!",
                "html": html_content
            })
            
            print(f"✅ Newsletter welcome email sent successfully to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending newsletter welcome email to {email}: {e}")
            return False

    def _load_newsletter_welcome_template(self) -> str:
        """Load the newsletter welcome email template."""
        try:
            template_path = os.path.join(os.path.dirname(__file__), "templates", "newsletter_welcome_email.html")
            with open(template_path, "r", encoding="utf-8") as file:
                return file.read()
        except Exception as e:
            print(f"❌ Error loading newsletter welcome template: {e}")
            return self._get_fallback_newsletter_template()

    def _customize_newsletter_template(self, html_content: str, replacements: Dict[str, str]) -> str:
        """Customize the newsletter welcome template with dynamic content."""
        try:
            for placeholder, value in replacements.items():
                html_content = html_content.replace(f"{{{{{placeholder}}}}}", str(value))
            return html_content
        except Exception as e:
            print(f"❌ Error customizing newsletter template: {e}")
            return html_content

    def _get_fallback_newsletter_template(self) -> str:
        """Fallback newsletter template if file loading fails."""
        return """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0b10; color: #f8fafc;">
            <h1 style="color: #f8fafc;">Welcome to Our Newsletter! 🎉</h1>
            <p>Hi {{USER_NAME}}! Thank you for your interest in our products.</p>
            <p>This is the first newsletter from us, and we have a special <strong>FREE GIFT</strong> for you!</p>
            <div style="background: rgba(14,165,233,0.1); border: 1px solid rgba(14,165,233,0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #f8fafc;">🎁 Your Free Newsletter Gift</h3>
                <p>A special collection of high-quality samples crafted exclusively for our newsletter subscribers.</p>
                <a href="{{GIFT_DOWNLOAD_URL}}" style="display: inline-block; background: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Download Your Free Gift</a>
            </div>
            <p>If you have any questions, please contact us at {self.support_email}</p>
        </body>
        </html>
        """

# Create global instance
email_service = EmailService()
