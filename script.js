const form = document.getElementById("registration-form");
const statusMessage = document.getElementById("form-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusMessage.textContent = "Enviando sua inscrição...";
    statusMessage.dataset.state = "";
    submitButton.disabled = true;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/api/inscricoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Não foi possível enviar a inscrição.");
        }

        form.reset();
        statusMessage.dataset.state = "success";
        statusMessage.textContent = result.message;
    } catch (error) {
        statusMessage.dataset.state = "error";
        statusMessage.textContent = error instanceof Error
            ? error.message
            : "Não foi possível enviar a inscrição. Tente novamente.";
    } finally {
        submitButton.disabled = false;
    }
});
