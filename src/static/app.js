document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Função para carregar e exibir as atividades com participantes
  async function loadActivities() {
    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = '<p>Loading activities...</p>';
    try {
      const res = await fetch('/activities');
      const data = await res.json();
      activitiesList.innerHTML = '';
      Object.entries(data).forEach(([name, info]) => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.innerHTML = `
          <h4>${name}</h4>
          <p>${info.description}</p>
          <p><strong>Schedule:</strong> ${info.schedule}</p>
          <p><strong>Max participants:</strong> ${info.max_participants}</p>
          <p><strong>Participants (${info.participants.length}):</strong></p>
          <ul>
            ${info.participants.map(email => `<li>${email}</li>`).join('')}
          </ul>
        `;
        activitiesList.appendChild(card);
      });

      // Preencher o select do formulário de inscrição
      const activitySelect = document.getElementById('activity');
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
      Object.keys(data).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (err) {
      activitiesList.innerHTML = '<p class="error">Failed to load activities.</p>';
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  loadActivities();
});
