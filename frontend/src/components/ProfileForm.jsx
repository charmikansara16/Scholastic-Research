import React, { useState } from 'react';
import { HelpCircle, Search, Percent } from 'lucide-react';

const CATEGORIES = ["General", "SC", "ST", "OBC", "EWS", "Minority", "PWD"];

const INCOME_BRACKETS = [
  { value: "<1L", label: "Below ₹1 Lakh" },
  { value: "1-2.5L", label: "₹1 Lakh – ₹2.5 Lakhs" },
  { value: "2.5-4.5L", label: "₹2.5 Lakhs – ₹4.5 Lakhs" },
  { value: "4.5-6L", label: "₹4.5 Lakhs – ₹6 Lakhs" },
  { value: "6-8L", label: "₹6 Lakhs – ₹8 Lakhs" },
  { value: ">8L", label: "Above ₹8 Lakhs" }
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const EDU_LEVELS = [
  { value: "Pre-Matric", label: "Class 9–10 (Pre-Matric)" },
  { value: "Post-Matric", label: "Class 11–12 (Post-Matric)" },
  { value: "Diploma", label: "Diploma / Polytechnic" },
  { value: "UG", label: "Undergraduate (UG)" },
  { value: "PG", label: "Postgraduate (PG)" },
  { value: "PhD", label: "PhD / Doctorate" }
];

export default function ProfileForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    category: '',
    income_bracket: '',
    state: '',
    edu_level: '',
    score: '',
    score_type: 'percentage'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleToggleScoreType = (type) => {
    setFormData(prev => ({
      ...prev,
      score_type: type,
      score: '' // reset score input on toggle
    }));
    setErrors(prev => {
      const next = { ...prev };
      delete next.score;
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Required';
    if (!formData.income_bracket) newErrors.income_bracket = 'Required';
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.edu_level) newErrors.edu_level = 'Required';
    
    const val = parseFloat(formData.score);
    if (isNaN(val)) {
      newErrors.score = 'Required';
    } else if (formData.score_type === 'cgpa' && (val < 0 || val > 10)) {
      newErrors.score = 'CGPA must be 0–10';
    } else if (formData.score_type === 'percentage' && (val < 0 || val > 100)) {
      newErrors.score = 'Percentage must be 0–100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8 max-w-lg mx-auto border border-white/5 shadow-glass animate-fade-in">
      <h2 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
        <span>Student Profile Details</span>
        <HelpCircle className="w-4 h-4 text-gray-500 cursor-pointer hover:text-brand-saffron transition-colors" title="All information is processed temporarily and not stored." />
      </h2>

      <div className="flex flex-col gap-5">
        
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">Category / Caste Classification</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`glass-input ${errors.category ? 'border-red-500/50 focus:border-red-500' : ''}`}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="text-xs text-red-400 mt-1">{errors.category}</span>}
        </div>

        {/* Income */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">Annual Family Income (INR)</label>
          <select
            name="income_bracket"
            value={formData.income_bracket}
            onChange={handleChange}
            className={`glass-input ${errors.income_bracket ? 'border-red-500/50 focus:border-red-500' : ''}`}
          >
            <option value="">Select Income Bracket</option>
            {INCOME_BRACKETS.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <span className="text-[10px] text-gray-500">Must match your active income certificate limit.</span>
          {errors.income_bracket && <span className="text-xs text-red-400 mt-1">{errors.income_bracket}</span>}
        </div>

        {/* Domicile State */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">Domicile State / UT</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`glass-input ${errors.state ? 'border-red-500/50 focus:border-red-500' : ''}`}
          >
            <option value="">Select State</option>
            {STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <span className="text-xs text-red-400 mt-1">{errors.state}</span>}
        </div>

        {/* Education Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-300">Current Education Level</label>
          <select
            name="edu_level"
            value={formData.edu_level}
            onChange={handleChange}
            className={`glass-input ${errors.edu_level ? 'border-red-500/50 focus:border-red-500' : ''}`}
          >
            <option value="">Select Education Level</option>
            {EDU_LEVELS.map(el => (
              <option key={el.value} value={el.value}>{el.label}</option>
            ))}
          </select>
          {errors.edu_level && <span className="text-xs text-red-400 mt-1">{errors.edu_level}</span>}
        </div>

        {/* Academic Performance (Score) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-300">Academic Score (Previous Class)</label>
            {/* Toggle */}
            <div className="flex bg-brand-dark-base border border-brand-dark-border p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => handleToggleScoreType('percentage')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${formData.score_type === 'percentage' ? 'bg-brand-saffron text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => handleToggleScoreType('cgpa')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${formData.score_type === 'cgpa' ? 'bg-brand-saffron text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                CGPA
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              step="0.01"
              name="score"
              value={formData.score}
              onChange={handleChange}
              placeholder={formData.score_type === 'percentage' ? 'e.g. 78.50' : 'e.g. 8.40'}
              className={`glass-input w-full pr-10 ${errors.score ? 'border-red-500/50 focus:border-red-500' : ''}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {formData.score_type === 'percentage' ? '%' : 'CGPA'}
            </div>
          </div>
          {errors.score && <span className="text-xs text-red-400 mt-1">{errors.score}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-brand-saffron-dark via-brand-saffron to-brand-saffron-light hover:brightness-110 active:scale-[0.98] text-white py-4 rounded-xl font-bold transition-all shadow-glass flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Searching Scholarships...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Find My Scholarships</span>
            </>
          )}
        </button>

      </div>
    </form>
  );
}
