# Sentence Learning Feature

## Overview
The Sentence Learning feature is an interactive educational tool that helps children practice writing sentences by:
1. Generating kid-friendly images using DALL-E API
2. Allowing children to write sentences about the images
3. Evaluating the sentences using Gemini API for grammar, spelling, and relevance
4. Providing encouraging feedback and corrections

## Features
- **Random Image Generation**: Creates colorful, cartoon-style images of kid-friendly topics (fruits, animals, birds, etc.)
- **Interactive Sentence Writing**: Children can type sentences in a user-friendly interface
- **AI-Powered Evaluation**: Uses Gemini API to check grammar, spelling, and relevance to the image
- **Encouraging Feedback**: Provides age-appropriate, supportive feedback
- **Sentence Correction**: Offers corrected versions when errors are found
- **Multiple Attempts**: Children can try multiple images and sentences

## API Endpoints

### 1. Generate Image
- **URL**: `POST /api/sentence-learning/generate-image`
- **Purpose**: Generates a new kid-friendly image
- **Request Body**:
```json
{
  "childId": "uuid",
  "childName": "string",
  "childAge": "number",
  "childGender": "string",
  "sentence": "",
  "imageDescription": ""
}
```
- **Response**:
```json
{
  "imageUrl": "base64-encoded-image",
  "feedback": null,
  "isCorrect": false,
  "correctedSentence": null,
  "imageDescription": "string"
}
```

### 2. Evaluate Sentence
- **URL**: `POST /api/sentence-learning/evaluate`
- **Purpose**: Evaluates a sentence written about a specific image
- **Request Body**:
```json
{
  "childId": "uuid",
  "childName": "string",
  "childAge": "number",
  "childGender": "string",
  "sentence": "string",
  "imageDescription": "string"
}
```
- **Response**:
```json
{
  "imageUrl": null,
  "feedback": "string",
  "isCorrect": "boolean",
  "correctedSentence": "string|null",
  "imageDescription": "string"
}
```

## Data Flow

1. **User clicks "Generate New Image"**
   - Frontend calls `/api/sentence-learning/generate-image`
   - Backend generates random kid-friendly topic
   - DALL-E API creates cartoon-style image
   - Image is converted to base64 and returned
   - Frontend displays image with description

2. **User writes sentence and submits**
   - Frontend calls `/api/sentence-learning/evaluate`
   - Backend sends sentence and image description to Gemini API
   - Gemini evaluates grammar, spelling, and relevance
   - Backend parses JSON response and returns feedback
   - Frontend displays encouraging feedback and corrections

3. **User can try again**
   - User clicks "Try Another Image" to start over
   - Process repeats with new random image

## Technical Implementation

### Backend Components
- **SentenceLearningService**: Handles image generation and sentence evaluation
- **SentenceLearningController**: REST API endpoints
- **SentenceLearningRequest/SentenceLearningResponse**: DTOs for data transfer
- **SecurityConfig**: CORS and security configuration

### Frontend Components
- **SentenceLearning.tsx**: Main React component with UI
- **App.tsx**: Routing configuration
- **Dashboard.tsx**: Menu integration

### External APIs Used
- **DALL-E API**: Image generation with kid-friendly prompts
- **Gemini API**: Sentence evaluation and feedback generation

## Kid-Friendly Topics
The system generates images from a predefined list of 20 kid-friendly topics:
- Animals: cat, dog, rabbit, bear, monkey, elephant, tiger, frog, sheep, pig
- Fruits: apple, banana, strawberry, grape, tomato
- Nature: butterfly, bird, sun, rainbow, fish

## Error Handling
- Network errors show user-friendly messages
- API failures are gracefully handled
- Session expiration redirects to login
- Invalid inputs show appropriate validation messages

## Security
- JWT token authentication required
- CORS configured for frontend access
- API keys stored securely in backend
- No sensitive data stored in database

## Usage Instructions
1. Navigate to "Sentence Learning" from the dashboard
2. Click "Generate New Image" to get a random kid-friendly image
3. Look at the image and write a sentence about what you see
4. Click "Submit Sentence" to get feedback
5. Read the feedback and corrected sentence (if any)
6. Click "Try Another Image" to practice with a new image

## Future Enhancements
- Store sentence history and progress
- Add difficulty levels based on child age
- Include more diverse image categories
- Add audio feedback for younger children
- Implement scoring and achievements system 