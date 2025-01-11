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

    - **Production Auth Flowchart**
      Below is a Mermaid.js flowchart that represents the Production Auth Flow:
      ```mermaid
      graph TD
      A[User Visits Site] --> B[Navbar]
      B -->|Go to Login Page| C[Login Page]
      B -->|Go to Signup Page| D[Signup Page]
      A -->|Redirect for Subscription or Attendance| C
 
      C -->|Sign in with Google| E[Google Auth]
      C -->|Email & Password| F[Validate Credentials]
      F -->|Success| G[Access Account]
      F -->|Failure| H[Signup Required Error]
      E -->|Account Exists| G
      E -->|Account Doesn't Exist| D
 
      D -->|Submit Details| I[Create Account]
      I -->|Success| G
      I -->|Error: Account Exists| H
 
      G -->|Logout| J[Manual Logout via /logout Path]
      F -->|Forgot Password| K[Reset Password Flow]
      K -->|Provide OTP & New Password| G
      ```

2. **Developer Auth Flow**
    - For beta testers:
        - Access a dedicated Dev Auth Page.
            - Select user type from a dropdown.
            - Login to a dummy account for testing.
        - Access beta features after login.

    - **Developer Auth Flowchart**
      Below is a Mermaid.js flowchart that represents the Developer Auth Flow:
      ```mermaid
      graph TD
      X[Dev Visits Beta Site] --> Y[Dev Auth Page]
      Y -->|Select User Type| Z[Login to Dummy Account]
      Z --> AA[Access Beta Features]
      ```

Summary:
This workflow combines robust authentication for production users with a streamlined developer testing pathway. It includes account creation, Google integration, password recovery, and manual logout, ensuring compatibility across multiple platforms while supporting seamless transitions for both end-users and developers.
