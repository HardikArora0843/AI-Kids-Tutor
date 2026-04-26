import { useState, useCallback, useRef, useEffect } from "react";
import {
  processEvent,
  speakMessage,
  stopSpeaking,
  MENTOR_STATES,
  MENTOR_CHARACTERS,
  MENTOR_EVENTS,
} from "./MentorController";
import useTranslation from "../../utils/useTranslation";

const BUBBLE_DURATION = 4000;
const CELEBRATION_DURATION = 2500;

const useMentor = (defaultCharacter = "robot") => {
  const { t, currentLanguage } = useTranslation();
  const [state, setState] = useState(MENTOR_STATES.idle);
  const [message, setMessage] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [character, setCharacter] = useState(
    MENTOR_CHARACTERS[defaultCharacter] || MENTOR_CHARACTERS.robot
  );
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const bubbleTimerRef = useRef(null);
  const stateTimerRef = useRef(null);

  // Stop speech, hide bubble, and reset state when the UI language changes so
  // dialogue and TTS stay aligned (avoids English voice + Hindi bubble, etc.).
  useEffect(() => {
    stopSpeaking();
    if (bubbleTimerRef.current) {
      clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    if (stateTimerRef.current) {
      clearTimeout(stateTimerRef.current);
      stateTimerRef.current = null;
    }
    setShowBubble(false);
    setMessage("");
    setState(MENTOR_STATES.idle);
  }, [currentLanguage]);

  const triggerEvent = useCallback(
    (event, context = {}) => {
      const response = processEvent(event, context, t("mentor"));

      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);

      setState(response.state);
      setMessage(response.message);
      setShowBubble(true);

      if (speechEnabled) {
        speakMessage(response.message, currentLanguage);
      }

      bubbleTimerRef.current = setTimeout(() => {
        setShowBubble(false);
      }, BUBBLE_DURATION);

      if (
        response.state === MENTOR_STATES.celebrating ||
        response.state === MENTOR_STATES.happy
      ) {
        stateTimerRef.current = setTimeout(() => {
          setState(MENTOR_STATES.idle);
        }, CELEBRATION_DURATION);
      }
    },
    [currentLanguage, speechEnabled, t]
  );

  const greet = useCallback(() => triggerEvent(MENTOR_EVENTS.GREETING), [triggerEvent]);
  const onCorrect = useCallback(() => triggerEvent(MENTOR_EVENTS.CORRECT_ANSWER), [triggerEvent]);
  const onWrong = useCallback(() => triggerEvent(MENTOR_EVENTS.WRONG_ANSWER), [triggerEvent]);
  const onStart = useCallback(() => triggerEvent(MENTOR_EVENTS.START_ACTIVITY), [triggerEvent]);
  const onComplete = useCallback(() => triggerEvent(MENTOR_EVENTS.LEVEL_COMPLETE), [triggerEvent]);
  const onHint = useCallback(() => triggerEvent(MENTOR_EVENTS.HINT), [triggerEvent]);

  const selectCharacter = useCallback((charId) => {
    const char = MENTOR_CHARACTERS[charId];
    if (char) setCharacter(char);
  }, []);

  const toggleSpeech = useCallback(() => {
    setSpeechEnabled((prev) => {
      if (prev) stopSpeaking();
      return !prev;
    });
  }, []);

  return {
    state,
    message,
    showBubble,
    character,
    speechEnabled,
    triggerEvent,
    greet,
    onCorrect,
    onWrong,
    onStart,
    onComplete,
    onHint,
    selectCharacter,
    toggleSpeech,
  };
};

export default useMentor;
