document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });

        let responseData = {};
        try {
            responseData = await response.json(); // Attempt to parse JSON
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }

        if (response.ok) {
            alert('Thank you for contacting us! Your message has been successfully sent.');
            window.location.href = '/thank-you.html';
        } else {
            throw new Error(responseData.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`There was an error sending your message: ${error.message}. Please try again later.`);
    }
}); 

// Add event listener to team member images
document.querySelectorAll('.team-img').forEach((img) => {
    img.addEventListener('mouseover', () => {
      img.style.transform = 'scale(1.1)';
    });
    img.addEventListener('mouseout', () => {
      img.style.transform = 'scale(1)';
    });
  });
