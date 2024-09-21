import mongoose from "mongoose";

const DFSchema = new mongoose.Schema(
  {
    bRunState: { type: Boolean, default: false }, // true -> DF, false -> Stop
    bWideband: { type: Boolean, default: false }, // true -> Wideband, false -> Narrowband
    dFrequencyRF: { type: Number, required: true }, // RF Frequency
    dFrequencyStartScan: { type: Number, required: true }, // Start frequency of the scan
    dFrequencyStopScan: { type: Number, required: true }, // Stop frequency of the scan
    dBandwidthIF: { type: Number, required: true }, // Intermediate Frequency Bandwidth in MHz
    dBandwidthDF: { type: Number, required: true }, // DF Bandwidth
    bNormalModeDF: { type: Boolean, default: false }, // true -> Normal, false -> Continues
    bNormalModeDFMode: {
      type: String,
      enum: ["Normal", "Continues"],
      default: "Normal",
    }, // ModeDF enum
    dThresholdLevelDF: { type: Number }, // DF Threshold Level
    dThresholdQualityDF: { type: Number }, // DF Threshold Quality
    iAverageTimeDF: { type: Number }, // Average time in milliseconds
    bPreAmplifierRF: { type: Boolean, default: false }, // Pre-Amplifier RF status
    bPreAmplifierRFMode: { type: String, enum: ["OFF", "ON"], default: "OFF" }, // PreAmplifierRF enum
    bLongAntennaRF: { type: Boolean, default: false }, // Antenna RF status
    bLongAntennaRFMode: {
      type: String,
      enum: ["Short", "Long"],
      default: "Short",
    }, // AntennaRF enum
    iTunerModeRF: { type: Number }, // Tuner Mode RF
    iGainRF: { type: Number }, // Gain for RF
    bAutoGainIF: { type: String, enum: ["MGC", "AGC"], default: "MGC" }, // GainIF enum
    iManualGainIF: { type: Number }, // Manual Gain in dBm
    iAutoGainCtrlTime: { type: Number }, // Auto Gain Control time in milliseconds
    dMaxGainAgc: { type: Number }, // Max gain for AGC in dBm
    bAFC: { type: Boolean, default: false }, // AFC status
    bAFCMode: { type: String, enum: ["ON", "OFF"], default: "OFF" }, // AFC enum
    bVoiceState: { type: Boolean, default: false }, // Voice state
    bSquelchState: { type: Boolean, default: false }, // Squelch state
    bStateDenoising: { type: Boolean, default: false }, // Denoising state
    strDemodulation: { type: String, default: "AM" }, // Demodulation type (AM, FM, etc.)
    dBandwidthVoice: { type: Number }, // Voice bandwidth in KHz
    iBeatFreqOffset: { type: Number }, // Beat frequency offset in Hz
    dGainVoice: { type: Number }, // Gain for voice in dBm
    bClassifier: { type: Boolean, default: false }, // Classifier state
    iTimeHistoryCL: { type: Number }, // Time history for classifier in milliseconds
  },
  { timestamps: true },
);

const DF = mongoose.model("DF", DFSchema);
module.exports = DF;
