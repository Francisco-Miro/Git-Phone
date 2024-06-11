class Profile {
    constructor() {  
        const updateButton = document.querySelector('#update-button');
        if (updateButton)
            updateButton.addEventListener('click', this.updateProfileImage);
    }

    updateProfileImage(event) {
        event.preventDefault();
        alert('Image Updated')
        const imageUrl = document.querySelector("#image-url").value;
  
        fetch('/updateProfileImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector("#profile-img").src = imageUrl;
                document.querySelector("#image-url").value = '';
                alert('Profile image updated successfully!');
            } else {
                alert('Failed to update profile image.');
            }
        })
        .catch(error => {
            console.error('Error updating profile image:', error);
        });
    }
}

new Profile();
