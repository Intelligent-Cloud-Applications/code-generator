# Code Generator

## Dev Notes
- To redirect users to a link after login set session storage to that link before navigating to login:
```javascript
window.sessionStorage.setItem('login_redirect', '/dashboard');
navigate('/login');
```

## Deployment Notes
- Change domains in .env before deploying.