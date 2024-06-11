class Comment {
    constructor() {  
      const commentForm = document.querySelector('#comment-form');
      this.doComment = this.doComment.bind(this);
      if (commentForm)
        commentForm.addEventListener('submit', this.doComment);
    }

  doComment(event) {
      alert("Comment Sent")
        event.preventDefault();
        const setmodel = document.querySelector("#set-model").value;
        const setcomment = document.querySelector("#set-comment").value;

        const commentBody = {
            model: setmodel, 
            comment: setcomment
        };
      const fetchOptions = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(commentBody)
      };
      return fetch('/doComment/', fetchOptions);
  }

}
// Init app
new Comment();
