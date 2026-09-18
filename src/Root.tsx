import {Composition} from 'remotion';
import {LogoReveal} from './compositions/LogoReveal';
import {BotIntro, BOT_INTRO_DURATION} from './compositions/BotIntro';
import {CtrosIntro, CTROS_INTRO_DURATION} from './compositions/CtrosIntro';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="LogoReveal"
        component={LogoReveal}
        durationInFrames={330}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="BotIntro"
        component={BotIntro}
        durationInFrames={BOT_INTRO_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="CtrosIntro"
        component={CtrosIntro}
        durationInFrames={CTROS_INTRO_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
