FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    ffmpeg \
    cmake \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Clone whisper.cpp
RUN git clone https://github.com/ggml-org/whisper.cpp.git /app
WORKDIR /app

# Build whisper server
RUN mkdir build && cd build && \
    cmake .. -DWHISPER_BUILD_SERVER=ON && \
    make -j4

# Copy your model EXACTLY as named
COPY models/ggml-small.bin /app/models/ggml-small.bin

EXPOSE 9001

CMD ["./build/bin/whisper-server", \
     "-m", "models/ggml-small.bin",\
     "-l", "en",\
     "--host", "0.0.0.0",\
     "--port", "9001",\
     "-t", "4"]

