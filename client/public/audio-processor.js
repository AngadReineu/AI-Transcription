// public/audio-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const samples = input[0]; // Float32Array
    // convert to Int16 PCM
    const pcm = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      pcm[i] = Math.round(s * 32767);
    }

    // Transfer the underlying ArrayBuffer to main thread
    this.port.postMessage(pcm.buffer, [pcm.buffer]);
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
