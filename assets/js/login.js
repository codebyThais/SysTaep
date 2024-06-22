document.getElementById('username').addEventListener('input', function() {
    var input = this;
    var sanitizedValue = input.value.toUpperCase();
    var maxLength = parseInt(input.getAttribute('maxlength'));

    sanitizedValue = sanitizedValue.replace(/[^A-Z0-9\s]/g, '');
  
    sanitizedValue = sanitizedValue.replace(/\s+/g, ' ');

    input.value = sanitizedValue.slice(0, maxLength);
});  

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.innerHTML = '<i class="bi bi-eye-fill"></i>';
    } else {
        passwordInput.type = 'password';
        togglePassword.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
    }
}

// Index
document.getElementById('backIxButton').addEventListener('click', function() {
    window.location.href = '/index.html';
});