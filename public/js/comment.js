document.addEventListener('DOMContentLoaded', async () => {
  const commentButtons = document.querySelectorAll('.commentBtn');
  const toggleCommentButtons = document.querySelectorAll('.toggle-comments-btn');

  // Function to fetch and display comments for a post whenver the page gets refreshed
  const loadComments = async (card) => {
    const postId = card.getAttribute('data-id');
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const comments = await response.json();
        const commentSection = card.querySelector('.comment-section');
        commentSection.innerHTML = ''; // Clear existing comments
        comments.forEach(comment => {
          const commentElement = document.createElement('p');
          commentElement.textContent = comment.content;
          commentSection.appendChild(commentElement);
        });
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Load comments for all posts when the page loads
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => loadComments(card));

  toggleCommentButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.card');
      const commentSection = card.querySelector('.comment-section');
      const isVisible = commentSection.style.display === 'block';
      commentSection.style.display = isVisible ? 'none' : 'block';
      button.textContent = isVisible ? 'Show Comments' : 'Hide Comments';
    });
  // Event listener for adding a new comment
  commentButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();

      const card = event.target.closest('.card');
      const postId = card.getAttribute('data-id');
      const commentInput = card.querySelector('.comment-input');
      const commentContent = commentInput.value.trim();

      if (!commentContent) {
        console.error('Comment content is empty');
        return;
      }

      const newComment = {
        content: commentContent,
        postId: postId
      };

      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newComment)
        });

        if (response.ok) {
          console.log('Comment added successfully');
          await loadComments(card);
          // Clear the input field
          commentInput.value = '';
        } else {
          console.error('Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    });
  });
});

});