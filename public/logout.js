class Logout {
  constructor() {
    this.logoutForm = document.querySelector('#logout');
    if (this.logoutForm) {
      this.logoutForm.addEventListener('submit', this.doLogOut.bind(this));
    } else {
      console.error('Logout form not found');
    }
  }

  doLogOut(event) {
    event.preventDefault();
    console.log('Logout form submitted');

    fetch('/logout/', { method: 'POST' })
      .then(response => {
        if (response.ok) {
          console.log('Logout successful');
          window.location.href = '/login';
        } else {
          console.error('Log out failed');
        }
      })
      .catch(error => console.error('Error:', error));
  }
}

new Logout();
