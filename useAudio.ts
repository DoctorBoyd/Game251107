import { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../sounds/sounds';

const loadSound = async (audioContext: AudioContext, dataUri: string): Promise<AudioBuffer | null> => {
  try {
    const response = await fetch(dataUri);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.warn(`Could not load sound from data URI.`, error);
    return null;
  }
};

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<{ [key: string]: AudioBuffer | null }>({});
  const [isAudioReady, setAudioReady] = useState(false);
  const activeSourcesRef = useRef<{ [key: string]: AudioBufferSourceNode | null }>({});

  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;
        
        const loadedBuffers = await Promise.all(
            Object.entries(sounds).map(([name, uri]) => 
                loadSound(context, uri).then(buffer => ({ name, buffer }))
            )
        );

        loadedBuffers.forEach(({ name, buffer }) => {
            audioBuffersRef.current[name] = buffer;
        });

        setAudioReady(true);
      } catch (e) {
        console.error('Web Audio API is not supported in this browser.');
      }
    };
    initAudio();
    
    return () => {
        audioContextRef.current?.close();
    };
  }, []);

  const playSound = useCallback((name: string, loop: boolean = false, volume: number = 1) => {
    if (!isAudioReady || !audioContextRef.current) return;

    // A/V Autoplay fix: Resume audio context if it's suspended (required by modern browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    const buffer = audioBuffersRef.current[name];
    if (!buffer) return;

    // Stop existing sound if it's playing
    if (activeSourcesRef.current[name]) {
        try {
            activeSourcesRef.current[name]?.stop();
        } catch(e){}
    }
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    source.loop = loop;
    source.start(0);

    if (loop) {
        activeSourcesRef.current[name] = source;
    }

  }, [isAudioReady]);

  const stopSound = useCallback((name: string) => {
    if (activeSourcesRef.current[name]) {
        try {
            activeSourcesRef.current[name]?.stop();
            activeSourcesRef.current[name] = null;
        } catch(e){}
    }
  }, []);

  return { playSound, stopSound, isAudioReady };
};