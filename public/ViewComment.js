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
                comments.innerHTML = ''; // Clear previous comments
                if (json.length > 0) {
                    json.forEach(comment => {
                        const commentCard = document.createElement('div');
                        commentCard.classList.add('comment-card');
                        commentCard.innerHTML = `
                            <div class="comment-card-header">
                                <span class="comment-user">User: ${comment.user}</span>
                            </div>
                            <div class="comment-card-body">
                                <p class="comment-text">${comment.comment}</p>
                            </div>
                        `;
                        comments.appendChild(commentCard);
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
