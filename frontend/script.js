document.getElementById('fetchProperties').addEventListener('click', async () => {
    const propertiesContainer = document.getElementById('propertiesContainer');
    propertiesContainer.innerHTML = '<p class="placeholder">Loading properties...</p>';

    try {
        const response = await fetch('http://localhost:8080/api/properties');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const properties = await response.json();
        propertiesContainer.innerHTML = '';

        if (properties.length === 0) {
            propertiesContainer.innerHTML = '<p class="placeholder">No properties found.</p>';
            return;
        }

        properties.forEach(property => {
            const propertyCard = document.createElement('div');
            propertyCard.classList.add('property-card');
            propertyCard.innerHTML = `
                <h2>${property.name}</h2>
                <p><span>Subject:</span> ${property.subject}</p>
                <p><span>Description:</span> ${property.description}</p>
                <p><span>Is Open:</span> ${property.isOpen ? 'Yes' : 'No'}</p>
                <p><span>Waiting Hours:</span> ${property.waitingHours}</p>
            `;
            propertiesContainer.appendChild(propertyCard);
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        propertiesContainer.innerHTML = '<p class="placeholder">Error loading properties. Please try again later.</p>';
    }
});
