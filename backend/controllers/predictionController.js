const axios = require('axios');

const safeNum = (val, def = 0) => {
  const num = Number(val);
  return isNaN(num) ? def : num;
};

exports.predictStudentPerformance = async (req, res) => {
  try {
    const {
      math, english, computer, physics, chemistry, biology,
      attendance_rate, study_hours, parent_support, free_time, go_out,
      internet_access, extracurricular, part_time_job, ses_quartile,
    } = req.body;

    // attendance_rate: accept 0-1 or 0-100; normalize to 0-100 for ML API
    const rawAtt   = safeNum(attendance_rate, 90);
    const attForML = rawAtt <= 1 ? rawAtt * 100 : rawAtt;

    const mlBody = {
      math:            safeNum(math,            75),
      english:         safeNum(english,         75),
      computer:        safeNum(computer,        75),
      physics:         safeNum(physics,         75),
      chemistry:       safeNum(chemistry,       75),
      biology:         safeNum(biology,         75),
      attendance_rate: attForML,
      study_hours:     safeNum(study_hours,     5),
      parent_support:  safeNum(parent_support,  3),
      free_time:       safeNum(free_time,       3),
      go_out:          safeNum(go_out,          2),
      internet_access: safeNum(internet_access, 1),
      extracurricular: safeNum(extracurricular, 0),
      part_time_job:   safeNum(part_time_job,   0),
      ses_quartile:    safeNum(ses_quartile,    2),
    };

    let ML_API_URL = (process.env.ML_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
    if (!ML_API_URL.endsWith('/predict')) {
      ML_API_URL = ML_API_URL + '/predict';
    }

    console.log('🤖 [predictionController] Sending to ML API:', ML_API_URL);

    const response = await axios.post(ML_API_URL, mlBody);

    return res.status(200).json({ 
      success: true, 
      prediction: response.data 
    });

  } catch (error) {
    console.error('❌ [predictionController] Error:', error.message);
    const status  = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data?.detail || error.message : 'Internal server error connecting to ML API';
    return res.status(status).json({ success: false, message });
  }
};


