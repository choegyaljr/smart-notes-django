document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById('note-input');
    const addButton = document.getElementById('add-button');
    const list = document.getElementById('notes-list');

    if (!input || !addButton || !list) return;

    addButton.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;

        fetch("/add-note/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({ content: text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Request failed");
            }
            return response.json();
        })
        .then(data => {
            addNoteToDOM(text);
            input.value = '';
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });

    function addNoteToDOM(text) {
        const card = document.createElement('article');
        const noteText = document.createElement('p');
        const deleteBtn = document.createElement('button');

        noteText.textContent = text;
        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', () => {
            card.remove();
        });

        card.append(noteText, deleteBtn);
        list.appendChild(card);
    }

    function getCSRFToken() {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
    }

});