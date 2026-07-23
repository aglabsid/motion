import {Composition} from 'remotion';
import {LogoReveal} from './LogoReveal';

export const Root: React.FC = () => {
  return (
    <Composition
      id="LogoReveal"
      component={LogoReveal}
      durationInFrames={330}
      fps={60}
      width={1080}
      height={1920}
    />
  );
};
