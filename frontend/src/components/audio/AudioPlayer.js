import React from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { theme } from '../../theme';
import { useAudio } from '../../contexts/AudioContext';
import Button from '../common/Button';

const PlayerContainer = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  margin: ${theme.spacing[6]} 0;
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[4]};
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h3`
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  margin: 0 0 ${theme.spacing[1]};
`;

const TrackArtist = styled.p`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const PlayButton = styled(Button)`
  min-width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.sizes.xl};
`;

const ProgressContainer = styled.div`
  margin: ${theme.spacing[4]} 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  margin-bottom: ${theme.spacing[2]};
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${theme.colors.primary[500]};
  border-radius: 3px;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const ProgressHandle = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.progress}%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: ${theme.colors.primary[500]};
  border-radius: 50%;
  cursor: pointer;
  transition: left 0.1s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: ${theme.colors.primary[500]};
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${theme.colors.primary[500]};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  text-align: center;
  padding: ${theme.spacing[2]};
  background: rgba(239, 68, 68, 0.1);
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing[2]};
`;

const LoadingMessage = styled.div`
  color: ${theme.colors.primary[400]};
  font-size: ${theme.typography.sizes.sm};
  text-align: center;
  padding: ${theme.spacing[2]};
`;

const AudioPlayer = ({ product }) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    error,
    duration,
    currentTime,
    volume,
    playTrack,
    pauseTrack,
    seekTo,
    setVolumeLevel,
    formatTime,
    isCurrentTrack,
    isTrackPlaying
  } = useAudio();

  const isCurrentProduct = isCurrentTrack(product?.id);
  const isPlayingThis = isTrackPlaying(product?.id);

  const handlePlayPause = () => {
    if (isCurrentProduct) {
      if (isPlayingThis) {
        pauseTrack();
      } else {
        playTrack(product);
      }
    } else {
      playTrack(product);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    setVolumeLevel(parseFloat(e.target.value));
  };

  if (!product?.preview_audio_url) {
    return (
      <PlayerContainer>
        <ErrorMessage>
          No preview audio available for this product
        </ErrorMessage>
      </PlayerContainer>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContainer>
      <PlayerHeader>
        <TrackInfo>
          <TrackTitle>{product.title}</TrackTitle>
          <TrackArtist>by {product.artist}</TrackArtist>
        </TrackInfo>
        
        <PlayerControls>
          <PlayButton
            variant="primary"
            onClick={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : isPlayingThis ? (
              <FiPause />
            ) : (
              <FiPlay />
            )}
          </PlayButton>
          
          <VolumeContainer>
            {volume > 0 ? <FiVolume2 size={16} /> : <FiVolumeX size={16} />}
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </VolumeContainer>
        </PlayerControls>
      </PlayerHeader>

      <ProgressContainer>
        <ProgressBar onClick={handleSeek}>
          <ProgressFill progress={progress} />
          <ProgressHandle progress={progress} />
        </ProgressBar>
        <TimeDisplay>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </TimeDisplay>
      </ProgressContainer>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {isLoading && !error && (
        <LoadingMessage>
          Loading preview...
        </LoadingMessage>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </PlayerContainer>
  );
};

export default AudioPlayer;
