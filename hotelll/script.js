const backendURL = 'http://localhost:3000';

// 🧾 Booking Form Submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const checkin = new Date(form.checkin.value);
    const checkout = new Date(form.checkout.value);

    if (checkout <= checkin) {
        alert('❌ Check-out must be after check-in.');
        return;
    }

    const bookingData = {
        name: form.name.value,
        email: form.email.value,
        roomType: form.roomType.value,
        checkin: form.checkin.value,
        checkout: form.checkout.value
    };

    try {
        const res = await fetch(`${backendURL}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await res.json();
        if (result.success) {
            document.getElementById('confirmationMessage').textContent = result.message;
            document.getElementById('confirmationModal').style.display = 'flex';
            form.reset();
        } else {
            alert('Booking failed. Try again.');
        }
    } catch (err) {
        console.error('Booking error:', err);
        alert('❌ Something went wrong. Is your backend running?');
    }
});

// ✅ Close Confirmation Modal
function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

// 🔍 Check Availability from Booking Form
async function checkAvailability() {
    const form = document.getElementById('bookingForm');
    const roomType = form.roomType.value;
    const checkin = form.checkin.value;
    const checkout = form.checkout.value;
    const result = document.getElementById('availabilityResult');

    if (!roomType || !checkin || !checkout) {
        result.textContent = '❌ Please fill in all fields to check availability.';
        return;
    }

    try {
        const response = await fetch(`${backendURL}/check-availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_type: roomType, check_in: checkin, check_out: checkout })
        });

        const data = await response.json();
        result.textContent = data.available ?
            '✅ Room is available!' :
            '❌ No rooms available for that selection.';
    } catch (error) {
        result.textContent = '❌ Error checking availability.';
        console.error(error);
    }
}

// 🔍 Check Availability from Top Form
document.getElementById('availability-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const resultDiv = document.getElementById('availability-result');

    try {
        const response = await fetch(`${backendURL}/check-availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        resultDiv.textContent = result.available ?
            '✅ Room is available!' :
            '❌ No rooms available for that selection.';
    } catch (error) {
        resultDiv.textContent = '❌ Error checking availability.';
        console.error(error);
    }
});