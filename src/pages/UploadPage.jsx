import React, { useState, useRef, useEffect } from 'react';
import { apiAnalyzeImage, apiAskQuestion } from '../services/api';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 1, height: 1 });
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState(null);
  const [speaking, setSpeaking] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const DEFAULT_SUGGESTED_QUESTIONS = [
    'Describe the scene',
    'Is the path clear?',
    'How many objects are there?',
    'What is the lighting like?',
  ];

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
      setAnswer(null);
      setImageId(null);
      setError(null);
      setAnswerError(null);
      setShowWebcam(false);
    } else {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChooseFile();
    }
  };

  const handleWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
      setShowWebcam(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError('Unable to access webcam. Please check permissions.');
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        handleFileSelect(file);

        // Stop webcam
        if (webcamStream) {
          webcamStream.getTracks().forEach(track => track.stop());
          setWebcamStream(null);
        }
        setShowWebcam(false);
      }, 'image/jpeg');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError(null);
    try {
      const data = await apiAnalyzeImage(selectedFile);
      setImageId(data.image_id);
      setResults({
        description: data.caption,
        objects: data.objects || [],
        suggestedQuestions: data.suggested_questions || DEFAULT_SUGGESTED_QUESTIONS,
      });
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAskQuestion = async (e, suggestedQuestion = null) => {
    if (e) e.preventDefault();

    const questionText = suggestedQuestion || question;
    if (!questionText.trim() || !imageId) return;

    setLoadingAnswer(true);
    setAnswerError(null);
    try {
      const response = await apiAskQuestion(imageId, questionText);
      setAnswer(response.answer);
      if (!suggestedQuestion) {
        setQuestion('');
      }
    } catch (err) {
      setAnswerError(err.message || 'Failed to get answer. Please try again.');
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleSpeak = (text, id) => {
    window.speechSynthesis.cancel();

    if (speaking === id) {
      setSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);

    setSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <main role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-8">
          Image Upload & Analysis
        </h1>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4" role="alert">
            {error}
          </div>
        )}

        {/* Upload Section */}
        {!selectedFile && !showWebcam && (
          <section className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mb-8" aria-labelledby="upload-heading">
            <h2 id="upload-heading" className="text-xl font-semibold text-white mb-4">
              Upload an Image
            </h2>

            {/* Drag and Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-400/5'
                  : 'border-dark-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyPress={handleKeyPress}
              aria-label="Drop image here or press Enter to choose file"
            >
              <div className="text-6xl mb-4" aria-hidden="true">📁</div>
              <p className="text-lg text-gray-300 mb-2">
                Drag and drop your image here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports JPEG, PNG, and WebP formats
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="sr-only"
                aria-label="Choose image file"
              />

              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={handleChooseFile}
                  className="px-6 py-2 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-800"
                  aria-label="Choose file from device"
                >
                  Choose File
                </button>

                <button
                  onClick={handleWebcam}
                  className="px-6 py-2 border border-dark-600 text-gray-300 rounded-xl hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-dark-800"
                  aria-label="Use webcam to capture image"
                >
                  Use Webcam
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Webcam Section */}
        {showWebcam && (
          <section className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Webcam Capture</h2>
            <div className="flex flex-col items-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-2xl rounded-2xl mb-4"
                aria-label="Webcam preview"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-4">
                <button
                  onClick={captureSnapshot}
                  className="px-6 py-2 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Capture snapshot from webcam"
                >
                  Capture Photo
                </button>
                <button
                  onClick={() => {
                    if (webcamStream) {
                      webcamStream.getTracks().forEach(track => track.stop());
                      setWebcamStream(null);
                    }
                    setShowWebcam(false);
                  }}
                  className="px-6 py-2 border border-dark-600 text-gray-300 rounded-xl hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Cancel webcam"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Preview and Analyze */}
        {selectedFile && !results && (
          <section className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
            <div className="flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Preview of selected file"
                className="max-w-full max-h-96 rounded-2xl mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-8 py-3 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={analyzing ? 'Analyzing image...' : 'Start image analysis'}
                >
                  {analyzing ? (
                    <>
                      <span className="sr-only">Analyzing...</span>
                      <span aria-hidden="true">Analyzing...</span>
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-6 py-3 border border-dark-600 text-gray-300 rounded-xl hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Choose different image"
                >
                  Choose Different Image
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {results && (
          <>
            {/* Scene Description */}
            <section className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mb-8" aria-labelledby="description-heading">
              <div className="flex justify-between items-start mb-4">
                <h2 id="description-heading" className="text-xl font-semibold text-white">
                  Scene Description
                </h2>
                <button
                  onClick={() => handleSpeak(results.description, 'description')}
                  className="px-4 py-2 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label={speaking === 'description' ? 'Stop reading description' : 'Read description aloud'}
                  aria-pressed={speaking === 'description'}
                >
                  🔊 {speaking === 'description' ? 'Stop' : 'Play'}
                </button>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {results.description}
              </p>
            </section>

            {/* Objects Detected */}
            <section className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mb-8" aria-labelledby="objects-heading">
              <h2 id="objects-heading" className="text-xl font-semibold text-white mb-4">
                Objects Detected
              </h2>
              <div className="relative inline-block max-w-full">
                <img
                  src={previewUrl}
                  alt="Analyzed with object detection overlay"
                  className="max-w-full rounded-2xl block"
                  onLoad={(e) => setImgNaturalSize({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
                />
                {results.objects.map((obj, idx) => {
                  const bbox = obj.bbox;
                  if (!bbox || bbox.length < 4) return null;
                  const left = (bbox[0] / imgNaturalSize.width) * 100;
                  const top = (bbox[1] / imgNaturalSize.height) * 100;
                  const width = ((bbox[2] - bbox[0]) / imgNaturalSize.width) * 100;
                  const height = ((bbox[3] - bbox[1]) / imgNaturalSize.height) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute border-2 border-green-500 bg-green-500 bg-opacity-20"
                      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                      role="img"
                      aria-label={`${obj.label} detected with ${Math.round(obj.confidence * 100)}% confidence`}
                    >
                      <span className="absolute -top-6 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded whitespace-nowrap">
                        {obj.label} ({Math.round(obj.confidence * 100)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {results.objects.map((obj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-dark-700 text-cyan-400 border border-dark-600"
                  >
                    {obj.label} ({Math.round(obj.confidence * 100)}%)
                  </span>
                ))}
              </div>
            </section>

            {/* Visual Q&A Section */}
            <section className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mb-8" aria-labelledby="qa-heading">
              <h2 id="qa-heading" className="text-xl font-semibold text-white mb-4">
                Ask Questions About This Image
              </h2>

              {/* Suggested Questions */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {results.suggestedQuestions.map((sq, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleAskQuestion(e, sq)}
                      disabled={loadingAnswer}
                      className="px-2.5 py-1 text-xs rounded-full bg-dark-700 text-cyan-400 border border-dark-600 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                      aria-label={`Ask: ${sq}`}
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Input */}
              <form onSubmit={handleAskQuestion} className="mb-4">
                <label htmlFor="question-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Or type your own question:
                </label>
                <div className="flex gap-2">
                  <input
                    id="question-input"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to know about this image?"
                    className="flex-1 px-4 py-2 bg-dark-700 border border-dark-600 text-gray-300 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label="Type your question about the image"
                  />
                  <button
                    type="submit"
                    disabled={loadingAnswer || !question.trim()}
                    className="px-6 py-2 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Submit question"
                  >
                    {loadingAnswer ? 'Asking...' : 'Ask'}
                  </button>
                </div>
              </form>

              {answerError && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4" role="alert">
                  {answerError}
                </div>
              )}

              {/* Answer */}
              {answer && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-4" role="region" aria-live="polite">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-green-400">Answer:</h3>
                    <button
                      onClick={() => handleSpeak(answer, 'answer')}
                      className="px-3 py-1 bg-cyan-400 text-dark-900 font-bold rounded-xl text-sm hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      aria-label={speaking === 'answer' ? 'Stop reading answer' : 'Read answer aloud'}
                      aria-pressed={speaking === 'answer'}
                    >
                      🔊 {speaking === 'answer' ? 'Stop' : 'Play'}
                    </button>
                  </div>
                  <p className="text-green-400">{answer}</p>
                </div>
              )}
            </section>

            {/* New Analysis Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setResults(null);
                  setAnswer(null);
                  setImageId(null);
                  setError(null);
                  setAnswerError(null);
                  setQuestion('');
                }}
                className="px-8 py-3 bg-cyan-400 text-dark-900 font-bold rounded-xl hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Start new analysis"
              >
                New Analysis
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UploadPage;
