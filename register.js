document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  fetch('api/users.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === "User created successfully") {
      alert("Registration successful! Please login.");
      window.location.href = 'login.html';
    } else {
      alert(data.message);
    }
  });
});
