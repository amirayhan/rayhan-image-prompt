require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/generate-prompt', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const base64Image = req.file.buffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Generate a detailed AI image prompt (for Midjourney/DALL-E) describing this image. Include style, colors, composition, lighting in English." 
            },
            { 
              type: "image_url", 
              image_url: `data:image/${req.file.mimetype.split('/')[1]};base64,${base64Image}` 
            }
          ]
        }
      ],
      max_tokens: 500
    });
    
    res.json({ prompt: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));