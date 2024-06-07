document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  console.log('adding delete buttons logic')
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const card = event.target.closest('.card');
      const postId = card.getAttribute('data-id');

      try {
        const response = await fetch(`/api/blogs/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          showPopup('Blog post deleted');
          card.remove(); 
          // remove the card from the page
        } else {
          showPopup('Failed to delete blog post');
        }
      } catch (error) {
        console.error('Error:', error);
        showPopup('Error deleting blog post');
      }
    });
  });

  function showPopup(message) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.style.display = 'block';

    setTimeout(() => {
      popup.style.display = 'none';
    }, 5000); 
    // this should hide the poppup after 5 seconds of delay
  };

});