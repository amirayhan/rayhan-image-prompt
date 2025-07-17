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
    // In a real implementation, you would:
    // 1. Convert image to base64 or send as file
    // 2. Call your backend or directly to OpenAI/Replicate API
    // 3. Return the generated prompt
    
    // Mock response
    return "A highly detailed digital painting of a futuristic cityscape at sunset, with towering skyscrapers featuring neon lights and holographic advertisements, flying cars zipping between buildings, a cyberpunk aesthetic with a color palette of deep purples, bright pinks, and electric blues, highly detailed textures, 8k resolution, cinematic lighting, concept art style, trending on ArtStation";
  }

  async function generateAlternativePrompt(basePrompt) {
    // In a real implementation, you would:
    // 1. Send the base prompt to an LLM API to rephrase
    // 2. Return the alternative version
    
    // Mock response
    return "Cyberpunk metropolis at dusk: An ultra-detailed 8K render of a futuristic city with glowing neon signs, reflective wet streets, and sleek flying vehicles. The scene features towering megastructures with intricate designs, vibrant purple and teal color grading, atmospheric fog, and dramatic lighting. The style combines hyper-realistic textures with a cinematic sci-fi aesthetic, perfect for concept art or wallpaper.";
  }
});