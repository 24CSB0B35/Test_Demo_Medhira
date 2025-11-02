import Consultation from '../models/Consultation.js';

// Helper to normalize user ID
const normalizeUserId = (user) => {
  return user._id || user.id || user;
};

// @desc    Get all consultations for user
// @route   GET /api/consultations
// @access  Private
export const getConsultations = async (req, res) => {
  try {
    const userId = normalizeUserId(req.user);
    const consultations = await Consultation.find({ user: userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: consultations.length,
      consultations
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching consultations'
    });
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private
export const getConsultation = async (req, res) => {
  try {
    const userId = normalizeUserId(req.user);
    const consultation = await Consultation.findOne({ 
      _id: req.params.id, 
      user: userId 
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      consultation
    });
  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching consultation'
    });
  }
};

// @desc    Create new consultation
// @route   POST /api/consultations
// @access  Private
export const createConsultation = async (req, res) => {
  try {
    console.log('📝 Creating consultation for user:', req.user.id);
    
    const consultationData = {
      ...req.body,
      user: req.user.id
    };

    const consultation = await Consultation.create(consultationData);
    
    console.log('✅ Consultation created in MongoDB:', consultation._id);

    res.status(201).json({
      success: true,
      message: 'Consultation saved successfully',
      consultation
    });
  } catch (error) {
    console.error('❌ Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving consultation'
    });
  }
};

// Update and delete methods remain the same but use normalizeUserId
export const updateConsultation = async (req, res) => {
  try {
    const userId = normalizeUserId(req.user);
    let consultation = await Consultation.findOne({ 
      _id: req.params.id, 
      user: userId 
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      consultation
    });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating consultation'
    });
  }
};

export const deleteConsultation = async (req, res) => {
  try {
    const userId = normalizeUserId(req.user);
    const consultation = await Consultation.findOne({ 
      _id: req.params.id, 
      user: userId 
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    await Consultation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting consultation'
    });
  }
};