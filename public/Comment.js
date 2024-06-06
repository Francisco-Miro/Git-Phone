class Comment {
    constructor() {  
      const commentForm = document.querySelector('#comment-form');
      this.doComment = this.doComment.bind(this);
      commentForm.addEventListener('submit', this.doComment);

      const commentSearch = document.querySelector('#search-comments');
      this.viewComment = this.viewComment.bind(this);
      commentSearch.addEventListener('click', this.viewComment);
    }

  doComment(event) {
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

  viewComment(event) {
    event.preventDefault();
    const setmodel = document.querySelector("#search-model").value;

    const commentBody = {
        model: setmodel, 
    };
  const fetchOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentBody)
  };
  return fetch('/viewComment/', fetchOptions);
}
}
// Init app
new Comment();
