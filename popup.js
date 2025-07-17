document.addEventListener('DOMContentLoaded', function() {
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file-input');
  const imagePreview = document.getElementById('image-preview');
  const generateBtn = document.getElementById('generate-btn');
  const results = document.getElementById('results');
  const promptOutput = document.getElementById('prompt-output');
  const altPromptOutput = document.getElementById('alt-prompt-output');
  const copyBtn = document.getElementById('copy-btn');
  const copyAltBtn = document.getElementById('copy-alt-btn');
  const loading = document.getElementById('loading');
  
  let currentImage = null;

  // Handle drag and drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropArea.classList.add('highlight');
  }

  function unhighlight() {
    dropArea.classList.remove('highlight');
  }

  dropArea.addEventListener('drop', handleDrop, false);
  dropArea.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', handleFiles);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files } });
  }

  function handleFiles(e) {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      currentImage = file;
      const reader = new FileReader();
      
      reader.onload = function(e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        imagePreview.style.display = 'block';
        generateBtn.disabled = false;
      };
      
      reader.readAsDataURL(file);
    }
  }

  // Generate prompt
  generateBtn.addEventListener('click', async function() {
    if (!currentImage) return;
    
    loading.style.display = 'flex';
    results.style.display = 'none';
    
    try {
      // Here you would call your API (OpenAI Vision or Replicate)
      // This is a mock implementation
      const prompt = await generatePromptFromImage(currentImage);
      const altPrompt = await generateAlternativePrompt(prompt);
      
      promptOutput.textContent = prompt;
      altPromptOutput.textContent = altPrompt;
      
      results.style.display = 'block';
    } catch (error) {
      console.error('Error generating prompt:', error);
      promptOutput.textContent = 'Error generating prompt. Please try again.';
      results.style.display = 'block';
    } finally {
      loading.style.display = 'none';
    }
  });

  // Copy buttons
  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(promptOutput.textContent)
      .then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
      });
  });

  copyAltBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(altPromptOutput.textContent)
      .then(() => {
        const originalText = copyAltBtn.textContent;
        copyAltBtn.textContent = 'Copied!';
        setTimeout(() => copyAltBtn.textContent = originalText, 2000);
      });
  });

  // Mock API functions - replace with actual API calls
  async function generatePromptFromImage(image) {
  // আপনার একটুয়াল API URL দিয়ে প্রতিস্থাপন করুন
  const API_URL = "https://image-prompt-backend.onrender.com/generate-prompt";
  
  const formData = new FormData();
  formData.append('image', image);
  
  try {
    loading.style.display = 'flex'; // লোডিং স্টেট দেখান
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    return data.prompt;
    
  } catch (error) {
    console.error('API Error:', error);
    return `Error: ${error.message}`;
  } finally {
    loading.style.display = 'none'; // লোডিং স্টেট লুকান
  }
}


  async function generateAlternativePrompt(basePrompt) {
  // বিকল্প প্রম্পট জেনারেট করার জন্য আলাদা API এন্ডপয়েন্ট থাকলে
  const ALT_API_URL = "https://image-prompt-backend.onrender.com/generate-alternative";
  
  try {
    const response = await fetch(ALT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: basePrompt })
    });
    
    const data = await response.json();
    return data.alternativePrompt;
    
  } catch (error) {
    console.error('Alternative prompt error:', error);
    return "Could not generate alternative version";
  }
}
});

