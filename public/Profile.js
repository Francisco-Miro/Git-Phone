class Profile {
    constructor() {
        this.saveProfilePictureButton = document.getElementById('saveProfilePicture');
        this.profilePictureInput = document.getElementById('profilePictureInput');
        this.profilePictureContainer = document.getElementById('profilePictureContainer');
        this.userInfoContainer = document.getElementById('userInfo');

        this.saveProfilePicture = this.saveProfilePicture.bind(this);
        this.displayProfilePicture = this.displayProfilePicture.bind(this);
        this.getProfilePicture = this.getProfilePicture.bind(this);
        this.displayUserInfo = this.displayUserInfo.bind(this);

        if (this.saveProfilePictureButton) {
            this.saveProfilePictureButton.addEventListener('click', () => {
                const profilePictureUrl = this.profilePictureInput.value;
                this.saveProfilePicture(profilePictureUrl);
                this.displayProfilePicture(profilePictureUrl);
            });
        }

        // Cargar la foto de perfil al cargar la página
        document.addEventListener('DOMContentLoaded', this.getProfilePicture);
    }

    saveProfilePicture(profilePictureUrl) {
        fetch('/saveProfilePicture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profilePicture: profilePictureUrl })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Profile picture saved successfully');
            } else {
                console.error('Failed to save profile picture');
            }
        })
        .catch(error => console.error('Error saving profile picture:', error));
    }

    displayProfilePicture(profilePictureUrl) {
        this.profilePictureContainer.innerHTML = `<img src="${profilePictureUrl}" alt="Profile Picture">`;
    }

    getProfilePicture() {
        fetch('/getProfilePicture')
        .then(response => response.json())
        .then(data => {
            if (data.profilePicture) {
                this.displayProfilePicture(data.profilePicture);
                this.displayUserInfo(data.userName);
            } else {
                console.error('Profile picture not found');
            }
        })
        .catch(error => console.error('Error fetching profile picture:', error));
    }

    displayUserInfo(userName) {
        this.userInfoContainer.textContent = `Welcome, ${userName}`;
        this.userInfoContainer.classList.add('user-info-text');
    }
}

new Profile();
