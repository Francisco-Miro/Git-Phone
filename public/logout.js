class Logout {
  constructor() {
    const logoutForm = document.querySelector('#logout');
    logoutForm.addEventListener('submit', this.doLogOut);
    }
  doLogOut(event){
    event.preventDefault();
    document.getElementById('logout').addEventListener('click', function() {
      fetch('/logout/', { method: 'POST' })
          .then(response => {
              if (response.ok) {
                  window.location.href = '/login';
              } else {
                  console.error('Log out failed');
              }
          })
          .catch(error => console.error('Error:', error));
  });
  }
}

new Logout();