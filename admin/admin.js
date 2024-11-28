async function fetchData(url, elementId) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = ''; // Clear existing items
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block'; // Show loading indicator

    try {
        const response = await fetch(url);
        console.log(`Fetching data from ${url}, response status: ${response.status}`); // Debug log
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Debug log to check what data is received

        if (data.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No items found'; // Message for empty data
            listElement.appendChild(li);
            return;
        }

        data.forEach(item => {
            const li = document.createElement('li');
            // Customize the display as needed, for example:
            li.textContent = `ID: ${item.id}, Username: ${item.username || 'N/A'}`; // Adjust according to your data structure
            listElement.appendChild(li);
        });
    } catch (error) {
        const li = document.createElement('li');
        li.textContent = `Error fetching data: ${error.message}`;
        listElement.appendChild(li);
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
}
