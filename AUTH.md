Text-Based Diagram for Authentication Workflow

1. **Production Auth Flow**
    - **Entry Points**
        - User visits the site via:
            - Navbar: Links to Login or Signup page.
            - Redirects from actions like Subscription or Attendance.

    - **Login Flow**
        - On Login Page:
            - "Sign in with Google":
                - If account exists, access granted.
                - If account doesn’t exist, redirects to Signup Page.
            - Email and Password:
                - If valid credentials, access granted.
                - If invalid credentials, error prompts return to Login Page.

    - **Signup Flow**
        - Submit details including name, phone, and country.
            - Success leads to account creation and access.
            - If account exists, error prompts return to Login Page.
        - Navigation:
            - Login and Signup pages allow switching between each other.

    - **Forgot Password**
        - Request OTP by providing email.
        - Reset password using OTP and create a new password.

    - **Shared Account System**
        - Multiple websites share login details.
            - Google Sign-In works seamlessly across sites.
            - Changing password updates it across all sites.

    - **Logout**
        - Manual logout required via `/logout` path.

2. **Developer Auth Flow**
    - For beta testers:
        - Access a dedicated Dev Auth Page.
            - Select user type from a dropdown.
            - Login to a dummy account for testing.
        - Access beta features after login.

Summary:
This workflow combines robust authentication for production users with a streamlined developer testing pathway. It includes account creation, Google integration, password recovery, and manual logout, ensuring compatibility across multiple platforms while supporting seamless transitions for both end-users and developers.
