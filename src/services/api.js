// ─── Real API (FastAPI backend) ───────────────────────────────────────────────

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or revoked — clear auth state and force re-login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:expired'));
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
};

export const apiLogin = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const apiRegister = (name, email, password) =>
  apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const apiLogout = () =>
  apiFetch('/api/auth/logout', { method: 'POST' });

export const apiGetProfile = () =>
  apiFetch('/api/users/profile');

export const apiUpdateProfile = (data) =>
  apiFetch('/api/users/profile', { method: 'PUT', body: JSON.stringify(data) });

export const apiAnalyzeImage = async (imageFile) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', imageFile);
  const res = await fetch(`${BASE_URL}/api/images/analyze`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Analysis failed');
  }
  return res.json(); // { caption, objects: [{label, confidence, bbox: [x1,y1,x2,y2]}], image_id }
};

export const apiAskQuestion = (imageId, question) =>
  apiFetch('/api/images/ask', { method: 'POST', body: JSON.stringify({ image_id: imageId, question }) });

export const apiGetHistory = () =>
  apiFetch('/api/images/history');

// ─── Mock API (legacy – kept for reference, not used by the UI) ───────────────

export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({
          token: "mock-jwt-token-" + Date.now(),
          user: {
            name: "Alex Johnson",
            email: email,
            memberSince: "2024-01-15",
            plan: "Free"
          }
        });
      } else {
        reject({ message: "Invalid credentials" });
      }
    }, 1200);
  });
};

export const mockRegister = (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password) {
        resolve({
          token: "mock-jwt-token-" + Date.now(),
          user: {
            name: name,
            email: email,
            memberSince: new Date().toISOString().split('T')[0],
            plan: "Free"
          }
        });
      } else {
        reject({ message: "Registration failed - all fields required" });
      }
    }, 1200);
  });
};

export const mockGetProfile = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Alex Johnson",
        email: "alex@example.com",
        memberSince: "2024-01-15",
        plan: "Free",
        preferences: {
          speechRate: 1.0,
          voice: "default",
          highContrast: false,
          fontSize: "medium"
        }
      });
    }, 500);
  });
};

export const mockGetHistory = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          imageName: "living-room.jpg",
          date: "2024-02-15",
          description: "A spacious living room with a beige sofa, wooden coffee table, and large windows allowing natural light. There's a flat-screen TV mounted on the wall and several decorative plants near the window.",
          objects: [
            { label: "Sofa", confidence: 0.98 },
            { label: "Coffee Table", confidence: 0.95 },
            { label: "Television", confidence: 0.92 },
            { label: "Plant", confidence: 0.89 }
          ]
        },
        {
          id: 2,
          imageName: "kitchen-counter.jpg",
          date: "2024-02-14",
          description: "A modern kitchen with white countertops, stainless steel appliances, and organized cooking utensils. The sink is clean and there's a fruit bowl on the counter.",
          objects: [
            { label: "Refrigerator", confidence: 0.96 },
            { label: "Microwave", confidence: 0.93 },
            { label: "Fruit Bowl", confidence: 0.87 }
          ]
        },
        {
          id: 3,
          imageName: "street-view.jpg",
          date: "2024-02-13",
          description: "An outdoor street scene with clear sidewalks, parked cars on the left side, and a pedestrian crossing ahead. The weather appears sunny and clear.",
          objects: [
            { label: "Car", confidence: 0.97 },
            { label: "Traffic Light", confidence: 0.94 },
            { label: "Sidewalk", confidence: 0.91 }
          ]
        }
      ]);
    }, 800);
  });
};

export const mockAnalyzeImage = (imageFile) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        description: "A bright and well-lit room featuring a comfortable seating area. The space includes a modern sectional sofa with gray upholstery, positioned near large windows with white curtains. Natural light floods the room, creating a warm and inviting atmosphere. There's a wooden side table with a lamp, and the hardwood flooring adds a classic touch to the contemporary design.",
        objects: [
          { label: "Sofa", confidence: 0.97, x: 20, y: 40, width: 45, height: 35 },
          { label: "Window", confidence: 0.95, x: 65, y: 10, width: 30, height: 40 },
          { label: "Lamp", confidence: 0.89, x: 15, y: 25, width: 8, height: 15 },
          { label: "Table", confidence: 0.92, x: 12, y: 42, width: 12, height: 18 }
        ],
        suggestedQuestions: [
          "Describe the room",
          "Is the path clear?",
          "How many pieces of furniture?",
          "What's the lighting like?"
        ]
      });
    }, 2500);
  });
};

export const mockAskQuestion = (question) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock responses based on question keywords
      let answer = "Based on the image analysis, ";
      
      if (question.toLowerCase().includes("describe")) {
        answer += "this is a comfortable living space with modern furniture and excellent natural lighting from the windows.";
      } else if (question.toLowerCase().includes("clear") || question.toLowerCase().includes("path")) {
        answer += "the path appears clear with no obstacles blocking the walkway.";
      } else if (question.toLowerCase().includes("many") || question.toLowerCase().includes("count")) {
        answer += "I can see 4 main objects in the scene: a sofa, a window, a lamp, and a table.";
      } else if (question.toLowerCase().includes("light")) {
        answer += "the room has excellent natural lighting coming from the windows, supplemented by a lamp.";
      } else {
        answer += "I can see this is an indoor scene with furniture and good lighting. Please ask me specific questions about the objects, layout, or lighting in the image.";
      }
      
      resolve({ answer });
    }, 1000);
  });
};

export const mockUpdatePreferences = (preferences) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, preferences });
    }, 600);
  });
};
