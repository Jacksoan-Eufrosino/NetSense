function isAuthenticated() {
    if (!getToken()) {
      window.location.href = '/error.html';
      return false;
    } else {
      return true;
    }
  }
  
  function getToken() {
    return localStorage.getItem('@netsense:token');
  }
  
  function signin(token) {
    localStorage.setItem('@netsense:token', token);
    window.location.href = '/dashboard.html';
  }
  
  function signout() {
    localStorage.removeItem('@netsense:token');
    document.cookie = 'token=; Max-Age=0; path=/;';
    document.cookie = 'netsense_token=; Max-Age=0; path=/;';
    window.location.href = '/index.html';
  }
  
  export default { isAuthenticated, getToken, signin, signout };