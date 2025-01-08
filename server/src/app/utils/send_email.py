import yagmail
from os import environ as env
from dotenv import load_dotenv

load_dotenv()

def send_email(
    to_email: str | list[str],
    cc: str | list[str] | None = None,
    bcc: str | list[str] | None = None,
    subject: str | None = None,
    body: str | None = None,
    html_content: str | None = None,
    attachments: list[str] | None = None,
):
    """
    Send an email using yagmail. For more information visit https://github.com/kootenpv/yagmail

    ### Args:
        ``to_email (str or list):`` Recipient email address(es)
        ``cc (str or list, optional):`` CC recipient(s)
        ``bcc (str or list, optional):`` BCC recipient(s)
        ``subject (str, optional):`` Email subject
        ``body (str, optional):`` Plain text body of the email
        ``html_content (str, optional):`` HTML content of the email
        ``attachments (list, optional):`` List of file paths to attach
    """
    email = env.get('EMAIL_ADDRESS')
    oauth2_file = env.get('OAUTH2_FILE_PATH')

    if not email or not oauth2_file:
        raise ValueError("Email or OAuth2 file path not set in environment variables")

    try:
        with yagmail.SMTP(email, oauth2_file=oauth2_file) as yag:
            contents = [body] + ([html_content] if html_content else []) + (attachments or [])
            yag.send(to=to_email, cc=cc, bcc=bcc, subject=subject, contents=contents)
        print(f"Email sent successfully to {to_email}")

    except Exception as e:
        print(f"Error sending email: {str(e)}")
