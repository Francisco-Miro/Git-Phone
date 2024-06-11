class ViewComment {
  constructor() {  
      const commentSearch = document.querySelector('#Send');
      this.viewComment = this.viewComment.bind(this);
      if (commentSearch)
          commentSearch.addEventListener('click', this.viewComment);
  }

  viewComment(event) {
      event.preventDefault();

      const setmodel = document.querySelector("#search-model").value;

      return fetch('/viewComment/' + setmodel)
          .then(response => response.json())
          .then(json => {
              const comments = document.querySelector("#comments");
              comments.innerHTML = ''; // Limpia los comentarios anteriores
              if (json.length > 0) {
                  json.forEach(comment => {
                      const commentElement = document.createElement('div');
                      commentElement.classList.add('comment');
                      commentElement.innerHTML = 
                          `User:${comment.user}
                          Comment:${comment.comment}`;
                      comments.appendChild(commentElement);
                  });
              } else {
                  comments.innerHTML = '<p>No comments found for this model.</p>';
              }
          })
          .catch(error => {
              console.error('Error fetching comments:', error);
          });
  }
}

new ViewComment();
