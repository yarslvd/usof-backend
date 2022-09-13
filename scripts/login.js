const form = document.querySelector('form');
const alert = document.querySelector('.alert_text');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll('input');

    let obj = {
        login: inputs[0].value,
        password: inputs[1].value
    }

    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });

    if(!res.ok) return console.error(res);
    
    if(res.redirected) {
        document.location = res.url;
    }
    else {
        let err = await res.json();
        console.log(err);
        alert.style.display = 'block';
        alert.textContent = err.message;
    }

    // remove alert
    alert.style.display = 'none';
})