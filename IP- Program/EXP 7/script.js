```javascript
let appointments = JSON.parse(
    localStorage.getItem("appointments") || "[]"
);

const dateInput = document.getElementById("date");
dateInput.min = new Date().toLocaleDateString("en-CA");

function saveAppointments() {
    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );
}

function displayAppointments() {
    const calendar = document.getElementById("calendarList");
    const account = document.getElementById("myAppointments");

    calendar.innerHTML = "";
    account.innerHTML = "";

    if (appointments.length === 0) {
        calendar.innerHTML = "<p>No reservations available.</p>";
        account.innerHTML = "<p>No appointments yet.</p>";
    }

    appointments.forEach((a, index) => {
        const info = `
            <strong>${a.service}</strong><br>
            Stylist: ${a.stylist}<br>
            Date: ${a.date}<br>
            Time: ${a.time}<br>
            Status: ${a.status}
        `;

        calendar.innerHTML += `
            <div class="appointment">${info}</div>
        `;

        account.innerHTML += `
            <div class="appointment">
                ${info}
                ${
                    a.status === "Booked"
                    ? `<button onclick="cancelAppointment(${index})">
                         Cancel Appointment
                       </button>`
                    : ""
                }
            </div>
        `;
    });
}

document.getElementById("bookingForm").addEventListener(
    "submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("customerName").value;
        const phone = document.getElementById("customerPhone").value;
        const service = document.getElementById("service").value;
        const stylist = document.getElementById("stylist").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const payment = document.getElementById("payment").value;

        const chosenDate = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (chosenDate < today) {
            alert("Please select today or a future date.");
            return;
        }

        const busy = appointments.some(a =>
            a.stylist === stylist &&
            a.date === date &&
            a.time === time &&
            a.status === "Booked"
        );

        if (busy) {
            alert("This stylist's time slot is already booked.");
            return;
        }

        const appointment = {
            id: Date.now(),
            name,
            phone,
            service,
            stylist,
            date,
            time,
            payment,
            status: "Booked"
        };

        appointments.push(appointment);
        saveAppointments();
        displayAppointments();

        alert("Appointment booked successfully!");
        this.reset();
    }
);

function cancelAppointment(index) {
    if (confirm("Cancel this appointment?")) {
        appointments[index].status = "Cancelled";
        saveAppointments();
        displayAppointments();
    }
}

function showAppointments() {
    const admin = document.getElementById("adminAppointments");
    admin.innerHTML = "";

    if (appointments.length === 0) {
        admin.innerHTML = "<p>No reservations found.</p>";
        return;
    }

    appointments.forEach(a => {
        admin.innerHTML += `
            <div class="appointment">
                <strong>${a.name}</strong><br>
                Phone: ${a.phone}<br>
                Service: ${a.service}<br>
                Stylist: ${a.stylist}<br>
                Date: ${a.date}<br>
                Time: ${a.time}<br>
                Payment: ${a.payment}<br>
                Status: ${a.status}
            </div>
        `;
    });
}

function cancelAllDemo() {
    if (confirm("Clear all demo reservations?")) {
        appointments = [];
        saveAppointments();
        displayAppointments();
        showAppointments();
    }
}

document.getElementById("feedbackForm").addEventListener(
    "submit", function(event) {
        event.preventDefault();

        const name = this.querySelector("input").value;
        const rating = this.querySelector("select").value;
        const comment = this.querySelector("textarea").value;

        const feedback = document.getElementById("feedbackList");

        feedback.innerHTML += `
            <div class="appointment">
                <strong>${name}</strong> - ${rating}
                <p>${comment.replace(/</g, "&lt;")}</p>
            </div>
        `;

        alert("Thank you for your feedback!");
        this.reset();
    }
);

displayAppointments();
```
