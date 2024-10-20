let originalText = ''; // Store the original text

document.getElementById('toggle').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: applyBionicText,
        args: [originalText] // Pass originalText as an argument
      });
  });
});

function applyBionicText(originalText) { // Accept originalText as a parameter
    try {
        // Check if the original text is already stored
        if (originalText === '') {
            // Get the text content of all paragraph tags
            const paragraphs = document.querySelectorAll('p');
            originalText = Array.from(paragraphs).map(p => p.innerText).join('\n'); // Store original text
            const modifiedParagraphs = Array.from(paragraphs).map(p => {
                const words = p.innerText.split(' ');

                // Create a new array to hold the modified words
                const modifiedWords = words.map((word) => {
                    // Make 50% of each word bold
                    const halfIndex = Math.floor(word.length / 2);
                    return `<b>${word.substring(0, halfIndex)}</b>${word.substring(halfIndex)}`;
                });
                // Join the modified words back into a string
                return modifiedWords.join(' ');
            });

            // Update each paragraph with modified text
            paragraphs.forEach((p, index) => {
                p.innerHTML = modifiedParagraphs[index];
            });
        } else {
            // Revert to the original text
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach((p) => {
                p.innerHTML = originalText.split('\n')[Array.from(paragraphs).indexOf(p)];
            });
            originalText = ''; // Clear the stored original text
        }
    } catch (error) {
        console.error('Error applying bionic text:', error);
    }
}
