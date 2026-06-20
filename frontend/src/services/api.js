const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const checkApiHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { status: 'unhealthy' };
    return await res.json();
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'offline' };
  }
};

export const findScholarships = async (formData) => {
  const payload = {
    category: formData.category,
    income_bracket: formData.income_bracket,
    state: formData.state,
    edu_level: formData.edu_level,
    score: parseFloat(formData.score),
    score_type: formData.score_type // "percentage" or "cgpa"
  };

  const response = await fetch(`${API_BASE_URL}/api/v1/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Server returned an error');
  }

  return await response.json();
};
